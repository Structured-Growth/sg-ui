import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { tokens } from "../../foundation/tokens.generated";
import { ThemeScope } from "../../foundation/ThemeScope";
import { FloatingTextSelectionToolbar } from "./FloatingTextSelectionToolbar";
import { Button } from "../../experimental/Button/Button";
const meta = { title: "Editors/FloatingTextSelectionToolbar", component: FloatingTextSelectionToolbar, tags: ["autodocs"] } satisfies Meta<typeof FloatingTextSelectionToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({ dark = false }: { dark?: boolean }) {
  const boundary = useRef<HTMLDivElement>(null);
  return <ThemeScope theme={dark ? "dark" : "light"} style={{ background: tokens.surface, color: tokens.text }}>
    <p>Select text, then press Alt+F10 to focus formatting. Escape returns to the editor.</p>
    <div ref={boundary} style={{ height: 280, overflow: "auto", position: "relative" }}>
      <LexicalComposer initialConfig={{ namespace: "floating-toolbar-story", onError: error => { throw error; }, editorState: () => { for (let i=0;i<12;i++) $getRoot().append($createParagraphNode().append($createTextNode(`Select this paragraph ${i+1} to apply formatting without losing text.`))); } }}>
        <FloatingTextSelectionToolbar boundaryRef={boundary} />
        <RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label="Document" style={{ minHeight: 200, padding: 12 }} />} placeholder={null} />
      </LexicalComposer>
    </div>
  </ThemeScope>;
}
export const Default: Story = { render: () => <Example /> };
export const NarrowDark: Story = { render: () => <div style={{ maxWidth: 240 }}><Example dark /></div> };

// The host owns scrolling and document replacement. No transformed ancestor: the
// public overlay contract uses viewport fixed positioning inside the theme scope.
function NestedBoundaryExample() {
  const boundary = useRef<HTMLDivElement>(null);
  const [documentVersion, setDocumentVersion] = useState(1);
  return <ThemeScope style={{ background: tokens.surface, color: tokens.text }}>
    <p>Select the first line, then press Alt+F10. Both host regions scroll independently.</p>
    <Button onPress={() => {
      window.getSelection()?.removeAllRanges();
      setDocumentVersion(version => version + 1);
    }}>Replace host document</Button>
    <output aria-label="Host document version">{documentVersion}</output>
    <div data-testid="selection-outer-scroll" style={{ height: 390, overflow: "auto", padding: 16, border: `1px solid ${tokens.border}` }}>
      <div style={{ height: 70 }} />
      <div ref={boundary} data-testid="selection-boundary" style={{ height: 260, width: "min(560px, 100%)", overflow: "auto", border: `1px solid ${tokens.border}` }}>
        <LexicalComposer key={documentVersion} initialConfig={{ namespace: "nested-selection-boundary", onError: error => { throw error; }, editorState: () => {
          $getRoot().append($createParagraphNode().append($createTextNode(`Document ${documentVersion} selected line.`)));
          for (let i = 0; i < 24; i++) $getRoot().append($createParagraphNode().append($createTextNode(`Host document paragraph ${i + 1}.`)));
        } }}>
          <FloatingTextSelectionToolbar boundaryRef={boundary} />
          <RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label="Boundary document" style={{ minHeight: 900, padding: "60px 12px 12px" }} />} placeholder={null} />
        </LexicalComposer>
      </div>
      <div style={{ height: 450 }} />
    </div>
  </ThemeScope>;
}
export const NestedHostBoundary: Story = {
  parameters: { docs: { description: { story: "Select the first line and focus Bold with Alt+F10, then scroll the inner host until the selection is offscreen. Actions dismiss and focus returns to the editor while both host scroll positions and the selected text are preserved, including in WebKit." } } },
  render: () => <NestedBoundaryExample />,
};
