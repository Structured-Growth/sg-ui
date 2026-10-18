import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {checkMaintainedDocumentation,currentSiteRoutes,maintainedDocument} from './check-maintained-documentation.mjs';
async function fixture(t,text,extra={}) {
 const root=await mkdtemp(join(tmpdir(),'sgui-maintained-links-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const files={'README.md':text,'apps/docs/app/page.tsx':'','apps/docs/app/installation/page.tsx':'','apps/docs/app/docs/components/[slug]/page.tsx':'','apps/docs/content/catalog.json':'[{"slug":"button"}]',...extra};
 for(const [file,body]of Object.entries(files)){await mkdir(dirname(join(root,file)),{recursive:true});await writeFile(join(root,file),body);}
 return root;
}
test('exact current app/catalog routes pass while unknown and legacy redirect routes fail',async t=>{
 const root=await fixture(t,'[home](/) [setup](/installation) [button](/docs/components/button?x=1#props) [unknown](/docs/components/missing) [legacy](/docs/installation)');
 const r=await checkMaintainedDocumentation({root,trackedFiles:['README.md']});
 assert.equal(r.site.componentRoutes,1);assert.equal(r.site.linkOccurrences,3);
 assert.deepEqual(r.findings.map(f=>f.destination),['/docs/components/missing','/docs/installation']);
 assert.equal(r.defects,2);assert.equal(r.rawFilesystemAudit.defects,4);
});
test('missing local targets, broken anchors and arbitrary absolute paths remain defects',async t=>{
 const root=await fixture(t,'[good](guide.md#exists) [bad](guide.md#lost) [missing](absent.md) [absolute](/definitely-missing-sgui-guide.md)',{'guide.md':'# Exists'});
 const r=await checkMaintainedDocumentation({root,trackedFiles:['README.md']});
 assert.deepEqual(r.findings.map(f=>f.code),['missing-anchor','missing-path','missing-path']);assert.equal(r.defects,3);
});
test('historical exclusions are explicit; maintained docs, root dotfiles and fixture guide stay checked',async t=>{
 const files=['README.md','.GUIDE.md','docs/migration.md','docs/developer/parallel-batch-1/report.md','docs/developer/parallel-next100/report.md','docs/developer/final-acceptance/wave-01/report.md','docs/developer/migration-baseline/README.md','apps/docs/native-fixtures/README.md'];
 const root=await fixture(t,'',Object.fromEntries(files.slice(1).map(p=>[p,''])));
 const r=await checkMaintainedDocumentation({root,trackedFiles:files});assert.equal(r.files,4);assert.equal(r.excludedDocuments.length,4);assert.ok(r.excludedDocuments.every(x=>x.reason.startsWith('Historical')));
 assert.equal(maintainedDocument('docs/developer/parallel-next100-c18.md'),false);assert.equal(maintainedDocument('docs/developer/react-aria-grid-reorder.md'),true);
});
test('missing catalog host and duplicate/invalid catalog routes cannot be silently accepted',async t=>{
 const root=await fixture(t,'',{'apps/docs/content/catalog.json':'[{"slug":"button"},{"slug":"button"}]'});assert.throws(()=>currentSiteRoutes(root),/duplicate/);
 const other=await fixture(t,'');await rm(join(other,'apps/docs/app/docs/components/[slug]/page.tsx'));assert.throws(()=>currentSiteRoutes(other),/Missing component catalog/);
});
