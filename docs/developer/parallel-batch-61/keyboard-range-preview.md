# Batch 61 keyboard range preview — K-17 partial

Base: `fc4f9fca9be4aaace869f0944baccaeed921e5b8` (verified isolated managed worktree).
Worktree: `/Users/thomashall/.codex/worktrees/batch61-keyboard-range-preview/sg-ui`.

## Change and scope

Existing visible range previews, preset descriptions and unavailable-date explanations were already implemented. This slice adds the missing accessible association from the actual focused range endpoint to the visible preview and a translated visible context paragraph. Context distinguishes the first activated anchor, focused endpoint and unchanged draft, including reverse selection. The preview uses the existing React Aria highlighted range and focused date; there is no parallel selection state or host commit.

Only the focused cell receives preview description references. Moving focus removes those references from the prior cell. The private native-ref bridge keeps complete localized date labels and preserves unrelated description references; completion, Cancel, blur, host endpoint replacement and reset remove pending descriptions through existing anchor invalidation. Same serialized host values preserve the pending selection. The existing preview no longer adds a `role="status"` announcement on each arrow; descriptions are associated with the focused endpoint, alongside the interaction engine's own announcements. Existing availability/draft status behavior is unchanged.

React Aria constrains pending traversal before unavailable days. The preview describes the constrained focused endpoint rather than implying that an unavailable endpoint can be selected. No public APIs, DateOnly contracts, min/max, validation, form submission or Apply/Cancel behavior changed.

Exclusive changed files:

- `src/experimental/DateRangeSelector/DateRangeSelector.tsx`
- `src/experimental/DateRangeSelector/DateRangeSelector.module.css`
- `src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`
- `src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx`
- `tests/browser/batch61-keyboard-range-preview.spec.ts`
- `docs/developer/parallel-batch-61/keyboard-range-preview.md`

## Targeted evidence

Node `v24.19.0`, using the requested bundled runtime PATH. Frozen-lockfile installation completed under atomically acquired install slot0, released on completion. Local validation acquired/released light slots; no foreign lock was removed. No independent build, server, browser execution, full check or GitHub action was run.

- `pnpm exec vitest run src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`: 16/16 passed.
- `pnpm exec vitest related --run src/experimental/DateRangeSelector/DateRangeSelector.tsx`: 20/20 across 3 files passed (selector, range picker, picker). Rerun after the exploratory probe described below.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.

Regressions exercise reverse preview association, moving descriptions to the new focused cell, complete localized day names, unchanged committed form values, pending Apply disabling, completion without commit, unavailable-boundary constraint, Cancel, same-value host replacement and changed-value host replacement. Existing related tests cover the reset/blur/preset/typed-edit transaction contracts.

The new `FocusedEndpointPreview` story keeps controlled committed values and commit count visible. The narrow native spec exercises light/dark keyboard unavailable-date focus and rejected activation, anchor/endpoint association, constrained traversal, unchanged committed data and native Cancel.

Coordinator command after composing the attributed candidate and building Storybook once:

```sh
pnpm exec playwright test tests/browser/batch61-keyboard-range-preview.spec.ts --project=chromium
```

The existing `tests/browser/batch01-calendar.spec.ts` remains useful affected coverage for leap/month previews, reset and picker interactions. Browser execution belongs to the coordinator's shared candidate.

An exploratory unit assertion manually injected a foreign native `aria-describedby` reference after mounting; it failed on the subsequent upstream cell rerender because React Aria owns and rewrites that attribute. That arbitrary post-mount native mutation is not an exposed consumer contract. The probe was removed; the bridge retains the existing merge/remove-only-owned-reference behavior at each attachment. No supported keyboard, availability or draft behavior assertion was weakened.

## Proposed shared documentation edits for the coordinator

In `docs/developer/react-aria-calendar-contracts.md`, change the range-preview wording from a translated preview *status* to a visible translated preview and focused-endpoint description. Document the context paragraph's anchor/focused endpoint/draft distinction; explain that the association moves with actual interaction focus and clears with anchor invalidation. Explain that preview arrows do not add an extra live status announcement, while existing engine and draft/availability announcements remain. The native-ref bridge now owns preview references as well as availability references and preserves unrelated IDs.

Do not mark K-17 complete or edit the master task list. No shared contract files were changed in this worktree.

## Remaining gates

Fresh focused Chromium execution is pending coordinator composition/build. Firefox/WebKit are deferred to the accumulated checkpoint. Live assistive-technology output, localized-calendar/device/touch matrix and broad K-17 remain unverified. DOM association and removal assertions do not prove screen-reader announcement timing or conformance. No release, main integration, publication, workflow permission or secret changes.
