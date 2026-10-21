# Wave 02 / 14 — final removal and completion gates

Reviewed 2026-10-16, modified shared `dev` checkout, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Recommendations: **A-Z-01, A-Z-02,
A-Z-03 complete; A-Z-04–16 partial.** No blocked status is used. The coordinator
owns closure and shared counts. Original requirement text is preserved per leaf
in [results.json](results.json), rather than inferred from historical checkboxes.
Twenty editor V leaves and every required production gate remain required.

Only `docs/developer/final-acceptance/wave-02-14/` was written. No shared source,
checklist, manifest, earlier report, generated library output or legal file changed.
No suite/build/install, browser/consumer/server action, Git mutation, remote CI/
registry query, publication or additional agent/conversation ran here.

## New evidence and its limits

Ran `python3 docs/developer/final-acceptance/wave-02-14/reconcile.py` from the root.
The script succeeded, writes only here and uses Python's standard library. It:

- Reuses FA-02's source/import/dependency inventory, hashes its saved input set
  for deltas, and reuses FA-01 and parallel-01/15 outputs instead of regenerating
  export/dependency/extraction scans.
- Supplements FA-02's **case-sensitive** retired-text pattern and extension filter
  with the omitted broad/case-insensitive cases, including extensionless LICENSE
  files. Reads only candidate text, classifies every supplemental row, explicitly
  records personal-state exclusions and binary/non-UTF8 files. No hidden exclusion
  is represented as all-tracked coverage.
- Records exact current/source-snapshot hashes in [evidence.json](evidence.json).
  Three picker implementations and TextArea differ from the public API snapshot;
  every captured declaration still matches it. Current TextArea CSS/tests and
  picker tests also differ from FA-02, alongside FA-04's four previously corrected
  inputs. These are **not** covered as current runtime results by old builds/tests.
- Produces [manifest-amendments.json](manifest-amendments.json), 36 concrete
  proposed metadata changes derived from parallel-15's accepted inventory, with
  replacement candidates/existence/hashes and explicit assertion-parity limits.
- Produces [reference-dispositions.json](reference-dispositions.json) and
  [reference-rewrite-proposals.json](reference-rewrite-proposals.json), with
  concrete current-prose and provenance-preserving amendment instructions.
- Reuses the concurrent legal reviewer's `wave-02-05/license-inventory.json` and
  `license-text-comparison.json`, hashes them, verifies their manifest/lock hashes
  equal this checkout, and writes [notice-review.json](notice-review.json).
  No duplicate installed-license scan was run here. That evidence has 55 text
  comparisons; 18 normalized texts are not contained in the combined notices.
  This is a review queue, **not** a finding that 18 licenses are legally violated.

An initial probe used the obsolete root release-config path, then correctly read
`packages/ui/release.config.mjs`; guessed AI workflow paths were corrected to
`.github/workflows/ai-code.yml`. An incidental Python summary attempted `len()`
on a stored integer and failed; the inventory/audit script and JSON generation
succeeded. No failed test/build was suppressed or rerun.

FA-04 remains local Node 24 evidence: original combined check failed four calendar
suites; the corrected affected rerun reconciled those failures, while unrelated
passing scopes were retained. The package/build/docs-native/release transcripts
remain dated successes for their recorded inputs. They do not establish the new
four implementation changes, remote CI, native/AT/legal approval, or a final
release artifact. Old batch133/134 statements are historical receipts, not fresh
exact-head execution. Source analysis is not browser/device/AT conformance.

## Removal leaves

**A-Z-01 — complete.** FA-02 records 586 installed name/version nodes and 985
edges with no retired component/grid/icon/Emotion package. Root/library/docs
manifests and lockfile retain their saved bytes; current library runtime/peer/dev/
optional declarations contain no retired package. No dependency edit accompanies
the four coordinator fixes. FA-02 foundation and FA-04 package checks retain their
recorded source/transitive/declaration/output rejection evidence. This closes
removal from the reviewed dependency configuration/dated installed graph; it is
not a fresh physical-node_modules audit, license decision or registry publication.
Successor: none for this leaf; a dependency/lock change requires a scoped delta.

**A-Z-02 — complete, implementation removal.** Reuse FA-02's 5,005 import/reexport
references and four ambient declarations, and FA-04's fresh emitted/package audit.
There is no positive retired import/reexport/augmentation, retired class styling,
old public theme-object export, retired mock or fixture runtime requirement in
that evidence. The supplemental cases in current product source are two negative
SSR assertions and incidental `scaleMotionDuration` substrings; guard regexes
reject old selectors rather than require them. Current four implementation deltas
use owned APIs/React Aria and add no retired foundation reference. Preserved
AppThemeProvider is the owned Provider alias; its name is an intentional public
compatibility contract, not an old theme implementation. Storybook was replaced
by the docs native host. Historic API names in migration instructions and
negative API proof cases are evidence, not shipped runtime requirements.
Successor: none for this source-removal leaf. Z-07/08 separately require fresh
candidate artifacts; this result does not transfer old runtime passes to changed
code or waive legal/historical-reference reconciliation.

**A-Z-03 — complete.** Reuse the removal audit and parallel-15's 201-row manifest
reconciliation. The typography augmentation, old grid styling helper/test and
old theme implementation/test remain physically absent, with explicit existing
owned token/scope/CSS/behavior replacements in their manifest rows. The row-DnD
rename has an existing replacement. No branded production filename is reintroduced
by the four scoped fixes. Saved import graph and foundation/package guards cover
references; no old positive import remains. The 36 stale flags concern other
story/Button moves and do not invalidate these six correctly recorded removed/
renamed entries. Successor: none for physical removal; keep source provenance.

**A-Z-04 — partial, literal all-tracked criterion.** FA-02 already classified 30
reference-bearing files; the new supplemental check identifies 40 files with
additional matches. Every new match was inspected: legal text, historical records,
removed-API mappings, guard prohibitions, intentional Material Design demo
identity, two negative SSR assertions, `scaleMotionDuration` substring false
positives, or four opaque lock integrity strings. No new active retired runtime
requirement was found. LICENSE files are now explicitly covered, correcting the
old extension filter gap. Four tracked `.obsidian` files remain explicitly
unread personal state; generated audit receipts remain evidence rather than
product requirements. Therefore an unqualified claim of **every tracked text**
would still exceed this audit. Required successor: coordinator records a deliberate
personal/audit-record scope disposition or performs the exact residual tracked-file
check without exposing private state, then reconciles this narrow remaining scope.
Do not rerun the completed AST/dependency inventory or erase evidence matches.

**A-Z-05 — partial, reviewable amendments supplied.** The two source identities
remain `owner-confirmed first-party code@source-identity-omitted`
and initial SGUI extraction `21adebd61bedfc6a1ed395fe664ff4be83896821`.
`manifest-amendments.json` progresses parallel-15's exact successor: 32 rows map
to known migrated fixtures, three to Button source/test/index candidates, and the
AppButton story has a separately identified current Button fixture requiring
assertion mapping. All 36 proposed `present:false` amendments preserve original
source fields and include replacement metadata for review. They are not applied
and do not certify assertion parity. The old historical records and baseline
snapshots still contain original names. `reference-rewrite-proposals.json` lists
current host/prose corrections and explicit preserve categories. Required
successors: apply/review the 36 rows, establish AppButton-story assertion mapping,
correct active-current prose, and record the exact historical-reference policy
consistent with original provenance. Do not rewrite Git history or relabel
baseline captures as current. Literal zero-match closure has not been achieved.

**A-Z-06 — partial, attribution-owner action required.** Both copies of LICENSE
and both copies of THIRD_PARTY_NOTICES are byte-equal. Five preserved retired
sections (Emotion react/styled, old component/icons/grid packages) have no current
locked dependency. `notice-review.json` gives each exact notice ID/line, an
explicit preserve decision, and the required extracted-source/asset-to-final-
package review before deletion. It reuses the legal reviewer's fresh locked/
installed/text evidence; generic Adobe/TanStack/Lucide sections mean a parser or
string-containment miss alone cannot prove a missing obligation. LICENSE §7 and
commercial guidance still describe retired packages as current use; notices'
introduction says current direct packages and the Adobe section says proof
dependencies. Concrete factual correction proposals are supplied without changing
commercial terms. Required successors: attribution owner resolves derived/copied
source/assets and legal-text findings, legal owner approves retained/removed
notices and coordinated descriptions, then join approved text to final packed
hashes. Local source absence does not supply legal approval.

## Candidate and consumer evidence

**A-Z-07 — partial.** FA-04 records a fresh library build and docs-native fixture
build, with all 1,778 outputs equal to FA-01 at that time. The package checker
compared actual packed bytes. That substantially progresses old batch133/134's
missing fresh-output successor. It is not the final candidate: four implementations
now differ while API declarations remain unchanged. Required successor after
BUG-0008/9 settle: coordinator freezes source, rebuilds using the existing build
cleanup behavior, records source/output deltas, fresh docs-native host identity
where needed, and refreshes affected package/consumer scopes. No stale Storybook
runtime is to be recreated. No deletion of shared outputs was attempted here.

**A-Z-08 — partial.** FA-04's package receipt executed recursive retired-name
checks on JS/declarations/CSS/maps/assets, public imports/types, export conditions,
CSS side effects, packed byte equality and README/LICENSE/notices preservation.
That is actual fresh technical artifact evidence for its earlier inputs, unlike
old batch134's source-only review. It does not establish notice correctness,
derived/binary asset provenance, or the new implementation bytes. Package audit's
temporary tarball is removed, so its success log and output hashes do not identify
a durable final release archive. Required successor: after legal/source fixes,
retain the exact candidate tarball SHA-256/file manifest and per-file packed
reference classifications, legal-file hashes/approval and frozen dependency
closure. Reuse unchanged FA receipts; do not claim release identity from `dist`.

**A-Z-09 — partial.** Foundation/editor/Next consumer generators explicitly install
packed React 18.3/19.2.3 consumers, exercise core/grid/date/editor exports and reject
retired runtime dependencies. Historical runtime records describe executed matrix
passes at named earlier heads; FA-04 supplies current-at-capture package imports
and consumer typechecking. Neither script presence nor that package check is a
new clean install or supported consumer matrix pass after the four fixes.
Required successor: coordinator executes only affected clean packed consumers
against the frozen candidate, preserving package hash, React/runtime/bundler
versions, installed dependency graph and result logs. Full production supported-
environment gates remain required independently of targeted development work.

**A-Z-10 — partial.** FA-01 gives all concrete entry names including icon aliases/
compound paths; parallel-01 gives 469 contracts; FA-02 inventories maintained
source; parallel-15 preserves helper/preset/model/editor continuity and 201
extraction rows. These advance old final-symbol-join prerequisites without
repeating M inventory runs. The 36 unapplied metadata amendments, unmapped original
Button story assertions and nonexhaustive historical inherited-API closure prevent
an all-symbol owned-replacement/release-impact verdict. Required successor: join
baseline export identities to the 469-contract snapshot with preserved/additive/
removed/replaced disposition, guide link, actual replacement and release impact
for every symbol; include non-component hooks/helpers/presets/adapters and new
experimental exports, then apply approved metadata amendments. No inference of
behavioral migration from a registered directory alone.

**A-Z-11 — partial, full production prerequisites remain.** FA-01–04 and prior
parallel reports retain package/type/unit/build/removal evidence and support
boundaries; configured CI targets Node 22.12/24, React18/19, Chromium/Firefox/WebKit,
SSR/Flight/Next and docs. It explicitly excludes ordinary `dev` PR CI by approved
policy. No fresh remote run, complete final engine/consumer matrix, reviewed
visual matrix, physical device or spoken AT evidence was obtained. Twenty editor
V leaves remain open. Required successor: exact tested-head/input/output matrix
joins retained unchanged results and changed-scope reruns, plus missing native,
accessibility/visual/SSR/performance/operator results and explicit limits. A
configured job or jsdom result cannot close these gates; no tests were weakened.

## Decisions, public compatibility and release

**A-Z-12 — partial.** The imported-principle mapping and root guidance distinguish
course terminology, host-owned services, tokens/components, grid defaults, modal
focus/layout, translations and owned boundaries. The previous batch134
architecture-validation contradiction is **resolved in current prose**:
`component-architecture.md:84–106` now follows targeted dev validation and preserves
production checks. No successor should repeat that obsolete repair. Current
AGENTS/README/CI use dev as integration, main as human-approved production.
However local reports do not contain the complete human conversation commitment
set; no report can invent missing approval/intent. Historical inventory wording
questions (page navigator boundaries, instructor-card fields and typeface naming)
are explicitly retained in `react-aria-inventory-contract-reconciliation.md`.
Required successor: coordinator joins actual human commitments/owner decisions to
named acceptance IDs and current source evidence, resolves retained intent rows,
and documents approved exceptions without dropping requirements. Historical
statements such as “AppDataGrid still renders MUI X” in the dated early progress
batch remain dated history, not current implementation guidance.

**A-Z-13 — partial, breaking ledger advanced.** Reuse the 469-contract/default-
candidate snapshot and parallel-01's exact old/current mappings. This receipt
identifies its four changed implementations; unchanged captured declarations do
not certify source/output synchronization. Existing concrete breaks include
upstream theme objects/style props/types removed, onClick→onPress and modal
callback changes, grid models/IDs/accessors and selection default, persistence
opt-in and page-size ordering. Parallel-01 correctly distinguishes the existing
Set-valued selection callback from the removed engine model. Release-policy
transcript passes four analyzer/title tests; current HEAD has a `feat!:` title.
That proves the marker is recognized/present, **not** that every breaking change
is correctly mapped to a release range. Required successor: normalize remaining
public defaults/inherited historical contracts; join every intentional break to a
copyable guide and actual commit/squash title/footer; update selection-default and
stale host guidance, then verify fresh affected declarations after coordinator
fixes. `breaking-change-review.json` provides a concrete candidate join to review;
it is not an exhaustive accepted release manifest. No manual version edit.

**A-Z-14 — partial, configuration is not owner setup.** Current license metadata
is `SEE LICENSE IN LICENSE`, publication access is public, root workspace is
private, and no tracked Changesets path was found. Release config targets main
with Conventional Commits and an official tarball; workflow calls full CI before
publish with full checkout history, serialized concurrency, contents/id-token
permissions and npm token/provenance configuration. AI workflow produces draft PRs
with separate validation/evidence. These are configured controls; commercial
license explicitly remains draft for legal review, notices have the discrepancies
above, npm scope/trusted publisher/secrets/effective tag permissions and branch
protections were not freshly verified. Required successor: owner records npm/
GitHub effective settings and legal approval, fixes stale setup guide references
and joins the reviewed workflow to exact future official artifact/run identity.
Do not infer first publication has occurred from public-access configuration.

**A-Z-15 — partial.** FA-01–04 resume ledger and the coordinator's first parallel
reconciliation preserve exact evidence, accepted closures, partial successor work
and 20 editor V leaves. This wave supplies sixteen explicit dispositions and
concrete amendment/review artifacts. Required successor: coordinator merges all
wave reports by original ID, verifies hashes and source deltas, joins dependency/
feature decisions and actual completed PR/head evidence, and keeps every remaining
required obligation open. New calendar features and experimental APIs do not
silently replace unaccepted old requirements. No historical open item was
reclassified as optional for convenience here.

**A-Z-16 — partial, completion prerequisites unmet.** Z-04–15, editor V and broad
production evidence above prevent migration completion. This report supplies no
completion claim, release approval, version/tag/publish action or production
promotion. Required successor: only after all required leaf/operator/legal/owner
results are reconciled, the human approves the release-worthy promotion and the
configured workflow validates/publishes on main. Development acceptance work
continues on dev. “Partial” records the unmet completion gate; it does not imply
publishing is authorized or that the gate can be waived locally.
