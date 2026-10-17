# Public naming, composition and domain index

Generated from built public declarations; inventory SHA-256: 82ede56de4a678e39963abdee53202e0cf38d4ea6535e3e02d768c061b4a9d37.

The exact exported prop type owns each value domain. Optional props do not by
themselves define runtime defaults; scope inheritance and host validation policy
remain in [public contracts](react-aria-public-contracts.md). Named callable aliases
share the listed contract, including separately exported compound children. This
index records definitions rather than browser, speech or release acceptance.

InstructorClassCard.className is the retained course-name content prop, not a CSS
class escape hatch. ClassCardFrame.className and native className contracts have
their own declared styling targets. Never infer ownership from spelling alone.

Every action needs a nonempty runtime name. Native Button/Link content names its
action; icon-only content requires a host aria-label/aria-labelledby. IconButton
requires label. A Tooltip supplements an existing name. Required strings prevent
omission, not blank translations. Host descriptions and aria-labelledby/describedby
IDs must identify mounted content in the same document. Repeated groups/rows/editor
regions need distinct contextual names. Custom renderers own the semantics, focus
and descriptions of descendants they introduce.

TextField/TextArea/SearchField and Progress naming unions require one permitted
branch even when their common-property summary marks all name props optional.
Read the alternatives in public-boundaries.json for exact branch requirements.
Dialog custom headers replace generated heading/description markup; supply an
explicit name. Avatar alt is required and empty means decorative. Provider, scope,
layout and presentation elements need no invented landmark/name unless the host
chooses an interactive or named region. Text alone is not necessarily a landmark.

Only the listed native ref/parts/style props are supported. Ref element types do
not expose a private interaction-engine handle. Slots accept content, not implicit
state/persistence wiring. className/style do not promise old engine DOM topology;
private classes/attributes and undocumented variables remain unsupported. Reusable
appearance belongs in public tokens/Provider/ThemeScope. ThemeScope accepts owned
--sgui-* variables; ordinary layout styles remain local and do not enter overlays.
See [targets and host responsibilities](react-aria-public-composition-contracts.md).

## Declared component boundaries

| Public names | Name/description properties | Native ref and composition hooks | Owned domains |
| --- | --- | --- | --- |
| `AppDataGrid` | `errorMessage` (conditional/optional), `getRowLabel` (required), `label` (required) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `AppDataGridShell` | `errorMessage` (conditional/optional), `getRowLabel` (required), `label` (required) | `className`, `footer`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `AppInlineProgress` | Content, library default or host region semantics; no declared name prop | No generic ref/class/style/slot contract | No separate visual/validation domain |
| `AppModal` | `aria-label` (conditional/optional), `title` (conditional/optional) | `bodyClassName`, `bodyStyle`, `children`, `className`, `footerContent`, `headerContent`, `ref: Ref<HTMLElement> \| undefined`, `style` | `onClose: ((reason: DialogDismissReason) => void) \| undefined`; `size: "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full" \| undefined` |
| `AppOperationSteps` | `title` (conditional/optional) | No generic ref/class/style/slot contract | No separate visual/validation domain |
| `AppPageHeader` | `description` (conditional/optional), `title` (required) | `actionButtons`, `className`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `AppPageTabs` | `label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: "compact" \| "comfortable" \| "default" \| undefined` |
| `AppPaginationFooter` | `label` (conditional/optional) | `className`, `style` | `disabled: boolean \| undefined` |
| `AppShell` | `mainLabel` (conditional/optional) | `children`, `className`, `navigation`, `ref: Ref<HTMLDivElement> \| undefined`, `rightNavigation`, `style` | No separate visual/validation domain |
| `AsyncMultiSelect` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `endIcon`, `startIcon` | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |
| `AuthShell` | `title` (required) | `children`, `className`, `footerContent`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `Avatar` | `alt` (required) | `className`, `fallback`, `ref: Ref<HTMLSpanElement> \| undefined`, `style` | `size: "medium" \| "large" \| "small" \| undefined` |
| `Badge` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLSpanElement> \| undefined`, `style` | `tone: "primary" \| "neutral" \| undefined` |
| `Box` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `Breadcrumbs` | `label` (conditional/optional) | `className`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `Button` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `endIcon`, `ref: Ref<HTMLButtonElement> \| undefined`, `startIcon`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `tone: "primary" \| "neutral" \| undefined`; `variant: "filled" \| "outlined" \| "text" \| undefined` |
| `ButtonGroup` | `aria-describedby` (conditional/optional), `label` (required), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `orientation: "horizontal" \| "vertical" \| undefined` |
| `Calendar` | `label` (required) | `navigation`, `renderDayContent` | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |
| `Card` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | `tone: "default" \| "subtle" \| undefined`; `variant: "outlined" \| "flat" \| "raised" \| undefined` |
| `CardCollectionWithFooter` | `paginationLabel` (conditional/optional) | `className`, `emptyContent`, `loadingContent`, `renderCard`, `style` | No separate visual/validation domain |
| `CardContent` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `Checkbox` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `ref: Ref<HTMLLabelElement> \| undefined` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `Chip` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLSpanElement> \| undefined`, `style` | `density: Density \| undefined`; `tone: "primary" \| "neutral" \| undefined`; `variant: "filled" \| "outlined" \| undefined` |
| `CircularProgress` | `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `ClassCardFrame` | Content, library default or host region semantics; no declared name prop | `body`, `bodyClassName`, `bodyStyle`, `className`, `footer`, `footerClassName`, `footerStyle`, `header`, `headerClassName`, `headerStyle`, `style` | No separate visual/validation domain |
| `Collapse` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `ColumnsLayoutModal` | Content, library default or host region semantics; no declared name prop | No generic ref/class/style/slot contract | `onClose: () => void` |
| `Autocomplete`, `ComboBox` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `className`, `endIcon`, `ref: Ref<HTMLInputElement> \| undefined`, `startIcon` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `ContentEditorChrome` | `aria-label` (conditional/optional), `title` (required) | `className`, `icon`, `ref: Ref<HTMLDivElement> \| undefined`, `rightSlot`, `style` | No separate visual/validation domain |
| `DataGrid` | `errorMessage` (conditional/optional), `getRowLabel` (required), `label` (required) | `renderActions` | No separate visual/validation domain |
| `DataGridDragHandle` | `label` (required) | `className`, `ref: Ref<HTMLButtonElement> \| undefined`, `style` | `disabled: boolean \| undefined` |
| `DataToolbar` | `aria-label` (conditional/optional) | `className`, `leftContent`, `leftContentWhenSelected`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `DataToolbarSelectionMenu` | Content, library default or host region semantics; no declared name prop | No generic ref/class/style/slot contract | No separate visual/validation domain |
| `DateField` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `ref: Ref<HTMLDivElement> \| undefined` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `onValidityChange: ((valid: boolean) => void) \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `DatePicker` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `navigation`, `renderDayContent` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `onValidityChange: ((valid: boolean) => void) \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `DateRangeComparisonPicker` | `label` (required) | No generic ref/class/style/slot contract | `disabled: boolean \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `DateRangePicker` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `navigation`, `renderDayContent` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `onValidityChange: ((valid: boolean) => void) \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `DateRangeSelector` | `label` (required) | `navigation`, `renderDayContent` | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `DateTimeRangePicker` | `label` (required) | No generic ref/class/style/slot contract | `disabled: boolean \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `Dialog` | `aria-label` (conditional/optional), `description` (conditional/optional), `title` (conditional/optional) | `bodyClassName`, `bodyStyle`, `children`, `className`, `footer`, `header`, `ref: Ref<HTMLElement> \| undefined`, `style`, `surfaceStyle` | `onDismiss: (reason: DialogDismissReason) => void`; `size: "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full" \| undefined` |
| `Disclosure` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `label` (required), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `disabled: boolean \| undefined` |
| `Divider` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | `orientation: "horizontal" \| "vertical" \| undefined` |
| `DocumentEditorLayout` | `title` (required) | `children`, `className`, `headerRight`, `menuBar`, `ref: Ref<HTMLDivElement> \| undefined`, `style`, `titleNode`, `toolbar` | No separate visual/validation domain |
| `DocumentEditorToolbar` | `aria-label` (conditional/optional), `statusLabel` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `rightSlot`, `style` | No separate visual/validation domain |
| `EditableTitleField` | `title` (required) | No generic ref/class/style/slot contract | `readOnly: boolean \| undefined`; `variant: "h4" \| "h5" \| "h6" \| undefined` |
| `ExperiencePageNavigator` | `title` (conditional/optional) | `className`, `style` | `readOnly: boolean \| undefined` |
| `FloatingTextSelectionToolbar` | `aria-label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `FormFieldScope` | Content, library default or host region semantics; no declared name prop | `children` | No separate visual/validation domain |
| `HierarchicalMenu` | `backLabel` (conditional/optional), `label` (required) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: Density \| undefined`; `onDismiss: (() => void) \| undefined`; `presentation: "navigation" \| "commands" \| undefined` |
| `IconButton` | `aria-describedby` (conditional/optional), `label` (required), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLButtonElement> \| undefined`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `tone: "primary" \| "neutral" \| undefined`; `variant: "filled" \| "outlined" \| "text" \| undefined` |
| `IconPanelNavigation` | `aria-label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `ImageUploadModal` | `errorMessage` (conditional/optional), `title` (conditional/optional) | No generic ref/class/style/slot contract | `onClose: () => void` |
| `InsertContentMenuControl` | Content, library default or host region semantics; no declared name prop | `className`, `ref: Ref<HTMLButtonElement> \| undefined`, `style` | `disabled: boolean \| undefined` |
| `InstructorClassCard` | `actionLabel` (required), `className` (required), `lastLearnerActivityLabel` (required) | No generic ref/class/style/slot contract | No separate visual/validation domain |
| `LearnerClassCard` | Content, library default or host region semantics; no declared name prop | No generic ref/class/style/slot contract | No separate visual/validation domain |
| `LearnerClassesDataGrid` | `errorMessage` (conditional/optional), `getRowLabel` (conditional/optional), `label` (conditional/optional) | `className`, `style` | No separate visual/validation domain |
| `LinearProgress` | `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | No separate visual/validation domain |
| `SGLink` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLAnchorElement> \| undefined`, `style` | No separate visual/validation domain |
| `Link` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLAnchorElement> \| undefined`, `style` | `tone: "primary" \| "inherit" \| undefined` |
| `LinkUrlModal` | `title` (conditional/optional) | No generic ref/class/style/slot contract | `onClose: () => void` |
| `List` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLUListElement> \| undefined`, `style` | No separate visual/validation domain |
| `ListItem` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLLIElement> \| undefined`, `style` | No separate visual/validation domain |
| `ListItemButton` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `endIcon`, `ref: Ref<HTMLButtonElement> \| undefined`, `startIcon`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined` |
| `ListItemIcon` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLSpanElement> \| undefined`, `style` | No separate visual/validation domain |
| `ListItemText` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `className`, `content`, `primary`, `ref: Ref<HTMLSpanElement> \| undefined`, `secondary`, `style` | No separate visual/validation domain |
| `Menu` | `errorMessage` (conditional/optional), `label` (required) | `trigger` | `density: Density \| undefined`; `placement: "bottom start" \| "bottom end" \| "top start" \| "top end" \| undefined` |
| `MonthPicker` | `label` (conditional/optional) | No generic ref/class/style/slot contract | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |
| `Navigation` | `aria-describedby` (conditional/optional), `aria-labelledby` (conditional/optional), `label` (required), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `NavigationItem` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLAnchorElement> \| undefined`, `style` | No separate visual/validation domain |
| `RowSubHeader` | `title` (required) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style`, `trailingContent` | No separate visual/validation domain |
| `PageRichTextEditorSection` | `aria-label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `readOnly: boolean \| undefined` |
| `Pagination` | `label` (conditional/optional) | `className`, `ref: Ref<HTMLElement> \| undefined`, `style` | `disabled: boolean \| undefined` |
| `PeriodPicker` | `label` (required) | No generic ref/class/style/slot contract | `disabled: boolean \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `Popover` | `title` (required) | `children`, `trigger` | `placement: "bottom start" \| "bottom end" \| "top start" \| "top end" \| undefined`; `presentation: "dialog" \| "auto" \| "popover" \| "drawer" \| undefined`; `size: "md" \| "lg" \| "content" \| undefined` |
| `Progress` | `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `label` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `variant: "linear" \| "circular" \| undefined` |
| `AppThemeProvider`, `Provider` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: Density \| undefined` |
| `RadioGroup` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `orientation: "horizontal" \| "vertical" \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `RichTextFormattingToolbar` | `aria-label` (conditional/optional) | `className`, `leftSlot`, `ref: Ref<HTMLDivElement> \| undefined`, `rightSlot`, `style` | No separate visual/validation domain |
| `SearchField` | `aria-label` (conditional/optional), `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (conditional/optional), `resultCountLabel` (conditional/optional), `resultsLabel` (conditional/optional) | `className`, `endIcon`, `ref: Ref<HTMLInputElement> \| undefined`, `startIcon` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |
| `Select` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `className`, `endIcon`, `ref: Ref<HTMLButtonElement> \| undefined`, `startIcon` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `SGAccountProvider` | Content, library default or host region semantics; no declared name prop | `children` | No separate visual/validation domain |
| `SGNavigationProvider` | Content, library default or host region semantics; no declared name prop | `children` | No separate visual/validation domain |
| `SGTranslationProvider` | Content, library default or host region semantics; no declared name prop | `children` | No separate visual/validation domain |
| `SideNavigation` | `aria-label` (conditional/optional) | `className`, `ref: Ref<HTMLElement> \| undefined`, `resolveIcon`, `style` | No separate visual/validation domain |
| `SplitAction` | `label` (required), `menuLabel` (conditional/optional) | `className` | `disabled: boolean \| undefined` |
| `Stack` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | No separate visual/validation domain |
| `Status` | Content, library default or host region semantics; no declared name prop | `children`, `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `tone: "neutral" \| "danger" \| undefined` |
| `Surface` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | `tone: "default" \| "subtle" \| undefined`; `variant: "outlined" \| "flat" \| "raised" \| undefined` |
| `Switch` | `description` (conditional/optional), `label` (required) | `className`, `ref: Ref<HTMLLabelElement> \| undefined`, `style` | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |
| `Table` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableElement> \| undefined`, `style` | `density: Density \| undefined` |
| `TableBody` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableSectionElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableCaption` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableCaptionElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableCell` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableCellElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableFoot` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableSectionElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableHead` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableSectionElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableHeaderCell` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableCellElement> \| undefined`, `style` | No separate visual/validation domain |
| `TableRow` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLTableRowElement> \| undefined`, `style` | No separate visual/validation domain |
| `Tabs` | `label` (required), `overflowLabel` (conditional/optional) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `orientation: "horizontal" \| "vertical" \| undefined` |
| `TagGroup` | `label` (required) | `className`, `emptyContent`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `tone: "primary" \| "neutral" \| undefined` |
| `TextAlignMenuControl` | Content, library default or host region semantics; no declared name prop | `className`, `ref: Ref<HTMLButtonElement> \| undefined`, `style` | `disabled: boolean \| undefined` |
| `TextArea` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (conditional/optional) | `className`, `description`, `endIcon`, `inputClassName`, `ref: Ref<HTMLTextAreaElement> \| undefined`, `startIcon` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `TextColorPickerControl` | Content, library default or host region semantics; no declared name prop | `triggerIcon` | `disabled: boolean \| undefined` |
| `TextField` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (conditional/optional) | `className`, `description`, `endIcon`, `inputClassName`, `ref: Ref<HTMLInputElement> \| undefined`, `startIcon` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `TextStyleMenuControl` | Content, library default or host region semantics; no declared name prop | No generic ref/class/style/slot contract | `disabled: boolean \| undefined` |
| `ThemeScope` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: Density \| undefined` |
| `TimeField` | `description` (conditional/optional), `errorMessage` (conditional/optional), `label` (required) | `ref: Ref<HTMLDivElement> \| undefined` | `disabled: boolean \| undefined`; `invalid: boolean \| undefined`; `onValidityChange: ((valid: boolean) => void) \| undefined`; `readOnly: boolean \| undefined`; `required: boolean \| undefined` |
| `ToggleButton` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `ref: Ref<HTMLButtonElement> \| undefined`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined` |
| `ToggleButtonGroup` | `aria-describedby` (conditional/optional), `label` (required) | `className`, `ref: Ref<HTMLDivElement> \| undefined`, `style` | `density: Density \| undefined`; `disabled: boolean \| undefined`; `orientation: "horizontal" \| "vertical" \| undefined` |
| `Tooltip` | Content, library default or host region semantics; no declared name prop | `className`, `content`, `ref: Ref<HTMLDivElement> \| undefined`, `style`, `trigger` | `disabled: boolean \| undefined`; `placement: "start" \| "end" \| "bottom start" \| "bottom end" \| "top start" \| "top end" \| "top" \| "bottom" \| undefined` |
| `Typography` | `aria-describedby` (conditional/optional), `aria-label` (conditional/optional), `aria-labelledby` (conditional/optional), `title` (conditional/optional) | `children`, `className`, `content`, `ref: Ref<HTMLElement> \| undefined`, `style` | `tone: "primary" \| "default" \| "muted" \| "subtle" \| "accent" \| "danger" \| undefined`; `variant: TypographyVariant \| undefined` |
| `YearPicker` | `label` (conditional/optional) | No generic ref/class/style/slot contract | `disabled: boolean \| undefined`; `readOnly: boolean \| undefined` |

## Icon family

96 resolved SVG icon contracts use the owned IconProps shape. Their
SVG refs and exact label/title/native/style domains are recorded per alias in
public-boundaries.json. Icons default decorative; use a meaningful label for an
independent informative image. Decorative action icons stay hidden, with the
parent action owning its name. A label on an icon does not repair an unnamed
icon-only Button. Render callbacks supplying custom icons own decorative/meaningful
content semantics; do not place nested interactive controls in decorative slots.

This index does not certify host content, runtime nonempty translations, focus
implementation or actual spoken output. Those retain their original test/AT gates.
