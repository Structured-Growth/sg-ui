import {test} from 'node:test';
import assert from 'node:assert/strict';
import {checkManifest,checkCommands,checkScenarioTransfer,exportsIn,commandCodeIn,checkScenarioDispositions} from './check-docs-provenance-wave04.mjs';
const baseline={files:[{destination:'src/A.stories.tsx',present:true}]};
const migrated={files:[{...baseline.files[0],present:false,migration:{replacements:['apps/docs/A.fixture.tsx']}}]};
test('removed components require existing replacements and current paths cannot duplicate',()=>{
 assert.deepEqual(checkManifest(migrated,p=>p==='apps/docs/A.fixture.tsx').issues,[]);
 assert.match(checkManifest(migrated,()=>false).issues.join('\n'),/Missing replacement/);
 assert.match(checkManifest({files:[baseline.files[0],baseline.files[0]]},()=>true).issues.join('\n'),/Duplicate current path/);
 assert.match(checkManifest({files:[{...migrated.files[0],migration:undefined}]},()=>false).issues.join('\n'),/no explicit replacement/);
});
test('legacy src replacement references resolve through the library workspace and stale presence fails',()=>{
 const manifest={files:[{...baseline.files[0],present:false,migration:{replacements:['src/A.tsx']}}]};
 assert.deepEqual(checkManifest(manifest,p=>p==='packages/ui/src/A.tsx').issues,[]);
 assert.match(checkManifest(baseline,()=>false).issues.join('\n'),/Presence mismatch/);
});
test('scenario transfer uses exported AST names, preserves aliases and detects a dropped scenario',()=>{
 const before='export const Normal={}; export const NativeForm={}; const local={}; export { local as Alias }; // export const Fake={}';
 const current='export const Normal={}; export const Extra={}; const x={}; export { x as Alias };';
 assert.deepEqual(exportsIn(before),['Alias','NativeForm','Normal']);
 assert.deepEqual(checkScenarioTransfer(before,current,{original:'old',fixture:'new'}).missingExports,['NativeForm']);
});
test('package command checks reject stale root commands and unknown filters without executing them',()=>{
 const manifests=[{name:'workspace',scripts:{build:'true'}},{name:'@owner/ui',scripts:{'test:package':'true'}}];
 assert.deepEqual(checkCommands('pnpm build; pnpm --filter @owner/ui test:package; pnpm exec node tool.mjs',manifests,'guide').issues,[]);
 const bad=checkCommands('pnpm storybook; pnpm --filter @owner/missing build',manifests,'guide');
 assert.equal(bad.issues.length,2);assert.equal(bad.commands[0].exists,false);
});

test('prose tool versions are not treated as commands; inline and fenced commands remain audited',()=>{
 const source='Use pnpm 10.29.3. Root pnpm commands forward checks. Run `pnpm stale` or:\n```sh\npnpm build\n```';
 const result=checkCommands(commandCodeIn(source),[{scripts:{build:'true'}}],'guide');
 assert.equal(result.commands.length,2);assert.deepEqual(result.issues,['guide: unknown package/script in pnpm stale']);
});

const early=[{original:'packages/ui/src/A.stories.tsx',name:'OldSelection',initialSha256:'a'.repeat(64)}];
const texts={'current.fixture.tsx':'export const Selection = {render: () => <Grid selection={selected}/>};','current.test.tsx':"it('retains host selection',()=>{expect(selected.has('one')).toBe(true);});"};
const record=()=>({...early[0],originalBehavior:'Controlled selected row IDs and visible checkbox state.',originalAssertions:'Render-only original scenario; no play assertions.',rationale:'Host-controlled selection now has focused state assertions.',disposition:'represented',behaviorChanges:[],remainingGaps:[],evidence:[{kind:'fixture',path:'current.fixture.tsx',claim:'The host supplies selected state.',anchors:['selection={selected}']},{kind:'test',path:'current.test.tsx',claim:'Selection state is actually asserted.',anchors:['retains host selection'],assertion:"expect(selected.has('one')).toBe(true)"}]});
const dispositions=rows=>({schemaVersion:1,baselineCommit:'21adebd61bedfc6a1ed395fe664ff4be83896821',scenarios:rows});
const readEvidence=p=>{if(!(p in texts))throw Error('missing');return texts[p];};
test('explicit original behavior/current host/assertion dispositions resolve an early scenario',()=>{
 const result=checkScenarioDispositions(early,dispositions([record()]),readEvidence);
 assert.deepEqual(result.issues,[]);assert.deepEqual(result.unresolved,[]);assert.equal(result.rows[0].resolved,true);
});
test('missing dispositions and explicit coverage gaps remain unresolved',()=>{
 assert.equal(checkScenarioDispositions(early,dispositions([]),readEvidence).unresolved.length,1);
 const row=record();row.disposition='gap';row.remainingGaps=['Missing composed collapse/selection host'];
 assert.equal(checkScenarioDispositions(early,dispositions([row]),readEvidence).unresolved.length,1);
});
test('export-name aliases cannot replace original hashes or current assertion evidence',()=>{
 const row=record();row.initialSha256='b'.repeat(64);row.evidence[1].assertion='expect(invented).toBe(true)';
 const result=checkScenarioDispositions(early,dispositions([row]),readEvidence);
 assert.match(result.issues.join('\n'),/source hash mismatch/);assert.match(result.issues.join('\n'),/missing current assertion/);assert.equal(result.unresolved.length,1);
});
test('stale/missing evidence, duplicate rows and invented original scenarios fail',()=>{
 const row=record();row.evidence[0].anchors=['not shipped'];const unknown={...record(),name:'Invented'};
 const result=checkScenarioDispositions(early,dispositions([row,row,unknown]),readEvidence);
 assert.match(result.issues.join('\n'),/stale evidence anchor/);assert.match(result.issues.join('\n'),/duplicate disposition/);assert.match(result.issues.join('\n'),/unknown original scenario/);
 row.evidence[0].path='missing.tsx';assert.match(checkScenarioDispositions(early,dispositions([row]),readEvidence).issues.join('\n'),/missing evidence/);
});
test('changed contracts require reviewable differences and path escapes cannot supply evidence',()=>{
 const row=record();row.disposition='changed-contract';row.evidence[0].path='../other.fixture.tsx';
 const result=checkScenarioDispositions(early,dispositions([row]),readEvidence);
 assert.match(result.issues.join('\n'),/explicit differences/);assert.match(result.issues.join('\n'),/invalid evidence path/);
});
