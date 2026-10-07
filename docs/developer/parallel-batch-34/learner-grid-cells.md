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

## Wave21 Chromium red evidence and bounded driver correction

Coordinator wave21 tested clean exact head
`f38dc0315a13dbb542f5ee2dbf0853148e28f022` with unchanged initial/final build digest.
Chromium: **4 passed / 4 failed**, zero skipped/flaky. The live-locale and
controlled request cases passed in both themes. Initial source remains unchanged
through the correction below, including the proven encoded-ID product fix.

Preserved evidence directory:
`artifacts/browser-pool/241329c9-c672-4540-8835-b874d397fe2c/`, including
`evidence.json`, `results.json`, `browser.log` and per-case traces/screenshots/
error contexts. These ignored local artifacts are not checked-in CI artifacts.

Distinct failed points were light course-link Enter leaving routes `0: none`,
dark Details dismissal not focusing the trigger, light Continue dismissal not
focusing the trigger, and dark Continue absent at the focus assertion. The dark
Continue snapshot showed the fallback row focused/selected before menu entry,
while the light link trace showed the course row selected by Enter. Read-only
inspection of React Aria `useGridCell` confirms that programmatic child focus
while keyboard focus is visible intentionally skips the pointer focused-key
update. Initial tests used `locator.focus()` from outside the grid, then dispatched
Enter before asserting the actual child focus; Continue sent ArrowDown before
asserting initial menu-item focus. Those are confirmed driver readiness gaps;
whether they explain all restoration failures remains provisional pending rerun.
No shared Grid/Menu product defect is established, and neither source is edited.

Spec correction enters the ID cell by real pointer, then ArrowRight with asserted
link focus before Enter. Menu tests establish native pointer collection entry,
Escape with asserted trigger restoration, then keyboard Enter with asserted
Details focus before ArrowDown. Popup wait now belongs to the actual launching
page (`page.waitForEvent('popup')`), and the source page is brought to the foreground
after popup close before asserting trigger restoration. All route-count, encoded
URL, null-opener, callback and focus-return assertions remain; no forced click,
synthetic event, inserted sleep, app-focus mutation or production change is used.
Failures now attach read-only actual `document.activeElement`/`document.hasFocus`
diagnostics, so a residual restoration failure can be classified precisely and
reserved for an exclusive shared-source successor if required.

Node24.21.0 focused browser TypeScript passed after the spec edit; no unchanged
unit/source check rerun was needed for this spec/report-only correction.
`git diff --check` passed. Atomic owned light slot0 was released. A new clean
committed head is handed to the coordinator for fresh immutable Chromium proof;
this is a changed-driver validation, not an unchanged retry. Source scope remains
reserved, M-19 HOLD, and Firefox/WebKit remain checkpoint pending.

## Final focused Chromium proof and handoff

Coordinator wave22 executed the separately managed shared candidate
**`e6270941ea8828d8868fef0798451a599a9db25f`**, not worker head
`6544c172268916d24d0f3576c9acaa85bd62706d`. Fresh static Storybook and browser
TypeScript were built/checked once before ten disjoint shards under Node24.
The learner shard ran on slot1/port6314 with focused command:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-grid-cells\.spec\.ts$' --project=chromium
```

**Learner result: 8 passed / 0 failed, zero skipped/flaky**, including all four
cases in both themes. Playwright results show `expected: 8`, `unexpected: 0`,
`skipped: 0`, `flaky: 0`, duration 8544.912ms. Shard supervisor duration was
9967.320667ms (2026-10-07 16:45:02.775Z–16:45:12.742Z).
The root session is **failed** due to other shards; this report claims only the
learner shard's pass, not a successful entire wave.

Evidence is retained in the candidate worktree:

- `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/learner-grid-cells/evidence.json`
- Adjacent `results.json` and `browser.log`, plus root `evidence.json`.
- Exact attribution file `/tmp/sgui-batch45-candidate-source-attribution.json`.

Root initial/final heads are both the candidate SHA above; initial/final build
SHA256 is unchanged:
`2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.
The worker independently read the shard/root/results/attribution evidence and
verified SHA256 of all five attributed worker files against both its prepared
head and the candidate checkout. Relevant tested file digests:

| File | SHA256 |
| --- | --- |
| LearnerClassesDataGrid.tsx | `825d8a1d9de34de220997e0afe1ccefc63e03f72366af7cf58c9b37489db1c99` |
| LearnerClassesDataGrid.test.tsx | `f243555780278fa41b7536f0cc1c4b980669f34c7241ee70d583a84eb7ac2edd` |
| LearnerClassesDataGrid.native.stories.tsx | `498605566cf8b7f9a17373138e8fd0e7019d19b9022301fd32c90edcb47d5fb1` |
| inventory-learner-grid-cells.spec.ts | `e96f5cae1ae3dbde14f06f4406ff0d34c0efe29182ea973f3605be40b7a3b935` |

The correction changes only driver/report; runtime and fixture are byte-unchanged
from wave21. All former failing route and focus assertions pass after native entry,
readiness and foreground ownership corrections. Wave21's four native failures are
therefore resolved as driver entry/readiness/ownership failures for this bounded
composition, with original red evidence preserved. They do not establish a shared
Grid/Menu product defect or environment capacity failure. The separate raw-ID
routing product defect remains proven by the original unit red and corrected
unit/native destinations.

Coordinator released the freeze for **report-only** finalization. No source,
story, unit or spec bytes changed after prepared head `6544c17`; no tests/builds
were rerun for this evidence-only edit. Final documentation whitespace/scope checks
pass. This completes the assigned Chromium-first slice and releases its source
reservation for coordinator review/integration. Only the coordinator integrates
history into `codex/dev`; no worker dev/main push or publication occurred.
Firefox/WebKit remain checkpoint pending; M-19 and broad G/manual/device/AT
acceptance remain open. The browser proof supplies provisional development
integration evidence, not whole-row acceptance.
