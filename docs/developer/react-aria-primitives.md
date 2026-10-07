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
| Typography / TypographyProps | Separate semantic `as` and visual `variant`, including `bodyAlt2`; `tone` and `noWrap` |
| TextField / TextFieldProps | Required label, string `value`/`defaultValue`/`onValueChange`, native input ref; multiline uses TextArea from the owned control catalog |
| CircularProgress / CircularProgressProps | Named Progress with fixed circular presentation; omitted value is indeterminate, numeric value is determinate |
| Checkbox / CheckboxProps | Own `label`, `checked`/`defaultChecked`/`onCheckedChange`, mixed state, native input ref |
| FormControlLabel / FormControlLabelProps | Removed; pass `label` to Checkbox/Switch; RadioGroup owns option labels |
| IconButton / IconButtonProps | Required `label`, `onPress`, owned density/tone/variant, native button ref |
| MuiLink / MuiLinkProps | Removed; use exported Link / LinkProps with native anchor ref and host navigation adapter |
| Menu / MenuProps | Named trigger plus owned `items`, `onAction(id)`, controlled/default open state; inherits scope density unless explicit |
| MenuItem / MenuItemProps | Item component/props removed; MenuItem is now an owned item-record type, passed in Menu.items |
| Select / SelectProps | Named control, string option IDs, `value`/`defaultValue`/`onValueChange`, native button ref |
| SelectChangeEvent | Removed; callbacks receive `string` or `null` |
| Autocomplete / AutocompleteProps | Alias of owned ComboBox / ComboBoxProps; readonly `{id,label,disabled?}` options and selected string IDs; native input ref. Free-solo, multiple values and arbitrary renderers are removed; use TextField or AsyncMultiSelect for those workflows |
| Divider / DividerProps | Native divider; horizontal/vertical orientation and native ref |
| Chip / ChipProps | Owned presentation and optional named `onRemove`; label content is children |
| LinearProgress / LinearProgressProps | Named Progress with fixed linear presentation; value bounds/valueText and native div ref |
| Switch / SwitchProps | Own label, boolean checked/default/change values, native input ref |
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
