// Read-only reconciliation. Run from the repository root; writes only beside this script.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(`${process.cwd()}/packages/ui/package.json`);
const postcss = require('postcss');
const hash = data => createHash('sha256').update(data).digest('hex');
const read = path => readFile(path, 'utf8');
const snapshot = JSON.parse(await read('docs/developer/final-acceptance/2026-10-16-inventory.json'));
const sourceSnapshot = JSON.parse(await read('docs/developer/final-acceptance/2026-10-16-source-inventory.json'));
const files = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await visit(path);
    else files.push(path);
  }
}
await visit('packages/ui/src');
const cssFiles = files.filter(path => path.endsWith('.css')).sort();
const checker = await read('packages/ui/scripts/check-foundations.mjs');
const migrated = [...checker.match(/const migratedDirectories = \[([^;]+)\];/)[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
const roots = ['foundation', 'experimental', 'icons', 'primitives', 'theme', ...migrated.map(name => `components/${name}`)].map(path => `packages/ui/src/${path}/`);
const moduleFiles = cssFiles.filter(path => path.endsWith('.module.css'));
const uncovered = moduleFiles.filter(path => !roots.some(root => path.startsWith(root)));
const relevant = [...new Set([...cssFiles, ...[
  'packages/ui/package.json', 'packages/ui/tsconfig.build.json',
  'packages/ui/scripts/build.mjs', 'packages/ui/scripts/css-modules.mjs',
  'packages/ui/scripts/css-modules.test.mjs', 'packages/ui/scripts/CSSPipeline.next100-regression.test.mjs',
  'packages/ui/scripts/check-component-css.mjs', 'packages/ui/scripts/check-component-css.test.mjs',
  'packages/ui/scripts/check-foundations.mjs', 'packages/ui/scripts/check-package.mjs',
  'packages/ui/scripts/tokens.mjs', 'packages/ui/src/foundation/tokens.json',
  'README.md', 'docs/developer/component-architecture.md', 'docs/developer/react-aria-architecture.md',
  'docs/developer/react-aria-css-lint.md', 'docs/developer/react-aria-adoption-checklist.md',
]])].sort();
const comparisons = [];
for (const path of relevant) {
  const sha256 = hash(await readFile(path));
  const expected = sourceSnapshot.inputHashes[path] ?? snapshot.sourceHashes[path];
  comparisons.push({ path, sha256, snapshotSha256: expected ?? null, unchanged: expected === sha256 });
}
const outputs = [];
for (const [path, expected] of Object.entries(snapshot.builtHashes).filter(([path]) => path.endsWith('.css') || path.endsWith('.module.css.js'))) {
  const sha256 = hash(await readFile(`packages/ui/${path}`));
  outputs.push({ path: `packages/ui/${path}`, sha256, snapshotSha256: expected, unchanged: sha256 === expected });
}
const important = [], ids = [], unlayered = [], hostCandidates = [];
const layers = new Set();
const css = await read('packages/ui/dist/styles.css');
const tree = postcss.parse(css);
let ruleCount = 0;
tree.walkAtRules('layer', rule => layers.add(rule.params));
tree.walkRules(rule => {
  ruleCount++;
  let layer;
  for (let node = rule.parent; node; node = node.parent) if (node.type === 'atrule' && node.name === 'layer') { layer = node.params; break; }
  if (!layer) unlayered.push({ line: rule.source.start.line, selector: rule.selector });
  if (/#[-_a-zA-Z]/.test(rule.selector)) ids.push({ line: rule.source.start.line, selector: rule.selector });
  if (/(^|[\s,>(+~])(?:html|body|:root)(?=$|[\s,.:[)>+~])/.test(rule.selector)) hostCandidates.push({ line: rule.source.start.line, selector: rule.selector });
});
for (const path of cssFiles) {
  postcss.parse(await read(path)).walkDecls(decl => {
    if (decl.important) important.push({ path, line: decl.source.start.line, selector: decl.parent.selector, property: decl.prop, value: decl.value });
  });
}
const receipt = {
  capturedAt: new Date().toISOString(), head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  branch: execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim(),
  limits: 'Read-only source/output comparison and PostCSS inventory; not a build, test rerun, specificity calculator, browser, device or AT result.',
  sourceComparison: { files: comparisons.length, differences: comparisons.filter(item => !item.unchanged), entries: comparisons },
  outputComparison: { files: outputs.length, differences: outputs.filter(item => !item.unchanged), entries: outputs },
  css: { files: cssFiles.length, modules: moduleFiles.length, uncoveredModules: uncovered,
    nonModules: cssFiles.filter(path => !path.endsWith('.module.css')), emittedRuleCount: ruleCount,
    emittedLayers: [...layers], unlayeredRules: unlayered, idSelectorCandidates: ids, hostSelectorCandidates: hostCandidates,
    uncompiledModuleSyntax: /:(?:global|local)\(/.test(css), important },
};
await writeFile(new URL('inspection.json', import.meta.url), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ head: receipt.head, sources: comparisons.length, sourceDifferences: receipt.sourceComparison.differences,
  outputs: outputs.length, outputDifferences: receipt.outputComparison.differences, css: receipt.css }, null, 2));
