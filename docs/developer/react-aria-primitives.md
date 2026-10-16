# Owned public primitives (M-37)

`/primitives`, `/components` and the root now expose owned implementations and
native refs. Import `@structured-growth/sg-ui/styles.css` once and provide
`Provider` or `ThemeScope`; `Provider` also carries locale into overlays. The
public barrel imports implementations directly, so `/primitives` does not load
retired theme implementations or the experimental grid proof. Its source dependencies
and emitted declarations are audited transitively.

These are breaking mappings from the extracted primitive reexports. Names remain
where useful; none accepts the inherited MUI prop surface, `sx`, theme callbacks,
polymorphic `component`, upstream events or slot types. Native `className`/`style`
are available where declared. Host labels and option records are translated by
the host. Controls require accessible names. The implementation contracts are
also documented in [layout/actions](react-aria-layout-actions.md),
[proof controls](react-aria-proof-controls.md) and
[remaining controls](react-aria-remaining-controls.md).

| Extracted export | Owned public mapping |
| --- | --- |
| Box / BoxProps | Native container with bounded `as`, token `padding`, native ref; CSS/native style for layout |
| Stack / StackProps | `gap`, `direction`, `align`, `justify`, `wrap`, `responsive`; `spacing` becomes `gap` |
| Typography / TypographyProps | Separate semantic `as` and visual `variant`, including `bodyAlt2`; text tones `default`, `muted`, `subtle`, `accent`, `danger` and compatibility alias `primary`; `noWrap` |
| TextField / TextFieldProps | Naming requires `label` or `aria-label`, string `value`/`defaultValue`/`onValueChange`, native input ref; multiline uses TextArea from the owned control catalog |
| CircularProgress / CircularProgressProps | Named Progress with fixed circular presentation; omitted value is indeterminate, numeric value is determinate |
| Checkbox / CheckboxProps | Own `label`, `checked`/`defaultChecked`/`onCheckedChange`, mixed state, native `HTMLLabelElement` ref |
| FormControlLabel / FormControlLabelProps | Removed; pass `label` to Checkbox/Switch; RadioGroup owns option labels |
| IconButton / IconButtonProps | Required `label`, `onPress`, owned density/tone/variant, native button ref |
| MuiLink / MuiLinkProps | Removed; use exported Link / LinkProps with native anchor ref and host navigation adapter |
| Menu / MenuProps | Named trigger plus owned `items`, `onAction(id)`, controlled/default open state; inherits scope density unless explicit |
| MenuItem / MenuItemProps | Item component/props removed; MenuItem is now an owned item-record type, passed in Menu.items |
| Select / SelectProps | Named control, string option IDs, `value`/`defaultValue`/`onValueChange`, native button ref |
| SelectChangeEvent | Removed; callbacks receive `string` or `null` |
| Autocomplete / AutocompleteProps | Alias of owned ComboBox / ComboBoxProps; readonly `{id,label,disabled?}` options and selected string IDs; native input ref. Free-solo, multiple values and arbitrary renderers are removed; use TextField or AsyncMultiSelect for those workflows |
| Divider / DividerProps | Native divider; horizontal/vertical orientation and native ref |
| Chip / ChipProps | Passive presentation span with native `HTMLSpanElement` ref; label content is children. No `onRemove`; removable tokens use TagGroup from `/experimental` |
| LinearProgress / LinearProgressProps | Named Progress with fixed linear presentation; value bounds/valueText and native div ref |
| Switch / SwitchProps | Own label, boolean checked/default/change values, native `HTMLLabelElement` ref |
| List / ListProps | Native ul with native ref |
| ListItem / ListItemProps | Native li; selection belongs to its nested control |
| ListItemButton / ListItemButtonProps | Owned onPress button; selected state, native button ref |
| ListItemText / ListItemTextProps | Primary/secondary text with shared owned typography |
| Table / TableProps | Native static table; density and native table ref; interactive collections use AppDataGrid |
| TableHead / TableHeadProps | Native thead and section ref; shared TablePartProps |
| TableBody / TableBodyProps | Native tbody and section ref; shared TablePartProps |
| TableRow / TableRowProps | Native tr and row ref; shared TablePartProps |
| TableCell / TableCellProps | Native td with spans/headers/alignment; use new TableHeaderCell for native th/scope |
| Collapse / CollapseProps | `expanded` replaces `in`; retains state in hidden content by default, optional unmountOnCollapse; transition-engine props removed |
| Tooltip / TooltipProps | Explicit owned button trigger and plain text `content`; controlled/default visibility and delays |

The Switch ref points to its wrapping native label. Obtain the associated input
through `switchRef.current?.control`; narrow it with `instanceof HTMLInputElement`
before reading `checked` or calling `focus()`. The forwarded label itself does not
expose input state or provide the input focus target.

Additional public exports include Button, Provider, ThemeScope, Progress, ComboBox,
Link, ListItemIcon, TableFoot, TableHeaderCell and TableCaption, plus their owned
types. Existing experimental paths remain for compatibility with the migration
proof; they share the same implementations. Public aliases are not a second
interaction/state owner. Generic Menu inherits the nearest scope density (comfortable
at the default root); pass `density="compact"` when compact presentation is needed.
Catalog compositions such as DataToolbar selection menus explicitly request compact
density. This composition convention is not the generic Menu default.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider, Stack, TextField, Checkbox, Select, CircularProgress } from
  "@structured-growth/sg-ui/primitives";

export function CourseForm() {
  return <Provider><form><Stack gap={3}>
    <TextField label="Course" name="course" defaultValue="Science" />
    <Checkbox label="Published" name="published" />
    <Select label="Status" name="status" defaultValue="draft"
      options={[{id:"draft",label:"Draft"},{id:"active",label:"Active"}]} />
    <CircularProgress aria-label="Loading preview" />
  </Stack></form></Provider>;
}
```

Public composed tests exercise keyboard selection, form values/reset, menu
activation and source focus, autocomplete refs, static table semantics and
collapse state retention. Progress wrapper tests cover names, bounded values,
indeterminate state, fixed presentation and SSR. The package fixture rejects
retired props/types and unnamed progress. Full native accessibility/browser
matrix acceptance remains open. The public `/theme` now exposes owned Provider,
ThemeScope and AppThemeProvider; retired foundation runtime/peer/dev packages are
removed. See [theme mappings](react-aria-theme.md) and the
[removal audit](react-aria-removal-audit.md) for the distinction between shipped
removal and remaining historical/legal and artifact acceptance.

For implementation follow the [canonical component recipe](react-aria-component-recipe.md);
for host planning use the [read-only adoption checklist](react-aria-adoption-checklist.md).
This W-12/W-18 and A-06–A-10 documentation slice does not establish a new support
policy or close the broad accessibility/compatibility gates.

### Text tone and action priority

Typography tones describe text emphasis or meaning, not button priority. Use
`accent` for brand-colored text; `primary` remains an equivalent compatibility
alias backed by the existing typography primary foreground token. Use `muted`
for supporting descriptions and `subtle` for supplementary metadata. Subtle flows
through `textSubtle` → `typographySubtleText` → component CSS, with contrast-checked
light/dark palette mappings. Theme overrides can converge muted and subtle in
increased contrast or forced colors. Do not use reduced emphasis to hide required
instructions or convey disabled interaction. Content roles such as an eyebrow
belong in composed page-header APIs; Typography's `variant` and HTML `as` remain
independent. Existing button variant/tone APIs are unchanged.


## Tabs overflow menu

Tabs retains scrolling by default. `overflow="menu"` opts a horizontal strip into
measured overflow. `items[].priority="secondary"` keeps a section in the menu
until it is selected, even if primary sections fit. Selecting a hidden section
requests the same `onValueChange(id)` as a visible tab; controlled hosts remain
authoritative. An accepted hidden selection occupies the final visible position,
displacing enough preceding tabs to fit. Returning to a primary tab restores the
primary prefix and returns the secondary tab to the menu.

All tabs and panel associations retain their stable IDs. Hidden tabs are excluded
from the visible accessibility tree and disabled in the tab collection's keyboard
navigation; the menu exposes their actual disabled state. Accepted menu selection
moves focus to the promoted tab. Escape returns to the More tabs trigger. The
host supplies `overflowLabel` when overriding the translated default. Resize and
font/density changes recalculate fit using the actual rendered controls.

Long row labels truncate at the owned `tabsMaximumTabWidth` component token
(default 16rem), or the available strip width if smaller. Full names remain
accessible, are exposed by the label's native title and wrap in the menu.
Vertical orientation retains the existing scroll behavior. SSR initially renders
the primary strip; the client resolves available space after layout. Panels retain
their existing mount/selection behavior; persistence and data loading remain host
owned. The Tabs page demonstrates 15 sections and persistent secondary sections,
with independent compact and comfortable examples.
