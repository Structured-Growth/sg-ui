# Batch 52: removed child opener recovery

Bounded M-08/U-08/U-19 focus repair, 2026-10-07. Broad modal, native/device and
manual assistive-technology acceptance remains open.

## Ownership and base

Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch52-dialog-removed-opener/sg-ui`.
The initial worktree was clean at reviewed base
`496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
Only these files are changed:

- `src/experimental/Dialog/Dialog.tsx`
- `src/experimental/Dialog/Dialog.test.tsx`
- `tests/browser/batch52-dialog-removed-opener.spec.ts`
- `docs/developer/react-aria-modal-shells.md` (fallback paragraph only)
- this report

Dialog CSS/stories, shared Button, AppModal and its stories/specs remain read-only.
The native removed-opener cases require the coordinator's composition with the
batch-40 passive-effect fixture correction (`2a9ba67`). This worker did not copy
that fixture into this base or change its ownership. No expanded source scope is
needed for the implementation; no public API or React Aria fork is added.

## Diagnosis and repair

The coordinator independently verified six native wave-23 attachments under
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/modal-native-boundaries`.
The three unassisted cases had BODY focus immediately and after two animation
frames with a surviving non-inert parent. The three original host cases attempted
focus from a layout effect while inert (`succeeded: false`); that is a fixture
ordering defect owned by batch 40, not evidence of stealing successful host focus.

Installed React Aria 3.52.1 `useRestoreFocus` records the opener during render,
queues restoration in layout cleanup and walks connected ancestor openers before
its first-focusable ancestor fallback. A removed child opener therefore reaches
the page opener, outside the still-open parent. Native inert blocks that background
focus. `useModalOverlay` releases inert in passive-effect cleanup.

Dialog now retains a private logical-parent recovery scope, native dialog ref,
initial successful descendant focus, opener and React Aria focus manager. Its
portal-lifetime passive cleanup schedules one frame after restoration and inert
cleanup. It repairs only lost/inert-background focus or the known ancestor opener,
only when the child's opener is disconnected and its parent survives. Valid host
focus, another surviving modal's focus, and surviving trigger returns are retained.
The parent initial destination is preferred, then its first tabbable control,
then the dialog. Stable native ref forwarding avoids reattaching on host updates.
There are no retry/timeout loops or new public controls.

## Local commands and evidence

Node 24.19.0 via
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Installation used an atomic install slot, validation an atomic light slot and
Vitest `--maxWorkers=1`. Only owned claims were released. All retained logs are in
`artifacts/batch52-dialog-removed-opener/` inside this worktree (gitignored).

- `pnpm install --frozen-lockfile`: dependency installation succeeded. The first
  command wrapper then failed because it called nonexistent `lease.release()`;
  the worker released its exact owned token using exported `releaseLease`.
- Regression first: `pnpm exec vitest run src/experimental/Dialog/Dialog.test.tsx --maxWorkers=1`:
  3 failed / 9 passed. Each unassisted dismissal missed the parent initial field;
  jsdom restored the background page opener (native evidence instead remained BODY).
  Host placement and surviving trigger cases passed. `regression-first.log` retained.
- Intermediate implementation attempts remained red (including unsupported AriaDialog
  capture prop, unstable ref and missing initial-focus recording). They were fixed;
  `targeted.log`, `targeted-repair.log`, `diagnosis.log` retain the evidence.
- Final: `pnpm exec vitest run src/experimental/Dialog/Dialog.test.tsx src/components/AppModal/AppModal.test.tsx --maxWorkers=1`:
  21 passed, 2 files (`handoff-local.log`). Covers all three dismissals, successful
  host destination preserved beyond two frames, first-tabbable fallback after
  initial destination removal, another host-opened modal, child and page openers.
- `pnpm typecheck`: passed (`final-local.log`).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed (`final-local.log`).
- `pnpm foundations:check`: passed (`final-local.log`).
- `git diff --check`: passed before freeze.

## Coordinator native proof, pending

Focused args:
`["tests/browser/batch52-dialog-removed-opener.spec.ts", "--project=chromium"]`.
There are nine cases: six removed-opener scenarios and three surviving-opener
scenarios. Each asserts the named actual focus owner, viewport visibility and
center-point hit testing. Host cases require diagnostic evidence of non-inert,
successful placement; focus is rechecked after two frames. Native diagnostic
attachments retain immediate/deferred active elements and dialog inert ancestry.

The worker launched no browser, server, heavy build, full check, CI, publication,
main/dev integration or PR-title run. Coordinator must compose reviewed changed
bytes with the corrected batch-40 fixture and run focused Chromium on a fresh
frozen candidate before provisional dev integration. Firefox/WebKit are checkpoint
pending. This report and local jsdom passes do not claim native acceptance.
The exact frozen delivery commit is supplied in the coordinator delivery message.
