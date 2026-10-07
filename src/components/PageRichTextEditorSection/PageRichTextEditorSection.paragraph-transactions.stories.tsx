import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton/AppButton";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

const paragraph = (text: string, format: string, indent: number, inlineFormat: number, style: string) => ({
  type: "paragraph", version: 1, direction: null, format, indent,
  children: [{ type: "text", version: 1, text, detail: 0, format: inlineFormat, mode: "normal", style }],
});
export const PARAGRAPH_TRANSACTION_DOCUMENT = {
  root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [
    paragraph("Target paragraph", "left", 0, 1, "color: var(--sgui-action);"),
    paragraph("Adjacent paragraph", "right", 2, 2, "font-family: Georgia;"),
  ] },
};

export function ParagraphTransactionsHost() {
  const [value, setValue] = useState<unknown>(PARAGRAPH_TRANSACTION_DOCUMENT);
  const [seed, setSeed] = useState<unknown>(PARAGRAPH_TRANSACTION_DOCUMENT);
  const [revision, setRevision] = useState(0);
  return <>
    <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved paragraphs</AppButton>
    <PageRichTextEditorSection lexicalValue={seed} editorKey={`paragraph-transactions-${revision}`}
      onLexicalChange={setValue} aria-label="Paragraph transaction document" toolPreset="full" style={{ height: 360 }} />
    <pre aria-label="Saved paragraph JSON">{JSON.stringify(value)}</pre>
  </>;
}
const meta = {
  title: "Editors/PageRichTextEditorSection/Paragraph transactions",
  component: PageRichTextEditorSection,
  args: { lexicalValue: PARAGRAPH_TRANSACTION_DOCUMENT, editorKey: "paragraph-transactions", onLexicalChange: () => {} },
} satisfies Meta<typeof PageRichTextEditorSection>;
export default meta;
type Story = StoryObj<typeof meta>;
// Storybook's production Provider supplies the owned scope and compiled styles.
export const ParagraphCommandHistory: Story = { render: () => <ParagraphTransactionsHost /> };
