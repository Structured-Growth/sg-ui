// @vitest-environment jsdom
import { useEffect } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHorizontalRuleNode, HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createNodeSelection, $createParagraphNode, $createTextNode, $getRoot, $setSelection, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND, type LexicalEditor } from "lexical";
import { HorizontalRuleSelectionPlugin } from "./HorizontalRuleSelectionPlugin";

afterEach(cleanup);
function mount() {
  let editor!: LexicalEditor;
  function CaptureEditor() {
    const [current] = useLexicalComposerContext();
    useEffect(() => { editor = current; }, [current]);
    return null;
  }
  const view = render(<LexicalComposer initialConfig={{ namespace: "rule-selection-test", nodes: [HorizontalRuleNode], onError: error => { throw error; } }}>
    <CaptureEditor /><HorizontalRuleSelectionPlugin />
  </LexicalComposer>);
  return { editor, ...view };
}

describe("HorizontalRuleSelectionPlugin with real Lexical selections", () => {
  it.each([KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND])("deletes selected rules while retaining selected paragraphs", async command => {
    const { editor } = mount();
    await act(async () => editor.update(() => {
      const paragraph = $createParagraphNode().append($createTextNode("Keep me"));
      const first = $createHorizontalRuleNode(); const second = $createHorizontalRuleNode();
      $getRoot().clear().append(paragraph, first, second);
      const selection = $createNodeSelection();
      for (const node of [paragraph, first, second]) selection.add(node.getKey());
      $setSelection(selection);
    }, { discrete: true }));
    await act(async () => { expect(editor.dispatchCommand(command, new KeyboardEvent("keydown"))).toBe(true); });
    expect(editor.getEditorState().toJSON().root.children).toEqual([expect.objectContaining({ type: "paragraph", children: [expect.objectContaining({ text: "Keep me" })] })]);
  });

  it.each(["none", "range", "paragraph"] as const)("leaves %s selection for another command handler", async kind => {
    const { editor } = mount();
    await act(async () => editor.update(() => {
      const text = $createTextNode("Keep me"); const paragraph = $createParagraphNode().append(text);
      $getRoot().clear().append(paragraph, $createHorizontalRuleNode());
      if (kind === "range") text.select(0, 4);
      else {
        const selection = kind === "paragraph" ? $createNodeSelection() : null;
        selection?.add(paragraph.getKey()); $setSelection(selection);
      }
    }, { discrete: true }));
    const before = editor.getEditorState().toJSON();
    for (const command of [KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND]) {
      await act(async () => { expect(editor.dispatchCommand(command, new KeyboardEvent("keydown"))).toBe(false); });
      expect(editor.getEditorState().toJSON()).toEqual(before);
    }
  });

  it("unregisters both keyboard commands on unmount", () => {
    const { editor, unmount } = mount(); unmount();
    expect(editor.dispatchCommand(KEY_BACKSPACE_COMMAND, new KeyboardEvent("keydown"))).toBe(false);
    expect(editor.dispatchCommand(KEY_DELETE_COMMAND, new KeyboardEvent("keydown"))).toBe(false);
  });
});
