# Owned page rich text editor

Task reference: M-34. PageRichTextEditorSection retains its public name, Lexical
JSON document model, editorKey, tool presets/control overrides, change callback
and host image upload contract. It now uses owned controls and token CSS Modules
throughout its composition, including image decoration. Import `/styles.css` once
and provide Provider or ThemeScope. The granular
`@structured-growth/sg-ui/components/PageRichTextEditorSection` entry avoids the
unmigrated catalog. Root and `/components` still include legacy components.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/experimental";
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
local. URL validation remains owned by LinkUrlModal. Image callbacks and asset
metadata, columns/table presets, rule insertion, heading/body roles and JSON
serialization retain their existing contracts. Missing upload callbacks retain
local preview behavior; hosts own uploaded files and persistence.

See [dialogs](react-aria-editor-dialogs.md), [formatting toolbar](react-aria-formatting-toolbar.md),
[layout and selection](react-aria-editor-layout.md) and
[execution evidence](react-aria-progress.md#page-rich-text-editor-section).
`node scripts/test-editor-consumer.mjs` and `--react18` build actual packed
SSR/hydration/Vite consumers of the full section with strict retired-peer guards.
Full browser/touch/assistive-technology, visual, performance and release gates
remain open; this component migration does not complete U/X/R/Z.
