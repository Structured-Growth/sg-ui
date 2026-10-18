// Static virtual-source check only. No builds, browser launch or fixture mutation.
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const root = path.resolve(__dirname, '../../../../..');
const requireUI = createRequire(path.join(root, 'packages/ui/package.json'));
const ts = requireUI('typescript');
const targets = [
  'apps/docs/native-fixtures/scenarios/experimental/FormParticipation/FormParticipation.fixture.tsx',
  'packages/ui/tests/browser/wave04-form-participation.spec.ts',
  'packages/ui/playwright.form-participation-wave04.config.ts',
];
const overlay = new Map(targets.map(relative => [path.join(root, relative), fs.readFileSync(path.join(__dirname, 'proposed-files', relative), 'utf8')]));
const configPath = path.join(root, 'packages/ui/tests/browser/tsconfig.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
const options = {...parsed.options, noEmit: true, skipLibCheck: true, typeRoots: [path.join(root, 'packages/ui/node_modules/@types')]};
const host = ts.createCompilerHost(options);
const originalExists = host.fileExists.bind(host), originalRead = host.readFile.bind(host);
host.fileExists = file => overlay.has(path.resolve(file)) || originalExists(file);
host.readFile = file => overlay.get(path.resolve(file)) ?? originalRead(file);
host.getSourceFile = (file, languageVersion) => {
  const text = host.readFile(file);
  return text === undefined ? undefined : ts.createSourceFile(file, text, languageVersion, true);
};
const program = ts.createProgram([...overlay.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) process.stdout.write(ts.formatDiagnosticsWithColorAndContext(diagnostics, {getCurrentDirectory: () => root, getCanonicalFileName: x => x, getNewLine: () => '\n'}));
const result = {kind: 'focused-static-virtual-source-types', node: process.version, typescript: ts.version, roots: targets, diagnostics: diagnostics.length, behavioralExecution: false};
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
process.exitCode = diagnostics.length ? 1 : 0;
