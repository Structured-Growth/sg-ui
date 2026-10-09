import { createServer } from 'node:http';
import { readFile, readdir, lstat, realpath } from 'node:fs/promises';
import { resolve, extname, sep, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerOwnedServer } from './browser-validation-pool.mjs';

export function browserSettings(env = process.env) {
  const port = Number(env.SGUI_BROWSER_PORT ?? 6173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid SGUI_BROWSER_PORT');
  const baseURL = env.SGUI_BROWSER_BASE_URL ?? `http://127.0.0.1:${port}`;
  const url = new URL(baseURL);
  if (url.origin !== `http://127.0.0.1:${port}` || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SGUI_BROWSER_BASE_URL must match the loopback port');
  }
  return { port, baseURL: url.origin, root: resolve(env.SGUI_BROWSER_STORYBOOK_DIR ?? 'storybook-static') };
}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
export async function startServer(env = process.env) {
  const { root, port } = browserSettings(env);
  const ownership = await registerOwnedServer(env, port);
  let ownerClosed = false;
  ownership?.once('close', () => { ownerClosed = true; });
  try {
    const assets = env.SGUI_BROWSER_IMMUTABLE === '1' ? new Map() : undefined;
    if (assets) {
      // Snapshot bytes before listening: even accidental on-disk writes cannot change a suite's server.
      async function load(dir) {
        for (const name of await readdir(dir)) {
          const path = resolve(dir, name);
          const stat = await lstat(path);
          if (stat.isSymbolicLink()) throw new Error(`Static build symlink rejected: ${path}`);
          if (stat.isDirectory()) await load(path);
          else if (stat.isFile()) assets.set(path, await readFile(path));
          else throw new Error(`Invalid static build asset: ${path}`);
        }
      }
      await load(root);
    }
    const server = createServer(async (request, response) => {
      try {
        const path = resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
        if (!path.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
        let body;
        if (assets) body = assets.get(path);
        else {
          const actual = await realpath(path);
          if (relative(root, actual).startsWith('..')) { response.writeHead(403).end(); return; }
          body = await readFile(path);
        }
        if (!body) { response.writeHead(404).end(); return; }
        response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
      } catch { response.writeHead(404).end(); }
    });
    ownership?.once('close', () => { server.closeAllConnections(); server.close(); });
    ownership?.on('error', () => {});
    server.once('close', () => ownership?.destroy());
    if (ownerClosed) throw new Error('Server supervisor closed before listening');
    await new Promise((done, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', done); });
    if (ownerClosed) { server.closeAllConnections(); await new Promise(done => server.close(done)); throw new Error('Server supervisor closed while listening'); }
    return server;
  } catch (error) { ownership?.destroy(); throw error; }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await startServer(); }
  catch (error) { console.error(`Storybook server failed: ${error.message}`); process.exitCode = 1; }
}
