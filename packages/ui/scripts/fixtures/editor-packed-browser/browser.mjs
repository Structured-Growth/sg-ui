import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { packedBrowsers, staticConsumer } from '../../packed-browser.mjs';
import { verifyEditor } from './editor.spec.mjs';

/** Existing packed harness uses an OS-assigned loopback port, one sequential
 * browser, zero retries, JavaScript-disabled SSR and hydrated contexts, and
 * fails all console warnings/errors and page errors (including recoverable hydration).
 * @param {string} dist
 * @param {string} reactVersion
 */
export async function runEditorBrowser(dist, reactVersion) {
  const name = `editor-react-${reactVersion}-${randomUUID()}`;
  const assets = ['index.html', ...(await readdir(join(dist, 'assets'))).map(file => `assets/${file}`)];
  const hashes = Object.fromEntries(await Promise.all(assets.map(async file => [file,
    createHash('sha256').update(await readFile(join(dist, file))).digest('hex')])));
  await mkdir('artifacts/packed-browser', { recursive: true });
  const metadataPath = `artifacts/packed-browser/${name}-metadata.json`;
  const metadata = { name, reactVersion, dist, node: process.version, platform: process.platform,
    arch: process.arch, engines: process.env.SGUI_BROWSER_ENGINES?.split(',') ?? ['chromium', 'firefox', 'webkit'],
    startedAt: new Date().toISOString(), hashes, status: 'pending' };
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  try {
    await staticConsumer(dist, url => packedBrowsers(url, name, verifyEditor));
    metadata.status = 'passed';
  } catch (error) {
    metadata.status = 'failed';
    throw error;
  } finally {
    await writeFile(metadataPath, JSON.stringify({ ...metadata, finishedAt: new Date().toISOString() }, null, 2));
    console.log(`Packed editor React ${reactVersion} evidence: ${metadataPath}`);
  }
}
