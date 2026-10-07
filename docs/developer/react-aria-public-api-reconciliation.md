# Bounded public API reconciliation

Task slices: Z-13 / W-13, inspected 2026-10-07 at source commit
`d0fcc6298004ad23d1a75480b216b39142e6df96`. This audit covers forms, catalog grid
state/reset/cells, editor link/image/upload callbacks and their package routes.
It supplements the [inventory wording audit](react-aria-inventory-contract-reconciliation.md)
without repeating the migration inventory or closing any master acceptance row.
Execution and delivery details are in the [batch report](parallel-batch-11/public-api-reconciliation.md).

## Evidence provenance

Current contract evidence is tracked source, explicit barrel reexports and
[package export declarations](../../package.json). The root
[index](../../src/index.ts) forwards the [component barrel](../../src/components/index.ts);
that barrel explicitly selects catalog types and forwards the primitive barrel.
This is a source/API audit: no build, fresh emitted declaration inspection,
tarball import or published-package check was performed. Package targets describe
intended emitted paths, not proof that those artifacts exist at this head.

[Baseline inventory](migration-baseline/inventory.json) identifies repository
commit `21adebd61bedfc6a1ed395fe664ff4be83896821`; its
[public API snapshot](migration-baseline/public-api.json) contains historical
declarations, including retired primitive imports and grid types. Those entries
are comparison provenance, not current exports. [Extraction guidance](../migration.md)
and the [manifest](../extraction-manifest.json) identify learner-platform source
commit `8e63f1e16fc3d43d851908b312603a1099ca13d9`. Neither source is a runtime dependency.

## Forms: exact owned mapping

For these tables, root means `@structured-growth/sg-ui`, and routes are suffixes
on that package name. All compositions load `/styles.css` and use Provider or
ThemeScope. Host labels/options/errors remain host-translated.

| Contract and source | Value/callback and ref | Verified source routes / guide |
| --- | --- | --- |
| [TextFieldProps](../../src/experimental/TextField/TextField.tsx) | String `value`, `defaultValue`, `onValueChange(value: string)`; naming union requires `label: string` **or** `aria-label: string`; ref is `HTMLInputElement`. Selected native attributes include `form`, onBlur and onFocus; change requests carry strings rather than upstream change events. | Root, `/components`, `/primitives`, `/experimental`; [primitive mappings](react-aria-primitives.md). |
| [TextAreaProps](../../src/experimental/TextArea/TextArea.tsx) | Multiline specialization of TextFieldProps, including naming union, string callback and native form attributes; optional `rows`; ref is `HTMLTextAreaElement`. | `/experimental` only; [layout/actions](react-aria-layout-actions.md). |
| [CheckboxProps](../../src/experimental/Checkbox/Checkbox.tsx) | `checked`, `defaultChecked`, `onCheckedChange(boolean)`, host-owned `mixed`, required/invalid/description/error state; ref is `HTMLLabelElement`. No declared `className`, `style` or `form`. | Root, `/components`, `/primitives`, `/experimental`; [primitive mappings](react-aria-primitives.md) and [forms evidence](parallel-batch-01/forms.md). |
| [SwitchProps](../../src/experimental/Switch/Switch.tsx) | Boolean checked/default/change, optional description/name/value, native class/style; ref is `HTMLLabelElement`. No required/error/form prop. | Root, `/components`, `/primitives`, `/experimental`; [layout/actions](react-aria-layout-actions.md). |
| [RadioGroupProps / RadioOption](../../src/experimental/RadioGroup/RadioGroup.tsx) | Options use `{value: string, label: string, disabled?}`; `value?: string \| null`, `defaultValue?: string`, `onValueChange(string)`; required/invalid/errors; ref is `HTMLDivElement`. | `/experimental` only; [layout/actions](react-aria-layout-actions.md). |
| [SelectProps / SelectOption](../../src/experimental/Select/Select.tsx) | Options use `{id: string, label: string, disabled?}`; value/default/callback use string ID or null; ref is `HTMLButtonElement`. | Root, `/components`, `/primitives`, `/experimental`; [primitive mappings](react-aria-primitives.md). |
| [ComboBoxProps / ComboBoxOption](../../src/experimental/ComboBox/ComboBox.tsx) | Same option ID/value shape as Select; `formValue="key"` serializes ID; ref is `HTMLInputElement`. Autocomplete is this implementation/props alias, not a second state owner. | ComboBox: root, `/components`, `/primitives`, `/experimental`; Autocomplete alias: root, `/components`, `/primitives`; [proof controls](react-aria-proof-controls.md). |

The [primitive barrel](../../src/components/primitives/index.ts),
[/primitives bridge](../../src/primitives/index.ts) and
[experimental barrel](../../src/experimental/index.ts) establish these routes.
There are no package `/components/TextField`, `/components/Checkbox`,
`/components/TextArea` or `/components/RadioGroup` subpaths. Multiline and grouped
forms can use `/experimental`; the guide's phrase "owned control catalog" does
not make those controls root exports. Whether to promote them is an API-owner
decision, not an established missing feature.

Native form semantics already have [public composition tests](../../src/components/primitives/primitives.test.tsx),
colocated form tests and [native forms evidence](parallel-batch-01/forms.md).
The [native reset report](parallel-batch-05/native-reset.md) separately records
accepted/prevented composite reset ownership. These are existing evidence, not
fresh runtime passes here. Read-only/focus/ref behavior is control-specific;
do not infer every native input capability from a generic "native refs" statement.

## Catalog grid: state, reset and cells

| Public contract | Exact source/type mapping | Guide and package route |
| --- | --- | --- |
| `AppDataGridProps<Row>` | [Renderer](../../src/components/AppDataGrid/AppDataGrid.tsx) omits internal selection/processing fields from [OwnedGridInteractionProps](../../src/components/AppDataGrid/ownedGridInteraction.tsx), then adds `selection`, footer, persistence and reset props. Interaction inherits [controller options](../../src/components/AppDataGrid/ownedGridController.ts) and layout options; forwarded ref is scrolling `HTMLDivElement`, `tableRef` is `HTMLTableElement`. | Root, `/components`, `/components/AppDataGrid`; [catalog guide](react-aria-catalog-grid.md). |
| Criteria/change snapshot | [OwnedGridCriteriaState / OwnedGridChangeCallbacks](../../src/components/AppDataGrid/ownedGridState.ts): pagination `{page,pageSize}`, ordered sort `{field,direction}[]`, filter rules, search string, `selectedRowIds: ReadonlySet<string>`. `onStateChange(value)` receives criteria/selection, not layout or shell view. This owned named type is not explicitly exported from package barrels. | Callback available through AppDataGridProps; consumers can infer `Parameters<NonNullable<AppDataGridProps<Row>["onStateChange"]>>[0]`. No internal-file import is required. |
| Selection and public aliases | [types.ts](../../src/components/AppDataGrid/types.ts): config accepts `ReadonlySet<string>` and emits `Set<string>`; `AppGridRowId=string`, `AppGridRowSelectionModel=Set<string>`, visibility is `Record<string,boolean>`, pagination aliases owned `{page,pageSize}`, sort aliases owned rules. | Root, `/components`, `/components/AppDataGrid`; retired `AppGridSortModel` is replaced with `AppDataGridSortRule[]`. |
| Reset snapshot | [AppDataGridViewState](../../src/components/AppDataGrid/ownedGridReset.ts) extends criteria with visibility, order, widths and optional `viewMode: "list" \| "cards"`. Renderer declares `showResetView?: boolean` and `onResetView?: (state: AppDataGridViewState) => void`; shell inherits those props and adds view mode to reset. | Named type explicitly exported **only** from `/components/AppDataGrid`; omission from root/component barrel is tracked below. |
| Shell ownership | [AppDataGridShellProps](../../src/components/AppDataGridShell/AppDataGridShell.tsx) extends public grid props; one controller feeds toolbar/list/cards/footer. View config has controlled/default mode and `onModeChange`; cards receive processed rows through `renderCard(row)`. | Root, `/components`, `/components/AppDataGridShell`; shell index does not reexport the named reset type. |
| Persistence | [OwnedGridPersistenceConfig](../../src/components/AppDataGrid/ownedGridPersistence.ts) is `{key, storage?}`; storage structurally supplies getItem/setItem/removeItem. It is reachable in public props, not explicitly exported as a named package type. | Opt-in persistence/storageKey matches [catalog guide](react-aria-catalog-grid.md); named-type promotion remains an owner decision. |
| Columns/cells/helpers | [Public aliases](../../src/components/AppDataGrid/types.ts) map to [OwnedGridPresentationColumn / OwnedGridMenuAction](../../src/components/AppDataGrid/ownedGridColumns.ts): row-only value/custom/link/image/menu getters, `formatValue(unknown,row)`, action `onPress(row)`, `truncate?: boolean`. Cell union is text/date/dateTime/link/copyable/json/image/menu/custom. | Root, `/components`, `/components/AppDataGrid` export column/action types and createDataGridColumns/createActionMenuColumn/RowSubHeader. [Cell acceptance](react-aria-grid-cell-acceptance.md) correctly excludes standalone cell/status/header package subpaths. |

`formatDate` is a public grid prop with a structurally reachable owned context
from [ownedGridCells](../../src/components/AppDataGrid/ownedGridCells.tsx); locale,
timezone, dateOnly and cellType stay owned. No upstream engine parameters are
part of these callback contracts. Named internal contexts need not be imported:
infer public callback parameters or use `formatValue` for a column.
Existing grid reset/state and cell composition tests cover behavior; no new tests
are justified by this documentation audit alone.

## Editor callbacks: matching guides, explicit host boundaries

| Contract | Exact source signature / behavior | Source exports and guide |
| --- | --- | --- |
| LinkUrlModalProps | [Source](../../src/components/LinkUrlModal/LinkUrlModal.tsx): `onClose(): void`; `onSubmit({displayText: string, url: string \| null}): void`. Dialog trims both values, blank URL unlinks, policy props restrict http/https/mailto/tel and relative paths. | Root, `/components`, `/components/LinkUrlModal`; [dialog guide](react-aria-editor-dialogs.md). No async persistence-result contract is declared. |
| ImageUploadModalProps | [Source](../../src/components/ImageUploadModal/ImageUploadModal.tsx): `onSubmit(file: File, altText?: string): Promise<void> \| void`. `enableAltText=false` invokes exactly one argument; true sends trimmed description, including decorative empty string. | Root, `/components`, `/components/ImageUploadModal`; [dialog guide](react-aria-editor-dialogs.md). Standalone host must consume/persist its description separately. |
| PageRichTextEditorSectionProps | [Implementation](../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx): `lexicalValue: unknown`, `onLexicalChange(nextLexical: unknown): void`, required editorKey; `onUploadImage?: (file: File) => Promise<{assetId: string; assetVersionId: string; src: string; altText?: string; width?: number \| null; height?: number \| null}>`. Forwarded ref is `HTMLDivElement`. | [Wrapper](../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.tsx) and [index](../../src/components/PageRichTextEditorSection/index.ts) forward component/type to root, `/components`, `/components/PageRichTextEditorSection`; [editor guide](react-aria-editor-section.md). |

The integrated editor enables description input but still calls
`onUploadImage(file)` with **one argument**. Insertion chooses
`altText ?? uploaded.altText ?? file.name`; an explicitly empty dialog description
wins over the uploaded fallback. The final description reaches the host in
serialized document changes, not as a second upload-service argument. Persisting
description on the remote asset during upload needs a separately approved callback
extension; no such API is implied by the standalone dialog's second argument.

Link and image source validation, saved JSON preservation, local object URL
lifetime, late upload invalidation and host ownership agree with the referenced
guides. Existing dialog, editor composition, policy and ImageNode tests already
cover those concerns. No transport abort callback, byte decoding/size enforcement
or asset authorization API is present. Those remain host policies and broader
E-06/E-07 requirements, not newly discovered missing library exports.

## Concrete discrepancies and reserved owner decisions

| Finding | Evidence and immediate consumer mapping | Reserved disposition |
| --- | --- | --- |
| F-01: Checkbox ref guide mismatch | Primitive guide promises native input ref; source forwards `HTMLLabelElement` to AriaCheckbox. Batch-01 forms report already calls it the native label ref. | Correct guide to the current label ref, or explicitly approve an input-ref change with grid/composed native focus evidence and breaking-change analysis. Do not claim `.checked` on the forwarded ref. |
| F-02: TextField naming guide is too narrow | Primitive guide says "Required label"; source accepts visible label **or** aria-label. | Documentation correction can state the exact union without changing accessible-name requirements. Existing tests/props are authoritative; no new API needed. |
| F-03: Reset named-type route inconsistency | Grid index exports AppDataGridViewState; component barrel's explicit grid list omits it, so root omits it too. Catalog guide names the type without specifying that route. | API owner decides whether to add root/component exports, consistent with other grid types, or document the granular-only type route. Adding a reexport is compatible; source/declaration/packed import evidence belongs to that follow-up. |

Current usable reset type import is
`import type { AppDataGridViewState } from "@structured-growth/sg-ui/components/AppDataGrid"`.
For the shell, the same snapshot can be inferred from
`Parameters<NonNullable<AppDataGridShellProps<Row>["onResetView"]>>[0]`.
TextArea/RadioGroup promotion and named criteria/persistence/date-context exports
are open convenience/ownership decisions, not promised root APIs or proven defects.

The historical snapshot necessarily differs from current owned contracts. Keep
that snapshot immutable. Z-13 still needs a fresh final-head declaration/packed
API comparison and a complete breaking-change/release-marker reconciliation;
W-13 still needs the integrated consumer guide. Removed upstream form/grid
surfaces and owned stylesheet/scope integration are breaking migrations even
where public component names remain. This documentation-only change adds no
runtime breaking change and uses a `docs:` commit. It does not certify historical
commit release markers or close broad G/E/U/X/R/Z, device or AT acceptance.

Next bounded task: record F-01/F-03 owner dispositions, correct F-02 and approved
guide wording, then separately validate any export/ref implementation at its
fresh head under the [development policy](react-aria-development-validation.md).
