import {test} from 'node:test';
import assert from 'node:assert/strict';
import {checkManifest,checkCommands,checkScenarioTransfer,exportsIn,commandCodeIn} from './check-docs-provenance-wave04.mjs';
const baseline={sourceRepository:'owner/source',sourceCommit:'immutable',sourceRoot:'app/ui',files:[{source:'A.stories.tsx',destination:'src/A.stories.tsx',present:true}]};
const migrated={...baseline,files:[{...baseline.files[0],present:false,migration:{replacements:['apps/docs/A.fixture.tsx']}}]};
test('removed extraction requires an existing replacement and preserves upstream identity/order',()=>{
 assert.deepEqual(checkManifest(migrated,baseline,p=>p==='apps/docs/A.fixture.tsx').issues,[]);
 assert.match(checkManifest(migrated,baseline,()=>false).issues.join('\n'),/Missing replacement/);
 assert.match(checkManifest({...migrated,sourceCommit:'invented'},baseline,()=>false).issues.join('\n'),/Changed original provenance/);
 assert.match(checkManifest({...migrated,files:[]},baseline,()=>false).issues.join('\n'),/Original ordered extraction/);
 assert.match(checkManifest({...migrated,files:[{...migrated.files[0],migration:undefined}]},baseline,()=>false).issues.join('\n'),/no explicit replacement/);
});
test('legacy src replacement references resolve through library workspace and stale present flags fail',()=>{
 const manifest={...baseline,files:[{...baseline.files[0],present:false,migration:{replacements:['src/A.tsx']}}]};
 assert.deepEqual(checkManifest(manifest,baseline,p=>p==='packages/ui/src/A.tsx').issues,[]);
 assert.match(checkManifest(baseline,baseline,()=>false).issues.join('\n'),/Presence mismatch/);
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
