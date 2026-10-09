# Button owned callback source repair

Assignment: `post100-button-callback-fix`; affected criteria `T-P09-90` / `T-P07-01` remain coordinator-owned. No F/T/parent acceptance is marked here.

Baseline: `b298f20796540224daac1eb1ef71f63423d6b533`. Source commit: `8260462` (`fix!`: runtime callers no longer receive an undocumented upstream event). Only Button.tsx and this report are production/report writes.

Ordinary Button forwarded React Aria PressEvent despite its documented `onPress?: () => void`. The ordinary press path now invokes a closure with zero arguments. Missing callbacks remain undefined; submit/reset capture, pending/disabled handling, native refs, props, styles and slots are unchanged. AppButton inherits the correction. Public declarations expose no upstream event type.

The independent diagnosis is retained in `next100-primary-regression-blockers-review.json` under the coordinator evidence directory. Historical red at `82167606602a3551d9cd5a43484ee24338835765` remains intact: 1 failed / 1 passed, zero-argument composition assertion received PressEvent. Earlier red at `0d2cd7b28a4ed2189cbfc0281ce8d2d6ba16b4e3` remains 1 failed / 0 passed. No assertion was weakened, copied into a new test, or edited.

Testing-only checkout `/private/tmp/sgui-post100-button-testing` was created at source commit 8260462, then composed the existing p09 test commits 0d2cd7b and 821676 unchanged. Tested head: `78b37f1fc5ec536cdb2d61437b8c72eba9f12021` (testing history only; do not integrate those cherry-picks from this successor). The sole test delta from source head is the original 85-line ButtonGroup regression file.

Retained regression SHA256: `f109bdb522fbcde99b8757138ef4cbef9559a983e29924bb5cb8a7a5da018d7e`, identical to original 821676. Corrected Button SHA256: `7e8c5fedd9d6e44aca0f8f5dbf178abb550fdfe7a81fc04c94cfd9724ba6d87b`.

Node executable: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`, v24.21.0; pnpm 10.29.3, React 19.2.3, Vitest 4.1.11. Frozen install, unit/composed tests, types, foundation and token guards all passed. Units: 4 files / 15 cases, no failures/skips. Existing cases verify pointer/Enter/Space, refs, pending/disabled, native submit/reset ordering, SSR slots/attributes and group interactions; retained child zero-argument assertion is green.

No changed visual/state API requires a new story: existing Button NativeFormTransitions already covers host callback replacement and pending/disabled transitions. Exclusive story/test ownership was preserved.

Every command acquired actual canonical atomic light4/install2 claims and transitional aliases before launch via existing browser-validation-pool helper. Null acquisition fails closed. Every process group settled, final owned processes were empty, and both owner-matching claims were released. No acquisition failures, test failures or unsettled attempts occurred in this successor; foreign owners were preserved.

Complete logs, resource samples and command receipts retained in `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence`. SHA256 below authenticates each raw log; corresponding `.resources.json` and `.receipt.json` contain all input hashes, exact head, times, owner, executable and settlement.

## install

Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.mjs install --frozen-lockfile`

Outcome: passed; exit 0; settled True. Start `2026-10-09T00:33:30.926Z`, released `2026-10-09T00:33:38.389Z`.

Owner `post100-button:06c05676-001c-4758-95f0-fad1bfa6b5c8`; canonical `/tmp/sgui-install-slots/slot0`, alias `/tmp/sgui-install-slots/slot-0`.

Log `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence/sgui-post100-button-install.log`; SHA256 `11f815d71ae996edb6b0cdba1dfbfa4af002f79a129388ae7e83641c032aa8d9`.

## units

Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node node_modules/vitest/vitest.mjs run src/experimental/Button/Button.test.tsx src/components/AppButton/AppButton.test.tsx src/experimental/ButtonGroup/ButtonGroup.test.tsx src/experimental/ButtonGroup/ButtonGroup.next100-regression.test.tsx --maxWorkers=1`

Outcome: passed; exit 0; settled True. Start `2026-10-09T00:33:41.003Z`, released `2026-10-09T00:33:45.721Z`.

Owner `post100-button:967bf6d0-93ee-488c-8145-8b11deb449e7`; canonical `/tmp/sgui-light-validation-slots/slot1`, alias `/tmp/sgui-light-validation-slots/slot-1`.

Log `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence/sgui-post100-button-units.log`; SHA256 `359101167648d48e8e889ca0c41a09af45b0f78b34e760a44e58d24c5076825f`.

## types

Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node node_modules/typescript/bin/tsc --noEmit`

Outcome: passed; exit 0; settled True. Start `2026-10-09T00:33:46.003Z`, released `2026-10-09T00:33:54.257Z`.

Owner `post100-button:c1a0d3dd-0154-4d3e-91d7-518d7ef2b993`; canonical `/tmp/sgui-light-validation-slots/slot1`, alias `/tmp/sgui-light-validation-slots/slot-1`.

Log `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence/sgui-post100-button-types.log`; SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## foundations

Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node scripts/check-foundations.mjs`

Outcome: passed; exit 0; settled True. Start `2026-10-09T00:33:54.336Z`, released `2026-10-09T00:33:55.470Z`.

Owner `post100-button:ea408c87-09ce-457a-b208-98ae42a7092a`; canonical `/tmp/sgui-light-validation-slots/slot1`, alias `/tmp/sgui-light-validation-slots/slot-1`.

Log `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence/sgui-post100-button-foundations.log`; SHA256 `91ae87aafa42b6d52479120b5e5d041d0efba241063d18f6fd72725a380b381e`.

## tokens

Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node scripts/tokens.mjs --check`

Outcome: passed; exit 0; settled True. Start `2026-10-09T00:33:57.954Z`, released `2026-10-09T00:33:58.091Z`.

Owner `post100-button:53d098c9-c398-41e4-9a8f-dbc3767c295a`; canonical `/tmp/sgui-light-validation-slots/slot3`, alias `/tmp/sgui-light-validation-slots/slot-3`.

Log `/Users/thomashall/.codex/visualizations/2026/10/09/01a11e13-9fbd-7b83-94f5-398cf64c126b/button-callback-evidence/sgui-post100-button-tokens.log`; SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Fresh Chromium native evidence is pending with root before dev integration; Firefox/WebKit, physical device and AT remain pending. No Storybook build, browser/matrix, packed consumer or full check ran. No dev/main merge, push, publication, workflow change, central backlog/state edit or new agent. Source and testing worktrees are clean; only this final report is added after checks. Root alone reviews/integrates the successful source history.
