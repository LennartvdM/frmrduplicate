/**
 * Phase 4 deobfuscation — component-local variable renaming
 *
 * Previous phases renamed imports and top-level aliases. This script targets
 * the single-letter locals INSIDE forwardRef component functions:
 *
 * 1. Finds all forwardRef(function(t, a) { ... }) component definitions
 * 2. Within each, collects destructuring alias maps:
 *    - { baseVariant: p, classNames: L, ... } → rename p→baseVariant, L→classNames
 *    - { style: o, className: f, ... } → rename o→style, f→className
 * 3. Collects simple hook assignments: let X = useRef(null) → rename X→localRef
 * 4. Renames forwardRef params: (t, a) → (props, forwardedRef)
 * 5. Applies all renames scope-aware (respects shadowing, skips property keys)
 *
 * Uses acorn AST with parent tracking for correctness.
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

// ════════════════════════════════════════════════════════════════════
// 1. AST UTILITIES
// ════════════════════════════════════════════════════════════════════

/**
 * Walk AST with parent tracking.
 * Calls visitor(node, parent, parentKey) for every node.
 */
function walk(node, visitor, parent = null, parentKey = null) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      walk(node[i], visitor, parent, parentKey);
    }
    return;
  }
  if (!node.type) return;

  visitor(node, parent, parentKey);

  for (const key of Object.keys(node)) {
    if (key === "type" || key === "start" || key === "end" || key === "loc" || key === "range") continue;
    const child = node[key];
    if (child && typeof child === "object") {
      walk(child, visitor, node, key);
    }
  }
}

/**
 * Check if an Identifier node is in "reference" position (not a declaration,
 * not a property key, not a label).
 */
function isReference(node, parent, parentKey) {
  if (node.type !== "Identifier") return false;

  // Property key in object expression/pattern (non-computed, non-shorthand)
  if (parent?.type === "Property" && parentKey === "key" && !parent.computed) {
    // Shorthand { p } means key and value are the same — the value IS a reference
    // But we're looking at the key, so only count it if shorthand
    return parent.shorthand;
  }

  // Member expression property (obj.p — the .p is not a reference)
  if (parent?.type === "MemberExpression" && parentKey === "property" && !parent.computed) {
    return false;
  }

  // Label (break label, continue label)
  if (parent?.type === "LabeledStatement" && parentKey === "label") return false;
  if ((parent?.type === "BreakStatement" || parent?.type === "ContinueStatement") && parentKey === "label") return false;

  // Method definition key
  if (parent?.type === "MethodDefinition" && parentKey === "key" && !parent.computed) return false;

  // Import specifier local (already handled by imports, but skip anyway)
  if (parent?.type === "ImportSpecifier" && parentKey === "local") return false;

  // Export specifier
  if (parent?.type === "ExportSpecifier") return false;

  return true;
}

/**
 * Collect all names declared within a function body (including params).
 * Used for shadow detection in nested scopes.
 */
function collectDeclaredNames(fnNode) {
  const names = new Set();

  // Params
  for (const param of fnNode.params) {
    collectBindingNames(param, names);
  }

  // Body declarations
  if (fnNode.body?.type === "BlockStatement") {
    walkForDeclarations(fnNode.body, names);
  }

  return names;
}

function collectBindingNames(pattern, names) {
  if (!pattern) return;
  if (pattern.type === "Identifier") {
    names.add(pattern.name);
  } else if (pattern.type === "ObjectPattern") {
    for (const prop of pattern.properties) {
      if (prop.type === "RestElement") {
        collectBindingNames(prop.argument, names);
      } else {
        collectBindingNames(prop.value, names);
      }
    }
  } else if (pattern.type === "ArrayPattern") {
    for (const el of pattern.elements) {
      if (el) collectBindingNames(el, names);
    }
  } else if (pattern.type === "RestElement") {
    collectBindingNames(pattern.argument, names);
  } else if (pattern.type === "AssignmentPattern") {
    collectBindingNames(pattern.left, names);
  }
}

function walkForDeclarations(block, names) {
  walk(block, (node) => {
    if (node.type === "VariableDeclaration") {
      for (const decl of node.declarations) {
        collectBindingNames(decl.id, names);
      }
    }
  });
}

// ════════════════════════════════════════════════════════════════════
// 2. FIND forwardRef COMPONENT FUNCTIONS
// ════════════════════════════════════════════════════════════════════

function findForwardRefFunctions(ast) {
  const results = [];

  walk(ast, (node) => {
    if (
      node.type === "CallExpression" &&
      node.callee?.type === "Identifier" &&
      node.callee.name === "forwardRef" &&
      node.arguments.length > 0 &&
      node.arguments[0].type === "FunctionExpression"
    ) {
      results.push(node.arguments[0]);
    }
  });

  return results;
}

// ════════════════════════════════════════════════════════════════════
// 3. BUILD RENAME MAP FROM DESTRUCTURING PATTERNS
// ════════════════════════════════════════════════════════════════════

/** Hook return → preferred variable name for simple assignments */
const HOOK_VAR_NAMES = {
  useRef: "localRef",
  useId: "autoId",
  useDeviceSize: "deviceSize",
};

/** Counters for disambiguating multiple uses of the same hook */
const HOOK_VAR_COUNTERS = new Map();

/**
 * Given a forwardRef function node, build a map of oldName → newName
 * by analyzing destructuring patterns and simple hook assignments.
 */
function buildRenameMap(fnNode, code) {
  const renames = new Map(); // oldName → newName
  const declarationRanges = []; // [start, end] ranges to skip when replacing
  const nameCounters = new Map(); // track usage count per base name to disambiguate

  function getUniqueName(baseName) {
    const count = (nameCounters.get(baseName) || 0) + 1;
    nameCounters.set(baseName, count);
    return count === 1 ? baseName : `${baseName}${count}`;
  }

  // A. forwardRef parameters: (t, a) → (props, forwardedRef)
  const paramNames = ["props", "forwardedRef"];
  for (let i = 0; i < fnNode.params.length && i < paramNames.length; i++) {
    const param = fnNode.params[i];
    if (param.type === "Identifier" && param.name.length <= 2) {
      renames.set(param.name, paramNames[i]);
      declarationRanges.push([param.start, param.end]);
    }
  }

  // Walk the function body for destructuring patterns and simple assignments
  if (fnNode.body?.type !== "BlockStatement") return { renames, declarationRanges };

  for (const stmt of fnNode.body.body) {
    if (stmt.type !== "VariableDeclaration") continue;

    for (const decl of stmt.declarations) {
      // B. ObjectPattern destructuring: { key: alias, ... } = init
      if (decl.id?.type === "ObjectPattern" && decl.init) {
        for (const prop of decl.id.properties) {
          if (prop.type === "RestElement") {
            // ...l → ...restProps
            if (prop.argument?.type === "Identifier" && prop.argument.name.length <= 2) {
              renames.set(prop.argument.name, getUniqueName("restProps"));
              declarationRanges.push([prop.start, prop.end]);
            }
          } else if (
            prop.type === "Property" &&
            prop.key?.type === "Identifier" &&
            prop.value?.type === "Identifier" &&
            !prop.shorthand &&
            prop.key.name !== prop.value.name
          ) {
            // { baseVariant: p } → rename p to baseVariant
            const alias = prop.value.name;
            const original = prop.key.name;

            // Only rename short aliases (1-2 chars) to avoid renaming meaningful names
            if (alias.length <= 2) {
              renames.set(alias, original);
              declarationRanges.push([prop.start, prop.end]);
            }
          }
        }
      }

      // C. Simple hook assignments: let X = useRef(null)
      if (
        decl.id?.type === "Identifier" &&
        decl.id.name.length <= 2 &&
        decl.init?.type === "CallExpression" &&
        decl.init.callee?.type === "Identifier"
      ) {
        const hookName = decl.init.callee.name;
        if (HOOK_VAR_NAMES[hookName]) {
          renames.set(decl.id.name, getUniqueName(HOOK_VAR_NAMES[hookName]));
          declarationRanges.push([decl.id.start, decl.id.end]);
        }
      }

      // D. Array literal: let Y = [] → let additionalClassNames = []
      if (
        decl.id?.type === "Identifier" &&
        decl.id.name.length <= 2 &&
        decl.init?.type === "ArrayExpression" &&
        decl.init.elements.length === 0
      ) {
        renames.set(decl.id.name, getUniqueName("additionalClassNames"));
        declarationRanges.push([decl.id.start, decl.id.end]);
      }

      // E. Layout key computation: let u = layoutKeyFn(t, x)
      // This is a call with 2 args where first arg maps to props
      // We detect it by the pattern: let <short> = <short>(props/t, variants/x)
    }
  }

  return { renames, declarationRanges };
}

// ════════════════════════════════════════════════════════════════════
// 4. FIND REFERENCES AND BUILD REPLACEMENTS
// ════════════════════════════════════════════════════════════════════

/**
 * Find all inner function/arrow scopes within the component function,
 * and collect their declared names (to detect shadowing).
 */
function findInnerScopes(fnNode) {
  const innerScopes = []; // { start, end, names: Set }

  walk(fnNode.body, (node) => {
    if (
      node !== fnNode &&
      (node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "FunctionDeclaration")
    ) {
      const names = new Set();
      for (const param of node.params) {
        collectBindingNames(param, names);
      }
      // Also collect var/let/const declarations in the function body
      if (node.body?.type === "BlockStatement") {
        for (const stmt of node.body.body) {
          if (stmt.type === "VariableDeclaration") {
            for (const decl of stmt.declarations) {
              collectBindingNames(decl.id, names);
            }
          }
        }
      }
      innerScopes.push({ start: node.start, end: node.end, names });
    }
  });

  return innerScopes;
}

/**
 * Check if a name is shadowed at a given position by an inner scope.
 */
function isShadowed(name, pos, innerScopes) {
  for (const scope of innerScopes) {
    if (pos >= scope.start && pos <= scope.end && scope.names.has(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Find all renameable references within a function body.
 */
function findReferences(fnNode, renames, declarationRanges, innerScopes) {
  const replacements = [];
  const renameNames = new Set(renames.keys());

  walk(fnNode, (node, parent, parentKey) => {
    if (node.type !== "Identifier") return;
    if (!renameNames.has(node.name)) return;

    // Skip if in a declaration range (the destructuring pattern itself)
    for (const [start, end] of declarationRanges) {
      if (node.start >= start && node.end <= end) return;
    }

    // Skip if not in reference position
    if (!isReference(node, parent, parentKey)) return;

    // Skip if shadowed by an inner function scope
    if (isShadowed(node.name, node.start, innerScopes)) return;

    const newName = renames.get(node.name);

    // Handle shorthand properties: { p } → { p: baseVariant }
    if (parent?.type === "Property" && parent.shorthand && parentKey === "key") {
      // This is a shorthand { p } — we need to expand it to { p: newName }
      // The whole property node needs to be replaced
      replacements.push({
        start: parent.start,
        end: parent.end,
        newText: `${node.name}: ${newName}`,
        isShorthand: true,
      });
      return;
    }

    replacements.push({
      start: node.start,
      end: node.end,
      newText: newName,
    });
  });

  return replacements;
}

// ════════════════════════════════════════════════════════════════════
// 5. REWRITE DESTRUCTURING DECLARATIONS
// ════════════════════════════════════════════════════════════════════

/**
 * Rewrite the destructuring patterns themselves:
 *   { baseVariant: p, classNames: L } → { baseVariant, classNames }
 *   (t, a) → (props, forwardedRef)
 *   ...l → ...restProps
 */
function rewriteDeclarations(fnNode, renames, code) {
  const replacements = [];

  // A. forwardRef parameters
  const paramNewNames = ["props", "forwardedRef"];
  for (let i = 0; i < fnNode.params.length && i < paramNewNames.length; i++) {
    const param = fnNode.params[i];
    if (param.type === "Identifier" && renames.has(param.name)) {
      replacements.push({
        start: param.start,
        end: param.end,
        newText: paramNewNames[i],
      });
    }
  }

  // B. Destructuring patterns in the body
  if (fnNode.body?.type === "BlockStatement") {
    for (const stmt of fnNode.body.body) {
      if (stmt.type !== "VariableDeclaration") continue;

      for (const decl of stmt.declarations) {
        if (decl.id?.type === "ObjectPattern") {
          for (const prop of decl.id.properties) {
            if (prop.type === "RestElement" && prop.argument?.type === "Identifier") {
              if (renames.has(prop.argument.name)) {
                replacements.push({
                  start: prop.argument.start,
                  end: prop.argument.end,
                  newText: renames.get(prop.argument.name),
                });
              }
            } else if (
              prop.type === "Property" &&
              !prop.shorthand &&
              prop.key?.type === "Identifier" &&
              prop.value?.type === "Identifier" &&
              renames.has(prop.value.name) &&
              renames.get(prop.value.name) === prop.key.name
            ) {
              // { baseVariant: p } → { baseVariant }
              // Replace entire property with just the key (shorthand)
              replacements.push({
                start: prop.start,
                end: prop.end,
                newText: prop.key.name,
              });
            }
          }
        }

        // Simple identifier declarations: let M = useRef(null) → let localRef = useRef(null)
        if (decl.id?.type === "Identifier" && renames.has(decl.id.name)) {
          replacements.push({
            start: decl.id.start,
            end: decl.id.end,
            newText: renames.get(decl.id.name),
          });
        }
      }
    }
  }

  return replacements;
}

// ════════════════════════════════════════════════════════════════════
// 6. MAIN PROCESSING
// ════════════════════════════════════════════════════════════════════

function processFile(filePath) {
  const code = readFileSync(filePath, "utf-8");

  let ast;
  try {
    ast = acorn.parse(code, {
      ecmaVersion: 2022,
      sourceType: "module",
    });
  } catch (err) {
    console.error(`  ✗ Parse error in ${filePath}: ${err.message}`);
    return { code, changed: false, stats: {} };
  }

  const componentFns = findForwardRefFunctions(ast);
  if (componentFns.length === 0) {
    return { code, changed: false, stats: {} };
  }

  // Collect all replacements across all components
  let allReplacements = [];
  let totalRenames = 0;
  let componentCount = 0;

  for (const fnNode of componentFns) {
    const { renames, declarationRanges } = buildRenameMap(fnNode, code);
    if (renames.size === 0) continue;

    componentCount++;
    const innerScopes = findInnerScopes(fnNode);

    // Get reference replacements
    const refReplacements = findReferences(fnNode, renames, declarationRanges, innerScopes);

    // Get declaration replacements
    const declReplacements = rewriteDeclarations(fnNode, renames, code);

    // Merge (avoiding overlaps — declaration replacements take priority)
    const declPositions = new Set(declReplacements.map(r => `${r.start}-${r.end}`));
    const filtered = refReplacements.filter(r => !declPositions.has(`${r.start}-${r.end}`));

    allReplacements.push(...filtered, ...declReplacements);
    totalRenames += renames.size;

    // Log the renames for this component
    const fnCode = code.substring(fnNode.start, Math.min(fnNode.start + 200, fnNode.end));
    const fnMatch = fnCode.match(/function\s*\(/);
    console.log(`    Component at offset ${fnNode.start}: ${renames.size} aliases resolved, ${filtered.length + declReplacements.length} replacements`);
    for (const [old, newName] of renames) {
      console.log(`      ${old} → ${newName}`);
    }
  }

  if (allReplacements.length === 0) {
    return { code, changed: false, stats: { componentCount, totalRenames } };
  }

  // De-duplicate replacements (same position → keep the first/declaration one)
  const seen = new Map();
  for (const r of allReplacements) {
    const key = `${r.start}`;
    if (!seen.has(key) || r.newText.length > seen.get(key).newText.length) {
      seen.set(key, r);
    }
  }
  allReplacements = Array.from(seen.values());

  // Sort descending by start position for safe replacement
  allReplacements.sort((a, b) => b.start - a.start);

  // Check for overlapping replacements
  for (let i = 0; i < allReplacements.length - 1; i++) {
    const curr = allReplacements[i];
    const next = allReplacements[i + 1];
    if (curr.start < next.end) {
      console.warn(`    ⚠ Overlapping replacements at ${next.start}-${next.end} and ${curr.start}-${curr.end}, skipping latter`);
      allReplacements.splice(i, 1);
      i--;
    }
  }

  // Apply replacements
  let result = code;
  for (const { start, end, newText } of allReplacements) {
    result = result.substring(0, start) + newText + result.substring(end);
  }

  return {
    code: result,
    changed: true,
    stats: { componentCount, totalRenames, replacementCount: allReplacements.length },
  };
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════

function main() {
  console.log("Phase 4 Deobfuscation: component-local variable renaming\n");
  console.log("═".repeat(60));

  let totalChanged = 0;

  for (const file of FILES) {
    const filePath = join(SRC_DIR, file);
    console.log(`\n  ${file}`);

    try {
      const { code, changed, stats } = processFile(filePath);

      if (changed) {
        writeFileSync(filePath, code);
        totalChanged++;
        console.log(`    ✓ ${stats.componentCount} components, ${stats.totalRenames} aliases, ${stats.replacementCount} replacements`);
      } else {
        console.log(`    (no changes)`);
      }
    } catch (err) {
      console.error(`    ✗ Error: ${err.message}`);
      console.error(err.stack);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`\n✓ Phase 4 complete: ${totalChanged} files updated`);
}

main();
