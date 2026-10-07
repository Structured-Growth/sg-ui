# Batch 10 card frame reflow

Task: bounded M-13/U-02. Status: bounded Chromium/WebKit responsive acceptance passed; broader gates remain open.
Baseline verified clean at `061a88233f40ebaf4ce554c0add18b2e4af56424` before edits.
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch10-card-frame-reflow/sg-ui`.
Branch: `codex/batch10-card-frame-reflow`; draft PR base: `codex/dev`.
Draft PR: [#31](https://github.com/Structured-Growth/sg-ui/pull/31).
Implementation head: `d31e5d3ac6e3931b3050e493f67d3854cd1b61b5`.
Fresh Storybook/browser tested head: `81ab206a6864a2d583d117dfb69bc5a3dda459aa`
(includes width-transition image-ratio assertions and screenshot attachments).
Final report commit follows this implementation commit; its exact final head is
reported to the coordinator and is the draft PR branch head.

## Changes and preserved contract

Changed files: [frame CSS](../../../src/components/ClassCardFrame/ClassCardFrame.module.css),
[stories](../../../src/components/ClassCardFrame/ClassCardFrame.stories.tsx),
[unit tests](../../../src/components/ClassCardFrame/ClassCardFrame.test.tsx),
[focused browser cases](../../../tests/browser/batch10-card-frame-reflow.spec.ts)
and this report. Learner/Instructor implementation and shared styles remain read-only.

The frame previously clipped intrinsic-width images through root overflow without
constraining the image itself. Slot images now have maximum inline size 100% and
auto block size, preserving their intrinsic ratio. Raw long slot labels wrap, and
minimum inline size zero permits the frame/slots to shrink in flex/grid contexts.
This is frame-local CSS, without public API changes or a new typography contract.
Host native styles retain normal cascade precedence. Images with deliberately
fixed/cropped dimensions should use host styling appropriate to that content.

Preserved: 420/360 exported constants, default maximum 420, custom pixel width,
root native style precedence, required header/body containers, optional falsy
footer omission, image alt/src/width attributes, theme tokens and public names.
No host fetching, routing or persistence behavior was introduced.

Stories exercise default/360/500/native-style-280 widths, long raw and Typography
labels, a self-contained 1200×600 image, empty slots, absent footer and same-frame
width transitions. New browser cases assert light/dark scope, actual frame width,
slot overflow, image loading/aspect ratio, focus visibility and DOM identity.
Narrow 320px and automated root text enlargement are separate conditions; they
do not represent browser chrome zoom, physical devices or spoken AT acceptance.

## Targeted validation

Runtime: macOS arm64, bundled Node `v24.19.0`, pnpm `10.29.3`, React `19.2.3`,
Playwright `1.63.0`. Commands use:
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed; no lockfile/dependency changes.
- `pnpm exec vitest run src/components/ClassCardFrame/ClassCardFrame.test.tsx src/components/InstructorClassCard/InstructorClassCard.test.tsx src/components/LearnerClassCard/LearnerClassCard.test.tsx`: passed, 3 files/10 tests, including a final run after the CSS changes.
- `pnpm typecheck`: passed, production source and stories.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed, including final browser assertions.
- `pnpm foundations:check`: passed owned import/layer/token boundaries.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Initial atomic mkdir acquisition of `/tmp/sgui-parallel-batch-01-validation.lock`
failed because owner `01a1167a-e25f-7c62-a2b4-126127c725ab` held it. The coordinator
then explicitly directed this chat to wait in the priority queue and finish native
validation. This chat waited in 45-second intervals without disturbing the owner,
and acquired the lock only after becoming first and the previous owner released it.

- `pnpm build-storybook`: passed, fresh build at `81ab206` before the suite.
- `pnpm exec playwright test tests/browser/batch10-card-frame-reflow.spec.ts --project=chromium --project=webkit`: passed, **10/10**, 7.7 seconds, one worker; no Storybook rebuild during the suite.
- Captured all eight light/dark and narrow/enlarged representative frame screenshots;
  visually reviewed Chromium/WebKit narrow light and enlarged dark examples. Labels
  wrap without clipping, images retain 2:1 proportions and footer actions remain
  visible. Geometry/focus assertions cover all four populated width states.

Local ignored artifacts: `artifacts/browser-results.json`,
`artifacts/browser-report/index.html` and its eight `data/*.png` attachments.
Build log: `/tmp/batch10-card-frame-storybook.log`; focused run log:
`/tmp/batch10-card-frame-browser.log`. Build emits existing Vite directive/sourcemap
and chunk warnings; it completed successfully. The focused cases reported no page
runtime errors. This is no claim of a full browser or accessibility suite pass.

After the suite and visual review, Python verified the lock owner and FIRST queue
entry matched this chat, removed only that queue entry with atomic file replacement,
then rechecked ownership and released only its own lock. Other worktrees were preserved.
Firefox remains unverified under the existing local launch/profile prerequisite;
no repeated launch, reinstall or TMPDIR workaround was attempted.
No routine full check, full browser matrix, consumer suite, GitHub rerun/dispatch
or workflow change occurred. Automatic dev CI/title runs remain user-paused.

## Follow-up and central guidance suggestions

Next bounded task: extend native slot coverage to host-supplied header/footer
media and composed flex/grid parent resizing if complete arbitrary-slot acceptance
is required. Firefox must wait for the separate runtime prerequisite repair.
Physical-device, actual browser zoom and spoken AT matrices remain separate.

Coordinator may link this report from the inventory's M-13 row and card-frame
contract as exact-head Chromium/WebKit evidence for default/360/custom/native-style
widths, optional slots, images, long labels and enlarged light/dark layouts. Retain
the broader inventory hold for unverified engine/device/AT and arbitrary host-content
matrices; do not close U-02 or broad U/X/R/Z gates from this bounded pass.
No out-of-scope consumer defect was identified in the focused unit checks.
