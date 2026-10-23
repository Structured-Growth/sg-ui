// Run against an already installed packed fixture; never installs, packs or writes dist.
// node scripts/audit-packed-import-boundaries.mjs /absolute/fixture /absolute/receipt.json
import assert from 'node:assert/strict';
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
const [fixtureArg, receiptArg] = process.argv.slice(2);
assert(fixtureArg && receiptArg, 'Pass an installed packed fixture directory and receipt path');
const fixture = resolve(fixtureArg), receipt = resolve(receiptArg);
const requireFixture = createRequire(resolve(fixture, 'package.json'));
const { build } = await import(pathToFileURL(requireFixture.resolve('vite')).href);
const fixtureManifest = JSON.parse(await readFile(resolve(fixture, 'package.json'), 'utf8'));
const packedDependency = fixtureManifest.dependencies?.['@structured-growth/sg-ui'];
assert(typeof packedDependency === 'string' && /^file:.*\.tgz$/.test(packedDependency), 'Fixture must install a local packed tarball');
const tarballPath = resolve(fixture, packedDependency.slice(5));
const tarballSha256 = hashBytes(await readFile(tarballPath));
function hashBytes(value) { return createHash('sha256').update(value).digest('hex'); }
const packagePath = requireFixture.resolve('@structured-growth/sg-ui/package.json');
const packageBytes = await readFile(packagePath);
const hash = value => createHash('sha256').update(value).digest('hex');
const cases = [
  ['tokens', 'tokens'], ['theme', 'Provider'], ['primitives', 'Typography'],
  ['hooks', 'normalizePaginationModel'], ['adapters', 'SGNavigationProvider'],
  ['i18n', 'SGTranslationProvider'], ['icons/AddIcon', 'AddIcon'],
  ['components/Button', 'Button'], ['components/CourseCardFrame', 'CourseCardFrame'],
  ['components/SideNavigation', 'SideNavigation'], ['components/DataToolbar', 'DataToolbar'],
  ['components/AppDataGrid', 'AppDataGrid'],
  ['components/PageRichTextEditorSection', 'PageRichTextEditorSection'],
  ['', 'Button'],
];
const selected = process.argv[4] === '--only' ? process.argv[5]?.split(',') : undefined;
assert(process.argv.length <= 4 || process.argv[4] === '--only' && selected?.length && selected.every(key => cases.some(([subpath]) => (subpath || '.') === key)), 'Use --only with existing comma-separated subpaths');
const records = [];
try {
  for (const [subpath, symbol] of cases.filter(([subpath]) => !selected || selected.includes(subpath || '.'))) {
    const specifier = '@structured-growth/sg-ui' + (subpath ? '/' + subpath : '');
    const input = `import { ${symbol} } from ${JSON.stringify(specifier)}; export { ${symbol} };\nimport '@structured-growth/sg-ui/styles.css';`;
    let modules = [];
    const output = await build({ root: fixture, configFile: false, logLevel: 'error', plugins: [{
      name: 'sgui-packed-import-boundaries',
      resolveId(id) { if (id === 'sgui-boundary-entry' || id === resolve(fixture, 'sgui-boundary-entry')) return '\0sgui-boundary-entry'; },
      load(id) { if (id === '\0sgui-boundary-entry') return input; },
      generateBundle() { modules = [...this.getModuleIds()].sort(); },
    }], build: { write: false, lib: { entry: 'sgui-boundary-entry', formats: ['es'], fileName: 'boundary' },
      rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'] } } });
    const assets = (Array.isArray(output) ? output : [output]).flatMap(item => item.output);
    const included = assets.filter(x => x.type === 'chunk').flatMap(x => Object.entries(x.modules)
      .filter(([, info]) => info.renderedLength > 0).map(([id, info]) => ({ id, renderedLength: info.renderedLength })));
    const css = assets.filter(x => x.type === 'asset' && x.fileName.endsWith('.css'));
    const lexical = id => /(?:\/|@)lexical(?:\/|[-+])/.test(id);
    const grid = id => /@tanstack|\/components\/AppDataGrid\//.test(id);
    const wrapper = id => /\/experimental\/icons\/[^/]+Icon\.js$/.test(id);
    const record = { subpath: subpath || '.', symbol, input, resolvedModules: modules,
      includedModules: included, resolvedLexical: modules.filter(lexical),
      resolvedGrid: modules.filter(grid), resolvedIconWrappers: modules.filter(wrapper),
      includedIconWrappers: included.filter(x => wrapper(x.id)),
      outputs: assets.map(x => ({ fileName: x.fileName, bytes: Buffer.byteLength(x.type === 'chunk' ? x.code : x.source),
        sha256: hash(x.type === 'chunk' ? x.code : x.source), gzipLevel9Bytes: gzipSync(x.type === 'chunk' ? x.code : x.source, {level:9}).length })) };
    records.push(record);
    assert.equal(css.length, 1, specifier + ' lost explicit CSS');
    assert(String(css[0].source).includes('--sgui-action'), specifier + ' lost token CSS');
    if (subpath && subpath !== 'components/PageRichTextEditorSection') {
      assert.equal(record.resolvedLexical.length, 0, specifier + ' traversed editor dependencies');
    }
    if (subpath && subpath !== 'components/AppDataGrid') {
      assert.equal(record.resolvedGrid.length, 0, specifier + ' traversed grid dependencies');
    }
    if (!subpath) {
      assert.equal(included.filter(x => lexical(x.id)).length, 0, 'Root Button retained editor implementation');
      assert.equal(included.filter(x => grid(x.id)).length, 0, 'Root Button retained grid implementation');
    }
    if (['tokens', 'components/CourseCardFrame'].includes(subpath)) assert(!modules.some(id => /react-aria|react-stately|@react-aria|@react-stately/.test(id)), specifier + ' traversed interaction foundation');
    if (subpath === 'components/AppDataGrid') assert(record.resolvedGrid.some(id => id.includes('@tanstack')), 'Grid positive control missing');
    if (subpath === 'components/PageRichTextEditorSection') assert(record.resolvedLexical.length > 0, 'Editor positive control missing');
    if (subpath === 'icons/AddIcon') {
      assert.equal(record.resolvedIconWrappers.length, 1, 'Individual icon traversed SGUI catalog');
      assert(record.includedIconWrappers.some(x => x.id.endsWith('/AddIcon.js')), 'Selected SGUI icon was eliminated');
      assert(included.some(x => /\/lucide-react\/.*\/icons\/plus\.m?js$/.test(x.id)), 'Selected upstream glyph missing');
      assert.equal(included.filter(x => /\/lucide-react\/.*\/icons\/[^/]+\.m?js$/.test(x.id)).length, 1, 'Individual icon retained additional upstream glyphs');
      assert(!included.some(x => /\/lucide-react\/.*\/icons\/(?:flask-conical|graduation-cap|user-round-cog)\.m?js$/.test(x.id)), 'Unrelated glyph retained');
    }
    if (['components/SideNavigation', 'components/DataToolbar', 'components/AppDataGrid'].includes(subpath)) {
      assert(!modules.some(id => /\/experimental\/icons\/index\.js$/.test(id)), specifier + ' traversed SGUI icon barrel');
    }
    record.result = 'pass';
  }
  await writeFile(receipt, JSON.stringify({ runtime: process.version, packagePath: await realpath(packagePath),
    manifestSha256: hash(packageBytes), tarballPath, tarballSha256, selected: selected || cases.map(([subpath]) => subpath || '.'), records, result: 'pass' }, null, 2) + '\n');
  console.log(`Packed import boundaries passed (${records.length} cases)`);
} catch (error) {
  await writeFile(receipt, JSON.stringify({ runtime: process.version, manifestSha256: hash(packageBytes), tarballPath, tarballSha256,
    records, result: 'fail', error: String(error.stack ?? error) }, null, 2) + '\n');
  throw error;
}
