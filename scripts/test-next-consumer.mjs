import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { expect } from '@playwright/test';
import { packedBrowsers } from './packed-browser.mjs';

// Next is fixture-only: the package keeps React/React DOM as its only peers.
const fixture = await mkdtemp(join(tmpdir(), 'sgui-next-consumer-'));
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', npm_config_auto_install_peers: 'false' };
let server;
try {
  const pack = join(fixture, 'pack');
  await mkdir(pack);
  execFileSync('pnpm', ['pack', '--pack-destination', pack], { stdio: 'pipe' });
  const tarball = (await readdir(pack)).find(name => name.endsWith('.tgz'));
  assert(tarball, 'Pack did not produce a tarball');
  await writeFile(join(fixture, 'package.json'), JSON.stringify({
    name: 'sgui-next-consumer', private: true, type: 'module', packageManager: 'pnpm@10.29.3',
    dependencies: { '@structured-growth/sg-ui': `file:${join(pack, tarball)}`, next: '16.4.0', react: '19.2.3', 'react-dom': '19.2.3' },
  }));
  await writeFile(join(fixture, '.npmrc'), 'auto-install-peers=false\n');
  await writeFile(join(fixture, 'next.config.mjs'), 'export default { experimental: { cpus: 1 } };\n');
  await mkdir(join(fixture, 'app'));
  await writeFile(join(fixture, 'app/layout.jsx'), `import '@structured-growth/sg-ui/styles.css';
export const metadata = { title: 'Packed Next SGUI proof' };
export default function Layout({children}) { return <html lang="en"><body>{children}</body></html>; }
`);
  await writeFile(join(fixture, 'app/page.jsx'), `
import { Box, Typography, Table, TableBody, TableRow, TableCell } from '@structured-growth/sg-ui/primitives';
import { ClassCardFrame } from '@structured-growth/sg-ui/components/ClassCardFrame';
import { AuthShell } from '@structured-growth/sg-ui/components/AuthShell';
import { AppShell } from '@structured-growth/sg-ui/components/AppShell';
import { normalizePaginationModel } from '@structured-growth/sg-ui/hooks';
import Client from './client';
export default function Page() {
  const model = normalizePaginationModel({page: 2, pageSize: 37});
  return <Client><AppShell navigation={<nav aria-label="Server navigation">Courses</nav>}>
    <AuthShell title="Packed server shell"><ClassCardFrame
      header={<Typography as="h1">Server course card</Typography>}
      body={<Box padding={2}><Table><TableBody><TableRow><TableCell>Server table cell</TableCell></TableRow></TableBody></Table>
        <output id="server-pagination">{JSON.stringify(model)}</output>
        <script dangerouslySetInnerHTML={{__html:"window.__sguiServerNode = document.getElementById('server-pagination');"}} /></Box>} />
    </AuthShell></AppShell></Client>;
}
`);
  await writeFile(join(fixture, 'app/client.jsx'), `'use client';
import { useState, useEffect } from 'react';
import { Provider } from '@structured-growth/sg-ui/theme';
import { SGTranslationProvider } from '@structured-growth/sg-ui/i18n';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { AppPageTabs } from '@structured-growth/sg-ui/components/AppPageTabs';
import { AppModal } from '@structured-growth/sg-ui/components/AppModal';
import { TextField, Button, Popover, DateRangeSelector } from '@structured-growth/sg-ui/experimental';
const translations = {locale:'fr-FR', t:(_key, options) => options.defaultMessage, useNamespace:() => {}};
export default function Client({children}) {
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState('light');
  const [tab, setTab] = useState('details');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Science');
  const [saved, setSaved] = useState('No saved course');
  useEffect(() => setHydrated(true), []);
  return <SGTranslationProvider value={translations}><Provider theme={theme}>
    {children}<output id="hydration">{hydrated ? 'Hydrated' : 'Server rendered'}</output>
    <AppButton onPress={() => setTheme(value => value === 'light' ? 'dark' : 'light')}>Toggle theme</AppButton>
    <AppPageTabs label="Course sections" value={tab} onChange={setTab} items={[
      {id:'details', label:'Details', content:'Course details'},
      {id:'access', label:'Access', content:'Course access'},
    ]} />
    <DateRangeSelector label="Reporting dates" name="reporting" months={1} defaultFocusedDate="2024-02-29" defaultValue={{start:"2024-02-28",end:"2024-02-29"}} />
    <AppButton onPress={() => setOpen(true)}>Edit course</AppButton>
    <output id="saved-course">{saved}</output>
    <AppModal open={open} title="Course settings" onClose={() => setOpen(false)} showCloseButton
      primaryAction={{label:'Save settings', onPress:() => {setSaved(name); setOpen(false);}}}>
      <TextField label="Course name" value={name} onValueChange={setName} />
      <Popover title="Course help" trigger={<Button>Help</Button>}><p>Host supplied help</p></Popover>
    </AppModal>
  </Provider></SGTranslationProvider>;
}
`);
  // Use the installed packed ESM, with its source-owned client directives and CSS.
  execFileSync('pnpm', ['--config.auto-install-peers=false', 'install', '--ignore-scripts'], { cwd: fixture, env, stdio: 'inherit' });
  execFileSync('pnpm', ['exec', 'next', 'build'], { cwd: fixture, env, stdio: 'inherit' });
  const installed = await readdir(join(fixture, 'node_modules/.pnpm'));
  assert(!installed.some(name => /^@mui\+|^@emotion\+/.test(name)), 'Next fixture installed retired peers');
  const manifest = JSON.parse(await readFile(join(fixture, '.next/prerender-manifest.json'), 'utf8'));
  assert(manifest.routes['/'], 'Next did not prerender the server composition');
  const portProbe = createServer();
  await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve));
  const port = portProbe.address().port;
  await new Promise(resolve => portProbe.close(resolve));
  server = spawn(process.execPath, [join(fixture, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: fixture, env, stdio: ['ignore', 'inherit', 'inherit'] });
  const url = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;
  while (true) {
    assert(server.exitCode === null, 'Next production server exited');
    try { const response = await fetch(url); if (response.ok) break; } catch {}
    assert(Date.now() < deadline, 'Next production server failed to become ready');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await packedBrowsers(url, 'next-production', async (page, hydrated) => {
    await expect(page.getByRole('heading', {name:'Server course card'})).toBeVisible();
    await expect(page.getByRole('cell', {name:'Server table cell'})).toBeVisible();
    await expect(page.locator('#server-pagination')).toHaveText('{"page":2,"pageSize":37}');
    await expect(page.getByRole('tab', {name:'Details', exact:true})).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#hydration')).toHaveText(hydrated ? 'Hydrated' : 'Server rendered');
    await expect(page.locator('input[name="reporting.start"]')).toHaveValue('2024-02-28');
    await expect(page.locator('input[name="reporting.end"]')).toHaveValue('2024-02-29');
    await expect(page.locator('[data-sgui-part="date-range-selector"]').getByRole('status')).toHaveText('2024-02-28 – 2024-02-29');
    await expect(page.getByRole('heading', {name:'Reporting dates, février 2024', exact:true})).toBeVisible();
    await assertRelationships(page, hydrated);
    const scope = page.locator('[data-sgui-theme]').first();
    await expect(scope).toHaveAttribute('data-sgui-theme', 'light');
    await expect(scope).toHaveAttribute('lang', 'fr-FR');
    await expect(scope).toHaveAttribute('dir', 'ltr');
    const light = await scope.evaluate(element => getComputedStyle(element).getPropertyValue('--sgui-surface').trim());
    assert(light, 'Next failed to load SGUI stylesheet');
    if (!hydrated) return;
    assert(await page.evaluate(() => window.__sguiServerNode === document.getElementById('server-pagination')), 'Hydration replaced server presentation markup');
    await page.getByRole('button', {name:'Toggle theme'}).click();
    await expect(scope).toHaveAttribute('data-sgui-theme', 'dark');
    const dark = await scope.evaluate(element => getComputedStyle(element).getPropertyValue('--sgui-surface').trim());
    assert.notEqual(dark, light, 'Next theme change lost scoped CSS tokens');
    await page.getByRole('tab', {name:'Access', exact:true}).click();
    await expect(page.getByRole('tabpanel')).toHaveText('Course access');
    const trigger = page.getByRole('button', {name:'Edit course'});
    await trigger.click();
    const dialog = page.getByRole('dialog', {name:'Course settings'});
    await expect(dialog).toBeVisible();
    await assertRelationships(page, true);
    await dialog.getByRole('textbox', {name:'Course name'}).fill('Biology');
    await dialog.getByRole('button', {name:'Help', exact:true}).click();
    await expect(page.getByText('Host supplied help')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Host supplied help')).toBeHidden();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', {name:'Help', exact:true})).toBeFocused();
    await dialog.getByRole('button', {name:'Save settings'}).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('#saved-course')).toHaveText('Biology');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
  console.log('Packed Next 16.4.0 production App Router server/client boundaries passed.');
} finally {
  if (server && server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
  await rm(fixture, { recursive: true, force: true });
}

async function assertRelationships(page, hydrated) {
  const problems = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const broken = [...document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')].flatMap(element =>
      ['aria-labelledby', 'aria-describedby', 'aria-controls'].flatMap(attribute =>
        (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)
          .filter(id => !document.getElementById(id)).map(id => attribute + ':' + id)));
    return { duplicates, broken };
  });
  assert.deepEqual(problems.duplicates, [], 'Packed Next has duplicate generated IDs');
  // React Aria date segment descriptions are inserted by client effects. SSR
  // still checks visible localized dates and accessible control names; all IDREF
  // targets must resolve after hydration, including the portal dialog subtree.
  if (hydrated) assert.deepEqual(problems.broken, [], 'Hydrated packed Next has broken ARIA relationships');
}
