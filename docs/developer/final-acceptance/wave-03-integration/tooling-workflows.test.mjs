import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const root=process.cwd();
const packageName=readdirSync('node_modules/.pnpm').find(name=>/^js-yaml@4\./.test(name));
const yaml=createRequire(import.meta.url)(resolve('node_modules/.pnpm',packageName,'node_modules/js-yaml'));
const load=name=>yaml.load(readFileSync(resolve(root,'.github/workflows',name),'utf8'));
const pins=JSON.parse(readFileSync('docs/developer/final-acceptance/wave-03-36/remote/action-pins.json','utf8'));
test('merged workflow actions match captured upstream SHA identities; all shell blocks parse',()=>{
 for(const name of ['ai-code.yml','ci.yml','release.yml','pr-title.yml'])for(const job of Object.values(load(name).jobs))for(const step of job.steps??[]){
  if(step.uses){const [repository,sha]=step.uses.split('@');assert.match(sha,/^[a-f0-9]{40}$/);assert.equal(sha,pins.find(pin=>pin.repository===repository)?.sha);if(repository==='actions/setup-node')assert.equal(step.with['cache-dependency-path'],'pnpm-lock.yaml');}
  assert.equal(step['continue-on-error'],undefined);
  if(step.run){const result=spawnSync('bash',['-n'],{input:step.run.replace(/\$\{\{[\s\S]*?\}\}/g,'EXPRESSION'),encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
 }
});
test('freshness uploads and exact-head validation preserve mandatory matrix and production triggers',()=>{
 const ci=load('ci.yml');assert.deepEqual(ci.on.pull_request,{'branches-ignore':['dev']});assert.deepEqual(ci.on.push,{branches:['main']});assert.equal(ci.on.workflow_call.inputs.ref.type,'string');
 assert.deepEqual(ci.jobs.validate.strategy.matrix.node,['22.12.0','24']);
 const before=yaml.load(readFileSync('docs/developer/final-acceptance/wave-03-36/proposed-files/.github/workflows/ci.yml','utf8'));
 for(const id of ['validate','docs']){
  const job=ci.jobs[id];assert.equal(job.steps[0].with.ref,'${{ inputs.ref || github.sha }}');assert.equal(job.steps[0].with['persist-credentials'],false);assert.equal(job.steps[1].name,'Record exact checked head');
  for(const step of before.jobs[id].steps.filter(step=>step.run))assert(job.steps.some(after=>after.run===step.run),'Mandatory command removed: '+step.run);
 }
 const steps=ci.jobs.validate.steps;assert(steps.findIndex(s=>s.run?.includes('ci-artifacts.mjs begin'))<steps.findIndex(s=>s.run?.includes('pnpm check')));assert(steps.findIndex(s=>s.run?.includes('ci-artifacts.mjs complete'))<steps.findIndex(s=>s.name==='Upload validated package'));
 assert.equal(steps.find(s=>s.name==='Upload validation results').if,'always()');assert.equal(ci.jobs.docs.steps.find(s=>s.name==='Upload docs validation and failure traces').if,'always()');
 assert.equal(load('release.yml').jobs.release.needs,'validate');assert.equal(load('release.yml').jobs.validate.uses,'./.github/workflows/ci.yml');
});
