/**
 * Phase 3 deobfuscation — scope-aware body renaming + CSS extraction + chunk naming
 *
 * Phase 2 renamed import specifiers (e.g., `import { jsx } from "..."`)
 * but skipped single-letter body references. This script:
 *
 * 1. Reads the "Import aliases resolved" header to get oldAlias → newName mappings
 * 2. Uses acorn AST parsing with scope analysis to rename only FREE references
 *    (i.e., references that aren't shadowed by local declarations)
 * 3. Extracts inline CSS arrays into separate .css files
 * 4. Renames unnamed chunks to semantic names
 * 5. Fixes stale references in the router file
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";
import * as acorn from "acorn";

const DEOB_DIR = "sites/neoflix/deobfuscated";
const CSS_DIR  = join(DEOB_DIR, "css");

// ════════════════════════════════════════════════════════════════════
// 1. ALIAS MAP PARSING — read the header comment from each file
// ════════════════════════════════════════════════════════════════════

function parseAliasHeader(code) {
  // Matches the "Import aliases resolved" block:
  //   *   e → jsx
  //   *   g → jsxs
  const aliasMap = new Map(); // oldAlias → newName
  const headerMatch = code.match(/\/\*\*[\s\S]*?Import aliases resolved:[\s\S]*?\*\//);
  if (!headerMatch) return aliasMap;

  const lines = headerMatch[0].split("\n");
  for (const line of lines) {
    const m = line.match(/\*\s+(\S+)\s+→\s+(\S+)/);
    if (m) {
      aliasMap.set(m[1], m[2]);
    }
  }
  return aliasMap;
}

// ════════════════════════════════════════════════════════════════════
// 2. SCOPE-AWARE RENAMING with acorn
// ════════════════════════════════════════════════════════════════════

/**
 * Collect all declaration positions in each scope.
 * Returns a list of scopes, each with the set of names declared in it
 * and the [start, end] range.
 */
function buildScopes(ast) {
  const scopes = [];

  function addScope(node, names) {
    scopes.push({ start: node.start, end: node.end, names: new Set(names) });
  }

  // Module scope — collect import bindings and top-level var/let/const/function
  const moduleNames = new Set();
  for (const node of ast.body) {
    if (node.type === "ImportDeclaration") {
      for (const spec of node.specifiers) {
        moduleNames.add(spec.local.name);
      }
    }
    if (node.type === "VariableDeclaration") {
      collectPatternNames(node, moduleNames);
    }
    if (node.type === "FunctionDeclaration" && node.id) {
      moduleNames.add(node.id.name);
    }
    if (node.type === "ClassDeclaration" && node.id) {
      moduleNames.add(node.id.name);
    }
  }
  scopes.push({ start: ast.start, end: ast.end, names: moduleNames });

  // Walk all functions, blocks, catch clauses, etc.
  walkNode(ast, (node) => {
    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      const names = new Set();
      // Params
      for (const param of node.params) {
        collectBindingNames(param, names);
      }
      // Body declarations (var is function-scoped)
      if (node.body.type === "BlockStatement") {
        collectVarDeclarations(node.body, names);
      }
      if (node.id) names.add(node.id.name);
      addScope(node, names);
    }

    if (node.type === "BlockStatement" && !isFunctionBody(node, ast)) {
      // Block scope for let/const
      const names = new Set();
      collectBlockDeclarations(node, names);
      if (names.size > 0) {
        addScope(node, names);
      }
    }

    if (node.type === "CatchClause") {
      const names = new Set();
      if (node.param) collectBindingNames(node.param, names);
      addScope(node, names);
    }

    if (
      node.type === "ForStatement" ||
      node.type === "ForInStatement" ||
      node.type === "ForOfStatement"
    ) {
      const names = new Set();
      if (node.type === "ForStatement" && node.init?.type === "VariableDeclaration") {
        for (const decl of node.init.declarations) {
          collectBindingNames(decl.id, names);
        }
      }
      if (
        (node.type === "ForInStatement" || node.type === "ForOfStatement") &&
        node.left?.type === "VariableDeclaration"
      ) {
        for (const decl of node.left.declarations) {
          collectBindingNames(decl.id, names);
        }
      }
      if (names.size > 0) addScope(node, names);
    }
  });

  return scopes;
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

function collectPatternNames(varDecl, names) {
  for (const decl of varDecl.declarations) {
    collectBindingNames(decl.id, names);
  }
}

function collectVarDeclarations(block, names) {
  // Recursively find all `var` declarations (they're function-scoped)
  walkNode(block, (node) => {
    if (node.type === "VariableDeclaration" && node.kind === "var") {
      collectPatternNames(node, names);
    }
  }, /* skipFunctions */ true);
}

function collectBlockDeclarations(block, names) {
  // Only top-level let/const in this block (not nested blocks)
  for (const stmt of block.body) {
    if (stmt.type === "VariableDeclaration" && (stmt.kind === "let" || stmt.kind === "const")) {
      collectPatternNames(stmt, names);
    }
    if (stmt.type === "FunctionDeclaration" && stmt.id) {
      names.add(stmt.id.name);
    }
  }
}

/**
 * Simple AST walker that visits every node.
 */
function walkNode(node, visitor, skipFunctions = false) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walkNode(child, visitor, skipFunctions);
    return;
  }
  if (!node.type) return;

  // Skip into nested functions if requested (for var hoisting)
  if (
    skipFunctions &&
    (node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression")
  ) {
    return;
  }

  visitor(node);

  for (const key of Object.keys(node)) {
    if (key === "type" || key === "start" || key === "end" || key === "loc" || key === "range") continue;
    const child = node[key];
    if (child && typeof child === "object") {
      walkNode(child, visitor, skipFunctions);
    }
  }
}

function isFunctionBody(blockNode, ast) {
  // Check if a block statement is the body of a function
  let found = false;
  walkNode(ast, (node) => {
    if (
      (node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression") &&
      node.body === blockNode
    ) {
      found = true;
    }
  });
  return found;
}

/**
 * Find all Identifier references that should be renamed.
 * Returns array of { start, end, oldName, newName }.
 */
function findRenamableReferences(ast, aliasMap, scopes) {
  const replacements = [];
  const aliasNames = new Set(aliasMap.keys());

  walkNode(ast, (node) => {
    if (node.type !== "Identifier") return;
    if (!aliasNames.has(node.name)) return;

    // Check if this identifier is in a declaration position (skip those)
    // We only want references, not declarations
    // The parent context matters, but since we don't track parents in our simple walker,
    // we use the scope check: if the name is declared in an enclosing scope at this position,
    // it's a local variable, not the import alias.

    const isDeclaredLocally = isNameDeclaredAt(node.name, node.start, scopes);
    if (isDeclaredLocally) return;

    replacements.push({
      start: node.start,
      end: node.end,
      oldName: node.name,
      newName: aliasMap.get(node.name),
    });
  });

  // Sort by position descending so we can replace from end to start
  replacements.sort((a, b) => b.start - a.start);
  return replacements;
}

/**
 * Check if a name is declared in any scope that contains the given position.
 * The module scope's import declarations SHOULD NOT count as "locally declared"
 * because the old alias name is NOT the current import name.
 * We skip the outermost (module) scope since it has the NEW import names, not old aliases.
 */
function isNameDeclaredAt(name, pos, scopes) {
  // Skip first scope (module scope) — old aliases aren't in it (imports were renamed)
  for (let i = 1; i < scopes.length; i++) {
    const scope = scopes[i];
    if (pos >= scope.start && pos <= scope.end && scope.names.has(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Apply replacements to source code.
 */
function applyReplacements(code, replacements) {
  let result = code;
  // Replacements are sorted descending by start position
  for (const { start, end, newName } of replacements) {
    result = result.substring(0, start) + newName + result.substring(end);
  }
  return result;
}

// ════════════════════════════════════════════════════════════════════
// 3. CSS EXTRACTION
// ════════════════════════════════════════════════════════════════════

function extractCSS(code, fileName) {
  // Find CSS arrays like:
  //   var K = ["@supports ...", ".framer-xxx { ... }", ...]
  // or:  K = [...css strings...], s = withCSS(J, K, "framer-xxx")
  const cssBlocks = [];
  const cssArrayRegex = /(?:var\s+)?(\w+)\s*=\s*\[([\s\S]*?)\](?:\s*[,;])/g;
  let match;

  while ((match = cssArrayRegex.exec(code)) !== null) {
    const content = match[2];
    // Check if this looks like CSS (contains selectors, properties, media queries)
    if (
      content.includes("framer-") &&
      (content.includes("display:") ||
        content.includes("display :") ||
        content.includes("flex-direction") ||
        content.includes("@supports") ||
        content.includes("@media") ||
        content.includes("align-") ||
        content.includes("position:"))
    ) {
      // Extract individual CSS strings
      const strings = [];
      const strRegex = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g;
      let strMatch;
      while ((strMatch = strRegex.exec(content)) !== null) {
        strings.push(strMatch[1] || strMatch[2] || "");
      }

      // Also handle template literals with ${...} interpolation
      const tplRegex = /`((?:[^`\\]|\\.)*)`/g;
      while ((strMatch = tplRegex.exec(content)) !== null) {
        strings.push(strMatch[1]);
      }

      if (strings.length > 0) {
        cssBlocks.push({
          varName: match[1],
          css: strings.join("\n\n"),
          fullMatch: match[0],
        });
      }
    }
  }

  return cssBlocks;
}

function formatCSS(rawCSS) {
  // Basic CSS formatting: add newlines and indentation
  let css = rawCSS;

  // Unescape any JS string escapes
  css = css.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");

  // Add newlines after { and before }
  css = css.replace(/\{/g, " {\n  ");
  css = css.replace(/\}/g, "\n}\n");

  // Add newlines after ;
  css = css.replace(/;\s*/g, ";\n  ");

  // Clean up extra whitespace
  css = css.replace(/\n\s*\n\s*\n/g, "\n\n");
  css = css.replace(/  \n\}/g, "\n}");

  return css.trim();
}

// ════════════════════════════════════════════════════════════════════
// 4. CHUNK RENAMING
// ════════════════════════════════════════════════════════════════════

const CHUNK_RENAMES = {
  "chunk-42u43nkg.mjs": "chunk--empty-stub-2.mjs",         // Empty file
  "chunk-4r3p5dn4.mjs": "chunk--video-component-controls.mjs", // Video component fit/source enums + border radius
  "chunk-hvoa2pey.mjs": "chunk--inter-bold-font-loader.mjs",   // Inter Bold font definitions
  "chunk-wxiqhdcd.mjs": "chunk--page-metadata-helper.mjs",     // Generic page metadata with breakpoints
};

// Also need uppercase versions (some imports reference uppercase chunk names)
const CHUNK_RENAMES_UPPER = {};
for (const [oldName, newName] of Object.entries(CHUNK_RENAMES)) {
  // The imports use the uppercase hash: chunk-4R3P5DN4.mjs
  const upperOld = oldName.replace(/chunk-([a-z0-9]+)/, (_, hash) => `chunk-${hash.toUpperCase()}`);
  CHUNK_RENAMES_UPPER[upperOld] = newName;
}

function renameChunkImports(code) {
  let result = code;
  for (const [oldName, newName] of Object.entries(CHUNK_RENAMES)) {
    result = result.replaceAll(`./${oldName}`, `./${newName}`);
  }
  for (const [oldName, newName] of Object.entries(CHUNK_RENAMES_UPPER)) {
    result = result.replaceAll(`./${oldName}`, `./${newName}`);
  }
  // Also handle the filename without ./
  for (const [oldName, newName] of Object.entries(CHUNK_RENAMES)) {
    result = result.replaceAll(`"${oldName}"`, `"${newName}"`);
    result = result.replaceAll(`'${oldName}'`, `'${newName}'`);
  }
  return result;
}

// ════════════════════════════════════════════════════════════════════
// 5. HEADER COMMENT CLEANUP
// ════════════════════════════════════════════════════════════════════

function removeAliasHeader(code) {
  // Remove the "Import aliases resolved" comment block since aliases are now resolved in the body
  return code.replace(/\/\*\*\s*\n\s*\*\s*Import aliases resolved:[\s\S]*?\*\/\n?/g, "");
}

// ════════════════════════════════════════════════════════════════════
// 6. ROUTER FILE FIX — special handling for script_main--router.mjs
// ════════════════════════════════════════════════════════════════════

function fixRouterFile(code, aliasMap) {
  // The router uses variables like g, e, o etc. from imports that were renamed
  // but the body still uses old names. We need to fix this specifically.
  // Since the router has minimal nesting, regex is mostly safe here.

  // But we'll use the same AST approach
  return code; // handled by the general AST approach
}

// ════════════════════════════════════════════════════════════════════
// MAIN PROCESSING
// ════════════════════════════════════════════════════════════════════

function processFile(filePath) {
  const fileName = basename(filePath);
  let code = readFileSync(filePath, "utf-8");

  if (!code.trim() || fileName === "ROUTE_MAP.md" || fileName === "docs-links.mjs") {
    return { code, changed: false, cssFiles: [] };
  }

  // Skip the mega runtime chunk — it's the source of exports, not a consumer
  if (fileName === "chunk--react-and-framer-runtime.mjs") {
    return { code, changed: false, cssFiles: [] };
  }

  // 1. Parse alias map from header
  const aliasMap = parseAliasHeader(code);

  let changed = false;
  let cssFiles = [];

  // 2. AST-based renaming of stale aliases in body
  if (aliasMap.size > 0) {
    try {
      // Strip the header comment temporarily for cleaner AST parsing
      const codeWithoutHeader = removeAliasHeader(code);

      const ast = acorn.parse(codeWithoutHeader, {
        ecmaVersion: 2022,
        sourceType: "module",
        allowImportExportEverywhere: true,
      });

      const scopes = buildScopes(ast);
      const replacements = findRenamableReferences(ast, aliasMap, scopes);

      if (replacements.length > 0) {
        code = applyReplacements(codeWithoutHeader, replacements);
        changed = true;
        console.log(`    ${replacements.length} alias references renamed`);
      } else {
        code = codeWithoutHeader;
      }
    } catch (err) {
      console.warn(`    ⚠ AST parse failed, falling back to regex: ${err.message}`);
      // Fallback: try regex-based for 2+ char aliases only
      code = removeAliasHeader(code);
      code = regexFallbackRename(code, aliasMap);
      changed = true;
    }
  }

  // 3. Rename chunk imports
  const beforeChunkRename = code;
  code = renameChunkImports(code);
  if (code !== beforeChunkRename) changed = true;

  // 4. Extract CSS
  const cssBlocks = extractCSS(code, fileName);
  if (cssBlocks.length > 0) {
    const baseName = fileName.replace(".mjs", "");
    for (let i = 0; i < cssBlocks.length; i++) {
      const cssFileName = cssBlocks.length === 1
        ? `${baseName}.css`
        : `${baseName}.${i + 1}.css`;
      const formatted = formatCSS(cssBlocks[i].css);
      cssFiles.push({ fileName: cssFileName, content: formatted });
    }
    // Add a comment referencing the extracted CSS
    if (cssFiles.length > 0) {
      const cssRefs = cssFiles.map(f => f.fileName).join(", ");
      code = `/* CSS extracted to: ${cssRefs} */\n` + code;
      changed = true;
    }
  }

  return { code, changed, cssFiles };
}

/**
 * Regex fallback for files that can't be parsed by acorn.
 * Only renames 2+ char aliases to avoid false positives.
 */
function regexFallbackRename(code, aliasMap) {
  for (const [oldName, newName] of aliasMap) {
    if (oldName.length < 2) continue;
    const regex = new RegExp(
      `(?<![a-zA-Z0-9_$\\.])${escapeRegex(oldName)}(?![a-zA-Z0-9_])`,
      "g"
    );
    code = code.replace(regex, newName);
  }
  return code;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════

function main() {
  console.log("Phase 3 Deobfuscation: scope-aware body renaming\n");
  console.log("═".repeat(60));

  // Create CSS output directory
  if (!existsSync(CSS_DIR)) {
    mkdirSync(CSS_DIR, { recursive: true });
  }

  const files = readdirSync(DEOB_DIR).filter(f => f.endsWith(".mjs"));
  console.log(`\nProcessing ${files.length} files...\n`);

  let renamedCount = 0;
  let cssCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = join(DEOB_DIR, file);
    console.log(`  ${file}`);

    try {
      const { code, changed, cssFiles } = processFile(filePath);

      if (changed) {
        writeFileSync(filePath, code);
        renamedCount++;
      }

      for (const css of cssFiles) {
        const cssPath = join(CSS_DIR, css.fileName);
        writeFileSync(cssPath, css.content);
        cssCount++;
        console.log(`    → extracted ${css.fileName}`);
      }
    } catch (err) {
      console.error(`    ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  // Rename chunk files
  console.log("\n" + "═".repeat(60));
  console.log("Renaming chunks...\n");
  for (const [oldName, newName] of Object.entries(CHUNK_RENAMES)) {
    const oldPath = join(DEOB_DIR, oldName);
    const newPath = join(DEOB_DIR, newName);
    if (existsSync(oldPath)) {
      const content = readFileSync(oldPath, "utf-8");
      writeFileSync(newPath, content);
      // Remove old file by writing empty + removing
      writeFileSync(oldPath, ""); // Mark for git
      console.log(`  ${oldName} → ${newName}`);
    }
  }

  // Update import references in ALL files to use new chunk names
  console.log("\nUpdating chunk references across all files...\n");
  const allFiles = readdirSync(DEOB_DIR).filter(f => f.endsWith(".mjs"));
  for (const file of allFiles) {
    const filePath = join(DEOB_DIR, file);
    const code = readFileSync(filePath, "utf-8");
    const updated = renameChunkImports(code);
    if (updated !== code) {
      writeFileSync(filePath, updated);
      console.log(`  ✓ Updated imports in ${file}`);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`\n✓ Phase 3 complete:`);
  console.log(`  ${renamedCount} files with alias renames`);
  console.log(`  ${cssCount} CSS files extracted`);
  console.log(`  ${Object.keys(CHUNK_RENAMES).length} chunks renamed`);
  if (errorCount) console.log(`  ${errorCount} errors`);
}

main();
