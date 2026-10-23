# Owned page rich text editor

Task reference: M-34. PageRichTextEditorSection retains its public name, Lexical
JSON document model, editorKey, tool presets/control overrides, change callback
and host image upload contract. It now uses owned controls and token CSS Modules
throughout its composition, including image decoration. Import `/styles.css` once
and provide Provider or ThemeScope. The granular
`@structured-growth/sg-ui/components/PageRichTextEditorSection` entry bounds editor imports. Root and `/components` resolve the owned catalog.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/theme";
import { PageRichTextEditorSection } from "@structured-growth/sg-ui/components/PageRichTextEditorSection";

export function CourseEditor({ value, onChange }) {
  return <Provider><PageRichTextEditorSection
    lexicalValue={value} onLexicalChange={onChange} editorKey="course-content"
    aria-label="Course content" toolPreset="full" style={{ height: 520 }}
  /></Provider>;
}
```

**Breaking visual integration:** the section no longer uses a legacy theme.
Headings, paragraphs, stored body-role markers, links, rules, tables and inline
formatting use scoped foundation tokens in both themes. Existing `--lp-text-variant`
markers remain supported for stored documents. Explicit author-supplied font,
size and color styles remain document content and are not converted to tokens.
The root exposes native div ref, className and style plus editor-section,
editor-viewport and editor-image part hooks. `aria-label` names the editable
textbox; the default Document name, placeholder and generic upload error use the
host translation adapter with English fallbacks.

The toolbar remains outside a single scrolling viewport. The viewport is a named,
keyboard-focusable region with a visible focus outline, including in read-only
mode; native PageDown scrolling is covered by the browser acceptance suite.
The editable document uses input-aware focus visibility: pointer entry, typing
and caret movement do not activate its bounding outline. Tab navigation retains
a visible document focus indicator; the text caret and selection remain native.
Give the section a
bounded height or a zero-minimum flex parent. ContentEditable and its placeholder
share a positioned document container. Narrow tables scroll within the viewport;
formatting controls wrap. The floating toolbar keeps its documented Alt+F10,
selection restoration and fixed-position containing-block requirements.

The editor is internally live: lexicalValue seeds each editorKey, while
onLexicalChange returns serialized edits. Changing lexicalValue alone does not
replace the current document or selection. Change editorKey to load a different
document; this closes stale dialogs, clears saved selections and invalidates
pending uploads. Changing readOnly updates the existing Lexical editor and hides
editing controls, closes dialogs and invalidates pending uploads.

Link creation with unchanged display text wraps existing selected runs and retains
format/style. URL changes retain existing link children; unlinking retains their
format/style. An explicit replacement display text is inserted as new text.
External URLs retain `_blank` and `noopener noreferrer`; relative URLs remain
local. The shared owned destination policy below also governs saved/pasted links. Image callbacks and asset
metadata, columns/table presets, rule insertion, heading/body roles and JSON
serialization retain their existing contracts. Missing upload callbacks retain
local preview behavior; hosts own uploaded files and persistence. The section
owns only the object URLs it creates for those local insertions. It retains them
through read-only changes and undo/redo, including temporarily deleted images,
then revokes them on `editorKey` replacement or unmount. Dialog previews have a
separate shorter lifetime. Host-returned URLs (including blob URLs) are never
revoked by the section. Local blob URLs are temporary, not durable asset addresses;
use `onUploadImage` before saving a document that must survive reload or replacement.

See [dialogs](react-aria-editor-dialogs.md), [formatting toolbar](react-aria-formatting-toolbar.md),
[layout and selection](react-aria-editor-layout.md) and
execution evidence.
`node scripts/test-editor-consumer.mjs` and `--react18` build actual packed
SSR/hydration/Vite consumers of the full section with strict retired-peer guards.
Full browser/touch/assistive-technology, visual, performance and release gates
remain open; this component migration does not complete U/X/R/Z.

## Native clipboard and editing (E-05 partial)

The ClipboardEditing story provides browser-native plain and rich source fields,
a live read-only toggle, the host callback JSON and a saved-document reload through
`editorKey`. Lexical owns paste, inline keyboard formatting and undo/redo; hosts
receive the same serialized node model through `onLexicalChange`. Read-only content
has its own keyboard focus stop. Ctrl/Command+A selects only that document;
native Copy remains available while edits are prevented. Editable commands continue
through Lexical. Clipboard permissions
and browser security policy remain with the browser/host; SGUI does not request
permission or replace native clipboard behavior.

See [browser acceptance](react-aria-browser-acceptance.md) for executed native
transfer evidence. Actual IME composition, physical-device clipboard and live
assistive-technology acceptance remain open; this batch does not close E-05.

## Saved rich documents (E-02/E-04 partial)

The registered editor configuration accepts saved `code-highlight` children in
code blocks as well as ordinary text. Their token metadata survives JSON reload;
this does not enable a new syntax-highlighting service. The experience plugins
include Lexical list interactions, so native Enter continues a saved list and
Enter on an empty item returns to a paragraph. A valid caret on the document
root (for example after deleting a selected rule) keeps toolbar updates usable.

The SavedRichDocument story saves `onLexicalChange` JSON and reloads it with a new
`editorKey`. Colocated and browser checks cover headings, quotes, numbered/bullet
lists, highlighted code, table cells/header/background, paragraph alignment and
indentation, author colors/body-role markers, inline formats, link attributes,
image alt/dimensions/asset IDs and horizontal rules. Browser cases edit before and
after reload and compare unchanged serialized nodes, then repeat read-only
rendering; native list continuation/exit and rule deletion/undo use actual keys.
This representative fixture does not close all E-02/E-04 node/plugin, command,
selection, history, merge-table and consumer-document combinations. Link/image
trust boundaries remain separately open under E-06/E-07.

## Link destination policy (E-06/E-07 partial)

The dialog, saved/pasted link renderer and activation use one owned policy:
HTTP/HTTPS, nonempty mailto/tel destinations and document/root-relative paths,
queries and fragments are accepted. `www.` becomes HTTPS in the editor. Network
paths (`//`), backslashes, control/space characters, malformed HTTP destinations
and other schemes are rejected. LinkUrlModal hosts can further restrict schemes
and relative paths; its callback still returns the trimmed host value.

Saved and pasted rejected links render with `href="about:blank"`; clicking or
middle-clicking them does not open a destination. Accepted links preserve the
existing new-tab activation in both editable and read-only modes, including
modifier and middle clicks, with `noopener,noreferrer`. A noncollapsed editor
selection suppresses activation. Host-canceled clicks remain canceled.

The internal owned link replacement preserves selected children, formatting,
URL, title, target and rel. `onLexicalChange` continues to emit the saved `link`
node type, and accepts existing saved documents through `editorKey` reload.
Rejected original URLs remain in host JSON for fidelity; the host must apply its
own destination policy when rendering that JSON elsewhere. This is a link policy,
not arbitrary rich-content sanitization. Image sources, document styles, host
upload validation and full rich-content trust acceptance remain open.

The LinkDestinations story exposes saved/pasted destinations and host reload.
Native browser gates exercise blocked saved activation, isolated ordinary/modifier/
middle activation, rich clipboard paste and public JSON preservation in both themes.

## Image source policy (E-06/E-07 partial)

Saved image decoration and new upload results use the same owned source policy:
HTTP/HTTPS addresses, relative paths/queries/fragments, nonempty blob URLs and
encoded `data:image/<subtype>` payloads are accepted. Data payloads may include
MIME parameters and base64 encoding; raw spaces/control characters must be encoded.
Network paths (`//`), backslashes, whitespace/control characters, malformed HTTP
addresses, empty data/blob payloads and other schemes/data MIME types are rejected.
This policy validates address syntax and context, not decoded image bytes,
reachability, asset authorization or redirects. Browser image decoding and the
host's CSP still apply. SVG data remains an image element, never inline SVG/HTML.

**Changed rendering:** rejected saved sources produce a translated visible
"Image unavailable" placeholder without an `img` or resource request. Meaningful
alt text remains its accessible name; decorative empty alt remains hidden from
assistive technology. The original source, alt text, dimensions and asset metadata
still round-trip in JSON. Hosts rendering saved JSON elsewhere must apply their
own source policy. Rejected new host upload addresses leave the dialog, file and
description available for retry and never insert a node. Host-owned URLs are
still never revoked by the section.

The ImageSources story demonstrates saved accepted/rejected sources, document
reload, read-only rendering and a rejected host upload followed by retry. Unit
tests cover the policy, node serialization and integrated retry. Browser gates
require accepted PNGs to decode, rejected sources to create no resource request,
unchanged saved metadata after reload, and successful retry with the original
description. E-06/E-07 remain open for file/content validation, author styles and
broader rich-content acceptance.

## Runtime image metadata (E-06/E-07 partial)

The image factory checks runtime field shapes for saved imports and insertion commands.
`src` must be a string; optional description and asset IDs must be strings or null;
optional dimensions must be finite numbers or null. Missing/null optional values keep
the existing empty-description/null-metadata defaults. Valid values are preserved,
including decorative empty alt text. This check does not authorize assets, validate
image bytes, impose dimension/size bounds or migrate unsupported document versions.
Malformed saved image fields throw an internal TypeError before node creation.
The document admission check now exercises the registered import factories with a
throwing handler before mounting the editable composer. Any rejected load displays
the translated document-load status instead of a partial editor and emits no
`onLexicalChange`. The host retains the original and supplies corrected data with a
new `editorKey` to recover. This is engine-backed admission, not a schema migration
or a declaration that unknown future versions are supported.

Malformed current upload metadata leaves the file/description available for retry
and reports a translated error before insertion. Stale results are ignored before
metadata validation. No host-created URL or asset is released by this check.

React escapes image attributes; serialized JSON remains data, not sanitized HTML.
Downstream renderers must independently enforce context-specific URL/style policy.
Author CSS, node/version policy, byte/dimension restrictions, host CSP, remote image
redirects, transport abort and stale-asset deletion remain explicit host decisions.

## Host upload lifetime (E-06 partial)

Cancel/Escape, editorKey replacement, read-only changes and unmount invalidate
pending upload results. Late success cannot insert an image; late failure cannot
show an error or clear the pending state of a newer upload. A new dialog begins
with an empty file/description draft. A current failure remains retryable.
Cancellation is local UI invalidation: the host promise still settles, and the
host owns network abort, asset cleanup and its returned URLs.

HostUploadLifecycle demonstrates document reset, read-only changes and unmount
before delayed host success/failure. Colocated tests exercise both outcomes while
a newer upload is pending; browser cases verify no stale insertion/error, native
Escape dismissal and clean reopening. The standalone ImageUploadModal also
invalidates local promise updates on unmount and releases its preview once.
No transport cancellation API, service validation or device evidence is implied.

## Document admission and active saved styles

Each `editorKey` starts one all-or-nothing admission pass before the editable
composer mounts. Unserializable input, malformed node/children/style shapes,
unregistered node imports, unsupported heading tags, malformed text/link fields and malformed image metadata cannot become editable
partial host content. The failure status says: “This document could not be loaded
safely. The original content has not been changed.” No partial save callback fires.
The input object remains untouched. Correct the host data and change `editorKey`;
changing `lexicalValue` alone retains the current editor lifetime, including a
rejected lifetime. Valid saved JSON retains its original spelling and formatting.

Both visible text `style` and inherited element `textStyle` follow the same policy, including empty paragraphs that would apply their style only on future typing.

Saved text CSS admits only explicit formatting properties: color/background-color;
font family, size, weight, style and font-variant/caps/numeric; letter spacing and
line height; text-decoration/color/line/style/thickness; text transform, vertical
alignment, white space; and the historical `--lp-text-variant` marker. Safe owned
or host token references can be values. Other property definitions, including
arbitrary custom properties, transforms, margins, display and positioned layout,
are unsupported and reject the document. Hosts must deliberately migrate unsupported
styles before submitting a corrected new-key document; the UI never drops them
silently. Quoted font-family values and tokenized typography/colors remain data.
Resource functions such as `url()`/`image-set()`, `@import`, active legacy
expressions and positioned overlays (`position`, inset/edge offsets, `z-index`)
are rejected before any text DOM is mounted. CSS escapes/comments cannot hide
those tokens. Rejection preserves the entire host original rather than purging
individual properties and returning an edited document. This is a bounded safety
rule, not a universal CSS sanitizer. Host CSP, trusted resource origins, redirects,
decoded asset bytes, engine-version migration and downstream renderer contexts
remain independent responsibilities.

The authored StructuredContent native corpus adds nested list, code block and
merged-header edit/history/reload/read-only checks. It supplements the accepted
rich-document corpus without certifying an unspecified production document set.
The insertion host owns a polite operation result after an actual image or columns
insertion; callbacks alone are not counted as successful insertion announcements.

The same formatting/type checks run before same-namespace
`application/x-lexical-editor` clipboard JSON is imported. Rejected clipboard data
shows a translated paste status and leaves the current document/selection intact;
accepted JSON and ordinary HTML/plain-text paste keep the existing engine path.
The engine's HTML import maps supported text formats and owned link destinations;
this does not make exported JSON a universal sanitizer for another renderer.
