const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../../../..');
const uiRequire = createRequire(path.join(root, 'packages/ui/package.json'));
const ts = uiRequire('typescript');
const postcss = uiRequire('postcss');
const proposedRoot = path.join(__dirname, 'proposed-files');
const paths = [
  'apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx',
  'apps/docs/native-fixtures/scenarios/components/SideNavigation/SideNavigation.fixture.tsx',
  'packages/ui/tests/browser/translations-locale-acceptance.spec.ts',
  'packages/ui/tests/browser/navigation-locale-motion.spec.ts',
];
const overlay = new Map(paths.map(p => [path.join(root, p), fs.readFileSync(path.join(proposedRoot, p), 'utf8')]));
const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, noEmit: true, esModuleInterop: true, types: [], lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'] };
const host = ts.createCompilerHost(options);
const fileExists = host.fileExists.bind(host), readFile = host.readFile.bind(host);
host.fileExists = p => overlay.has(p) || fileExists(p);
host.readFile = p => overlay.get(p) ?? readFile(p);
host.getSourceFile = (p, languageVersion) => { const text = host.readFile(p); return text === undefined ? undefined : ts.createSourceFile(p, text, languageVersion, true); };
const program = ts.createProgram([...overlay.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: x => x, getCurrentDirectory: () => root, getNewLine: () => '\n' });
const css = fs.readFileSync(path.join(proposedRoot, 'packages/ui/src/components/SideNavigation/SideNavigation.module.css'), 'utf8');
const tree = postcss.parse(css);
let rtl = false, forward = false, back = false, reduced = false;
tree.walkRules(rule => {
  if (rule.selector === '.menuContent:dir(rtl)') rtl = rule.nodes.some(n => n.prop === '--sgui-navigation-forward-offset' && n.value === '-1rem') && rule.nodes.some(n => n.prop === '--sgui-navigation-back-offset' && n.value === '1rem');
  if (rule.parent.type === 'atrule' && rule.parent.name === 'keyframes' && rule.selector === 'from') {
    if (rule.parent.params === 'forward') forward = rule.nodes.some(n => n.prop === 'transform' && n.value === 'translateX(var(--sgui-navigation-forward-offset))');
    if (rule.parent.params === 'back') back = rule.nodes.some(n => n.prop === 'transform' && n.value === 'translateX(var(--sgui-navigation-back-offset))');
  }
  if (rule.parent.type === 'atrule' && rule.parent.params === '(prefers-reduced-motion: reduce)') reduced = rule.nodes.some(n => n.prop === 'animation' && n.value === 'none');
});
const receipt = { runtime: process.version, typescript: ts.version, command: 'node docs/developer/final-acceptance/wave-03-17/check-proposals.cjs',
  scope: 'Four proposed files overlaid at original resolution paths; existing public built declarations. PostCSS parse and motion selector assertions, not browser motion evidence.',
  typeDiagnostics: diagnostics.length, css: { rtl, forward, back, reduced }, result: diagnostics.length === 0 && rtl && forward && back && reduced ? 'pass' : 'fail' };
fs.writeFileSync(path.join(__dirname, 'proposal-check-results.json'), JSON.stringify(receipt, null, 2)+'\n');
console.log(JSON.stringify(receipt, null, 2));
if (formatted) console.log(formatted);
process.exitCode = receipt.result === 'pass' ? 0 : 1;
