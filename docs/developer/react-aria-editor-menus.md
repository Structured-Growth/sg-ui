# Owned editor menu contracts

Task references: M-27–M-30. The four public component names and host formatting/
insertion callbacks are preserved. Each has a granular `/components/<name>` entry.
Import `@structured-growth/sg-ui/styles.css` once and supply `Provider` or
`ThemeScope`, including when composing these controls into the remaining legacy
editor. Use `Provider` with the host translation locale for RTL interaction and
logical menu placement. These controls do not import Lexical or own editor state.
The surrounding toolbars/editor remain pending migration.

## InsertContentMenuControl (M-27)

`disabled`, `onInsertImage`, `onInsertHorizontalRule` and `onInsertColumnsLayout`
remain. Commands without callbacks are now disabled instead of closing without
performing work. The trigger forwards a native button ref and accepts `className`
and native `style`. Keyboard commands close the compact menu and restore trigger
focus; a host callback may open an owned dialog whose focus scope takes focus.
The host owns insertion, document announcements and final editor selection/focus.
Commands never submit surrounding forms.

## TextAlignMenuControl (M-28)

`AlignOption` remains `left | center | right | justify | start | end`. `value` is
host-controlled; selecting an alignment requests `onChange(next)` exactly once.
The current alignment is an accessible checked radio item, alongside ordinary
indent/outdent commands. Missing callbacks disable commands. New `canIndent` and
`canOutdent` default to true and let the host express document restrictions.
`disabled` disables the trigger. Native button ref/class/style are supported.
Logical start/end icons follow the rendered direction; physical left/right retain
their meaning. Displayed shortcuts describe host editor commands; the menu does
not register global keyboard shortcuts.

## TextStyleMenuControl (M-30)

The eight existing callbacks remain: lowercase, uppercase, capitalize,
strikethrough, subscript, superscript, highlight and clear formatting. Missing
callbacks disable their commands. New `activeStyles?: readonly TextStyleId[]`
marks host-controlled case/format choices as checked menu items. Omit it for
ordinary commands. Clear formatting remains a separate command. The existing
component has no typeface selection API; typeface/heading controls remain owned
by the host formatting toolbar. Labels and decorative case samples use shared
tokens; shortcuts remain informational.

## TextColorPickerControl (M-29)

`value`, `onChange(string)`, `triggerIcon` and `disabled` remain. A missing callback
now disables the trigger. `mode` defaults to `foreground`; `background` gives the
picker its own accessible name and icon. The current color is indicated on the
trigger. Six-digit hex input commits on Enter or blur, normalizes case and trims
outer spaces; invalid drafts show an associated error without invoking the host.
Composing Enter is ignored and Enter followed by blur does not duplicate a commit.
Native color input and labeled swatches request values through the same callback.
Opening reloads the host value, and external changes replace the draft. Escape
returns trigger focus. The internal portal form does not submit host forms.

Clear requests `""` so the host can remove the foreground/background declaration.
Reset requests `#000000` for foreground and `#ffffff` for background. The host
owns storage, selection restoration and applying styles. The legacy formatting
toolbar now explicitly sets background mode for its background picker.

**Breaking preset mapping:** swatches now emit semantic generated references
instead of MUI palette references. Previously stored MUI token strings are not
rewritten by the picker; migrate stored rich text in the consuming application
before removing those variables. Arbitrary incoming CSS colors remain displayed;
custom editing accepts six-digit hex values.

| Choice | Emitted value |
| --- | --- |
| Text | `var(--sgui-text)` |
| Muted text | `var(--sgui-text-muted)` |
| Primary | `var(--sgui-action)` |
| Primary emphasis | `var(--sgui-action-hover)` |
| Error | `var(--sgui-danger)` |
| Surface | `var(--sgui-surface)` |
| Subtle surface | `var(--sgui-surface-subtle)` |

Old secondary/success/warning/grey palette choices have no direct semantic owned
token equivalent and are removed from the default swatch set. Hosts can continue
providing explicit stored hex values. This batch does not complete the editor,
full icon/primitives catalog, dependency removal or broad acceptance gates.
