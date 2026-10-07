# Batch 55: Link modal host selection ordering (M-33)

Reviewed clean base: `496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch55-link-webkit-selection/sg-ui`.
Branch: `codex/batch55-link-webkit-selection`.
The supplied combined branch/SHA spelling was not an existing ref; creation used
the exact supplied SHA, verified against `codex/dev` before any edits. Primary,
dev and other workers were never edited.

Exclusive scope: LinkUrlModal directory, `tests/browser/inventory-link-modal.spec.ts`
and this report. Changed files are this report and the local host story only.
Modal implementation, browser driver/spec, shared Dialog and editor remain unchanged.
Read repository AGENTS, [dialog contracts](../react-aria-editor-dialogs.md),
[development validation](../react-aria-development-validation.md),
[parallel browser contracts](../react-aria-parallel-browser-validation.md),
[browser acceptance](../react-aria-browser-acceptance.md) and the
[prior completion report](../parallel-batch-44/link-modal-native.md).

## Frozen red evidence and classification

Preserve the complete evidence root:
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/`.
Read root and link-modal-native `evidence.json`, scope `results.json` and
`browser.log`, both error contexts and both ZIP traces. Root initial/final head
equals the reviewed base, final Git status is clean, source digest is unchanged
(`e61559b264946c5b5a416e3a7194fd634c0ec30c5e6d9f003530ba694bde8286`),
and build digest is unchanged
(`c7bdf78df57d7eec5f9514bb77c4b944cbadd20a50021207e27a8b9bef0f1084`).
Cleanup records owned commands settled. This is actual frozen checkpoint evidence,
not a resource abort. The scope has six Firefox/WebKit passes and two WebKit
failures (light/dark unlink); prior focused Chromium had four passes.

Both failures reach the **first** `returned()` call at spec line 73, immediately
after blank-URL Enter. Neither reaches Cancel/Escape or reopen. The traces show
native backwards drag from paragraph whitespace to the first glyph boundary
(light x136.1796875 to x33 at y78.484375), followed by a successful exact
`Course guide` selection read. Trigger keyboard activation, URL Enter, dialog
closure and trigger-focus assertions pass. Post-submit DOM has no link and retains
strong Course/em guide. Host events contain exactly open and submit with
`url: null`, display text and selected snapshot `Course guide`. All subsequent
native selection reads return empty.

Classification: **fixture/host selection-restoration ordering defect**, one
underlying issue with two themed engine symptoms. No LinkUrlModal product defect
is demonstrated. The story queues its restoration RAF from the submit callback,
before React commits unlink/replaces the selected children and unmounts the
dialog. Read-only installed React Aria FocusScope implementation confirms return
focus is itself queued in a RAF during layout-effect cleanup. The fixture's
restoration therefore has no happens-after relationship with native return focus.
WebKit clearing the restored selection on that later focus is the causal inference
to be verified by the coordinator's fresh native run; traces do not log the
selection-change event itself. The paragraph is noneditable, not a Lexical or
contenteditable host. Initial native link default dragging is already avoided by
the unchanged whitespace-start driver, and is not this failure stage.

## Bounded correction

The host marks restoration pending when it accepts submit/close. It observes
focus return to the exact AppButton ref through native focus capture, then uses
a microtask to finish its existing host-owned range restoration after the focus
operation. It does not request focus. The pending flag and active-element check
prevent unrelated focus/open events from restoring a stale selection. Unlink has
already committed the new rich children when dialog return focus occurs.

No new browser-driver Selection manipulation was added. The story's existing
host restoration range operation is retained with deterministic ordering; it is
the behavior under test, not setup that bypasses a failed native gesture. All
strict existing native selection, formatting, unlink, callback count, protocol,
Cancel/Escape, focus and mounted-reopen assertions remain byte-identical. No
sleeps, retries, skipped/flaky acceptance, timeout relaxation or product trust/focus
change. This fixture continues to accept destination changes with fixed rich text;
actual Lexical edit/unlink remains outside this ownership.

## Local validation and native handoff

Bundled Node PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Observed Node `v24.19.0`, pnpm `10.29.3`, Vitest `4.1.11`.
Atomic helper admissions acquired own install slot 0 and light slot 0; both
released with exact owner-token cleanup after command settlement.

- `pnpm install --frozen-lockfile`: passed, 608 packages; existing ignored
  esbuild-script advisory.
- `pnpm exec vitest run src/components/LinkUrlModal/LinkUrlModal.test.tsx --maxWorkers=1`:
  passed, 23 modal composition tests.
- `pnpm typecheck`, `pnpm foundations:check`, `pnpm tokens:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm exec playwright test tests/browser/inventory-link-modal.spec.ts --project=chromium --project=webkit --grep 'remove preserves rich children' --list`:
  passed discovery, exactly four cases; no browser/server launched.
- `git diff --check`: passed.

Fresh native verification is **pending coordinator execution**. For the earliest
focused proof use `tests/browser/inventory-link-modal.spec.ts --project=chromium
--project=webkit --grep 'remove preserves rich children' --workers=1` (four cases:
light/dark remove/reopen on each engine). These cover the changed host ordering,
unlink, Cancel/Escape and mounted reopen without duplicating unchanged green
protocol cases solely for load. Snapshot mode does not accept grep, so if using
that mode specify this single spec with projects `["chromium", "webkit"]` (eight
cases) and record why the additional cases run. Firefox is unchanged green
checkpoint evidence, not a new-head pass.

Coordinator builds/typechecks one shared fresh immutable candidate with exact
owned-byte attribution. Source/head/report freeze at handoff; no independent native,
browser/server, Storybook build, full check or other heavy run. Coordinator alone
integrates/accepts. No dev/main merges, publication, forcepush, CI/title dispatch,
permissions/secrets or broad/manual/device/AT closure. M-33 and broader acceptance
remain open until the required evidence is actually recorded.
