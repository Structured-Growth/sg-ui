# Batch 11 editor link activation — bounded E-07

Baseline: `d0fcc6298004ad23d1a75480b216b39142e6df96`, verified before edits in
`/Users/thomashall/.codex/worktrees/batch11-editor-link-activation/sg-ui`.
Branch: `codex/batch11-editor-link-activation`; draft PR targets `codex/dev`.

## Audit result and exclusive changes

No runtime defect was demonstrated. Implementation remains exactly at the baseline
for OwnedLinkActivationPlugin and OwnedLinkNode. Only these files change:

- `src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.test.ts`
- `src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.test.ts`
- `docs/developer/parallel-batch-11/editor-link-activation.md`

Existing activation tests covered editable/read-only ordinary, Ctrl/Meta/Shift and
middle activation with `noopener,noreferrer`, ordinary selected-range suppression,
three rejected URL categories and a combined right-click/cleanup case. Existing
node cases covered 13 accepted/rejected destinations with saved children and
metadata. [Existing browser evidence source](../../../tests/browser/editor-links.spec.ts)
checks rejected click/middle activation, ordinary/modified/middle relative-link
popups with null opener, editable/read-only state and native paste/reload.
That browser source was inspected, not rerun in this task.

The old combined cleanup test prevented clicks at the anchor before the root
listener, masking a possible leaked listener. Its replacement checks both listener
removals, successful activation at the new root and uncanceled events after
disposal. Separate nonactivation tests retain and expand its button coverage.

New missing combinations cover:

- Nested independent editors with opposite outer/inner selection states, for click
  and middle auxclick: only the nearest editor decides whether to open its URL.
- Actual React StrictMode plugin effect replay: two setups/one cleanup, one open
  per gesture, then complete cleanup and no opens after unmount.
- Root replacement and temporary null-root detach/reattach for both event types.
- Selected ranges with Ctrl/Meta/Shift/Alt and middle activation; rejected saved
  URLs with the same modifiers/middle event; prior host cancellation of each event.
- Nonprimary click and nonmiddle auxclick exclusion, plus normalized relative,
  fragment, query, bare-www, mailto and tel activation from a rich child's text node.
- Live accepted→rejected→normalized→relative destination changes retain the same
  anchor, rich child, metadata and original serialized host URL.

These are synchronous jsdom/React/Lexical contract tests, not native gesture timing
or operating-system navigation evidence. No production behavior/API/style change
requires a changed-state story. Shared URL policy, section/config/serialization,
image implementation and browser files stayed read-only.

## Exact local validation

Runtime for all pnpm commands: Node `v24.21.0`, pnpm `10.29.3`;
Vitest `4.1.11`, React `19.2.3`, Lexical `0.41.0` from the frozen lockfile.
The shell used this explicit runtime path:

```sh
export PATH=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin:$PATH
pnpm install --frozen-lockfile
pnpm exec vitest run src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.test.ts src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.test.ts src/components/LinkUrlModal/linkUrlPolicy.test.ts
pnpm typecheck
git diff --check
```

Frozen install passed (608 packages reused; pnpm reported the existing ignored
esbuild build script). Initial two-file run passed 43 tests; adding actual
StrictMode and live DOM transition coverage passed 45 tests. Final three-file run passed all 71 tests across three files; final `pnpm typecheck`
and `git diff --check` passed. No dependencies/lockfiles changed.

No full check, build, Storybook, browser or packed-consumer run was performed.
No heavy process or validation lock was needed. Dev GitHub CI/title remains
user-paused: no dispatch, rerun, re-enable or check wait. Other worktrees,
primary checkout, workflows, permissions, secrets and licensing were preserved.

## Limits and next bounded task

E-07 and broader E/G/U/X/R/Z acceptance stay open. Mocked `window.open` establishes
requested isolation flags; only native popup evidence establishes opener behavior.
New nested-editor/selected-text/root-replacement cases have no fresh browser run.
A later exclusively assigned browser/story scope should check native selected-text
click/middle suppression and nested independent editor activation through document
replacement, with Chromium/WebKit and the full Firefox matrix once its known
profile-launch environment prerequisite changes. Do not repeat unchanged Firefox
launch/reinstall/TMPDIR attempts. Device and assistive-technology acceptance remain
unverified. No out-of-scope source fix is proposed from this passing audit.

Central guidance suggestion for coordinator: link this bounded report from the
editor E-07 evidence record without closing broad acceptance or changing the shared
URL policy. Follow the [development validation policy](../react-aria-development-validation.md).
