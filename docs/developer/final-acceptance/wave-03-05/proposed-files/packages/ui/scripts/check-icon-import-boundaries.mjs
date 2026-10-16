// Prevent implementation imports from traversing the public SGUI icon catalog.
// Public reexports stay supported. Upstream Lucide tree shaking is a separate check.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = resolve(process.argv[2] ?? fileURLToPath(new URL('../src', import.meta.url)));
const ui = existsSync(resolve(process.cwd(), 'packages/ui/package.json')) ? resolve(process.cwd(), 'packages/ui') : process.cwd();
const ts = createRequire(resolve(ui, 'package.json'))('typescript');
const failures = [];
let checked = 0;
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { walk(path); continue; }
    if (!/\.tsx?$/.test(entry.name) || /\.(?:test|native-fixture)\.|\.d\.ts$/.test(entry.name)) continue;
    checked++;
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const node of source.statements) {
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      if (node.importClause?.isTypeOnly) continue;
      const bindings = node.importClause?.namedBindings;
      if (bindings?.elements?.length && bindings.elements.every(item => item.isTypeOnly)) continue;
      const specifier = node.moduleSpecifier.text;
      const target = specifier.startsWith('.') ? resolve(dirname(path), specifier) : specifier;
      if (/(?:^|\/)icons(?:\/index(?:\.[jt]s)?)?$/.test(target)) {
        failures.push(`${relative(root, path)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${specifier}`);
      }
    }
  }
}
walk(root);
assert.equal(failures.length, 0, 'Use individual icon modules in implementations:\n' + failures.join('\n'));
console.log(`Icon import boundary passed (${checked} source files)`);
