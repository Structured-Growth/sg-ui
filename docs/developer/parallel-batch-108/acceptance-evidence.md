# Batch108: H-08–H-12 acceptance evidence at the reviewed head

Reviewed Git head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` assignment baseline).
Date: 2026-10-07. Isolated managed worktree created before edits:
`/Users/thomashall/.codex/worktrees/batch108-evidence/sg-ui`.
Branch: `codex/batch108-acceptance-evidence`. Initial status was clean, detached HEAD
matched the assigned hash, then the branch was created. The sole edited file is
this report. Source, shared configuration, master acceptance and ledgers remain
read-only. No install, tests, builds, pack, browser, performance, leases or CI were
run. No optional spec was added: existing specs already cover the native slices
inspected below; a test filename is not evidence of execution.

## Per-criterion decision matrix

“Supported” here means the particular written criterion has source/document
support, not acceptance of its surrounding parent, release, device or AT gates.
Only the coordinator may accept or update checkboxes. All five master checkboxes
were unchecked at the reviewed head and remain untouched.

| ID and complete assigned criterion | Decision and concrete evidence at the reviewed head | Precise remaining gate / ownership |
| --- | --- | --- |
| **H-08** Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories. | **Partial.** [ICU tests](../../../src/i18n/icu.test.ts) exercise recursive variable parity including inactive branches, selection counts 0/1/2/1234, Arabic categories, French fractional counts, nested/offset/ordinal branches, apostrophes, invalid syntax/values and native Intl number/date/time. [Translation stories](../../../src/i18n/Translations.stories.tsx) include English fallback, `PseudoLocalizedLongLabels` (320px composition) and `ArabicPluralAndDirection`. Historical unit head and matching blobs are in E1; E3 supplies actual three-engine German due/translation replacement evidence, E4 supplies actual Chromium Arabic keyboard/calendar evidence. Neither shard executes the pseudo-localized translation story. | Native reflow/long-label review and Arabic plural/status behavior of the actual translation stories remain unproven. No retained dedicated translation-story native result was located by repository search. Full catalog coverage, manual spoken status output and host-catalog argument-type parity remain distinct limits; name validation does not validate argument types. Full MessageFormat styles/skeletons/rich tags remain host-engine scope. Do not close H-08 using formatter units or unrelated calendar/card shards. |
| **H-09** Keep supported-language policy, database overrides, caching/invalidation, audit metadata, and diagnostic logging host-owned. | **Supported for the library boundary by direct read-only inspection.** [Adapter](../../../src/i18n/index.tsx) has only locale, lookup and namespace callbacks. It forwards the original key/options/values and method receiver, calls the host once, delegates namespaces without cache/deduplication, and applies English fallback without logging values. [Contract](../react-aria-i18n-acceptance.md#host-boundary) explicitly assigns all six listed policies to the host. [Boundary tests](../../../src/i18n/index.test.tsx) cover exact forwarding, no eager namespace loading/cache/deduplication, propagated namespace errors, lookup failure fallback and provider isolation; E1 attributes these retained bytes. Storybook locale fixtures are expressly not a supported-language policy. | This is a library responsibility criterion, not proof that any consuming application's database/cache/audit implementation is correct. Root may accept this narrow boundary on the cited source/contract; broader host integration and native/AT acceptance remain outside the claim. No missing library behavior identified. |
| **H-10** Define serializable owned date-only, local date-time, and zoned instant contracts; do not collapse all values into JavaScript `Date` or leak date-library classes casually. | **Supported for the defined experimental contract by source/document inspection.** [Serializable values](../react-aria-calendar-contracts.md#serializable-values) defines Gregorian `YYYY-MM-DD`, inclusive `{start,end}`, timezone-free `YYYY-MM-DDTHH:mm:ss`, clock `HH:mm:ss`, and ISO UTC instant resolved with an explicit host timezone. [Date contract](../../../src/experimental/DateRangeSelector/date-contract.ts) returns strings; `DateOnly` is an unbranded string, not a runtime validator. [DateField](../../../src/experimental/DateField/DateField.tsx) exposes owned strings/null and converts internal calendar classes to Gregorian on callback; [TimeField](../../../src/experimental/TimeField/TimeField.tsx) exposes clock strings. [Experimental exports](../../../src/experimental/index.ts) expose the owned helpers/types. E2 records exact blobs. | The instant contract is UTC serialization after explicit timezone resolution, not a persisted zone-bearing object; the host retains zone/disambiguation if it needs to reconstruct civil time. No reverse instant-to-zone API, nominal string type or scheduling persistence is promised. Existing due helper's compatibility `Date`/string/epoch input is separately documented and does not redefine civil-field contracts. Broad calendar acceptance remains open; no production type expansion or missing behavior is justified by this criterion alone. |
| **H-11** Specify time zones, daylight-saving transitions, locale calendar display, parsing, invalid inputs, serialization, and round-trip behavior. | **Partial.** [Calendar contract](../react-aria-calendar-contracts.md) specifies explicit timezone conversion, gap/overlap rejection by default and `earlier`/`later`, Gregorian wire values with localized display, complete ISO host inputs and draft rules. [DateField tests](../../../src/experimental/DateField/DateField.test.tsx) assert both Chicago DST transitions and exact resolution strings, Tokyo midnight crossing, timezone-free datetime submission and invalid external February 30 suppression. Date-range validation rejects malformed/calendar-invalid civil dates. [Due contract](../react-aria-due-date-acceptance.md) separately specifies native Date parsing/local zone/SSR requirements and JSON/offset roundtrips. E4 proves Arabic/Hebrew display-to-Gregorian selection in Chromium. | Full locale/calendar/engine matrix, native datetime parsing/roundtrip across host zones, paste/autofill/zoom/device behavior and live AT remain unverified here. Calendar props expect valid complete ISO strings; DateField's defensive invalid-value behavior must not be generalized to every calendar prop. Conversion docs/test source establish a bounded specified policy, not a freshly executed comprehensive DST/roundtrip suite at the current head. No missing product behavior was demonstrated. |
| **H-12** Preserve due-date formatting and missing/invalid value fallbacks; test midnight, timezone, and localization boundaries. | **Partial, with strong retained formatter and native slices.** [Helper](../../../src/utils/formatDueDateLabel.ts) preserves execution-local calendar comparisons, relative elapsed minute/hour/day/week thresholds, absolute deadline fallback, English locale fallback and translated unavailable labels. [Tests](../../../src/utils/formatDueDateLabel.test.ts) cover local midnight, deadline/rounding, month/year/leap, DST gap/repeated hour and 23/25-hour tomorrow, JSON/epoch/offset identity, missing/invalid inputs and German/Arabic. E1 attributes the historic four-zone unit report to unchanged helper/test blobs. E3 verifies actual German browser Intl plus invalid/imminent dates and translated fallback in all three engines at an exact retained candidate. | Current full locale/engine results are not established by historical execution. E3 excluded en-US/ar-EG and invalid-host-locale cases; it contains no midnight clock crossing or cross-timezone hydration test. Host must coordinate reference clock and SSR/browser timezone; locale does not set timezone. Physical-device/AT and broader host hydration boundaries remain open. No helper source defect demonstrated and no duplicate utility test proposed. |

## Evidence attribution and retained-artifact limits

### E1 — existing unit reports and byte identity (not a new test run)

Read [batch11 ICU report](../parallel-batch-11/icu-parser-boundaries.md): it reports
52 passing tests in the two i18n files on tested implementation head
`f601e995a3c2a0a420abe26f2ce4be81ecaeee5d`, Node24.21.0. Git blob comparison to
this review head independently confirmed identical implementation/test/story bytes:

| Current file | Git blob (also present at the cited tested head) |
| --- | --- |
| `src/i18n/icu.ts` | `7a93dd490eb641b91bbfdcee6e6d9784b452cb49` |
| `src/i18n/icu.test.ts` | `eebc4c3a65e1eddea07e9f24fac2b421e3fde932` |
| `src/i18n/index.tsx` | `3995019deab2fe0b5c1082320c06c73802a47ffb` |
| `src/i18n/index.test.tsx` | `3473d2b1a97cd5932d6322e3d4f1fee350da11d5` |
| `src/i18n/Translations.stories.tsx` | `86b77bee4ee63f131a8b93809e92f554afd3ec54` |

Read [batch05 due report](../parallel-batch-05/due-date.md): tested head
`4529de0ccefc11ebed799a8480477baf5e931324`, Node24.21.0, reports related tests
5 files/59 cases per zone UTC, America/New_York, Asia/Kathmandu and
Pacific/Kiritimati with German runtime locale. Current helper blob
`dfce16aa6abbed4fa0ea74f0257805b8a1b53431` and helper-test blob
`f1abf72b931885a74f6244e8ba2fbbd8c6b680c5` exactly match that tested head.
The card helper is a direct re-export. These are retained committed execution
reports with verified relevant byte identity; raw unit output was not independently
recovered in this assignment. They are not fresh current-head passes. Batch01's
Node26 full-check/build report is likewise historical, not current supported-node
or native translation acceptance.

### E2 — direct current contract source identity

The following are exact Git blobs at the reviewed head, inspected directly:

| File | Git blob |
| --- | --- |
| `src/experimental/DateRangeSelector/date-contract.ts` | `28fe61014fb64dbfa5e2c79dd433926548a75855` |
| `src/experimental/DateField/DateField.tsx` | `559fd4918096a536452e8ebd57abc48a84e1a619` |
| `src/experimental/DateField/DateField.test.tsx` | `fcfddfd91bfe7bcd4746420c300475942c0be6ff` |
| `src/experimental/TimeField/TimeField.tsx` | `8fce7e8099024b632dd62b2af5fe4e4d4bf80fc6` |
| `src/experimental/index.ts` | `1ddfaaa40ff4e61f53d5853428abbe000075f61b` |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| `docs/developer/react-aria-i18n-acceptance.md` | `bd3cbf71040160b8c27a53f4df44f558c9f85c52` |
| `docs/developer/react-aria-due-date-acceptance.md` | `aeb82c9f96fcd433c50b75c7d06a84afbf17d068` |

No declarations were freshly emitted or tested. Public source signatures, rather
than an inferred declaration-build pass, establish the owned wire-value boundary.

### E3 — independently read retained due-label native shard

Retained pool root (confirmed present and read):
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/`.
Read root `evidence.json` and `learner-card-engine-parity/{evidence,results}.json`.
Exact tested candidate: `24f9b4abb6ae39675b5bdf9abe8c9764a14a059e`, Node24.19.0,
Darwin; shard selected Chromium/Firefox/WebKit with grep
`browser ICU de-DE|native isolated Continue activation|native activation`.
12 expected, 0 unexpected/skipped/flaky, one attempt per case (retry0). Only three
of these cases are German due-label tests; the other nine establish action behavior.
Root pool status is **failed** from other scopes; this shard is passed.
Root initial/final head, source digest and build digest match; final status is
clean and cleanup says owned commands settled. No current full-suite pass follows.

| Artifact | SHA-256 |
| --- | --- |
| root `evidence.json` | `9eaeb49111378b4a1bcb27ca0edea4191e325f5a75a70a432133e4c0670c3f25` |
| shard `evidence.json` | `9185e0f8a4d31d1fa3d930b7a79f6137d77dfc7a983d3a59ab390ab06127a7d5` |
| shard `results.json` | `81860d2f916ffaf76b5c50d03f27b37fa8cb11a07f0b3ff2b2249512c8825fc8` |
| build (manifest digest) | `de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248` |

Current [spec](../../../tests/browser/inventory-learner-card.spec.ts) Git blob
`b1998f9f0dd5ef87eeb4fabbfc147fed960cbfef`, card source
`3e8d73e0e48d68c9dc324ad49e4507a2060b5417`, card story
`d86cb85a2e5a2682f11884723a7b98f07d9be168` and due helper blob from E1 match the
candidate. Read-only `git diff --name-only` also found no changes since that
candidate under i18n, experimental Provider, LearnerClassCard, foundation,
AppButton, ClassCardFrame, SGLink or adapters. This is scoped source attribution,
not a rebuild equivalence claim for every dependency at the current head.

The prior failed pool `62606ae5-219b-4fc7-816f-fb51691ea5fd` still exists at the
dev-integration worktree; its directory inventory was inspected, not relabeled or
used as a pass. [Batch54](../parallel-batch-54/learner-card-engine-parity.md) retains
that German hour-padding failure and later correction. A historical proposed
`batch25-due-label-icu.spec.ts` / batch25 report mentioned in the throughput audit
is absent at this head; proposal text is excluded as execution proof.

### E4 — independently read retained localized calendar native shard

Retained pool root (confirmed present and read):
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f/`.
Read root manifest and `calendar-native-locales/{evidence,results}.json`.
Tested candidate: `1a378accd909a471e653fe4e27fe9457c9531049`, Node24.19.0,
Darwin. Chromium only, complete spec without grep, 10 expected,
0 unexpected/skipped/flaky, light/dark. Root status passed, immutable initial/final
head/source/build digests, clean final Git status and owned commands settled.

| Artifact | SHA-256 |
| --- | --- |
| root `evidence.json` | `5cb3d884baa20acc27afbaef230469ebabddf30d48f6c10a0dc32c69f5c1b59c` |
| shard `evidence.json` | `0a5b0465dfb45752280622853ddf1ef307c5749cb5a1193272255927bf8ff6c2` |
| shard `results.json` | `41fc87ab346d56bf596022612fa6170d83815e0ffd18ae93b4b11bdd193aca66` |
| build (manifest digest) | `ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75` |

Current Calendar source blob `398c4d756b023c025d514a1b718d075ddec07c85`,
[localized fixture](../../../src/experimental/Calendar/Calendar.native-locales.stories.tsx)
`099fd58d5d14510a6973da814a9e60eb0b0781f4`, unit
`623179da6adf2e56e400c902253f7b7253f4b0fa` and
[native spec](../../../tests/browser/calendar-native-locales.spec.ts)
`dfb3d49cdb935658ecb2b8d3f70906b4ee27ef7a` match that tested candidate exactly.
No changes since it under i18n, experimental Provider/Calendar/Button/
DateRangeSelector or foundation. [Batch74](../parallel-batch-74/calendar-native-locales.md)
provides the original attribution. This proves Gregorian serialized selections
from Arabic/Hebrew calendar display in Chromium, not Firefox/WebKit or every
calendar system. Batch01's earlier Firefox launch failure is not superseded for
its different range-selector scope.

## Bounded coordinator handoff

No actual missing production behavior was demonstrated, so no exclusive source
fix allowlist is requested and no fabricated regression is included. The next
useful evidence window for H-08 can use existing deterministic story IDs
`foundations-translations--pseudo-localized-long-labels` and
`foundations-translations--arabic-plural-and-direction`, with a separately assigned
native spec/report only: check narrow-width reflow, complete labels, Arabic
0/1/2/few counts and native keyboard activation. It is **UNRUN**, requires root
scheduling, and does not need a production or new-story change. Manual status
announcement review must record AT/browser/device/operator details separately.

For H-11/H-12 root can admit unchanged existing specs when their specific remaining
engine scope is needed; a new full run is not implied. Midnight/cross-zone hydration
needs a separate fixture suitability review and explicit host clock/timezone
contract before assigning source changes. Existing due/native and localized
calendar evidence should be retained rather than replaced with duplicate tests.
Root alone accepts criteria, integrates this single report and updates the ledger.

Checks actually performed in this assignment: clean baseline/worktree identity,
repository `rg` searches, source/contracts/spec/report reads, Git blob comparisons,
scoped Git diffs, retained JSON parsing and SHA-256 hashing, report relative-link
existence and whitespace review. No test filename was treated as a pass; no
historical run was called a current full matrix. Artifact paths are local retained
files and may be lost on later cleanup; hashes/reports do not replace missing raw
artifacts. No live/manual/device/AT results or host-system validation were inferred.
