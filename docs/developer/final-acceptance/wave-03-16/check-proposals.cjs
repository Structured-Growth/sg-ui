// Read-only TypeScript check of proposed files at their intended repository paths.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('../../../../packages/ui/node_modules/typescript');
const base = __dirname;
const repo = path.resolve(base, '../../../..');
const targets = [
  'apps/docs/native-fixtures/scenarios/adapters/adapters.fixture.tsx',
  'packages/ui/tests/browser/navigation-composed.spec.ts',
];
const overlay = new Map(targets.map(p => [path.join(repo, p), fs.readFileSync(path.join(base, 'proposed-files', p), 'utf8')]));
const configFile = path.join(repo, 'apps/docs/native-fixtures/tsconfig.json');
const config = ts.readConfigFile(configFile, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile));
const options = { ...parsed.options, incremental: false, noEmit: true, types: ['node'], typeRoots: [path.join(repo, 'packages/ui/node_modules/@types')] };
const host = ts.createCompilerHost(options);
const originalRead = host.readFile.bind(host);
const originalExists = host.fileExists.bind(host);
host.readFile = file => overlay.get(file) ?? originalRead(file);
host.fileExists = file => overlay.has(file) || originalExists(file);
const program = ts.createProgram([...overlay.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
const receipt = {
  kind: 'read-only TypeScript proposal overlay; no runtime or native execution',
  node: process.version, typescript: ts.version, command: 'node docs/developer/final-acceptance/wave-03-16/check-proposals.cjs',
  inputs: Object.fromEntries([...overlay].map(([p, s]) => [path.relative(repo, p), crypto.createHash('sha256').update(s).digest('hex')])),
  diagnostics: diagnostics.map(d => ({ file: d.file && path.relative(repo, d.file.fileName), code: d.code, line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null, message: ts.flattenDiagnosticMessageText(d.messageText, '\n') })),
};
fs.writeFileSync(path.join(base, 'proposal-typecheck.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = diagnostics.length ? 1 : 0;
