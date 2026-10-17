import { describe, expect, it } from "vitest";
import { $getRoot, $isTextNode, $isElementNode, createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";
import { serializeEditorDocument } from "./serializeEditorDocument";
import { SAVED_RICH_DOCUMENT } from "../PageRichTextEditorSection.native-fixtures";

// Authored regression corpus, not an approved production consumer document.
function extendedDocument() {
  const doc = structuredClone(SAVED_RICH_DOCUMENT) as any;
  const nodes = doc.root.children;
  const nested = structuredClone(nodes[4]);
  // Nested items carry their actual depth in valid saved Lexical documents.
  for (const item of nested.children) item.indent = 1;
  nodes[3].children.push({ type: "listitem", version: 1, direction: null,
    format: "", indent: 0, value: 5, children: [nested] });
  const cell = nodes[7].children[0].children[0];
  cell.colSpan = 2;
  cell.headerState = 3;
  nodes[7].children[0].children.splice(1, 1);
  const image = nodes[8].children[0];
  image.altText = "";
  image.assetId = "asset:作者/42";
  image.assetVersionId = "revision-007";
  return doc;
}
function create() {
  return createEditor({ namespace: "acceptance-node-successors", nodes: EXPERIENCE_EDITOR_NODES,
    onError: error => { throw error; } });
}
const publicJSON = (editor: ReturnType<typeof create>) => serializeEditorDocument(editor.getEditorState().toJSON());

describe("saved node combination successors", () => {
  it("preserves nested mixed lists, merged header metadata and decorative asset identifiers after edit/reload/read-only", () => {
    const input = extendedDocument();
    const before = JSON.stringify(input);
    const editor = create();
    editor.setEditorState(editor.parseEditorState(JSON.stringify(input)));
    const baseline = publicJSON(editor) as any;
    expect(baseline.root.children[3].children.at(-1).children[0]).toMatchObject(input.root.children[3].children.at(-1).children[0]);
    expect(baseline.root.children[7]).toMatchObject(input.root.children[7]);
    expect(baseline.root.children[8].children[0]).toEqual(input.root.children[8].children[0]);
    expect(baseline.root.children[2].children[0]).toMatchObject({ type: "link", url: "https://example.com/course", title: "Course guide" });
    editor.update(() => {
      const end = $getRoot().getLastDescendant();
      if (!$isTextNode(end)) throw new Error("Fixture ending must be text");
      end.setTextContent("Edit this ending saved");
    }, { discrete: true });
    const edited = publicJSON(editor) as any;
    expect(edited.root.children.slice(0, -1)).toEqual(baseline.root.children.slice(0, -1));
    expect(edited.root.children.at(-1).children[0].text).toBe("Edit this ending saved");
    const reloaded = create();
    reloaded.setEditorState(reloaded.parseEditorState(JSON.stringify(edited)));
    reloaded.setEditable(false);
    expect(reloaded.isEditable()).toBe(false);
    expect(publicJSON(reloaded)).toEqual(edited);
    expect(JSON.stringify(input)).toBe(before);
  });

  it("reports an unregistered node rather than representing the input as a successful full round trip", () => {
    const editor = create();
    const doc = extendedDocument();
    doc.root.children.push({ type: "host-unregistered-widget", version: 9 });
    expect(() => editor.parseEditorState(JSON.stringify(doc))).toThrow(/host-unregistered-widget|not found/i);
    // Characterizes the installed engine, not an owner-approved recovery policy.
  });
});

// Deterministic authored schemas extend executable coverage without declaring
// unknown consumer document versions or a whole-document recovery policy.
describe("saved code and table edit fidelity", () => {
  it("preserves nondefault code language, highlight tokens and literal markup through an adjacent edit and read-only reload", () => {
    const input = extendedDocument();
    const code = input.root.children[6];
    code.language = "python";
    code.children = [
      { type: "code-highlight", version: 1, text: "return", detail: 0, format: 0, mode: "normal", style: "", highlightType: "keyword" },
      { type: "text", version: 1, text: " ", detail: 0, format: 0, mode: "normal", style: "" },
      { type: "code-highlight", version: 1, text: "'<script>作者</script>'", detail: 0, format: 0, mode: "normal", style: "", highlightType: "string" },
      { type: "linebreak", version: 1 },
      { type: "code-highlight", version: 1, text: "# résumé", detail: 0, format: 0, mode: "normal", style: "", highlightType: "comment" },
    ];
    const original = JSON.stringify(input);
    const editor = create();
    editor.setEditorState(editor.parseEditorState(original));
    const baseline = publicJSON(editor) as any;
    expect(baseline.root.children[6]).toMatchObject(code);
    editor.update(() => {
      const first = $getRoot().getFirstDescendant();
      if (!$isTextNode(first)) throw new Error("Expected heading text");
      first.setTextContent("Revised saved course guide");
    }, { discrete: true });
    const edited = publicJSON(editor) as any;
    expect(edited.root.children[0].children[0].text).toBe("Revised saved course guide");
    expect(edited.root.children.slice(1)).toEqual(baseline.root.children.slice(1));
    const reloaded = create();
    reloaded.setEditorState(reloaded.parseEditorState(JSON.stringify(edited)));
    reloaded.setEditable(false);
    expect(publicJSON(reloaded)).toEqual(edited);
    expect(JSON.stringify(input)).toBe(original);
    // Literal-code preservation is data fidelity, not arbitrary-HTML sanitization.
  });

  it("edits a merged header cell without changing spans, header flags, width, background or adjacent rich nodes", () => {
    const input = extendedDocument();
    const original = JSON.stringify(input);
    const editor = create();
    editor.setEditorState(editor.parseEditorState(original));
    const baseline = publicJSON(editor) as any;
    const beforeTable = baseline.root.children[7];
    expect(beforeTable.children[0].children[0]).toMatchObject({ colSpan: 2, rowSpan: 1, headerState: 3, width: 180, backgroundColor: "#fff59d" });
    editor.update(() => {
      const table = $getRoot().getChildren()[7];
      if (!$isElementNode(table)) throw new Error("Expected table");
      const first = table.getFirstDescendant();
      if (!$isTextNode(first)) throw new Error("Expected header text");
      first.setTextContent("Revised merged heading 作者");
    }, { discrete: true });
    const edited = publicJSON(editor) as any;
    const expected = structuredClone(baseline);
    expected.root.children[7].children[0].children[0].children[0].children[0].text = "Revised merged heading 作者";
    expect(edited).toEqual(expected);
    const reloaded = create();
    reloaded.setEditorState(reloaded.parseEditorState(JSON.stringify(edited)));
    reloaded.setEditable(false);
    expect(publicJSON(reloaded)).toEqual(edited);
    reloaded.setEditable(true);
    expect(publicJSON(reloaded)).toEqual(edited);
    expect(JSON.stringify(input)).toBe(original);
  });
});
