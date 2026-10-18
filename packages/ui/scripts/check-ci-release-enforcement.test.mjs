import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {workflowFindings,protectionFindings,checkCIReleaseEnforcement} from './check-ci-release-enforcement.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
// Test-only YAML loading reuses the already-frozen installed js-yaml dependency.
// Production guard consumes JSON and has no parser/runtime dependency addition.
const parser=readdirSync(resolve(root,'node_modules/.pnpm')).find(name=>/^js-yaml@4\./.test(name));
assert(parser,'Existing frozen dependencies required; do not install into a shared checkout');
const yaml=createRequire(import.meta.url)(resolve(root,'node_modules/.pnpm',parser,'node_modules/js-yaml'));
const load=name=>yaml.load(readFileSync(resolve(root,'.github/workflows',name),'utf8'));
const workflows={ci:load('ci.yml'),ai:load('ai-code.yml'),release:load('release.yml'),title:load('pr-title.yml')};
const contexts=['Validate Node 22.12.0','Validate Node 24','Next.js docs','conventional-title'];
function synthetic(){return {queries:{branchProtection:200,effectiveRules:200,rulesets:200},branchProtection:{required_status_checks:{checks:contexts.map(context=>({context}))},required_pull_request_reviews:{required_approving_review_count:1}},effectiveRules:[],observedContexts:Object.fromEntries(contexts.map(c=>[c,c])),ownerReview:{owner:'synthetic fixture only',observedAt:'2026-10-17T12:00:00Z',reference:'https://example.invalid/owner',bypassReview:true,tagAuthorityReview:true},blockingObservations:Object.fromEntries(['failed-check','missing-check'].map(s=>[s,{blocked:true,head:'a'.repeat(40),url:'https://example.invalid/'+s,observedAt:'2026-10-17T12:00:00Z'}]))};}
test('current workflow configuration keeps production/infrastructure/main/reusable paths and default-token draft validation',()=>{assert.deepEqual(workflowFindings(workflows),[]);});
test('rejects missing main path, infrastructure path bypass, narrowed matrix, ignored failures and skipped release prerequisite',()=>{
 for(const mutate of [w=>w.ci.on.push.branches=['dev'],w=>w.ci.jobs.validate.if='false',w=>w.ci.jobs.docs.if='false',w=>w.ci.on.pull_request.paths=['packages/ui/src/**'],w=>w.ci.jobs.validate.strategy.matrix.node=['24'],w=>w.ci.jobs.validate.steps[1]['continue-on-error']=true,w=>w.release.jobs.validate.if='false',w=>w.release.jobs.release.needs=[],w=>w.release.on.push.branches=['dev'],w=>w.release.jobs.release.if='true']){const w=structuredClone(workflows);mutate(w);assert(workflowFindings(w).length);}
});
test('rejects AI event dependency, wrong draft SHA, write-job package execution, secrets or non-draft creation',()=>{
 for(const mutate of [w=>delete w.ai.jobs['validate-draft'],w=>w.ai.jobs['validate-draft'].with.ref='dev',w=>w.ai.jobs['validate-draft'].if='false',w=>w.ai.jobs['validate-proposal'].env={TOKEN:'${{ secrets.TOKEN }}'},w=>w.ai.jobs.propose.steps.push({run:'pnpm install'}),w=>w.ai.jobs.propose.steps.find(s=>s.id==='draft').with.draft=false]){const w=structuredClone(workflows);mutate(w);assert(workflowFindings(w).length);}
});
test('empty, API-denied and observed unprotected-main responses fail closed',()=>{
 assert(protectionFindings({}).length);
 assert(protectionFindings({queries:{branchProtection:403,effectiveRules:403,rulesets:403}}).length);
 assert(protectionFindings({queries:{branchProtection:404,effectiveRules:200,rulesets:200},branchProtection:{message:'Branch not protected',status:'404'},effectiveRules:[]}).length);
});
test('both legacy and effective-ruleset fixtures can require observed contexts without mistaking legacy404 for no rules',()=>{
 const legacy=synthetic();assert.deepEqual(protectionFindings(legacy),[]);
 const rules=synthetic();rules.queries.branchProtection=404;rules.branchProtection={status:'404'};rules.effectiveRules=[{type:'required_status_checks',parameters:{required_status_checks:contexts.map(context=>({context}))}},{type:'pull_request',parameters:{required_approving_review_count:1}}];assert.deepEqual(protectionFindings(rules),[]);
});
test('stale check names, missing owner review and absent failed/missing-check blocking observations cannot pass',()=>{
 for(const mutate of [p=>p.branchProtection.required_status_checks.checks.pop(),p=>p.observedContexts['Next.js docs']='Old Storybook',p=>p.ownerReview.bypassReview=false,p=>delete p.ownerReview,p=>p.blockingObservations['failed-check'].blocked=false,p=>delete p.blockingObservations['missing-check']]){const p=synthetic();mutate(p);assert(protectionFindings(p).length);}
 assert.equal(checkCIReleaseEnforcement({workflows,protection:synthetic()}).status,'structurally-consistent-policy-receipt');
});


test('mandatory runtime and docs gates cannot silently skip inside a green job',()=>{
 const mutations=[
  w=>w.ci.jobs.validate.steps.find(s=>s.run?.includes('pnpm check')).if='false',
  w=>w.ci.jobs.docs.steps.find(s=>s.run?.includes('pnpm build:docs')).if='false',
  w=>w.ci.jobs.validate.steps.find(s=>s.name==='Record exact checked head').if='false',
  w=>w.ci.jobs.validate.steps.find(s=>s.run?.includes('pnpm test:browser')).if="matrix.node == '22.12.0'",
  w=>w.ci.jobs.validate.steps.find(s=>s.run?.includes('test-next-consumer.mjs')).if='false',
 ];
 for(const mutate of mutations){const value=structuredClone(workflows);mutate(value);assert(workflowFindings(value).length);}
});
test('both React generations and one unambiguous execution of each gate are required',()=>{
 for(const command of ['test-foundation-consumer.mjs ${{','test-editor-consumer.mjs 2>&1']){
  const value=structuredClone(workflows);value.ci.jobs.validate.steps=value.ci.jobs.validate.steps.filter(s=>!s.run?.includes(command));assert(workflowFindings(value).length);
 }
 const value=structuredClone(workflows);const step=value.ci.jobs.validate.steps.find(s=>s.run?.includes('pnpm check'));value.ci.jobs.validate.steps.push({...step});assert(workflowFindings(value).length);
});


test('production PR and title event filters cannot omit new heads or edited titles',()=>{
 const mutations=[w=>w.ci.on.pull_request.types=['closed'],w=>w.ci.on.pull_request.branches=['main'],w=>w.title.on.pull_request.types=['opened'],w=>w.title.on.pull_request.paths=['packages/ui/src/**']];
 for(const mutate of mutations){const value=structuredClone(workflows);mutate(value);assert(workflowFindings(value).length);}
});
test('title validation and patch identity cannot be skipped or have failures ignored',()=>{
 const mutations=[w=>w.title.jobs['conventional-title'].if='false',w=>w.title.jobs['conventional-title']['continue-on-error']=true,w=>w.title.jobs['conventional-title'].steps.find(s=>s.run?.startsWith('pnpm exec commitlint')).if='false',w=>w.ai.jobs.propose.steps.find(s=>s.name==='Verify original patch identity').if='false',w=>w.ai.jobs.propose.steps.find(s=>s.name==='Verify original patch identity')['continue-on-error']=true];
 for(const mutate of mutations){const value=structuredClone(workflows);mutate(value);assert(workflowFindings(value).length);}
});
test('job permission overrides cannot broaden read-only CI or AI execution',()=>{
 const mutations=[w=>w.title.permissions={contents:'write'},w=>w.ci.jobs.validate.permissions={contents:'write'},w=>w.ci.jobs.docs.permissions='write-all',w=>w.ai.jobs.implement.permissions={contents:'write'},w=>w.ai.jobs['validate-draft'].permissions={contents:'write'},w=>w.title.jobs['conventional-title'].permissions={contents:'write'}];
 for(const mutate of mutations){const value=structuredClone(workflows);mutate(value);assert(workflowFindings(value).length);}
 const value=structuredClone(workflows);value.ci.jobs.validate.permissions={contents:'read'};assert.deepEqual(workflowFindings(value),[]);
});


test('logical gates cannot collapse onto one context or reuse legacy settings after a404',()=>{
 const collapsed=synthetic();collapsed.observedContexts=Object.fromEntries(contexts.map(name=>[name,contexts[0]]));collapsed.branchProtection.required_status_checks.checks=[{context:contexts[0]}];
 assert(protectionFindings(collapsed).some(finding=>finding.includes('distinct observed')));
 const stale=synthetic();stale.queries.branchProtection=404;
 const findings=protectionFindings(stale);
 assert(findings.some(finding=>finding.includes('reviewed PR requirement absent')));
 assert.equal(findings.filter(finding=>finding.includes('observed required context absent')).length,4);
});


test('YAML boolean false on an unconditional job is a skipped gate, not an absent condition',()=>{
 for(const mutate of [w=>w.ci.jobs.docs.if=false,w=>w.release.jobs.validate.if=false,w=>w.title.jobs['conventional-title'].if=false,w=>w.ai.jobs['validate-draft'].if=false]){
  const value=structuredClone(workflows);mutate(value);assert(workflowFindings(value).length);
 }
});

test('dependency policy rejects mutable external action/workflow refs without requiring remote execution',()=>{
 for(const ref of ['actions/checkout@v4','actions/checkout@main','actions/checkout@11d5960','actions/checkout@${{ inputs.ref }}','docker://example/action:latest']){
  const w=structuredClone(workflows);w.ci.jobs.validate.steps[0].uses=ref;
  assert(workflowFindings(w).some(f=>f.startsWith('Workflow dependency:')),ref);
 }
 const w=structuredClone(workflows);w.release.jobs.validate.uses='owner/repo/.github/workflows/ci.yml@main';
 assert(workflowFindings(w).some(f=>f.startsWith('Workflow dependency:')));
 const local=structuredClone(workflows);local.ai.jobs['validate-draft'].uses='./.github/workflows/ci.yml@dev';
 assert(workflowFindings(local).some(f=>f.startsWith('Workflow dependency:')));
});
