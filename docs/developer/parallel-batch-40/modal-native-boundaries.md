# M-08 modal native boundaries

Baseline: `3c31ee6daae917ad82fbd2bd882c203f381d75dd`, reviewed `codex/dev`.
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch40-modal-native/sg-ui`.
Branch: `codex/batch40-modal-native-boundaries`.
Exclusive writes: `src/components/AppModal/`,
`tests/browser/inventory-modal-boundaries.spec.ts`, this report.
Shared experimental Dialog/Modal and AppShell source remain read-only.

The [batch29 inventory review](../parallel-batch-29/inventory-acceptance-02-12.md)
holds M-08 for removed-trigger recovery and native size/custom-chrome combinations.
The existing [nested dialog spec](../../../tests/browser/batch01-dialogs.spec.ts)
already covers surviving openers, topmost dismissal, standard twenty-field tabbed
scrolling and short enlarged-text light/dark forms. Those completed cases are not
copied into this new slice.

## Added evidence

[Stories](../../../src/components/AppModal/AppModal.stories.tsx) remove a nested
child opener while the child remains open, after native focus capture. One branch
leaves recovery to the owned focus scope; another host explicitly focuses a
surviving parent input during dismissal. The browser spec checks Escape, outside
pointer and close-button dismissal, focus after deferred restoration, parent
containment and final surviving outer-opener restoration: six cases.

Medium and large stories combine their corresponding height presets, custom
header help, custom footer actions and twelve fields in owned tabs. Six native
cases cover 320x640 normal text, 640x320 enlarged text and 320x320 enlarged text.
Assertions require complete focused-control bounds and center hit testing for
initial focus, every field, custom footer/header controls and tab switching;
dialog/surface horizontal overflow is rejected. Enlarged text uses 200% root size
and explicit line/letter/word spacing. It is not actual browser zoom or device proof.

One new composed unit case verifies removed-opener dismissal preserves the
host-selected parent destination, containment and final outer restoration. No
runtime implementation or shared styling was changed: no product regression has
yet been established by this worker.

## Observed validation

Node `24.21.0`, `pnpm install --frozen-lockfile` passed. First install admission
at slot0 failed (occupied); exited before any install. Slot1 was then atomically
acquired; released only the matching worker token. Light validation atomically
acquired an available slot0..3 and released its matching token in finally.

All commands below passed on the prepared source/spec tree:

- `pnpm exec vitest run src/components/AppModal/AppModal.test.tsx src/experimental/Dialog/Dialog.test.tsx --maxWorkers=1`: 2 files, 12 tests.
- `pnpm typecheck`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`.
- `pnpm foundations:check`.
- `pnpm tokens:check`.
- `git diff --check`.

Logs: `/tmp/sgui-b40-modal-install.log`, `/tmp/sgui-b40-modal-light-{0..4}.log`.
Native execution is pending the coordinator immutable pool. Requested arguments:
`pnpm exec playwright test tests/browser/inventory-modal-boundaries.spec.ts --project=chromium --workers=1`.
The coordinator must freshly build the committed snapshot and run Chromium first;
this worker did not independently build/run heavy/browser validation. Source,
spec and report freeze at the handoff commit until that run finishes.

No native failures or fresh native pass are claimed before execution. A failure
must retain its original evidence and be classified as product, fixture/driver/
expectation, environment or unclassified; a genuine shared Dialog/Modal fix needs
an exclusively reserved successor, not edits in this scope. Firefox/WebKit await
batch checkpoint. Broad/manual/device/AT and whole M-08 acceptance remain held.
Coordinator alone integrates and updates acceptance records.

## Pre-admission fixture correction

Coordinator read-only review identified that the dismissal status was outside
the parent modal while the spec queried its accessible status role with that
parent still open. Modal accessibility correctly hides such background content.
Moved the fixture status into the surviving parent dialog; control focus,
visibility and restoration assertions are unchanged. This is a fixture mismatch
found before browser admission, not an observed native or product failure.

Node 24.21.0 targeted `pnpm typecheck` and browser-spec TypeScript check passed
again after this story-only correction. Logs:
`/tmp/sgui-b40-modal-correction-types-{0..1}.log`. Matching light slot lease was
released. No install, build, heavy or native run was performed. The corrected
clean handoff replaces `5d2828786cfe7c0ae954f2c96bdd06049def54ed`; native execution
remains pending with the same twelve cases and focused Chromium arguments.

## Wave22 red evidence and bounded diagnosis

Coordinator candidate `e6270941ea8828d8868fef0798451a599a9db25f` freshly built
once on Node24; worker prepared files at `c306eb47d4a1ff5cd960ab4f760e3304ff72a740`
were byte-identical per `/tmp/sgui-batch45-candidate-source-attribution.json`.
Chromium wave22: **4 passed, 8 failed, 0 skipped/flaky**. Candidate source/build
hashes remained unchanged. Evidence is preserved at
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/modal-native-boundaries/`.
The shard build digest is
`2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.

The four passing cases are medium/large 320x640 normal text and 640x320 short
enlarged text (not four normal-text cases). Both combined 320x320 enlarged cases
pass initial/body/footer focus but fail complete visibility of **Header help**
after keyboard wrap. Screenshots show its label squeezed into a vertical column,
taller than the dialog viewport. Trace shows it focused and the outer dialog
scrolled; complete-control visibility cannot be recovered by scrolling a control
that exceeds its scrollport. Shared Dialog's header keeps custom content and
close action side by side without wrapping; Button's owned label allows
anywhere wrapping. This is a reproduced product layout defect in shared header
composition, outside this worker's runtime ownership. Reserve shared Dialog
header reflow for an exclusive successor; do not resize the case or weaken bounds.

All six removed-opener cases fail the expected parent input focus after child
dismissal. Current trace snapshots do not expose definitive activeElement after
dismissal. No contract-valid fallback or shared focus defect is conclusively
classified yet. The host uses a layout effect to focus the destination while
child removal commits; native inert teardown timing may reject that attempt
(jsdom has no equivalent native inert behavior). Focus-scope restoration also
walks ancestor restore targets before ancestor first-focusable fallback. These
are source-grounded hypotheses, not observed activeElement evidence.

Prepared a bounded diagnostic revision without changing any focus targets,
dismissal timing, viewport or behavioral assertions: captures immediate and
two-frame deferred activeElement/dialog/inert state after dismissal; records
whether the existing host focus attempt encountered inert and succeeded; returns
focus-control geometry/viewport/hit-test details on failed visibility polls.
This materially changes diagnostic evidence, not an unchanged retry. Request the
coordinator's focused diagnostic admission with the same Chromium args. No local
browser/heavy run or shared source change occurred.

Node24 source/browser type checks passed for the diagnostic revision; logs
`/tmp/sgui-b40-modal-diagnostic-types-{0..1}.log`. Own light-slot lease released.
Original red artifacts remain intact. Whole M-08, Firefox/WebKit, manual/device/AT
remain held; this diagnostic handoff does not claim a correction or acceptance.
