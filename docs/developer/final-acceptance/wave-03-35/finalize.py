from pathlib import Path
import json,hashlib,datetime
out=Path(__file__).resolve().parent;root=out.parents[3]
a=json.loads((out/'assignment.json').read_text());ev=json.loads((out/'input-evidence.json').read_text())
leaves=[]
data={
'A-M-38':('partial','All37 original rows now retain the earlier F/T/V and acceptance references, per-row current source hashes, latest attributable local path commit, and the matching wave-02 leaf result/hash. No per-row human-reviewed PR attribution is fabricated.','migration-trace.json',[{'id':'W35-M38-REVIEW','requiredEvidence':'Coordinator/maintainer attach actual per-row reviewed PR/commit and row-specific retained validation receipts. Local commit history and initial draft PR1 do not establish review. Resolve original held criteria with current reports while retaining20 editor V and broader G/E/device/AT holds.'}],False),
'A-Z-04':('complete','Literal tracked-file audit completed without the prior personal/evidence exclusions:1657 tracked current text files,61 matching files,811 matching lines. Every match has a disposition; personal-state files have zero matches. No positive retired runtime/configuration requirement was found. Historical/legal names remain deliberately classified rather than erased.','tracked-text-audit.json',[],False),
'A-Z-08':('partial','Reused exact coordinator package/source/output evidence after zero input/output hash deltas. Delivered ready-to-apply package-audit retention patch and executable all-member tarball classifier with three passing focused tooling cases. No final durable candidate archive or legal-owner approval is asserted.','retain-packed-and-audit-docs.patch',[{'id':'W35-Z08-CANDIDATE','requiredEvidence':'Coordinator integrate patch, run existing package audit against frozen validated output with --retain-packed in a new directory, then run audit-packed.py on that exact archive. Retain archive SHA/file manifest and join installed dependency closure and owner-approved notice/source/asset provenance. Exact commands/assertions in validation-plan.json.'}],True),
'A-Z-10':('partial','Completed exhaustive baseline/current symbol successor:638 baseline route/name identities (266 names) joined to469 captured contracts; all238 current declaration entry name sets match. Aliases retained;12 absent baseline names each have an explicit owned replacement/guide/release impact. Added217 contracts are separately identified. Helpers, presets, hooks, adapters, model types, icon helper paths and experimental exports are included.','public-symbol-dispositions.json',[{'id':'W35-Z10-INTEGRATE','requiredEvidence':'Coordinator reconcile/apply the independently reviewed36 extraction metadata amendments and original Button-story assertion mapping from wave-02-14/parallel-15; accept the symbol dispositions with the corresponding implementation migration receipts. Inherited upstream prop/default compatibility and exhaustive breaking-release markers remain A-Z-13 and are not inferred from names. No whole-row behavioral acceptance follows from this join.'}],False)
}
for id in a['ids']:
 status,outcome,evidence,successors,patch=data[id]
 leaves.append({'id':id,'originalRequirement':a['originalChecklistStatements'][id],'status':status,'outcome':outcome,'evidence':[evidence,'input-evidence.json','validation-plan.json'],'commandsPerformed':['python3 docs/developer/final-acceptance/wave-03-35/audit-tracked.py','node docs/developer/final-acceptance/wave-03-35/join-exports.mjs','python3 docs/developer/final-acceptance/wave-03-35/build-deliverables.py','python3 docs/developer/final-acceptance/wave-03-35/test-audit-packed.py','node --check docs/developer/final-acceptance/wave-03-35/proposed-files/packages/ui/scripts/check-package.mjs','git apply --check docs/developer/final-acceptance/wave-03-35/retain-packed-and-audit-docs.patch'],'runtime':ev['runtime'],'hashEvidence':'input-evidence.json and artifact-manifest.json','proposedPatchNeedsIntegration':patch,'successors':successors,'limits':['Working-tree/hash evidence; no commit/review approval inferred from HEAD.','No shared install/build/pack/catalog/native/consumer execution in this owner; synthetic archive tests validate the audit tool only.','Preserved legal/immutable historical references do not establish a retired runtime dependency. No notice deleted.']})
result={'schemaVersion':1,'owner':'wave-03-35','capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baseHead':ev['head'],'leaves':leaves,'summary':{'complete':1,'partial':3,'blocked':0},'integration':'Patch/proposed mirrors only; no production/source/test/docs edits outside this evidence directory. No shared checklist/count update.','substantiveDeliverables':['All-tracked no-exclusion reference classification','Full baseline/current public export identity and alias join','37-row per-path local commit and receipt trace','Optional exact tarball/file-hash retention patch','All-member archive classifier and focused synthetic regression tests','Current238-entry export delta check and four declaration delta dispositions']}
(out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
report='''# Wave03-35 — source, scope and packed-removal successors

One original leaf is recommended complete; three remain partial with concrete
successors. No central checklist/count was changed. Everything written is inside
`docs/developer/final-acceptance/wave-03-35`.

The deliverable is a reviewable package-audit patch, executable audit/test tools,
and complete symbol/reference/row joins. No shared install, build, pack, catalog,
server, browser, Git mutation, publication, legal edit or extra conversation ran.

## Evidence that remains valid

All four assignment prior-report/results hash comparisons pass. Every source/input
and library-output hash in `coordinator-integration/evidence.json` still matches.
Its package/import/type/packed-equality and owned-foundation receipts are therefore
retained for their stated scope, including the integrated BUG0008–0012 fixes.
No unchanged accepted runtime suite was repeated.

Compared with parallel-01's older declaration snapshot, four files differ: one
new private reserved-grid-field helper, two import-format changes and DateField's
validity JSDoc correction. [Declaration review](declaration-change-review.json)
records exact hashes. The checker reread existing current declarations for all238
entry points: no public route/name change. Eleven source files differ from that
older API snapshot; those exact deltas are retained, and the newer coordinator
receipt supplies the matching build/runtime evidence. No old snapshot is relabeled
as fresh output. Local tools used Node26.5.0 for AST/syntax reading and Python3.9.6;
this is not a new Node22/24 consumer support result.

## Concrete results

'''
for leaf in leaves:
 report+=f"### {leaf['id']} — {leaf['status']}\n\n**Original requirement:** {leaf['originalRequirement']}\n\n{leaf['outcome']}\n\nEvidence: [{leaf['evidence'][0]}]({leaf['evidence'][0]}).\n\n"
 for x in leaf['successors']:report+=f"**{x['id']}:** {x['requiredEvidence']}\n\n"
report+='''## Reference and export decisions

The tracked audit reads every current `git ls-files` file, including hidden
configuration, lockfile, workflows, templates, extensionless legal files, frozen
baseline evidence and personal state. It emits hashes and matching token/line
metadata, never personal contents. There are no binary/deleted tracked files at
capture and no personal matches. The 811 lines classify as689 immutable baseline,
69 migration/history/removal guidance,21 negative guard/test,18 legal,4 opaque
integrity,4 owned motion-token substring,3 independent demo identity and3 policy
prohibition. All nonbaseline matching lines were inspected; baseline identities
reuse their accepted unchanged provenance. No exclusion is called all-file coverage.
Untracked acceptance files are evidence, outside the literal tracked criterion;
their prior classifications and hashes are retained, not runtime requirements.

The export join handles alias identities explicitly: AppThemeProvider→Provider,
Autocomplete→ComboBox, SGLink→Link and RowSubHeader→OwnedGridRowSubHeader. Shared table
part prop aliases remain. MenuItem retains a type name but its JSX runtime value
was removed. The12 absent baseline names are AppButton/AppButtonProps,
FormControlLabel/FormControlLabelProps, MuiLink/MuiLinkProps, MenuItemProps,
SelectChangeEvent, AppGridSortModel, theme/lightTheme/darkTheme. Every one has an
explicit owned replacement and migration impact; names are not compatibility proof.
All469 current contracts include route identities, declaration hashes/references,
existing source/guide links, baseline/additive disposition and release impact.
The217 additive contracts count contracts, not unique components or glyphs.

## Patch and validation

[retain-packed-and-audit-docs.patch](retain-packed-and-audit-docs.patch) proposes:

- `packages/ui/scripts/check-package.mjs`: optional `--retain-packed=NEW_DIRECTORY`
  runs the existing checks, then preserves the exact successful archive and SHA-256
  manifest for every packed file. Default cleanup/check behavior stays intact.
  A preexisting destination fails rather than replacing earlier evidence.
- `docs/developer/react-aria-removal-audit.md`: adds a current dated host/scope/symbol
  receipt while preserving original historical evidence and legal holds.
- `docs/developer/react-aria-grid-presets.md`: replaces a stale current-story-host
  assertion with the docs website/native host.

[Proposed mirrors](proposed-files/) and [precondition hashes](patch-preconditions.json)
make review/integration concrete. Patch applicability and script syntax pass.
The optional retention path itself still needs the existing package audit run
after coordinator integration; no production runtime closure is claimed from a patch.

[audit-packed.py](audit-packed.py) reads an existing archive without extraction,
hashes every member and the original archive, scans JS/declarations/CSS/maps/assets/
README/notices including binary ASCII text, rejects unsafe/duplicate/nonregular
members and retired dependency keys, and records legal text for owner review.
Three [focused tests](test-audit-packed.py) pass: legal-preserving clean receipt,
source-map/binary references, and unsafe path/retired dependency rejection.
These are audit-tool tests, not browser/native/AT or package-runtime evidence.

[validation-plan.json](validation-plan.json) gives exact commands, prerequisites
and expected assertions. Candidate archive retention, installed dependency closure,
legal/derived-asset approval and actual per-row review attribution remain missing.
No notice deletion, legal approval, release identity or inherited-prop compatibility
is inferred. [Retained tooling failures](retained-failures.txt) record corrected
exploratory summary/link mistakes; no product failure was suppressed.

Reproduce the captures from the repository root, in order:

```sh
python3 docs/developer/final-acceptance/wave-03-35/audit-tracked.py
node docs/developer/final-acceptance/wave-03-35/join-exports.mjs
python3 docs/developer/final-acceptance/wave-03-35/build-deliverables.py
python3 docs/developer/final-acceptance/wave-03-35/test-audit-packed.py
```

Later snapshots may legitimately change counts/hashes; retain the dated receipt
rather than overwriting it as proof for different source. The coordinator owns
review, integration, shared acceptance ledgers and required production gates.
'''
(out/'report.md').write_text(report)
