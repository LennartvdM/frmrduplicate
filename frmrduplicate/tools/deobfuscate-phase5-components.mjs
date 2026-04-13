/**
 * Phase 5 deobfuscation — component & helper alias renaming
 *
 * Phase 4 renamed locals inside forwardRef functions. This script handles
 * the module-level names surrounding each component:
 *
 * 1. Component renames: reads `X.displayName = "Name"`, renames X → PascalCase(Name)
 *    and the inner forwardRef variable → _PascalCase(Name)
 * 2. Helper alias inlining: `var K = TransitionProvider` → replaces K with
 *    TransitionProvider everywhere and removes the alias declaration
 * 3. Export alias cleanup: simplifies `Cs = De; export { Cs as default }`
 *
 * Uses acorn AST with scope-aware renaming (reuses phase 3/4 infrastructure).
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

// Known imports that get locally aliased per component block
const KNOWN_IMPORTS = new Set([
  "mergeVariantProps",
  "TransitionProvider",
  "AnimatedFragment",
  "resolveVariant",
  "makeLayoutKey",
]);

// ════════════════════════════════════════════════════════════════════
// 1. AST UTILITIES
// ════════════════════════════════════════════════════════════════════

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
 * Check if an Identifier is in reference position.
 */
function isReference(node, parent, parentKey) {
  if (node.type !== "Identifier") return false;

  // Property key in object (non-computed, non-shorthand)
  if (parent?.type === "Property" && parentKey === "key" && !parent.computed) {
    return parent.shorthand;
  }

  // Member expression property (obj.x)
  if (parent?.type === "MemberExpression" && parentKey === "property" && !parent.computed) {
    return false;
  }

  // Label
  if (parent?.type === "LabeledStatement" && parentKey === "label") return false;
  if ((parent?.type === "BreakStatement" || parent?.type === "ContinueStatement") && parentKey === "label") return false;

  // Method key
  if (parent?.type === "MethodDefinition" && parentKey === "key" && !parent.computed) return false;

  // Import/export specifier names (the "imported" side)
  if (parent?.type === "ImportSpecifier" && parentKey === "imported") return false;
  if (parent?.type === "ExportSpecifier" && parentKey === "exported") return false;

  return true;
}

// ════════════════════════════════════════════════════════════════════
// 2. DISPLAYNAME → COMPONENT RENAME MAP
// ════════════════════════════════════════════════════════════════════

/**
 * Convert a displayName string to a valid PascalCase identifier.
 * "Quiet Reflection" → "QuietReflection"
 * "Story Left2" → "StoryLeft2"
 * "Neoflix anim" → "NeoflixAnim"
 */
function toPascalCase(displayName) {
  return displayName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
    .replace(/[^a-zA-Z0-9_$]/g, "");
}

/**
 * Find all displayName assignments: `X.displayName = "Name"`
 * Returns Map<varName, pascalName>
 */
function findDisplayNames(ast) {
  const map = new Map(); // varName → { displayName, pascalName }

  walk(ast, (node) => {
    if (
      node.type === "ExpressionStatement" &&
      node.expression?.type === "AssignmentExpression" &&
      node.expression.operator === "=" &&
      node.expression.left?.type === "MemberExpression" &&
      node.expression.left.property?.name === "displayName" &&
      node.expression.left.object?.type === "Identifier" &&
      node.expression.right?.type === "Literal" &&
      typeof node.expression.right.value === "string"
    ) {
      const varName = node.expression.left.object.name;
      const displayName = node.expression.right.value;
      const pascalName = toPascalCase(displayName);
      map.set(varName, { displayName, pascalName });
    }
  });

  return map;
}

/**
 * Find withCSS wrapper calls: `X = withCSS(inner, cssArray, id)`
 * Returns Map<outerVar, innerVar>
 */
function findWithCSSCalls(ast) {
  const map = new Map(); // outerVar → innerVar

  walk(ast, (node) => {
    if (node.type !== "VariableDeclaration") return;

    for (const decl of node.declarations) {
      if (
        decl.id?.type === "Identifier" &&
        decl.init?.type === "CallExpression" &&
        decl.init.callee?.type === "Identifier" &&
        decl.init.callee.name === "withCSS" &&
        decl.init.arguments.length >= 2 &&
        decl.init.arguments[0]?.type === "Identifier"
      ) {
        map.set(decl.id.name, decl.init.arguments[0].name);
      }
    }
  });

  return map;
}

// ════════════════════════════════════════════════════════════════════
// 3. HELPER ALIAS DETECTION
// ════════════════════════════════════════════════════════════════════

/**
 * Find module-level alias declarations: `var X = mergeVariantProps`
 * where the RHS is a known imported name.
 * Returns Map<aliasName, originalName>
 */
function findHelperAliases(ast) {
  const aliases = new Map(); // alias → original

  for (const node of ast.body) {
    if (node.type !== "VariableDeclaration") continue;

    for (const decl of node.declarations) {
      if (
        decl.id?.type === "Identifier" &&
        decl.init?.type === "Identifier" &&
        KNOWN_IMPORTS.has(decl.init.name)
      ) {
        aliases.set(decl.id.name, decl.init.name);
      }
    }
  }

  return aliases;
}

// ════════════════════════════════════════════════════════════════════
// 4. EXPORT ALIAS DETECTION
// ════════════════════════════════════════════════════════════════════

/**
 * Find export aliases: `Cs = De; export { Cs as default }`
 * Returns Map<exportAlias, originalVar>
 */
function findExportAliases(ast) {
  const aliases = new Map(); // alias → original

  for (const node of ast.body) {
    if (node.type !== "VariableDeclaration") continue;

    for (const decl of node.declarations) {
      // Pattern: `Cs = De` where De is a component we're renaming
      if (
        decl.id?.type === "Identifier" &&
        decl.init?.type === "Identifier"
      ) {
        // We'll check later if the RHS is a component being renamed
        aliases.set(decl.id.name, decl.init.name);
      }
    }
  }

  return aliases;
}

// ════════════════════════════════════════════════════════════════════
// 5. BUILD FULL RENAME MAP AND COLLECT REPLACEMENTS
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
    console.error(`  ✗ Parse error: ${err.message}`);
    return { code, changed: false };
  }

  // Collect all rename sources
  const displayNames = findDisplayNames(ast);
  const withCSSMap = findWithCSSCalls(ast);
  const helperAliases = findHelperAliases(ast);
  const exportAliases = findExportAliases(ast);

  // Build unified rename map
  const renames = new Map(); // oldName → newName
  const usedNames = new Set(); // prevent conflicts

  // Collect all existing identifiers to avoid conflicts
  walk(ast, (node) => {
    if (node.type === "Identifier") usedNames.add(node.name);
  });

  // A. Component renames from displayName
  for (const [outerVar, { displayName, pascalName }] of displayNames) {
    // Outer component (withCSS wrapper)
    if (!usedNames.has(pascalName) || outerVar === pascalName) {
      renames.set(outerVar, pascalName);
      console.log(`    ${outerVar} → ${pascalName} (displayName: "${displayName}")`);
    } else {
      // Name conflict — try with suffix
      const altName = pascalName + "Component";
      renames.set(outerVar, altName);
      console.log(`    ${outerVar} → ${altName} (displayName: "${displayName}", conflict avoided)`);
    }

    // Inner forwardRef component
    const innerVar = withCSSMap.get(outerVar);
    if (innerVar) {
      const innerName = `_${pascalName}`;
      renames.set(innerVar, innerName);
      console.log(`    ${innerVar} → ${innerName} (inner forwardRef)`);
    }
  }

  // B. Helper alias inlining
  for (const [alias, original] of helperAliases) {
    if (!renames.has(alias)) {
      renames.set(alias, original);
      console.log(`    ${alias} → ${original} (helper alias)`);
    }
  }

  // C. Export aliases — rename if their RHS is being renamed
  for (const [exportAlias, originalVar] of exportAliases) {
    if (renames.has(originalVar) && !renames.has(exportAlias)) {
      const targetName = renames.get(originalVar);
      renames.set(exportAlias, targetName);
      console.log(`    ${exportAlias} → ${targetName} (export alias)`);
    }
  }

  if (renames.size === 0) {
    return { code, changed: false };
  }

  // Find all renameable references
  const replacements = [];
  const renameKeys = new Set(renames.keys());

  walk(ast, (node, parent, parentKey) => {
    if (node.type !== "Identifier") return;
    if (!renameKeys.has(node.name)) return;
    if (!isReference(node, parent, parentKey)) return;

    // Also handle declaration positions (var X = ..., the X itself)
    // We DO want to rename declarations too for module-level renames

    replacements.push({
      start: node.start,
      end: node.end,
      newText: renames.get(node.name),
    });
  });

  // Also catch identifiers in declaration positions (left side of var)
  walk(ast, (node) => {
    if (node.type === "VariableDeclarator" && node.id?.type === "Identifier") {
      if (renameKeys.has(node.id.name)) {
        replacements.push({
          start: node.id.start,
          end: node.id.end,
          newText: renames.get(node.id.name),
        });
      }
    }
  });

  // Catch function parameter declarations in forwardRef
  // (not needed here since we're renaming module-level vars)

  // Also catch: import specifier locals, export specifier locals
  walk(ast, (node) => {
    if (node.type === "ExportSpecifier" && node.local?.type === "Identifier") {
      if (renameKeys.has(node.local.name)) {
        replacements.push({
          start: node.local.start,
          end: node.local.end,
          newText: renames.get(node.local.name),
        });
      }
    }
  });

  // De-duplicate (same start position)
  const seen = new Map();
  for (const r of replacements) {
    const key = `${r.start}-${r.end}`;
    if (!seen.has(key)) {
      seen.set(key, r);
    }
  }
  const uniqueReplacements = Array.from(seen.values());
  uniqueReplacements.sort((a, b) => b.start - a.start);

  // Apply
  let result = code;
  for (const { start, end, newText } of uniqueReplacements) {
    result = result.substring(0, start) + newText + result.substring(end);
  }

  // Now remove helper alias declarations that are now redundant
  // Pattern: `var X = mergeVariantProps;` → delete entire statement
  // Pattern: `  X = TransitionProvider,` → remove from var chain
  result = removeHelperAliasDeclarations(result, helperAliases, renames);

  return {
    code: result,
    changed: true,
    stats: {
      components: displayNames.size,
      helpers: helperAliases.size,
      replacements: uniqueReplacements.length,
    },
  };
}

/**
 * Remove helper alias declarations after renaming.
 *
 * Two patterns:
 * 1. Standalone: `var X = mergeVariantProps;` → delete the whole line
 * 2. In a chain: `var A = SPRING_CAPTION,\n  X = TransitionProvider,\n  Y = AnimatedFragment,`
 *    → remove the X and Y lines from the chain
 */
function removeHelperAliasDeclarations(code, helperAliases, renames) {
  let result = code;

  // After renaming, the aliases now have the original name on both sides:
  // `var mergeVariantProps = mergeVariantProps;` or similar
  // Find and remove these tautological declarations

  for (const [alias, original] of helperAliases) {
    const newName = renames.get(alias) || original;

    // Pattern 1: standalone statement `var X = Y;`
    // After rename: `var mergeVariantProps = mergeVariantProps;`
    const standalonePattern = new RegExp(
      `^var ${escapeRegex(newName)} = ${escapeRegex(original)};\\n?`,
      "gm"
    );
    result = result.replace(standalonePattern, "");

    // Pattern 2: in a comma chain — remove the line `  X = Y,`
    // After rename: `  mergeVariantProps = mergeVariantProps,` or `  TransitionProvider = TransitionProvider,`
    const chainPattern = new RegExp(
      `^(\\s+)${escapeRegex(newName)} = ${escapeRegex(original)},\\n`,
      "gm"
    );
    result = result.replace(chainPattern, "");
  }

  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════

function main() {
  console.log("Phase 5 Deobfuscation: component & helper alias renaming\n");
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
        console.log(`    ✓ ${stats.components} components, ${stats.helpers} aliases inlined, ${stats.replacements} replacements`);
      } else {
        console.log(`    (no changes)`);
      }
    } catch (err) {
      console.error(`    ✗ Error: ${err.message}`);
      console.error(err.stack);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`\n✓ Phase 5 complete: ${totalChanged} files updated`);
}

main();
