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
compositions, native Tab focus-visible outline, retained link identity/focus during
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

Chromium native execution is pending coordinator evidence. Firefox/WebKit are
pending the batch checkpoint. No native acceptance is inferred from unit/type
passes. Physical device/touch, zoom beyond this enlarged-text fixture, spoken AT,
broader locale/host composition and U/X/R/Z acceptance remain open. M-14 owner
acceptance and disposition of historical menu/date/icon clauses remain with the
coordinator; this report neither invents those contracts nor closes the row.
