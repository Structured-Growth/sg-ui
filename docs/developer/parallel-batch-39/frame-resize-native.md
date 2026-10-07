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
native focus and viewport hit testing after replacement. It checks action containment inside the frame before native PageDown document
scrolling when replacement content extends below the viewport; it never refocuses
or programmatically scrolls to repair visibility.

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


## Wave21 red evidence and bounded correction

Coordinator ran the fresh immutable Storybook at exact head
`979fd9e27bec6dd3535a8b72454ade0e91427d67`, Node 24.19.0, Chromium:
**4 passed / 4 failed**, zero skipped/flaky. All normal-text cases passed; all
200% cases failed the automatic viewport visibility assertion after compact
replacement. Original artifacts remain untouched at
`artifacts/browser-pool/b125558a-78ce-4928-a470-2d973047b1a0/` (evidence.json,
results.json, browser.log and traces). Initial/final heads were clean and equal;
initial/final build digests both
`b70033709af168530f08e9c2e4a75001b4ef80def97311f83129524f5d4fd54f`.

Classification: **fixture/expectation defect**, not an established frame defect.
The trace preserves document scroll top 417 after Enter/compact replacement while
retained-focus, DOM identity, loaded media, ratio, real width and slot-overflow
assertions already passed. The light enlarged failure screenshot shows the long
heading occupying the viewport and continuing vertically into the body; the
footer action lies farther down the ordinary host document. A presentation frame
with arbitrary slots owns neither document scrolling nor refocusing host content.
Expecting it to keep arbitrary taller replacement content wholly inside the same
viewport automatically imposes an undeclared scroll-management contract.

Corrected test keeps the same viewport, text enlargement, long content and all
geometry/callback/identity assertions. It additionally checks the complete action
bounds fit inside the frame, then permits at most eight native PageDown presses
only while viewport visibility is absent. Each must advance host document scroll
and preserve action focus; final whole-action bounds/hit testing still must pass.
No locator scrollIntoView, programmatic scrolling, refocusing or product/style
change is used. The next Space activation still tests the retained action and
restores expanded geometry. This validates keyboard-reachable visibility under
host scrolling rather than asserting automatic scroll repair by ClassCardFrame.
Corrected native results are **pending** until a new coordinator pool run.

Correction-only validation: `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`
and `git diff --check` passed under atomic token-owned light slot1, released after
owner verification. Source/story/production code was unchanged in this correction;
no unit rerun or heavy/native command occurred.
