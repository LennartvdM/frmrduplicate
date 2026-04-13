/**
 * Phase 7 deobfuscation — animation states, variant maps, prefixes, fonts
 *
 * Renames the remaining per-component config variables by tracing their
 * usage to known motion/Framer prop names:
 *
 * A. Animation states: traced via `animate: X`, `initial: X`, `whileHover: X`,
 *    `__framer__exit: X`, `__framer__enter: X`, `__framer__presenceAnimate: X`,
 *    `__framer__presenceExit: X`, `__framer__presenceInitial: X`
 * B. Variant name maps: objects referenced as `mapVar[x.variant]` in resolvers
 * C. CSS prefix strings: "framer-XXXXX" used as first arg in cx() calls
 * D. Font arrays: `getFonts(Component)` results
 * E. Enabled gestures: `enabledGestures: X` props
 * F. Transform functions: small arrow fns with translateX/translate patterns
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

// ── Motion prop → role name mapping ──────────────────────────────
const MOTION_PROP_ROLES = {
  animate: "animate",
  initial: "initial",
  whileHover: "hover",
  whileTap: "tap",
  whileInView: "inView",
  __framer__exit: "exit",
  __framer__enter: "enter",
  __framer__presenceAnimate: "presenceAnimate",
  __framer__presenceExit: "presenceExit",
  __framer__presenceInitial: "presenceInitial",
  enabledGestures: "gestures",
};

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

function findComponentBlocks(ast) {
  const components = [];
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (!node.id?.name?.startsWith("_")) return;
    if (node.init?.type !== "CallExpression") return;
    if (node.init.callee?.name !== "forwardRef") return;
    components.push({
      name: node.id.name.slice(1),
      start: node.init.start,
      end: node.init.end,
    });
  });
  return components;
}

function findOwningComponent(pos, components) {
  for (const comp of components) {
    if (pos >= comp.start && pos <= comp.end) return comp.name;
  }
  return null;
}

/**
 * Find the nearest component whose forwardRef starts AFTER the given position.
 * Used for config variables declared just before their component's forwardRef.
 */
function findNearestFollowingComponent(pos, components) {
  let best = null;
  let bestDist = Infinity;
  for (const comp of components) {
    const dist = comp.start - pos;
    if (dist > 0 && dist < bestDist) {
      bestDist = dist;
      best = comp.name;
    }
  }
  return best;
}

// ── Pass A: Animation state detection via motion props ────────────

function findAnimationStates(ast, components) {
  const renames = new Map();

  walk(ast, (node) => {
    if (node.type !== "Property") return;
    if (node.key?.type !== "Identifier" && node.key?.type !== "Literal") return;
    if (node.value?.type !== "Identifier") return;

    const propName = node.key.name || node.key.value;
    const role = MOTION_PROP_ROLES[propName];
    if (!role) return;

    const varName = node.value.name;
    // Skip already-renamed variables
    if (/[A-Z]\w*_[a-z]/.test(varName)) return; // skip already-renamed like Component_role
    // Skip known names
    if (varName === "variants" || varName === "false" || varName === "true") return;
    if (varName === "undefined") return;

    const comp = findOwningComponent(node.start, components);
    if (!comp) return;

    const newName = `${comp}_${role}`;
    if (!renames.has(varName)) {
      renames.set(varName, newName);
    }
  });

  return renames;
}

// ── Pass B: Variant name maps (used in resolvers) ─────────────────

function findVariantNameMaps(ast, components) {
  const renames = new Map();

  // Find patterns: mapVar[something.variant] inside resolver functions
  // These are at module scope (not inside forwardRef), so use nearest-following component
  walk(ast, (node) => {
    if (node.type !== "MemberExpression") return;
    if (!node.computed) return;
    if (node.object?.type !== "Identifier") return;

    // Check if property access is on .variant
    if (node.property?.type === "MemberExpression" &&
      node.property.property?.name === "variant") {
      const mapName = node.object.name;
      // Skip already-renamed
      if (/[A-Z]\w*_[a-z]/.test(mapName)) return;

      // Try inside forwardRef first, then nearest following
      let comp = findOwningComponent(node.start, components);
      if (!comp) comp = findNearestFollowingComponent(node.start, components);
      if (comp) {
        renames.set(mapName, `${comp}_variantNames`);
      }
    }
  });

  return renames;
}

// ── Pass B2: Animation states via setAppearAnimationValues ────────

function findAppearAnimationStates(ast, components) {
  const renames = new Map();

  // Pattern: setAppearAnimationValues("animate"|"initial", id, stateVar, ...)
  // The 1st arg determines the role, 3rd arg is the state variable
  const APPEAR_ROLES = {
    animate: "presenceAnimate",
    initial: "presenceInitial",
  };

  walk(ast, (node) => {
    if (node.type !== "CallExpression") return;
    if (node.callee?.name !== "setAppearAnimationValues") return;
    if (node.arguments.length < 3) return;

    const roleArg = node.arguments[0];
    const stateArg = node.arguments[2];

    if (roleArg?.type !== "Literal" || stateArg?.type !== "Identifier") return;

    const role = APPEAR_ROLES[roleArg.value];
    if (!role) return;

    const varName = stateArg.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;
    if (renames.has(varName)) return;

    const comp = findOwningComponent(node.start, components);
    if (comp) {
      renames.set(varName, `${comp}_${role}`);
    }
  });

  return renames;
}

// ── Pass C: CSS prefix strings ────────────────────────────────────

function findCSSPrefixes(ast, components) {
  const renames = new Map();

  // Find cx(prefixVar, ...) calls
  walk(ast, (node) => {
    if (node.type !== "CallExpression") return;
    if (node.callee?.name !== "cx") return;
    if (node.arguments.length < 2) return;

    const firstArg = node.arguments[0];
    if (firstArg?.type !== "Identifier") return;

    const varName = firstArg.name;
    // Skip already-renamed
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    const comp = findOwningComponent(node.start, components);
    if (comp) {
      if (!renames.has(varName)) {
        renames.set(varName, `${comp}_prefix`);
      }
    }
  });

  return renames;
}

// ── Pass D: Font arrays ───────────────────────────────────────────

function findFontArrays(ast) {
  const renames = new Map();

  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "CallExpression") return;
    if (node.init.callee?.name !== "getFonts") return;
    if (node.init.arguments.length < 1) return;

    const arg = node.init.arguments[0];
    const varName = node.id.name;

    // Skip already-renamed
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    let componentName;
    if (arg.type === "Identifier") {
      componentName = arg.name;
    } else {
      return;
    }

    renames.set(varName, `${componentName}_fonts`);
  });

  return renames;
}

// ── Pass E: Transform functions ───────────────────────────────────

function findTransformFunctions(ast, components) {
  const renames = new Map();

  // Pattern: arrow function with template literal containing translate
  walk(ast, (node, parent) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "ArrowFunctionExpression") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    // Check if body is a template literal with translate
    const body = node.init.body;
    if (body?.type === "TemplateLiteral") {
      const raw = body.quasis.map(q => q.value.raw).join("");
      if (raw.includes("translate")) {
        // Find nearest component block by position
        // These are always declared just before the forwardRef
        let bestComp = null;
        let bestDist = Infinity;
        for (const comp of components) {
          const dist = comp.start - node.start;
          if (dist > 0 && dist < bestDist) {
            bestDist = dist;
            bestComp = comp.name;
          }
        }
        if (bestComp) {
          renames.set(varName, `${bestComp}_transform`);
        }
      }
    }
  });

  return renames;
}

// ── Pass F: Media query / breakpoint maps ─────────────────────────

function findBreakpointMaps(ast) {
  const renames = new Map();

  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "ObjectExpression") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    // Check if all values are media query strings
    const props = node.init.properties;
    if (props.length < 1) return;

    const allMediaQueries = props.every(p =>
      p.value?.type === "Literal" &&
      typeof p.value.value === "string" &&
      (p.value.value.includes("min-width") || p.value.value.includes("max-width"))
    );

    if (allMediaQueries) {
      renames.set(varName, "breakpointQueries");
    }
  });

  return renames;
}

// ── Pass G: $ (getVariantProps) calls ─────────────────────────────

function findVariantPropGetters(ast) {
  const renames = new Map();

  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "CallExpression") return;

    // Pattern: X = $(ComponentName) where $ is imported
    const callee = node.init.callee;
    if (callee?.type !== "Identifier" || callee.name !== "$") return;
    if (node.init.arguments.length < 1) return;

    const arg = node.init.arguments[0];
    if (arg?.type !== "Identifier") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    renames.set(varName, `${arg.name}_variantProps`);
  });

  return renames;
}

// ── Pass H: Environment check functions ───────────────────────────

function findEnvChecks(ast) {
  const renames = new Map();

  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "ArrowFunctionExpression") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    // Pattern: () => typeof document < "u"
    const body = node.init.body;
    if (body?.type === "BinaryExpression" &&
      body.left?.type === "UnaryExpression" &&
      body.left.operator === "typeof" &&
      body.left.argument?.name === "document") {
      renames.set(varName, "isBrowser");
    }
  });

  return renames;
}

// ── Pass I: Scroll-snap and appear wrappers ───────────────────────

function findWrappedComponents(ast) {
  const renames = new Map();

  const WRAPPER_NAMES = {
    withScrollSnapChild: "ScrollSnapSection",
    withScrollSnap: "ScrollSnapSectionWrap",
    withScrollSnapContainer: "ScrollSnapMain",
    withScrollSnapContainerAlt: "ScrollSnapMainAlt",
  };

  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "CallExpression") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;

    const callee = node.init.callee;

    // Pattern: wrapperFn(motion.element)
    if (callee?.type === "Identifier" && WRAPPER_NAMES[callee.name]) {
      renames.set(varName, WRAPPER_NAMES[callee.name]);
      return;
    }

    // Pattern: scheduleAppearAnimation(motion.div) → AppearDiv
    if (callee?.name === "scheduleAppearAnimation") {
      const arg = node.init.arguments?.[0];
      if (arg?.type === "MemberExpression" && arg.object?.name === "motion") {
        const tag = arg.property.name;
        const tagUpper = tag.charAt(0).toUpperCase() + tag.slice(1);
        renames.set(varName, `Appear${tagUpper}`);
      }
    }
  });

  return renames;
}

// ── Pass J: Remaining variantClassNames (for Home which has no cycleOrder) ──

function findRemainingVariantClassNames(ast, components) {
  const renames = new Map();

  // Pattern: object where all values are "framer-v-XXXXX" strings
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id?.type !== "Identifier") return;
    if (node.init?.type !== "ObjectExpression") return;

    const varName = node.id.name;
    if (/[A-Z]\w*_[a-z]/.test(varName)) return;
    if (varName.length > 4) return; // only target short obfuscated names

    const props = node.init.properties;
    if (props.length < 2) return;

    const allFramerVariantClasses = props.every(p =>
      p.value?.type === "Literal" &&
      typeof p.value.value === "string" &&
      p.value.value.startsWith("framer-v-")
    );

    if (allFramerVariantClasses) {
      const comp = findNearestFollowingComponent(node.start, components);
      if (comp) {
        renames.set(varName, `${comp}_variantClassNames`);
      }
    }
  });

  return renames;
}

// ── Apply all renames ─────────────────────────────────────────────

function processFile(filePath) {
  const code = readFileSync(filePath, "utf-8");

  let ast;
  try {
    ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: "module" });
  } catch (err) {
    console.error(`  ✗ Parse error: ${err.message}`);
    return { code, changed: false };
  }

  const components = findComponentBlocks(ast);
  const allRenames = new Map();
  const stats = {};

  const passes = [
    ["animStates", () => findAnimationStates(ast, components)],
    ["appearStates", () => findAppearAnimationStates(ast, components)],
    ["variantNames", () => findVariantNameMaps(ast, components)],
    ["prefixes", () => findCSSPrefixes(ast, components)],
    ["fonts", () => findFontArrays(ast)],
    ["transforms", () => findTransformFunctions(ast, components)],
    ["breakpoints", () => findBreakpointMaps(ast)],
    ["variantProps", () => findVariantPropGetters(ast)],
    ["envChecks", () => findEnvChecks(ast)],
    ["wrappers", () => findWrappedComponents(ast)],
    ["remainingVCN", () => findRemainingVariantClassNames(ast, components)],
  ];

  for (const [name, fn] of passes) {
    const renames = fn();
    stats[name] = renames.size;
    for (const [old, nw] of renames) {
      if (!allRenames.has(old)) {
        allRenames.set(old, nw);
        console.log(`    ${old} → ${nw}`);
      }
    }
  }

  // Check for naming conflicts: multiple vars getting same new name
  const nameCount = new Map();
  for (const [, newName] of allRenames) {
    nameCount.set(newName, (nameCount.get(newName) || 0) + 1);
  }
  // Suffix duplicates
  const nameSeen = new Map();
  for (const [oldName, newName] of allRenames) {
    if (nameCount.get(newName) > 1) {
      const idx = (nameSeen.get(newName) || 0) + 1;
      nameSeen.set(newName, idx);
      if (idx > 1) {
        allRenames.set(oldName, `${newName}${idx}`);
        console.log(`    (dedup: ${oldName} → ${newName}${idx})`);
      }
    }
  }

  if (allRenames.size === 0) {
    return { code, changed: false, stats };
  }

  // Collect replacement positions
  const replacements = [];
  const renameKeys = new Set(allRenames.keys());

  walk(ast, (node, parent, parentKey) => {
    if (node.type !== "Identifier") return;
    if (!renameKeys.has(node.name)) return;
    if (!isReference(node, parent, parentKey)) return;
    replacements.push({ start: node.start, end: node.end, newText: allRenames.get(node.name) });
  });

  // Declaration positions
  walk(ast, (node) => {
    if (node.type === "VariableDeclarator" && node.id?.type === "Identifier") {
      if (renameKeys.has(node.id.name)) {
        replacements.push({ start: node.id.start, end: node.id.end, newText: allRenames.get(node.id.name) });
      }
    }
  });

  // Export specifiers
  walk(ast, (node) => {
    if (node.type === "ExportSpecifier" && node.local?.type === "Identifier") {
      if (renameKeys.has(node.local.name)) {
        replacements.push({ start: node.local.start, end: node.local.end, newText: allRenames.get(node.local.name) });
      }
    }
  });

  // De-duplicate and apply
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

  return {
    code: result,
    changed: true,
    stats: { ...stats, total: allRenames.size, replacements: unique.length },
  };
}

// ── Main ──────────────────────────────────────────────────────────

function main() {
  console.log("Phase 7 Deobfuscation: animation states, variant maps, prefixes, fonts\n");
  console.log("═".repeat(60));

  let totalChanged = 0;

  for (const file of FILES) {
    const filePath = join(SRC_DIR, file);
    console.log(`\n  ${file}:`);

    try {
      const { code, changed, stats } = processFile(filePath);
      if (changed) {
        writeFileSync(filePath, code);
        totalChanged++;
        console.log(`  ✓ ${stats.total} renames, ${stats.replacements} replacements`);
      } else {
        console.log(`  (no changes)`);
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      console.error(err.stack);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`✓ Phase 7 complete: ${totalChanged} files updated`);
}

main();
