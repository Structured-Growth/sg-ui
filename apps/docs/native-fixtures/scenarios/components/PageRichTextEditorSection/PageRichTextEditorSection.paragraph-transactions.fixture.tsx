import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { Button } from "@structured-growth/sg-ui/components";
import { Status } from "@structured-growth/sg-ui/experimental";
import { PageRichTextEditorSection } from "@structured-growth/sg-ui/components";

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
    <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload saved paragraphs</Button>
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
// native fixture host's production Provider supplies the owned scope and compiled styles.
export const ParagraphCommandHistory: Story = { render: () => <ParagraphTransactionsHost /> };

// Same accepted paragraph seed and public editor; adds host lifetime transitions.
// Keyboard events bubble from native dialogs, so background controls need not be
// programmatically clicked while the modal makes them inert.
function SelectionAcceptanceHost() {
  const [seed, setSeed] = useState<unknown>(PARAGRAPH_TRANSACTION_DOCUMENT);
  const [value, setValue] = useState<unknown>(PARAGRAPH_TRANSACTION_DOCUMENT);
  const [revision, setRevision] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [operation, setOperation] = useState("");
  const countsRef = useRef({ image: 0, table: 0 });
  const count = (value: unknown, type: string): number => {
    if (!value || typeof value !== "object") return 0;
    const node = value as { type?: string; children?: unknown[]; root?: unknown };
    return Number(node.type === type) + (node.root ? count(node.root, type) : 0)
      + (node.children ?? []).reduce<number>((sum, child) => sum + count(child, type), 0);
  };
  const update = (next: unknown) => {
    setValue(next);
    const counts = { image: count(next, "image"), table: count(next, "table") };
    if (counts.image !== countsRef.current.image) setOperation(counts.image > countsRef.current.image ? "Image inserted" : "Image removed");
    else if (counts.table !== countsRef.current.table) setOperation(counts.table > countsRef.current.table ? "Columns layout inserted" : "Columns layout removed");
    countsRef.current = counts;
  };
  useEffect(() => {
    const update = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.code === "Digit1") { event.preventDefault(); setReadOnly(true); }
      if (event.code === "Digit2") {
        event.preventDefault();
        setSeed(PARAGRAPH_TRANSACTION_DOCUMENT); setValue(PARAGRAPH_TRANSACTION_DOCUMENT);
        setRevision(value => value + 1); setReadOnly(false);
      }
      if (event.code === "Digit3") { event.preventDefault(); setMounted(false); }
    };
    document.addEventListener("keydown", update);
    return () => document.removeEventListener("keydown", update);
  }, []);
  return <div data-testid="selection-acceptance" data-revision={revision}>
    <Button onPress={() => { setSeed(value); setRevision(current => current + 1); }}>Reload selected document</Button>
    {mounted && <PageRichTextEditorSection lexicalValue={seed} editorKey={`selection-acceptance-${revision}`}
      readOnly={readOnly} onLexicalChange={update} toolPreset="full"
      onUploadImage={async () => ({ assetId: "range-cover", assetVersionId: "range-v1", width: 1, height: 1,
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==" })}
      aria-label="Selection acceptance document" style={{ height: 460 }} />}
    <Status announcement="polite">{operation}</Status>
    <pre aria-label="Selection acceptance JSON">{JSON.stringify(value)}</pre>
  </div>;
}
export const SelectionAcceptance: Story = { render: () => <SelectionAcceptanceHost /> };
