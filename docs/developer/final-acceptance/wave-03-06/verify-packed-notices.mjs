// Coordinator: run after integrating reviewed text; no archive extraction/build/install.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const own=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(own,'../../../..');
assert.equal(process.argv.length,3,'Usage: node verify-packed-notices.mjs /absolute/candidate.tgz');
const archive=path.resolve(process.argv[2]);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const listing=execFileSync('tar',['-tzf',archive],{encoding:'utf8'}).trim().split('\n');
const rows=[];
for(const name of ['LICENSE','THIRD_PARTY_NOTICES.md']){
 const member=`package/${name}`;assert.equal(listing.filter(s=>s===member).length,1,member);
 const bytes=execFileSync('tar',['-xOzf',archive,member],{maxBuffer:10*1024*1024});
 const live=fs.readFileSync(path.join(root,'packages/ui',name));
 assert.deepEqual(bytes,live,`packed ${name} differs from reviewed live bytes`);
 assert.deepEqual(live,fs.readFileSync(path.join(root,name)),`root/package ${name} mismatch`);
 if(name==='THIRD_PARTY_NOTICES.md')assert.deepEqual(bytes,fs.readFileSync(path.join(own,'proposed-files',name)),'draft notices not integrated exactly; review delta');
 rows.push({member,sha256:sha(bytes)});
}
console.log(JSON.stringify({runtime:process.version,archive,archiveSha256:sha(fs.readFileSync(archive)),legalFiles:rows,memberCount:listing.length,result:'pass',limits:['Packed byte preservation only; no legal/provenance approval or production release.']},null,2));
