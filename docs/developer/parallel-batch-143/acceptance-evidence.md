# Batch 143: editor chrome native failure attribution

Parent links: [M-33 and U-07](../react-aria-master-task-list.md).
This is a partial diagnostic/test preparation slice, not a product fix or broad
acceptance closure. Both underlying issues remain unclassified pending fresh
coordinator validation.

## Ownership and snapshot

- Managed isolated worktree: `/Users/thomashall/.codex/worktrees/c025/sg-ui`.
- Branch: `codex/batch143-editor-chrome-attribution`.
- Worker baseline: `164421fd639608a4afcfc013adda1d80ebf80cc7`.
- Historical tested checkpoint: `c7e4863c922e7b94fb9fef143307343850993bff`.
- Exclusive reservation: `tests/browser/inventory-editor-chrome.spec.ts`,
  `src/components/ContentEditorChrome/ContentEditorChrome.stories.tsx`, and this report.
  Only the spec and this report change. The story remains byte-identical.
- Read the durable coordinator state and both `wave43-early-failure-review.json`
  and `wave43-additional-native-failure-review.json` before edits. Batch 143 reserves
  the above files. No shared state, acceptance ledger, queue or lease was changed.

The checkpoint spec is byte-identical to the worker baseline (SHA-256
`28e39c44c8b3a570729d76d3f456c0ec678576331aef8a4135a98eecb40ba7ff`). The story,
DocumentEditorToolbar implementation/CSS and Select implementation were compared
directly with the frozen checkpoint and are byte-identical before this preparation.

## Retained evidence

Root: `/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818`.
The root `evidence.json` read during this investigation has SHA-256
`1219120bd3640fad7013862fa4673f9bee5d528f3f325855cc05f8a5b043128a` and records
the checkpoint head above. The `editor-chrome-native/results.json` receipt in the
early review is `989fdd8433e2d81ce6d297a5c32d1c17e3ca3d87914762230135028435fb3d27`:
five expected, three unexpected, zero skipped/flaky cases across Firefox/WebKit.
These are historical outcomes, not results for this prepared patch.

Under `editor-chrome-native/traces/`, inspected `1-trace.trace` entries:

| Case directory | Trace entry SHA-256 |
| --- | --- |
| `inventory-editor-chrome-co-11ff5--live-states-light-200-text-firefox` | `4d3f9f1820f60e1a6b6434ab03982d77adfd7ae256a16f7a0460bc521ea5c682` |
| `inventory-editor-chrome-co-f89cf-d-live-states-dark-200-text-firefox` | `1cddbcc9f8eb1aa5717c578441570af68e90f52f6e261f60009a31fe828a1d39` |
| `inventory-editor-chrome-co-f89cf-d-live-states-dark-200-text-webkit` | `d5e639cf791e3b868cf2a3b48fd94c8d2a55e4695414af77789a27e5812a600a` |

## Firefox heading clipping

Both enlarged-text cases fail the original visibility predicate after the heading
trigger's `toBeFocused` succeeds. The light screenshot shows the H1 button's lower
edge clipped at the 900px viewport bottom. The trace calls `Frame.focus` on the
heading (`call@619`), not native Tab traversal, immediately before that assertion.
No recorded ancestor scrollport metrics establish which element should scroll,
or whether a native Tab entry shares the failure. This is therefore not yet a
confirmed keyboard-navigation product defect.

The original focus call and full-bounds/center-hit predicate are retained.
`programmatic-focus-geometry` now attaches the actual rectangle, active-element
identity, viewport, page scroll, center hit and every ancestor's rectangle,
overflow and scroll metrics before asserting. Two additional light/dark 200% tests
exercise real Tab traversal after the optional groups are removed and restored.
They bound each target reach to 24 native key presses and attach every observed
active element and document-focus state. WebKit on macOS uses Option+Tab; other
platforms/engines use Tab. No target focus/scroll injection is used in these new
cases. Each reached control must remain focused across two animation frames and
pass the same complete viewport-bounds/center-hit requirement.

## WebKit observer warning

The retained dark 200% trace emits
`ResizeObserver loop completed with undelivered notifications.` at time
`38333.187`, during the **first heading Enter** (`call@1039`, start `38313.806`,
end `38334.085`). It precedes the first listbox visibility assertion, heading
commit and all host file-menu interactions. The final errors assertion discovers
the retained message later; it does not identify when it happened. The warning has
an empty stack and location line/column zero. All earlier behavioral assertions
pass in this historical WebKit case.

Read-only installed source-map inspection establishes relevant observer candidates:

- Owned Select composes the React Aria Select/Popover/ListBox and the shared
  ComboBox popover CSS; it creates no direct observer.
- Installed `react-aria-components@1.21.1` Popover measures trigger width with
  `useResizeObserver` and updates its `--trigger-width` state.
- Installed `react-aria` `useOverlayPosition` observes overlay and target; its
  `updatePosition` synchronously writes overlay position/maxHeight and scroll.
- The native host story renders ContentEditorChrome, DocumentEditorToolbar and a
  contenteditable div. It does not mount FloatingTextSelectionToolbar. That separate
  component's observer is not a supported explanation here.

These candidates do not establish which observer delivered, whether CSS feedback
caused the warning, or an environment cause. No production reservation is requested
on speculation. After observer/geometry evidence identifies a product owner, the
coordinator must reserve the exact runtime files before any production edit.

The spec now records bounded observer creation stacks, observe/unobserve/disconnect,
native delivered target identities/content sizes, inline styles before/after the
callback, phase/time and native error events. It forwards callbacks synchronously
with the original observer receiver/arguments and propagates exceptions. It performs
no layout measurement inside observer callbacks, suppresses no warning, changes no
delivery scheduling and calls no error `preventDefault`. The afterEach attachment
survives a failed assertion. Instrumentation adds execution overhead; even a green
diagnostic run would not alone prove that the original uninstrumented warning is
resolved. Do not accept a timing-sensitive disappearance as a product fix.

## Checks and next validation

`git diff --check` passed. Read-only trace/source/byte comparisons completed.
Source/browser typechecks, guards, unit tests, Storybook build and browser tests
are **UNRUN**, as assigned: the coordinator owns actual validation. No install,
build, browser run, CI action, push, merge or publication was performed.

The prepared spec contains six cases per engine: the four retained composition
cases plus two native Tab cases. Coordinator validation should focus first on
Firefox enlarged composition/native Tab and WebKit dark enlarged composition.
Retain all red results and attachments. Use a fresh reviewed static build under
the [parallel browser policy](../react-aria-parallel-browser-validation.md) and
[targeted validation policy](../react-aria-development-validation.md).
The observer/scroll-owner findings determine the next bounded runtime reservation;
M-33/U-07 and broad native/device/assistive-technology gates remain open.
