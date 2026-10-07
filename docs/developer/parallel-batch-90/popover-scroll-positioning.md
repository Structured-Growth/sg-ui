# Popover ancestor-scroll positioning correction

Task references: U-19 / U-07. Batch90 reserves only the owned Popover
implementation, colocated tests/stories and this record. Baseline:
`88f65883d3bfe636cc98af00d29ae869402510c4` on `codex/dev`.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch90-popover-scroll/sg-ui`.
Branch: `codex/batch90-popover-scroll`.

## Cause and implementation

The coordinator supplied Batch89's read-only classification at
`8ebf2a1c8620416cb294bf1d1c6a53d41f2f140b`. The retained wave41 Chromium run
passed sixteen viewport cases and failed all sixteen ancestor-scroll cases after
actual 32px host movement. That evidence remains historical, not validation of
this correction. See the earlier [collision contract](../parallel-batch-83/popover-native-collision.md).

Local inspection of the installed React Aria source maps confirms that modal
`usePopover` passes `onClose: null` to positioning. The positioning hook observes
sizes/resizes but does not reposition on ordinary ancestor scrolling. Its separate
close-on-scroll path deliberately skips null. Merely resizing an ancestor does
not describe positional movement from native scrolling.

[Popover](../../../src/experimental/Popover/Popover.tsx) retains DialogTrigger's
state/trigger context, Dialog/Heading naming, React Aria modal behavior, focus
containment/restoration, outside/Escape dismissal and accessible dismiss buttons.
An internal open-only native overlay composes `usePopover` with its positioning
disabled and one active `useOverlayPosition` owner. The latter provides the live
update callback, the same 8px gap, collision flipping, locale-based start/end
placement, sizing and focused-content scroll anchoring. Explicit `onClose: null`
prevents its legacy trigger close-map fallback; undefined would close the draft.

An open-only passive document capture listener catches native non-bubbling scroll
and updates when its source is a current trigger ancestor or the document viewport.
It ignores dialog/descendant and unrelated-region scrolling. It removes the exact
callback/capture subscription on replacement, close and unmount. Reopening mounts
fresh interaction hooks. There is no synthetic global resize, polling, permanent
owned listener, MutationObserver or upstream configuration/dependency change.
Owned scope, native ref direction, CSS classes, resolved placement and trigger
geometry variables remain on the overlay. No public props/types change.

The [ScrollHost story](../../../src/experimental/Popover/Popover.stories.tsx)
lets a host ancestor move while an editable draft stays open.

## Targeted validation

Node 24 path: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin`.
All final checks ran serially under an atomically acquired canonical
`/tmp/sgui-light-validation-slots/slot1` with owner `batch90-light` and
matching-owner cleanup. No occupied slot was reclaimed.

- `pnpm exec vitest related --run src/experimental/Popover/Popover.tsx`: **27 files,
  188 tests passed**, start 16:32:22 execution-host time, duration 8.49s.
- `pnpm typecheck`: passed, including the changed story.
- `pnpm foundations:check`: passed owned import/layer/token guards.
- `git diff --check`: passed.

The colocated regressions verify 32px ancestor repositioning, another 16px
viewport movement, stable dialog identity, focused unsaved text, no scroll-induced
dismissal, ignored internal scrolling, exact listener cleanup across close/reopen/
unmount, Tab containment and one outside dismissal with source-focus restoration.
Existing controlled state, nested menu and theme/density/token/direction cases pass.
Related consumers include toolbar/editor/calendar/modal/grid compositions.

Intermediate failures were corrected before the final checks: merging native
position styles initially omitted scope token overrides, and leaving owned
positioning `onClose` undefined triggered React Aria's legacy scroll-close map.
The listener test initially counted all registrations rather than current active
subscriptions; it now proves one live owned listener and cleanup of every replaced
callback. Behavior expectations were preserved.

`pnpm install --frozen-lockfile` passed with unchanged lockfile. The baseline's
older pool helper incorrectly used `slot-0` for that install; its matching-owner
lease was released and the coordinator notified. Remaining checks used canonical
`slot1`; the corrected helper belongs to another reserved batch.

## Pending native acceptance

No Storybook build, package build, native suite or full check ran in this worker.
The coordinator must independently review and run all **32 fresh Chromium collision
cases** against these actual production bytes, because the internal positioning
path affects both historical viewport and ancestor-scroll branches. Batch89 owns
fixture/spec diagnostics; this correction changes none of those files or assertions.
The source reservation remains held until that Chromium pass. Firefox/WebKit,
physical-device and assistive-technology evidence and broad U/X/R/Z gates remain
pending. Unit geometry/lifecycle evidence does not establish native placement or
spoken accessibility acceptance.
