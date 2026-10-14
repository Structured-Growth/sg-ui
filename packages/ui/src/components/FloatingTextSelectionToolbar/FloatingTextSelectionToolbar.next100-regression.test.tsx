// @vitest-environment jsdom
import { useEffect } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $createParagraphNode, $createTextNode, $getRoot, $isTextNode, type LexicalEditor } from "lexical";
import { Provider } from "../../experimental/Provider/Provider";
import { FloatingTextSelectionToolbar } from "./index";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("clears a collapsed selection and isolates commands and teardown between editor instances", async () => {
  // Geometry is synthetic; native positioning remains a separate browser gate.
  const rect = new DOMRect(100, 120, 90, 20);
  const originalRect = Range.prototype.getBoundingClientRect;
  const originalRects = Range.prototype.getClientRects;
  Range.prototype.getBoundingClientRect = () => rect;
  Range.prototype.getClientRects = () => [rect] as unknown as DOMRectList;
  const editors: Record<string, LexicalEditor> = {};
  function Capture({ id }: { id: string }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => { editors[id] = editor; }, [editor, id]);
    return null;
  }
  function Host({ id }: { id: string }) {
    return <LexicalComposer initialConfig={{ namespace: id, onError: error => { throw error; }, editorState: () => $getRoot().append($createParagraphNode().append($createTextNode(`${id} text`))) }}>
      <Capture id={id} /><FloatingTextSelectionToolbar aria-label={`${id} formatting`} />
      <RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label={`${id} document`} />} placeholder={null} />
    </LexicalComposer>;
  }
  async function select(id: string, end = 5) {
    await act(async () => {
      editors[id].getRootElement()!.focus();
      editors[id].update(() => {
        const text = $getRoot().getFirstDescendant();
        if (!$isTextNode(text)) throw new Error("Expected text");
        text.select(0, end);
      }, { discrete: true });
    });
    fireEvent(document, new Event("selectionchange"));
  }
  const snapshot = (id: string) => JSON.stringify(editors[id].getEditorState().toJSON());
  try {
    const user = userEvent.setup();
    const view = render(<Provider><Host key="first" id="first" /><Host key="second" id="second" /></Provider>);
    await select("first");
    expect(screen.getByRole("group", { name: "first formatting" })).toBeTruthy();
    expect(screen.queryByRole("group", { name: "second formatting" })).toBeNull();
    await select("first", 0);
    await waitFor(() => expect(screen.queryByRole("group", { name: "first formatting" })).toBeNull());
    expect(screen.queryByRole("button", { name: "Bold" })).toBeNull();
    await select("second");
    await user.click(within(screen.getByRole("group", { name: "second formatting" })).getByRole("button", { name: "Bold" }));
    await waitFor(() => expect(snapshot("second")).toContain('"format":1'));
    expect(snapshot("first")).toContain('"format":0');
    view.rerender(<Provider><Host key="second" id="second" /></Provider>);
    await select("second");
    fireEvent.keyDown(editors.second.getRootElement()!, { key: "F10", altKey: true });
    const bold = within(screen.getByRole("group", { name: "second formatting" })).getByRole("button", { name: "Bold" });
    expect(document.activeElement).toBe(bold);
    await user.keyboard("{Enter}");
    await waitFor(() => expect(snapshot("second")).toContain('"format":0'));
    expect(editors.second.getEditorState().read(() => $getRoot().getTextContent())).toBe("second text");
  } finally {
    if (originalRect) Range.prototype.getBoundingClientRect = originalRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect;
    if (originalRects) Range.prototype.getClientRects = originalRects; else delete (Range.prototype as Partial<Range>).getClientRects;
  }
});
