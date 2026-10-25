# TextField prefixes and suffixes

`TextField` adds `prefix`, `suffix` and `affixAppearance` to its existing owned
contract. No new field alias, dependency, formatting mask or numeric parser is added.

## Reference research

Reviewed 2026-10-24:

| Reference | Decision |
| --- | --- |
| [Bootstrap input groups](https://getbootstrap.com/docs/5.3/forms/input-group/) | Support the exact `$` + editable whole-dollar digits + `.00` pattern and fixed URL/unit fragments. Shaded attached segments are optional. |
| [GOV.UK text input](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes) | Keep fixed content outside the native input, use a visible label, and repeat units/meaning in the label or hint. Visual affixes are aria-hidden, with no extra tab stops. Hosts should account for pasted unit/currency text in their validation policy. |
| [Mantine input sections](https://mantine.dev/core/input/) | Accept non-interactive icons or text at either side. Use intrinsic layout instead of fixed icon-width boxes or manual input padding for text. Preserve space for the editable value. |

## Contract and ownership

- `prefix` and `suffix` accept non-interactive React content (text, an icon or a
  small combination). They follow logical start/end in RTL; no absolute left/right
  positioning is required. Existing `startIcon`/`endIcon` stay dedicated decorative
  icon slots. Order is start icon, prefix, input, suffix, end icon.
- Default `affixAppearance="inline"` shares the field surface. `"subtle"` supplies
  shaded sections and dividers inside the same border and keyboard-focus outline.
  Colors are generated component aliases; density, readonly, invalid, disabled,
  forced colors, refs and message placement retain the existing contracts.
- Decorations never enter the native value, edit callbacks, text selection/copy,
  validation or form serialization. Clicking a decoration focuses the input; a
  disabled native input (including fieldset inheritance) remains blocked.
- Prefix/suffix content is aria-hidden. Put units in `label` or `description`, e.g.
  “Amount in whole US dollars” and “Enter whole dollars, without cents”. Do not put
  buttons, links, selectors or other focusable actions inside these slots.
- `.00` does not add decimals, prevent decimal typing, mask pasted values or change
  a currency. The consumer owns parsing, localization, validation and persistence.
  `inputMode="numeric"` suggests a numeric keyboard; a host-chosen native `pattern`
  and required policy can validate whole-dollar digits. Preserve editing/IME rather
  than filtering keystrokes. A URL prefix/suffix does not validate or assemble URLs.
- Keep fixed text short. Affixes may wrap on narrow layouts; they do not overlay
  the typed value. Consumer content must fit the available space.

The TextField catalog has controls for both affixes and their appearance, fixed
examples at both densities, icons mixed with text, RTL, disabled/readonly/error
states, and a source-backed native whole-dollar form. Each panel owns its state.

Focused unit and production-browser checks cover raw editing/form/reset, semantic
names, controlled/blocked states, intrinsic layout, RTL, native validation, source
compilation and copy. Existing TextField tests remain in place. This is not manual
screen-reader/device evidence.

The native form verification also reproduced existing corrected-value pointer
submission behavior in both the older registration and new currency examples:
blur can remove an error and move the button during its click. This separate
shared-field issue is tracked as AUD-012; native validation and keyboard blur/submit
remain covered, and affix styling does not change that behavior.
