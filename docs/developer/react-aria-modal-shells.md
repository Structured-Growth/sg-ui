# Owned modal and application shells

Tasks M-06–M-09. AppModal, AuthShell, SideNavigation and AppShell keep their public
names and have granular `/components/<Name>` exports. Import `/styles.css` once
and provide `Provider` or `ThemeScope`, including around mixed editor compositions.
These modules use owned controls and compiled token CSS; root catalog imports still
include unmigrated components and their peers.

## AppModal breaking mappings

| Previous contract | Owned contract |
| --- | --- |
| `onClose(event, reason)` | `onClose(reason)` with `escape`, `outside`, `close-button`, `dismiss` |
| Action `onClick(event)` | Action `onPress()`; one normalized pointer/keyboard activation |
| Action `variant="contained"` | `variant="filled"`; `outlined` and `text` remain |
| Action `color="inherit"` | `tone="neutral"`; primary actions default to `primary` |
| `maxWidth` | `size`: xs, sm (default), md, lg, xl, full |
| `fullWidth` | Responsive surface width from size; explicit native `width` when needed |
| `paperSx` | Native surface `style` and `width`/`height`; `className` targets the dialog |
| Body selector/style overrides | `bodyClassName`/`bodyStyle` and documented parts |

Actions add `loading` and default to form-safe buttons. Host persistence stays in
callbacks. `disableEscapeKeyDown` and `disableBackdropClose` independently suppress
implicit dismissal; the close button and host actions remain available. Escape and
outside dismissal do not masquerade as explicit close. The controlled `open` prop
remains authoritative. Closing restores focus to the trigger when it is still
available; nested popovers handle their own Escape first.

`title` labels the dialog and `subtitle` is its associated description. Custom
`headerContent` should supply `aria-label`; the title is used as that label if both
are supplied. A headerless dialog has a translated generic fallback name; hosts
should provide a meaningful `aria-label`. Custom header/footer content replaces
the default content. Steps appear only when total is at least two, including
custom step labels. Default step text uses the translation adapter with values.

Native ref targets the dialog element. `style` targets its surface; `bodyStyle`
targets its scrolling column. Width/height accept native CSS lengths or pixel
numbers. Height presets sm/md/lg use 56/68/80dvh; xl defaults to 96vw/92dvh and
full fills the viewport. All sizes remain constrained by the viewport.
Parts: `dialog-overlay`, `dialog-surface`, `dialog-header`, `dialog-body`,
`dialog-footer`, and nested `page-tabs`.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/experimental";
import { AppModal } from "@structured-growth/sg-ui/components/AppModal";
import { AppPageTabs } from "@structured-growth/sg-ui/components/AppPageTabs";

<Provider>
  <AppModal open={open} title="Course settings" size="md" heightMode="md"
    onClose={() => setOpen(false)} showCloseButton
    primaryAction={{ label: "Save", onPress: save }}>
    <AppPageTabs value={section} onChange={setSection} items={sections} />
  </AppModal>
</Provider>;
```

A direct AppPageTabs child fills the body with a stationary tab strip and an
independently scrolling selected panel. The header/footer remain outside that
scroll area. When enlarged text or a short viewport leaves insufficient space
for the chrome and a usable panel, the dialog itself scrolls. The panel's minimum
space follows control/spacing tokens; initial focus below the visible dialog is
scrolled into view. Nested portaled focus does not move the outer dialog.
Ordinary body content scrolls within the body. The editor link,
image and column-layout modals now map the owned props, while their remaining
legacy bodies await their own migration tasks.

## Shells and host integration

AuthShell preserves title/subtitle/children/footerContent and adds native div
ref/className/style. It renders a semantic h1, a responsive 35rem panel, wrapping
footer, and tall content that grows into document scrolling. The host supplies
forms, validation, submission and account flows. Wide host content can scroll
inside the body without widening the document.

AppShell retains navigation/children and exports AppShellProps, with native
customization. SideNavigation retains its presentation model, item selection,
organization-change callbacks, icon resolver and routing/account/translation
adapters. Navigation and account data remain host-supplied. See the colocated
stories/tests and [execution evidence](react-aria-progress.md) for responsive,
focus and account behavior checks and outstanding browser acceptance gates.

SideNavigation exposes a native nav ref, className/style and optional aria-label.
Leaf routes are native anchors with current-page semantics; normal activation
uses the host routing adapter, and modified clicks remain native. Expand controls
can close default/path-expanded ancestors explicitly. Drilldown and Back move
focus to the new menu or restored parent after the host renders the change.
Collapse now works and retains focus on the expand trigger.

The account/organization menu remains compact and inherits the portal theme.
Multiple-account organization/logout choices are flattened, qualified with the
account identity. Logout/add-account actions stay disabled without an account
adapter. Successful callbacks retain existing host route/session integration;
organization refresh remains host-owned. Pending operations suppress repeats.
Rejected switches/logout keep the menu open with a host-translated alert and
permit retry; failed logout no longer navigates. Menu's optional `errorMessage`
keeps such errors inside its accessible portaled scope.

AppShell exposes a native div ref, className/style, mainId/mainLabel and a native
main landmark. Desktop navigation and main content scroll independently. At
40rem and below, navigation stacks above the main region, limited to 45dvh;
collapse reduces it to the trigger so main content has more space. This replaces
the previous fixed side-by-side narrow layout. These responsive and error/focus
improvements are deliberate behavior changes. Full-screen modal ignores height
presets; an explicit native height remains a host override.

ColumnsLayoutModal, ImageUploadModal and LinkUrlModal also use the owned foundation.
Apply migrated boundaries to these directories; see [editor dialog contracts](react-aria-editor-dialogs.md)
for preset draft reset, URL protocol validation and optional host-owned image descriptions.
Load /styles.css and provide Provider or ThemeScope.

## Nested dialog acceptance (U-08/U-19/X-04/X-05, partial)

The `NestedOverlays` AppModal story composes two controlled modals, a child
popover, a menu and a combobox using the existing owned primitives. The host
keeps each modal's open state and records dismissal requests. Escape closes
only the top overlay: guidance returns focus to its child trigger, child modal
returns focus to its parent trigger, and parent modal returns focus to the
original page trigger. A pointer outside the child dismisses only that child;
the parent's explicit Close retains the `close-button` reason. Menu and
combobox Escape leave their containing modal open. The menu portal inherits
dark theme, compact density and Arabic locale/RTL direction at 320 CSS pixels.

The exclusive browser regression file is
[`batch01-dialogs.spec.ts`](../../tests/browser/batch01-dialogs.spec.ts).
It also exercises the existing sticky-tab stories at a 640 × 320 CSS-pixel
viewport with 200% root text and increased line/letter/word spacing in both
themes. Native Tab traverses every field and footer action; focused controls
must fit the viewport and pass center-point hit testing, and the surface must
avoid horizontal overflow. Existing broader tab-panel clipping and stationary
chrome checks remain in
[`display-preferences.spec.ts`](../../tests/browser/display-preferences.spec.ts).

These automated checks are a bounded acceptance slice. Root text scaling and
CSS viewport sizing do not operate browser chrome zoom. Actual device/browser
zoom, assistive-technology behavior, every overlay placement and focus recovery
when a host removes a trigger remain separate acceptance work. This record does
not close the broad U/X gates or extend editor-dialog acceptance.

The first batch run also exposed a separate scope issue: with an English host
locale, `Provider dir="rtl"` reaches the modal but the menu's portaled root uses
`dir="ltr"`. Locale-driven Arabic direction is tested here. Explicit direction
overrides across other primitives need a central fix and regression coverage;
that issue is outside this dialog batch's write ownership.
