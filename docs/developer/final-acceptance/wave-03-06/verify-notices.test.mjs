import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const own=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(own,'../../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const baseline=p=>fs.readFileSync(path.join(own,'baseline',p),'utf8');
const proposed=p=>fs.readFileSync(path.join(own,'proposed-files',p),'utf8');
const comparison=JSON.parse(read('docs/developer/final-acceptance/wave-02-05/license-text-comparison.json'));
const inventory=JSON.parse(read('docs/developer/final-acceptance/wave-02-05/license-inventory.json'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const norm=s=>s.replace(/\s+/g,' ').trim();
const blocks=s=>[...s.matchAll(/```text\n([\s\S]*?)```/g)].map(m=>m[1]);
test('all 55 previously inspected runtime/peer full texts retained, including exact SWC copyright bytes',()=>{
 const text=proposed('THIRD_PARTY_NOTICES.md');
 for(const row of comparison){
  const bytes=fs.readFileSync(path.join(root,row.path));assert.equal(hash(bytes),row.sha256,row.id+' inspected license changed');
  assert.ok(norm(text).includes(norm(bytes.toString())),row.id+' full license absent');
 }
 const swc=comparison.find(r=>r.id==='@swc/helpers@0.5.23');
 assert.ok(blocks(text).includes(read(swc.path)+'\n')||blocks(text).includes(read(swc.path)),'verbatim SWC legal block');
 assert.match(text,/Copyright 2024 SWC contributors\./);
});
test('every existing license block and retired section retained; existing checker can parse all headings and direct/peer names',()=>{
 const text=proposed('THIRD_PARTY_NOTICES.md');assert.equal(text,proposed('packages/ui/THIRD_PARTY_NOTICES.md'));
 for(const block of blocks(baseline('THIRD_PARTY_NOTICES.md')))assert.ok(blocks(text).includes(block),'existing legal block changed');
 const headings=text.split('\n').filter(s=>s.startsWith('## '));
 const re=/^## (\S+) (\d+\.\d+\.\d+(?:[-+][\w.-]+)?) \((.+)\)$/;
 const ids=headings.map(s=>{const m=re.exec(s);assert.ok(m,s);return `${m[1]}@${m[2]}`;});
 for(const retired of ['@emotion/react@11.14.0','@emotion/styled@11.14.1','@mui/material@7.3.11','@mui/icons-material@7.3.11','@mui/x-data-grid@8.29.3'])assert.ok(ids.includes(retired),retired);
 for(const d of inventory.direct.filter(d=>['runtime','runtime-optional'].includes(d.scope)))assert.ok(ids.includes(`${d.name}@${d.resolution.split('(')[0]}`),d.name);
 for(const p of inventory.peers)for(const id of p.resolutions)assert.ok(ids.includes(id),id);
 // Match the parser actually shipped; if its heading format changes, review this guard.
 assert.ok(read('packages/ui/scripts/check-license-inventory.mjs').includes('const match = /^## (\\S+)'));
});
test('commercial sections retain all bytes except the specifically proposed factual package-list sentence',()=>{
 const old=baseline('LICENSE');const updated=proposed('LICENSE');
 assert.equal(updated,proposed('packages/ui/LICENSE'));
 assert.equal(updated.replace('including React, React Aria, TanStack Table,\nLucide and Lexical.','including React, MUI, Emotion and\nLexical.'),old);
 assert.equal(read('LICENSE'),read('packages/ui/LICENSE'),'live commercial files remain equal');
});
