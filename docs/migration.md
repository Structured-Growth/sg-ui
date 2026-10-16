# Learner platform extraction and consumer migration

Task references: W-11–W-18 (bounded documentation reconciliation).
Source: `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`, `apps/web/src/ui`.
The file-by-file [manifest](extraction-manifest.json) preserves original source
paths and destinations. Its `present` flags and migration replacement metadata
were reconciled in the [removal audit](developer/react-aria-removal-audit.md).
The [lineage reconciliation](developer/extraction-lineage.md) separates original
source identity from local Git evidence, deliberate AppButton replacements and
remaining early grid scenario dispositions. The learner platform remains outside
this migration; no upstream checkout is modified.

Components, helpers, stories and tests were initially copied, then adapted to a
standalone library. That extraction is provenance, not today's runtime architecture.
The catalog, grid renderer/reorder, editor, primitives, icons and public theme now
use owned contracts. Broad G/K/E/U/X/R/Z acceptance remains open; source and
[execution evidence](developer/react-aria-progress.md) outrank stale planning boxes.

## Source architecture and disposition

| Source concern | Extraction and current disposition |
| --- | --- |
| Shared components under `apps/web/src/ui/components` | Public names preserved where useful; implementations now owned |
| Original theme/typography and primitive/icon reexports | Replaced with scopes, generated tokens, owned typography/primitives and SVG icons; augmentation removed |
| State/pagination hooks | Public hooks retained; persistence now explicit opt-in |
| Extracted Storybook stories | Original story files/framework removed; docs website examples and private native fixtures use production scopes. [Scenario ledger](developer/docs-fixture-migration.md) preserves provenance; inventory growth is separate from original extraction counts |
| Router links/navigation | Framework imports replaced by host navigation adapter |
| Account/session operations | Replaced by host account adapter; credentials and endpoints remain host-owned |
| Translation provider | Host translation adapter with English/defaultMessage fallback |
| Learner grid model | Local presentation model; no API contract dependency |
| Due-date formatting | Extracted helper with behavior coverage |
| Application screens, API/contracts and session storage | Remain in learner platform; never library runtime dependencies |

## Component inventory

- Button
- AppDataGrid
- AppDataGridRowDnd
- AppDataGridShell
- AppInlineProgress
- AppModal
- AppOperationSteps
- AppPageHeader
- AppPageTabs
- AppShell
- AuthShell
- CardCollectionWithFooter
- CardPaginationFooter
- ClassCardFrame
- ColumnsLayoutModal
- ContentEditorChrome
- DataToolbar
- DocumentEditorLayout
- DocumentEditorToolbar
- EditableTitleField
- ExperiencePageNavigator
- FloatingTextSelectionToolbar
- ImageUploadModal
- InsertContentMenuControl
- InstructorClassCard
- LearnerClassCard
- LearnerClassesDataGrid
- LinkUrlModal
- PageRichTextEditorSection
- RichTextFormattingToolbar
- SideNavigation
- TextAlignMenuControl
- TextColorPickerControl
- TextStyleMenuControl
- Typefaces
- icons
- primitives


Also extracted: admin/instructor grid presets, activity icons and editor nodes/plugins.
New presentation APIs use Course naming; existing Class-prefixed exports remain for
compatibility. They are not implicitly deprecated or authorized for removal.

## Consumer migration mappings

Preserved component names do not imply preserved upstream props. Migrate against
owned types and the linked component contract rather than forwarding old prop bags.

| Previous integration | Owned integration and contract |
| --- | --- |
| Application `@ui` aliases or upstream imports | Public SGUI root/declared subpaths; relative imports inside SGUI |
| Automatic global theme styling | Import `/styles.css` once; Provider or ThemeScope around all compositions |
| Theme objects, palette overrides, augmentation | `theme="light\|dark\|system"`, density, generated tokens, CSS variables; [theme](developer/react-aria-theme.md) |
| `sx`, styling callbacks, upstream slots/polymorphism | Declared native className/style/ref and documented parts; [primitives](developer/react-aria-primitives.md) |
| Button click events/upstream variants | `onPress()`, `filled\|outlined\|text`, `primary\|neutral`, explicit submit/reset; [buttons](developer/react-aria-button.md) |
| Typography and Stack styling | Owned variant including bodyAlt2; independent semantic `as`; Stack `gap`; [primitives](developer/react-aria-primitives.md) |
| Icon fontSize/titleAccess/upstream SVG props | `size`, `label`, owned IconProps/native SVG ref; [icons](developer/react-aria-icons.md) |
| Grid engine types, events, slots, sortModel | Owned columns/row accessors, ordered sortRules, one client/server mode; [grid](developer/react-aria-catalog-grid.md) |
| Upstream row-selection model alias and nested identity | Owned Set alias and top-level string getRowId; existing selection config Set values remain |
| Independent shell/card/footer processing | One shared shell state owner; page zero before criteria callbacks; combined state snapshot for requests |
| Implicit browser storage | Opt-in persistence with distinct keys per view; controlled values win; [hooks](developer/react-aria-pagination-state.md) |
| Pinned metadata / unrestricted row dragging | Visibility locks and column order; bounded complete-page reorder with host persistence/rollback; [reorder](developer/react-aria-grid-reorder.md) |
| Theme-driven editor formatting and engine callbacks | Named owned actions and semantic color presets; [editor menus](developer/react-aria-editor-menus.md), [toolbar](developer/react-aria-formatting-toolbar.md) |
| Editor application services | Host save/upload callbacks and owned section lifecycle; [editor section](developer/react-aria-editor-section.md) |
| Modal/shell dismissal events and style slots | Owned reason/action callbacks, native slots and host adapters; [modal/shell](developer/react-aria-modal-shells.md) |
| Calendar upstream date classes | Serializable civil date/range/time values and explicit timezone conversion; [dates](developer/react-aria-calendar-contracts.md) |

Selection is now enabled when omitted. Pass `selection={false}` to retain the
original extracted wrapper's omitted-selection presentation. Existing
`selection.selectedRowIds` and its change callback already used Set values; only
the upstream model/event contract is replaced. See
[owned public defaults and validation](developer/react-aria-public-contracts.md) for
component-specific visual domains, dismissal reasons and field commit ownership.

The [card pagination](developer/react-aria-card-pagination.md),
[card frames](developer/react-aria-card-frames.md),
[page layout](developer/react-aria-page-layout.md),
[page navigation](developer/react-aria-page-navigation.md),
[editor dialogs](developer/react-aria-editor-dialogs.md),
[editor layout](developer/react-aria-editor-layout.md) and
[data toolbar](developer/react-aria-data-toolbar.md) contracts provide per-component
breaking mappings. Translated Course-named preset factories coexist with existing
Class exports; see [presets](developer/react-aria-grid-presets.md).

## Changed defaults and compatibility names

Use the built public declarations for the version being adopted. The migration
changes above include these consumer-visible defaults and ownership rules:

| Concern | Current behavior / required migration |
| --- | --- |
| Button / removed AppButton | Import `Button` and `ButtonProps` from the root, components barrel or `/components/Button`. AppButton/AppButtonProps were removed before first release; historical evidence keeps its original names. Button defaults to `type="button"`, `variant="filled"`, `tone="primary"`; set submit/reset explicitly and use `onPress` without an upstream event. |
| Scope / Menu density | General scopes default to comfortable. Generic Menu inherits scope density; catalog menu wrappers explicitly choose compact. Set a local scope or supported density prop instead of assuming all menus are compact. |
| Typography tones | Use default/muted/subtle/accent/danger. `primary` is a compatibility alias for accent, not an action-priority label; semantic `as` and visual variant are independent. |
| Grid selection | AppDataGrid selection config uses `ReadonlySet<string>` input and `Set<string>` change requests. Supply stable top-level getRowId; reconcile retained IDs in the host. Do not forward an engine include/exclude object. |
| Pagination / persistence | Pages are zero-based. Criteria/page-size changes request page zero first. Persistence is opt-in with distinct keys; controlled values remain authoritative. |
| Preserved names | Class-prefixed names, AppThemeProvider and AppPaginationFooter remain supported exports, not an inferred deprecation schedule. The CardPaginationFooter directory/subpath exports AppPaginationFooter. `/experimental` is a proof entry point; do not rename public App components to match it. |

For example, after the application imports the stylesheet and provides its theme:

```tsx
import { useRef } from "react";
import { Button, type ButtonProps } from "@structured-growth/sg-ui/components/Button";

export function SaveDraft({ onSave }: { onSave: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const variant: ButtonProps["variant"] = "outlined";
  return <Button ref={ref} variant={variant} tone="neutral"
    onPress={onSave}>{"Save draft"}</Button>;
}
```

This synchronous callback requests a host action; it does not persist a record or
model asynchronous saving. Async hosts own completion/error state and supply it
through the supported loading/disabled props. See the [adoption checklist](developer/react-aria-adoption-checklist.md).

## Adoption and remaining limits

The [read-only adoption checklist](developer/react-aria-adoption-checklist.md) is
planning guidance for the learner platform or another host. Application modification,
original-source removal and production rollout require a separately authorized task.
SGUI accepts models, data, routing, translations and account actions from the host;
it never imports platform contracts or owns API/database/login policy.

True grid pinning, expansion/editing and spreadsheet capabilities remain deferred.
Reorder is restricted to a complete single-page dataset and requires host persistence
and rollback. Advanced scheduling/recurrence and fiscal calculation are not calendar
features; hosts can supply explicit presets. Calendar range-preview announcements,
actual IME/device behavior, assistive-technology output and broader rich-content trust
still need acceptance. See [browser evidence](developer/react-aria-browser-acceptance.md)
and [calendar limits](developer/react-aria-calendar-contracts.md).

React 18.3/19 and representative packed Vite SSR/hydration, React Server Component
and Next.js consumers have evidence in [server boundaries](developer/react-aria-server-components.md)
and [runtime validation](developer/react-aria-runtime-ci.md). That does not certify
every host/framework/device. `/experimental` contracts remain proofs; no new
compatibility promise is made for them. Public breaking removals need documented
migration and a breaking Conventional Commit/release marker; preserved Class/App
names must not be renamed casually.

The interaction engine is private, but replacing React Aria still costs engineering:
reimplement focus, keyboard, collections, overlays, locale and date behavior; preserve
owned observable contracts; rerun browser/accessibility/SSR/package acceptance; and
review dependency licenses. Engine independence does not imply automatic portability
to another framework.


Support decisions still required are recorded in the [dependency policy decision record](developer/react-aria-dependency-upgrades.md#human-decision-record-required-for-operational-acceptance): supported-release/backport window, routine review cadence and accountable maintainer, confidential intake and disclosure authority. This guide does not establish a support service, response SLA or deprecation schedule. Resolve those decisions before claiming operational support acceptance.

Commercial terms and third-party notices remain authoritative. Local validation
does not publish packages; Actions handles semantic-release after approved merges.
Final legal/historical-reference and exact-artifact audits remain open. No first
release, owner configuration or migration completion is claimed here.

See [guidance provenance](agent-guidance-migration.md),
[architecture](developer/component-architecture.md) and
[AGENTS.md](../AGENTS.md) for retained development conventions.
