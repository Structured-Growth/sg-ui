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
