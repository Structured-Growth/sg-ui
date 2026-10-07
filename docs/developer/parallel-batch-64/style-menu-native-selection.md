# M-30 native style menu and controlled selection

Base: `fc4f9fca9be4aaace869f0944baccaeed921e5b8`.
Scope: `src/components/TextStyleMenuControl/`,
`tests/browser/batch64-style-menu-native-selection.spec.ts` and this record.

Existing colocated tests covered all callback dispatch, missing callbacks,
keyboard activation/Escape, translated scoped portals and host-controlled checked
state. Existing browser editor/chrome tests exercise heading/typeface controls
or Lexical formatting, and the menu autofocus spec covers the shared primitive;
none covers this control's complete native selection composition. Typeface remains
the formatting toolbar's responsibility; no public API or translation changes.

The added NativeSelection story uses a single-line native contenteditable host.
The host captures a real noncollapsed DOM range on selectionchange. Its existing
eight callbacks operate on the fully selected sample, update accepted controlled
state, and restore the saved range/focus on the next animation frame after menu
dismissal. Clear replaces the selected sample without retaining ancestor styling.
The host cancels a pending restoration frame on unmount. This is a bounded example
adapter, not a general rich-document engine or a change to PageRichTextEditorSection.
Escape returns to the menu trigger; a separate host Return to selection action
restores the range. The control continues to own neither editor selection nor state.

F2 replaces callbacks and controlled checked state while the menu remains open.
F3 removes/restores Highlight and Clear Formatting callbacks. The host can reject
requests; this demonstrates that requests alone do not update checked state.
The browser spec selects using native Home/Shift+End and enters/operates the menu
with Tab/ArrowDown/Enter. Browser evaluation only observes focus/selection; it
does not install selection, synthesize focus, or invoke callbacks.

## Targeted local evidence

Node 24 from the authorized runtime PATH; dependencies installed with
`pnpm install --frozen-lockfile` under an atomically acquired install slot.
Commands below ran under atomically acquired light-validation slots:

- `pnpm exec vitest run src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx`: **7 passed**, including new open-menu callback/checked-state replacement and live availability regressions.
- `pnpm exec tsc --noEmit`: passed (source/stories).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed (imports/layers/tokens).
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

No product defect was established by these targeted checks, so the implementation
and public contracts are unchanged. The new checks extend behavioral coverage.

## Coordinator-owned native proof

The coordinator must compose the attributed candidate, build fresh static
Storybook once, and run:

```sh
pnpm exec playwright test tests/browser/batch64-style-menu-native-selection.spec.ts --project=chromium
```

The three prepared cases cover light/dark all-command selection handoff, checked
state after each host acceptance, clear availability, Escape and explicit host
selection return, plus live replacement/disabled callbacks and rejected requests.
Native execution is **pending**, not claimed passed. No browser/server/Storybook
build or full check ran independently. Firefox/WebKit remain deferred to the batch
checkpoint. Device/assistive-technology and broad M-30/editor acceptance remain
open. Only the coordinator reviews and accepts/integrates this slice.

See [editor menu contracts](../react-aria-editor-menus.md),
[formatting toolbar contracts](../react-aria-formatting-toolbar.md) and
[development validation policy](../react-aria-development-validation.md).
