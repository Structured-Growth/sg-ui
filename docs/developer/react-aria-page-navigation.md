# Owned page navigation

Task reference: M-10. The authoring page list retains its existing page mutations and controlled selection. Optional adjacentNavigation supplies host-owned previous/next destinations without changing the existing authoring model. `ExperiencePageNavigator` preserves its public name, page
model, active key and host callbacks. The host owns page creation, persistence,
selection and ordering. It uses owned Button, IconButton, Menu, Dialog, TextField,
Typography and icons, with React Aria inside interaction controls.

Load `@structured-growth/sg-ui/styles.css` and provide `Provider` or `ThemeScope`.
This is a breaking visual-foundation requirement. MUI theme overrides and internal
MUI classes no longer style the navigator. `className`, native `style`, and
`data-sgui-part="page-navigator"` / `"page-list"` provide owned styling hooks.
Colors, spacing and typography use generated tokens; portals inherit the scope.

Selection stays controlled by `activePageKey`; activating the separate action
trigger does not select the page. Selection buttons expose `aria-current="page"`.
The compact menu preserves rename/remove and adds Move up/Move down so keyboard
and touch users can invoke the existing `onReorderPages(sourceKey, targetKey)`
contract. These commands request a move to the adjacent page's current position;
the host applies the resulting order. Native drag/drop retains `text/page-key`
and rejects self drops or keys absent from the supplied pages. Read-only blocks
mutations and dragging while allowing page selection. The final page cannot be
removed through the menu. When the host removes the row whose menu requested removal, focus moves to the adjacent surviving selection button after menu focus restoration.

Rename uses a small owned dialog and an auto-focused labelled field. Save and
Enter share native form submission; titles are trimmed, and blank/unchanged names
close without invoking the callback, preserving the prior behavior. Escape,
Cancel, the close button and outside dismissal discard the edit. A page removed
by the host during editing cannot be renamed. Dialog dismissal returns focus to
the invoking action trigger when it still exists. Library strings use translation
keys with English `defaultMessage`; host page titles and an explicit navigator
`title` remain host-translated.

Colocated behavior tests cover separated actions, controlled selection, rename
submission/dismissal/focus, portal theme, keyboard reorder, drag validation,
read-only mutations and last-page protection. The docs website and private native fixtures provide interactive host
state, read-only, last-page, dark and independent-scrolling examples.
Retained native authoring-list and translated presentation evidence is mapped in
[the prior component reconciliation](final-acceptance/wave-02-01/report.md#a-m-10--partial)
and HB-14 in [hardening execution](react-aria-hardening-execution.md).
Optional `adjacentNavigation` contains `previous` and `next` destination records
(`key`, `label`, optional `href`/`disabled`) and an optional navigation-region label.
Null or absent sides render disabled boundary buttons; disabled destinations never
render an active link. Action destinations request `onSelectPage(key)` and keep
`activePageKey` host controlled. `href` destinations use owned Link/native adapter
semantics, retain modified-click behavior, and do not emit a second selection
request. The host supplies adjacent records from its current ordered data and
updates the accepted active page or route. Read-only blocks collection mutation
while preserving these navigation paths. Omitting adjacentNavigation retains the
existing presentation. Reorder commands remain distinct from page navigation. Actual browser zoom, physical touch and spoken screen-reader evidence
remain separate; no owner decision is inferred from these examples.
