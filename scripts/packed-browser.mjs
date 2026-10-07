import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium, firefox, webkit } from '@playwright/test';

// Uses the repository's test runtime, but loads only the clean fixture's packed output.
export async function staticConsumer(root, verify) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      const file = resolve(root, `.${pathname === '/' ? '/index.html' : decodeURIComponent(pathname)}`);
      if (!file.startsWith(`${resolve(root)}${sep}`)) { response.writeHead(403).end(); return; }
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' })[extname(file)] ?? 'application/octet-stream' });
      response.end(body);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await verify(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

export async function packedBrowsers(url, name, verify) {
  const evidence = [];
  await mkdir('artifacts/packed-browser', { recursive: true });
  const engines = process.env.SGUI_BROWSER_ENGINES?.split(',') ?? ['chromium', 'firefox', 'webkit'];
  assert(engines.length && engines.every(engine => ['chromium', 'firefox', 'webkit'].includes(engine)), 'Invalid browser engine');
  if (process.env.CI) assert.deepEqual(engines, ['chromium', 'firefox', 'webkit'], 'CI must exercise every engine');
  for (const engine of engines) {
    const browser = await ({ chromium, firefox, webkit })[engine].launch();
    try {
      const serverContext = await browser.newContext({ javaScriptEnabled: false });
      const serverPage = await serverContext.newPage();
      serverPage.setDefaultTimeout(30_000);
      serverPage.setDefaultNavigationTimeout(30_000);
      await serverPage.goto(url);
      await verify(serverPage, false);
      console.log(`${name} ${engine}: server markup passed`);
      await serverContext.close();
      const context = await browser.newContext();
      await context.tracing.start({ screenshots: true, snapshots: true });
      const page = await context.newPage();
      page.setDefaultTimeout(30_000);
      page.setDefaultNavigationTimeout(30_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
      try {
        await page.goto(url);
        await verify(page, true);
        console.log(`${name} ${engine}: hydrated interactions passed`);
        assert.deepEqual(errors, [], `${name} ${engine}: browser/hydration diagnostics`);
      } catch (error) {
        await page.screenshot({ path: `artifacts/packed-browser/${name}-${engine}.png`, fullPage: true }).catch(() => {});
        await writeFile(`artifacts/packed-browser/${name}-${engine}-failure.json`, JSON.stringify({ message: String(error), errors }, null, 2));
        await context.tracing.stop({ path: `artifacts/packed-browser/${name}-${engine}-trace.zip` }).catch(() => {});
        throw error;
      }
      await context.tracing.stop();
      evidence.push({ engine, ssr: 'passed', hydration: 'passed', interactions: 'passed', errors });
      await context.close();
    } finally { await browser.close(); }
  }
  await writeFile(`artifacts/packed-browser/${name}.json`, JSON.stringify(evidence, null, 2));
  console.log(`${name}: executed SSR/hydration and interactions in ${engines.join(', ')}`);
}
