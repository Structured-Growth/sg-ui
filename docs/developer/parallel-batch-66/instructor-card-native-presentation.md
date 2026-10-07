# Batch 66 instructor card native presentation

M-14 bounded evidence; exact assigned base `fc4f9fca9be4aaace869f0944baccaeed921e5b8`.
Managed isolated worktree:
`/Users/thomashall/.codex/worktrees/batch66-instructor-card-native-presentation/sg-ui`.
Branch: `codex/batch66-instructor-card-native-presentation`.

## Preserved scope

Read root AGENTS, README, migration/component/target architecture, development
validation, the [card contract](../react-aria-card-frames.md) and
[preserved instructor reconciliation](../react-aria-inventory-contract-reconciliation.md#m-14-instructor-course-presentation-card)
before edits. No nested AGENTS exists. The card has required presentation strings,
count, four statuses and one actionHref. There is no menu, persistence callback,
date parser, locale input, dynamic icon or image API. No public API or runtime
implementation changed. Blank and literal invalid host labels remain literal;
the fixture demonstrates host-owned missing/invalid date fallback presentation.
Unknown statuses and undefined required props are outside the preserved contract.

## Added evidence

[Colocated tests](../../../src/components/InstructorClassCard/InstructorClassCard.test.tsx)
now have 21 cases (18 added): all four translated status labels/tone markers and
archived metadata omission; six known Class/Section action aliases and a custom
host action; actual translated status/activity/action/interpolation/namespace;
zero learners; blank, literal Invalid Date and host fallback activity labels;
native Intl host dates for en-US/de-DE/ar-EG with fixed instant and explicit
America/Chicago timezone; failed-lookup English fallbacks; decorative icons and
fixed HE avatar with no image role; existing keyboard navigation and SSR.

[Composed story](../../../src/components/InstructorClassCard/InstructorClassCard.stories.tsx)
uses the existing host routing adapter and status/activity updates with one stable
link. Host date formatting uses native Intl, fixed `2026-01-01T15:05:00Z`, de-DE,
and explicit America/Chicago. No current clock, external service or auth involved.

[Focused browser spec](../../../tests/browser/batch66-instructor-card-native-presentation.spec.ts)
contains three cases: light/comfortable/16px and dark/compact/32px narrow host
compositions, native Tab focus-visible outline plus strict whole-link viewport/card containment
and center hit testing after Tab and every status update/Enter; retained link identity/focus during
all four status changes, exactly one host route request per Enter, complete
heading/text reflow, decorative icons and avatar, and native Intl date plus host
missing/invalid fallback updates retaining focus. It pins browser locale/timezone
and clock. The date expectation independently reads native browser Intl while
also requiring the known German local date/hour/minute. Generic frame width,
resize/slot geometry and learner ICU/activation matrices remain separately owned.

## Local validation

Node 24 via `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
`pnpm install --frozen-lockfile` passed under atomically acquired install slot1,
released after installation. Light checks used atomically acquired light slot1,
released after checks; no foreign slot cleanup. Logs install at
`/tmp/batch66-instructor-install.log`.

- `TZ=America/Chicago pnpm exec vitest run src/components/InstructorClassCard/InstructorClassCard.test.tsx --maxWorkers=1`: **21/21 passed**, 1 file.
- `pnpm exec tsc --noEmit`: passed source/story types.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed browser types; repeated after final text reflow assertions.
- `pnpm foundations:check`: passed owned import/layer/token guards.
- `git diff --check`: passed; exclusive allowlist reviewed.

No independent full check, build, Storybook build/server, browser, consumer,
GitHub CI/title dispatch, PR, merge, publish or master/canonical update was run.
Coordinator owns candidate attribution, one fresh Storybook build and focused
Chromium proof before provisional integration. Scoped browser selection:

```sh
pnpm exec playwright test tests/browser/batch66-instructor-card-native-presentation.spec.ts --project=chromium
```

Chromium native execution passed the coordinator wave30 candidate as recorded
below. Firefox/WebKit remain pending the batch checkpoint. These focused passes
do not imply full native acceptance. Physical device/touch, zoom beyond this enlarged-text fixture, spoken AT,
broader locale/host composition and U/X/R/Z acceptance remain open. M-14 owner
acceptance and disposition of historical menu/date/icon clauses remain with the
coordinator; this report neither invents those contracts nor closes the row.

## Bounded source admission correction

Coordinator review found that focus/outline alone could pass a clipped control.
The focused spec now polls positive whole-control bounds within both viewport and
card, center `elementFromPoint` hit on the link/descendant, focus-visible state and
solid nonzero outline after real Tab and each status update/Enter. It allows native
keyboard scrolling to settle while adding no synthetic reveal/scroll. Predecessor
focus is explicitly setup; the date case's direct focus proves retention only.
This correction changes only the scoped browser spec and report. Browser types
passed again; no independent browser run or component/model/API changes.

## Coordinator fresh Chromium proof

Worker source head: `be3060abf7868a2af117f2f31020ea17f986cfd8` (includes the
strict whole-control containment/hit-test correction). Actual tested wave30
candidate: `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`, source tree
`b468c7d33f618c07690fc81cb362a8653df83c2a`. This is attributed candidate evidence,
not an independent browser run on the worker checkout.

Coordinator built static Storybook once, then ran the exact anchored selection:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/batch66-instructor-card-native-presentation\.spec\.ts$' --project=chromium
```

**3/3 Chromium cases passed**: light/comfortable/16px native keyboard route/focus;
dark/compact/32px native keyboard route/focus with complete viewport/card bounds
and center hit; native Intl date and host missing/invalid presentation retention.
Browser log reports 4.3 seconds; supervisor command duration 5545.425ms. Node
24.19.0, pnpm 10.29.3 and Playwright 1.63.0. Shard slot6/port6619 ran against
build digest `6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`.
Candidate head, source digest and build digest remained immutable through the run;
owned commands settled and locks were released. The overall root snapshot was
incomplete because of an unrelated pointer scope; this instructor shard is green.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/evidence.json`.
Shard log/results/evidence:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/instructor-card-native-presentation`.
Attribution: `/tmp/sgui-batch45-candidate-wave30-attribution.json`.
Read-only verification matched all four frozen worker file digests to attribution
before this report-only update. Every implementation/story/unit/spec byte remains
unchanged. No redundant browser/build/test reruns. Coordinator integrates the
individual reviewed worker history, never the full candidate.

Firefox/WebKit checkpoint, physical device/touch, spoken AT, wider zoom/locale/host
compositions and broad U/X/R/Z gates remain pending. This focused Chromium result
does not close M-14 or dispose of historical menu/date/icon requirements.
