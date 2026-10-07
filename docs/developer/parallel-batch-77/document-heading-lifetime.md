# Batch 77: queued document heading lifetime

Bounded M-22/H-05 follow-up against reviewed dev baseline
`036473472ffeee4e5d504d5ca76bc1431d187693`. This is a revised frozen implementation
checkpoint for coordinator integration and shared native validation. It does not
close whole M-22/H-05, manual assistive-technology, or broader editor acceptance.

## Defect and delivery policy

The original DocumentEditorToolbar timer captured the selection-time
`onHeadingChange`. A committed callback replacement still called the obsolete
owner; callback removal and `canEdit=false` still delivered the old request.
Unmount was already cancelled and is retained as regression coverage.

The timer now reads the current committed owner, updated through a browser layout
effect with a guarded server effect fallback. It checks current edit availability
at delivery. A committed read-only transition or absent callback clears every
pending transaction. Restoring availability does not revive the old request.
Unmount synchronously clears pending delivery. Uncommitted suspended renders
cannot update ownership. No public prop/type change is introduced.

Heading remains host-controlled. The existing zero-delay task remains in place
so Select can finish Enter handling before a host command refocuses its editor.
The [editor layout contract](../react-aria-editor-layout.md) remains applicable.

## Focused evidence

Runtime: Node 24 from
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Dependencies installed with `pnpm install --frozen-lockfile`, holding only the
acquired install slot. Focused checks used acquired light-validation slots;
no foreign slots or other worktrees were removed.

- RED: the initial seven queued-lifetime tests against unchanged baseline source
  produced five failures and two passes. Replacement, removal, read-only and the
  two availability restoration cases each invoked the stale original callback.
  Unmount and an unrelated render already passed. Log: `/tmp/batch77-red.log`.
- GREEN: `pnpm exec vitest run src/components/DocumentEditorToolbar` passed
  23 tests across two files. This includes the existing eight tests, eight queued
  lifetime tests (including speculative suspended ownership), and seven composed
  browser-fixture ordering tests. Log: `/tmp/batch77-green.log`.
- `pnpm typecheck` passed, including the new story. Log:
  `/tmp/batch77-typecheck.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` passed. Log:
  `/tmp/batch77-browser-types.log` (empty successful output).
- `pnpm foundations:check` passed. Log: `/tmp/batch77-foundations.log`.
- `git diff --check` passed.

The unit regressions use the actual owned Select, option ArrowDown/Enter events,
then fake timers only to inspect the already-queued transaction before delivery.
No mocked Select or timing sleep is used. The original browser fixture's
capture microtask was only verified in jsdom and lacked proof of native request
creation before the host transition; wave 36 exposed that gap. The corrected
fixture captures Enter only to arm a transition. A MutationObserver waits for the
heading trigger's `aria-expanded=false` close mutation, then commits host changes.
The installed Select state implementation invokes `onSelectionChange` before
closing its popup (`react-stately/dist/private/select/useSelectState.mjs`), so the
observable close boundary follows heading request creation. Mutation delivery
precedes deferred timer delivery without intercepting timers or using sleeps.

The native spec attaches `heading-event-order` and asserts `option-enter`,
`select-closed`, `host-committed:<mode>` in that order. Restored availability cases
add `availability-restored`, then `delivery-checkpoint`, with zero requests.
The current-owner request and invalidation expectations are unchanged. Composed
unit fixture tests establish the revised ordering in jsdom; revised native
ordering still requires the coordinator's fresh run.

## Wave 36 ordering correction

Coordinator candidate `65e4c857a73ac0b0fcc86ff9f50d9fbbb1746421`, immutable token
`e644960f-a690-4f5b-a6cd-6f1ed20e5a90`, settled with 10 heading Chromium passes and
four failures: light/dark `remove-restore` and `read-only-restore` each observed
`current:h1` instead of `[]` after the fixture checkpoint. All share the same
fixture-ordering gap; this is not evidence of four separate product defects.

The original run had no callback-creation event trace, so the precise original
native creation/commit ordering cannot be reconstructed from its final request
count alone. Capture-listener microtask delivery before React's delegated bubble
handler is consistent with the failure: availability can be removed and restored
before a request exists, and the later valid request belongs to the current owner.
The corrected close-boundary observation removes that ambiguity and adds native
trace assertions rather than weakening the cancellation expectation.

Only the story, fixture test assertions, browser trace assertions and this report
changed after the settled freeze was lifted. Product source retains SHA-256
`b8828b0d94018a3b1ac4377d718c485bf9c0297a38dd886213c9d6bd46a6f04d`.
Original RED/GREEN logs remain untouched. New correction logs:

- `/tmp/batch77-correction-green.log`: 23 tests passed, SHA-256
  `d5e91e5745d1790dfddb3c884245c70df115fcfd54f7157fe310610ee654cfb5`.
- `/tmp/batch77-correction-typecheck.log`: passed, SHA-256
  `2f9a57afc529d55f9c731325704044b922bfdfd05ea4bdf253476d7146b9cf0a`.
- `/tmp/batch77-correction-browser-types.log`: passed, SHA-256
  `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- `/tmp/batch77-correction-foundations.log`: passed, SHA-256
  `a0de0b851645f6e4651d60af286c5294a4ea3a55c34fa0bf5392cd6b81499dc6`.

## Pending coordinator validation

No independent Storybook build, browser suite, full `pnpm check`, CI dispatch,
rerun, wait, or workflow modification was performed. The coordinator owns review
of this frozen source, shared `pnpm check`/Storybook build, and Chromium execution
of `tests/browser/batch77-document-heading-lifetime.spec.ts`.

The browser spec contains 14 cases: seven modes in light and dark themes. It uses
real focus and keyboard actions and checks one current/original request for
accepted scenarios or zero for invalidated scenarios, explicit host commit and
delivery checkpoints, retained controlled Normal heading, unchanged document
text, editor focus on accepted delivery, disabled states and unmount. Native
results for the corrected fixture remain pending. Physical-device and manual AT acceptance remain deferred.

## Original wave 36 SHA-256 inputs

| File | SHA-256 |
| --- | --- |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx` | `b8828b0d94018a3b1ac4377d718c485bf9c0297a38dd886213c9d6bd46a6f04d` |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.heading-lifetime.test.tsx` | `e8df723b8aedd40a23913c05de8aa063b0fbeda5f9a8e03cca5db32307b2eba0` |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.heading-lifetime.stories.tsx` | `51bbfe81074d28d88d8b8537232c1fc8ba2e38fcb9760dec7d0e5abd07883e26` |
| `tests/browser/batch77-document-heading-lifetime.spec.ts` | `29c184fc82a330bb1cea710cb098b0c1aec652546fe59ad6bf1017372ce3339a` |

Evidence log SHA-256:

- RED: `bc61caf5f34188eff657c72dfefd687c20e8b4c61fbd13b226cce59effbf00f4`
- GREEN: `79f1c812e6be981e06ba19dd738266bb1dc2e219c399aef704c2a934d31a0909`
- Typecheck: `2f9a57afc529d55f9c731325704044b922bfdfd05ea4bdf253476d7146b9cf0a`
- Browser types: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Foundation guard: `a0de0b851645f6e4651d60af286c5294a4ea3a55c34fa0bf5392cd6b81499dc6`

## Corrected frozen SHA-256 inputs

| File | SHA-256 |
| --- | --- |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx` | `b8828b0d94018a3b1ac4377d718c485bf9c0297a38dd886213c9d6bd46a6f04d` |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.heading-lifetime.test.tsx` | `62d73ec2a0f8fe5795a6141dace68c3a4913cbb0cf3d9fe755c2e22202b181c4` |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.heading-lifetime.stories.tsx` | `6015cf3746d89b7a178903dec849dc92a7b605b44064ac4fa5065e1218b4a07b` |
| `tests/browser/batch77-document-heading-lifetime.spec.ts` | `330690105e937a656b460e795088a314a18e5f4fdbc31093fc82a43b9722d37a` |
