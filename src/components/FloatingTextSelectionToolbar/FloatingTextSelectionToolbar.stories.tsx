import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { tokens } from "../../foundation/tokens.generated";
import { ThemeScope } from "../../foundation/ThemeScope";
import { FloatingTextSelectionToolbar } from "./FloatingTextSelectionToolbar";
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
