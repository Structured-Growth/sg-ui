# Owned page navigation

Task reference: M-10. Repository inventory confirms this is an authoring page list; the backlog summary of previous/next navigation does not describe the shipped control. No link or route model is introduced. `ExperiencePageNavigator` preserves its public name, page
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
read-only mutations and last-page protection. Stories provide interactive host
state, read-only, last-page, dark and independent-scrolling examples. Full native
browser, touch, zoom and screen-reader acceptance gates remain in the master
backlog until independently verified.
