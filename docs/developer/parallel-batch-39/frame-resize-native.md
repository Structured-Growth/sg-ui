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

## Wave22 attributed Chromium proof and final handoff

**Bounded Chromium slice passed: 8/8**, zero failed/skipped/flaky. Browser execution
ran the separately managed shared candidate
`e6270941ea8828d8868fef0798451a599a9db25f`, **not** worker head
`9b3ba7ecdb7e807e8641f1b683bdf9794c8ba9ab`. Coordinator source-byte attribution
`/tmp/sgui-batch45-candidate-source-attribution.json` maps that prepared worker head
to the candidate. This worker independently checked all three recorded SHA-256
file digests before the report-only finalization; all matched:

- Story: `0506c46997f5d8bfbf668b3e0df9147526e845fbd0d98fab4d0778ddf66f97dd`.
- Spec: `b74946c62db8b75e7b6cf856dce4e0bd4b66a28201ac6cd2ec12861abd960565`.
- Prepared report: `02b67c4ded622599a5ba03bfb13c08c48348b7703382ce6ee8a2231e71d972a7`.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/`.
Read `frame-resize-native/evidence.json`, `frame-resize-native/results.json` and
root `evidence.json`. Shard status passed; results stats expected=8, unexpected=0,
skipped=0, flaky=0, duration 9131.874ms. Node 24.19.0; shard port6317/slot4;
execution selection was the anchored `inventory-card-frame-resize.spec.ts` spec
with `--project=chromium`. Fresh shared Storybook and browser types built once
before isolated shards. Candidate initial/final head agrees, final Git status
empty; source digest initial/final
`d4c78b7a57d00a53a63a75fe5090b4b24c8681b532a5ba51c663a60049a2d9f0`,
build digest initial/final
`2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.
The overall shared wave status is failed because other shards failed; this report
claims only the verified eight frame cases, not a whole-candidate pass.

The original Wave21 four failures remain preserved above. Corrected proof confirms
frame-contained action, native host-scroll reachability with retained focus,
shrink/restore, slot replacement and media ratios across both layouts/themes/text
conditions. No product change was needed. This final commit changes this report
only; story/spec bytes are unchanged from the attributed prepared head. No checks
were repeated during finalization beyond report/diff and source attribution review.
Coordinator alone reviews/integrates history. Frame source reservation can be
released after coordinator review; Firefox/WebKit remain checkpoint pending.
M-13 and broader manual/device/AT/zoom acceptance remain open.
