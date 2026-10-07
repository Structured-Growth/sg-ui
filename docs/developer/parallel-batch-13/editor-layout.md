# Batch 13: editor layout inspection

Assignment: E-03/X-05, bounded DocumentEditorLayout host scroll/ref ownership,
header/toolbar replacement and narrow-layout focus review. No acceptance ID is
closed by this report.

## Isolation and scope

- Chat: `01a116b2-0d9a-72f0-b4a5-4cdff6f43dec`.
- Verified baseline and inspected product head:
  `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed, attached worktree:
  `/Users/thomashall/.codex/worktrees/batch13-editor-layout/sg-ui`.
- Branch: `codex/batch13-editor-layout`; draft PR base: `codex/dev`.
- Exclusive write allowlist: `src/components/DocumentEditorLayout/`,
  `tests/browser/batch13-editor-layout.spec.ts`, and this report.
- Actual change: this report only. No source, story, test, API, dependency,
  shared guide, checklist, workflow, license or other worktree changes.

## Finding and existing evidence

No demonstrated in-scope product defect was found. The existing ownership
contract and representative coverage are sufficient to avoid another migration
or speculative focus/scroll changes. They do not establish full E-03/X-05
acceptance.

The [layout implementation](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.tsx)
forwards its native root div ref, keeps header/menu/toolbar before the content
wrapper, and delegates the scrollable child to the host. It introduces no scroll
handler, focus handler, effect or second overflow container. Conditional menu and
toolbar siblings retain the content wrapper's element type and position as the
last unkeyed child across ordinary slot changes; changing a host child's key/type
still gives the host normal React replacement semantics. The layout cannot
preserve focus on a control that the host removes and does not claim to choose
a replacement focus target.

The [compiled component styles](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.module.css)
use zero minimum inline/block dimensions for the root/content, nonshrinking chrome,
wrapping header/actions, and a breakable title. The host supplies a bounded height
and its own `minHeight: 0; overflow: auto` child. Slot content remains host-owned;
unbreakable custom controls and chrome taller than a bounded viewport still need
host reflow/scroll policy.

The [four existing colocated tests](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx)
cover ordered slot regions and menu/toolbar removal, fallback/custom title
semantics, native root ref/class/style, Save activation and keyboard order into
host content, and server rendering. These are existing tests, not rerun results.
The [three existing stories](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.stories.tsx)
provide independently scrolling long content, a custom heading, and a 260px dark
composition. No behavior changed, so no changed-state story was required.

The [previous completion record](../react-aria-progress.md#editor-layout-and-floating-selection)
records four layout tests and native production evidence: host scrolling reached
301.5px while the header top remained 17px. Its narrow 260x600 measurements apply
to the surrounding toolbar/chrome/floating controls, not a complete layout
replacement/reflow acceptance case. Packed React 18/19 editor compositions and
native heading/formatting focus evidence are also recorded there. This historical
evidence was inspected, not regenerated or claimed against this baseline.

Existing browser clipboard/keyboard-scroll cases in
[editor-clipboard.spec.ts](../../../tests/browser/editor-clipboard.spec.ts) and
[acceptance.spec.ts](../../../tests/browser/acceptance.spec.ts) concern the editor
section's host region, not DocumentEditorLayout slot replacement; they must not be
counted as that missing combined case.

## Validation, commands and limits

Read `AGENTS.md`, the development-validation override, owned layout contracts,
README/migration/architecture guidance, layout source/styles/tests/stories,
surrounding toolbar/chrome tests and previous completion evidence.

Executed read-only inspection commands included:

- `git rev-parse b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818` and, after isolation,
  `git switch -c codex/batch13-editor-layout`, `git rev-parse HEAD`,
  `git status --short`.
- `cat docs/developer/react-aria-development-validation.md docs/developer/react-aria-editor-layout.md src/components/DocumentEditorLayout/*`.
- `rg` searches for DocumentEditorLayout, E-03/X-05 and host-scroll evidence in
  browser tests, previous batch reports and the migration execution record.
- `git log -5 --oneline -- src/components/DocumentEditorLayout`.
- Report-relative Markdown target existence and `git diff --check` (passed).

Runtime inspected: Node `v26.5.0`, pnpm `10.29.3`. No dependencies were installed;
no build, Vitest, typecheck, browser suite or broad check ran. Fresh result counts:
zero tests, zero builds. Existing counts above are explicitly historical.
Documentation-only validation follows the user-approved targeted validation policy.

No install/light-validation slot or heavy/browser lock was claimed. The existing
heavy lock and priority queue were read without alteration. Browser capacity is
under review; it was not bypassed, and queued capacity is not reported as a pass.
No Firefox retry, GitHub CI/title run, merge, publication or credential access.

## Exact next-task scope

If fresh combined native evidence is required, retain the same exclusive source
and browser allowlist: add a host-driven replacement story under
`src/components/DocumentEditorLayout/` and focused
`tests/browser/batch13-editor-layout.spec.ts` coverage after approved browser
capacity becomes available. Exercise header/menu/toolbar add/remove/replacement
while focus remains inside an unchanged, scrolled host content node; assert root
and host scroll ref identity, scroll ownership, focus visibility and keyboard
reachability at 260px in both themes. Include chrome taller than the bounded
layout and enlarged text as a separate host reflow contract review. Reproduce a
native failure before any product fix. Broader toolbar/chrome changes need a
separate allowlist; manual zoom/device/assistive-technology acceptance remains open.
