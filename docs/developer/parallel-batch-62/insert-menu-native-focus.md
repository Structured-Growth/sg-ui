# M-27 insertion menu native focus evidence

Base: `fc4f9fca9be4aaace869f0944baccaeed921e5b8`.
Worktree: `/Users/thomashall/.codex/worktrees/batch62-insert-menu-native-focus/sg-ui`.

## Scope and review

Only `src/components/InsertContentMenuControl/`,
`tests/browser/batch62-insert-menu-native-focus.spec.ts` and this report change.
Public insertion APIs, translations, Menu, Dialog and PageRichTextEditorSection
implementations are unchanged. No proven within-component defect was found by the
local checks; this is evidence preparation, not a product behavior rewrite.

The [NativeInsertionHost](../../../src/components/InsertContentMenuControl/NativeInsertionHost.tsx)
fixture records host requests inside a form and opens the existing owned Dialog
for Image/Columns Layout. Horizontal Rule records a direct command. The host
supplies dialog labels/content and owns insertion; no editor or upload service is
involved. It has no manual focus-return patch. F2 replaces callback ownership and
F3 removes dialog callbacks while the menu remains open. The story uses Provider
and the production Storybook styles/scope.

Existing browser coverage was inspected first: generic Menu autofocus in
`batch17-menu-autofocus.spec.ts`, alignment command/live-state coverage in
`inventory-align-direction.spec.ts`, and deferred formatting callback coverage in
`batch13-formatting-toolbar.spec.ts`. Existing editor image/table specs exercise
the full editor. The new cases target the insertion wrapper's native host handoff
and current availability, with no duplication of alignment icons/checked state or
generic programmatic collection strategy assertions.

## Targeted local evidence

Node 24 runtime PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Frozen-lock install passed under atomically acquired install slot0, then released.
Validation used atomically acquired light slot1 after occupied slot0 was respected.

- `pnpm exec vitest run src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx src/components/InsertContentMenuControl/NativeInsertionHost.test.tsx`: 2 files, 5 tests passed.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.

The first composed regression run failed because a named status lookup occurred
while Dialog correctly hid its background. The fixture/test query was corrected
to retain the previously accessible status element. The later run passes; this
was a fixture expectation defect, not an insertion/Dialog product defect.

## Coordinator native run and acceptance limits

Prepared scoped arguments (five Playwright cases):

```sh
pnpm exec playwright test tests/browser/batch62-insert-menu-native-focus.spec.ts --project=chromium
```

Story ID: `editors-insertcontentmenucontrol--native-insertion-handoff`.
The coordinator composed the attributed shared candidate and built Storybook
once before the run. No worker Storybook build, browser/server, full check or CI
run was performed. The five focused Chromium cases **passed**; see the exact
candidate attribution and outcomes below.

The cases assert native keyboard activation for all three commands, one delivery,
no form submission, dialog initial focus and return on Escape/host completion,
live callback replacement, current unavailable command skips, trigger entry by
ArrowUp/Enter/Space, menu Escape cancellation and disabled pointer/tab behavior.
Host status text is DOM request evidence only; the modal background is intentionally
hidden while Dialog is open. No spoken assistive-technology result is claimed.
Firefox/WebKit await the shared checkpoint. Physical-device and AT acceptance,
whole M-27/broad editor gates and production acceptance remain open. Coordinator
alone reviews, accepts and integrates this prepared slice.

## Independent admission correction

The coordinator held the prepared pointer cases because forced locator clicks
bypass normal hit actionability. Both the unavailable Image item and disabled
trigger now require visibility, positive bounds, and a center `elementFromPoint`
hit belonging to the target or a descendant before real `page.mouse.click` input.
The menu-open, no-request and form-safety assertions remain; unavailable-item
request/form assertions also run immediately after its pointer click. Programmatic
trigger focus is setup only; native keyboard presses perform the menu entry.
Browser TypeScript and diff checks passed after this bounded spec/report correction.
No independent native run was performed. The subsequent shared Chromium run
passed all five cases with these corrected pointer assertions.

## Wave30 executed Chromium evidence

On 2026-10-07, the coordinator tested candidate
`5cc976dc1b9af6ced3980ec0e93fe930a9a8237b` with Node `v24.19.0`.
The attributed worker source head was
`a059ff9a1abf55193a8ba82d68f4e500d871ddc5`, containing prepared commit
`4bedee6c2b03fb8ae9477f3c6851b9d0a3920e19` and its bounded pointer correction.
The worker head is not the tested candidate head. All five worker file digests
matched the wave30 attribution before this report-only finalization; source,
story, spec and unit files remain byte-identical.

Evidence files (local coordinator artifacts):

- Root: `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/evidence.json`.
- Shard: `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/insert-menu-native-focus`.
- Attribution: `/tmp/sgui-batch45-candidate-wave30-attribution.json`.

The shard ran on Chromium, slot2/port6615, from
`2026-10-07T18:11:55.426Z` to `2026-10-07T18:12:01.549Z` (13:11–13:12 CDT).
Its recorded build digest is
`6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`.
Exact scoped selection:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/batch62-insert-menu-native-focus\.spec\.ts$' --project=chromium
```

All five selected cases passed, with no failed/skipped case in this shard:

1. Native Image command: one request, safe host form, host dialog focus and Escape return.
2. Native Horizontal Rule command: one request, safe host form and trigger focus return.
3. Native Columns Layout command: one request, safe host form, host dialog focus and completion return.
4. Open-menu callback replacement and current availability on native entry.
5. Unavailable-command entry skips, Escape cancellation and verified disabled pointer/tab behavior.

The shared root outcome was failed because the unrelated `pointer-drop-focus`
shard failed; that outcome is preserved and is not represented as a full candidate
pass. This insertion shard passed completely. Root cleanup records `owned commands
settled`; the coordinator confirms immutable source/build and released locks.
No redundant validation/build was run during report finalization.

This closes the bounded missing Chromium insertion-command/focus evidence gap.
Firefox/WebKit remain pending at the shared checkpoint. Physical-device behavior,
spoken assistive-technology output, whole M-27/broad editor gates and production
acceptance remain open. Only the individual reviewed worker history is eligible
for coordinator integration; the whole shared candidate is not this deliverable.
