# Batch 141: focused side navigation visibility

Parent tasks: M-13 / U-07. Bounded successor to batch 65, not broad acceptance closure.
Base: `164421fd639608a4afcfc013adda1d80ebf80cc7` in the new isolated managed
worktree `/Users/thomashall/.codex/worktrees/592a/sg-ui`.
The final clean commit and this report's hash are supplied in the coordinator handoff.

## Retained failure and attribution

Read the coordinator's durable state/reservations, wave43 early failure review and
additional native failure review under
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`.
Batch 141 reserves precisely the four files below plus this report. Earlier batch
65 and organization lifetime reservations are integrated/released. No shared state,
acceptance record, queue or worker checkout was modified.

Frozen failed checkpoint: `c7e4863c922e7b94fb9fef143307343850993bff`.
Root evidence:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818/evidence.json`.
The additional review records four Firefox failures (both themes, normal/enlarged
text), and four WebKit passes. Firefox focus assertions pass before full visibility
fails: normal text at Course collection 4; enlarged text at Courses. These are one
confirmed product visibility issue, not four underlying defects.

Read-only inspection of the normal/light screenshot shows the scroll clipping edge
near y=440 and the focused collection outline beginning near y=417, with its lower
portion hidden behind the collapse control. Those are approximate screenshot pixel
measurements, not retained DOM client metrics. Trace snapshots identify the padded
`.scroll` element inside flex `.menuContent` as the actual scrolling ancestor;
account and collapse controls sit outside it. The previous implementation delegates
reveal entirely to browser focus scrolling. The old trace's predicate returns only
a boolean: exact historical clientHeight/clientTop/scrollTop cannot be recovered
from that return value. No live diagnostic browser run is claimed.

## Prepared change

The owned scrollport now schedules a visibility measurement on the next animation
frame after focus capture, allowing native focus scrolling to occur first. It reads
current control bounds, computed outline extent, clientTop and clientHeight, then
minimally adjusts scrollTop within zero and scrollHeight minus clientHeight. This
uses the actual client area, excluding border and horizontal scrollbar space.
Already-visible controls do not move. The callback skips disconnected scrollports
and controls that no longer own focus; unmount cancels pending work. It does not
invoke focus, move host ancestors or alter horizontal/RTL scroll state.

Shared logical scroll-padding guides native focus scrolling. The existing hierarchy
story remains the fixture; its test now also covers RTL/compact scope with normal
and 200% text in both themes. Original LTR/comfortable cases and native key traversal
remain. Full ancestor bounds, hit testing, focus ownership and visible-outline
assertions are retained; additional checks require control plus outline inside the
scrollport's actual client area. Per-focus JSON attachments preserve measured bounds,
client dimensions and offsets for the coordinator's fresh run, including failures.

Colocated tests model post-native bordered-scrollport geometry for bottom clipping,
top clipping and already-visible controls, final native scroll changes and maximum
scroll bounds, unchanged RTL horizontal offsets, outside host focus and unmount
cancellation. Mocked geometry is unit evidence only and does not prove browser timing.

## Validation and limits

`git diff --check`: passed (static whitespace review only).
All unit tests, typechecks, foundation/token guards, builds and browser cases:
**UNRUN**, explicitly assigned to the coordinator. No installs, browser launches,
shared slot/queue mutations, CI operations, merge, push or publication occurred.

Pending coordinator validation on these exact bytes:

- SideNavigation unit tests, including organization lifetime companion coverage.
- Source/type and relevant owned foundation/token guards; browser-spec typecheck.
- Fresh Storybook and the complete changed batch65 native spec in Firefox and affected
  Chromium; WebKit remains pending unless run. There are eight cases per engine,
  retaining the four original cases and adding four RTL/compact cases.
- Inspect new geometry attachments to verify the measured client area, full outline
  visibility and unchanged focus/host routing throughout forward/backward traversal.

No green native or timing proof is claimed. Controls taller than the available
scrollport cannot be fully revealed by a bounded scroll correction; this patch
preserves bounded behavior rather than claiming arbitrary viewport acceptance.
Physical device, manual and assistive-technology checks and broad M/U/X/R/Z gates
remain open. No public prop removal or breaking API change is introduced.

## Prepared source ownership and SHA-256

| Owned file | SHA-256 |
| --- | --- |
| `src/components/SideNavigation/SideNavigation.tsx` | `50383939370498bf93119118d1b1c831d693ef59a12af48ef8feb43cc62b84f4` |
| `src/components/SideNavigation/SideNavigation.module.css` | `71e33ca47f7782ed899b75cefc5ef1970bc4d21a6176e5d209e788414f6cddb7` |
| `src/components/SideNavigation/SideNavigation.test.tsx` | `6ed6d8e64145f9681c79744399b41b79d8960eac2f960153e6f8771cd3bc8d61` |
| `tests/browser/batch65-side-navigation-native-flow.spec.ts` | `6871c317c2c79b972bc46542097433b6eb705324d85db936a8cba678cc3895cd` |
