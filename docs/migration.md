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
[execution evidence](developer/archive/2026-10-18-task-lists/react-aria-progress.md) outrank stale planning boxes.

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

Use the [built public boundary index](developer/react-aria-public-boundary-index.md) for exact exported names, aliases, callable children and value domains. The [inherited styling migration map](developer/react-aria-inherited-styling-migration.md) accounts for removed upstream styling, system and slot props per component. Native `className` and style ownership remain component-specific; InstructorClassCard.className is retained course-name content, not a CSS class.

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

The [distribution decision](developer/react-aria-import-boundaries.md) keeps the existing package and declared granular subpaths. Those boundaries avoid editor/grid code in basic consumer module graphs; they do not remove mandatory editor dependencies from installation. Root convenience imports remain supported.

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

## Removed baseline exports

The following table accounts for all twelve absent baseline export names in the
[reviewed public-symbol join](developer/final-acceptance/wave-03-35/public-symbol-dispositions.json).
It describes migration from the extraction baseline. It does not promise inherited
prop compatibility or establish a released version/deprecation deadline.

| Removed export | Consumer replacement | Required change |
| --- | --- | --- |
| `AppButton` | Button | Removed pre-first-release AppButton name; update imports and onClick to onPress; owned variant/tone/density and native class/style. |
| `AppButtonProps` | ButtonProps | Rename type and migrate inherited upstream action/style prop surface to owned ButtonProps. |
| `FormControlLabel` | Checkbox / Switch label; RadioGroup option labels | Wrapper removed; put labels directly on the owned control, preserving its accessible name. |
| `FormControlLabelProps` | CheckboxProps / SwitchProps / RadioGroupProps | Removed upstream wrapper props; use declared control label/options contracts. |
| `MuiLink` | Link | Removed branded export; use owned Link and host navigation adapter with native anchor ref. |
| `MuiLinkProps` | LinkProps | Replace upstream props with owned LinkProps/native anchor contract. |
| `MenuItemProps` | MenuItem | MenuItem runtime component removed; current MenuItem is an item-record type passed to Menu.items, not JSX. |
| `SelectChangeEvent` | SelectProps.onValueChange | Removed synthetic upstream event; callback receives string or null. |
| `AppGridSortModel` | AppDataGridSortRule[] | Replace engine sort model with owned ordered field/direction rules; no upstream grid model type. |
| `darkTheme` | Provider / ThemeScope theme="dark" | Remove upstream theme object; load styles.css and use owned scope/tokens. |
| `lightTheme` | Provider / ThemeScope theme="light" | Remove upstream theme object; load styles.css and use owned scope/tokens. |
| `theme` | Provider / ThemeScope | Remove upstream default theme object; use explicit owned scope and token overrides. |

`MenuItem` is now an item-record type for `Menu.items`; do not render it as a JSX
component merely because its type name remains. `SGLink` and `Autocomplete` are
retained aliases for owned Link and ComboBox; preserved names still use the owned
contracts. No deprecated-name removal schedule is implied. See the
[public contracts](developer/react-aria-public-contracts.md) for callback and
empty-value ownership, and the existing component mappings above for styling,
typography, pagination, selection, icons and changed defaults.

Breaking removals require a breaking Conventional Commit marker and reviewed
release notes. Release numbering stays with semantic-release; this table neither
changes versions nor authorizes promotion from dev to main.

## Adoption and remaining limits

The [read-only adoption checklist](developer/react-aria-adoption-checklist.md) is
planning guidance for the learner platform or another host. Application modification,
original-source removal and production rollout require a separately authorized task.
SGUI accepts models, data, routing, translations and account actions from the host;
it never imports platform contracts or owns API/database/login policy.

### Shipped limits and host responsibilities

| Area | Current boundary |
| --- | --- |
| Grids | True sticky/pinned columns, arbitrary row-detail editing/expansion and spreadsheet capabilities are not supplied. Section-subheader collapse is a separate shipped contract. Reorder requires a complete unsorted/unfiltered single client page; hosts own persistence, pending/error and rollback. Server rows/query translation, page totals and stale-response authority remain host-owned. See [grid contracts](developer/react-aria-grid-contracts.md) and [reorder](developer/react-aria-grid-reorder.md). |
| Date and scheduling | Civil dates and local times have no implicit host timezone. Hosts supply availability/business rules and explicit instant conversion. Recurrence, resource scheduling and booking/conflict/persistence workflows are separate future work; explicit presets are supported. See [calendar contracts](developer/react-aria-calendar-contracts.md). |
| Application integration | Hosts own routing, account actions, translations, datasets, persistence and rich-content trust policy. The library supplies presentation/interactions and bounded callbacks, not application services. See [adoption responsibilities](developer/react-aria-adoption-checklist.md). |
| Environment evidence | React peer ranges, Node minimum and accepted Vite/Next SSR/hydration fixtures are declared/tested inputs, not certification of every framework, device or allowed patch. Browser/IME/touch observations retain their [recorded scope](developer/react-aria-browser-support.md). Live-region DOM feedback is not spoken screen-reader verification; remaining representative AT/environment and performance-budget decisions stay in the [current acceptance checklist](developer/backlog.md). |
| Public proof entry | `/experimental` contains shared implementations and proof contracts. Its name does not rename the public catalog or promise unimplemented features. Use the actual exported prop types and [public contract guide](developer/react-aria-public-contracts.md); do not expose React Aria objects/types through a host adapter. |

### Explicit future scope

The following original IDs remain outside the required milestone unless selected
by the user. Their [canonical definitions](developer/backlog.md#deferred-features)
remain authoritative; this list neither implements them nor makes required work optional.

| Future ID | Separate product work |
| --- | --- |
| FUT-A-20 | Share tokens/CSS and framework-independent models with another framework, with separate wrappers, tests and support decisions. |
| FUT-D-21 | Token-to-design-tool export; no manually maintained second palette. |
| FUT-G-24 | Grid export/import, aggregation/pivoting, tree data, range/paste/formula/undo and spreadsheet navigation. Existing copy and editor-table selection do not supply this grid feature set. |
| FUT-K-13 | Recurrence UI and explicit host-owned recurrence processing. |
| FUT-K-14 | Resource/week/day scheduler with overlapping events, slots/capacity, drag/resize, keyboard alternatives and virtualization. |
| FUT-K-15 | Appointment/course-session/booking compositions; hosts retain availability, conflicts, reservations, permissions and persistence. |

### Names, defaults and release impact

AppButton/AppButtonProps are removed names; use Button/ButtonProps. Upstream prop
bags, style systems and grid model/event aliases have explicit replacements in
[consumer migration mappings](#consumer-migration-mappings). Removed names are not
current deprecated aliases. AppThemeProvider, AppPaginationFooter, Class-prefixed
names, SGLink, Autocomplete and Typography's primary-to-accent compatibility mapping
remain according to their actual exported contracts; no removal date or deprecation
schedule is implied. Native/inherited React DOM deprecated properties retained by
the declaration inventory do not establish an SGUI alias-retirement policy.

The accepted [public contract snapshot](developer/react-aria-public-contract-acceptance.md#frozen-contract-reconciliation)
records removed contracts and changed omitted behavior; the maintained
[migration map](../packages/ui/scripts/public-migration-map.json) records six
source-owned default changes. Optional type syntax alone does not prove a runtime
default. Explanations include AppDataGrid's now-enabled omitted selection and the
calendar navigation/range-click/field defaults. A surviving component name does
not make a changed callback/default compatible.

The actual `339c958d` breaking marker is verified in the
[release-safety receipt](developer/final-acceptance/wave-04/02/release-marking-safety/receipt.json).
Public incompatibility requires a migration and an actual `!`/`BREAKING CHANGE:`
marker in the history analyzed on main. Initial extraction is provenance, not
proof that an API was published. Configured first publication starts at 1.0.0;
a major after an existing 1.4.2 becomes 2.0.0. Semantic-release owns versioning;
no version is edited by hand, and dev integration authorizes no production release.

### Current maintenance and future React Aria replacement

The [dependency procedure](developer/react-aria-dependency-upgrades.md#current-pre-release-maintenance-policy)
documents current pre-release maintenance: latest integration on dev, role-based
author/maintainer review, affected validation and separately approved main promotion.
React 18.3/19 and representative consumer evidence are linked from
[server boundaries](developer/react-aria-server-components.md) and
[runtime validation](developer/react-aria-runtime-ci.md). Neither a service SLA,
published-release backport window nor security contact is established here;
commercial support commitments require the actual agreement. Earlier unapproved
operating-policy templates are retained as future owner choices, not an invented
open L-09 documentation gate or a new compatibility promise.

React Aria is private interaction machinery, so replacement can preserve consumer
names/types; it does not remove the engineering work. A separately authorized
maintainer infrastructure change must account for these costs:

| Work and responsibility | Required preservation/review |
| --- | --- |
| SGUI interaction maintainers: adapter/control replacement | Focus entry/restore, keyboard/pointer/touch/press semantics, cancellation, selection/collections, overlays/portals, validation, form wiring, locale/date behavior and announcements must preserve owned observable contracts. Replace shared owners before reviewing their transitive compositions. |
| SGUI foundation maintainers: scope and public API | Preserve owned refs, callbacks, token/CSS layer contracts, controlled-state authority, SSR/hydration and React peers. Audit exported declarations/import graphs; engine-private types must remain private. Lexical document formats and TanStack row-processing responsibilities are separate systems to preserve. |
| Change author and reviewers: evidence and distribution | Reuse assertions, add affected behavior regressions, and revalidate applicable native/AT/visual/consumer/type/package contracts against the new implementation. Record measured bundle/performance effects, dependency/license/notice changes and consumer migration/release impact. No automatic equivalence follows from matching prop names. |
| Host teams: integration acceptance | Revalidate their routing, persistence, localization, content/trust and production workflows. The engine swap does not transfer backend or saved-data responsibility into SGUI. |

No replacement engine, schedule, person-day budget or comparative performance
advantage is selected. A new framework needs separately owned wrappers/tests and
support policy under FUT-A-20; replacing one React interaction engine does not
provide that support automatically.

Commercial terms and third-party notices remain authoritative. Local validation
does not publish packages; Actions handles semantic-release after approved merges.
Final legal/historical-reference and exact-artifact audits remain open. No first
release, owner configuration or migration completion is claimed here.

See [guidance provenance](agent-guidance-migration.md),
[architecture](developer/component-architecture.md) and
[AGENTS.md](../AGENTS.md) for retained development conventions.
