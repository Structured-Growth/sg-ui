# Inherited styling migration

This maps exact inherited style/slot hooks from the initial extraction's locked
Material7.3.11 and DataGrid8.29.3 declarations to current owned public contracts.
The archives and transitive types are verified against the original lockfile
integrities. No installed upstream runtime is needed to review these mappings.
See the [740-row exact map](final-acceptance/wave-04/08/historical-styling-mappings.json)
for original types, origins, deprecated tags, current types and explicit hooks.
The [resolved original props](final-acceptance/wave-04/08/historical-resolved-props.json)
retain non-styling callbacks/models as well. Existing explicit frame-part mappings
remain in [card frames](react-aria-card-frames.md).

## Conversion rules

`sx` objects/callbacks/arrays are removed. Convert identity through owned token
scopes; convert contextual layout to native class/style only when the current
boundary declares them. Native style does not evaluate theme callbacks, spacing
shorthands, responsive-object grammar or array merging. Keep typography in owned
roles/tokens rather than local font declarations.

`classes`, upstream slots/slotProps/componentsProps, nested *Props and
*Component hooks describe the old engine DOM. They have no generic compatibility
mapping. Use only current declared part props and render/content slots; compose
public components when the old element-replacement mechanism is gone. A private
`data-sgui-part` or hashed class does not create a new prop or stable DOM tree.

An old native `className`/`style` is retained only where the current target declares
it. Same spelling does not preserve polymorphic refs or the previous inner/outer
node. Checkbox, TextField, Select, Menu, Calendar, Tooltip and Popover have distinct
escape hatches; do not recommend a generic root style for all controls. Use the
[native ref/part table](react-aria-public-composition-contracts.md#slots-native-refs-and-styling).

## Exact boundary groups

The following lists enumerate captured former hooks, including native class/style.
The exact map distinguishes retained native names from removed engine topology.

| Former contract | Captured old hooks | Current public boundary |
| --- | --- | --- |
| `BoxProps` | `alignContent`, `alignItems`, `alignSelf`, `bgcolor`, `border`, `borderBottom`, `borderColor`, `borderLeft`, `borderRadius`, `borderRight`, `borderTop`, `bottom`, `boxShadow`, `boxSizing`, `classes`, `className`, `color`, `columnGap`, `component`, `display`, `displayPrint`, `flex`, `flexBasis`, `flexDirection`, `flexGrow`, `flexShrink`, `flexWrap`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `gap`, `gridArea`, `gridAutoColumns`, `gridAutoFlow`, `gridAutoRows`, `gridColumn`, `gridRow`, `gridTemplateAreas`, `gridTemplateColumns`, `gridTemplateRows`, `height`, `justifyContent`, `justifyItems`, `justifySelf`, `left`, `letterSpacing`, `lineHeight`, `m`, `margin`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginBottom`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginLeft`, `marginRight`, `marginTop`, `marginX`, `marginY`, `maxHeight`, `maxWidth`, `mb`, `minHeight`, `minWidth`, `ml`, `mr`, `mt`, `mx`, `my`, `order`, `overflow`, `p`, `padding`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingBottom`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingX`, `paddingY`, `pb`, `pl`, `position`, `pr`, `pt`, `px`, `py`, `right`, `rowGap`, `style`, `sx`, `textAlign`, `textOverflow`, `textTransform`, `top`, `typography`, `visibility`, `whiteSpace`, `width`, `zIndex` | `BoxProps` |
| `StackProps` | `alignContent`, `alignItems`, `alignSelf`, `bgcolor`, `border`, `borderBottom`, `borderColor`, `borderLeft`, `borderRadius`, `borderRight`, `borderTop`, `bottom`, `boxShadow`, `boxSizing`, `classes`, `className`, `color`, `columnGap`, `component`, `direction`, `display`, `displayPrint`, `flex`, `flexBasis`, `flexDirection`, `flexGrow`, `flexShrink`, `flexWrap`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `gap`, `gridArea`, `gridAutoColumns`, `gridAutoFlow`, `gridAutoRows`, `gridColumn`, `gridRow`, `gridTemplateAreas`, `gridTemplateColumns`, `gridTemplateRows`, `height`, `justifyContent`, `justifyItems`, `justifySelf`, `left`, `letterSpacing`, `lineHeight`, `m`, `margin`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginBottom`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginLeft`, `marginRight`, `marginTop`, `marginX`, `marginY`, `maxHeight`, `maxWidth`, `mb`, `minHeight`, `minWidth`, `ml`, `mr`, `mt`, `mx`, `my`, `order`, `overflow`, `p`, `padding`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingBottom`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingX`, `paddingY`, `pb`, `pl`, `position`, `pr`, `pt`, `px`, `py`, `right`, `rowGap`, `spacing`, `style`, `sx`, `textAlign`, `textOverflow`, `textTransform`, `top`, `typography`, `useFlexGap`, `visibility`, `whiteSpace`, `width`, `zIndex` | `StackProps` |
| `TypographyProps` | `align`, `alignContent`, `alignItems`, `alignSelf`, `bgcolor`, `border`, `borderBottom`, `borderColor`, `borderLeft`, `borderRadius`, `borderRight`, `borderTop`, `bottom`, `boxShadow`, `boxSizing`, `classes`, `className`, `color`, `columnGap`, `component`, `display`, `displayPrint`, `flex`, `flexBasis`, `flexDirection`, `flexGrow`, `flexShrink`, `flexWrap`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `gap`, `gridArea`, `gridAutoColumns`, `gridAutoFlow`, `gridAutoRows`, `gridColumn`, `gridRow`, `gridTemplateAreas`, `gridTemplateColumns`, `gridTemplateRows`, `gutterBottom`, `height`, `justifyContent`, `justifyItems`, `justifySelf`, `left`, `letterSpacing`, `lineHeight`, `m`, `margin`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginBottom`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginLeft`, `marginRight`, `marginTop`, `marginX`, `marginY`, `maxHeight`, `maxWidth`, `mb`, `minHeight`, `minWidth`, `ml`, `mr`, `mt`, `mx`, `my`, `noWrap`, `order`, `overflow`, `p`, `padding`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingBottom`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingX`, `paddingY`, `paragraph`, `pb`, `pl`, `position`, `pr`, `pt`, `px`, `py`, `right`, `rowGap`, `style`, `sx`, `textAlign`, `textOverflow`, `textTransform`, `top`, `typography`, `variant`, `variantMapping`, `visibility`, `whiteSpace`, `width`, `zIndex` | `TypographyProps` |
| `TextFieldProps` | `classes`, `className`, `color`, `component`, `FormHelperTextProps`, `fullWidth`, `InputLabelProps`, `inputProps`, `InputProps`, `margin`, `SelectProps`, `size`, `slotProps`, `slots`, `style`, `sx`, `variant` | `TextFieldProps` |
| `CircularProgressProps` | `classes`, `className`, `color`, `size`, `style`, `sx`, `variant` | `CircularProgressProps` |
| `CheckboxProps` | `classes`, `className`, `color`, `component`, `focusVisibleClassName`, `inputProps`, `LinkComponent`, `size`, `slotProps`, `slots`, `style`, `sx`, `TouchRippleProps` | `CheckboxProps` |
| `FormControlLabelProps` | `classes`, `className`, `color`, `componentsProps`, `slotProps`, `slots`, `style`, `sx` | `CheckboxProps`, `SwitchProps`, `RadioGroupProps` |
| `IconButtonProps` | `classes`, `className`, `color`, `component`, `focusVisibleClassName`, `LinkComponent`, `size`, `style`, `sx`, `TouchRippleProps` | `IconButtonProps` |
| `MuiLinkProps` | `align`, `alignContent`, `alignItems`, `alignSelf`, `bgcolor`, `border`, `borderBottom`, `borderColor`, `borderLeft`, `borderRadius`, `borderRight`, `borderTop`, `bottom`, `boxShadow`, `boxSizing`, `classes`, `className`, `color`, `columnGap`, `component`, `display`, `displayPrint`, `flex`, `flexBasis`, `flexDirection`, `flexGrow`, `flexShrink`, `flexWrap`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `gap`, `gridArea`, `gridAutoColumns`, `gridAutoFlow`, `gridAutoRows`, `gridColumn`, `gridRow`, `gridTemplateAreas`, `gridTemplateColumns`, `gridTemplateRows`, `gutterBottom`, `height`, `justifyContent`, `justifyItems`, `justifySelf`, `left`, `letterSpacing`, `lineHeight`, `m`, `margin`, `marginBlock`, `marginBlockEnd`, `marginBlockStart`, `marginBottom`, `marginInline`, `marginInlineEnd`, `marginInlineStart`, `marginLeft`, `marginRight`, `marginTop`, `marginX`, `marginY`, `maxHeight`, `maxWidth`, `mb`, `minHeight`, `minWidth`, `ml`, `mr`, `mt`, `mx`, `my`, `noWrap`, `order`, `overflow`, `p`, `padding`, `paddingBlock`, `paddingBlockEnd`, `paddingBlockStart`, `paddingBottom`, `paddingInline`, `paddingInlineEnd`, `paddingInlineStart`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingX`, `paddingY`, `paragraph`, `pb`, `pl`, `position`, `pr`, `pt`, `px`, `py`, `right`, `rowGap`, `style`, `sx`, `textAlign`, `textOverflow`, `textTransform`, `top`, `typography`, `variant`, `variantMapping`, `visibility`, `whiteSpace`, `width`, `zIndex` | `LinkProps` |
| `MenuProps` | `BackdropComponent`, `BackdropProps`, `classes`, `className`, `color`, `component`, `components`, `componentsProps`, `elevation`, `MenuListProps`, `PaperProps`, `slotProps`, `slots`, `style`, `sx`, `TransitionComponent`, `TransitionProps`, `variant` | `MenuProps` |
| `MenuItemProps` | `classes`, `className`, `component`, `dense`, `disableGutters`, `focusVisibleClassName`, `LinkComponent`, `style`, `sx`, `TouchRippleProps` | `MenuItem` |
| `SelectProps` | `classes`, `className`, `color`, `components`, `componentsProps`, `fullWidth`, `IconComponent`, `inputComponent`, `inputProps`, `margin`, `MenuProps`, `SelectDisplayProps`, `size`, `slotProps`, `slots`, `style`, `sx`, `variant` | `SelectProps` |
| `AutocompleteProps` | `ChipProps`, `classes`, `className`, `color`, `componentsProps`, `fullWidth`, `ListboxComponent`, `ListboxProps`, `PaperComponent`, `PopperComponent`, `size`, `slotProps`, `slots`, `style`, `sx` | `AutocompleteProps` |
| `DividerProps` | `classes`, `className`, `component`, `orientation`, `style`, `sx`, `textAlign`, `variant` | `DividerProps` |
| `ChipProps` | `classes`, `className`, `color`, `component`, `size`, `slotProps`, `slots`, `style`, `sx`, `variant` | `ChipProps` |
| `LinearProgressProps` | `classes`, `className`, `color`, `style`, `sx`, `variant` | `LinearProgressProps` |
| `SwitchProps` | `classes`, `className`, `color`, `component`, `focusVisibleClassName`, `inputProps`, `LinkComponent`, `size`, `slotProps`, `slots`, `style`, `sx`, `TouchRippleProps` | `SwitchProps` |
| `ListProps` | `classes`, `className`, `component`, `dense`, `disablePadding`, `style`, `sx` | `ListProps` |
| `ListItemProps` | `alignItems`, `classes`, `className`, `component`, `components`, `componentsProps`, `ContainerComponent`, `ContainerProps`, `dense`, `disableGutters`, `disablePadding`, `slotProps`, `slots`, `style`, `sx` | `ListItemProps` |
| `ListItemButtonProps` | `alignItems`, `classes`, `className`, `component`, `dense`, `disableGutters`, `focusVisibleClassName`, `LinkComponent`, `style`, `sx`, `TouchRippleProps` | `ListItemButtonProps` |
| `ListItemTextProps` | `classes`, `className`, `color`, `primaryTypographyProps`, `secondaryTypographyProps`, `slotProps`, `slots`, `style`, `sx` | `ListItemTextProps` |
| `TableProps` | `classes`, `className`, `component`, `padding`, `size`, `style`, `sx` | `TableProps` |
| `TableHeadProps` | `classes`, `className`, `component`, `style`, `sx` | `TableHeadProps` |
| `TableBodyProps` | `classes`, `className`, `component`, `style`, `sx` | `TableBodyProps` |
| `TableRowProps` | `classes`, `className`, `component`, `style`, `sx` | `TableRowProps` |
| `TableCellProps` | `align`, `classes`, `className`, `color`, `component`, `height`, `padding`, `size`, `style`, `sx`, `variant`, `width` | `TableCellProps` |
| `CollapseProps` | `classes`, `className`, `color`, `component`, `orientation`, `slotProps`, `slots`, `style`, `sx` | `CollapseProps` |
| `TooltipProps` | `classes`, `className`, `color`, `components`, `componentsProps`, `PopperComponent`, `PopperProps`, `slotProps`, `slots`, `style`, `sx`, `TransitionComponent`, `TransitionProps` | `TooltipProps` |
| `AppDataGridProps` | `classes`, `className`, `getCellClassName`, `getRowClassName`, `slotProps`, `slots`, `style`, `sx` | `AppDataGridProps` |
| `AppModalAction` | `color`, `variant` | `AppModalAction` |
| `AppModalProps` | `fullWidth`, `height`, `maxWidth`, `paperSx`, `size`, `width` | `AppModalProps` |
| `AppButtonProps` | `classes`, `className`, `color`, `component`, `disableElevation`, `focusVisibleClassName`, `fullWidth`, `LinkComponent`, `size`, `style`, `sx`, `TouchRippleProps`, `variant` | `ButtonProps` |
| `ClassCardFrameProps` | `bodySx`, `footerSx`, `headerSx`, `width` | `ClassCardFrameProps` |
| `RowSubHeaderProps` | `titleVariant` | `RowSubHeaderProps` |
| `AppDataGridShellInheritedProps` | `classes`, `className`, `getCellClassName`, `getRowClassName`, `slotProps`, `slots`, `style`, `sx` | `AppDataGridShellProps` |

## System and visual props

The map includes the resolved upstream SystemProps key set, not just sx. Box,
Stack and Typography formerly inherited responsive spacing, display, flex/grid,
color and font fields. Convert their theme-number/string/array grammar to current
owned layout props where declared, or CSS using owned tokens. Do not copy a spacing
number as a native pixel value. Use Typography roles/tokens for font properties.

Old color/variant/size and element/slot replacement props are mapped separately.
Compare the exact current domain before retaining the same spelling. Button
contained maps to filled; old palette color keys do not become native color
attributes. Use the current owned tone/density/variant choices. Intrinsic as where
declared does not restore arbitrary upstream component polymorphism. Scalar row
header titleVariant now uses the current owned typography domain. No broad
responsive-object or theme callback evaluator remains in the consumer API.

## Wrapper-specific conversions

AppButton becomes Button; upstream ButtonProps/style/event contracts are replaced
by ButtonProps, onPress and owned variants/tones/density. AppModal paperSx becomes
its declared surface className/style, with bodyClassName/bodyStyle for body layout;
retain surface/body ownership. ClassCardFrame headerSx/bodySx/footerSx become their
matching part ClassName/Style props. The grid's inherited sx/slots/slotProps and
engine cell selectors are removed; use its documented owned columns/renderers,
scopes and exposed part contracts. Do not reintroduce engine-prop passthrough.

This is a bounded captured-contract map:28 primitive prop contracts, eight named
wrapper/model contracts or inherited branches and the separate SelectChangeEvent type. The source-backed
wrapper type nodes remain exact, but not every original library wrapper is claimed
covered. Complete the remaining public baseline joins before claiming exhaustive
API/default compatibility. Incompatible published changes still require the actual
Conventional Commit release marker and authoritative release-history decision.
