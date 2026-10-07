# M-13 F1 parent resize and slot replacement

Reviewed baseline: `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Attached managed worktree: `/Users/thomashall/.codex/worktrees/frame-resize-native-f1/sg-ui`.
Branch: `codex/frame-resize-native-f1`. Source remains reserved pending actual
coordinator Chromium proof. No whole M-13/master gate is upgraded.

## Bounded addition

[Batch30 inventory](../parallel-batch-30/inventory-acceptance-13-24.md) identifies
combined flex/grid parent resizing and header/footer media as missing evidence.
[Batch10](../parallel-batch-10/card-frame-reflow.md) already proves direct width
transitions, static narrow/enlarged cards and body media. Its 10 Chromium/WebKit
passes and Firefox limits are historical evidence, not a fresh pass here.

Two new [stories](../../../src/components/ClassCardFrame/ClassCardFrame.stories.tsx)
use a host sidebar with native flex/grid sizing. One persistent footer action
changes parent width and replaces surrounding header/footer content together:
portrait media in expanded header becomes landscape media in compact footer,
then returns. The body, frame and action retain DOM identity. Long text uses
owned Typography and the shared theme; SVG images are self-contained img sources.
No production implementation/API/styles changed; no product defect demonstrated.

The [focused spec](../../../tests/browser/inventory-card-frame-resize.spec.ts)
has eight cases: flex/grid × light/dark × narrow viewport/200% root text. Each
asserts real parent-derived width at the existing 420px cap, actual shrink/restore,
loaded media with intrinsic 2:3/2:1 ratios, slot/document overflow, exactly one
keyboard callback per Enter/Space activation, retained body/frame/action identity,
native focus and viewport hit testing after replacement. It does not manually
scroll or refocus to repair visibility after activation.

## Validation and handoff

Runtime: bundled Node 24.19.0, pnpm 10.29.3, Vitest 4.1.11.
Light validation acquired `/tmp/sgui-light-validation-slots/slot0` atomically with
a unique token, verified token ownership on release, and ran sequentially:

- `pnpm exec vitest run src/components/ClassCardFrame/ClassCardFrame.test.tsx --maxWorkers=1`: 4/4 passed.
- `pnpm typecheck`: passed, including final story sizing adjustment.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed owned import/layer/token checks.
- `git diff --check`: passed.

Installation was needed in the new checkout. The attempted atomic install-slot
acquisition lost a race (`FileExistsError` on slot1), but a shell command sequencing
mistake allowed `pnpm install --frozen-lockfile` to run anyway; it completed in
2.3s with no tracked lockfile/dependency changes. This is a coordination error,
not a product/test failure. No other owner's token or slot was modified/released.
Future chained operations must stop when acquisition fails.

No heavy build, browser server or browser test ran in this worker. Fresh immutable
pool Chromium validation is **pending**, not passed. Coordinator command:
`pnpm exec playwright test tests/browser/inventory-card-frame-resize.spec.ts --project=chromium`.
The final clean commit/head is delivered with the worktree to coordinator chat
`01a1164f-41db-7f30-aaf9-f20133b6566f`. Firefox/WebKit await the coordinated batch
checkpoint. Any failing pool attempt must remain recorded and be classified as
product, fixture/driver/expectation, environment or unclassified before correction.

Native full-browser zoom, physical devices, arbitrary host-slot combinations,
visual/manual inspection and spoken assistive technology remain unverified.
The automated root text enlargement is not browser zoom. No full pnpm check,
Storybook build, CI/title dispatch, main merge, publishing, secrets/permissions,
shared primitive or consumer changes occurred. Coordinator owns integration and
acceptance decisions; outside-source fixes need a separately reserved successor.
