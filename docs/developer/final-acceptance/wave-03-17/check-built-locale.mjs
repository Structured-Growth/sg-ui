import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
const own = dirname(fileURLToPath(import.meta.url));
const root = resolve(own, '../../../..');
const pkgRoot = resolve(root, 'packages/ui');
const require = createRequire(resolve(pkgRoot, 'package.json'));
const { createElement: h } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');
const pkg = JSON.parse(await readFile(resolve(pkgRoot, 'package.json'), 'utf8'));
const inputs = {};
async function record(path) {
  const contents = await readFile(resolve(root, path));
  inputs[path] = createHash('sha256').update(contents).digest('hex');
  return contents.toString();
}
async function publicEntry(subpath) {
  const path = 'packages/ui/' + pkg.exports[subpath].import.replace(/^\.\//, '');
  await record(path);
  return import(pathToFileURL(resolve(root, path)).href);
}
assert.equal(process.env.TZ, 'UTC', 'Run with TZ=UTC: the formatter deliberately uses the runtime time zone.');
const { SGTranslationProvider, useTranslation, formatIcuMessage, validateIcuVariables } = await publicEntry('./i18n');
const { Provider } = await publicEntry('./theme');
for (const path of ['packages/ui/dist/i18n/icu.js', 'packages/ui/dist/experimental/Provider/Provider.js',
  'packages/ui/dist/foundation/ThemeScope.js', 'packages/ui/src/i18n/icu.ts', 'packages/ui/src/i18n/index.tsx',
  'packages/ui/src/experimental/Provider/Provider.tsx', 'packages/ui/src/foundation/ThemeScope.tsx']) await record(path);
const fixture = 'apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx';
const source = ts.createSourceFile(fixture, await record(fixture), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const messages = {};
for (const statement of source.statements) if (ts.isVariableStatement(statement)) {
  for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name)
    && ['english', 'arabic', 'pseudo'].includes(declaration.name.text) && ts.isStringLiteral(declaration.initializer)) {
    messages[declaration.name.text] = declaration.initializer.text;
  }
}
assert.equal(Object.keys(messages).length, 3);
for (const language of ['arabic', 'pseudo']) assert.deepEqual(validateIcuVariables(messages.english, messages[language]), { missing: [], extra: [] });
const cases = [];
const arabic = ['لم يتم تحديد صفوف', 'تم تحديد صف واحد', 'تم تحديد صفين', 'تم تحديد ٣ صفوف', 'تم تحديد ١١ صفًا', 'تم تحديد ١٠٠ صف'];
for (const locale of ['en-US', 'ar-EG']) {
  const message = locale === 'ar-EG' ? messages.arabic : messages.english;
  const values = [0, 1, 2, 3, 11, 100];
  for (const [index, n] of values.entries()) {
    const expected = locale === 'ar-EG' ? arabic[index] : n === 0 ? 'No rows selected' : `${n} ${n === 1 ? 'row' : 'rows'} selected`;
    assert.equal(formatIcuMessage(message, locale, { n }), expected);
    cases.push({ locale, count: n, output: expected });
  }
  const date = new Date('2026-10-16T12:00:00Z');
  const number = formatIcuMessage('{total, number}', locale, { total: 12345.5 });
  assert.equal(number, locale === 'ar-EG' ? '١٢٬٣٤٥٫٥' : '12,345.5');
  const formattedDate = formatIcuMessage('{date, date}', locale, { date });
  assert.equal(formattedDate, new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(date));
  function Probe() {
    const { t } = useTranslation();
    return h('span', { 'data-probe': '' }, t('selection', { defaultMessage: messages.english, values: { n: 11 } }), '|',
      t('number', { defaultMessage: '{total, number}', values: { total: 12345.5 } }), '|',
      t('date', { defaultMessage: '{date, date}', values: { date } }));
  }
  const html = renderToStaticMarkup(h(SGTranslationProvider, { value: {
    locale, useNamespace: () => {}, t: (key, options) => formatIcuMessage(key === 'selection' ? message : options.defaultMessage, locale, options.values),
  } }, h(Provider, null, h(Probe))));
  assert.match(html, new RegExp(`dir="${locale === 'ar-EG' ? 'rtl' : 'ltr'}"`));
  assert.match(html, new RegExp(`lang="${locale}"`));
  assert.ok(html.includes(`${locale === 'ar-EG' ? arabic[4] : '11 rows selected'}|${number}|${formattedDate}`));
  cases.push({ locale, number, date: formattedDate, providerHtml: html });
}
for (const n of [0, 1, 2, 3, 11, 100]) {
  const output = formatIcuMessage(messages.pseudo, 'en-US', { n });
  assert.ok(output.startsWith('⟦') && output.endsWith('⟧') && output.includes('ëëxpààndëëd tràànslààtïïöön'));
  assert.ok(!output.includes('{n'));
  cases.push({ locale: 'pseudo/en-US', count: n, output });
}
const prior = JSON.parse(await readFile(resolve(root, 'docs/developer/final-acceptance/parallel-14/reconciliation.json')));
const comparison = prior.inputs.filter(item => Object.hasOwn(inputs, item.file)).map(item => ({
  file: item.file, previousSha256: item.sha256, currentSha256: inputs[item.file], unchanged: item.sha256 === inputs[item.file],
}));
const receipt = { result: 'pass', runtime: process.version, versions: process.versions, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  command: 'TZ=UTC node docs/developer/final-acceptance/wave-03-17/check-built-locale.mjs',
  scope: 'Existing built public export routes; deterministic ICU and server-rendered Provider locale, not native browser, hydration or spoken AT.', inputs, comparison, cases };
await writeFile(resolve(own, 'built-locale-results.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ result: receipt.result, runtime: receipt.runtime, timezone: receipt.timezone, cases: cases.length, comparison }, null, 2));
