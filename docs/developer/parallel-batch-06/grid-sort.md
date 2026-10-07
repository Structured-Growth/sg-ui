# Batch 06: public grid sorting

## Scope and ownership

Bounded G-08/U-17 header/toolbar acceptance slice. Baseline verified clean at
`e80a26937fca3af3dfc11a18767a8599bf823d0e` before creating branch
`codex/batch06-grid-sort` in the managed attached worktree
`/Users/thomashall/.codex/worktrees/batch06-grid-sort/sg-ui`.
Primary and other worktrees were preserved. No sorting transaction or processing defect was reproduced. A shared Menu native
autofocus defect is reserved below; public APIs and host control remain unchanged.

Changed files:

- `src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx`
- `src/components/AppDataGrid/ownedGridSortAcceptance.stories.tsx`
- `src/components/AppDataGrid/components/header/TableHeaderSortMenu.test.tsx`
- `src/components/DataToolbar/components/DataToolbarSortMenu.test.tsx`
- `tests/browser/batch06-grid-sort.spec.ts`
- This report.

Implementation/test heads: `bf8369ea3bd5e0dc7ac0eda298b3be1b25e95ba5`
(unit/composed/story/browser scenarios) and `3b83b3eff1df09b031c3863901d5289d9a3cb0ef` (additional native indicator
rotation and disabled priority browser assertions). The final reporting commit
can be resolved with `git log -1 --format=%H -- docs/developer/parallel-batch-06/grid-sort.md`.
Draft PR [#23](https://github.com/Structured-Growth/sg-ui/pull/23) targets `codex/dev`.

## Acceptance evidence

The predecessor [processing record](../parallel-batch-05/grid-processing.md)
already covers ordered sorting and stable ties in isolation. These new public
composition cases prove that the actual header and toolbar deliver coherent
controlled snapshots to that processing:

- Promoting the secondary rule changes its direction and priority while retaining
  the previous primary rule. One combined request resets pagination to page zero;
  tie-breaking visible row order matches the accepted rules.
- Clearing primary or secondary removes only that rule, preserves the survivor's
  direction and updates the processed page and owned direction indicator.
- Toolbar Reset changes only the draft; Apply emits the empty rule set and restores
  host source order. Non-sortable Course has neither a header sort trigger nor a
  toolbar option.
- Keyboard priority movement/Apply emits one complete ordered snapshot. Keyboard
  direction/removal/Apply cannot commit drafts prematurely; single-rule move/remove
  controls are disabled.
- A host that defers acceptance retains its controlled rules, rows and secondary
  direction indicator; reopening the toolbar reflects accepted priority.
- The public header wrapper clears by keyboard once and retains its indicator
  until the host updates its direction prop.

Two stories show accepted and pending host transactions. React Aria exposes
`aria-sort` for the primary rule; secondary direction is represented by the owned
indicator and menu selection, and complete priority by ordered toolbar fields.
This record does not claim an assistive-technology audit of those semantics.

## Validation

Read repository `AGENTS.md`, [development validation](../react-aria-development-validation.md)
and relevant public contracts before changes. No writes outside the assigned source,
test/story and report allowlist. Runtime unchanged, so central guidance was not edited.

- `pnpm install --frozen-lockfile`: passed on host Node 26.5.0 / pnpm 10.29.3;
  lockfile unchanged; existing ignored esbuild script warning retained.
- Tests and guards use Node 24.21.0 / pnpm 10.29.3 through existing
  `/tmp/sgui-run24.mjs`.
- `node /tmp/sgui-run24.mjs exec vitest run src/components/AppDataGrid/ownedGridSortAcceptance.test.tsx src/components/AppDataGrid/ownedGridParts.test.tsx src/components/AppDataGrid/components/header/TableHeaderSortMenu.test.tsx src/components/DataToolbar/components/DataToolbarSortMenu.test.tsx src/components/AppDataGrid/AppDataGrid.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx`:
  **6 files / 42 tests passed**, Vitest 4.1.11, 2.65 seconds. Tested unit/composed
  content matches `bf8369e`; later implementation commit changes only browser assertions.
- `node /tmp/sgui-run24.mjs typecheck`: passed.
- `node /tmp/sgui-run24.mjs foundations:check`: passed.
- `node /tmp/sgui-run24.mjs exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- After adopting reviewed dev ancestry and correcting native test entry/opening,
  the same six-file command passed **49 tests**, 2.78 seconds (includes inherited
  shell acceptance cases and two new Enter/Alt+ArrowDown composed cases).
  Source typecheck, browser typecheck and whitespace checks passed again.
- `git diff --check`: passed.

Browser evidence is pending coordinator-owned pooled validation. The idle standalone
waiter was stopped before acquiring/building. The coordinator explicitly authorized
merging the entire already-reviewed dev ancestry in infrastructure prerequisite
`6b9da4423f1e6675c37571d5552474da25e90258` with inherited files unchanged;
this bootstrap is separate from the sorting source allowlist. No harness edits
were authored here. The merged clean head is frozen for a staged fresh build,
types and `tests/browser/batch06-grid-sort.spec.ts --project=chromium --project=webkit`.
First frozen pool run `796118fa-e194-4614-b18a-465375e33618` at
`06899ff37df95a02b6c4e3f2cbcd23929e3dd992` passed fresh build/browser types,
but both engine cases failed at the initial plain ArrowDown opener. Native trace
shows the sort button focused, then grid row navigation; React Aria's grid-cell
capture handler intentionally reserves plain arrows and permits Alt+ArrowDown.
The browser scenarios now cover Enter and Alt+ArrowDown, retaining focused-menu,
snapshot, rotation, priority, disabled-control and return-focus assertions.
The additional composed regression verifies cell-first focus entry: directly
focusing a nested header trigger can leave the collection's roving focus key on
a body row. Entering via the header cell synchronizes its key and focuses the
trigger. Both supported activation keys pass the targeted composed regression.
No runtime change was required. Corrected pool `7a3d2ac9-c7ff-46a7-9606-8c81cfc1a419` at
`1ff1ba6e92c32958703e2091daf71f6bcc68c9af` passed fresh build/types and three
of four cases: Enter in both engines and WebKit Alt+ArrowDown. Chromium Alt opened
the correct menu with selected/focused state and visible focus ring but failed
Playwright's native focus assertion. Since that assertion requires both active
node identity and document activation, the next diagnostic spec captures native
focus/key events, activeElement and document.hasFocus() without weakening any
assertion. Isolated max-one diagnostic pool `2d971b9e-d544-419f-85b3-03d74c00b974` at
`3154be8bb6399da67d867912e3563d3003d45104` again passed fresh build/types and
three of four native cases. The failing Chromium attachment records
`document.hasFocus() === true` and native activeElement `role="menu"`, with
focusin/out history ending on the menu container; there is no native item focus
although React Aria's item reports focused state. Pool contention/document
deactivation are ruled out for this isolated reproduction.

Source inspection indicates a virtual-modality autofocus timing issue: programmatic
header entry establishes virtual modality. React Aria ignores Alt-modified events
for changing modality on Chromium's non-Mac Desktop Chrome user agent, while
Enter/WebKit's Mac user agent switch to keyboard. Its virtual focusSafely defers
item focus and declines to override an intervening focus target; menu-container
focus can leave collection focused-key state ahead of native item focus.
The unchanged native assertion retains this edge; replacing it with a state flag
or only testing Enter/real keyboard entry would lose coverage.

Reserved with the coordinator: `src/experimental/Menu/Menu.tsx` and colocated
regressions/fixture are outside this sorting allowlist. Investigate an owned
native-ref reconciliation when a newly opened menu still has container focus
and its enabled focused item exists, preserving first/last strategy and never
stealing focus outside the overlay. No shared Menu/runtime/harness edits were
made here. Native acceptance and source integration remain held pending that
reserved repair; **49 unit/composed tests pass, native 3/4 is incomplete**.

Per the human policy update relayed by the coordinator, automatic GitHub dev checks
are paused; no workflow files were changed or checks dispatched/waited for here.

Full check, complete browser suite and packed-consumer matrices were intentionally
not run under the targeted development policy. Firefox macOS launch is an existing
unresolved environment limitation and was not retried unchanged. Physical touch,
device and assistive-technology acceptance remain unverified. Broad G-08/U-17 and
G/U/X/R/Z gates remain open.

## Next bounded task

Audit multi-sort semantics with representative screen readers, including discovery
of secondary direction/priority and clear-sort announcements. Keep physical touch
sort-menu activation as a separate device acceptance task. First resolve the reserved shared Menu virtual-modifier autofocus defect above;
then run the unchanged sort browser assertions before integrating this source slice.
