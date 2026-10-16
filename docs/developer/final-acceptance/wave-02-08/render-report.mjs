import {readFile,writeFile} from 'node:fs/promises';
const dir='docs/developer/final-acceptance/wave-02-08/';
const r=JSON.parse(await readFile(dir+'results.json','utf8'));
const a=JSON.parse(await readFile(dir+'input-evidence.json','utf8'));
const lines=[
'# Wave 02 / 08 — host state, dates and UI acceptance',
'',
'**19 original leaves reviewed: 12 complete, seven partial, zero blocked.** These are evidence-backed recommendations to the coordinator; shared counts/checklists were not edited. Complete means the particular original definition/implementation obligation is substantiated, not all-library browser/device/AT acceptance. The 20 editor V leaves and future production gates remain open.',
'',
`Reviewed modified dev checkout at HEAD \`${r.head}\`; exact capture time \`${a.capturedAt}\`. The audit runtime was ${a.runtime}; this runtime only read/hash-compared source and did not execute product tests. Retained FA-04 unit evidence is local Node 24, not a newly executed Node matrix.`,
'',
'## Checks and attribution',
'',
'AGENTS.md, the current final-acceptance ledger and each full original leaf in react-aria-hardening-tasks.md were read. Existing parallel-08 token reconciliation, parallel-13 adapter evidence and parallel-14 i18n evidence were reused without repeating their scans. Actual scoped implementation, stylesheet, test assertions and relevant historical contracts were inspected.',
'',
'New read-only evidence command (run from repository root):',
'',
'```sh',
'node docs/developer/final-acceptance/wave-02-08/audit.mjs',
'```',
'',
`[input-evidence.json](input-evidence.json) captures ${a.files.length} exact SHA-256 input records, a syntactic test-title index, prior evidence-log hashes, branch/head/runtime and historical formatter comparisons. ${a.files.filter(f=>f.matchesBaseline===true).length} records match FA-02/FA-01. Five differ: one is the precise FA-04 corrected DateRangeSelector test; four are concurrent forms guidance and TextArea source/style/test changes. Two parallel reports postdate those original snapshots and are captured as new evidence references. Test titles are an index, not newly passed results.`,
'',
'FA-04 retained evidence: fa04-original-check.txt records 32 foundation tests passed, production typecheck passed, then 275 passing unit suites and four failing calendar suites. The enclosing command failed. Its delta and affected rerun resolve the nine failing cases while retaining unaffected current-input unit results. We reuse that scoped evidence, including existing hook/SSR/DOM tests; we do not claim a new suite run or invent individual per-file passing counts from compact output. Exact logs are hashed in the audit. No test runner or shared output was mutated.',
'',
'The coordinator changed TextArea while this review was running. Current source now renders inherited decorative icons and has a new multiline naming/ref/form test; its bytes differ from FA-02 and are excluded from FA-04 pass claims. BUG-0008 composite picker changes are not part of this audit. No old built output is asserted to cover either concurrent fix. Package imports established by prior unchanged package receipts are not a new package audit for changed source.',
'',
'New historical attribution for H-12 compares four files directly to tested commit 4529de0ccefc11ebed799a8480477baf5e931324: helper, test, card re-export and its test all match byte-for-byte. The retained batch05 report records 59 cases/five related files per UTC, America/New_York, Asia/Kathmandu and Pacific/Kiritimati with German runtime locale on Node24.21.0. This is exact source-bound historical execution evidence; raw old transcripts were not recovered anew. The report does not upgrade it to current browser/hydration proof.',
'',
'No install, suite execution, build, native/browser/consumer run, remote CI query, legal approval, server action, Git mutation or release operation occurred. Writes are confined to wave-02-08. Partial leaves need the named owners/actions below; source inspection is not a substitute for native or spoken-output evidence.',
'',
'## Outcome table',
'',
'| Leaf | Status |',
'| --- | --- |',
...r.leaves.map(l=>`| ${l.id} | ${l.status} |`),
'',
'## Concrete grouped-field contract for U-04 owner review',
'',
'The narrow proposed interpretation uses the existing internal input base and native fieldset/legend composition; it adds no unsupported public InputBase. A host owns one group description/error ID and per-field labels, passes field-specific errorMessage/invalid to controls, and submits/resets the native form. RadioGroup is only a mutually exclusive-choice group and cannot substitute for this composition. A group message may use aria-describedby on the fieldset and, where needed for consistent control announcement, the supported aria-describedby on each text control. Ensure every referenced ID is rendered; do not duplicate the visible label as an error.',
'',
'```tsx',
'import { TextField } from "@structured-growth/sg-ui/primitives";',
'',
'// The application already loads styles.css and supplies Provider.',
'export function ContactFields() {',
'  return <fieldset aria-describedby="contact-help">',
'    <legend>Contact details</legend>',
'    <p id="contact-help">Supply both names for the course contact.</p>',
'    <TextField label="Given name" name="givenName" required',
'      aria-describedby="contact-help" errorMessage="Enter a given name." />',
'    <TextField label="Family name" name="familyName" required',
'      aria-describedby="contact-help" errorMessage="Enter a family name." />',
'  </fieldset>;',
'}',
'```',
'',
'This is a reviewable contract/example proposal, not a compiled or native-tested snippet. Use instance-specific host IDs when rendering two copies; fixed IDs above illustrate one instance only. Owner acceptance, a maintained source-backed example, public-type check and actual grouped legend/error/reset evidence are still required. The present report does not unilaterally close the batch110 input-base/grouping decision.',
];
for(const leaf of r.leaves){
 lines.push('',`## ${leaf.id} — ${leaf.status}`,'',`Original requirement: ${leaf.originalRequirement}`,'','Source/document references: '+leaf.sourceReferences.map(p=>'`'+p+'`').join(', ')+'.','','Existing test references: '+leaf.testReferences.map(p=>'`'+p+'`').join(', ')+'.','',...leaf.findings.map(f=>'- '+f),'',`Limits: ${leaf.inputHeadHostLimits}`);
 if(leaf.successors.length)for(const s of leaf.successors)lines.push('',`Successor **${s.id}**: ${s.deliverable}`,'',`Prerequisites: ${s.prerequisites}`);
 else lines.push('','No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.');
}
await writeFile(dir+'report.md',lines.join('\n')+'\n');
console.log('Rendered report.md from all 19 result records.');
