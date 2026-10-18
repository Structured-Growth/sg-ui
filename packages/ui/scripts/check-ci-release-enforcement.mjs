// Pure policy checks over parsed workflow and raw GET receipt objects.
// Never queries/mutates GitHub, executes YAML, dispatches or invokes a release.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const logicalChecks=['Validate Node 22.12.0','Validate Node 24','Next.js docs','conventional-title'];
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function workflowFindings(workflows) {
 const failures=[];const check=(ok,message)=>{if(!ok)failures.push(message);};
 const readOnlyJob=job=>job?.permissions===undefined || equal(job.permissions,{contents:'read'});
 const hasTypes=(event,required,defaultAllowed)=>event?.types===undefined ? defaultAllowed : Array.isArray(event.types) && required.every(type=>event.types.includes(type));
 const {ci,ai,release,title}=workflows??{};
 if(!ci||!ai||!release||!title)return ['All four parsed workflow objects are required'];
 // Local actions/workflows run from the same checked-out candidate. External
 // action and reusable-workflow references must pin an immutable commit; tags,
 // branches, expressions and container tags do not meet repository policy.
 for(const [name,workflow] of Object.entries(workflows))for(const [id,job]of Object.entries(workflow.jobs??{})) {
  const references=[job.uses,...(job.steps??[]).map(step=>step.uses)].filter(ref=>ref!==undefined);
  for(const ref of references) {
   const local=typeof ref==='string'&&ref.startsWith('./');
   check(typeof ref==='string'&&(local ? !ref.includes('@')&&!ref.includes('..')&&!ref.includes('${{') : /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_./-]+)?@[a-f0-9]{40}$/.test(ref)),`Workflow dependency: ${name}/${id} requires a full commit SHA or candidate-local reference`);
  }
 }

 check(equal(ci.on?.pull_request?.['branches-ignore'],['dev']),'CI: production PR path/dev exception changed');
 check(equal(ci.on?.push?.branches,['main']),'CI: main push path missing');
 check(ci.on?.pull_request?.branches===undefined && hasTypes(ci.on?.pull_request,['opened','synchronize','reopened'],true),'CI: PR event types/branches can suppress validation');
 check(ci.on?.workflow_call?.inputs?.ref?.type==='string','CI: reusable exact-ref input missing');
 for(const [name,event] of Object.entries(ci.on??{}))if(['pull_request','push'].includes(name))for(const key of ['paths','paths-ignore'])check(event?.[key]===undefined,`CI: ${key} can bypass infrastructure PR/main validation`);
 check(equal(ci.permissions,{contents:'read'}),'CI: default credentials expanded');
 check(ci.jobs?.validate?.if==="always() && (github.event_name != 'pull_request' || github.base_ref != 'dev')" && ci.jobs?.docs?.if===undefined,'CI: mandatory job can be skipped');
 check(equal(ci.jobs?.validate?.strategy?.matrix?.node,['22.12.0','24']),'CI: required runtime matrix changed');
 check(ci.jobs?.validate?.name==='Validate Node ${{ matrix.node }}' && ci.jobs?.docs?.name==='Next.js docs','CI: named required contexts changed');
 check(ci.jobs?.validate?.needs==='native','CI: named runtime gates must require native matrix');
 check(equal(ci.jobs?.native?.strategy?.matrix?.browser,['chromium','firefox','webkit']) && ci.jobs?.native?.strategy?.['fail-fast']===false,'CI: complete independent engine matrix missing');
 check(ci.jobs?.native?.if==="github.event_name != 'pull_request' || github.base_ref != 'dev'",'CI: native engine gate can be skipped');
 for(const id of ['validate','native','docs']) {
  const job=ci.jobs?.[id];const steps=job?.steps??[];
  check(job && !job['continue-on-error'],'CI: mandatory job failure can be ignored');
  check(readOnlyJob(job),`CI ${id}: job credentials override read-only default`);
  check(steps[0]?.with?.ref==='${{ inputs.ref || github.sha }}' && steps[0]?.with?.['persist-credentials']===false,`CI ${id}: exact ref/credential isolation missing`);
  check(steps.some(s=>s.name==='Record exact checked head' && s.if===undefined && s.run?.includes('test "$actual" = "$EXPECTED_HEAD"')),`CI ${id}: checked-head assertion missing`);
  check(steps.every(s=>!s['continue-on-error']),`CI ${id}: step failure can be ignored`);
 }
 const steps=ci.jobs?.validate?.steps??[];const commands=steps.map(s=>s.run??'');
 // Presence alone is insufficient: a mandatory step with if:false reports a
 // green job while skipping its gate. Only browser-only gates may be conditional.
 const requireStep=(jobSteps,command,expectedIf=undefined)=>{
  const matches=jobSteps.filter(step=>(step.run??'').includes(command));
  check(matches.length===1 && matches[0].if===expectedIf,`CI: mandatory step missing, duplicated or skipped: ${command}`);
 };
 for(const command of ['ci-artifacts.mjs begin','pnpm check','pnpm build:browser-docs',
   'test-foundation-consumer.mjs --react18','test-foundation-consumer.mjs ${{',
   'test-editor-consumer.mjs --react18','test-editor-consumer.mjs 2>&1',
   'pnpm pack','ci-artifacts.mjs complete'])requireStep(steps,command);
 for(const command of ['test-next-consumer.mjs','verify-native-ci.mjs'])requireStep(steps,command,"matrix.node == '24'");
 const nativeSteps=ci.jobs?.native?.steps??[];
 for(const command of ['ci-artifacts.mjs begin','pnpm build:browser-docs','ci-artifacts.mjs complete'])requireStep(nativeSteps,command);
 for(const run of ['pnpm build','pnpm exec playwright test --list --project=${{ matrix.browser }} --reporter=json > artifacts/logs/browser-collection.json','pnpm test:browser --project=${{ matrix.browser }} 2>&1 | tee artifacts/logs/browser.txt'])check(nativeSteps.filter(step=>step.run===run&&step.if===undefined).length===1,'CI: complete unfiltered native engine execution missing');
 const gate=steps.filter(step=>step.name==='Require every native engine');
 check(gate.length===1&&gate[0].if===undefined&&gate[0].env?.NATIVE_RESULT==='${{ needs.native.result }}'&&gate[0].run==='test "$NATIVE_RESULT" = success','CI: native failure must fail named required contexts');
 check(steps.filter(step=>step.with?.pattern==='sgui-native-*-node-24'&&step.with?.path==='/tmp/sgui-native-ci'&&step.if==="matrix.node == '24'").length===1,'CI: native proof download missing');
 for(const command of ['pnpm check:docs','pnpm build:docs','test:e2e --reporter=list,json'])requireStep(ci.jobs?.docs?.steps??[],command);
 const at=text=>commands.findIndex(s=>s.includes(text));
 check(at('verify-native-ci.mjs')>at('pnpm pack')&&at('verify-native-ci.mjs')<at('ci-artifacts.mjs complete'),'CI: final package/native byte join ordering changed');
 check(at('ci-artifacts.mjs begin')>=0 && at('ci-artifacts.mjs begin')<at('pnpm check') && at('ci-artifacts.mjs complete')>at('pnpm pack'),'CI: fresh-output ordering changed');
 check(release.jobs?.validate?.uses==='./.github/workflows/ci.yml' && release.jobs?.validate?.if===undefined,'Release: full prerequisite can be skipped');
 check(release.jobs?.release?.needs==='validate' && release.jobs?.release?.if==="github.ref == 'refs/heads/main'",'Release: main-only prerequisite missing');
 check(equal(release.on?.push?.branches,['main']),'Release: production branch changed');
 check(equal(title.on?.pull_request?.['branches-ignore'],['dev']) && !!title.jobs?.['conventional-title'],'Title: production PR validation/dev exception changed');
 check(equal(title.permissions,{contents:'read'}),'Title: default credentials expanded');
 const titleJob=title.jobs?.['conventional-title'];
 check(titleJob?.if===undefined && !titleJob?.['continue-on-error'] && readOnlyJob(titleJob),'Title: job can be skipped, ignored or receive expanded credentials');
 check(title.on?.pull_request?.branches===undefined && title.on?.pull_request?.paths===undefined && title.on?.pull_request?.['paths-ignore']===undefined && hasTypes(title.on?.pull_request,['opened','edited','synchronize','reopened','ready_for_review'],false),'Title: PR events/path filters can suppress final title validation');
 const titleSteps=titleJob?.steps??[];
 check(titleSteps.every(step=>!step['continue-on-error']),'Title: step failure can be ignored');
 const titleChecks=titleSteps.filter(step=>step.run?.startsWith('pnpm exec commitlint --edit '));
 check(titleChecks.length===1 && titleChecks[0].if===undefined,'Title: conventional-title command missing, duplicated or skipped');

 check(equal(ai.permissions,{contents:'read'}),'AI: default credentials expanded');
 check(ai.jobs?.implement?.if==="github.ref == 'refs/heads/dev'",'AI: implementation dispatch must be dev-only');
 const validation=ai.jobs?.['validate-proposal'];const write=ai.jobs?.propose;const draft=write?.steps?.find(s=>s.id==='draft');
 check(equal(validation?.permissions,{contents:'read'}) && write?.needs==='validate-proposal','AI: separate read-only proposal validation missing');
 check(readOnlyJob(ai.jobs?.implement) && readOnlyJob(ai.jobs?.['validate-draft']),'AI: read-only implementation/full-validation credentials expanded');
 check(!JSON.stringify(validation??{}).includes('secrets.'),'AI: generated-code validation receives a secret');
 check(equal(write?.permissions,{contents:'write','pull-requests':'write'}),'AI: proposal writer permissions changed');
 check(draft?.with?.draft===true && draft?.with?.token==='${{ github.token }}' && draft?.with?.base==='dev','AI: default-token draft to dev missing');
 check(!(write?.steps??[]).some(s=>/pnpm |npm |yarn |git (?:merge|push)|gh pr merge/.test(s.run??'')),'AI: write job executes package code or merge commands');
 check(write?.steps?.some(s=>s.name==='Verify original patch identity' && s.if===undefined && !s['continue-on-error'] && s.run?.includes("throw new Error('Validation artifact changed proposal bytes')")),'AI: original patch identity check missing');
 const full=ai.jobs?.['validate-draft'];
 check(full?.needs==='propose' && full.uses==='./.github/workflows/ci.yml' && full.with?.ref==='${{ needs.propose.outputs.head }}' && full.if===undefined && !full.secrets,'AI: explicit full validation at returned draft head missing');
 return failures;
}
export function protectionFindings(receipt) {
 const failures=[];const check=(ok,message)=>{if(!ok)failures.push(message);};
 const {branchProtection,effectiveRules,queries,observedContexts,ownerReview}=receipt??{};
 check([200,404].includes(queries?.branchProtection) && queries?.effectiveRules===200 && queries?.rulesets===200,'Protection: missing/failed raw settings queries');
 const legacy=queries?.branchProtection===200 ? branchProtection : undefined;
 const branchContexts=[...(legacy?.required_status_checks?.contexts??[]),...(legacy?.required_status_checks?.checks??[]).map(c=>c.context)];
 const ruleContexts=(effectiveRules??[]).filter(r=>r.type==='required_status_checks').flatMap(r=>r.parameters?.required_status_checks??[]).map(c=>c.context);
 const required=new Set([...branchContexts,...ruleContexts]);
 const mapped=logicalChecks.map(name=>observedContexts?.[name]);
 check(mapped.every(context=>typeof context==='string' && context.trim().length>0) && new Set(mapped).size===logicalChecks.length,'Protection: logical jobs must map to distinct observed check contexts');
 const hasReview=(legacy?.required_pull_request_reviews?.required_approving_review_count??0)>0 || (effectiveRules??[]).some(r=>r.type==='pull_request' && r.parameters?.required_approving_review_count>0);
 check(hasReview,'Protection: reviewed PR requirement absent');
 for(const name of logicalChecks){const context=observedContexts?.[name];check(typeof context==='string' && context.trim().length>0 && required.has(context),`Protection: observed required context absent: ${name}`);}
 check(typeof ownerReview?.owner==='string' && !!ownerReview.owner.trim() && Number.isFinite(Date.parse(ownerReview.observedAt)) && /^https:\/\//.test(ownerReview.reference??'') && ownerReview.bypassReview===true && ownerReview.tagAuthorityReview===true,'Protection: owner/date/bypass/tag authority review absent');
 for(const scenario of ['failed-check','missing-check']) {
  const observation=receipt?.blockingObservations?.[scenario];
  check(observation?.blocked===true && /^[a-f0-9]{40}$/.test(observation.head??'') && /^https:\/\//.test(observation.url??'') && Number.isFinite(Date.parse(observation.observedAt)),`Protection: actual ${scenario} blocking observation absent`);
 }
 return failures;
}
export function checkCIReleaseEnforcement(receipt) {
 const findings=[...workflowFindings(receipt?.workflows),...protectionFindings(receipt?.protection)];
 return {status:findings.length?'incomplete':'structurally-consistent-policy-receipt',findings,limitations:'Parsed configuration and operator-supplied raw GET/observation consistency only. Does not authenticate receipts, prove live job/token behavior, supply owner consent or authorize settings/release changes.'};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
 try{const result=checkCIReleaseEnforcement(JSON.parse(readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.findings.length?1:0;}
 catch(error){console.error(error.message);process.exitCode=1;}
}
