// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $getSelection, $isRangeSelection, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { ParagraphTransactionsHost } from "./PageRichTextEditorSection.paragraph-transactions.stories";

let activeEditor: LexicalEditor | undefined;
function CaptureEditor() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => { activeEditor = editor; }, [editor]);
  return null;
}
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
  const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
  return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) =>
    <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});
// Geometry alone is unavailable in jsdom; commands, selection and history remain real.
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
const originalRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRect) Range.prototype.getBoundingClientRect = originalRect;
  else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
afterEach(() => { cleanup(); activeEditor = undefined; });
function saved() { return activeEditor!.getEditorState().toJSON(); }

it("owned paragraph menu commands preserve the adjacent paragraph through history and saved reload", async () => {
  const user = userEvent.setup();
  render(<Provider><ParagraphTransactionsHost /></Provider>);
  await waitFor(() => expect(activeEditor).toBeTruthy());
  await act(async () => {
    activeEditor!.getRootElement()!.focus();
    // Supported Lexical setup for the composed unit; native keyboard setup is browser-owned.
    activeEditor!.update(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error("Expected paragraph");
      const text = paragraph.getFirstChildOrThrow();
      if (!$isTextNode(text)) throw new Error("Expected text");
      text.select(2, 8);
    }, { discrete: true });
  });
  const before = saved();
  const expected = (format: string, indent: number) => ({ ...before, root: { ...before.root,
    children: before.root.children.map((paragraph, index) => index === 0 ? { ...paragraph, format, indent } : paragraph) } });
  async function command(label: string) {
    await user.click(screen.getByRole("button", { name: /^(Left|Center) Align$/ }));
    await user.click(screen.getByRole(label === "Center Align" ? "menuitemradio" : "menuitem", { name: label, exact: true }));
  }
  async function assertSaved(value: unknown) {
    await waitFor(() => expect(saved()).toEqual(value));
    await waitFor(() => expect(JSON.parse(screen.getByLabelText("Saved paragraph JSON").textContent!)).toEqual(value));
    expect(screen.getByRole("textbox", { name: "Paragraph transaction document" }).textContent).toBe("Target paragraphAdjacent paragraph");
  }
  for (const [label, indent] of [["Center Align", 0], ["Indent", 1], ["Outdent", 0]] as const) {
    const previous = saved();
    await command(label);
    const next = expected("center", indent);
    await assertSaved(next);
    activeEditor!.getEditorState().read(() => {
      const selection = $getSelection();
      expect($isRangeSelection(selection)).toBe(true);
      if (!$isRangeSelection(selection)) throw new Error("Expected real paragraph selection");
      expect(selection.getTextContent()).toBe("rget p");
      expect(selection.anchor.offset).toBe(2);
      expect(selection.focus.offset).toBe(8);
      expect(selection.anchor.getNode().getTopLevelElement()).toBe($getRoot().getFirstChild());
      expect(selection.focus.getNode().getTopLevelElement()).toBe($getRoot().getFirstChild());
    });
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await assertSaved(previous);
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await assertSaved(next);
  }
  const final = saved();
  const originalEditor = activeEditor;
  await user.click(screen.getByRole("button", { name: "Reload saved paragraphs", exact: true }));
  await waitFor(() => expect(activeEditor).not.toBe(originalEditor));
  await assertSaved(final);
  await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
  await assertSaved(final);
});
