import assert from 'node:assert/strict';
import test from 'node:test';
import { verify } from './verify-check-receipt.mjs';
const head='a'.repeat(40);
function synthetic() {
  const names=['Validate Node 22.12.0','Validate Node 24','Next.js docs','conventional-title'];
  const paths=Object.fromEntries(['production-pr','maintainer-infrastructure-pr','main','default-token-ai-draft'].map(path=>[path, {head,observedAt:'synthetic',runUrl:'fixture://run',contexts:Object.fromEntries(names.map(n=>[n,n])),checks:names.map(name=>({name,head,status:'completed',conclusion:'success',url:'fixture://check'})),tokenKind:'github.token',draft:true,explicitCallHead:head}]));
  return {paths,protection:{effectiveRequiredContexts:names,owner:'synthetic-only',observedAt:'synthetic',rawSettingsReceipt:'fixture://settings',blockingObservations:Object.fromEntries(['failed-check','missing-check'].map(s=>[s,{blocked:true,url:'fixture://blocked',head,observedAt:'synthetic'}]))},devExceptionPreserved:true,release:{runUrl:'fixture://release',head,validationSucceededBeforeRelease:true}};
}
test('empty evidence fails closed; a complete synthetic shape is only structural',()=>{ assert.ok(verify({}).length); assert.deepEqual(verify(synthetic()),[]); });
test('stale, missing, skipped, failed and approval-pending checks fail',()=>{
 for(const mutation of [r=>r.paths.main.checks.splice(2,1),r=>r.paths.main.checks[0].head='b'.repeat(40),r=>r.paths.main.checks[0].conclusion='skipped',r=>r.paths.main.checks[0].conclusion='failure',r=>r.paths.main.checks[0].status='queued',r=>r.paths['default-token-ai-draft'].explicitCallHead='b'.repeat(40),r=>r.protection.effectiveRequiredContexts.pop(),r=>r.protection.blockingObservations['missing-check'].blocked=false]) {
  const r=synthetic(); mutation(r);
  assert.ok(verify(r).length);
 }
});
