# Owned rich-text formatting toolbar

Task reference: M-26. `RichTextFormattingToolbar` retains its public name and
formatting callbacks while composing owned buttons, selects, icons and the
[editor menu controls](react-aria-editor-menus.md). Import
`@structured-growth/sg-ui/styles.css` once and provide `Provider` or `ThemeScope`,
including in mixed editor compositions. Use `Provider` with the host translation
locale for direction-aware portaled interaction. The granular entry is
`@structured-growth/sg-ui/components/RichTextFormattingToolbar`.

## Retained host contract

Heading values remain `Normal`, `Heading 1` through `Heading 6`, and `Body Alt 1`
through `Body Alt 3`. Heading and font-family selections request their existing
string callbacks once per change, after the chooser event finishes and restores
focus. This permits host commands to refocus contenteditable without native Enter
editing the selected text during the chooser commit. Font families remain Arial, Georgia and Times
New Roman. Heading, font family, font size, colors, alignment and inline-format
state remain host-controlled; activation does not invent document state.

Undo/redo, font-size decrease/increase, bold/italic/underline/code, link, the eight
text-style commands, alignment/indent/outdent and insertion callbacks remain.
`onLinkMouseDown` remains a separate pointer preparation callback: the link
control prevents mouse-down focus transfer before requesting it, preserving the
host's opportunity to capture editor selection. `onLink` is the activation
callback for pointer, Enter and Space. Keyboard activation does not synthesize
`onLinkMouseDown`; the host must keep its keyboard selection path available.

The toolbar owns presentation and interaction, while the host owns Lexical
commands, selection restoration, document mutations, serialization and history.
No Lexical command or document-model contract is replaced by this migration.
Slots remain host-supplied React content. `leftSlot`, `rightSlot`,
`disableContainerPadding`, `showFontFamilySelector` and `showFontSizeControls`
retain their purposes.

## Active, unavailable and hidden controls

Bold, italic, underline and code expose supplied boolean or `"mixed"` active state
as `aria-pressed` on named buttons. Existing booleans remain supported; the host
decides how to derive mixed selection state from the document.
New `activeTextStyles?: readonly TextStyleId[]` forwards checked style choices to
`TextStyleMenuControl`; omit it to retain ordinary menu commands. New `canIndent`
and `canOutdent` forward host restrictions and default to true.

`disabledControls` and `disabledControlSets` retain their IDs and combine with
callback availability. A missing callback now disables the associated action
instead of presenting an enabled no-op. Nested menus also disable unavailable
commands. `hiddenControls` and `hiddenControlSets` retain their IDs and omit
controls from rendering and keyboard navigation. Toolbar actions are native
button actions and do not submit surrounding forms.

## Styling and integration changes

The toolbar adds a native `HTMLDivElement` ref, `className`, native `style` and an
optional `aria-label`. Its default accessible group name and built-in control
labels use the translation adapter with English fallbacks. Controls wrap using
logical, token-based CSS; padding suppression still supports embedding in host
chrome. Host slots must provide their own accessible names and responsive sizing.

**Breaking foundation mapping:** load the compiled stylesheet and replace reliance
on MUI selectors, theme overrides or Emotion with owned tokens and native
class/style. There are no public `sx` or upstream control props. Existing callback
and control IDs remain; unavailable callbacks now visibly disable actions.
The heading select uses a single value-change path, removing the former duplicate
menu-click/change callback path. Foreground/background color presets and Clear
retain the [owned picker mapping](react-aria-editor-menus.md#textcolorpickercontrol-m-29);
hosts applying Clear through Lexical map the empty string to null style removal.

This contract does not complete floating toolbar anchoring (M-25), editor
layout/chrome (M-21–M-23), PageRichTextEditorSection (M-34), grid migration or the
general U/X/R/Z acceptance gates. Validation evidence belongs in the
[execution record](react-aria-progress.md#rich-text-formatting-toolbar).
