import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync, spawnSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),tool=join(here,'verify-contract-migrations.mjs'),hash=b=>createHash('sha256').update(b).digest('hex');
async function fixture(t,source){
 const repo=await mkdtemp(join(here,'migration-test-'));t.after(()=>rm(repo,{recursive:true,force:true}));
 await mkdir(join(repo,'packages/ui'),{recursive:true});await writeFile(join(repo,'packages/ui/package.json'),'{}');
 await writeFile(join(repo,'source.tsx'),source);await writeFile(join(repo,'guide.md'),'Explicit enabled={false} retains previous behavior.');
 const baseline=JSON.stringify({baselineNames:[]});await writeFile(join(repo,'baseline.json'),baseline);
 await writeFile(join(repo,'map.json'),JSON.stringify({baseline:{path:'baseline.json',sha256:hash(baseline)},removals:[],defaults:[{component:'Control',source:'source.tsx',sourceOwner:'Control',sourceSha256:hash(source),prop:'enabled',after:'true',guide:'guide.md'}],limits:[]}));
 await writeFile(join(repo,'inventory.json'),JSON.stringify({routes:{'.':[{name:'Control'}]},contracts:{control:{aliases:[{name:'Control'}],parameters:[[{properties:[{name:'enabled',optional:true}]}]]}}}));
 execFileSync('git',['init','-q'],{cwd:repo});execFileSync('git',['add','source.tsx'],{cwd:repo});execFileSync('git',['-c','user.name=Contract Test','-c','user.email=contract-test@example.invalid','commit','-q','-m','test: capture source'],{cwd:repo});
 const run=(name,extra=[])=>spawnSync(process.execPath,[tool,'--inventory',join(repo,'inventory.json'),'--repo',repo,'--map',join(repo,'map.json'),'--output',join(repo,name+'.json'),...extra],{encoding:'utf8'});return {repo,run};
}
test('committed source pin excludes dirty candidate defaults and records the exact commit',async t=>{
 const {repo,run}=await fixture(t,'export function Control({enabled=true}:{enabled?:boolean}) { return enabled; }');
 const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();await writeFile(join(repo,'source.tsx'),'export function Control({enabled=false}:{enabled?:boolean}) { return enabled; }');
 const dirty=run('dirty');assert.notEqual(dirty.status,0);assert.match(dirty.stderr,/Runtime source changed/);
 const frozen=run('frozen',['--source-ref','HEAD']);assert.equal(frozen.status,0,frozen.stderr);
 const receipt=JSON.parse(await readFile(join(repo,'frozen.json'),'utf8'));assert.equal(receipt.sourceMode,'git-commit');assert.equal(receipt.sourceRef,commit);assert.deepEqual(receipt.checks[0].matchedSourceInitializers,['true']);
});
test('an optional public prop and an unrelated helper default do not establish its runtime default',async t=>{
 const {run}=await fixture(t,'export function Control({enabled}:{enabled?:boolean}) { return enabled; }\nfunction helper({enabled=true}:{enabled?:boolean}) { return enabled; }');
 const result=run('unrelated',['--source-ref','HEAD']);assert.notEqual(result.status,0);assert.match(result.stderr,/Runtime default no longer matches Control.enabled/);
});
