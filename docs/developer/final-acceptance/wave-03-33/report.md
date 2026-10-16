# Wave 03-33 — extraction and replacement provenance

Delivered an unapplied, context-checked **five-target manifest/documentation patch**,
not an inventory-only handoff. All writes are inside this evidence directory.
Local base HEAD is `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, modified `dev`.
Full-leaf recommendations: **zero complete, five partial, zero blocked**. The
local AppButton replacement mapping is now concrete and reviewable; upstream
authentication, early-grid behavior dispositions and integration remain explicit.
No central checklist/count is changed.

## Reviewable changes

[provenance.patch](provenance.patch) and matching `proposed-files/` mirrors target:

- `docs/extraction-manifest.json`: change only the AppButton story's migration
  metadata; record exact initial/owned Git blobs, all four local export
  dispositions and the retained public-contract unit suite. Point directly to
  ButtonDocumentation rather than only its catalog wrapper.
- `docs/developer/extraction-lineage.md`: new durable guide with the complete
  33-story module table, exact AppButton source/unit lineage, explicit old/new
  rendering differences, 16 early grid exports still needing behavior disposition,
  and a proposed historical-reference policy that does not waive literal-zero rules.
- `docs/migration.md`: link the specific lineage guide and distinguish external
  original-source identity from local extracted evidence.
- `docs/developer/react-aria-removal-audit.md` and
  `docs/developer/react-aria-i18n-acceptance.md`: append current host/workspace
  supplements. Preserve all existing historical paragraphs, counts and receipts.

The patch leaves sourceRepository/sourceCommit/sourceRoot, all 201 original
source/destination strings, row order and present flags unchanged. No runtime,
public API, fixture module, registry, browser assertion, catalog/generated output,
legal text, lockfile, workflow or historical evidence file is changed. The
experimental Button fixture keeps its single original migration mapping; adding
a duplicate AppButton module mapping would misrepresent the transfer and can
duplicate generated IDs.

## Findings and evidence reuse

The current 36-row repair is already correct: **201 rows, 159 present, 42 absent,
zero presence mismatches**, with all **53 replacement references** present and
byte-unchanged against fix-05. Eight shared fix-05 input hashes were compared;
seven match. The central final-acceptance ledger has changed and is not relabeled
as the old snapshot. Six relevant files also match coordinator-integration input
hashes. All comparisons are explicit in [evidence.json](evidence.json).

Initial local extraction commit `21adebd61bedfc6a1ed395fe664ff4be83896821`
contains all 33 manifest story paths. Their pre-docs versions at parent
`530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^` have 32 exact module replacements
in the current native migration manifest, all retaining their exported scenario
names. The remaining AppButton stories are deliberate replacements. Both inspected
generations of all 33 local modules have zero `play` properties and zero
`expect`/`assert` calls by the bounded TypeScript AST traversal. This does not
audit imported helper assertions, browser specs, all intermediate Git versions
or the unavailable upstream source. File transfer is not semantic parity.

Initial AppButton blob `55e160e15e974ffa4e9814724aa1223b84aed6d8` exports
Default/Variants. Owned migration `8f41479c6f2ea5822ff0c149e359e2c6e0893f13`
adds PendingAndDisabled/NativeForm, blob
`81d785a261d4b1a61b17939a682ce9a23e783039`, unchanged immediately before docs
migration. Default maps to ButtonOverview; Variants to ButtonReference;
PendingAndDisabled to ThemesAndDensity; NativeForm to ButtonForm plus
NativeFormTransitions. Labels, count diagnostics, added reset and owned prop
changes are documented. No story assertion is invented.

Pre-docs AppButton test blob `8cb45f5dc1932702ca7a2fba6a4e3718173856dd`
equals current Button.public-contract.test.tsx exactly after replacing AppButton
with Button. Current SHA-256 is
`a6a889184067897c944c93993655ceb049692cb5a51453e71f37d33c21bc2db6`.
Four existing cases preserve activation count/ref/default type, pending/disabled
suppression and pending focus, explicit native submit, and SSR attributes/slots.
This proves local assertion source continuity, not a fresh test run or the
original upstream behavior. HEAD's breaking-change message explicitly removes
AppButton/AppButtonProps; the patch does not restore them.

The original upstream commit `8e63f1e16fc3d43d851908b312603a1099ca13d9`
is absent from this SGUI object database. `git cat-file -t` returned exit 128;
the exact diagnostic is preserved in evidence.json. No network, learner checkout
or other repository was accessed. External unchanged-repository status relative
to an unknown baseline cannot be independently certified here.

An additional initial-to-pre-docs comparison finds **16 earlier grid scenario
exports** absent before docs migration: nine AppDataGrid and seven AppDataGridShell.
They are individually listed with their initial blob identities in the proposed
lineage guide and evidence. Related current list/selection/reorder/view/server
examples are candidates only. Structured cell matrices, combined checkbox/drag
and sectioned/collapsible rows need individual semantic comparison or deliberate
retirement. This is an actionable W-10 successor, not a new claim of lost runtime
implementation or a request to restore Storybook.

## Original acceptance leaves

### A-B-12 — partial

Original: Review the extraction manifest against actual files so helpers, model
presets, nodes/plugins, fixtures, and tests are not lost when directories move.

Reused accepted fix-05/parallel-15 inventory; all 53 current replacement hashes
match. Revalidated 201 row presence and inspected all 33 local stories at two Git
generations. Prepared exact AppButton replacement and assertion-source mapping.
Remaining: integrate/review the patch, supply upstream commit-bound provenance
or explicitly accept the bounded local replacement scope, and disposition the
16 early grid exports before claiming original example behavior completeness.

### A-B-14 — partial

Original: Keep the learner platform unchanged; collect reference behavior and
source provenance read-only.

All reference collection used local SGUI Git reads; learner platform was neither
accessed nor mutated. Original identity remains intact and unavailable upstream
object is explicitly recorded. Remaining: durable original-commit-bound source
and behavior evidence, supplied through an authorized read-only archive/capture.
Local extraction cannot independently authenticate its declared upstream bytes.

### A-W-10 — partial

Original: Retain the 33 existing story files or document deliberate replacements;
add missing catalog coverage for primitives, adapters, calendars and grid helpers.

Complete reviewable 33-module mapping plus the four AppButton export dispositions
is delivered. The 32 direct pre-docs transfers retain scenario export names; both
inspected local generations have no executable story assertions. Remaining:
integrate mapping, compare each of the 16 earlier grid export behaviors, and finish
the existing DOCS-005-b/public-helper example obligations. Current catalog
membership and prior snippet receipts remain bounded evidence, not full parity.

### A-W-16 — partial

Original: Update docs/migration.md and the extraction manifest to preserve useful
provenance and account for moves/deletions; do not misrepresent the original
extraction as the final architecture.

Delivered exact migration/manifest/lineage patch distinguishing four source and
host generations with all row identities preserved. Remaining: coordinator
review/application and metadata verification. Keep upstream and early-grid
limits visible until those separate evidence obligations are settled.

### A-Z-05 — partial

Original: Rewrite historical manifest entries/document explanations where
necessary for literal-reference removal while retaining source repository/commit
provenance; do not rewrite Git history or invent provenance.

Delivered provenance-preserving metadata and current host supplements. Original
source identifiers, Git objects, snapshots and dated receipts remain unchanged.
The proposed reference policy preserves precise history/removed API names needed
for migration, without silently treating that as approval to waive literal-zero
requirements. Remaining: integrate patch and resolve the explicit scope/policy
decision. Legal/notice owner review remains separate; no legal text is altered.

## Validation and handoff

Executed:

```sh
node docs/developer/final-acceptance/wave-03-33/audit.cjs
python3 docs/developer/final-acceptance/wave-03-33/prepare.py
python3 docs/developer/final-acceptance/wave-03-33/verify.py
git apply --check docs/developer/final-acceptance/wave-03-33/provenance.patch
```

All four checks pass. Source audit runtime: **Node 26.5.0 / TypeScript 5.9.3**;
metadata preparation/verification: **Python 3.9.6**. Node 26 is used only for AST,
hash and read-only Git inspection, not supported-runtime compatibility evidence.
[verification.json](verification.json) records unapplied patch state, 201 original
row identities preserved and 39 checked local file links in the new guide.
[patch-inputs.json](patch-inputs.json) supplies exact base/proposed hashes;
[results.json](results.json) retains each original checklist statement and
successor. [validation-plan.json](validation-plan.json) gives the integration
checks and external evidence requirements. The verifier also runs after patch
integration and requires all target hashes to match the reviewed mirrors.

No unit/browser/consumer/build/catalog/install command was needed or run for
this metadata-only proposal. Existing runtime receipts are retained only for
their unchanged inputs and original limits. No new server, lease, Git mutation,
conversation, message to another chat, release or publication occurred. The
personal workspace file and existing server were untouched.
