from pathlib import Path
import json
own=Path('docs/developer/final-acceptance/wave-03-26')
a=json.loads((own/'assignment.json').read_text())
node='/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
command=f'{node} /tmp/sgui-calendar-validate.mjs {node} packages/ui/node_modules/vitest/vitest.mjs run --config docs/developer/final-acceptance/wave-03-26/vitest.overlay.mjs'
plan={'integrationRequired':True,'mutationsMade':'Only this evidence directory; production changes are mirrors/unified patch.','executed':[{'cwd':'/Users/thomashall/Repositories/sg-ui','command':command,'expected':'27 passing tests in 2 suites','actual':'pass','receipt':'unit-overlay.txt'},{'cwd':'/Users/thomashall/Repositories/sg-ui','command':'WAVE26_BASELINE=1 '+command,'expected':'New malformed saved-image and upload-metadata tests fail against original implementation; existing 25 tests pass','actual':'exactly 2 fail, 25 pass','receipt':'unit-baseline.txt'},{'command':'git apply --check docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch','actual':'exit 0; not applied'}],'coordinator':[{'stage':'Review and integrate','command':'git apply --check docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch && git apply docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch','expected':'6 files integrated after reviewing current hash/preconditions; no release or central-ledger edits.'},{'stage':'Integrated affected checks','cwd':'packages/ui','commands':['pnpm exec vitest run src/components/PageRichTextEditorSection/lexical/ImageNode.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx','pnpm typecheck','pnpm foundations:check'],'expected':'27 tests and declaration/import checks pass against integrated files.'},{'stage':'Fresh fixture only when scheduled by coordinator','cwd':'packages/ui','commands':['pnpm build','node scripts/build-browser-docs.mjs','pnpm exec playwright test tests/browser/editor-image-sources.spec.ts tests/browser/editor-upload-lifecycle.spec.ts tests/browser/editor-image-lifecycle.spec.ts tests/browser/image-upload-validation.spec.ts'],'expected':'Existing syntax/decode/metadata/retry/stale-session/object-URL assertions pass on named engines; use existing pool/config/host under coordinator ownership.'},{'stage':'Remaining browser gap','command':'Add malformed-metadata upload variant described in trust-review.md to existing ImageSources native fixture/spec, then run editor-image-sources.spec.ts','expected':'Before retry: unchanged JSON, zero insertions, exact metadata error, retained file/description. After retry: one decoded image, original description, valid asset IDs; host URLs never revoked.','blockedOn':'Coordinator fixture integration/build; no native evidence claimed.'},{'stage':'Owner/host trust decisions','command':'Resolve exact decision table in trust-review.md with service/document owner','expected':'Approved allowed/rejected/preserved fields and service/CSP/authorization/redirect/abort/stale-asset outcomes; then implement and run policy-specific hostile corpus.','blockedOn':'External policy/adapter/service evidence not supplied.'}]}
(own/'validation-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
rows=[]
for id in a['ids']:
 rows.append({'id':id,'status':'partial','originalRequirement':a['originalChecklistStatements'][id],'substantiveOutcome':'Prepared image runtime-shape guard at node factory and current host-upload boundary, retryable translated error, malformed saved-metadata and upload/retry regressions, valid escaped-description/metadata fidelity, consumer contract update.','patch':'image-runtime-shapes.patch','proposedIntegrationRequired':True,'execution':{'command':command,'runtime':'Node 24.19.0 / Vitest 4.1.11 / jsdom','result':'2 suites, 27 tests passed in source overlay; current implementation yields 2 expected new-regression failures, 25 pass','receipts':['unit-overlay.txt','unit-baseline.txt','unit-overlay-first-failure.txt']},'hashes':'evidence.json#inputHashes and #artifactHashes','acceptedEvidenceReused':'55/55 overlapping wave-02-03 inputs unchanged; retained URL/file/stale-upload matrix with original host/runtime limits. Coordinator integration evidence reviewed, scope only BUG0008–0012/A-G-02/A-K-16; no overlapping input hashes and no editor inference.','residualSuccessors':([{'id':'W03-E06-INTEGRATE','requirement':'Review/apply patch; run integrated type/import checks and focused browser metadata/retry case.'},{'id':'W03-E06-HOST','requirement':'Host/service policy and tested byte/type/size/dimension/authorization/network abort/stale-asset cleanup outcomes; no owner evidence supplied.'},{'id':'W03-E06-MATRIX','requirement':'Owner-approved encoded/redirect/resource policy and native new malformed-metadata variant; retained lifetime cases not repeated.'}] if id=='A-E-06' else [{'id':'W03-E07-INTEGRATE','requirement':'Apply and validate runtime-shape/escaped-description patch; it does not establish document-level recovery.'},{'id':'W03-E07-TRUST','requirement':'Owner policy for author CSS, malformed/unregistered node/version/whole-document rejection, remote/data/blob images and downstream JSON rendering; then approved hostile native corpus.'}]),'limitations':['Patch-only result does not close runtime acceptance.','No new browser/physical-device/AT/service/legal/owner approval.','Factory rejection is not atomic document validation; silent Lexical onError and downstream trust remain open.']})
(own/'results.json').write_text(json.dumps({'assignment':26,'status':'partial','completedLeaves':0,'partialLeaves':2,'scope':'A-E-06 and A-E-07','results':rows,'evidence':'evidence.json','validationPlan':'validation-plan.json','mutationBoundary':'Only docs/developer/final-acceptance/wave-03-26; no source/staging/branch/build/server/ledger changes.'},indent=2)+'\n')
report=f'''# Wave 03-26: editor image metadata and trust

A-E-06 and A-E-07 remain **partial**. This delivery contains a concrete six-file patch, matching proposed-file mirrors and executed regression evidence. No production/source/test/central-ledger file was modified. No acceptance count was changed.

## Substantive patch

`image-runtime-shapes.patch` adds a small private runtime shape guard shared by the image factory and host-upload completion. It rejects non-string source/description/asset IDs and non-finite/non-numeric dimensions before creating an image node. Existing optional null/default behavior, source syntax policy, valid metadata and decorative alt survive. Current malformed upload output leaves the dialog/file/description available, reports translated retry feedback and cannot insert a node. Stale results are ignored before validation, and no host URL is revoked.

The patch extends the existing integrated retry test with malformed metadata and adds a real Lexical factory/import regression plus React escaped-attribute/JSON-fidelity assertions. Consumer documentation explicitly states that rejecting malformed image fields does not implement atomic document validation, version migration or recovery; the existing silent Lexical error handler remains a separate whole-document concern.

## Evidence

- Patched read-only source overlay: **27 passed in 2 suites**, Node **24.19.0**, Vitest **4.1.11**, jsdom, `unit-overlay.txt`.
- Same proposed tests with original implementations: **2 expected failures / 25 passes**, `unit-baseline.txt`. Malformed metadata is accepted on the original paths; the new regression assertions detect it.
- The first overlay attempt failed to resolve the new helper from `./lexical/`; `unit-overlay-first-failure.txt` is retained. Only the evidence overlay resolver was corrected, then both suites passed.
- `git apply --check docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch` passed. The patch has **not been applied**.
- `evidence.json` records exact inspected input/proposed artifact hashes and current dev HEAD. All **55/55** overlapping wave-02-03 inputs are unchanged; accepted URL, file metadata and stale-upload evidence is reused with its original limits. Coordinator integration evidence is retained for its own named fixes; it has no overlapping editor input hashes and supplies no new editor closure.

Reproduce overlay from repository root through the inspected validation lease:

```sh
{command}
```

The overlay uses mirrors for six files, the existing installed dependency graph and an evidence-owned cache; all other source dependencies remain in the shared checkout. This is executed source/jsdom evidence, not a compiled-package/native-browser result. No install/build/server was started. Exact integration/check/build/native commands and assertions are in `validation-plan.json`.

## A-E-06 — partial

**Original requirement:** {a['originalChecklistStatements']['A-E-06']}

The runtime-metadata and retry gap now has a tested patch. Retained object-URL and late-promise ownership cases are unchanged. Remaining: integration and browser verification of the new metadata case, owner-approved encoded/redirect/resource policy, and real host byte/type/size/dimension/authorization/abort/stale-asset cleanup evidence. No host adapter/service or owner attestation was supplied; the UI cannot safely invent those policies or delete host assets.

## A-E-07 — partial

**Original requirement:** {a['originalChecklistStatements']['A-E-07']}

The patch provides bounded rejection/fidelity at the image boundary without broadening URL policy. `trust-review.md` specifies exact remaining decisions for author CSS, unknown/malformed nodes/versions, document-level failure recovery, remote/data/blob requests and downstream JSON renderers. Valid author styling is intentionally not purged without a policy. A rejected factory call is not evidence that a whole document is atomically rejected; the host must retain originals and avoid overwriting them from partial parsing. Native hostile-style/request observations and owner approval remain absent.

## Delivery

Review `image-runtime-shapes.patch`, `proposed-files/`, `validation-plan.json`, `trust-review.md`, `results.json` and `evidence.json`. `prepare.py` recreates the patch from current production inputs; `capture.py` records hashes; `write-results.py` writes this report and structured results. The coordinator should check input hashes before applying because the checkout is shared and dirty. No browser, real-device/AT, host-service, packed-consumer or production acceptance is claimed.
'''
(own/'report.md').write_text(report)
