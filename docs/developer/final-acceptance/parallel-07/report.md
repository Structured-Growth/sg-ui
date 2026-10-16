# Parallel 07 acceptance reconciliation

Date: 2026-10-16. Reviewed working `dev` checkout at
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`; existing uncommitted changes remain.
Only this directory was written. Recommended dispositions: **A-A-16 complete,
A-A-17 complete, A-A-19 partial**. These dispositions address the full original
architecture leaves at `react-aria-hardening-tasks.md:166–169`; they do not close
component/browser/device/AT acceptance or the 20 editor V leaves. The coordinator
must reconcile shared checklists and counts. No production approval is implied.

## Evidence and checks actually performed

Read AGENTS, final-acceptance execution/FA-01–04 receipts, the three original
requirements, README, migration/component architecture, dependency upgrade policy,
and the source/contracts/tests cited below. Used `rg` and bounded file reads to
check owned contracts, extension callbacks, network-service candidates and stale
guidance. No new implementation or test was necessary for this reconciliation.

Ran `python3 docs/developer/final-acceptance/parallel-07/reconcile.py` from the
repository root. [input-receipt.json](input-receipt.json) contains exact SHA-256
identities, retained evidence hashes, selected closure roots and dependency graph
observations. The script resolves relative imports using the **saved** FA-02
import graph and hashes the selected closure; it does not repeat FA-01/02's full
inventory. Results:

- Nine test/implementation roots resolve to 256 source/style inputs, with zero
  unresolved relative imports. Together with guidance/configuration, 276 inputs
  were checked. All selected library source/test/configuration, package manifests,
  lockfile and guards match FA-02 after applying the four FA-04 deltas.
- Only the final-acceptance ledger and hardening checklist differ from FA-02 in
  that selected set. Their current requirements were read directly. These are
  documentation changes, not a reason to repeat passed runtime checks.
- Four selected implementation/declaration outputs (editor section and SearchField)
  match FA-01. This is a bounded corroboration, not a new all-output audit.
- Reused [FA-04 original check](../fa04-original-check.txt): foundations/token guards,
  32 foundation tests and production typecheck pass; the full unit invocation then
  reports 275 passing and four failing suites, 1,729 passing / nine failing cases.
  The original invocation remains failed. [Affected rerun](../fa04-calendar-rerun.txt)
  and [input delta](../fa04-library-input-delta.json) reconcile only those failures.
  The selected tests below are outside the four failed suites. The preserved
  reporter provides aggregate passing evidence, not individual passing case traces.
- Reused [FA-02 foundation guard](../fa02-foundations.txt) and
  [FA-04 package audit](../fa04-package.txt). They establish their recorded
  source/import/declaration/package checks, not behavioral browser conformance.
- Reused FA-02's dated dependency graph rather than executing another dependency
  listing. Unchanged manifests/lockfile support retaining that configuration
  evidence. No claim is made that current node_modules physical topology was
  independently revalidated.

No test suite, build, dependency installation, browser, packed consumer, registry
lookup, server operation, git mutation or release operation was performed. Nothing
outside this directory was edited. No source inspection or jsdom assertion is
represented as native/browser/device/assistive-technology conformance.

## A-A-16 — complete (architecture and observable regression boundary)

Full requirement: “Keep replacement implementations swappable behind observable
behavior tests; do not promise a later rewrite will be cost-free or entirely
nonbreaking.” Historical open status was not used as a verdict.

The requirement is met by an owned consumer boundary, replaceable internal
implementation layer, retained tests of observable contracts, and explicit swap
cost limits. This does **not** assert that replacing an engine has been implemented
or proven behaviorally equivalent.

| Requirement evidence | Source/test reference and finding |
| --- | --- |
| Owned implementation boundary | `docs/developer/react-aria-architecture.md:25–44,59–79` defines tokens/presentation/interactions/compositions and private upstream state/date objects. `packages/ui/scripts/check-foundations.mjs:9–52,79–95` registers interaction implementations and audits direct/transitive imports. Guard evidence is reused as above. |
| Owned declaration boundary | `packages/ui/scripts/check-package.mjs:9–21,64–77` rejects named upstream interaction/state/grid types in emitted contracts. FA-04 package audit passes for its unchanged build. This guard alone is not proof of every possible API leak; A-A-11/public API reconciliation stays separate. |
| Observable basic-control tests | `packages/ui/src/components/Button/Button.public-contract.test.tsx:12–56` uses named button roles, real native refs, pointer/Enter/Space activation counts, disabled/pending behavior, native submit and SSR attributes. It does not mock the React Aria engine. Replacing the engine must retain the activation/form/ref outcomes. |
| Observable advanced-control tests | `packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx:16–54` checks rendered rows, native refs, paging, callback order, retained selection IDs, host server row pass-through and page-size transactions. `packages/ui/src/experimental/DataGrid/DataGrid.test.tsx:64–111` checks server ordering/owned snapshots, non-drag reorder requests and sibling grid isolation. Assertions are consumer/DOM outcomes rather than TanStack/React Aria state objects. |
| Observable civil-range contracts | `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.behavior.test.tsx:13–51` checks draft endpoint text, Apply gating, committed FormData, exact civil callback values, Cancel, unavailable ranges, read-only and host replacement. No interaction engine mock is used. Tests remain tied to owned semantics even if DOM selectors need deliberate revision after a rewrite. |
| Explicit cost and breaking-change limits | `docs/developer/react-aria-architecture.md:96–101` says a future swap still requires engineering and may expose API changes. `docs/migration.md:135–139` names focus, keyboard, collections, overlays, locale/date work, browser/accessibility/SSR/package revalidation and license review. No free rewrite or automatic cross-framework portability is promised. |

Evidence limit: this is architecture plus retained observable unit/guard evidence,
not an exhaustive all-components contract suite, native equivalence proof, or
closure of accessibility/SSR/device gates. Existing `data-*`/focus/role assertions
may need reviewed migration when markup changes. The meaningful callback/value/
form outcomes must remain protected. No speculative rewrite is needed to close
this leaf.

Successor: none required for this architecture leaf. On any future engine
replacement, retain these observable contracts, explicitly map intentional API
breaks, update migration/release markers and execute affected native/accessibility/
SSR/package checks at the candidate head. That future work is not complete today.

## A-A-17 — complete (advanced extension and host ownership boundary)

Full requirement: “Define extension points for advanced components without placing
backend scheduling, booking, permission, or account logic inside UI controls.”

The source defines concrete extension points already used by advanced controls.
Local draft/validation/pending behavior is UI work; authoritative availability,
reservation/conflict decisions, permissions, account operations, remote requests
and durable persistence remain host work.

| Advanced boundary | Exact source/contracts and evidence |
| --- | --- |
| Grid data, custom content and actions | `packages/ui/src/experimental/DataGrid/types.ts:3–12,26–47` exposes generic row accessors/renderCell, state/onStateChange, client/server mode, totals, loading/error/refresh, renderActions and reorder request. `packages/ui/src/components/AppDataGrid/ownedGridColumns.ts:6–34` exposes owned row-based format/custom cell/link/image/menu callbacks. Public aliases are in `AppDataGrid/types.ts:1–34`. No upstream engine params are required from the host. `docs/developer/react-aria-catalog-grid.md:31–36` and `react-aria-grid-contracts.md:218–222` assign data fetching, cancellation/stale response handling and persistence to hosts. The tests cited under A-A-16 protect server pass-through and callback outcomes. |
| Calendar availability, presets and annotation | `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx:24–100` exposes civil value/change/draft callbacks, bounds, explicit unavailable data, getDateUnavailableReason, renderDayContent and host preset groups. Callbacks supply policy results; SGUI validates and presents the supplied constraints. `docs/developer/react-aria-calendar-contracts.md:542–564` documents endpoint/interior availability and owned commit/render behavior. `DateRangeSelector.behavior.test.tsx:38–51` verifies invalid drafts/read-only/host replacements. UI selection and recurring availability predicates do not reserve resources or establish booking authorization. |
| Editor content and durable assets | `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx:187–215` exposes unknown JSON input/output, tool preset/control sets, readOnly, native style and onUploadImage(File) returning asset metadata. `docs/developer/react-aria-editor-section.md:55–65` distinguishes temporary owned blob previews from durable host-returned assets. `ImageUploadModal/ImageUploadModal.tsx:12–23,44–65` accepts onSubmit and states host upload/description ownership and metadata-only picker validation. `ImageUploadModal.test.tsx:56–107,153–177` checks retry, trimmed descriptions, duplicate suppression and stale-session rejection. `EditorUploadLifetime.next100-regression.test.tsx:15–63` checks sibling URL/resource lifetimes; it mocks floating-toolbar selection geometry, so it is only resource-ownership evidence. No backend save or upload service is embedded. |
| Accounts and permissions | `packages/ui/src/adapters/accounts.tsx:3–29` defines host session presentation records and SGAccountAdapter callbacks. Safe disabled defaults perform no work. `accounts.test.tsx:9–44` checks caller-owned promises/errors, exact host invocation and no implicit account switching; its lifetime cases preserve replacement/unmount/provider boundaries. `docs/developer/react-aria-architecture.md:103–108` keeps scheduling permissions, accounts and booking rules host-owned. Enabling/hiding UI controls is presentation, never authorization. |
| Remote search as an additional boundary example | `packages/ui/src/experimental/SearchField/SearchField.tsx:18–60` exposes items/query/results callbacks, filter="none", loading/error/retry and host routing. Its contract explicitly assigns request freshness/data/routing to hosts. Source is unchanged and selected outputs match FA-01; this row is source contract evidence, not a newly executed search test. |

A bounded `rg` search of production `.ts/.tsx` (excluding tests/native fixtures)
for `fetch(`, axios, XMLHttpRequest, supabase, `/api/` and HTTP URLs returned only
LinkUrlModal placeholder/URL normalization and the local sentinel bases in link
and image URL policy. No network service implementation was found by that search.
This is supporting textual evidence, not a complete effect/capability security
audit: images/links still cause host/browser resource requests, and consumer
callbacks can perform network work. FA-02 import inventory and architecture
boundaries independently corroborate the absence of application-service imports.

Evidence limit: defining host extension points does not implement booking,
recurrence scheduling, permission enforcement or backend lifecycle guarantees.
Existing broad calendar/editor/native/AT leaves remain open. In particular the
20 editor V leaves are not waived by this architecture disposition.

Successor: none required for this architecture leaf. FUT-K-15 remains future work
for requested appointment/course-session compositions; it must use host data and
callbacks rather than adding conflict/reservation/persistence engines to controls.
An adjacent documentation cleanup is included below because old calendar-limit
prose predates the shipped PeriodPicker/comparison compositions; it does not erase
the current explicit extension contracts.

## A-A-19 — partial (policy exists; its operational paths are stale)

Full requirement: “Document package dependency placement, supported versions,
upgrade policy, and deduplication requirements for React Aria and date utilities.”
Its historical checked status is insufficient: the current documented upgrade
workflow still points at removed tooling and the retired integration branch.

| Requirement | Findings |
| --- | --- |
| Placement and supported inputs | `packages/ui/package.json` declares React/React DOM peers `^18.3.1 || ^19.0.0`; exact runtime react-aria-components 1.21.1, react-aria 3.52.1, react-stately 3.50.0 and @internationalized/date 3.12.4. React 19.2.3 is also a development test input. PostCSS/CSS Modules and test/build tools are development dependencies. README's application-install paragraph and architecture lines 164–177 correctly say consumers need no extra interaction/date peer installation. These are declared/reviewed inputs, not latest-upstream or security claims. |
| Dated resolved graph | FA-02 observes one name/version node for each of those interaction/date packages and React/React DOM 19.2.3. Five retained date edges (library root, linked docs library, React Aria Components, react-aria and react-stately) resolve to @internationalized/date 3.12.4. Exact nodes/edges and hashes are in input-receipt.json. The snapshot collapses name/version identities; it cannot prove one physical instance, peer-context deduplication or all-consumer singleton behavior. No dependency defect is inferred solely from that limitation. |
| Upgrade/deduplication policy | `docs/developer/react-aria-dependency-upgrades.md:19,85–115` requires graph/peer/engine/integrity review, date identity and duplicate checks, frozen installation, license review, owned API mapping, behavioral/native/packed checks, exact-head receipts and rollback planning; rejects forced incompatible overrides. Architecture lines 167–177 assigns lockfile/deduplication to the package manager. No engine-replacement or automatic semver-compatibility promise appears. |
| Concrete stale guidance | Dependency upgrade guide line 10 links root package.json as authoritative; that file now has only workspace tooling and forwarding scripts, while runtime deps/peers/exports live in packages/ui/package.json. Lines 22,103,121,125,129,143 still refer to Storybook/stories/static Storybook validation. Storybook is removed. Line 133 directs migration work to retired codex/dev. Thus a maintainer following the central upgrade guide cannot follow its documented host/branch steps as written. |
| Governance boundary | Lines 152–170 explicitly leave human maintenance ownership, review cadence, intake, escalation and backport decisions unresolved. Those are A-L-09 operational successors; this reconciliation invents no owner, SLA or security/EOL claim. Correcting A-A-19's paths does not itself close A-L-09. |

No dependency change or actual upgrade was requested or executed. Source/package
checks provide retained evidence only for the unchanged reviewed combination.
No npm advisory/current-support/version status was queried or claimed.

Required successor **P07-A19-DOC** (documentation-only; within a separately owned
source-edit task):

1. In `docs/developer/react-aria-dependency-upgrades.md`, change authoritative
   manifest link to `../../packages/ui/package.json`; preserve the root lockfile
   link. Name the runtime/development placement consistently with the manifest.
2. Replace active Storybook/stories instructions at the lines above with docs
   examples, source-context unit fixtures and the docs-owned static native fixture
   host. Document root forwarding commands (`pnpm build:browser-docs`, then bounded
   `pnpm test:browser` selection when authorized) and `packages/ui` cwd for direct
   scripts. Preserve serial build/fixture leases and the no-rebuild-during-tests
   requirement; preserve full production gates without claiming they ran.
3. Replace retired `codex/dev` with `dev` and link current development validation
   policy. Keep main promotion/release human approval and version automation intact.
4. Retain the compatible graph/date identity/duplicate review and prohibition on
   coercing incompatible overrides. State that FA-02's deduplicated graph inventory
   is not a physical singleton certification; inspect actual peer contexts in the
   next authorized upgrade receipt if needed.
5. Verify corrected relative links, paths and consistency with AGENTS, manifest,
   docs fixture scripts and CI. No UI/unit/browser rerun is required for this prose
   correction alone. Do not close A-L-09 or any runtime matrix from this change.

Reproduction: open guide lines 10,22,103,121–143 and compare with
`packages/ui/package.json`, root `package.json`, README's workspace/docs section,
and AGENTS's dev/fixture guidance. The mismatch is deterministic source evidence.
A-A-19 must remain partial until that correction lands and is reviewed.

Adjacent optional successor **P07-CALENDAR-DOC**: reconcile old limitation prose in
`react-aria-calendar-contracts.md:134–138` with later shipped PeriodPicker,
DateTimeRangePicker and DateRangeComparisonPicker contracts. Distinguish host
recurring availability from a backend recurrence/booking engine. This is recorded
for the calendar documentation owner; no shared source was edited here.
