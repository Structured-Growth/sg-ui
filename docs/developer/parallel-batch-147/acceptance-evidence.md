# Batch 147: native grid resize entry diagnosis

Classification: corrected test-driver entry assumption, native correction UNRUN.
G-12 remains partial; neither a resize product defect nor accepted resize behavior
is established by this batch.

## Isolated history and exclusive scope

Managed isolated worktree: `/Users/thomashall/.codex/worktrees/7a85/sg-ui`.
Branch: `codex/batch147-native-resize-entry`.
Starting head: `b6a39411bee7fab4e13226c11e8ed8eb53b4d20c`.
Only `tests/browser/acceptance-pack-114.spec.ts` and this report are changed.
No runtime source, story, existing worker, primary image-upload work, coordinator
state, queue, shared slot, CI or integration changes were made.

Before corrective edits, commit `2508965` copied only the actual latest batch139
spec bytes from `/Users/thomashall/.codex/worktrees/batch139-resize-evidence/sg-ui`
at clean head `fc111f05c5c121f10b41c3554a4fe7d7b4365026`.
The copied spec and the wave44 candidate spec have the same SHA-256:
`5fc90dcddda26af71e4321097f532264ca9036d1178e205174f33ba67c9e29e4`.
Batch139's report and the coordinator's `batch139-independent-review.json` were
read without importing their files/history. The review admitted a source-derived
correction for native execution; its claim that Tab enters Select page is now
contradicted by wave44. Batch139 was not treated as integrated or passing.

## Preserved actual failure

Frozen wave44 candidate: `79995c6d727a9db37815edaa081df6ee0ebde8b1`.
Evidence root:
`/Users/thomashall/.codex/worktrees/native-corrections-136-139/sg-ui/artifacts/browser-pool/72b840de-096b-4ec0-a60b-8ff4dd41c5b4`.
All evidence remains untouched. Relative artifact names and SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| `evidence.json` | `8f69de7c66686378ff2eafb02e8f85f5bc341172cdeaaad53d3b6dbf458baa50` |
| `score-resize/results.json` | `4556220cc5d6d4b047085053c4f99f488426ae5ab3305403b33d1f69b2f10d2b` |
| `score-resize/traces/acceptance-pack-114-batch1-911c2-rd-order-keeps-actions-last-chromium/trace.zip` | `f427cf2646477a5a60c7d1349120b58ef7e1c4d72bd6ccbb35adb3e234dd1ed9` |
| Same trace directory: `error-context.md` | `a00c4842797b0440534a239f6964ada9be1db36ffa43de00d86fae58955c1b7d` |

The Chromium case has one unexpected result, zero expected/skipped/flaky results,
and no retry. It fails at line 32, `tabTo(page, selectPage)`, before ArrowRight or
resize entry. Score is visible at 225, the interior-width checks completed,
and committed widths remain `{}`. This is fresh failure of batch139's entry
assumption, not evidence that the resize gesture itself failed.

## Actual native entry observations

Read-only decoding of `1-trace.trace` frame snapshots in the retained ZIP gives
this first forward-Tab sequence. Snapshots contain native React Aria
`data-focused=true` and `data-focus-visible=true` metadata on the named elements;
no focus was injected while inspecting them.

| Native Tab | Trace call after snapshot | Focused element |
| --- | --- | --- |
| 1 | `call@20` | Refresh button |
| 2 | `call@26` | Select none toolbar button |
| 3 | `call@32` | Search button |
| 4 | `call@38` | Columns button |
| 5 | `call@44` | Sort button |
| 6 | `call@50` | Filter button |
| 7 | `call@56` | First body `TR`, `data-grid-row=0`, `data-key=0`, `tabindex=0`, labelled by Course 1's name cell |

The initial pre-Tab snapshots contain no owned focused-element flags. The old
test did not read the initial `document.activeElement`, so its exact initial
node cannot honestly be recovered from those flags. At Tab 7, focus is on the
row itself, not Select Course 1 or Select page. The row remains unselected.
The following Tab leaves the grid; subsequent snapshots show the footer/host
buttons and cycling back to Refresh, without header entry. A longer Tab loop
cannot fix the missing vertical-navigation gesture.

The corrected driver now records the actual initial active element, every native
Tab on entry, ArrowUp and each header ArrowRight as separate Playwright JSON
attachments. Each sample reads tag, ID, role, label, bounded text, tabindex,
nearest field and row. Samples are attached before the related focus assertion,
so a failed step retains its observation. These are read-only measurements and
do not constitute fresh observations until the coordinator runs the case.

## Source-derived keyboard path

Read the owned [renderer](../../../src/components/AppDataGrid/ownedGridInteraction.tsx)
and the actual installed React Aria 3.52.1 sourcesContent under the wave44
candidate's `node_modules/.pnpm`, without executing dependencies:

- `selection/useSelectableCollection.js.map`, lines 452–517: fresh forward entry
  with no focused key chooses the delegate's first key. Tab treats the collection
  as a single stop and exits it (lines 372–406).
- `grid/GridKeyboardDelegate.js.map`, `getFirstKey`: finds the first body item;
  default row focus mode returns that row. Headers are not the initial Tab target.
- `table/TableKeyboardDelegate.js.map`, `getKeyAbove`: when focus is on a row and
  there is no previous body row, returns the first column header.
- `grid/useGridCell.js.map`, lines 109–130: child focus strategy enters the first
  focusable header child; horizontal arrows walk children, then adjacent cells.
- `table/useTableColumnHeader.js.map`: header focus mode is child.
- `table/useTableColumnResize.js.map`: Enter starts resize mode, ArrowRight changes
  width with grid navigation disabled, and Enter completes it.

Thus the corrected path is: native Tab to the first body row, assert row focus,
ArrowUp, assert Select page focus, then preserve batch139's five asserted
ArrowRight stops: Selection actions, Sort Course, Resize Course, Sort Score,
Resize Score. Enter / ArrowRight / Enter then performs the original resize.
Only the initial Tab target and missing ArrowUp gesture are corrected; the arrow
path is still source-derived and awaits actual execution.

Installed source-map SHA-256, for exact independent review:

| Map within `react-aria/dist/private/` | SHA-256 |
| --- | --- |
| `selection/useSelectableCollection.js.map` | `bf99024523feee00d40fde5e57339a685e416e857bf747d9cd865f5bbaf51646` |
| `grid/GridKeyboardDelegate.js.map` | `790e316918cdfc97c8f288efc53857a5da90b939d83cad0cadbdb09a00800139` |
| `table/TableKeyboardDelegate.js.map` | `87057c5e7be3aab86120442fd2ccfc34131474a12c6faf05c1d9ae9814adcda4` |
| `grid/useGridCell.js.map` | `528aeb8067145e276ddbf7b28db01ca87c96f6cebc7f307c233a249de9411a15` |
| `table/useTableColumnResize.js.map` | `0819115f505426025544a8196007dd5880afe4a57fe882e02d7fdca66c9a6f5f` |

## Preserved assertions and validation ownership

The `100 < initial width < 240` assertions are unchanged. The entire suffix
starting at the first resize Enter is byte-identical to actual batch139 bytes:
width increases, sole committed field is exactly `['score']`, Score retains
focus, native host order activation produces exactly
`['score', 'name', 'status', 'due', 'actions']`, the host action retains focus,
Course 1 remains unchecked and diagnostics are empty. All five header focus
assertions remain. The native Tab bound remains 100. There is no artificial
focus, forced operation, skip, retry increase or assertion weakening.

Performed: read-only evidence/source inspection, byte/hash comparison, exact
suffix comparison, scope review and whitespace diff check. Corrected spec
SHA-256: `2694d90c83e4e7ad5eca4b9eb39d234837c7f8445bd650f57020fce702349494`.

UNRUN by explicit task boundary: install, typecheck, unit/composed tests, guards,
package/build, fresh Storybook, browser/Chromium/Firefox/WebKit, consumer,
performance and CI checks. No shared slots, queue/state mutation, merge, push,
publication or unchanged failing test relaunch occurred. Coordinator owns exact
independent review followed by fresh type/native validation of a frozen candidate.

If native validation cannot reach the row/header or fails a subsequent strict
focus stop, retain the new initial/ordered focus attachments and reserve the
owned renderer/header interaction with the coordinator before any runtime edit.
If entry succeeds but resize/commit/focus fails, reserve its resize integration.
Runtime edits are outside this worker's allowlist. Broader G/U/X/R/Z and device/AT
acceptance remain open.
