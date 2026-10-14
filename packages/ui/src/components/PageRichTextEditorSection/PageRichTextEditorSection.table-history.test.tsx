// @vitest-environment jsdom
import { useEffect } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $getSelection, $isRangeSelection, $isTextNode, $isElementNode, HISTORY_PUSH_TAG, type LexicalEditor } from "lexical";
import { $isTableNode } from "@lexical/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";
import { serializeEditorDocument } from "./lexical/serializeEditorDocument";

let activeEditor: LexicalEditor | undefined;
function CaptureEditor() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => { activeEditor = editor; }, [editor]);
  return null;
}
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
  const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
  return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) => <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});
afterEach(() => { cleanup(); activeEditor = undefined; });
function saved() { return serializeEditorDocument(activeEditor!.getEditorState().toJSON()); }
async function update(callback: () => void, history = false) {
  await act(async () => { activeEditor!.update(callback, { discrete: true, tag: history ? HISTORY_PUSH_TAG : undefined }); });
}
function cell(index: number) {
  const table = $getRoot().getChildren().find($isTableNode);
  if (!table) throw new Error("Expected inserted table");
  const row = table.getFirstChildOrThrow();
  if (!$isElementNode(row)) throw new Error("Expected table row");
  const result = row.getChildren()[index];
  if (!$isElementNode(result)) throw new Error("Expected table cell");
  return result;
}

it("inserts twoEqual through the dialog, edits selected cell text, restores history and reloads the saved document", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(<Provider><PageRichTextEditorSection lexicalValue={null} editorKey="table-source" toolPreset="full" onLexicalChange={change} /></Provider>);
  await waitFor(() => expect(activeEditor).toBeTruthy());
  await update(() => { $getRoot().selectEnd(); const selection = $getSelection(); if (!$isRangeSelection(selection)) throw new Error("Expected caret"); selection.insertText("Course introduction"); }, true);
  await user.click(screen.getByRole("button", { name: "Insert", exact: true }));
  await user.click(screen.getByRole("menuitem", { name: "Columns Layout", exact: true }));
  const dialog = screen.getByRole("dialog", { name: "Choose columns layout" });
  expect((within(dialog).getByRole("radio", { name: "2 columns (equal width)" }) as HTMLInputElement).checked).toBe(true);
  await user.click(within(dialog).getByRole("button", { name: "Insert", exact: true }));
  await waitFor(() => expect(screen.getAllByRole("cell")).toHaveLength(2));
  await update(() => {
    cell(0).selectStart(); const selection = $getSelection();
    if (!$isRangeSelection(selection)) throw new Error("Expected cell caret"); selection.insertText("First lesson");
  }, true);
  await update(() => {
    cell(1).selectStart(); const selection = $getSelection();
    if (!$isRangeSelection(selection)) throw new Error("Expected cell caret"); selection.insertText("Second lesson");
  }, true);
  const before = saved();
  await update(() => {
    const paragraph = cell(0).getFirstChildOrThrow();
    if (!$isElementNode(paragraph)) throw new Error("Expected cell paragraph");
    const text = paragraph.getFirstChildOrThrow();
    if (!$isTextNode(text)) throw new Error("Expected cell text"); text.select(0, 5);
  });
  await user.click(screen.getByRole("button", { name: "Bold", exact: true }));
  await waitFor(() => expect(screen.getByRole("cell", { name: "First lesson" }).querySelector("strong, b")?.textContent).toBe("First"));
  const formatted = saved();
  expect(formatted).not.toEqual(before);
  await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
  await waitFor(() => expect(saved()).toEqual(before));
  await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
  await waitFor(() => expect(saved()).toEqual(formatted));
  const originalEditor = activeEditor;
  view.rerender(<Provider><PageRichTextEditorSection lexicalValue={formatted} editorKey="table-reloaded" toolPreset="full" onLexicalChange={change} /></Provider>);
  await waitFor(() => expect(activeEditor).not.toBe(originalEditor));
  expect(saved()).toEqual(formatted);
  expect(screen.getAllByRole("cell").map(node => node.textContent)).toEqual(["First lesson", "Second lesson"]);
  expect(screen.getByRole("textbox").textContent).toContain("Course introduction");
  expect(change).toHaveBeenCalledWith(formatted);
});
