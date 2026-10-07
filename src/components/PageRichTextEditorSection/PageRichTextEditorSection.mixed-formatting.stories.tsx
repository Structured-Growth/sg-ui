import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton/AppButton";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

const text = (value: string, format: number, style: string) => ({
  type: "text", version: 1, text: value, detail: 0, format, mode: "normal", style,
});
export const MIXED_FORMATTING_DOCUMENT = {
  root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [
    { type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [
      text("Bold", 1, "color: var(--sgui-action);"),
      text(" plain ", 0, ""),
      text("Italic", 2, "font-family: Georgia;"),
    ] },
  ] },
};

/** Real callback JSON is the host's save source; a new key starts a new document lifetime. */
export function MixedFormattingHost() {
  const [value, setValue] = useState<unknown>(MIXED_FORMATTING_DOCUMENT);
  const [seed, setSeed] = useState<unknown>(MIXED_FORMATTING_DOCUMENT);
  const [revision, setRevision] = useState(0);
  return <>
    <AppButton onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved mixed document</AppButton>
    <PageRichTextEditorSection lexicalValue={seed} editorKey={`mixed-formatting-${revision}`}
      onLexicalChange={setValue} aria-label="Mixed formatting document" toolPreset="full" style={{ height: 360 }} />
    <pre aria-label="Saved mixed formatting JSON">{JSON.stringify(value)}</pre>
  </>;
}

const meta = {
  title: "Editors/PageRichTextEditorSection/Mixed formatting",
  component: PageRichTextEditorSection,
  args: { lexicalValue: MIXED_FORMATTING_DOCUMENT, editorKey: "mixed-formatting", onLexicalChange: () => {} },
} satisfies Meta<typeof PageRichTextEditorSection>;
export default meta;
type Story = StoryObj<typeof meta>;
// Storybook's production Provider supplies theme, density, locale and compiled component styles.
export const MixedRunHistory: Story = { render: () => <MixedFormattingHost /> };
