// Run after an immutable packed React 18/19 fixture has been installed by the coordinator.
// No install, package build, fixed port or modification of the original Proof is performed here.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, copyFile, readdir, realpath } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { staticConsumer } from './packed-browser.mjs';
const args = process.argv.slice(2);
assert.equal(args.length, 2, 'Usage: node scripts/test-scoped-lifecycle-consumer.mjs /absolute/installed-packed-fixture /absolute/fresh-evidence-directory');
assert(args.every(path => path.startsWith('/')), 'Use absolute paths');
const [fixture, output] = args.map(path => resolve(path));
const own = dirname(fileURLToPath(import.meta.url));
const requireFixture = createRequire(join(fixture, 'package.json'));
const { createServer, build } = await import(requireFixture.resolve('vite'));
const React = await import(requireFixture.resolve('react'));
const { renderToString } = await import(requireFixture.resolve('react-dom/server'));
assert(['18.3.1', '19.2.3'].includes(React.version), `Unreviewed fixture React version ${React.version}`);
assert.equal(typeof window, 'undefined'); assert.equal(typeof document, 'undefined');
await mkdir(output, { recursive: false }); // Fail rather than overwrite a previous receipt.
const root = join(fixture, `scope-proof-${Date.now()}`);
await mkdir(root);
await copyFile(join(own, 'scope-hydration-proof.jsx'), join(root, 'Proof.jsx'));
const proofHash = createHash('sha256').update(await readFile(join(root, 'Proof.jsx'))).digest('hex');
const installedManifestPath = requireFixture.resolve('@structured-growth/sg-ui/package.json');
const installedManifest = JSON.parse(await readFile(installedManifestPath, 'utf8'));
const installedPackageDirectory = await realpath(dirname(installedManifestPath));
assert(installedPackageDirectory.startsWith(`${await realpath(fixture)}/node_modules/`), 'Reject parent/workspace package fallback');
// The public root is ESM-only: resolve its import target, not a CJS require branch.
const packageJson = await realpath(resolve(installedPackageDirectory, installedManifest.exports['.'].import));
assert(packageJson.startsWith(`${installedPackageDirectory}/`), 'Root import target escaped installed package');
const packageEntryHash = createHash('sha256').update(await readFile(packageJson)).digest('hex');
async function hashTree(directory) {
  const hashes = {};
  async function visit(path, prefix = '') {
    for (const entry of (await readdir(path, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const key = prefix + entry.name;
      if (entry.isDirectory()) await visit(join(path, entry.name), key + '/');
      else if (entry.isFile()) hashes[key] = createHash('sha256').update(await readFile(join(path, entry.name))).digest('hex');
    }
  }
  await visit(directory);
  return hashes;
}
const packageOutputHashes = await hashTree(dirname(packageJson));
const fixtureManifestHash = createHash('sha256').update(await readFile(join(fixture, 'package.json'))).digest('hex');
const results = { packageOutputHashes, fixtureManifestHash, node: process.version, react: React.version, proofHash, packageEntry: packageJson, packageEntryHash, fixture, root, cases: [] };
try {
  for (const locale of ['ar-EG', 'fr-FR']) {
    const props = { locale, theme: 'system' };
    const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
    let html;
    try {
      const { Proof } = await server.ssrLoadModule('/Proof.jsx');
      html = renderToString(React.createElement(Proof, props));
    } finally { await server.close(); }
    assert.equal(typeof window, 'undefined'); assert.equal(typeof document, 'undefined');
    assert(html.includes('data-sgui-theme="system"') && html.includes(`lang="${locale}"`));
    assert(html.includes('2024-02-29T09:15:00') && html.includes('Leap day'));
    await writeFile(join(root, 'main.jsx'), `import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Proof } from './Proof.jsx';
import '@structured-growth/sg-ui/styles.css';
window.scopeErrors = [];
window.scopeReactRoot = hydrateRoot(document.getElementById('root'), <Proof {...${JSON.stringify(props)}} />, {onRecoverableError(error){window.scopeErrors.push(String(error));}});
`);
    await writeFile(join(root, 'index.html'), `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><link rel="icon" href="data:,"><title>Scoped lifecycle proof</title></head><body><div id="root">${html}</div><script type="module" src="/main.jsx"></script></body></html>`);
    const dist = join(root, `dist-${locale}`);
    await build({ root, build: { outDir: dist, emptyOutDir: true } });
    results.builds ??= {};
    results.builds[locale] = await hashTree(dist);
    // The production build links the extracted stylesheet in head. The JS gate below
    // captures a styled server frame; it does not measure every physical paint.
    await staticConsumer(dist, async url => {
      for (const engine of ['chromium', 'firefox', 'webkit']) {
        const browser = await ({ chromium, firefox, webkit })[engine].launch();
        try {
          for (const preference of ['light', 'dark']) {
            const context = await browser.newContext({ colorScheme: preference, reducedMotion: 'reduce', hasTouch: false });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
            let release;
            const gate = new Promise(resolve => { release = resolve; });
            await page.route('**/*.js', async route => { await gate; await route.continue(); });
            try {
              await page.goto(url, { waitUntil: 'commit' });
              const owner = page.getByTestId('owner');
              await expect(owner).toBeAttached();
              const computed = locator => locator.evaluate(element => {
                const css = getComputedStyle(element);
                return { scheme: css.colorScheme, color: css.color, background: css.backgroundColor };
              });
              await expect.poll(async () => (await computed(owner)).scheme).toBe(preference);
              assert.equal(await page.evaluate(() => window.scopeHydrated), undefined, 'JS gate failed');
              const before = await computed(owner);
              assert.equal((await computed(page.getByTestId('fixed'))).scheme, 'light');
              await page.evaluate(() => {
                window.scopeServerOwner = document.querySelector('[data-testid="owner"]');
                window.scopeServerField = document.querySelector('input[name="course"]');
              });
              // Save every server node with an ID, not just the first field. A duplicate,
              // changed ID or replaced node can break label/description associations.
              const serverContract = await page.evaluate(() => {
                window.scopeServerNodes = [...document.querySelectorAll('#root [id]')].map(node => ({ node, id: node.id }));
                const scope = document.querySelector('[data-testid="owner"]');
                return {
                  ids: window.scopeServerNodes.map(({ id }) => id),
                  wires: [...scope.querySelectorAll('input[name],textarea[name],select[name]')].map(node => ({
                    name: node.name, value: node.value, disabled: node.disabled,
                  })),
                };
              });
              results.prehydrationContracts ??= [];
              results.prehydrationContracts.push({ locale, engine, preference, contract: serverContract });
              assert(serverContract.ids.length > 1, 'Hydration identity probe is empty');
              assert.equal(serverContract.wires.find(field => field.name === 'course')?.value, 'Science');
              assert.equal(serverContract.wires.find(field => field.name === 'notes')?.value, 'Leap day');
              assert.equal(serverContract.wires.find(field => field.name === 'month.start')?.value, '2024-02-01');
              assert.equal(serverContract.wires.find(field => field.name === 'month.end')?.value, '2024-02-29');
              const fieldID = await page.getByRole('textbox', { name: 'Course name', exact: true }).getAttribute('id');
              const preIDs = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
              assert.equal(new Set(preIDs).size, preIDs.length, 'Duplicate server IDs');
              assert.equal(await page.locator('[name="date"]').inputValue(), '2024-02-29');
              assert.equal(await page.locator('[name="appointment.start"]').inputValue(), '2024-02-29T09:15:00');
              assert.deepEqual(JSON.parse(await page.locator('[name="comparison"]').inputValue()), { primary: { start: '2024-02-28', end: '2024-02-29' }, comparison: { start: '2024-02-26', end: '2024-02-27' }, mode: 'previous-period' });
              release();
              await expect.poll(() => page.evaluate(() => window.scopeHydrated)).toBe(true);
              assert(await owner.evaluate(element => element === window.scopeServerOwner), 'Server scope replaced');
              assert(await page.locator('input[name="course"]').evaluate(element => element === window.scopeServerField), 'Server field replaced');
              await expect(page.getByRole('textbox', { name: 'Course name', exact: true })).toHaveAttribute('id', fieldID);
              const hydratedContract = await page.evaluate(() => {
                const scope = document.querySelector('[data-testid="owner"]');
                return {
                  preserved: window.scopeServerNodes.every(({ node, id }) => node.isConnected && node.id === id && document.getElementById(id) === node),
                  wires: [...scope.querySelectorAll('input[name],textarea[name],select[name]')].map(node => ({ name: node.name, value: node.value, disabled: node.disabled })),
                  descriptions: [...document.querySelectorAll('#root [aria-labelledby],#root [aria-describedby]')].every(node =>
                    ['aria-labelledby', 'aria-describedby'].every(attr => (node.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean).every(id => document.getElementById(id)))),
                };
              });
              // Keep the exact server/hydrated observations in the failure receipt too.
              results.hydrationContracts ??= [];
              results.hydrationContracts.push({ locale, engine, preference, server: serverContract, hydrated: hydratedContract });
              assert(hydratedContract.preserved, 'A server ID-bearing node was replaced or changed ID');
              assert(hydratedContract.descriptions, 'Unresolved initial hydrated label/description reference');
              assert.deepEqual(hydratedContract.wires, serverContract.wires, 'Hydration changed initial native form values or disabled state');
              assert.deepEqual(await computed(owner), before, 'Hydration changed initial theme');
              await expect(owner).toHaveAttribute('lang', locale);
              await expect(owner).toHaveAttribute('dir', locale === 'ar-EG' ? 'rtl' : 'ltr');
              await expect(page.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue('Leap day');
              const nextPreference = preference === 'dark' ? 'light' : 'dark';
              await page.emulateMedia({ colorScheme: nextPreference });
              await expect.poll(async () => (await computed(owner)).scheme).toBe(nextPreference);
              assert.equal((await computed(page.getByTestId('fixed'))).scheme, 'light');
              const siblingBefore = await computed(page.getByTestId('sibling'));
              await page.getByRole('button', { name: 'Open help', exact: true }).click();
              await page.getByRole('button', { name: 'Open actions', exact: true }).click();
              const menu = page.getByRole('menu', { name: 'Scope actions', exact: true });
              await expect(menu).toBeVisible();
              await menu.evaluate(element => { window.scopeOpenMenu = element; });
              // Host-side state changes while modal content is open; deliberately
              // programmatic rather than misreported as a user click through inert content.
              await page.evaluate(() => document.dispatchEvent(new Event('sgui-acceptance-scope-update')));
              await expect(owner).toHaveAttribute('lang', 'fr-FR');
              await page.emulateMedia({ colorScheme: 'light' });
              await expect.poll(async () => (await computed(owner)).scheme).toBe('dark');
              assert.equal((await computed(page.getByTestId('fixed'))).scheme, 'light');
              const portal = menu.locator('xpath=ancestor::*[@data-sgui-scope][1]');
              await expect(portal).toHaveAttribute('data-sgui-theme', 'dark');
              await expect(portal).toHaveAttribute('data-sgui-density', 'compact');
              await expect(portal).toHaveAttribute('dir', 'ltr');
              await expect(portal).toHaveAttribute('lang', 'fr-FR');
              assert(await menu.evaluate(element => element === window.scopeOpenMenu), 'Live menu remounted');
              await expect.poll(async () => (await computed(portal)).background).toBe('rgb(23, 37, 84)');
              assert.equal(await portal.evaluate(element => element.style.width), '', 'Layout leaked to portal');
              assert.deepEqual(await computed(page.getByTestId('sibling')), siblingBefore, 'Sibling theme leaked');
              await page.keyboard.press('Escape'); await expect(menu).toHaveCount(0);
              await expect(page.getByRole('button', { name: 'Open actions', exact: true })).toBeFocused();
              await page.keyboard.press('Escape');
              await expect(page.getByRole('button', { name: 'Open help', exact: true })).toBeFocused();
              const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
              assert.equal(new Set(ids).size, ids.length, 'Duplicate hydrated IDs');
              assert(await page.locator('[aria-labelledby], [aria-describedby]').evaluateAll(nodes => nodes.every(node => ['aria-labelledby', 'aria-describedby'].every(attr => (node.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean).every(id => document.getElementById(id))))), 'Unresolved hydrated IDREF');
              assert.deepEqual(await page.evaluate(() => window.scopeErrors), [], 'Recoverable hydration errors');
              assert.deepEqual(errors, [], 'Browser diagnostics');
              results.cases.push({ locale, engine, browser: browser.version(), preference, nextPreference, prehydrationStyled: before, passed: true });
            } finally { release(); await context.close(); }
          }
        } finally { await browser.close(); }
      }
    });
  }
  assert.deepEqual(await hashTree(dirname(packageJson)), packageOutputHashes, 'Installed package output changed during validation');
  results.status = 'passed';
} catch (error) { results.status = 'failed'; results.failure = String(error.stack ?? error); throw error; }
finally { await writeFile(join(output, 'scope-lifecycle.json'), JSON.stringify(results, null, 2)); }
