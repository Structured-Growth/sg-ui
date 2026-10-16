// Bounded read-only API extension of FA-01. Writes only alongside this script.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const out = dirname(fileURLToPath(import.meta.url));
const root = resolve(out, '../../../..');
const ui = resolve(root, 'packages/ui');
const ts = createRequire(resolve(ui, 'package.json'))('typescript');
const read = p => readFileSync(resolve(root, p), 'utf8');
const hash = s => createHash('sha256').update(s).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const baselinePath = 'docs/developer/final-acceptance/2026-10-16-inventory.json';
const baseline = JSON.parse(read(baselinePath));
const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const program = ts.createProgram(baseline.entries.map(e => resolve(ui, e.types)), {
  skipLibCheck: true, strict: true, module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext, target: ts.ScriptTarget.ES2022,
});
const checker = program.getTypeChecker();
const declarations = {}, contracts = {}, routes = {}, changedBuilt = [];
const loc = n => ({ file: relative(root, n.getSourceFile().fileName), line: n.getSourceFile().getLineAndCharacterOfPosition(n.getStart()).line + 1 });
for (const sf of program.getSourceFiles()) {
  if (!sf.fileName.startsWith(resolve(ui, 'dist') + '/')) continue;
  const path = relative(ui, sf.fileName), actual = hash(sf.text);
  declarations[relative(root, sf.fileName)] = { sha256: actual, text: sf.text };
  if (baseline.builtHashes[path] !== actual) changedBuilt.push(path);
}
// Existing route names/exports are reused, not re-inventoried or runtime-imported.
for (const entry of baseline.entries) {
  const sf = program.getSourceFile(resolve(ui, entry.types));
  if (!sf) throw new Error(`Missing ${entry.types}`);
  const symbols = checker.getExportsOfModule(checker.getSymbolAtLocation(sf));
  routes[entry.subpath] = [];
  for (const previous of entry.declaredExports) {
    let symbol = symbols.find(s => s.name === previous.name);
    if (!symbol) throw new Error(`FA-01 export no longer resolves: ${entry.subpath}:${previous.name}`);
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const ds = symbol.getDeclarations() ?? [];
    const d = symbol.valueDeclaration ?? ds[0];
    if (!d) throw new Error(`No declaration for ${previous.name}`);
    const key = `${loc(d).file}:${symbol.name}:${d.pos}`;
    routes[entry.subpath].push({ name: previous.name, contract: key });
    if (contracts[key]) continue;
    const type = previous.type ? checker.getDeclaredTypeOfSymbol(symbol) : checker.getTypeOfSymbolAtLocation(symbol, d);
    const ownProps = checker.getPropertiesOfType(type).flatMap(p => {
      const pd = p.valueDeclaration ?? p.declarations?.[0];
      if (!pd || !pd.getSourceFile().fileName.startsWith(resolve(ui, 'dist') + '/')) return [];
      const pt = checker.getTypeOfSymbolAtLocation(p, pd);
      return [{ name: p.name, optional: !!(p.flags & ts.SymbolFlags.Optional), type: checker.typeToString(pt, pd, flags),
        signatures: checker.getSignaturesOfType(checker.getNonNullableType(pt), ts.SignatureKind.Call).map(s => checker.signatureToString(s, pd, flags)),
        tags: p.getJsDocTags(checker), ...loc(pd) }];
    });
    contracts[key] = { name: symbol.name, declarations: ds.map(n => ({ ...loc(n), text: n.getText() })),
      type: checker.typeToString(type, d, flags), signatures: checker.getSignaturesOfType(type, ts.SignatureKind.Call).map(s => checker.signatureToString(s, d, flags)),
      ownedProperties: ownProps, tags: symbol.getJsDocTags(checker) };
  }
}
const sources = {}, candidates = [], deprecated = [];
for (const path of Object.keys(baseline.sourceHashes).sort()) {
  if (!/^packages\/ui\/src\/.*\.tsx?$/.test(path) || /(?:test|native-fixture|\.d\.ts)/.test(path)) continue;
  let text; try { text = read(path); } catch { continue; }
  sources[path] = { sha256: hash(text), matchesFA01: hash(text) === baseline.sourceHashes[path] };
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const walk = n => {
    if ((ts.isBindingElement(n) || ts.isParameter(n) || ts.isPropertyDeclaration(n)) && n.initializer) {
      candidates.push({ file: path, line: sf.getLineAndCharacterOfPosition(n.getStart()).line + 1,
        kind: ts.SyntaxKind[n.kind], name: n.name.getText(sf), expression: n.initializer.getText(sf) });
    }
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
      candidates.push({ file: path, line: sf.getLineAndCharacterOfPosition(n.getStart()).line + 1,
        kind: 'NullishFallback', name: n.left.getText(sf), expression: n.right.getText(sf) });
    }
    ts.forEachChild(n, walk);
  }; walk(sf);
  text.split('\n').forEach((line, i) => { if (line.includes('@deprecated')) deprecated.push({ file: path, line: i + 1, text: line.trim() }); });
}
const oldCommit = git('rev-parse', '21adebd');
const historicalPaths = ['src/theme/AppThemeProvider.tsx', 'src/theme/index.ts', 'src/theme/theme.ts', 'src/theme/mui-typography.ts',
  'src/components/primitives/index.ts', 'src/components/AppModal/AppModal.tsx', 'src/components/AppDataGrid/types.ts',
  'src/components/AppDataGrid/AppDataGrid.tsx', 'src/components/AppDataGrid/index.ts', 'src/components/AppDataGrid/createDataGridColumns.tsx',
  'src/components/CardPaginationFooter/CardPaginationFooter.tsx', 'src/models.ts'];
const historical = {};
for (const path of historicalPaths) {
  try { const text = execFileSync('git', ['show', `${oldCommit}:${path}`], { cwd: root, encoding: 'utf8' }); historical[path] = { sha256: hash(text), text }; }
  catch { historical[path] = { unavailable: true }; }
}
const receipt = { capturedAt: new Date().toISOString(), head: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'),
  baseline: { path: baselinePath, sha256: hash(read(baselinePath)), capturedAt: baseline.capturedAt, head: baseline.git.head },
  limits: ['Current declarations only; no fresh build or runtime execution.', 'Native React inherited attributes remain referenced in exact declaration text; ownedProperties omits external declaration origins.',
    'Default candidates are syntactic evidence, including private implementation defaults; not a normalized exhaustive public default contract.',
    'Historical files are a bounded initial extraction comparison; inherited upstream APIs are not recursively reconstructed.',
    'No browser/device/AT or release conformance claimed.'],
  declarationFiles: Object.keys(declarations).length, uniqueContracts: Object.keys(contracts).length,
  reusedRoutes: Object.keys(routes).length, changedBuiltDeclarationInputs: changedBuilt,
  sourceFiles: Object.keys(sources).length, changedSourceInputs: Object.entries(sources).filter(([, s]) => !s.matchesFA01).map(([p]) => p),
  defaultCandidates: candidates.length, sourceDeprecatedTags: deprecated.length, historicalCommit: oldCommit };
writeFileSync(resolve(out, 'api-snapshot.json'), JSON.stringify({ receipt, routes, contracts, declarations, sources, defaultCandidates: candidates, deprecated, historical }, null, 2) + '\n');
writeFileSync(resolve(out, 'capture-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
