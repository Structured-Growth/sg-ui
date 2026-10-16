import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { inspectSourceGraph, assertSourceGraph } from './proposed-files/packages/ui/scripts/check-source-graph.mjs';
import { runSourceGraphRegression } from './proposed-files/packages/ui/scripts/check-source-graph.test.mjs';
const root = process.cwd(), dir = resolve(root, 'docs/developer/final-acceptance/wave-03-02');
const ui = resolve(root, 'packages/ui');
const require = createRequire(resolve(ui, 'package.json')), ts = require('typescript');
const sha = value => createHash('sha256').update(value).digest('hex');
const overlays = new Map();
function collect(dir) { for (const item of readdirSync(dir, { withFileTypes: true })) {
  if (item.isDirectory()) collect(resolve(dir, item.name));
  else if (item.isFile() && /\.[cm]?[jt]sx?$/.test(item.name)) {
    const file = resolve(dir, item.name), rel = relative(resolve(root, 'docs/developer/final-acceptance/wave-03-02/proposed-files/packages/ui'), file);
    if (rel.startsWith('src/')) overlays.set(resolve(ui, rel), readFileSync(file, 'utf8'));
  }
} }
collect(resolve(dir, 'proposed-files/packages/ui'));
const current = inspectSourceGraph(ui), proposed = inspectSourceGraph(ui, { overlays });
const summarize = graph => ({ modules: graph.files.length, edges: graph.edges.length, violations: graph.violations,
  runtimeCycles: graph.runtimeCycles, typeInvolvingCycles: graph.typeInvolvingCycles,
  inputHashes: Object.fromEntries(Object.entries(graph.contents).map(([path, code]) => [path, sha(code)])) });
let regression, error;
try { assertSourceGraph(proposed); regression = runSourceGraphRegression(ui, overlays); } catch (e) { error = e.stack; }
const receipt = { capturedAt: new Date().toISOString(), node: process.version, typescript: ts.version,
  scope: 'Pure Node source graph and in-memory proposed overlay; no applied source or runtime/native acceptance',
  current: summarize(current), proposed: summarize(proposed), regression, error };
writeFileSync(resolve(dir, 'graph-validation.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ current: { modules: current.files.length, cycles: current.allCycles, violations: current.violations },
  proposed: { modules: proposed.files.length, cycles: proposed.allCycles, violations: proposed.violations }, regression, error }, null, 2));
process.exitCode = error ? 1 : 0;
