import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const repo = process.cwd(), own = resolve(repo, 'docs/developer/final-acceptance/wave-03-02'), root = resolve(repo, 'packages/ui');
const ts = createRequire(resolve(root, 'package.json'))('typescript');
const hash = text => createHash('sha256').update(text).digest('hex');
const patchFiles = JSON.parse(readFileSync(resolve(own, 'patch-input-hashes.json')));
const overlays = new Map(Object.keys(patchFiles).filter(path => path.startsWith('packages/ui/src/'))
  .map(path => [resolve(repo, path), readFileSync(resolve(own, 'proposed-files', path), 'utf8')]));
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
function compile(overlay) {
  const host = ts.createCompilerHost(parsed.options);
  host.getCurrentDirectory = () => root;
  const originalExists = host.fileExists, originalRead = host.readFile;
  host.fileExists = path => overlay.has(resolve(path)) || originalExists(path);
  host.readFile = path => overlay.get(resolve(path)) ?? originalRead(path);
  const program = ts.createProgram([...new Set([...parsed.fileNames, ...overlay.keys()])], { ...parsed.options, noEmit: true }, host);
  const diagnostics = ts.getPreEmitDiagnostics(program).map(d => ({ code: d.code,
    file: d.file ? relative(repo, d.file.fileName) : null,
    line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null,
    message: ts.flattenDiagnosticMessageText(d.messageText, '\n') }));
  const checker = program.getTypeChecker();
  const signatures = {};
  for (const [entry, names] of [ ['src/index.ts', ['SGLinkProps', 'SGNavigationAdapter']],
    ['src/experimental/index.ts', ['DateFieldProps', 'TimeFieldProps']],
    ['src/experimental/DateField/DateField.tsx', ['DateFieldProps']],
    ['src/experimental/TimeField/TimeField.tsx', ['TimeFieldProps']],
    ['src/adapters/navigation.tsx', ['SGLinkProps', 'SGNavigationAdapter']] ]) {
    const source = program.getSourceFile(resolve(root, entry));
    const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source));
    for (const name of names) {
      let symbol = exports.find(item => item.name === name); assert(symbol, `${entry}:${name}`);
      if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
      const type = checker.getDeclaredTypeOfSymbol(symbol);
      signatures[`${entry}:${name}`] = checker.getPropertiesOfType(type).map(property => ({
        name: property.name, optional: Boolean(property.flags & ts.SymbolFlags.Optional),
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration ?? property.declarations[0]), undefined,
          ts.TypeFormatFlags.NoTruncation),
      })).sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  return { diagnostics, signatures, inputHashes: Object.fromEntries(program.getSourceFiles()
    .filter(file => file.fileName.startsWith(resolve(root, 'src') + '/'))
    .map(file => [relative(repo, file.fileName), hash(file.text)])) };
}
const baseline = compile(new Map()), proposed = compile(overlays);
const sameContracts = JSON.stringify(baseline.signatures) === JSON.stringify(proposed.signatures);
const emittedComparisons = [...overlays].filter(([path]) => !path.endsWith('.types.ts')).map(([path, proposedText]) => {
  const before = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: parsed.options, fileName: path }).outputText;
  const after = ts.transpileModule(proposedText, { compilerOptions: parsed.options, fileName: path }).outputText;
  return { file: relative(repo, path), identical: before === after, beforeSha256: hash(before), afterSha256: hash(after) };
});
const result = { emittedComparisons, capturedAt: new Date().toISOString(), node: process.version, typescript: ts.version,
  command: 'node docs/developer/final-acceptance/wave-03-02/typecheck.mjs',
  scope: 'Source-only noEmit compiler with proposed in-memory overlay; not built/packed/runtime validation', sameContracts, baseline, proposed };
writeFileSync(resolve(own, 'typecheck.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ node: process.version, baselineDiagnostics: baseline.diagnostics, proposedDiagnostics: proposed.diagnostics,
  sameContracts, emittedComparisons, comparedContracts: Object.keys(baseline.signatures).length }, null, 2));
process.exitCode = !sameContracts || emittedComparisons.some(item => !item.identical) || proposed.diagnostics.length ? 1 : 0;
