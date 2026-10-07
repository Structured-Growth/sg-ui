# Batch 44: LinkUrlModal native host evidence (M-33)

Reviewed baseline: `3c31ee6daae917ad82fbd2bd882c203f381d75dd` (`codex/dev`).
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch44-link-modal-native/sg-ui`.
Unique branch: `codex/batch44-link-modal-native`.

Exclusive writes: LinkUrlModal directory, this report and
`tests/browser/inventory-link-modal.spec.ts`. Runtime implementation is unchanged;
no product regression has been demonstrated. Primary image-upload work, shared
Dialog/Menu and PageRichTextEditorSection remained read-only.

## Missing evidence and local host boundary

Read [batch 31 inventory review](../parallel-batch-31/inventory-acceptance-25-37.md),
[reviewed 71-unit link evidence](../parallel-batch-13/review-3.md),
[activation record](../parallel-batch-11/editor-link-activation.md), existing
[activation/paste browser source](../../../tests/browser/editor-links.spec.ts),
[dialog contract](../react-aria-editor-dialogs.md) and
[targeted validation policy](../react-aria-development-validation.md).
No repeated pure destination-policy cases or Link-only activation/paste suite.

New `NativeHostSelection` story keeps one local host selection owner. A native
pointer selection records the selected rich fragment before dialog activation.
Open/submit/close callbacks expose that snapshot and submit payloads. The host
accepts destination changes/removal, preserving strong/em children. It restores
its noneditable fragment selection after close without requesting keyboard focus;
the modal retains responsibility for trigger focus. The same mounted modal is
reopened to observe host values and discarded drafts.

Four browser cases (two light, two dark) assert invalid protocol/error association,
invalid-field focus, correction by URL Enter, exactly one submit, accepted edit,
blank-URL removal, rich children preservation, Cancel/Escape draft discard,
initial focus, trigger focus and native selection after closure, and reopen reset.
This is a local host callback/selection handoff fixture, not actual Lexical
edit/unlink command evidence. The fixture intentionally keeps the rich fragment
text fixed while accepting URL changes. Real editor implementation/selection fixes
require a separately reserved PageRichTextEditorSection successor.

## Observed validation and immutable browser handoff

Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`.
Atomic install/light leases were admitted at allowed slot roots and released only
when their owner token matched. Frozen install passed (608 packages; existing
ignored esbuild-script advisory). No foreign lease was removed.

- `pnpm exec vitest run src/components/LinkUrlModal/LinkUrlModal.test.tsx --maxWorkers=1`:
  passed, 1 file / 23 existing modal composition tests.
- `pnpm typecheck`: passed (includes the new story).
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed before commit.

Fresh Chromium is **pending coordinator immutable pool execution**. Focused args:
`tests/browser/inventory-link-modal.spec.ts --project=chromium --workers=1`.
The coordinator builds fresh static Storybook at the delivered exact head and
records tested-head/logs/outcome. Source/spec/report freeze after handoff until the
coordinator releases the snapshot. No independent browser run, Storybook build,
full check, packed consumer matrix, GitHub CI/title dispatch or heavy lock was used.
No fresh native pass is claimed by checked-in cases or existing historical records.

No failed test evidence arose in the observed light checks. A subsequent native
failure must retain its red log and be classified as product, fixture/driver/
expectation, environment or unclassified; changes to shared/editor files require
exclusive successor ownership. Firefox/WebKit remain pending batch checkpoint.
M-33 whole-row acceptance and broad E-06/E-07/U/X/R/Z, security, manual/device/AT
acceptance remain held. Coordinator alone integrates; no main/publication changes.


## Wave22 red evidence and bounded driver correction

Coordinator fresh shared candidate `e6270941ea8828d8868fef0798451a599a9db25f`
contained the original prepared head `f860c303a60f4e01d8e7ed475da19a8c9fc96d17`
with all owned files byte-identical, recorded in
`/tmp/sgui-batch45-candidate-source-attribution.json`. Candidate build/source
hashes stayed unchanged. Chromium returned **0 passed / 4 failed**, zero skipped
or flaky. Preserve evidence at
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/link-modal-native/evidence.json`,
with sibling `results.json`, `browser.log` and trace ZIPs.

All four failed in `selectRichFragment` before opening the modal: native selected
text was empty instead of `Course guide`. Inspected failure screenshot, trace
mouse coordinates and source DOM. The light trace begins mouseDown at x32/y77.6875
on the hyperlink first-glyph boundary, then drags to x133.203125. The story uses a
native anchor (draggable by default); the selection driver begins where link
rather than text dragging can start. Classification: **fixture/driver setup
failure**, with native link-drag diagnosis inferred from the starting hit target;
no modal product defect established. The four engine failures share this one
initial setup failure and never reached edit/unlink behavior.

Bounded correction changes only the driver: start four pixels beyond the rich
link in its containing paragraph whitespace and drag backward to the first
character's leading side using actual mouse down/move/up. No synthetic Selection
setup, content replacement, timeout relaxation, assertion removal or product
change. Exact selected text, host selection snapshots, submit counts, rich child
preservation and native return-focus assertions remain unchanged. Corrected
Chromium outcome is **pending a new coordinator immutable snapshot**; no unchanged
retry or independent browser/build/heavy run. Original red artifacts remain intact.

Corrected spec discovery under Node24 and an admitted/released light lease:
`pnpm exec playwright test tests/browser/inventory-link-modal.spec.ts --project=chromium --list`
passed, exactly four cases. This parses/discovers tests without launching browsers
or a server. Whitespace/clean-head checks passed; source/story unchanged, so the
previous units/types/guards remain attributed to original prepared content.
