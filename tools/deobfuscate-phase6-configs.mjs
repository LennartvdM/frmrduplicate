/**
 * Phase 6 deobfuscation — config variable renaming
 *
 * Handles the remaining obfuscated module-level variables:
 *
 * A. Transition/spring config aliases: `var jt = TWEEN_MEDIUM` → inline to TWEEN_MEDIUM
 * B. Module-level utilities: $r → scrollSnapStyle, Ir → withScrollSnap, ea → fxMotionDiv
 * C. Per-component config vars: detected by usage pattern in useComponentVariantState,
 *    withCSS calls, and prop resolver shape → renamed with component prefix
 *
 * Uses acorn AST + scope-aware renaming.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as acorn from "acorn";

const SRC_DIR = "src";
const FILES = [
  "page--home.mjs",
  "page--neoflix.mjs",
  "page--Publications.mjs",
];

// ── Known constants that get locally aliased ──────────────────────
const KNOWN_CONSTANTS = new Set([
  "SPRING_STANDARD", "SPRING_HEAVY", "SPRING_CAPTION",
  "EASE_STANDARD", "EASE_LINEAR",
  "TWEEN_INSTANT", "TWEEN_MEDIUM", "TWEEN_LONG", "TWEEN_CYCLE",
  "TWEEN_SLOW", "TWEEN_QUICK", "TWEEN_APPEAR",
  "CYCLE_INTERVAL_MS",
  "BASE_VIDEO_PROPS", "VIDEO_PROPS_FLAT", "VIDEO_PROPS_ROUNDED",
  "CSS_ASPECT_RATIO_SUPPORT",
]);

// ── AST utilities ────────────────────────────────────────────────

function walk(node, visitor, parent = null, parentKey = null) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) walk(node[i], visitor, parent, parentKey);
    return;
  }
  if (!node.type) return;
  visitor(node, parent, parentKey);
  for (const key of Object.keys(node)) {
    if (key === "type" || key === "start" || key === "end" || key === "loc" || key === "range") continue;
    const child = node[key];
    if (child && typeof child === "object") walk(child, visitor, node, key);
  }
}

function isReference(node, parent, parentKey) {
  if (node.type !== "Identifier") return false;
  if (parent?.type === "Property" && parentKey === "key" && !parent.computed) return parent.shorthand;
  if (parent?.type === "MemberExpression" && parentKey === "property" && !parent.computed) return false;
  if (parent?.type === "LabeledStatement" && parentKey === "label") return false;
  if ((parent?.type === "BreakStatement" || parent?.type === "ContinueStatement") && parentKey === "label") return false;
  if (parent?.type === "MethodDefinition" && parentKey === "key" && !parent.computed) return false;
  if (parent?.type === "ImportSpecifier" && parentKey === "imported") return false;
  if (parent?.type === "ExportSpecifier" && parentKey === "exported") return false;
  return true;
}

// ── Component block detection ─────────────────────────────────────

/**
 * Build a map of component names to their variable scopes.
 * A component block starts after the previous component's loadFonts() call
 * and ends at the forwardRef() call for the component.
 *
 * Returns Map<componentName, { startLine, endLine }>
 */
function findComponentBlocks(ast, code) {
  const components = []; // { name, forwardRefStart, withCSSEnd }

  // Find _ComponentName = forwardRef(...)
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (!node.id?.name?.startsWith("_")) return;
    if (node.init?.type !== "CallExpression") return;
    if (node.init.callee?.name !== "forwardRef") return;

    components.push({
      name: node.id.name.slice(1), // remove leading _
      forwardRefStart: node.start,
      forwardRefEnd: node.end,
    });
  });

  return components;
}

// ── Pattern A: Constant alias detection ───────────────────────────

function findConstantAliases(ast) {
  const aliases = new Map();

  for (const node of ast.body) {
    if (node.type !== "VariableDeclaration") continue;
    for (const decl of node.declarations) {
      if (
        decl.id?.type === "Identifier" &&
        decl.init?.type === "Identifier" &&
        KNOWN_CONSTANTS.has(decl.init.name)
      ) {
        aliases.set(decl.id.name, decl.init.name);
      }
    }
  }

  return aliases;
}

// ── Pattern B: Per-component config detection ─────────────────────

/**
 * Find per-component config variables by tracing useComponentVariantState calls.
 *
 * useComponentVariantState({
 *   cycleOrder: Ya,
 *   defaultVariant: "...",
 *   variant: variant,
 *   variantClassNames: Nt,
 * })
 *
 * Returns Map<varName, { role, componentName }>
 */
function findComponentConfigs(ast, code) {
  const configs = new Map(); // varName → newName
  const components = findComponentBlocks(ast, code);

  // Find useComponentVariantState calls and extract their arguments
  walk(ast, (node) => {
    if (node.type !== "CallExpression") return;
    if (node.callee?.name !== "useComponentVariantState") return;
    if (!node.arguments[0] || node.arguments[0].type !== "ObjectExpression") return;

    const obj = node.arguments[0];

    // Determine which component this is in (by position)
    let componentName = null;
    for (const comp of components) {
      if (node.start >= comp.forwardRefStart && node.start <= comp.forwardRefEnd) {
        componentName = comp.name;
        break;
      }
    }
    if (!componentName) return;

    for (const prop of obj.properties) {
      if (prop.type !== "Property" || prop.key?.type !== "Identifier") continue;

      const role = prop.key.name;
      if (prop.value?.type === "Identifier") {
        const varName = prop.value.name;
        if (role === "cycleOrder") {
          configs.set(varName, `${componentName}_cycleOrder`);
        } else if (role === "variantClassNames") {
          configs.set(varName, `${componentName}_variantClassNames`);
        }
      }
    }
  });

  // Find withCSS calls: withCSS(_Component, cssArray, "prefix")
  walk(ast, (node) => {
    if (node.type !== "CallExpression") return;
    if (node.callee?.name !== "withCSS") return;
    if (node.arguments.length < 3) return;

    const innerName = node.arguments[0]?.name;
    const cssArrayName = node.arguments[1]?.name;
    const prefix = node.arguments[2]?.value;

    if (innerName?.startsWith("_") && cssArrayName) {
      const componentName = innerName.slice(1);
      configs.set(cssArrayName, `${componentName}_css`);
    }
  });

  // Find prop resolver functions — pattern: used as `ResolverVar(props)` right after destructure
  // The resolver is called like: `{ style, className, ... } = Za(props)`
  // We detect: CallExpression where callee is Identifier and argument is `props` Identifier,
  // inside a forwardRef function, as part of destructuring
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "ObjectPattern") return;
    if (node.init?.type !== "CallExpression") return;
    if (node.init.callee?.type !== "Identifier") return;
    if (node.init.arguments.length !== 1) return;
    if (node.init.arguments[0]?.name !== "props") return;

    const resolverName = node.init.callee.name;

    // Check destructured properties to confirm it's a variant resolver
    const props = node.id.properties.map(p => p.key?.name).filter(Boolean);
    if (props.includes("variant") && props.includes("style")) {
      // Find which component this is in
      const components2 = findComponentBlocks(ast, "");
      for (const comp of components2) {
        if (node.start >= comp.forwardRefStart && node.start <= comp.forwardRefEnd) {
          configs.set(resolverName, `resolve${comp.name}Props`);
          break;
        }
      }
    }
  });

  // Find computeLayoutKey functions — pattern: called as `h = Fn(props, variants)`
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.init?.type !== "CallExpression") return;
    if (node.init.callee?.type !== "Identifier") return;
    if (node.init.arguments.length !== 2) return;
    if (node.init.arguments[0]?.name !== "props") return;
    if (node.init.arguments[1]?.name !== "variants") return;

    const fnName = node.init.callee.name;
    const components2 = findComponentBlocks(ast, "");
    for (const comp of components2) {
      if (node.start >= comp.forwardRefStart && node.start <= comp.forwardRefEnd) {
        configs.set(fnName, `${comp.name}_layoutKey`);
        break;
      }
    }
  });

  // Find variantNames maps — pattern: object used in the resolver,
  // where keys are human-readable and values are framer IDs
  // These are passed to the resolver function. Since the resolver captures them
  // via closure, we detect them by structure: object where all keys are Title Case
  // and all values are framer-style IDs.
  // Actually, easier: the resolver function references them. Let's find them by
  // looking at objects with human-readable keys that map to the cycle order IDs.
  // Skip for now — the usage pattern in the resolver makes these clear enough.

  // Find framePrefix strings — pattern: string matching "framer-XXXXX" used in cx() calls
  // These are also the 3rd arg to withCSS, so they're implicit. Skip.

  return configs;
}

// ── Pattern C: Module-level utility renaming ──────────────────────

function findModuleUtilities(ast, code) {
  const renames = new Map();

  for (const node of ast.body) {
    if (node.type !== "VariableDeclaration") continue;
    for (const decl of node.declarations) {
      if (!decl.id?.name || !decl.init) continue;

      // scrollSnapStyle: { scrollSnapAlign: "start", ... }
      if (
        decl.init.type === "ObjectExpression" &&
        decl.init.properties.some(p =>
          p.key?.name === "scrollSnapAlign" || p.key?.value === "scrollSnapAlign"
        )
      ) {
        renames.set(decl.id.name, "scrollSnapStyle");
        continue;
      }

      // withScrollSnap: (t) => (a) => jsx(t, { ...a, style: scrollSnapStyle })
      if (
        decl.init.type === "ArrowFunctionExpression" &&
        decl.init.body?.type === "ArrowFunctionExpression" &&
        decl.init.body.body?.type === "CallExpression" &&
        decl.init.body.body.callee?.name === "jsx"
      ) {
        const args = decl.init.body.body.arguments;
        if (args?.length >= 2) {
          const spreadProps = args[1];
          if (spreadProps?.type === "ObjectExpression" &&
            spreadProps.properties.some(p => p.key?.name === "style")) {
            renames.set(decl.id.name, "withScrollSnap");
            continue;
          }
        }
      }

      // withFXWrapper(motion.div) → fxMotionDiv
      if (
        decl.init.type === "CallExpression" &&
        decl.init.callee?.name === "withFXWrapper"
      ) {
        const arg = decl.init.arguments?.[0];
        if (arg?.type === "MemberExpression" &&
          arg.object?.name === "motion" &&
          arg.property?.name === "div") {
          renames.set(decl.id.name, "FXDiv");
        }
      }

      // scheduleAppearAnimation(withFXWrapper(motion.a)) → FXLink
      if (
        decl.init.type === "CallExpression" &&
        decl.init.callee?.name === "scheduleAppearAnimation" &&
        decl.init.arguments?.[0]?.type === "CallExpression" &&
        decl.init.arguments[0].callee?.name === "withFXWrapper"
      ) {
        const innerArg = decl.init.arguments[0].arguments?.[0];
        if (innerArg?.type === "MemberExpression" &&
          innerArg.object?.name === "motion" &&
          innerArg.property?.name === "a") {
          renames.set(decl.id.name, "FXLink");
        }
      }
    }
  }

  return renames;
}

// ── Apply renames ─────────────────────────────────────────────────

function processFile(filePath) {
  const code = readFileSync(filePath, "utf-8");

  let ast;
  try {
    ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: "module" });
  } catch (err) {
    console.error(`  ✗ Parse error: ${err.message}`);
    return { code, changed: false };
  }

  const renames = new Map();

  // A. Constant aliases
  const constAliases = findConstantAliases(ast);
  for (const [alias, original] of constAliases) {
    renames.set(alias, original);
  }

  // B. Per-component configs
  const configs = findComponentConfigs(ast, code);
  for (const [varName, newName] of configs) {
    if (!renames.has(varName)) {
      renames.set(varName, newName);
    }
  }

  // C. Module utilities
  const utils = findModuleUtilities(ast, code);
  for (const [varName, newName] of utils) {
    if (!renames.has(varName)) {
      renames.set(varName, newName);
    }
  }

  if (renames.size === 0) {
    return { code, changed: false, stats: { constants: 0, configs: 0, utils: 0 } };
  }

  console.log(`  Constant aliases: ${constAliases.size}`);
  for (const [a, o] of constAliases) console.log(`    ${a} → ${o}`);
  console.log(`  Config vars: ${configs.size}`);
  for (const [a, o] of configs) console.log(`    ${a} → ${o}`);
  console.log(`  Module utils: ${utils.size}`);
  for (const [a, o] of utils) console.log(`    ${a} → ${o}`);

  // Collect replacement positions
  const replacements = [];
  const renameKeys = new Set(renames.keys());

  // References
  walk(ast, (node, parent, parentKey) => {
    if (node.type !== "Identifier") return;
    if (!renameKeys.has(node.name)) return;
    if (!isReference(node, parent, parentKey)) return;
    replacements.push({ start: node.start, end: node.end, newText: renames.get(node.name) });
  });

  // Declaration positions
  walk(ast, (node) => {
    if (node.type === "VariableDeclarator" && node.id?.type === "Identifier") {
      if (renameKeys.has(node.id.name)) {
        replacements.push({ start: node.id.start, end: node.id.end, newText: renames.get(node.id.name) });
      }
    }
  });

  // Export specifier locals
  walk(ast, (node) => {
    if (node.type === "ExportSpecifier" && node.local?.type === "Identifier") {
      if (renameKeys.has(node.local.name)) {
        replacements.push({ start: node.local.start, end: node.local.end, newText: renames.get(node.local.name) });
      }
    }
  });

  // De-duplicate
  const seen = new Map();
  for (const r of replacements) {
    const key = `${r.start}-${r.end}`;
    if (!seen.has(key)) seen.set(key, r);
  }
  const unique = Array.from(seen.values());
  unique.sort((a, b) => b.start - a.start);

  let result = code;
  for (const { start, end, newText } of unique) {
    result = result.substring(0, start) + newText + result.substring(end);
  }

  // Remove ALL tautological declarations (X = X patterns)
  result = removeTautologies(result);

  return {
    code: result,
    changed: true,
    stats: { constants: constAliases.size, configs: configs.size, utils: utils.size, replacements: unique.length },
  };
}

/**
 * Remove all tautological declarations from the code:
 * - `var X = X;` (standalone) → delete
 * - `var X = X,\n  Y = ...` (first in chain) → `var Y = ...`
 * - `...,\n  X = X,\n  Y = ...` (middle of chain) → remove line
 * - `...,\n  X = X;` (end of chain) → change prev comma to semicolon
 */
function removeTautologies(code) {
  // Phase 1: Remove standalone `var X = X;\n`
  code = code.replace(/^var (\w+) = \1;\n/gm, "");

  // Phase 2: End of chain — `...,\n  X = X;` → change comma to semicolon
  code = code.replace(/,\n\s+(\w+) = \1;/g, ";");

  // Phase 3: Middle of chain — `\n  X = X,` → remove
  code = code.replace(/\n\s+(\w+) = \1,/g, "");

  // Phase 4: First in chain — `var X = X,\n  Y = ...` → `var Y = ...`
  code = code.replace(/var (\w+) = \1,\n\s+/g, "var ");

  return code;
}

function escRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// ── Main ──────────────────────────────────────────────────────────

function main() {
  console.log("Phase 6 Deobfuscation: config variable renaming\n");
  console.log("═".repeat(60));

  let totalChanged = 0;

  for (const file of FILES) {
    const filePath = join(SRC_DIR, file);
    console.log(`\n${file}:`);

    try {
      const { code, changed, stats } = processFile(filePath);
      if (changed) {
        writeFileSync(filePath, code);
        totalChanged++;
        console.log(`  ✓ ${stats.constants} constants, ${stats.configs} configs, ${stats.utils} utils, ${stats.replacements} replacements`);
      } else {
        console.log(`  (no changes)`);
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      console.error(err.stack);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`\n✓ Phase 6 complete: ${totalChanged} files updated`);
}

main();
