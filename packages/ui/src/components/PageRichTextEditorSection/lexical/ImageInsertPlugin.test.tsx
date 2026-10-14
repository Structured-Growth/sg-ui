// @vitest-environment jsdom
import { useEffect } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createNodeSelection, $createParagraphNode, $createTextNode, $getRoot, $setSelection, type LexicalEditor } from "lexical";
import { ImageNode } from "./ImageNode";
import { ImageInsertPlugin, INSERT_IMAGE_COMMAND } from "./ImageInsertPlugin";

afterEach(cleanup);
function mount() {
  let editor!: LexicalEditor;
  function CaptureEditor() {
    const [current] = useLexicalComposerContext();
    useEffect(() => { editor = current; }, [current]);
    return null;
  }
  const view = render(<LexicalComposer initialConfig={{ namespace: "image-insert-test", nodes: [ImageNode], onError: error => { throw error; } }}>
    <CaptureEditor /><ImageInsertPlugin />
  </LexicalComposer>);
  return { editor, ...view };
}
const payload = { src: "https://example.com/image.png", altText: "Example", width: 320, height: 180, assetId: "asset-1", assetVersionId: "version-2" };

describe("ImageInsertPlugin with the real Lexical editor", () => {
  it("inserts serialized image metadata and a trailing editable paragraph at the selected text", async () => {
    const { editor } = mount();
    await act(async () => editor.update(() => {
      const text = $createTextNode("Replace me");
      $getRoot().clear().append($createParagraphNode().append(text));
      text.select(0, text.getTextContentSize());
    }, { discrete: true }));
    let handled = false;
    await act(async () => { handled = editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload); });
    expect(handled).toBe(true);
    const children = editor.getEditorState().toJSON().root.children;
    expect(children[0]).toMatchObject({ type: "paragraph", children: [expect.objectContaining({ type: "image", ...payload })] });
    expect(children.at(-1)).toMatchObject({ type: "paragraph", children: [] });
    expect(JSON.stringify(children)).not.toContain("Replace me");
  });

  it("handles missing and node selections without mutating the document", async () => {
    const { editor } = mount();
    for (const kind of ["none", "node"] as const) {
      await act(async () => editor.update(() => {
        const paragraph = $createParagraphNode().append($createTextNode("Keep me"));
        $getRoot().clear().append(paragraph);
        const selection = kind === "node" ? $createNodeSelection() : null;
        selection?.add(paragraph.getKey());
        $setSelection(selection);
      }, { discrete: true }));
      const before = editor.getEditorState().toJSON();
      await act(async () => { expect(editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)).toBe(true); });
      expect(editor.getEditorState().toJSON()).toEqual(before);
    }
  });

  it("unregisters its command when React unmounts the plugin", () => {
    const { editor, unmount } = mount();
    unmount();
    expect(editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)).toBe(false);
  });
});
