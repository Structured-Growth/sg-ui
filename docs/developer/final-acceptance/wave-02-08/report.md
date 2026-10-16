# Wave 02 / 08 — host state, dates and UI acceptance

**19 original leaves reviewed: 12 complete, seven partial, zero blocked.** These are evidence-backed recommendations to the coordinator; shared counts/checklists were not edited. Complete means the particular original definition/implementation obligation is substantiated, not all-library browser/device/AT acceptance. The 20 editor V leaves and future production gates remain open.

Reviewed modified dev checkout at HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`; exact capture time `2026-10-16T22:43:56.107Z`. The audit runtime was v26.5.0; this runtime only read/hash-compared source and did not execute product tests. Retained FA-04 unit evidence is local Node 24, not a newly executed Node matrix.

## Checks and attribution

AGENTS.md, the current final-acceptance ledger and each full original leaf in react-aria-hardening-tasks.md were read. Existing parallel-08 token reconciliation, parallel-13 adapter evidence and parallel-14 i18n evidence were reused without repeating their scans. Actual scoped implementation, stylesheet, test assertions and relevant historical contracts were inspected.

New read-only evidence command (run from repository root):

```sh
node docs/developer/final-acceptance/wave-02-08/audit.mjs
```

[input-evidence.json](input-evidence.json) captures 300 exact SHA-256 input records, a syntactic test-title index, prior evidence-log hashes, branch/head/runtime and historical formatter comparisons. 293 records match FA-02/FA-01. Five differ: one is the precise FA-04 corrected DateRangeSelector test; four are concurrent forms guidance and TextArea source/style/test changes. Two parallel reports postdate those original snapshots and are captured as new evidence references. Test titles are an index, not newly passed results.

FA-04 retained evidence: fa04-original-check.txt records 32 foundation tests passed, production typecheck passed, then 275 passing unit suites and four failing calendar suites. The enclosing command failed. Its delta and affected rerun resolve the nine failing cases while retaining unaffected current-input unit results. We reuse that scoped evidence, including existing hook/SSR/DOM tests; we do not claim a new suite run or invent individual per-file passing counts from compact output. Exact logs are hashed in the audit. No test runner or shared output was mutated.

The coordinator changed TextArea while this review was running. Current source now renders inherited decorative icons and has a new multiline naming/ref/form test; its bytes differ from FA-02 and are excluded from FA-04 pass claims. BUG-0008 composite picker changes are not part of this audit. No old built output is asserted to cover either concurrent fix. Package imports established by prior unchanged package receipts are not a new package audit for changed source.

New historical attribution for H-12 compares four files directly to tested commit 4529de0ccefc11ebed799a8480477baf5e931324: helper, test, card re-export and its test all match byte-for-byte. The retained batch05 report records 59 cases/five related files per UTC, America/New_York, Asia/Kathmandu and Pacific/Kiritimati with German runtime locale on Node24.21.0. This is exact source-bound historical execution evidence; raw old transcripts were not recovered anew. The report does not upgrade it to current browser/hydration proof.

No install, suite execution, build, native/browser/consumer run, remote CI query, legal approval, server action, Git mutation or release operation occurred. Writes are confined to wave-02-08. Partial leaves need the named owners/actions below; source inspection is not a substitute for native or spoken-output evidence.

## Outcome table

| Leaf | Status |
| --- | --- |
| A-H-09 | complete |
| A-H-10 | complete |
| A-H-11 | complete |
| A-H-12 | complete |
| A-H-13 | complete |
| A-H-14 | complete |
| A-H-15 | complete |
| A-H-16 | complete |
| A-H-17 | complete |
| A-U-01 | complete |
| A-U-02 | partial |
| A-U-03 | complete |
| A-U-04 | partial |
| A-U-05 | partial |
| A-U-06 | partial |
| A-U-07 | partial |
| A-U-08 | partial |
| A-U-09 | partial |
| A-U-10 | complete |

## Concrete grouped-field contract for U-04 owner review

The narrow proposed interpretation uses the existing internal input base and native fieldset/legend composition; it adds no unsupported public InputBase. A host owns one group description/error ID and per-field labels, passes field-specific errorMessage/invalid to controls, and submits/resets the native form. RadioGroup is only a mutually exclusive-choice group and cannot substitute for this composition. A group message may use aria-describedby on the fieldset and, where needed for consistent control announcement, the supported aria-describedby on each text control. Ensure every referenced ID is rendered; do not duplicate the visible label as an error.

```tsx
import { TextField } from "@structured-growth/sg-ui/primitives";

// The application already loads styles.css and supplies Provider.
export function ContactFields() {
  return <fieldset aria-describedby="contact-help">
    <legend>Contact details</legend>
    <p id="contact-help">Supply both names for the course contact.</p>
    <TextField label="Given name" name="givenName" required
      aria-describedby="contact-help" errorMessage="Enter a given name." />
    <TextField label="Family name" name="familyName" required
      aria-describedby="contact-help" errorMessage="Enter a family name." />
  </fieldset>;
}
```

This is a reviewable contract/example proposal, not a compiled or native-tested snippet. Use instance-specific host IDs when rendering two copies; fixed IDs above illustrate one instance only. Owner acceptance, a maintained source-backed example, public-type check and actual grouped legend/error/reset evidence are still required. The present report does not unilaterally close the batch110 input-base/grouping decision.

## A-H-09 — complete

Original requirement: Keep supported-language policy, database overrides, caching/invalidation, audit metadata, and diagnostic logging host-owned.

Source/document references: `packages/ui/src/i18n/index.tsx`, `docs/developer/react-aria-i18n-acceptance.md`, `docs/developer/final-acceptance/parallel-14/report.md`.

Existing test references: `packages/ui/src/i18n/index.test.tsx`, `packages/ui/src/i18n/icu.test.ts`.

- SGTranslationAdapter accepts host locale/t/namespace callbacks and forwards original key/options/values; no supported-locale list, application catalog, database access, catalog cache or diagnostic logger is added.
- Provider fallback catches host lookup failures once without retry/logging payloads; maintained contract explicitly requires host diagnostic logging and owns catalog fallback, DB overrides, invalidation and audit metadata.
- Previous parallel-14 source/call audit and matching current adapter tests are reused; fallback formatter memoization, where present, is formatting machinery rather than a host translation-catalog cache.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-10 — complete

Original requirement: Define serializable owned date-only, local date-time, and zoned instant contracts; do not collapse all values into JavaScript `Date` or leak date-library classes casually.

Source/document references: `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`, `packages/ui/src/experimental/DateField/DateField.tsx`, `packages/ui/src/experimental/index.ts`, `docs/developer/react-aria-calendar-contracts.md`.

Existing test references: `packages/ui/src/experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx`, `packages/ui/src/experimental/DateField/DateField.test.tsx`.

- DateOnly is a validated-at-boundary unbranded ISO string; ranges contain inclusive Gregorian start/end strings; datetime and time props serialize local civil values without a timezone.
- dateTimeToInstant requires host timezone and returns a UTC ISO instant, with explicit earlier/later/reject policy. Host must retain source zone/disambiguation if later civil reconstruction is needed; no zone-bearing persistence object or reverse API is promised.
- Internal @internationalized/date classes are converted to Gregorian strings before callbacks. JSON/nonmutation tests preserve date/range/preset/local/instant records; no Date-only public representation collapse.

Limits: Complete for defining serializable owned wire contracts, not nominal string validation at every host input, native calendar conformance, or BUG-0008 picker behavior; concurrently edited composite pickers are excluded.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-11 — complete

Original requirement: Specify time zones, daylight-saving transitions, locale calendar display, parsing, invalid inputs, serialization, and round-trip behavior.

Source/document references: `docs/developer/react-aria-calendar-contracts.md`, `docs/developer/react-aria-due-date-acceptance.md`, `packages/ui/src/experimental/DateField/DateField.tsx`, `packages/ui/src/experimental/DateField/parseDateText.ts`, `packages/ui/src/experimental/DateField/parseRelativeDateText.ts`, `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`, `packages/ui/src/utils/relative-dates.ts`.

Existing test references: `packages/ui/src/experimental/DateField/DateField.test.tsx`, `packages/ui/src/experimental/DateField/parseDateText.test.ts`, `packages/ui/src/experimental/DateField/parseRelativeDateText.test.ts`, `packages/ui/src/experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx`, `packages/ui/src/utils/relative-dates.test.ts`.

- The specified policy separates Gregorian wire values, localized calendar display, text parsing and explicit timezone-to-instant conversion. Localized calendar callbacks convert to Gregorian; text entry intentionally uses Gregorian numeric/month names and locale order.
- Gap/overlap rejects by default, earlier/later resolutions and Tokyo midnight crossing have exact DateField unit assertions. Invalid external Feb 30 never submits a valid date; civil leap/month math and JSON roundtrip are covered.
- Current text grammar adds compact and separator dates, active-locale digits/months, English month names, fixed 1950–2049 two-digit window, and host reference dates for relative input. Invalid strings return null; drafts remain local.
- This advances batch108 specification reconciliation with current-input FA-04 parser/contract evidence. Full language/calendar/engine/device rendering matrices from that older report remain independent validation obligations.

Limits: Complete for the original SPECIFY requirement and its bounded existing unit proofs, not an all-calendar native roundtrip certification. Calendar host props require valid complete ISO inputs. No concurrent composite-picker or new built-output claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-12 — complete

Original requirement: Preserve due-date formatting and missing/invalid value fallbacks; test midnight, timezone, and localization boundaries.

Source/document references: `packages/ui/src/utils/formatDueDateLabel.ts`, `packages/ui/src/components/LearnerClassCard/formatDueDateLabel.ts`, `docs/developer/react-aria-due-date-acceptance.md`, `docs/developer/parallel-batch-05/due-date.md`.

Existing test references: `packages/ui/src/utils/formatDueDateLabel.test.ts`, `packages/ui/src/components/LearnerClassCard/formatDueDateLabel.test.ts`.

- Formatter retains native Date/string/epoch compatibility, unavailable due fallback, current-clock invalid-reference fallback, deterministic English unsupported-locale fallback and host translator primitive values.
- Existing assertions cover exact deadline/rounding, local midnight, month/year/leap rollover, spring gap/fall repeated hour, 23/25-hour tomorrow, elapsed day/week boundaries, ISO/epoch/equivalent-offset roundtrip and German/Arabic formatting.
- New read-only comparison proves helper, helper tests, card re-export and re-export tests exactly equal recorded tested head 4529de0ccefc11ebed799a8480477baf5e931324. Batch05 retains 59 related cases in five files per UTC/New_York/Kathmandu/Kiritimati zone with German runtime default on Node24.21.0; FA-04 also retains matching local unit evidence.
- Batch108 native/hydration limits remain open independently; no additional pure formatter run was necessary.

Limits: Four-zone evidence is a retained committed report with exact relevant byte identity, not newly recovered raw historical output or current native execution. Locale does not set timezone; host coordinates SSR/browser clocks and execution zones.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-13 — complete

Original requirement: Make persistence opt-in/configurable with distinct keys per view; document ownership, schema versioning, migration/reset, and sensitive-data restrictions. [Hook contracts](react-aria-pagination-state.md) and [grid persistence/reset](react-aria-catalog-grid.md).

Source/document references: `packages/ui/src/hooks/usePersistentState.ts`, `packages/ui/src/hooks/usePersistentPaginationModel.ts`, `packages/ui/src/components/AppDataGrid/ownedGridPersistence.ts`, `docs/developer/react-aria-pagination-state.md`, `docs/developer/react-aria-catalog-grid.md`.

Existing test references: `packages/ui/src/hooks/usePersistentState.behavior.test.tsx`, `packages/ui/src/hooks/usePersistentPaginationModel.hook.test.ts`, `packages/ui/src/components/AppDataGrid/ownedGridPersistence.test.tsx`.

- Memory-only default is per hook; local/session requires explicit storage and nonempty view key. Hook version envelope, optional migrate/validate, key/mode reset and host-sensitive-data restrictions are documented.
- Grid aggregate persistence is separately opt-in, v1 namespaced, validates only view concerns and excludes selection/rows/errors/pending work; docs require remount on identity change.
- Reset removes versioned/legacy grid keys and stores normalized defaults; unchanged rejected controlled snapshots cannot immediately overwrite reset defaults. Tests cover schemas, legacy migration, opt-in boundaries and reset suppression.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-14 — complete

Original requirement: Validate stored data and support SSR, blocked storage, quota failures, malformed JSON, key changes, cross-tab updates, and a working in-memory fallback. Real hook, live-settings and hydration regressions; [contracts](react-aria-pagination-state.md).

Source/document references: `packages/ui/src/hooks/usePersistentState.ts`, `packages/ui/src/hooks/usePersistentPaginationModel.ts`, `docs/developer/react-aria-pagination-state.md`.

Existing test references: `packages/ui/src/hooks/usePersistentState.behavior.test.tsx`, `packages/ui/src/hooks/usePersistentState.test.ts`, `packages/ui/src/hooks/usePersistentState.ssr.test.tsx`, `packages/ui/src/hooks/usePersistentPaginationModel.ssr.test.tsx`.

- useSyncExternalStore uses an initial server snapshot, never storage during SSR; hooks restore stored state after hydration. WeakMap browser fallbacks are window-scoped, never request-global server state.
- Validation/migration rejects malformed JSON/shapes/version candidates and reruns for live options. Blocked reads, quota/serialization failures retain mutable live fallback; local/session caches and distinct keys remain separate.
- Tests explicitly simulate storage/clear events, key changes, unmounted fallback retirement, equivalent-snapshot identity, version migration, quota recovery, and real hydrateRoot with zero recoverable errors under jsdom.
- Actual browser cross-tab event delivery is not proved by synthetic StorageEvent; support implementation and fallback behavior are substantiated without relabeling DOM hydration as native browser evidence.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-15 — complete

Original requirement: Remove the pagination helper's inherited page-size cap unless it is deliberately part of SGUI policy; define supported sizes through owned configuration and test normalization. [Configured sizes](react-aria-pagination-state.md).

Source/document references: `packages/ui/src/hooks/paginationModel.ts`, `packages/ui/src/hooks/usePersistentPaginationModel.ts`, `docs/developer/react-aria-pagination-state.md`.

Existing test references: `packages/ui/src/hooks/usePersistentPaginationModel.test.ts`, `packages/ui/src/hooks/usePersistentPaginationModel.hook.test.ts`, `packages/ui/src/hooks/PaginationState.next100-regression.test.tsx`.

- 25/50/100 are suggestions only; absent/empty/invalid policy accepts positive safe-integer sizes, floors valid fractions, and supports values above 100 through MAX_SAFE_INTEGER.
- Configured options deduplicate/sort valid positive integers and round upward or clamp to largest; invalid request uses normalized defaultPageSize then 25. Invalid/negative/unsafe pages become zero.
- Pure and hook tests cover arbitrary/configured sizes, invalid defaults, live options, safe integer boundary and setter normalization. Hook size setter intentionally does not infer page reset; consuming footer/grid actions own that transaction.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-16 — complete

Original requirement: Ensure filters/page-size changes reset or clamp pages coherently, including unknown row counts and disappearing rows.

Source/document references: `packages/ui/src/components/AppDataGrid/ownedGridState.ts`, `packages/ui/src/components/AppDataGrid/ownedGridModel.ts`, `packages/ui/src/components/AppDataGrid/ownedGridController.ts`, `packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx`, `packages/ui/src/components/CardPaginationFooter/pagination.ts`.

Existing test references: `packages/ui/src/components/AppDataGrid/ownedGridState.test.ts`, `packages/ui/src/components/AppDataGrid/ownedGridProcessing.test.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridPageShrink.test.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx`, `packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.test.tsx`.

- Filter/sort/search reset page zero before criterion callbacks; page-size actions are one atomic page-zero snapshot. Controlled host acceptance remains authoritative.
- Client processing computes display clamp from complete filtered rows and does not silently accept host criteria; shrinking to empty renders zero bounds. Known server totals clamp requested pages; unknown totals retain host rows and hasNextPage controls forward requests.
- Existing shrink tests assert rejected/accepted controlled requests, disappearing rows, unknown totals, retained off-page selection, callback order and identical cards/list display. No dataset-deletion host persistence or automatic selection reconciliation is invented.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-H-17 — complete

Original requirement: Preserve independent view state for tabs/card/grid views; avoid leaking selection, sort, or filter state between unrelated instances.

Source/document references: `packages/ui/src/experimental/Tabs/Tabs.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridController.ts`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`, `packages/ui/src/hooks/usePersistentState.ts`.

Existing test references: `packages/ui/src/experimental/Tabs/Tabs.next100-regression.test.tsx`, `packages/ui/src/components/AppDataGridShell/AppDataGridShell.test.tsx`, `packages/ui/src/hooks/usePersistentState.behavior.test.tsx`, `packages/ui/src/hooks/PaginationState.next100-regression.test.tsx`.

- Tabs regression resolves each repeated-label panel by its own aria-controls ID and asserts local selection/ref identity across sibling rerender/removal/remount.
- Shell tests explicitly isolate grid/card selection, sorting and filters using distinct persisted keys, remount restored concerns, and verify selection is excluded from persistence.
- Each hook memory instance is private; opted-in same storage/key intentionally synchronizes, distinct key/storage domains do not leak. Within ONE shell, list/cards intentionally share criteria/selection; unrelated shells stay separate.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-U-01 — complete

Original requirement: Implement Button, IconButton, split action, and button groups with loading, disabled, form type, link/action distinction, and focus behavior.

Source/document references: `packages/ui/src/components/Button/Button.tsx`, `packages/ui/src/experimental/IconButton/IconButton.tsx`, `packages/ui/src/experimental/ButtonGroup/ButtonGroup.tsx`, `packages/ui/src/experimental/SplitAction/SplitAction.tsx`, `docs/developer/react-aria-button.md`, `docs/developer/react-aria-layout-actions.md`.

Existing test references: `packages/ui/src/components/Button/Button.test.tsx`, `packages/ui/src/components/Button/Button.public-contract.test.tsx`, `packages/ui/src/experimental/IconButton/IconButton.test.tsx`, `packages/ui/src/experimental/ButtonGroup/ButtonGroup.test.tsx`, `packages/ui/src/experimental/SplitAction/SplitAction.test.tsx`.

- One Button implementation owns onPress, variant/tone/density/native refs and explicit submit/reset. Default type is button; native form click capture delivers one callback before default action, pending reset changes type to button.
- Loading suppresses activation and retains focus with named progress; disabled blocks focus/actions. IconButton requires label and hides decorative icon; independently focusable named ButtonGroup intentionally keeps normal Tab semantics.
- SplitAction composes neutral joined primary and menu callbacks, blocks both during loading/disabled and closes an already open menu on blocked transition. Tests cover one pointer/Enter/Space activation, current callbacks, form types, pending and sibling isolation.
- Link is the navigation contract, not a Button href variant; AppButton was removed before release. This is implementation closure only; physical touch, Firefox/native form ordering and spoken AT gates are not inferred.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-U-02 — partial

Original requirement: Implement Box/container, Stack, surface/Paper, card/content, separator/Divider, and responsive layout primitives with scoped styles.

Source/document references: `packages/ui/src/experimental/Box/Box.tsx`, `packages/ui/src/experimental/Stack/Stack.tsx`, `packages/ui/src/experimental/Surface/Surface.tsx`, `packages/ui/src/experimental/Card/Card.tsx`, `packages/ui/src/experimental/Divider/Divider.tsx`, `packages/ui/src/experimental/Box/Box.module.css`, `packages/ui/src/experimental/Stack/Stack.module.css`, `docs/developer/react-aria-layout-actions.md`, `docs/developer/parallel-batch-110/acceptance-evidence.md`.

Existing test references: `packages/ui/src/experimental/Box/Box.test.tsx`, `packages/ui/src/experimental/Box/Box.next100-regression.test.tsx`, `packages/ui/src/experimental/Stack/Stack.test.tsx`, `packages/ui/src/experimental/Stack/Stack.next100-regression.test.tsx`, `packages/ui/src/experimental/Surface/Surface.test.tsx`, `packages/ui/src/experimental/Surface/Surface.next100-regression.test.tsx`, `packages/ui/src/experimental/Card/Card.test.tsx`, `packages/ui/src/experimental/Card/Card.next100-regression.test.tsx`, `packages/ui/src/experimental/Divider/Divider.test.tsx`, `packages/ui/src/experimental/Divider/Divider.next100-regression.test.tsx`.

- All named presentation implementations exist with scoped layers, native refs/semantics, token spacing and explicit Surface/Card mappings. Stack wraps and switches column below 38rem; Box container is 100%/80rem with logical auto margins.
- FA-04 supplies now-reusable current-input unit/SSR tests unavailable to batch110, including independent instances and prop overrides. These assertions inspect DOM/style/SSR output and cannot establish native measured wrapping or nested scope geometry.
- The similarly named inventory-layout-replacement browser spec exercises DocumentEditorLayout, not this combined primitive scenario; it must not be cited as closing this obligation.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U02-GEOMETRY**: Use a docs-owned fixture combining container Box, responsive wrapping Stack, nested light/dark Surface variants, CardContent and decorative/semantic Dividers. At widths above/below 38rem assert direction, bounding box/gap/wrap, DOM/Tab order and independently resolved surfaces; inspect enlarged text and forced colors with the same controls. Save source/output/host hashes and raw engine results.

Prerequisites: Coordinator source/fixture ownership and one immutable shared build/browser window; no implementation fault established by this audit.

## A-U-03 — complete

Original requirement: Implement Text/Typography with semantic element selection and all required typography roles.

Source/document references: `packages/ui/src/experimental/Typography/Typography.tsx`, `packages/ui/src/experimental/Typography/Typography.module.css`, `docs/developer/react-aria-primitives.md`, `docs/developer/react-aria-layout-actions.md`.

Existing test references: `packages/ui/src/experimental/Typography/Typography.test.tsx`, `packages/ui/src/experimental/Typography/Typography.ssr.test.tsx`, `packages/ui/src/experimental/Typography/Typography.next100-regression.test.tsx`.

- Typography exposes independent semantic as and 15 visual roles including h1–h6/body1/body2/bodyAlt2/subtitle1/subtitle2/caption/overline/button/code. Native attributes/ref and noWrap are preserved without upstream augmentation.
- Every role has a shared-token-backed CSS selector. Existing parameterized SSR test enumerates all 15; semantic test renders as=h2/variant=h1 and rejects an accidental h1 document heading.
- Public primitive reexports route to the same owned implementation; text tone primary remains a compatibility alias for accent, independent of action priority.

Limits: Implementation and role/semantic API acceptance only. Actual font substitution, enlarged layout and AT document outline remain independently required validation.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.

## A-U-04 — partial

Original requirement: Implement TextField, input base, labels, descriptions, validation errors, required state, textarea, and grouped fields with correct associations.

Source/document references: `packages/ui/src/experimental/TextField/TextField.tsx`, `packages/ui/src/experimental/TextField/useStandaloneFormReset.ts`, `packages/ui/src/experimental/TextArea/TextArea.tsx`, `packages/ui/src/experimental/TextArea/TextArea.module.css`, `docs/developer/parallel-batch-110/acceptance-evidence.md`.

Existing test references: `packages/ui/src/experimental/TextField/TextField.test.tsx`, `packages/ui/src/experimental/TextArea/TextArea.test.tsx`, `packages/ui/src/experimental/TextArea/TextArea.next100-regression.test.tsx`.

- TextField/textarea have required naming union, native input refs, associated Label/Text/FieldError, native required/readOnly/disabled constraints and controlled/uncontrolled reset authority.
- Input base is internal React Aria Input, not an exported owned InputBase. Generic grouped-text-field contract remains unspecified; RadioGroup is not equivalent to generic text-field grouping.
- BUG-0009 source now destructures inherited start/end icons and wraps the textarea in decorative aria-hidden slots, with a new multiline/ref/form/naming test. Those TextArea source/style/test bytes differ from FA-02; no FA-04 or old built output pass is claimed for them.
- Progress beyond batch110: provide a concrete host composition decision in report.md, use supported native fieldset/legend plus individually named TextFields/TextArea, retain per-control descriptions/errors and describe group message references. Decision is proposed, not accepted or runtime verified.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U04-GROUP-CONTRACT**: API/documentation owner must explicitly accept internal input base + native fieldset/legend as U-04 or request a narrowly owned primitive. Publish a source-backed grouped-field example with stable group message references; prove two distinct labels, group legend, per-field/error associations and native required/reset. Preserve independent group state.

Prerequisites: Owner decision plus fixture/documentation write scope; add a primitive only if the owner actually requires a public InputBase/group contract.

Successor **W02-08-U04-CHANGED-TEXTAREA**: Attach coordinator BUG-0009 supported-runtime unit result for the exact TextArea source/style/test hashes, then fresh built declaration/source example parity and a bounded native decorated multiline label/ref/reset case.

Prerequisites: Concurrent fix owner must finish before attributable output/build/native validation. This report deliberately does not rerun or race those checks.

## A-U-05 — partial

Original requirement: Implement Checkbox, mixed state, Switch, RadioGroup, and label composition; document keyboard and form-submission semantics.

Source/document references: `packages/ui/src/experimental/Checkbox/Checkbox.tsx`, `packages/ui/src/experimental/Switch/Switch.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.tsx`, `docs/developer/parallel-batch-01/forms.md`, `docs/developer/react-aria-layout-actions.md`.

Existing test references: `packages/ui/src/experimental/Checkbox/Checkbox.test.tsx`, `packages/ui/src/experimental/Checkbox/Checkbox.next100-regression.test.tsx`, `packages/ui/src/experimental/Switch/Switch.test.tsx`, `packages/ui/src/experimental/Switch/Switch.next100-regression.test.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.test.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.next100-regression.test.tsx`.

- Mixed/checked presentation, native submission and label refs are implemented; unchecked/disabled omission and mixed serialization following checked are documented. Read-only values are retained; native reset restores only uncontrolled values.
- FA-04 retains current-input tests for Space, disabled fieldset/first-legend guards, radio arrow skipping, duplicate group-name isolation and removed/disabled selected radio Tab recovery.
- Batch110 specifically left empty/all-disabled required RadioGroup and delegated prevented reset open; current RadioGroup tests still contain no complete empty/all-disabled or delegated-prevention scenario. No fabricated pass or universal radio validity policy follows.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U05-RADIO-EDGE**: In an isolated native form exercise required RadioGroup with zero options, all options disabled, then one enabled option; record expected host loading/disabled-versus-invalid policy, native FormData/validity/focus and callback silence. Add delegated ancestor onReset prevention and accepted uncontrolled/latest-default reset. Reuse existing Checkbox/Switch cases rather than duplicate tests.

Prerequisites: Contract owner decides empty required group policy; coordinator must allocate bounded native fixture/build access. Empty group has no native radio input, so required cannot be assumed to block submission.

Successor **W02-08-U05-NATIVE**: Finish missing engine coverage for the existing batch13-control-checkbox/switch/radiogroup specs at a frozen candidate, retaining real mixed/required/error spoken output separately with named AT/browser/OS/operator.

Prerequisites: Browser build window; actual AT operator/device is required for speech, not ARIA inspection.

## A-U-06 — partial

Original requirement: Implement Select and searchable ComboBox/Autocomplete; define value identity, filtering ownership, empty/loading/error, multiple selection where required, and disabled options.

Source/document references: `packages/ui/src/experimental/Select/Select.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.tsx`, `packages/ui/src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx`, `docs/developer/react-aria-proof-controls.md`, `docs/developer/react-aria-primitives.md`.

Existing test references: `packages/ui/src/experimental/Select/Select.test.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.test.tsx`, `packages/ui/src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`.

- Stable string IDs define identity; duplicate labels remain distinct. Single selectors expose null clear and disabled options, native key serialization, descriptions/validation and host-controlled authority.
- ComboBox locally filters supplied options; AsyncMultiSelect owns query/result presentation and multiple selected records retained outside current results, ID form inputs, status/error/retry and native busy bridge. Host owns fetching, cancellation and stale response rejection.
- Current-input FA-04 unit evidence now includes Turkish filtering under RTL visual override, empty/disabled selections and Async busy/error/retry/isolation. This improves batch110 runtime attribution but does not replace its missing current three-engine native selector/busy/reset proof.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U06-NATIVE**: Run existing batch01-selectors.spec.ts and batch14-async-busy.spec.ts on one frozen docs-owned fixture host. Prioritize disabled-ID keyboard/form/focus, local filtering/duplicate labels, out-of-order host results, selected-record retention and busy/retry isolation; include reset/direction only where no equivalent matching native receipt exists. Save raw results/host/source/output hashes.

Prerequisites: Coordinator browser window; use explicit bounded cases per component and do not rebuild while testing. Spoken busy/options and mobile entry need operator/device evidence separately.

## A-U-07 — partial

Original requirement: Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover.

Source/document references: `packages/ui/src/experimental/Menu/Menu.tsx`, `packages/ui/src/experimental/Popover/Popover.tsx`, `packages/ui/src/experimental/Tooltip/Tooltip.tsx`, `docs/developer/react-aria-layout-actions.md`, `docs/developer/hierarchical-menu-scope.md`.

Existing test references: `packages/ui/src/experimental/Menu/Menu.test.tsx`, `packages/ui/src/experimental/Popover/Popover.test.tsx`, `packages/ui/src/experimental/Tooltip/Tooltip.test.tsx`, `packages/ui/src/experimental/Tooltip/Tooltip.lifetime.test.tsx`.

- Flat Menu items have owned IDs/labels/disabled/selected/shortcut/error/link semantics, controlled opening, keyboard command activation and trigger-focus restoration; item-record MenuItem is documented instead of an upstream rendered child.
- Popover contains arbitrary form/help content in a named dialog; Tooltip content is plain supplementary text with lifetime-key cancellation. Controls do not blur the menu-command and form-dialog distinction. Retained unit tests cover independent scope/open state/command/description/focus.
- Generic Menu has no child/submenu field. Explicit user-requested reusable sliding drilldown remains scope-only HM-F-01–04; SideNavigation has its own drilldown but is not a standalone Menu hierarchy. Do not infer submenu support from that private composition.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U07-HIERARCHY**: Resolve the required hierarchy against HM-F-01: owned model/path, command-versus-navigation semantics, recursive levels and Back focus/dismissal. Deliver HM-F-02–04 standalone implementation, public playground/source/metadata, and bounded forward/Back/leaf-action proof; preserve existing SideNavigation behavior. If popup flyout submenus are required, specify that separate contract instead of silently substituting drilldown.

Prerequisites: Owner scope/API decision and implementation authorization beyond this report-only directory. Current flat command Menu alone does not close the hierarchy obligation.

Successor **W02-08-U07-NATIVE**: Retain current host native Menu autofocus and Tooltip keyed-lifetime/Popover content focus results using existing batch17-menu-autofocus and batch13-control-tooltip plus bounded Popover case.

Prerequisites: Frozen build/browser access; do not count jsdom focus or historical missing artifacts as native proof.

## A-U-08 — partial

Original requirement: Implement dialog primitives and modal composition with title/description, dismissal reasons, initial/return focus, scroll locking, background interaction handling, and nested overlays.

Source/document references: `packages/ui/src/experimental/Dialog/Dialog.tsx`, `packages/ui/src/experimental/Dialog/Dialog.module.css`, `packages/ui/src/components/AppModal/AppModal.tsx`, `docs/developer/react-aria-proof-controls.md`, `docs/developer/react-aria-modal-shells.md`.

Existing test references: `packages/ui/src/experimental/Dialog/Dialog.test.tsx`, `packages/ui/src/experimental/Dialog/Dialog.next100-regression.test.tsx`, `packages/ui/src/components/AppModal/AppModal.test.tsx`.

- Dialog implements title/description/fallback label, explicit escape/outside/close-button/generic dismissal reasons, open authority, size/slots, native child autofocus and React Aria modality; AppModal composes it.
- Nested recovery retains parent initial focus, surviving child opener and host-selected other-overlay focus; tests exercise removed opener fallback and nested dismissal locks. Next100 test associates description and asserts document overflow lock stays until last dialog unmounts.
- FA-04 passing unit evidence is current for unchanged Dialog. These are jsdom focus/style assertions, not native background inertness, actual scroll containment, OS keyboard or AT conformance.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U08-NATIVE**: Execute existing batch01-dialogs three-level/local-Escape/outside cases and batch52-dialog-removed-opener cases against the frozen docs-owned host. Assert true Tab containment/return, background interaction blocking, lock retained across nested close and restored after final close; resize and preserve docs shell width/gutter. Save raw output and exact build/source identity.

Prerequisites: Coordinator admits immutable native host; unperformed spoken dialog announcement and mobile behavior require named AT/device/operator separately. Source implementation is present; no new library patch established here.

## A-U-09 — partial

Original requirement: Implement Tabs with correct roles, panels, orientation, activation mode, disabled tabs, focus visibility, and overflow behavior.

Source/document references: `packages/ui/src/experimental/Tabs/Tabs.tsx`, `packages/ui/src/experimental/Tabs/Tabs.module.css`, `packages/ui/src/experimental/Tabs/scrollTabIntoView.ts`, `packages/ui/src/experimental/Tabs/tab-overflow.ts`, `packages/ui/src/experimental/Tabs/useTabOverflow.ts`, `docs/developer/react-aria-tabs-orientation.md`, `docs/developer/react-aria-primitives.md`.

Existing test references: `packages/ui/src/experimental/Tabs/Tabs.test.tsx`, `packages/ui/src/experimental/Tabs/Tabs.next100-regression.test.tsx`, `packages/ui/src/experimental/Tabs/tab-overflow.test.ts`.

- Owned Tabs exposes orientation, automatic/manual activation, disabled item keys, value/default callbacks and stable Tab/TabPanel IDs. Tests assert independent associations and controlled acceptance.
- Scroll helper reveals the appropriate axis including RTL; overflow menu preserves primary order, hides secondary tabs from tab navigation, promotes accepted hidden selection and repairs focused tab. Manual vertical owned keys suppress unwanted host scroll without selecting until Enter/Space.
- FA-04 supports all current unit tests, including both orientations and controlled overflow. Actual measured fit/font/density resize and native enclosing-page scroll behavior cannot be certified by mocked geometry/DOM focus.

Limits: Source and retained passing unit/DOM/SSR evidence for matching inputs; no fresh native/device/AT/remote CI or released-artifact claim.

Successor **W02-08-U09-NATIVE**: Use tabs-vertical-orientation.spec.ts and batch05-tabs-overflow.spec.ts plus existing manual-tabs-host-scroll coverage. Retain current immutable-host proof of horizontal/vertical × automatic/manual, disabled skipping, two densities, RTL, clipped focus reveal, menu promotion and resize while rejecting/accepting controlled values. Reuse matching prior cases; select only missing/changed scopes.

Prerequisites: Coordinator native window; record actual scroll offsets/bounds and focus ring visibility, not merely role attributes. Spoken tab/panel output needs a separate AT operator.

## A-U-10 — complete

Original requirement: Implement owned Link/Breadcrumbs with host navigation integration and meaningful external-link behavior.

Source/document references: `packages/ui/src/experimental/Link/Link.tsx`, `packages/ui/src/experimental/Breadcrumbs/Breadcrumbs.tsx`, `packages/ui/src/adapters/Link.tsx`, `packages/ui/src/adapters/navigation.tsx`, `docs/developer/react-aria-layout-actions.md`, `docs/developer/final-acceptance/parallel-13/report.md`.

Existing test references: `packages/ui/src/experimental/Link/Link.test.tsx`, `packages/ui/src/experimental/Breadcrumbs/Breadcrumbs.test.tsx`.

- Link routes relative internal hrefs through the existing host adapter and defaults schemes/protocol-relative URLs to native anchors; external prop explicitly overrides classification. Native attributes, refs, replace and consumer cancellation remain intact.
- Case-insensitive new-tab target protection preserves supplied rel and adds noopener/noreferrer. Breadcrumbs renders named nav/ordered list, links ancestors and marks final text aria-current=page; separators are hidden.
- Reuse parallel-13 adapter-native/custom contracts and current-input Link/Breadcrumbs tests. This closes owned implementation/host integration/external policy; A-H-02/03 remain responsible for current native downloads/modifier/target and composed router proof.

Limits: Implementation/contract closure only; no new native navigation or external website/browser/AT result. Prior parallel-13 input hashes/limits are preserved, not converted to a fresh matrix.

No implementation/definition successor is required for this original leaf. Its stated independent native/device/AT/production gates remain outside this closure.
