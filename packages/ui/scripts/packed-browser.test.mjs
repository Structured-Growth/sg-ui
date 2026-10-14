import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { staticConsumer } from './packed-browser.mjs';

test('packed server returns missing assets before headers and survives subsequent requests', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sgui-packed-server-'));
  try {
    await writeFile(join(root, 'index.html'), '<!doctype html><title>Packed consumer</title>');
    await staticConsumer(root, async url => {
      for (const path of ['/favicon.ico', '/missing.js', '/%ZZ']) {
        const missing = await fetch(`${url}${path}`);
        assert.equal(missing.status, 404);
        assert.equal(await missing.text(), '');
      }
      const outside = await fetch(`${url}/..%2Foutside.js`);
      assert.equal(outside.status, 403);
      await outside.text();
      const page = await fetch(url);
      assert.equal(page.status, 200);
      assert.equal(page.headers.get('content-type'), 'text/html');
      assert.equal(await page.text(), '<!doctype html><title>Packed consumer</title>');
    });
  } finally { await rm(root, { recursive: true, force: true }); }
});
