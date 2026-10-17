// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $getSelection, $isRangeSelection, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, HISTORY_PUSH_TAG, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";
import { serializeEditorDocument } from "./lexical/serializeEditorDocument";
let editor: LexicalEditor | undefined;
function CaptureEditor() {
 const [current] = useLexicalComposerContext();
 useEffect(() => { editor = current; }, [current]);
 return null;
}
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
 const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
 return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) => <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
const originalRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRect) Range.prototype.getBoundingClientRect = originalRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
afterEach(() => { cleanup(); editor = undefined; });
const initial = { root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [
 { type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [
  { type: "text", version: 1, text: "Course", detail: 0, format: 0, mode: "normal", style: "" },
 ] },
] } };
const saved = () => serializeEditorDocument(editor!.getEditorState().toJSON());
const button = (name: string) => screen.getByRole("button", { name, exact: true }) as HTMLButtonElement;
async function insert(text: string) {
 await act(async () => {
  editor!.getRootElement()!.focus();
  editor!.update(() => { $getRoot().selectEnd(); }, { discrete: true });
  editor!.update(() => {
   const selection = $getSelection();
   if (!$isRangeSelection(selection)) throw new Error("Expected insertion caret");
   selection.insertText(text);
  }, { discrete: true, tag: HISTORY_PUSH_TAG });
 });
}
it("tracks real history and resets both actions on editorKey reload, ignoring retired editor commands", async () => {
 const user = userEvent.setup();
 const view = (value: unknown, key: string) => <Provider><PageRichTextEditorSection lexicalValue={value} editorKey={key} toolPreset="full" onLexicalChange={() => {}} /></Provider>;
 const rendered = render(view(initial, "original"));
 await waitFor(() => expect(editor).toBeTruthy());
 expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(true);
 await insert(" first");
 await waitFor(() => expect(button("Undo").disabled).toBe(false));
 expect(button("Redo").disabled).toBe(true);
 const edited = saved();
 await user.click(button("Undo"));
 await waitFor(() => expect(button("Redo").disabled).toBe(false));
 expect(button("Undo").disabled).toBe(true);
 await user.click(button("Redo"));
 await waitFor(() => expect(saved()).toEqual(edited));
 expect(button("Undo").disabled).toBe(false); expect(button("Redo").disabled).toBe(true);
 const retired = editor!;
 rendered.rerender(view(edited, "reloaded"));
 await waitFor(() => expect(editor).not.toBe(retired));
 await waitFor(() => { expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(true); });
 expect(saved()).toEqual(edited);
 await act(async () => { retired.dispatchCommand(CAN_UNDO_COMMAND, true); retired.dispatchCommand(CAN_REDO_COMMAND, true); });
 expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(true);
 await insert(" second");
 await waitFor(() => expect(button("Undo").disabled).toBe(false));
 await user.click(button("Undo"));
 await waitFor(() => expect(saved()).toEqual(edited));
 expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(false);
 const previous = editor!;
 rendered.rerender(view(edited, "reload-with-redo"));
 await waitFor(() => expect(editor).not.toBe(previous));
 await waitFor(() => { expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(true); });
 expect(saved()).toEqual(edited);
});
it("retains host-disabled history even when the current editor has an undo stack", async () => {
 render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="restricted" toolPreset="full" disabledControls={{ undo: true }} onLexicalChange={() => {}} /></Provider>);
 await waitFor(() => expect(editor).toBeTruthy());
 await insert(" edited");
 expect(button("Undo").disabled).toBe(true); expect(button("Redo").disabled).toBe(true);
});
