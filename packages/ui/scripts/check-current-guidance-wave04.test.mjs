import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {auditGuidance} from './check-current-guidance-wave04.mjs';
function fixture(t,text,extra={}) {
 const root=mkdtempSync(join(tmpdir(),'sgui-current-guidance-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 const files={'package.json':JSON.stringify({name:'workspace',scripts:{build:'x'}}),'packages/ui/package.json':JSON.stringify({name:'@structured-growth/sg-ui',exports:{'.':{},'./components/Button':{},'./icons/*':{}},devDependencies:{'@playwright/test':'1',vitest:'1'}}),'apps/docs/package.json':JSON.stringify({name:'@structured-growth/docs'}),'apps/docs/content/catalog.json':'[{"slug":"button"}]','guide.md':text,...extra};
 for(const [path,content] of Object.entries(files)){mkdirSync(dirname(join(root,path)),{recursive:true});writeFileSync(join(root,path),content);}
 return root;
}
test('current links/anchors/routes/import routes fail on actual drift',t=>{
 const root=fixture(t,'[ok](target.md#repeat-1) [bad](target.md#lost) [route](/docs/components/unknown)\n```tsx\nimport {X} from "@structured-growth/sg-ui/private";\n```',{'target.md':'# Repeat\n# Repeat'});
 assert.deepEqual(auditGuidance({root,files:['guide.md']}).issues.map(x=>x.code),['missing-anchor','invalid-or-noncanonical-route','unexported-package-route']);
});
test('workspace exec ownership catches root tools and filtered script paths',t=>{
 const root=fixture(t,'`pnpm exec playwright install`\n`pnpm --filter @structured-growth/sg-ui exec vitest run`\n`pnpm --filter @structured-growth/sg-ui exec node scripts/absent.mjs`\n`pnpm stale-script`');
 assert.deepEqual(auditGuidance({root,files:['guide.md']}).issues.map(x=>x.code),['tool-not-owned-by-workspace','missing-node-script','missing-package-script']);
});
test('historical code/old prose excluded by explicit section, current checks still run',t=>{
 const name='docs/developer/react-aria-browser-acceptance.md';
 const root=fixture(t,'', {[name]:'[current](/docs/components/button)\n`pnpm build`\n## Historical validation and environment receipts\n`pnpm old-storybook` [old](missing-history.md)\n'});
 const r=auditGuidance({root,files:[name]});assert.deepEqual(r.issues,[]);assert.equal(r.excluded.length,1);
});
test('proposal overlay validates exact intended files without modifying current docs',t=>{
 const root=fixture(t,'[bad](absent.md)\n`pnpm exec playwright test`');
 const overlay=join(root,'proposal');mkdirSync(overlay);writeFileSync(join(overlay,'guide.md'),'[good](/docs/components/button)\n`pnpm --filter @structured-growth/sg-ui exec playwright test`\n```tsx\nimport {Button} from "@structured-growth/sg-ui/components/Button";\n```');
 assert.equal(auditGuidance({root,files:['guide.md']}).issues.length,2);
 assert.deepEqual(auditGuidance({root,files:['guide.md'],proposedRoot:overlay}).issues,[]);
});

test('direct root node script commands cannot silently use a library-relative path',t=>{
 const root=fixture(t,'`node scripts/test-consumer.mjs`\n`node packages/ui/scripts/test-consumer.mjs`',{'packages/ui/scripts/test-consumer.mjs':''});
 assert.deepEqual(auditGuidance({root,files:['guide.md']}).issues.map(x=>x.code),['missing-direct-node-script']);
});
