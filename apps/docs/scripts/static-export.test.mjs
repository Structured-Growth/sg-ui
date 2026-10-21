import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const config=new URL('../next.config.mjs',import.meta.url).href;
function load(env){return spawnSync(process.execPath,['--input-type=module','-e',`const {default:c}=await import(${JSON.stringify(config)});console.log(JSON.stringify({...c,redirects:!!c.redirects}));`],{env:{...process.env,SGUI_DOCS_STATIC_EXPORT:'',NEXT_PUBLIC_DOCS_BASE_PATH:'',...env},encoding:'utf8'});}
test('normal docs build retains canonical redirects and server mode',()=>{
 const p=load({});assert.equal(p.status,0,p.stderr);const c=JSON.parse(p.stdout);assert.equal(c.basePath,'');assert.equal(c.redirects,true);assert.equal(c.output,undefined);
});
test('static builds use isolated output and a fixed valid prefix',()=>{
 for(const basePath of ['/dev','/releases/1.2.3','/releases/2.0.0-rc.1']){
  const p=load({SGUI_DOCS_STATIC_EXPORT:'1',NEXT_PUBLIC_DOCS_BASE_PATH:basePath});assert.equal(p.status,0,p.stderr);const c=JSON.parse(p.stdout);assert.equal(c.basePath,basePath);assert.equal(c.output,'export');assert.equal(c.distDir,'.next-static');assert.equal(c.trailingSlash,true);assert.equal(c.redirects,false);
 }
});
test('reject moving aliases and unsafe or non-versioned build prefixes',()=>{
 for(const basePath of ['/latest','//example.com','/releases/latest','/dev/../x','/dev/','/releases/1.2','/dev?q=1'])assert.notEqual(load({NEXT_PUBLIC_DOCS_BASE_PATH:basePath}).status,0,basePath);
});
