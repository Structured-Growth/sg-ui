// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";

// jsdom has no selection geometry. Native anchoring/scrolling is verified in the browser.
const originalRect = Range.prototype.getBoundingClientRect;
const originalRects = Range.prototype.getClientRects;
const originalElementRect = HTMLElement.prototype.getBoundingClientRect;
beforeAll(() => {
  // The real host supplies a viewport boundary; jsdom gives every element a zero rect.
  HTMLElement.prototype.getBoundingClientRect = function () {
    return this.matches('[data-sgui-part="selection-toolbar"]') ? new DOMRect(100, 68, 240, 44) : new DOMRect(0, 0, 800, 600);
  };
  Range.prototype.getBoundingClientRect = () => new DOMRect(100, 120, 90, 20);
  Range.prototype.getClientRects = () => [new DOMRect(100, 120, 90, 20)] as unknown as DOMRectList;
});
afterAll(() => {
  HTMLElement.prototype.getBoundingClientRect = originalElementRect;
  if (originalRect) Range.prototype.getBoundingClientRect = originalRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect;
  if (originalRects) Range.prototype.getClientRects = originalRects; else delete (Range.prototype as Partial<Range>).getClientRects;
});
let editor: LexicalEditor | undefined;
function CaptureEditor() {
  const [value] = useLexicalComposerContext();
  useEffect(() => { editor = value; }, [value]);
  return null;
}
vi.mock("@lexical/react/LexicalComposer", async () => {
  const actual = await vi.importActual<typeof import("@lexical/react/LexicalComposer")>("@lexical/react/LexicalComposer");
  return { LexicalComposer: (props: import("react").ComponentProps<typeof actual.LexicalComposer>) => <actual.LexicalComposer {...props} initialConfig={{ ...props.initialConfig, onError: error => { throw error; } }} /> };
});
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
  const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
  return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) => <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});
afterEach(() => { cleanup(); editor = undefined; });
const initial = { root: { type: "root", version: 1, children: [{ type: "paragraph", version: 1, children: [{ type: "text", version: 1, text: "Guide", detail: 0, format: 0, mode: "normal", style: "" }], direction: null, format: "", indent: 0 }], direction: null, format: "", indent: 0 } };
function mount() {
  const change = vi.fn();
  render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="floating-host" toolPreset="full" onLexicalChange={change} /></Provider>);
  return change;
}
async function selectText() {
  await waitFor(() => expect(editor).toBeTruthy());
  await act(async () => {
    editor!.getRootElement()!.focus();
    editor!.update(() => {
      const text = $getRoot().getFirstDescendant();
      if (!$isTextNode(text)) throw new Error("Expected selectable text");
      text.select(0, text.getTextContentSize());
    }, { discrete: true });
  });
  return within(await screen.findByRole("group", { name: "Selection formatting" }));
}
const text = () => editor!.getEditorState().read(() => $getRoot().getTextContent());
describe("floating formatting with the real Lexical host", () => {
  it("applies pointer formatting and Alt F10 keyboard formatting to the selected text", async () => {
    const user = userEvent.setup(); const change = mount(); let floating = await selectText();
    await user.click(floating.getByRole("button", { name: "Bold" }));
    await waitFor(() => expect(JSON.stringify(editor!.getEditorState().toJSON())).toContain('"format":1'));
    expect(text()).toBe("Guide");
    floating = await selectText();
    fireEvent.keyDown(editor!.getRootElement()!, { key: "F10", altKey: true });
    expect(document.activeElement).toBe(floating.getByRole("button", { name: "Bold" }));
    await user.keyboard("{Tab}{Enter}");
    await waitFor(() => expect(JSON.stringify(editor!.getEditorState().toJSON())).toContain('"format":3'));
    expect(text()).toBe("Guide");
    expect(change).toHaveBeenCalledWith(editor!.getEditorState().toJSON());
  });
  it("prepares selected link text before pointer focus and commits the host dialog with Enter", async () => {
    const user = userEvent.setup(); const change = mount(); const floating = await selectText();
    await user.click(floating.getByRole("button", { name: "Edit link" }));
    expect((screen.getByRole("textbox", { name: "Display Text" }) as HTMLInputElement).value).toBe("Guide");
    await user.type(screen.getByRole("textbox", { name: "URL" }), "/courses/guide");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(JSON.stringify(editor!.getEditorState().toJSON())).toContain('"url":"/courses/guide"'));
    expect(text()).toBe("Guide");
    expect(change).toHaveBeenCalledWith(editor!.getEditorState().toJSON());
  });
});
