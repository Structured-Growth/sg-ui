import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const browserProof = process.argv.includes('--browser');
const reactVersion = process.argv.includes('--react18') ? '18.3.1' : '19.2.3';
const fixture = await mkdtemp(join(tmpdir(), 'sgui-editor-consumer-'));
const pack = join(fixture, 'pack'); await mkdir(pack);
execFileSync('pnpm', ['pack', '--pack-destination', pack], { stdio: 'pipe' });
const tarball = (await readdir(pack)).find(name => name.endsWith('.tgz')); assert(tarball);
await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: 'sgui-editor-consumer', private: true, type: 'module', packageManager: 'pnpm@10.29.3', dependencies: {
  '@structured-growth/sg-ui': `file:${join(pack, tarball)}`, react: reactVersion, 'react-dom': reactVersion,
  lexical: '0.41.0', '@lexical/react': '0.41.0', vite: '7.3.1',
} }));
await writeFile(join(fixture,'.npmrc'),'auto-install-peers=false\n');
await writeFile(join(fixture,'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>Packed editor controls</title><div id="root"></div><script type="module" src="/main.jsx"></script></html>');
await writeFile(join(fixture,'Proof.jsx'), await readFile(new URL('./fixtures/editor-packed-browser/Proof.jsx', import.meta.url), 'utf8'));
await writeFile(join(fixture,'main.jsx'), `import React from 'react';import {hydrateRoot} from 'react-dom/client';import {Proof} from './Proof.jsx';import '@structured-growth/sg-ui/styles.css';hydrateRoot(document.getElementById('root'),<Proof browserProof={${browserProof}} />, {onRecoverableError: error => console.error(error)});`);
await writeFile(join(fixture,'ssr.mjs'), `import assert from 'node:assert/strict';import{writeFile}from'node:fs/promises';import React from 'react';import{renderToString}from'react-dom/server';import{createServer}from'vite';assert.equal(typeof window,'undefined');assert.equal(typeof document,'undefined');const server=await createServer({server:{middlewareMode:true},appType:'custom'});try{const {Proof}=await server.ssrLoadModule('/Proof.jsx');const html=renderToString(React.createElement(Proof,{browserProof:${browserProof}}));assert(html.includes('Packed editor'));await writeFile('index.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Packed React ${reactVersion} editor controls</title><div id="root">'+html+'</div><script type="module" src="/main.jsx"></script></html>');}finally{await server.close();}`);
execFileSync('pnpm',['--config.auto-install-peers=false','install','--ignore-scripts'],{cwd:fixture,stdio:'pipe',env:{...process.env,npm_config_auto_install_peers:'false'}});
execFileSync(process.execPath,['ssr.mjs'],{cwd:fixture,stdio:'pipe'});
execFileSync('pnpm',['exec','vite','build'],{cwd:fixture,stdio:'pipe'});
const assets=join(fixture,'dist/assets');const files=await readdir(assets);
assert.equal(files.filter(name=>name.endsWith('.css')).length,1);
const js=(await Promise.all(files.filter(name=>name.endsWith('.js')).map(name=>readFile(join(assets,name),'utf8')))).join('\n');
assert(!/@mui|@emotion|MuiButton/.test(js),'Editor proof pulled retired foundation');
assert(js.includes('data-lexical-editor'),'Editor engine absent');
const installed=await readdir(join(fixture,'node_modules/.pnpm'));assert(!installed.some(name=>/^@mui\+|^@emotion\+/.test(name)));
console.log(`Packed React ${reactVersion} editor SSR and hydration-entry build passed (browser execution not implied): ${fixture}`);

if (browserProof) {
  const { runEditorBrowser } = await import('./fixtures/editor-packed-browser/browser.mjs');
  await runEditorBrowser(join(fixture, 'dist'), reactVersion);
}
