// Pure Node ownership test: no DOM/native/heap claim. Does not apply the patch.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../../..');
const require=createRequire(root+'/packages/ui/package.json');
const ts=require('typescript');
const relative='packages/ui/src/foundation/scrollbar-activity.ts';
function load(source) {
  let id=0; const pending=new Map(); const listeners=new Set();
  const doc={addEventListener(type,fn){assert.equal(type,'scroll');listeners.add(fn);},removeEventListener(type,fn){assert.equal(type,'scroll');listeners.delete(fn);}};
  const attrs=new Set();const element={nodeType:1,closest:()=>true,setAttribute:a=>attrs.add(a),removeAttribute:a=>attrs.delete(a)};
  const box={exports:{},setTimeout:fn=>{pending.set(++id,fn);return id;},clearTimeout:id=>pending.delete(id)};
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,box);
  return {observe:()=>box.exports.observeScrollbarActivity(doc),scroll:()=>{for(const fn of listeners)fn({target:element});},pending,listeners,attrs};
}
function duplicateRelease(source) {
  const h=load(source);const a=h.observe(), b=h.observe(); a();a(); h.scroll();
  assert.equal(h.listeners.size,1,'duplicate disposal removed the live sibling listener');
  assert.equal(h.pending.size,1);b();assert.equal(h.pending.size,0);assert.equal(h.attrs.size,0);
  const c=h.observe(); a();h.scroll(); assert.equal(h.listeners.size,1);assert.equal(h.pending.size,1);c();
  assert.equal(h.pending.size,0);assert.equal(h.listeners.size,0);
}
function plateau(source) {
  const h=load(source);
  for(let i=0;i<100;i++) {const release=h.observe();h.scroll();h.scroll();assert.equal(h.pending.size,1);release();assert.equal(h.pending.size,0);assert.equal(h.listeners.size,0);assert.equal(h.attrs.size,0);}
}
const original=await readFile(root+'/'+relative,'utf8');const candidate=await readFile(here+'/proposed-files/'+relative,'utf8');
let failure;
try {duplicateRelease(original);}catch(error){failure=error.message;}
assert.ok(failure,'expected original to reproduce disposal defect; rebase/review patch if fixed elsewhere');
duplicateRelease(candidate);plateau(candidate);plateau(original);
const result={runtime:process.version,typescript:ts.version,kind:'pure Node transpiled ownership regression; fake event target and timers',original:{sha256:createHash('sha256').update(original).digest('hex'),duplicateRelease:'fail',failure,repeatedLifetime:'pass'},candidate:{sha256:createHash('sha256').update(candidate).digest('hex'),duplicateRelease:'pass',repeatedLifetime:'pass',cycles:100,remainingListeners:0,remainingTimers:0,remainingAttributes:0},limits:['Not executed Vitest, DOM/native browser, heap profiling or supported Node matrix.','Original source remains unchanged.']};
await writeFile(here+'/lifecycle-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
