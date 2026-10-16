// Read-only source/Git audit. Writes only beside this script; no registry generation.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const ts = require(require.resolve('typescript', { paths: [path.join(root, 'packages/ui')] }));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(path.join(root, p));
const hashes = {};
const input = p => { const b = read(p); hashes[p] = sha(b); return b.toString(); };
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const rev = '530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^';
const initial = '21adebd61bedfc6a1ed395fe664ff4be83896821';
function inspect(text) {
  const source = ts.createSourceFile('input.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const exports = [], assertions = [], plays = [];
  function visit(n) {
    if (ts.isVariableStatement(n) && n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword))
      for (const d of n.declarationList.declarations) exports.push(d.name.getText(source));
    if ((ts.isPropertyAssignment(n) || ts.isMethodDeclaration(n)) && n.name?.getText(source) === 'play') plays.push(n.getText(source));
    if (ts.isCallExpression(n) && /^(expect|assert)(\.|\(|$)/.test(n.expression.getText(source)))
      assertions.push(n.getText(source).replace(/AppButton/g, 'Button').replace(/\s+/g, ' '));
    ts.forEachChild(n, visit);
  }
  visit(source);
  return { exports, plays, assertions };
}
const manifestPath = 'docs/extraction-manifest.json';
const manifest = JSON.parse(input(manifestPath));
const native = JSON.parse(input('apps/docs/native-fixtures/migration-manifest.json'));
const registry = JSON.parse(input('apps/docs/native-fixtures/registry.json'));
const rows = manifest.files.map(r => {
  const p = r.destination.startsWith('src/') ? 'packages/ui/' + r.destination : r.destination;
  return { source: r.source, destination: p, present: r.present, exists: fs.existsSync(path.join(root, p)), replacements: (r.migration?.replacements || []).map(p => {
    p = p.startsWith('src/') ? 'packages/ui/' + p : p;
    const exists = fs.existsSync(path.join(root, p)); if (exists) input(p);
    return { path: p, exists, sha256: hashes[p] };
  }) };
});
const stories = manifest.files.filter(r => r.source.endsWith('.stories.tsx')).map(r => {
  const p = r.destination;
  const text = git('show', `${rev}:${p}`);
  const mapping = native.modules.find(m => m.original === 'packages/ui/' + p);
  const result = { original: p, revision: git('rev-parse', rev), blob: git('rev-parse', `${rev}:${p}`), sha256: sha(text), ...inspect(text), fixture: mapping?.fixture || null };
  const initialText = git('show', `${initial}:${p}`);
  result.initialExtraction = { revision: initial, blob: git('rev-parse', `${initial}:${p}`).trim(), sha256: sha(initialText), ...inspect(initialText) };
  result.missingInitialExportsBeforeRetirement = result.initialExtraction.exports.filter(e => !result.exports.includes(e));
  if (mapping) {
  const now = inspect(input(mapping.fixture));
    result.current = now;
    result.missingExports = result.exports.filter(e => !now.exports.includes(e));
    result.missingAssertions = result.assertions.filter(a => !now.assertions.includes(a));
    result.fixtureIDs = Object.values(registry.entries).filter(e => e.module === './' + path.relative('apps/docs/native-fixtures', mapping.fixture)).map(e => e.id);
  }
  return result;
});
const history = [initial, '8f41479c6f2ea5822ff0c149e359e2c6e0893f13', rev].map(revision => {
  const p = 'src/components/AppButton/AppButton.stories.tsx', text = git('show', `${revision}:${p}`);
  return { revision: git('rev-parse', revision), path: p, blob: git('rev-parse', `${revision}:${p}`), sha256: sha(text), ...inspect(text) };
});
const oldTest = git('show', `${rev}:src/components/AppButton/AppButton.test.tsx`);
const testPath = 'packages/ui/src/components/Button/Button.public-contract.test.tsx';
const currentTest = input(testPath);
let upstream;
try { upstream = { available: true, type: git('cat-file', '-t', manifest.sourceCommit).trim() }; }
catch (e) { upstream = { available: false, exitCode: e.status, stderr: e.stderr.toString().trim() }; }
const priorPaths = ['docs/developer/final-acceptance/wave-02-13/report.md', 'docs/developer/final-acceptance/wave-02-13/results.json', 'docs/developer/final-acceptance/wave-02-14/report.md', 'docs/developer/final-acceptance/wave-02-14/results.json', 'docs/developer/final-acceptance/wave-02-15/report.md', 'docs/developer/final-acceptance/wave-02-15/results.json', 'docs/developer/final-acceptance/fix-05/validation.json', 'docs/developer/final-acceptance/fix-05/button-lineage.json', 'docs/developer/final-acceptance/coordinator-integration/evidence.json'];
priorPaths.forEach(input);
['AGENTS.md', 'docs/developer/react-aria-final-acceptance.md', 'docs/developer/docs-fixture-migration.md', 'docs/developer/react-aria-button.md', 'docs/migration.md', 'apps/docs/examples/ButtonDocumentation.tsx', 'apps/docs/examples/ButtonAdditionalExamples.tsx', 'docs/developer/react-aria-removal-audit.md', 'docs/developer/react-aria-i18n-acceptance.md', 'apps/docs/native-fixtures/generate-registry.mjs', 'apps/docs/native-fixtures/vite.config.ts', 'packages/ui/tests/browser/batch13-control-button.spec.ts', 'apps/docs/tests/button-documentation.spec.ts'].forEach(input);
const prior = JSON.parse(read('docs/developer/final-acceptance/fix-05/validation.json'));
const priorHashes = prior.inputHashes || prior.hashes || {};
const coordinator = JSON.parse(read('docs/developer/final-acceptance/coordinator-integration/evidence.json'));
const evidence = { capturedAt: new Date().toISOString(), head: git('rev-parse', 'HEAD').trim(), runtime: process.version, typescript: ts.version,
  originalProvenance: { sourceRepository: manifest.sourceRepository, sourceCommit: manifest.sourceCommit, sourceRoot: manifest.sourceRoot }, upstreamObject: upstream,
  manifestSummary: { rows: rows.length, present: rows.filter(r => r.present).length, mismatches: rows.filter(r => r.present !== r.exists).length, missingReplacements: rows.flatMap(r => r.replacements).filter(r => !r.exists).length }, rows, stories, history,
  unitContinuity: { originalRevision: git('rev-parse', rev).trim(), originalPath: 'src/components/AppButton/AppButton.test.tsx', originalBlob: git('rev-parse', `${rev}:src/components/AppButton/AppButton.test.tsx`).trim(), originalSha256: sha(oldTest), currentPath: testPath, currentSha256: sha(currentTest), equalAfterNameSubstitution: oldTest.replace(/AppButton/g, 'Button') === currentTest, assertions: inspect(currentTest).assertions },
  inputHashes: hashes, coordinatorInputComparisons: Object.entries(hashes).filter(([p]) => coordinator.inputHashes[p]).map(([p,h]) => ({path:p, equal:coordinator.inputHashes[p]===h})),
  priorReceiptComparisons: Object.entries(hashes).filter(([p]) => typeof priorHashes[p] === 'string').map(([p,h]) => ({path:p,equal:priorHashes[p]===h})),
  priorReplacementComparisons: prior.replacementChecks.map(r => {const p=r.path.startsWith('src/')?'packages/ui/'+r.path:r.path; return {path:p,equal:hashes[p]===r.sha256};}),
  limits: ['Local Git/source audit only; no runtime/browser/AT/device execution.', 'Original learner-platform commit unavailable; no other checkout or network accessed.', 'No generated registry, historical receipt, production file, or learner checkout was modified.'] };
fs.writeFileSync(path.join(__dirname, 'evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({manifest:evidence.manifestSummary, stories:stories.length, exactMappings:stories.filter(s=>s.fixture).length, missingExports:stories.filter(s=>s.missingExports?.length).map(s=>[s.original,s.missingExports]), missingAssertions:stories.filter(s=>s.missingAssertions?.length).map(s=>[s.original,s.missingAssertions.length]), storyAssertionCalls:stories.reduce((n,s)=>n+s.assertions.length,0), plays:stories.reduce((n,s)=>n+s.plays.length,0), unitContinuity:evidence.unitContinuity.equalAfterNameSubstitution, upstream}, null, 2));
