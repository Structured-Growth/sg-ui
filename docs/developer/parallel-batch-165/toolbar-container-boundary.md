# Batch 165: toolbar container boundary

Parent C-08; bounded implementation and prepared native cases only. No parent
acceptance closure, physical-device or assistive-technology claim.

## Isolation and implementation

Managed worktree `/Users/thomashall/.codex/worktrees/befc/sg-ui` was clean and
detached at the authorized dev baseline
`1948d0b54688cf61dfa6708fd94cbc8ca6e21990` before edits. Worktree inventory
confirmed it was distinct from the primary checkout, dev integration and other
workers. Branch: `codex/batch165-toolbar-container-boundary`. No foreign worktree,
primary image-upload work, shared ledger or task list was modified.

Reviewable source commit: `22e736f3598bc82f38c59877d3d35ca3a62162bc`.
The root establishes named inline-size containment; the compact search query
targets its descendant at a content-box width of at most 24rem. The former viewport
query is removed. Existing flex wrapping, host actions and public props remain.
The contract documents external width allocation, intrinsic-size consequences,
nearest same-name ownership, portal separation and enlarged-label focus needs.

## Actual lightweight evidence

Runtime: Node v24.21.0; pnpm 10.29.3. `pnpm install --frozen-lockfile` passed
under owned canonical install slot 0. The helper checked both canonical/legacy
claims; it did not reclaim or alter foreign batch85 light slot 0. Unit/type/guard
checks used owned canonical light slot 2 and released only owned leases.

- `pnpm exec vitest run src/components/DataToolbar/DataToolbar.native-composition.test.tsx`:
  passed 3 tests, including independently hosted search state, host resize,
  action-menu callback/focus return and search Escape isolation.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

Checks ran against the source working tree before the source commit; the final
native geometry assertions were then added and browser TypeScript rechecked at
the committed source head. Local ignored logs: `artifacts/batch165/`.
jsdom evidence verifies composition/state/focus requests, not container geometry.
No failed checks were suppressed; installation reported its existing ignored
esbuild build-script warning and completed successfully.

## Prepared coordinated native selection

Unique spec: `tests/browser/toolbar-container-boundary.spec.ts` (two cases,
normal and enlarged owned label/body tokens). Stories: ContainerBoundary and
ContainerBoundaryEnlarged. Both use a fixed 1440px viewport with independent
320px/800px hosts inside a 1120px same-name ancestor.

Assertions cover named root containment, exact 160px/240px search widths, narrow
action/search wrapping versus wide alignment, inline control bounds and search/
close geometry, host expansion to 640px without sibling adaptation, retained
independent text, native focused-input shrinking back to 320px, visible keyboard
focus, keyboard menu entry/action/return, menu viewport bounds and search Escape
without clearing sibling text. Runtime page errors must remain empty.

**Request coordinator validation:** freeze the reviewed source head and run this
unique spec against a freshly built static Storybook under the authorized shared
resource protocol, Chromium first, then the queued Firefox/WebKit checkpoint.
No Storybook build, native browser execution, full check or full suite was run by
this worker. Native geometry, real engine focus/placement and enlarged-label
results remain unverified until those coordinated runs. Broad C/U/X/R/Z and
device/assistive-technology acceptance remains open.

## Source SHA-256 at the reviewable source commit

| Allowed source file | SHA-256 |
| --- | --- |
| `src/components/DataToolbar/DataToolbar.module.css` | `501d1362651cd9c14b242c131a557d4fac6129fcba6778a7ad6fa9c2f510eb78` |
| `src/components/DataToolbar/DataToolbar.stories.tsx` | `b2a0ff0536ea1f7878cfd366edfa5473368819ec1fa7638ebd4d5a31e4b2b12e` |
| `src/components/DataToolbar/DataToolbar.native-composition.test.tsx` | `76898a5d27f1df481e573f51b668f849a35f33ebc6403ee38e3571bf3e73ecba` |
| `docs/developer/react-aria-data-toolbar.md` | `7c80e7f363584d717df17550f99331c8a7639d458014a09a0be65f5624df0522` |
| `tests/browser/toolbar-container-boundary.spec.ts` | `5f5a6558915fda16abe0554bd2128b11d3de3011dcf6602591b4ec56264a32ae` |

The evidence record is committed separately; its final hash and complete branch
head are reported to the coordinator rather than self-embedded.
