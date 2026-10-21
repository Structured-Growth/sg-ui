# Wave 02 — documentation acceptance (A-W-01–20)

Reviewed modified `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, 2026-10-16. Only `docs/developer/final-acceptance/wave-02-13/` is written. Recommendations for coordinator reconciliation: **11 complete, nine partial, zero blocked**. Documentation-contract closure does not close native, device, AT, legal, owner-configuration or release obligations. The 20 editor V leaves remain independent.

## Reviewable work delivered

- `evidence.json`: 44 exact scoped input hashes, FA-02 comparisons, all 119 missing inline local-link targets with source line, 16 stale-wording candidates and fixture target checks. 43 input hashes equal FA-02. LICENSE was not in FA-02 source hashes; its independently captured hash is **not a changed-file finding**.
- `proposed-doc-corrections.patch` plus JSON base/result hashes: concrete unapplied corrections to nine documents. They replace active removed build commands/artifact names, retired integration branch, stale colocated-story instructions, baseline-test guidance and direct-script cwd; fix the moved release-config link. These edits are reviewable here but do not count as applied fixes. Historical CI artifact tables and old host receipts are intentionally preserved.
- `story-disposition-supplement.json`: derives all 33 original stories from accepted parallel-15 evidence, retains 32 exact fixture mappings, identifies the remaining AppButton mapping with actual current Button fixture/example candidates, and enumerates current catalog coverage for the requested subject areas. Current catalog has 94 routes; earlier 90-route receipts retain their historical counts. All 116 fixture-manifest targets currently exist.

The fresh link audit read 439 Markdown documents and checked 3,721 inline local path links outside code fences (excluding final-acceptance report trees). It found 119 missing targets. Many are retired story/preview links in historical records, requiring provenance classification rather than mass replacement. The one missing link in the explicitly hashed active guide set is docs/github-setup.md:138 → ../release.config.mjs; actual destination is packages/ui/release.config.mjs. This parser does not certify anchors, reference-style/HTML links, inline code paths or external URLs. All findings, including historical ones, remain visible.

## Evidence reuse and host/input limits

Read every complete original A-W-01–20 leaf from `react-aria-hardening-tasks.md`, current AGENTS and final-acceptance ledger. Reused FA-01 declaration/export/package inventory, FA-02 source/guard inventory, FA-04 preserved original failing command plus affected calendar correction receipts, and parallel-01/03/06/12/14/15 reports. These are dated working-tree/source/DOM/package evidence, not new executions. Passing suites were not repeated. Previous parallel-13 adapter report establishes narrow ownership limits only and does not substitute for documentation coverage.

Coordinator concurrent BUG-0008 (PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker) and BUG-0009 (TextArea) changes may invalidate current implementation/output parity. This review deliberately makes no claim that existing dist or generated API metadata reflects those changes. Public source snippets must be checked against a frozen rebuilt package in the later authorized window. The historical Storybook retirement receipt records an initial 1,521-case run plus bounded corrections, not one final all-green matrix; it is reused only with that distinction. No raw missing artifact, fresh CI success, legal approval or owner appointment is invented.

Actual execution: `python3 .../audit.py`, `python3 .../prepare-corrections.py`, scoped document/source/manifest/workflow reads and read-only Git head lookup. Report generation/verification writes only this directory. No install, build, unit/UI/native/browser/consumer suites, server operations, other conversations, Git mutations or release actions. First probes of nonexistent legacy guessed file paths were corrected using repository file enumeration; they are not failures of production components.

## Per-leaf reconciliation

### A-W-01 — complete

Original requirement: Rewrite active `AGENTS.md` for the new foundation as migration lands; obsolete direct imports, `sx`, augmentation, retired links and grid assumptions must not guide future AI work.

Active AGENTS directs dev integration, owned APIs/native class/style/refs, compiled component aliases, no MUI/Emotion/sx/upstream public types, host adapters, TanStack row processing and deferred true pinning. Top-level workspace interpretation resolves older src paths. Retired names survive as explicit prohibitions/history, not positive import instructions. Storybook retirement and current example ownership are explicit.

Sources: `AGENTS.md:1`; `AGENTS.md:17`; `AGENTS.md:175`; `AGENTS.md:235`; `AGENTS.md:289`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/fa02-foundations.txt`; `docs/developer/final-acceptance/parallel-03/report.md`.

Checks performed: Read active guidance against full requirement; inspected guarded module/adapter/import policy and current workspace paths.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-02 — complete

Original requirement: Retain valid host application principles: shared components first, props/variants before custom styles, tokenized typography, neutral split actions, consistent grid alignment/filtering, and stories with behavior changes.

All named valid principles remain: component reuse, variants before native style, owned typography tokens, neutral outlined split groups, grid alignment/filter rules and behavior example updates. Stories are deliberately replaced by ordinary docs examples/native fixtures under the approved host migration. This closes retained guidance, not every implementation or test matrix.

Sources: `AGENTS.md:280`; `AGENTS.md:304`; `AGENTS.md:343`; `AGENTS.md:370`; `AGENTS.md:407`.

Tests / retained evidence (not rerun): `docs/agent-guidance-migration.md`; `docs/developer/docs-fixture-migration.md`.

Checks performed: Matched each named principle to AGENTS section and approved replacement-host policy.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-03 — complete

Original requirement: Adapt modal guidance: simple reusable create/edit examples, no one-step numbering, sticky tab header with independently scrolling content, appropriate size, focus and host-owned persistence.

Guidance explicitly prescribes AppModal simple host-owned create/edit flows, two-or-more step labels, sticky AppPageTabs/independent panel scroll, size by complexity and visible initial/fallback focus under enlarged text. Source suppresses steps.total < 2. Contract documents carry host persistence and focus ownership. Native focus/reflow receipts remain their recorded scopes; this is guidance closure.

Sources: `AGENTS.md:390`; `docs/developer/react-aria-modal-shells.md`; `packages/ui/src/components/AppModal/AppModal.tsx:48`; `apps/docs/examples/DialogPlayground.tsx`.

Tests / retained evidence (not rerun): `packages/ui/src/components/AppModal/AppModal.test.tsx`; `apps/docs/native-fixtures/scenarios/components/AppModal/AppModal.fixture.tsx`; `docs/developer/react-aria-browser-acceptance.md`.

Checks performed: Read modal guidance and step guard; located ordinary docs and preserved tabbed fixtures; reused prior browser receipts without rerunning.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-04 — complete

Original requirement: Retain course naming for new APIs, compatibility rules, host integration boundaries, translation requirements, doc organization, licensing and semantic-release rules.

Course naming for new APIs, preserved Class/App compatibility with explicit authorized Button removal, host data/auth/routing boundaries, defaultMessage/ICU/locale policy, developer/troubleshooting organization, commercial notices and Conventional Commit/semantic-release rules remain. Only approved release promotion reaches main; documentation does not grant legal usage or publication permission.

Sources: `AGENTS.md:280`; `AGENTS.md:425`; `AGENTS.md:445`; `AGENTS.md:468`; `AGENTS.md:480`; `packages/ui/release.config.mjs`.

Tests / retained evidence (not rerun): `docs/agent-guidance-migration.md`; `docs/migration.md`; `docs/developer/final-acceptance/fa04-release.txt`; `docs/developer/final-acceptance/parallel-06/report.md`.

Checks performed: Read retained guidance, release config and prior exact naming reconciliation; no release command executed.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-05 — complete

Original requirement: Replace blanket compact-menu advice with explicit density defaults and compatibility policy; preserve usability/accessibility at both densities.

Generic Menu inherits scope density; general scopes default comfortable; catalog wrappers explicitly choose compact for compatibility. Guidance requires both densities/enlarged text and independent interactionMode touch sizing. No blanket compact default remains in active AGENTS. Usability across the whole catalog is not inferred from documentation.

Sources: `AGENTS.md:319`; `docs/developer/component-architecture.md:51`; `docs/developer/react-aria-primitives.md`; `docs/developer/react-aria-theme.md`.

Tests / retained evidence (not rerun): `packages/ui/src/experimental/Menu/Menu.tsx`; `packages/ui/src/foundation/ThemeScope.tsx`; `docs/developer/final-acceptance/parallel-14/report.md`.

Checks performed: Compared stated defaults and Menu portal density inheritance; read touch/focus guidance.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-06 — partial

Original requirement: Update the source-guidance mapping to show each retained/adapted/omitted rule and why app database/API/login policies remain outside SGUI.

Section mapping covers retained/adapted/omitted source principles and explicitly excludes seeds/database/Prisma/API/login policies. Two forward-looking rows still require stories/colocated stories despite their removal. Prepared exact text replacements preserve historical story evidence and direct new work to docs examples/native fixtures.

Sources: `docs/agent-guidance-migration.md:15`; `AGENTS.md:407`.

Tests / retained evidence (not rerun): `proposed-doc-corrections.patch`; `proposed-doc-corrections.json`.

Checks performed: Reviewed every mapping row; isolated stale rows with exact line/hash; prepared unapplied corrections.

Required successor deliverables: W06-GUIDANCE: apply/review the two testing/component mapping replacements and production example-theme wording from proposed-doc-corrections.patch; retain original source repository/commit and omitted-policy rationale; run local link verification.

### A-W-07 — partial

Original requirement: Create one canonical component recipe: owned props, native attributes/refs, React Aria mapping, tokens/CSS, stories, behavior tests, public export, and acceptance criteria.

A single linked canonical recipe already covers owned props/refs/native semantics, private React Aria mapping, generated CSS tokens, translations, exports and acceptance. Step 7 still tells agents to colocate stories. Step 8 lacks the current baseline 1–3 smoke constraint. A concrete replacement for both is prepared, including independent Example panels, meaningful playgrounds, public source and docs/native fixture ownership.

Sources: `docs/developer/react-aria-component-recipe.md`; `README.md`; `docs/developer/component-architecture.md`.

Tests / retained evidence (not rerun): `proposed-doc-corrections.patch`.

Checks performed: Compared all nine recipe steps to current AGENTS functionality-first/host/example rules; prepared exact edits.

Required successor deliverables: W07-RECIPE: apply/review the recipe hunk, verify links to current Example/playground requirements and remove any positive new-story instruction; preserve bounded baseline versus later regression/hardening distinction.

### A-W-08 — complete

Original requirement: Add import/token/style rules and executable checks that prevent AI-created parallel styling systems or leakage of upstream public types.

Import/state interaction registries, transitive migrated-module traversal, CSS component-layer/token checks and emitted public declaration rejection implement the documented rules. Checks reject upstream props/style engines and parallel foundation leakage. Reused guard/source audit evidence establishes the named executable-check architecture; concurrent component fixes are not silently certified by old guard execution.

Sources: `AGENTS.md:215`; `packages/ui/scripts/check-foundations.mjs`; `packages/ui/scripts/check-component-css.mjs`; `packages/ui/scripts/check-package.mjs`.

Tests / retained evidence (not rerun): `packages/ui/scripts/react-stately-boundaries.test.mjs`; `packages/ui/scripts/check-component-css.test.mjs`; `docs/developer/final-acceptance/fa02-foundations.txt`; `docs/developer/final-acceptance/fa04-original-check.txt`; `docs/developer/final-acceptance/parallel-03/report.md`.

Checks performed: Read actual guard conditions/manifest wiring; matched unchanged guard hashes to FA-02; reused accepted guard receipts instead of running full guards.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-09 — complete

Original requirement: Update `.storybook/preview.tsx` with production tokens/styles and theme/density/locale/direction controls; stories must not maintain a separate visual system.

Approved replacement for .storybook/preview.tsx is implemented: private fixture host imports production styles/tokens/Provider/translation adapter and accepts theme/density/locale/direction globals. Public examples have separate fixed website chrome and owned preview scopes, local density and shared demo identity/appearance/contrast. No Storybook recreation or new global density toggle is required. Existing replacement-host receipt is retained, not upgraded into current native conformance.

Sources: `apps/docs/native-fixtures/host.tsx:1`; `apps/docs/native-fixtures/README.md`; `apps/docs/components/Example.tsx`; `apps/docs/components/DemoSettings.tsx`; `docs/developer/react-aria-theme.md:38`.

Tests / retained evidence (not rerun): `docs/developer/docs-website.md:519`; `docs/developer/final-acceptance/fa04-fixtures.txt`.

Checks performed: Inspected host globals parsing/Provider props, public Example scope and explicit retirement receipt.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-10 — partial

Original requirement: Retain the 33 existing story files or document deliberate replacements; add missing catalog coverage for primitives, adapters, calendars and grid helpers.

Progressed original-story successor: supplement lists all 33 original extraction stories, 32 exact retained fixture mappings and the unmapped AppButton story with concrete current Button fixture/public-example/contract candidates. All 116 migration-manifest fixture targets exist. Current catalog has 94 routes and named adapter/calendar/primitive/grid-helper pages (listed in supplement); historical 90-route counts are not current coverage thresholds. File/path coverage does not prove full original assertion parity or every helper public API example.

Sources: `apps/docs/native-fixtures/migration-manifest.json`; `apps/docs/native-fixtures/registry.json`; `apps/docs/content/catalog.json`; `docs/developer/docs-fixture-migration.md`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/parallel-15/manifest-audit.json`; `story-disposition-supplement.json`; `evidence.json`.

Checks performed: Reused prior 201-row extraction audit; derived original 33-story table and proposed Button replacement; checked 116 target paths; inventoried requested catalog areas without regenerating metadata.

Required successor deliverables: W10-PARITY: formally map original AppButton scenario exports/assertions to Button fixture and ButtonDocumentation, preserving removed AppButton compatibility policy; verify all original assertion dispositions, and map any public helper export lacking a customer example. Run only catalog/snippet checks for affected examples once fresh built declarations are available.

### A-W-11 — complete

Original requirement: Update README installation to require only actual final peers and CSS imports; provide copyable root/subpath examples with host providers where needed.

README names React/React DOM as the only peers, exact supported range and CSS once plus owned Provider scope. Root and granular Button/theme imports are copyable and declared package routes; Node minimum, no extra styling peers, public CSS and host adapters are explicit. This leaf is installation-documentation closure, not publication availability or fresh packed-consumer execution.

Sources: `README.md:28`; `packages/ui/package.json`; `docs/developer/react-aria-adoption-checklist.md`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/fa01-package.txt`; `docs/developer/final-acceptance/parallel-06/report.md`.

Checks performed: Compared README imports/peer statements to current manifest and retained export inventory; existing package audit retained.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-12 — complete

Original requirement: Document tokens/themes, CSS override layers, parts/slots, density, icons, form semantics, locale/direction, date contracts, and accessibility responsibilities.

Documentation covers generated token/identity tiers, sgui.tokens/sgui.components and unlayered overrides, declared native parts/slots, independent density/interaction sizing, meaningful/decorative SVG icons, native names/form/reset/controlled state, locale/direction Provider bridge and civil/date/time/explicit timezone contracts. Host content/labels and device/AT responsibilities are explicit. Known behavioral acceptance gaps remain, including concurrent calendar/TextArea fixes; this closes availability of the named guidance subjects.

Sources: `docs/developer/react-aria-theme.md`; `docs/developer/theme-token-pipeline.md`; `docs/developer/react-aria-primitives.md`; `docs/developer/react-aria-icons.md`; `docs/developer/react-aria-calendar-contracts.md`; `docs/developer/component-architecture.md`; `docs/developer/react-aria-adoption-checklist.md`.

Tests / retained evidence (not rerun): `README.md:83`; `apps/docs/content/component-usage`; `docs/developer/final-acceptance/parallel-12/report.md`; `docs/developer/final-acceptance/parallel-14/report.md`.

Checks performed: Read canonical theme/primitives/adoption guidance and scoped topic sections; reused existing icon/i18n reports rather than rescanning implementations.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-13 — partial

Original requirement: Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults.

The published-in-repository migration table covers all named categories and links component contracts, including intentional AppButton removal and preserved Class names. Existing A-B-05 successor remains: selection mapping conflates legacy engine include/exclude objects with already-owned selection.selectedRowIds Set callers, and omitted old selection versus current selection=true needs an explicit before/after preservation recipe. This is a documented breaking default, not a newly found runtime bug.

Sources: `docs/migration.md:78`; `docs/developer/react-aria-primitives.md`; `docs/developer/react-aria-button.md:57`; `docs/developer/react-aria-catalog-grid.md`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/parallel-01/report.md`; `docs/developer/final-acceptance/parallel-06/report.md`.

Checks performed: Read migration table and linked Button/grid mappings; reused prior captured historical API/default evidence rather than repeating signatures scan.

Required successor deliverables: W13-SELECTION: add an explicit old engine object → owned ID set mapping distinct from unchanged Set callers; document omitted-selection default change and selection=false preservation. Finish public-symbol defaults/breaking mappings from parallel-01 snapshot before asserting exhaustive consumer migration; do not mark compatibility aliases deprecated without policy.

### A-W-14 — complete

Original requirement: Provide representative Vite and Next.js host examples without importing framework APIs into the library; document SSR/client and CSS loading boundaries.

Representative copyable Vite and Next App Router host examples exist: CSS once at application entry/root layout, client-owned providers/actions, server presentation children and host next/navigation adapter. Framework imports stay in consumer examples/scripts, not the library runtime. Actual packed/hydration receipts remain tied to their recorded heads; current concurrent implementations are not represented as rebuilt or retested.

Sources: `docs/developer/react-aria-adoption-checklist.md:52`; `docs/developer/react-aria-adoption-checklist.md:88`; `docs/developer/react-aria-server-components.md`; `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-next-consumer.mjs`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/fa01-package.txt`; `docs/developer/react-aria-browser-acceptance.md`.

Checks performed: Read both full host snippets and source/client ownership explanation; compared manifest peers/runtime ownership with prior source inventory.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-15 — complete

Original requirement: Provide a read-only host application adoption checklist; modifying that application remains a separate implementation task.

Checklist explicitly remains read-only planning, with separate authorized host rollout/source deletion. It includes license/version, public imports/props, CSS/scopes, routing/accounts/translations, controlled/persisted grid state, upload/save, forms/dates, accessibility/device parity and retained originals. No application checkout was accessed or changed.

Sources: `docs/developer/react-aria-adoption-checklist.md:1`; `docs/migration.md:119`.

Tests / retained evidence (not rerun): `docs/agent-guidance-migration.md`.

Checks performed: Read entire checklist and its authorization boundaries; checked local linked destinations in path audit.

No remaining deliverable for this named documentation/contract leaf. Broader implementation, host and acceptance gates remain separate.

### A-W-16 — partial

Original requirement: Update `docs/migration.md` and the extraction manifest to preserve useful provenance and account for moves/deletions; do not misrepresent the original extraction as the final architecture.

Source repository/commit/root and extraction-versus-owned-architecture distinction are preserved. The prior precise audit identifies 36 stale declared-present rows: 32 mapped story moves, three Button source/test/index renames and unmapped AppButton story. New supplement narrows the last story to concrete replacement candidates; docs/migration still says presence flags were reconciled, which overstates current metadata. No missing implementation was demonstrated.

Sources: `docs/migration.md:1`; `docs/extraction-manifest.json`; `apps/docs/native-fixtures/migration-manifest.json`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/parallel-15/report.md`; `docs/developer/final-acceptance/parallel-15/manifest-audit.json`; `story-disposition-supplement.json`.

Checks performed: Reused original manifest audit and checked current manifest hash unchanged; produced explicit story replacement supplement.

Required successor deliverables: W16-MANIFEST: update current destination/presence/migration fields for the 36 prior audited rows while retaining original source paths; resolve AppButton assertion mapping using supplement; adjust docs/migration reconciliation claim and validate every replacement path.

### A-W-17 — partial

Original requirement: Update component architecture, GitHub setup, commercial licensing, package fixtures, issue/PR templates, and troubleshooting for final behavior.

Substantive documents/templates exist, but active setup/troubleshooting/runtime guides still prescribe removed build-storybook/artifact names; architecture still names retired codex/dev. Setup links root release config which moved to packages/ui; direct diagnostic/license scripts need packages/ui cwd. Concrete unapplied corrections cover nine docs. Templates still label evidence as stories; commercial text is draft for owner/counsel and preserved historical notices do not imply active dependencies.

Sources: `docs/developer/component-architecture.md:92`; `docs/github-setup.md:31`; `docs/commercial-licensing.md`; `docs/troubleshooting/validation.md:11`; `.github/ISSUE_TEMPLATE/ui-change.yml`; `.github/pull_request_template.md`.

Tests / retained evidence (not rerun): `proposed-doc-corrections.patch`; `proposed-doc-corrections.json`; `.github/workflows/ci.yml`; `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-next-consumer.mjs`.

Checks performed: Compared active commands/artifact names/paths to manifests and workflow YAML; prepared corrections without altering shared files or legal terms.

Required successor deliverables: W17-GUIDANCE: review/apply supplied patch at matching base hashes; update issue/PR evidence wording to docs examples/native fixtures; clarify commercial guide current dependency attribution versus intentionally retained history without deleting notices. Owner separately confirms repository settings/npm publishing identity and counsel separately approves commercial terms; local docs cannot prove either.

### A-W-18 — partial

Original requirement: Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria.

Guides identify deferred pinning/spreadsheet/scheduling/device/AT/rich-content gates, representative runtime support boundaries, retained aliases and breaking-release rules. Migration guide explicitly costs React Aria replacement across focus/keyboard/collections/overlays/locale/date, tests and licenses. Operational support window/cadence, accountable owner and confidential intake are explicitly undecided; no deprecation policy may be invented from missing tags.

Sources: `docs/migration.md:119`; `docs/developer/react-aria-dependency-upgrades.md`; `docs/developer/react-aria-architecture.md:157`; `docs/developer/react-aria-adoption-checklist.md`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/parallel-01/report.md`; `docs/developer/final-acceptance/parallel-06/report.md`.

Checks performed: Reviewed limitations/engine replacement paragraph and dependency procedure decision boundaries; reused prior naming/deprecation capture.

Required successor deliverables: W18-OWNER: owner records supported-release/backport window, review cadence/maintainer and confirmed confidential support/security channel or explicit non-service policy; reconcile full breaking/default map and experimental/public status. Then update support/deprecation/release-impact prose without claiming new device/framework guarantees.

### A-W-19 — partial

Original requirement: Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests.

New bounded audit checks 3,721 inline local link paths across 439 maintained Markdown documents outside final-acceptance reports: 119 missing targets; one in audited active canonical guides is moved release.config.mjs, with many others historical retired story/preview destinations. Commands also include removed build-storybook and legacy direct-script cwd. This is exact path-existence evidence, not every anchor/reference link/typecheck/command execution. Current snippets cannot all be certified against stale dist while four components change.

Sources: `README.md`; `docs/github-setup.md:138`; `docs/troubleshooting/validation.md`; `docs/developer/react-aria-runtime-ci.md`.

Tests / retained evidence (not rerun): `audit.py`; `evidence.json`; `proposed-doc-corrections.patch`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Executed own read-only path/fixture/hash audit; parsed all results and exact active command candidates; prepared fixes. No UI or command suites run.

Required successor deliverables: W19-VERIFY: apply active fixes; classify all 119 missing targets using original record/fixture mappings, preserving historical identity rather than rewriting history as new passes; validate heading anchors/reference-style/HTML links and inline source paths separately. Against a frozen freshly built package, compile current displayed public snippets and verify referenced command/script cwd resolution, without executing installs/releases/unrelated UI suites.

### A-W-20 — partial

Original requirement: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries.

Trust boundary is explicit: source documents/examples/issue task data do not override human scope, and AI workflow treats submitted task text as data. Extraction repository/commit and historical notices are preserved. Accurate complete third-party/asset provenance is not supplied by package byte preservation; license inventory openly retains legal/transitive/assets unknowns and owner/counsel decisions. No notice removal or legal approval is inferred.

Sources: `AGENTS.md:247`; `docs/agent-guidance-migration.md`; `docs/migration.md`; `LICENSE`; `THIRD_PARTY_NOTICES.md`; `docs/developer/react-aria-license-inventory.md`; `.github/workflows/ai-code.yml`.

Tests / retained evidence (not rerun): `docs/developer/final-acceptance/parallel-15/report.md`; `docs/developer/final-acceptance/fa01-package.txt`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Inspected active trust language, workflow task-data handling, provenance metadata and notice headings; read legal inventory limitations, no remote legal research or license edits.

Required successor deliverables: W20-ATTRIBUTION: responsible maintainer/legal reviewer resolves exact candidate artifact dependency/inline SVG/font/copied-source attribution against notices and extraction provenance, records findings and approved disposition while preserving historical text. Confirm licensor/commercial agreement separately; evidence documents never enlarge agent authority.

## Final verification and concurrent delta

All 20 records and their cited source/evidence paths validate. The proposed patch passes `git apply --check` and remains unapplied. During final verification the coordinator appended BUG-0008 commit/Clear guards and BUG-0009 TextArea decorative-icon guidance to AGENTS.md; the final paragraph was inspected. Original reviewed guidance remains unchanged; original/final hashes and prefix comparison are retained in verification.json. This does not certify the concurrent implementations or their output. An initial prose-whitespace assertion included normal unified-diff blank context lines; the corrected check excludes patch context and leaves the patch intact.
