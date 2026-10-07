import { describe, expect, it } from "vitest";
import { createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";
import { SAVED_RICH_DOCUMENT } from "../PageRichTextEditorSection.stories.fixtures";

describe("saved rich document configuration", () => {
  it("restores highlighted code and all registered rich nodes without losing host metadata", () => {
    const editor = createEditor({ namespace: "saved-rich-test", nodes: EXPERIENCE_EDITOR_NODES, onError: error => { throw error; } });
    const restored = editor.parseEditorState(JSON.stringify(SAVED_RICH_DOCUMENT));
    const json = restored.toJSON();
    const children = json.root.children as unknown as Record<string, unknown>[];
    const original = SAVED_RICH_DOCUMENT.root.children as { children?: unknown[] }[];
    expect(children.map(node => node.type)).toEqual(["heading", "paragraph", "paragraph", "list", "list", "quote", "code", "table", "paragraph", "horizontalrule", "paragraph"]);
    expect(children[1]).toMatchObject({ format: "center", indent: 1, children: original[1].children });
    expect(children[2]).toMatchObject({ children: original[2].children });
    expect(children[3]).toMatchObject({ listType: "number", start: 3 });
    expect(children[4]).toMatchObject({ listType: "bullet" });
    expect(children[6]).toMatchObject({ language: "javascript", children: original[6].children });
    expect(children[7]).toMatchObject({ children: original[7].children });
    expect(children[8]).toMatchObject({ children: original[8].children });
    expect(editor.parseEditorState(JSON.stringify(json)).toJSON()).toEqual(json);
  });
});
