# Wave 02-05 — legal governance, architecture and heavy dependencies

Reviewed modified `dev` HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e` on Darwin arm64, v26.5.0. Five named obligations complete, six partial. Completion is limited to each original criterion; no legal approval, release approval, current remote CI, security audit or production acceptance is claimed.

## Scope, reuse and new checks

Read the full 11 original leaves in the current hardening task list, AGENTS, architecture/migration guidance, prior wave-01 evidence and FA-01–04. Reused parallel-12’s icon implementation/license retention and parallel-02’s architectural graph review. The earlier parallel-05 report concerns contracts and remains untouched. The checker ran under the available Node v26.5.0, while repository development targets Node 24. This read-only output is not a Node 24 validation receipt. No previously passed suite was rerun. No staging, commits, server work, dependency installation, build or shared output mutation occurred. Only this owned directory received files.

The new inventory run fills a previously unretained exact-input license evidence gap; it does not repeat FA-02’s source/dependency AST scan. Actual command from repository root:

```sh
node packages/ui/scripts/check-license-inventory.mjs packages/ui > docs/developer/final-acceptance/wave-02-05/license-inventory.json
```

**Actual exit: 1**, meaning evidence findings, as documented by the checker. The caller redirects stdout only into this directory. There was no checker crash or installed-lock mismatch. `license-inventory.json` records manifest, repository lock and installed-lock hashes; the latter two match. Counts differ from FA-02’s 586-name/version workspace graph because this checker inventories 585 locked identities for the library importer with its own reachability classification. It is not evidence that a workspace dependency disappeared.

The new bounded text comparison reads only installed top-level legal files already located by the inventory. It normalizes whitespace before checking whole-text inclusion in aggregate notices; it does not treat a common license name as identical copyright attribution. `license-text-comparison.json` contains file hashes and results. `basic-graph.json` derives ten explicit entry traversals from saved FA-02 imports, with current reached-file hash comparisons rather than a repeat source scan. Type-only references are excluded only when explicitly marked. It is not TypeScript-resolved bundler execution, package-install isolation or a complete public-export audit.

The shared checkout is concurrent. Coordinator BUG-0008/0009 source changes are outside the legal-input and reached-basic-path conclusions. No claim is made that old dist represents the four changed components. All cited inputs have exact hashes in results.json or its companion evidence. A later input change requires scoped reconciliation, not automatic reuse of this report.

## Inventory findings and their interpretation

| Checker finding | Count | Interpretation |
| --- | ---: | --- |
| missing-license-file | 85 | 85 locked identities lack recognized top-level legal files; most are not runtime. A package license string is not a substitute for retained text. |
| missing-notice-reference | 6 | Six current direct names use grouped headings; manually present in Adobe/TanStack/Lucide prose. Not six established missing licenses. |
| missing-package-provenance | 1 | client-only@0.0.1 has no recorded repository metadata; runtime scope. |
| unknown-license | 1 | config-chain@1.1.13 metadata has no recognized license; dev tooling scope, separate from runtime. |
| unmatched-notice-reference | 5 | Five retired MUI/Emotion headings are retained. Removal requires final code/asset provenance review. |
| unparsed-notice-heading | 3 | Three grouped headings are not supported by the parser; legal text remains present. |

Total **101 evidence findings**. Zero license safety or violation conclusions follow automatically. Among 56 runtime-reachable identities, metadata reports 46 MIT, eight Apache-2.0, one ISC and one 0BSD. All 16 manifest runtime dependencies have located license text. The only runtime identity with missing top-level legal-file evidence is client-only@0.0.1 (MIT metadata).

Seven Adobe runtime Apache-2.0 legal texts are fully contained after whitespace normalization: `@internationalized/date@3.12.4`, `@internationalized/number@3.6.8`, `@internationalized/string@3.2.10`, `@react-types/shared@3.36.1`, `react-aria-components@1.21.1`, `react-aria@3.52.1`, `react-stately@3.50.0`. The eighth Apache identity, `@swc/helpers@0.5.23`, has distinct full legal text absent from aggregate notices. This compares installed text with retained notices; it does not establish all copied-code/NOTICE obligations.

Full legal-file texts not entirely included in the aggregate (18): `@floating-ui/core@1.8.0`, `@floating-ui/dom@1.8.0`, `@floating-ui/react-dom@2.1.9`, `@floating-ui/react@0.27.20`, `@floating-ui/utils@0.2.12`, `@preact/signals-core@1.14.4`, `@swc/helpers@0.5.23`, `@types/react@19.3.0`, `aria-hidden@1.2.6`, `clsx@2.1.1`, `csstype@3.2.3`, `isomorphic.js@0.2.5`, `lib0@0.2.119`, `prismjs@1.30.0`, `react-error-boundary@6.1.6`, `tabbable@6.5.0`, `tslib@2.8.1`, `yjs@13.6.33`. Some contain distinct copyright text or BSD-family terms. This is a review queue, not proof that all are bundled/distributed or that keeping licenses in dependency packages is inadequate. Runtime reachability includes upstream type-related dependencies; classify actual distribution before deciding notices.

Both root/package copies of LICENSE and THIRD_PARTY_NOTICES.md are byte-identical. Lucide’s complete ISC plus Feather-derived MIT text is included, as independently established in parallel-12. FA-04 packed equality is retained as dated evidence of packing behavior; it does not settle whether final notices are complete.

## Leaf dispositions

### A-L-01 — partial

Original requirement: Reconcile original `L-01`: Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code. Historical status: open.

New checker receipt covers 585 locked identities for the library importer, including 56 runtime-reachable identities. Eight runtime identities declare Apache-2.0 (seven Adobe packages plus @swc/helpers); 46 runtime identities MIT, Lucide ISC and tslib 0BSD.

All 16 direct runtime dependencies have installed LICENSE text matching the declared family; 55 runtime/peer-reachable legal files inspected by normalized-text inclusion; 18 full texts absent from aggregate notices. Absence from aggregate is an evidence gap, not a distribution violation finding.

client-only@0.0.1 is runtime-reachable, declares MIT, but has no recognized top-level legal file or repository metadata; config-chain unknown-license concerns tooling, not a runtime conclusion.

Concrete source: `packages/ui/package.json`, `pnpm-lock.yaml`, `packages/ui/THIRD_PARTY_NOTICES.md`, `docs/developer/react-aria-license-inventory.md`.

Evidence/check references: `license-inventory.json`, `license-text-comparison.json`, `docs/developer/final-acceptance/fa04-package.txt`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Review runtime client-only provenance/legal text from an owner-verified upstream package/source; retain exact source/license evidence without guessing.
2. Map the 18 unmatched full texts and all relevant transitive bundled/copied code to the final distributed artifact and its required notices; classify development-only records separately.
3. Have designated license reviewer accept final per-version distribution/provenance conclusions; source metadata is insufficient for that decision.

### A-L-02 — partial

Original requirement: Reconcile original `L-02`: Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on. Historical status: open.

All seven Adobe runtime Apache license file texts normalize to text retained in notices; @swc/helpers has distinct full text absent from aggregate notices. Root/package LICENSE and notices are byte-identical. FA-04 package audit preserved packed legal bytes at its recorded outputs.

No top-level NOTICE file occurs in the seven recorded Adobe metadata entries. This checker does not establish absence of embedded notices or copied/modified code. Existing architecture declares dependency usage without copied upstream implementation/examples.

Concrete source: `LICENSE`, `THIRD_PARTY_NOTICES.md`, `packages/ui/LICENSE`, `packages/ui/THIRD_PARTY_NOTICES.md`, `docs/developer/react-aria-architecture.md`.

Evidence/check references: `license-inventory.json`, `license-text-comparison.json`, `docs/developer/final-acceptance/fa04-package.txt`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Retain a provenance disposition for copied/adapted code and embedded NOTICE obligations across final shipped code/maps/assets, including whether any modification notices are required.
2. Reconfirm final candidate tarball byte retention after current coordinator source changes and owner-approved notice changes; do not delete preserved attribution based on package removal alone.

### A-L-03 — complete

Original requirement: Reconcile original `L-03`: Preserve SGUI's commercial-license requirement and distinguish SGUI-owned work from upstream open-source work; do not impose exclusive SGUI terms on independently licensed dependencies. Historical status: open.

LICENSE sections 1,2,3,7 explicitly require written commercial agreement for SGUI originals and exclude separately licensed third-party materials. Section 7 explicitly preserves independently granted third-party rights.

README and commercial guidance repeat the agreement requirement; package license points to LICENSE and manifest files include both legal files. Root/package license texts match. Completion means preservation/distinction, not counsel approval, enforceability or approved commercial terms.

Concrete source: `LICENSE`, `packages/ui/LICENSE`, `README.md`, `docs/commercial-licensing.md`, `packages/ui/package.json`.

Evidence/check references: `docs/developer/final-acceptance/fa04-package.txt`, `license-inventory.json`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

No remaining deliverable for this narrowly named obligation. Separate legal, runtime, artifact and release gates remain open.

### A-L-04 — partial

Original requirement: Reconcile original `L-04`: Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed. Historical status: open.

Retained notices include retired Emotion/MUI headings, current Adobe grouped text, TanStack and Lucide; the 6 missing-notice-reference parser findings refer to names present under 3 grouped headings, not 6 conclusively absent attributions.

Five unmatched retired headings are not an instruction to remove them. License/commercial guidance still describes MUI/Emotion as current examples and notices describe Adobe/TanStack as proofs despite production ownership.

No final shipped-asset-driven notice refresh has occurred; the report supplies exact per-version text evidence and stale-reference classification for that refresh.

Concrete source: `packages/ui/package.json`, `pnpm-lock.yaml`, `packages/ui/THIRD_PARTY_NOTICES.md`, `docs/developer/react-aria-license-inventory.md`, `LICENSE`, `docs/commercial-licensing.md`.

Evidence/check references: `license-inventory.json`, `license-text-comparison.json`, `docs/developer/final-acceptance/fa04-package.txt`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Refresh both equal notice copies against owner-reviewed final artifact and provenance inventory; decide retained historical attribution individually, then keep pack equality.
2. Update stale current-dependency/proof wording in LICENSE section 7 and commercial guidance only through authorized owner/legal review; do not rewrite commercial rights as inventory automation.
3. Resolve grouped-heading parsing explicitly or teach the inventory parser about reviewed group mappings with fixtures; do not falsify one-heading-per-package findings as license omissions.

### A-L-05 — complete

Original requirement: Reconcile original `L-05`: Avoid replacing icon imports with copied assets that retain the retired dependency or its licensing obligations unnoticed. Historical status: open.

Reused parallel-12 complete 95/95 original symbol mapping plus 96 current Lucide wrappers and zero retired runtime/import findings, rather than rescan the icon catalog. Wrappers import named Lucide components; they do not hide copied retired paths.

Lucide 1.52.0 installed full ISC/Feather MIT license text is retained in aggregate notices; wrapper ownership is separately described. Existing old MUI notices remain preserved. Completion addresses avoiding an unnoticed retired icon dependency/copy; wider artifact provenance/legal signoff stays in L-01/02/04.

Concrete source: `docs/developer/react-aria-icons.md`, `packages/ui/src/experimental/icons/icon-map.json`, `packages/ui/src/experimental/icons/createVector.tsx`, `packages/ui/src/experimental/icons/AddIcon.tsx`, `packages/ui/THIRD_PARTY_NOTICES.md`.

Evidence/check references: `docs/developer/final-acceptance/parallel-12/report.md`, `docs/developer/final-acceptance/2026-10-16-source-inventory.json`, `license-text-comparison.json`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

No remaining deliverable for this narrowly named obligation. Separate legal, runtime, artifact and release gates remain open.

### A-L-06 — complete

Original requirement: Reconcile original `L-06`: Record grid Community/Enterprise and redistribution implications before selecting an engine; no paid feature dependency is silently assumed. Historical status: open.

Grid decision explicitly selects TanStack v8 row processing plus React Aria, owns columns/state/callbacks, and records MIT terms for both TanStack packages with no enterprise tier in this integration. Current resolved @tanstack/react-table and @tanstack/table-core 8.21.3 both have installed MIT legal text retained in notices.

No MUI grid or commercial enterprise runtime dependency is in the saved source/dependency inventory or current library manifest. SGUI originals remain commercially licensed. This closes the recorded selection/redistribution boundary, not legal approval of a release or all grid behavior.

Concrete source: `docs/developer/react-aria-grid-decision.md`, `packages/ui/package.json`, `packages/ui/THIRD_PARTY_NOTICES.md`.

Evidence/check references: `license-inventory.json`, `license-text-comparison.json`, `docs/developer/final-acceptance/2026-10-16-source-inventory.json`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

No remaining deliverable for this narrowly named obligation. Separate legal, runtime, artifact and release gates remain open.

### A-L-07 — complete

Original requirement: Reconcile original `L-07`: Keep the commercial agreement's legal identity, permitted distribution, support, and other unresolved business terms on the existing pre-publication legal-review checklist. Historical status: open.

Existing commercial guidance explicitly retains legal identity, developer/contractor scope, application/end-user redistribution, price/payment, duration/renewal, support, termination/survival, governing law and dispute resolution for the written agreement and counsel review. LICENSE defers these to the agreement instead of inventing terms.

A concrete pending-review register is retained in report.md and governance-decisions.json, preserving all named unresolved terms. Complete only as tracking obligation; no decision, agreement, counsel review, customer use or publication approval has been supplied.

Concrete source: `docs/commercial-licensing.md`, `LICENSE`, `docs/developer/react-aria-hardening-tasks.md`.

Evidence/check references: `governance-decisions.json`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

No remaining deliverable for this narrowly named obligation. Separate legal, runtime, artifact and release gates remain open.

### A-L-08 — partial

Original requirement: Reconcile original `L-08`: Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms. Historical status: open.

Historical missing capability is now implemented as a local read-only checker with deterministic hashes/manifest/lock/store/legal-file/asset evidence and bounded fixture tests. Newly executed checker returns exit 1 with 101 findings; no terms rewritten.

The documented invocation still points at root scripts paths after workspace move; executable lives under packages/ui/scripts and root manifest has no forwarded license script. The actual working command is retained in report.

Named update ownership remains explicitly a proposal; no appointed maintainer/legal reviewer or accepted trigger workflow is evidenced.

Concrete source: `packages/ui/scripts/check-license-inventory.mjs`, `packages/ui/scripts/check-license-inventory.test.mjs`, `docs/developer/react-aria-license-inventory.md`.

Evidence/check references: `license-inventory.json`, `docs/developer/parallel-batch-98/acceptance-evidence.md`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Owner accepts and records named dependency/license inventory owner, backup and legal reviewer with date/reference; accept exact update triggers listed in governance-decisions.json.
2. Correct checker guide commands for packages/ui and consider a forwarded command/CI trigger only under an authorized source change; preserve non-mutating behavior.
3. Retain before/after inventory per trigger and classify actual findings; no automatic license allowlist or commercial-term rewrite.

### A-L-09 — partial

Original requirement: Reconcile original `L-09`: Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks. Historical status: open.

Concrete documented policy now covers support/EOL triggers, security triage, graph-aware upgrade and rollback, and affected behavior/type/token/consumer/browser validation. This progresses historical absence of security/EOL procedure.

Six explicit operational decision groups still await humans: owner/backup, cadence/sources, confidential intake, urgency/emergency authority, supported-release/exception window, disclosure/risk acceptance. No current advisory/security status checked.

Policy still instructs Storybook builds/stories, uses retired codex/dev and treats root manifest as authoritative dependency surface. Those operational instructions conflict with current dev and packages/ui/apps/docs/native-fixtures layout.

Concrete source: `docs/developer/react-aria-dependency-upgrades.md`, `docs/developer/react-aria-development-validation.md`, `docs/developer/react-aria-runtime-ci.md`, `packages/ui/package.json`.

Evidence/check references: `governance-decisions.json`, `docs/developer/parallel-batch-98/acceptance-evidence.md`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Owner fills governance-decisions.json operational fields and retains approval evidence; do not infer a confidential channel or SLA.
2. Reconcile guide paths/commands against packages/ui and docs-owned native fixture host, replace retired branch/Storybook instructions, and retain targeted-dev versus full-production gates.
3. At the next authorized upgrade, retain an exact-head review receipt with current/target graph, notice changes, selected meaningful regressions, failed gates and rollback/persisted-data analysis.

### A-A-01 — complete

Original requirement: Reconcile original `A-01`: Write an architecture decision record for React Aria, compiled CSS, the owned public API, specialist engines, and the reasons alternatives were not selected. Historical status: checked.

Architecture decision explicitly records accepted React Aria internal interaction/owned contracts/compiled CSS Modules direction, layer direction and host boundaries. Specialist grid decision records TanStack versus React Aria-alone tradeoffs; editor retains Lexical.

Base UI/Ark/Radix alternatives are named and not selected because of human-approved React Aria direction; no invented performance superiority. Existing single-package/granular-export choice and separate later package question are explicit. This is ADR completion, not an all-module conformance or benchmark claim.

Concrete source: `docs/developer/react-aria-architecture.md`, `docs/developer/react-aria-grid-decision.md`, `docs/developer/component-architecture.md`, `README.md`.

Evidence/check references: `docs/developer/final-acceptance/parallel-02/report.md`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

No remaining deliverable for this narrowly named obligation. Separate legal, runtime, artifact and release gates remain open.

### A-A-18 — partial

Original requirement: Reconcile original `A-18`: Keep heavyweight modules out of basic-control dependency paths; decide which require separate subpaths versus separate packages. Historical status: open.

New bounded derivation reuses FA-02 recorded import references for 10 basic entry roots. Each reaches zero Lexical/TanStack imports, zero unresolved relative references and zero changed reached input hashes. This is source-graph evidence with explicit typeOnly exclusion, not fresh bundler execution.

Existing packed script tests representative granular entry isolation; root/components barrels intentionally include editor exports. Direct Lexical dependencies remain installed by basic consumers. Documentation explicitly leaves editor-package/fully separated core-grid-editor design open.

No fresh packed fixture was run, and current four coordinator components must not be assumed byte-identical to old dist.

Concrete source: `docs/developer/react-aria-architecture.md`, `docs/developer/react-aria-package-acceptance.md`, `packages/ui/package.json`, `packages/ui/scripts/test-foundation-consumer.mjs`.

Evidence/check references: `basic-graph.json`, `docs/developer/final-acceptance/parallel-02/graph-evidence.json`, `docs/developer/react-aria-package-acceptance.md`. Existing fixture/test source is inspected evidence, not a newly executed passing test.

Remaining exact deliverables:

1. Resolve E-08/R-03/R-04 installation/package design with explicit owner-reviewed keep-one-package or core/grid/editor package decision and migration implications.
2. Complete export coverage and role-direction enforcement for source paths, coordinating AA03-S3 from parallel-02; representative 10-root traversal is not an all-controls guard.
3. Reuse valid old granular bundle receipts where attributable, otherwise run only an authorized fresh packed isolation check after shared outputs stabilize; do not rerun broad consumers under this report scope.

## Pending owner/counsel review register

This preserves the existing pre-publication commercial review scope from docs/commercial-licensing.md and LICENSE. **Every field remains pending**; no person, deadline, channel, agreement right or approval is invented. A-L-07 closes tracking only. The editable machine-readable receipt is `governance-decisions.json`.

### Commercial review

| Decision required | Approver / date / reference |
| --- | --- |
| Actual copyright owner/legal licensor and licensee; agreement acceptance/enforceability | Pending |
| Authorized developers/contractors and permitted applications/deployments | Pending |
| Standalone library/source restrictions, application embedding, redistribution and end-user execution | Pending |
| Price/payment, duration, renewal and licensed limits | Pending |
| Support obligations and commercial response commitments | Pending |
| Termination, retention and surviving rights for existing deployments | Pending |
| Governing law, dispute resolution and notice/contact channel | Pending |

### Operational ownership

| Decision required | Approver / date / reference |
| --- | --- |
| Named dependency review owner and backup; upgrade/retention approver | Pending |
| Named license/provenance reviewer and accepted update trigger workflow | Pending |
| Routine review cadence and advisory/support-status sources | Pending |
| Confirmed confidential security intake channel, accountable recipient and fallback | Pending |
| Triage/remediation targets, escalation and emergency authority | Pending |
| Supported-release/backport window, EOL exception expiry and communication ownership | Pending |
| Disclosure authority, remaining-risk acceptance and approval reference | Pending |

Accepted inventory update triggers must cover Manifest/lock/resolved metadata changes; Dependency upgrades or install policy changes; Copied/generated icons/fonts/media/distributed assets; Bundling or distribution-root changes; Final release-artifact review. Proposed maintainer/legal roles in the current guide remain proposals until owner acceptance is recorded. No confidential security address or service level is inferred.

## Actionable documentation corrections

The actual inventory invocation above works. The current inventory guide’s `node scripts/check-license-inventory.mjs` from repository root does not match the workspace layout; root scripts are absent and no root forwarding script exists. Canonical alternatives for a later authorized documentation edit are the explicit repository-root path above, or running `node scripts/check-license-inventory.mjs` from packages/ui.

The upgrade guide still names Storybook/stories/static Storybook, `codex/dev`, and root manifest dependency declarations. Its operational successor must use `dev`, packages/ui/package.json for library dependencies and apps/docs examples/private native fixtures, preserving the existing targeted development policy and full production gates. These are observed documentation drift, not grounds to weaken gates. LICENSE section 7 and commercial guidance have historical MUI/Emotion examples; change legal wording only with authorized review, preserving third-party rights and necessary attribution.

## Validation and handoff

Validated results.json parses, contains exactly the 11 assigned leaf IDs and includes each original requirement/status/findings/source/evidence/checks/limits/successor. Every companion evidence file is present. No new test suite ran; existing checker fixture tests were inspected only. Reports and observed file content are local evidence, not current upstream advisory status or legal advice. Coordinator can reconcile five narrow closures and six partial obligations; the 20 editor V leaves and future production approval are unaffected.
