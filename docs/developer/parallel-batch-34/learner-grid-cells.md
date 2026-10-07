# M-19 F4 learner grid cell composition

2026-10-07. Isolated managed worktree created and attached before edits at the
exact reviewed `codex/dev` baseline `4c9f859bad204a7d7fd2e3787aa6f293db268525`:
`/Users/thomashall/.codex/worktrees/batch34-learner-grid-cells/sg-ui`, branch
`codex/batch34-learner-grid-cells`.

Exclusive writes are LearnerClassesDataGrid, the new
[focused native spec](../../../tests/browser/inventory-learner-grid-cells.spec.ts)
and this report. Shared grid/controller/shell/models/adapters/Link and barrels
remain read-only. No other checkout, primary image-upload work, master acceptance,
CI permissions/secrets, release or publication state changed.

## Demonstrated correction

Course-name and Details menu routes interpolated raw course IDs while Continue
already encoded activity/fallback IDs. The regression on the unchanged source
failed for `course /?#% 日本`:

```text
Expected: /sections/course%20%2F%3F%23%25%20%E6%97%A5%E6%9C%AC/learner/me
Received: /sections/course /?#% 日本/learner/me
Test Files 1 failed; Tests 1 failed | 4 passed
```

This is a confirmed product destination defect within the owned allowlist.
Both Details routes now use one encoded path-segment builder. Ordinary IDs keep
their existing destination. The added composed unit case checks both destinations,
blank activity-ID fallback and exactly one host navigation on Details activation.
Red evidence is retained at `/tmp/batch34-learner-grid-red.log` and above; it was
not reclassified as an environment failure or weakened into a raw-path assertion.

## Focused native fixture

The [changed-state story](../../../src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.native.stories.tsx)
uses local host routing, translation and pagination adapters with no application
network. Eight cases (four each in light/dark) cover:

- Keyboard course-name/Details activation, exactly one route per activation,
  Escape/action dismissal and return to the row's trigger.
- Keyboard Continue for trimmed activity ID and blank-ID course fallback,
  real intercepted local popup destinations, null opener, no host route callback
  and trigger focus return.
- Live German header/menu/date replacement using browser Intl with UTC timezone,
  German unavailable fallback and English fallback replacement. Fixed browser
  clock is `2026-10-07T12:00:00Z`; historical due instant is
  `2000-02-02T12:00:00Z`. The expected browser due date/time uses the explicitly
  selected locale and timezone, without a library formatter oracle.
- Controlled learner server page requests through Enter/Space, exact callback
  count, rejected requests retaining old learner rows and accepted host rows
  replacing Details destinations. No shared sort/reset/shrink cases are repeated.

Runtime console/page errors are assertions. Popups are fulfilled by Playwright
only for the local launch route; no live host API is invoked.

## Validation and limits

Targeted checks follow [development validation](../react-aria-development-validation.md)
and the [batch30 M-19 review](../parallel-batch-30/inventory-acceptance-13-24.md).
Frozen dependency install passed (608 packages, lockfile unchanged). Install slot1
and light slot0 were acquired atomically with the unique owner token
`batch34-learner-grid-cells-8df289`; only owned slots are released.

Initial default-shell Node 26.5.0 unit/types/guards passed after the correction,
but supported-runtime evidence below uses Node 24.21.0 and pnpm 10.29.3:

- `pnpm exec vitest run src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.test.tsx`: passed (5/5 tests).
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check` and `pnpm tokens:check`: passed.
- `git diff --check`: passed before native handoff.

Fresh immutable Chromium validation is coordinator-owned. The committed head,
worktree and `tests/browser/inventory-learner-grid-cells.spec.ts --project=chromium`
are handed off for the browser pool; no independent heavy build/server/browser run
or copied scheduler configuration is used. Source reservation remains held until
that fresh proof completes. Firefox/WebKit remain batch-checkpoint pending.
No full `pnpm check`, Storybook build, packed-consumer or broad/manual/device/AT
acceptance is claimed by this task. M-19 remains HOLD and broader G gates stay open.
