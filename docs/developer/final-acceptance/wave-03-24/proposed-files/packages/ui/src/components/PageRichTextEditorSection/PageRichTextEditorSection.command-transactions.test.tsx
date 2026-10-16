// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $getSelection, $isRangeSelection, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";
import { serializeEditorDocument } from "./lexical/serializeEditorDocument";

let editor: LexicalEditor | undefined;
function CaptureEditor() {
  const [value] = useLexicalComposerContext();
  useEffect(() => { editor = value; }, [value]);
  return null;
}
// Instrument the real host; do not mock commands, toolbar callbacks, history or plugins.
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
  const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
  return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) =>
    <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});
// Only floating geometry is outside this composed-unit boundary.
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
const originalRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRect) Range.prototype.getBoundingClientRect = originalRect;
  else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
afterEach(() => { cleanup(); editor = undefined; });
const run = { type: "text", version: 1, text: "pre miXeD post", detail: 0, format: 3, mode: "normal", style: "font-family: Georgia; color: #123456; background-color: #abcdef;" };
const initial = { root: { type: "root", version: 1, direction: null, format: "", indent: 0,
  children: [{ type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [run] }] } };
function saved() { return serializeEditorDocument(editor!.getEditorState().toJSON()); }
function chars() {
  return editor!.getEditorState().read(() => $getRoot().getAllTextNodes().flatMap(node => {
    const style = Object.fromEntries(node.getStyle().split(";").filter(part => part.trim()).map(part => {
      const colon = part.indexOf(":"); return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()];
    }));
    return [...node.getTextContent()].map(text => ({ text, format: node.getFormat(), style }));
  }));
}
async function select(start = 4, end = 9, backwards = false) {
  await waitFor(() => expect(editor).toBeTruthy());
  await act(async () => {
    editor!.getRootElement()!.focus();
    editor!.update(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error("Expected paragraph");
      const text = paragraph.getFirstChildOrThrow();
      if (!$isTextNode(text)) throw new Error("Expected text");
      text.select(backwards ? end : start, backwards ? start : end);
    }, { discrete: true });
  });
}
function selectionText() { return editor!.getEditorState().read(() => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) throw new Error("Expected retained range");
  return { text: selection.getTextContent(), backwards: selection.isBackward(), collapsed: selection.isCollapsed() };
}); }
const styleCases = [
  ["Lowercase", "mixed", 3, null], ["Uppercase", "MIXED", 3, null], ["Capitalize", "Mixed", 3, null],
  ["Strikethrough", "miXeD", 7, null], ["Subscript", "miXeD", 35, null], ["Superscript", "miXeD", 67, null],
  ["Highlight", "miXeD", 3, "#fff59d"], ["Clear Formatting", "miXeD", 0, "clear"],
  ["Code", "miXeD", 19, null],
] as const;
for (const [label, text, format, background] of styleCases) {
  it(`${label} changes only selected characters, retains selection, history and host reload`, async () => {
    const user = userEvent.setup(); const firstChange = vi.fn(); const currentChange = vi.fn();
    const view = (value: unknown, key: string, onChange: (value: unknown) => void) =>
      <Provider><PageRichTextEditorSection lexicalValue={value} editorKey={key} toolPreset="full" onLexicalChange={onChange} /></Provider>;
    const rendered = render(view(initial, "source", firstChange));
    await select(4, 9, true);
    const before = saved(); const beforeChars = chars(); const originalEditor = editor;
    rendered.rerender(view(initial, "source", currentChange));
    firstChange.mockClear(); currentChange.mockClear();
    if (label === "Code") await user.click(screen.getByRole("button", { name: "Inline code", exact: true }));
    else {
      await user.click(screen.getByRole("button", { name: "Text style", exact: true }));
      await user.click(screen.getByRole("menuitem", { name: label, exact: true }));
    }
    const expected = beforeChars.map((character, index) => index < 4 || index >= 9 ? character : {
      ...character, text: text[index - 4], format,
      style: background === "clear" ? {} : background ? { ...character.style, "background-color": background } : character.style,
    });
    await waitFor(() => expect(chars()).toEqual(expected));
    expect(selectionText()).toEqual({ text, backwards: label !== "Highlight", collapsed: false });
    const changed = saved();
    await waitFor(() => expect(currentChange).toHaveBeenLastCalledWith(changed));
    expect(firstChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(before));
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(changed));
    rendered.rerender(view(changed, "reloaded", currentChange));
    await waitFor(() => expect(editor).not.toBe(originalEditor));
    expect(saved()).toEqual(changed);
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    expect(saved()).toEqual(changed);
  });
}

for (const [mode, property] of [["Text color", "color"], ["Background color", "background-color"]] as const) {
  it(`${mode} commits and clears selected-run CSS through real history`, async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const rendered = render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="colors" toolPreset="full" onLexicalChange={change} /></Provider>);
    await select(); const before = saved(); const beforeChars = chars();
    await user.click(screen.getByRole("button", { name: mode, exact: true }));
    const field = screen.getByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "#336699{Enter}");
    const expected = beforeChars.map((character, index) => index < 4 || index >= 9 ? character : {
      ...character, style: { ...character.style, [property]: "#336699" },
    });
    await waitFor(() => expect(chars()).toEqual(expected));
    expect(selectionText().text).toBe("miXeD");
    const colored = saved();
    await user.click(screen.getByRole("button", { name: "Clear", exact: true }));
    const clearedChars = expected.map((character, index) => {
      if (index < 4 || index >= 9) return character;
      const style = { ...character.style }; delete style[property]; return { ...character, style };
    });
    await waitFor(() => expect(chars()).toEqual(clearedChars));
    const cleared = saved();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(colored));
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(before));
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(colored));
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(cleared));
    expect(change).toHaveBeenLastCalledWith(cleared);
    const originalEditor = editor;
    rendered.rerender(<Provider><PageRichTextEditorSection lexicalValue={cleared} editorKey="colors-reloaded" toolPreset="full" onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(editor).not.toBe(originalEditor));
    expect(saved()).toEqual(cleared);
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    expect(saved()).toEqual(cleared);
  });
}

it("case conversion expands only the selected Unicode run and retains the full transformed range", async () => {
  const user = userEvent.setup();
  const value = { root: { ...initial.root, children: [{ ...initial.root.children[0], children: [{ ...run, text: "aßz" }] }] } };
  render(<Provider><PageRichTextEditorSection lexicalValue={value} editorKey="unicode" toolPreset="full" onLexicalChange={vi.fn()} /></Provider>);
  await select(1, 2, true);
  await user.click(screen.getByRole("button", { name: "Text style", exact: true }));
  await user.click(screen.getByRole("menuitem", { name: "Uppercase", exact: true }));
  await waitFor(() => expect(editor!.getEditorState().read(() => $getRoot().getTextContent())).toBe("aSSz"));
  expect(selectionText()).toEqual({ text: "SS", backwards: true, collapsed: false });
});

for (const label of ["Uppercase", "Clear Formatting"]) {
  it(`${label} at a caret preserves existing content`, async () => {
    const user = userEvent.setup();
    render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="caret" toolPreset="full" onLexicalChange={vi.fn()} /></Provider>);
    await select(6, 6); const before = chars();
    await user.click(screen.getByRole("button", { name: "Text style", exact: true }));
    await user.click(screen.getByRole("menuitem", { name: label, exact: true }));
    await waitFor(() => expect(chars()).toEqual(before));
    expect(selectionText().collapsed).toBe(true);
  });
}

for (const [label, format] of [["Left Align", "left"], ["Center Align", "center"], ["Right Align", "right"],
  ["Justify Align", "justify"], ["Start Align", "start"], ["End Align", "end"]] as const) {
  it(`${label} transforms the real selected paragraph and restores exact history`, async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const value = { root: { ...initial.root, children: [{ ...initial.root.children[0], format: format === "right" ? "center" : "right" },
      { ...initial.root.children[0], children: [{ ...run, text: "Adjacent paragraph" }] }] } };
    const rendered = render(<Provider><PageRichTextEditorSection lexicalValue={value} editorKey="align" toolPreset="full" onLexicalChange={change} /></Provider>);
    await select(); const before = saved();
    const previousChars = chars();
    await user.click(screen.getByRole("button", { name: format === "right" ? "Center Align" : "Right Align", exact: true }));
    await user.click(screen.getByRole("menuitemradio", { name: label, exact: true }));
    await waitFor(() => expect(saved().root.children[0]).toEqual({ ...before.root.children[0], format }));
    expect(saved().root.children[1]).toEqual(before.root.children[1]);
    expect(chars()).toEqual(previousChars);
    expect(selectionText().text).toBe("miXeD");
    const next = saved();
    expect(screen.getByRole("button", { name: label, exact: true })).toBeTruthy();
    expect(change).toHaveBeenLastCalledWith(next);
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(before));
    expect(screen.getByRole("button", { name: format === "right" ? "Center Align" : "Right Align", exact: true })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Redo", exact: true }));
    await waitFor(() => expect(saved()).toEqual(next));
    expect(screen.getByRole("button", { name: label, exact: true })).toBeTruthy();
    const originalEditor = editor;
    rendered.rerender(<Provider><PageRichTextEditorSection lexicalValue={next} editorKey="align-reloaded" toolPreset="full" onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(editor).not.toBe(originalEditor));
    expect(saved()).toEqual(next);
    await user.click(screen.getByRole("button", { name: "Undo", exact: true }));
    expect(saved()).toEqual(next);
  });
}
