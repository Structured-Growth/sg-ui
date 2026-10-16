# Public state, names and composition contracts

Task references: A-A-06, A-A-09 and A-A-10. This defines consumer responsibilities
for the shipped owned APIs. It does not certify all controls in every host,
browser or assistive technology. Load `/styles.css` and provide Provider or
ThemeScope. Use public package exports in applications; source paths below identify
implementations for maintainers.

## Value authority and lifetime

A change callback requests a host update; it never proves persistence or acceptance.
For each declared controlled/default pair, choose its owner for the mount. Omit
the controlled prop to use local state. Do not use null as a generic uncontrolled
sentinel. Callback presence alone does not select control mode. Do not alternate
between controlled and uncontrolled modes to reset a component: explicitly update
the controlled value or remount a new logical instance with a new React key.

| Public boundary | Empty/default and reset ownership |
| --- | --- |
| TextField / TextArea | String values; `""` is an accepted controlled empty value; `undefined` selects local state initialized from `defaultValue ?? ""`. Null is outside the public type. Updating a default preserves the current draft until an uncanceled native reset restores the latest default without an edit callback. |
| Checkbox / Switch | Boolean checked/defaultChecked; omission defaults false. Checkbox mixed presentation is separate from checked submission. Checkbox `slot="selection"` deliberately delegates state to the collection, so its standalone reset rule must not override the collection. |
| RadioGroup | Controlled `null` means no selection; defaultValue and change requests are strings. Removing/disabling a selected choice does not authorize selecting another on behalf of the host. |
| Select / ComboBox | ID string or explicit null; empty labels do not define identity. Keep option IDs unique and stable. Null clears selection; omitting value enables local selection. |
| DateField / TimeField and picker families | The declared civil/date/time string or record is committed state; null is cleared state. A visible incomplete draft is not necessarily a committed null. Default values seed local state. Open panels must honor changes to disabled/readOnly at commit and Clear boundaries. |
| Menu / Disclosure / ToggleButton / Popover | Use each declared boolean controlled/default pair and its own callback. Menu selection metadata and popup open state are separate concerns. |
| Tabs / AppPageTabs | Tabs has value/defaultValue/onValueChange; AppPageTabs requires value and uses onChange to select its controlled-panel mode. Omitting onChange selects route navigation. Changing this callback changes the semantic composition: choose the mode for the mount. |
| AsyncMultiSelect / ToggleButtonGroup | Use the declared array/ID collection to clear selections; never pass null unless that API explicitly accepts it. Query/loading and selection state have separate ownership. |
| TagGroup | items is host-owned content, not selectedIds/defaultSelectedIds state. onRemove requests removal of IDs; the host supplies the next items collection. Empty items renders emptyContent or the translated fallback. |
| AppDataGrid and AppDataGridShell | Each criteria/selection slice chooses its owner independently. Empty arrays, empty Set and empty search string are real controlled values. Defaults seed once; changing default props is not a live reset. Reset view requests the documented reset transaction; controlled slices remain host-authoritative. Search/sort/filter/page-size transactions request page zero before the changed slice and one combined snapshot. |
| PageRichTextEditorSection | `lexicalValue` is document input and `onLexicalChange` reports edits; this is not a native string value/defaultValue pair. `editorKey` selects document lifetime and remounts the editor; use a new key for document replacement. readOnly changes editability within that lifetime. Host owns save, uploads, concurrent edits and canceled asynchronous work. |

The grid may request normalization of invalid controlled pagination once for that
invalid snapshot. This is an explicit exception to “callbacks only follow edits”;
it does not silently accept the requested value. Host datasets, response order,
selection reconciliation and persistence remain host responsibilities.

Disabled, read-only and loading are component-specific contracts, not generic
synonyms. Use only props the public declaration exposes. See the
[read-only focus/form policy](react-aria-adoption-checklist.md#read-only-focus-and-form-values)
for trigger-only exceptions and retained hidden values. Supply native `name` where
submission is required. A description or accessible name is not a form name.

## Names, descriptions and repeated controls

Every actionable control needs a nonempty, meaningful translated name at runtime.
Types requiring string labels prevent omission; they cannot exclude blank strings,
verify translation results or prove a computed/spoken name. A Tooltip supplements
a name; it is not the sole naming mechanism. Decorative icon slots are aria-hidden:
put interactive controls in an explicit host slot or adjacent composition instead.

| Composition | Library ownership | Host ownership |
| --- | --- | --- |
| IconButton | Required `label` becomes aria-label; children are decorative. | Supply contextual label, such as “Delete Course A”, including context when repeated. Generic Button accepts arbitrary React content, so an icon-only use needs aria-label/aria-labelledby. |
| TextField / TextArea | Required visible label or aria-label, connected description/error, native input ref. | Nonempty label and useful description/error content; external aria-describedby IDs must identify mounted content in the same document. |
| Checkbox / RadioGroup / Select / ComboBox | Component/group label and owned option/description associations. | Group names distinguish repeated groups; option labels describe choices. IDs and native radio names must not collide across independent groups. |
| Menu | Required label names the popup collection; item labels provide textValue. | Name the trigger separately: Menu.label does not name arbitrary trigger content. Item IDs are stable and unique within the collection. Supply nonempty contextual action labels and translated errors. |
| Grid row actions / selection / reorder | Owned renderers interpolate getRowLabel into “Actions for …”, selection and reorder names. | Supply a meaningful getRowLabel for repeated rows. getMenuActions returns labels and callbacks for that row; stable IDs select the action, not the displayed label. Custom cell renderers own all labels, descriptions and focusable descendants they introduce. |
| ContentEditorChrome | Document actions group, title editor, hidden icon; onPress receives the actual button anchor. | menuItems.label names each action; set aria-haspopup/expanded/controls only when the host implements that popup and keeps its ID/state correct. rightSlot content owns its semantics and announcements. A root aria-label on a plain div does not create a landmark. |
| PageRichTextEditorSection | Editable document semantics and translated toolbar actions. | Supply contextual aria-label for repeated documents. Upload descriptions, document content and host validation remain host-owned. |
| AppShell / SideNavigation / AppPageTabs | Shell owns main region; SideNavigation owns nav; tabs own tablist/panel relationships or route nav. | navigation/rightNavigation slots must contain their own named navigation regions. Give left and right regions distinct names; generic wrapper divs do not create them. Override SideNavigation aria-label and AppPageTabs label when repeated. Main IDs must be unique. |
| Dialog / AppModal | Dialog semantics and owned title/description/dismissal mechanics. | Provide contextual title/name; custom header/body/footer content must preserve a useful name and own descriptions for complex forms. Do not describe an entire rich document as one long aria-describedby string. |

Stable generated IDs belong to the component instance, not application data. Keep
server/client trees and React identifierPrefix consistent during hydration; each
independent React root needs a distinct prefix. Host-supplied IDs remain host-owned.
Do not persist generated IDs or use them as data keys. Repeated descriptions must
resolve to the matching instance after rerender and hydration.

## Slots, native refs and styling

Only props and ref targets in built public declarations are supported escape
hatches. Aliases/reexports retain the underlying component contract; importing
through `/experimental` does not grant access to internal DOM or upstream props.
Compound children have their own contracts; never assume a parent forwards its
ref, style or arbitrary HTML attributes through every child.

| Boundary | Supported target / composition |
| --- | --- |
| Button / IconButton | HTMLButtonElement ref and declared native className/style/ARIA/form attributes; start/end icons are decorative. IconButton children are decorative and its label owns naming. |
| TextField / TextArea | Ref targets the native input/textarea; className styles the field root; inputClassName styles the native field. No public style prop is declared. Inherited startIcon/endIcon are decorative logical slots, not action slots. |
| Checkbox / Switch | Ref targets HTMLLabelElement; its native `control` owns input focus and validity. Do not call focus on the label expecting input semantics. Switch declares className/style; Checkbox does not. |
| Select | HTMLButtonElement trigger ref; className styles root. No public root style prop or inputClassName. |
| Calendar | No public ref, root className or style prop. renderDayContent supplies content inside the owned day cell; retain the cell interaction and date name. Calendar and DatePicker are distinct boundaries. |
| Menu / Tooltip / Popover | Trigger and content contracts differ. Menu does not expose a general root ref/class/style bag; use a declared Button trigger. A slot's portal destination and private wrapper hierarchy are not stable APIs. |
| Dialog | HTMLElement dialog ref, className/style, surfaceStyle, bodyClassName/bodyStyle as declared. Custom header/footer are content slots, not automatic callback wiring. |
| AppShell | HTMLDivElement outer ref and className/style. navigation/rightNavigation/children own their content; mainId/mainLabel configure main. Layout width variables documented by the shell are contextual overrides. |
| SideNavigation | HTMLElement nav ref and className/style; resolveIcon supplies decorative content, not route logic or labels. |
| ContentEditorChrome | HTMLDivElement outer ref and className/style; rightSlot owns host status/actions; menu action callback receives HTMLButtonElement anchor. |
| Grid | AppDataGrid's ref follows its interaction container; do not assume it targets the outer persistence wrapper. renderCustomCell/formatValue/getMenuActions receive the declared row context. Host renderer content owns semantics and must not fetch application data inside the library. |
| Editor | The declared outer ref/className/style is not a Lexical editor handle. Host document content and image metadata use their dedicated contracts. |

Use generated public tokens through Provider/ThemeScope overrides for reusable
appearance. Use declared native style for contextual layout. Do not depend on
hashed CSS Module class names, private engine attributes, child indexes or
undocumented variables. `data-sgui-part` hooks identify owned regions where
explicitly documented; their presence alone does not promise the private wrapper
tree or expose unsupported props. Preserve focus indication, contrast, density,
forced colors and portal scopes when applying overrides.

The focused contract tests cover explicit empty field authority, repeated
instance descriptions, Checkbox SSR hydration/ref identity, contextual grid action
callbacks and ContentEditorChrome slots/anchors. DOM emulation is evidence of
those contracts only; native browser, packed-consumer and assistive-technology
acceptance require their separately recorded checks.
