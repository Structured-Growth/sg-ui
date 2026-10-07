// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { MixedFormattingHost } from "./PageRichTextEditorSection.mixed-formatting.stories";
import { serializeEditorDocument } from "./lexical/serializeEditorDocument";

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
// jsdom has no native selection geometry; the separate browser spec owns keyboard evidence.
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
const originalRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRect) Range.prototype.getBoundingClientRect = originalRect;
  else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
afterEach(() => { cleanup(); activeEditor = undefined; });
function saved() { return serializeEditorDocument(activeEditor!.getEditorState().toJSON()); }
type Run = { text: string; format: number; style: string; detail: number; mode: string; type: string; version: number };
function characters(document: ReturnType<typeof saved>) {
  const paragraph = document.root.children[0] as unknown as { children: Run[] };
  return paragraph.children.flatMap(run => [...run.text].map(text => ({ ...run, text })));
}

for (const [label, mask, remove] of [["Bold", 1, true], ["Italic", 2, false], ["Underline", 8, false]] as const) {
  it(`${label} preserves mixed-run text/styles, real history and host JSON reload`, async () => {
    const user = userEvent.setup();
    render(<Provider><MixedFormattingHost /></Provider>);
    await waitFor(() => expect(activeEditor).toBeTruthy());
    // Supported Lexical selection APIs are unit setup only, never native keyboard proof.
    await act(async () => {
      activeEditor!.getRootElement()!.focus();
      activeEditor!.update(() => {
        const paragraph = $getRoot().getFirstChildOrThrow();
        if (!$isElementNode(paragraph)) throw new Error("Expected paragraph");
        const first = paragraph.getFirstChildOrThrow();
        const last = paragraph.getLastChildOrThrow();
        if (!$isTextNode(first) || !$isTextNode(last)) throw new Error("Expected mixed runs");
        const selection = first.select(2, 2);
        selection.focus.set(last.getKey(), 3, "text");
      }, { discrete: true });
    });
    const before = saved();
    expect(screen.getByRole("button", { name: "Bold", exact: true }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "Italic", exact: true }).getAttribute("aria-pressed")).toBe("false");
    const expected = characters(before).map((character, index) => index >= 2 && index < 14
      ? { ...character, format: remove ? character.format & ~mask : character.format | mask } : character);
    await user.click(screen.getByRole("button", { name: label, exact: true }));
    await waitFor(() => expect(characters(saved())).toEqual(expected));
    expect(screen.getByRole("button", { name: label, exact: true }).getAttribute("aria-pressed")).toBe(String(!remove));
    const formatted = saved();
    expect(screen.getByRole("textbox", { name: "Mixed formatting document" }).textContent).toBe("Bold plain Italic");
    await waitFor(() => expect(JSON.parse(screen.getByLabelText("Saved mixed formatting JSON").textContent!)).toEqual(formatted));
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(before));
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(formatted));
    const originalEditor = activeEditor;
    await user.click(screen.getByRole("button", { name: "Reload saved mixed document", exact: true }));
    await waitFor(() => expect(activeEditor).not.toBe(originalEditor));
    expect(saved()).toEqual(formatted);
    expect(characters(saved())).toEqual(expected);
    expect(screen.getByRole("textbox", { name: "Mixed formatting document" }).textContent).toBe("Bold plain Italic");
    // History belongs to the replacement editor; Undo cannot reach the old document.
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    expect(saved()).toEqual(formatted);
  });
}
