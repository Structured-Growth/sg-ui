// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { AppThemeProvider } from "../../theme/AppThemeProvider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";

// jsdom omits Range geometry used by Lexical's caret scroll. Native scrolling is checked in the browser.
const originalRangeRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRangeRect) Range.prototype.getBoundingClientRect = originalRangeRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
let activeEditor: LexicalEditor | undefined;
function CaptureEditor() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => { activeEditor = editor; }, [editor]);
  return null;
}

vi.mock("@lexical/react/LexicalComposer", async () => {
  const actual = await vi.importActual<typeof import("@lexical/react/LexicalComposer")>("@lexical/react/LexicalComposer");
  return { LexicalComposer: (props: import("react").ComponentProps<typeof actual.LexicalComposer>) => <actual.LexicalComposer {...props} initialConfig={{ ...props.initialConfig, onError: error => { throw error; } }} /> };
});
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
vi.mock("./lexical/ExperienceEditorPlugins", async () => {
  const actual = await vi.importActual<typeof import("./lexical/ExperienceEditorPlugins")>("./lexical/ExperienceEditorPlugins");
  return { ExperienceEditorPlugins: (props: { onChange: (value: unknown) => void }) => <><CaptureEditor /><actual.ExperienceEditorPlugins {...props} /></> };
});

afterEach(() => { cleanup(); activeEditor = undefined; });
const textNode = { type: "text", version: 1, text: "Guide", detail: 0, format: 0, mode: "normal", style: "" };
const initial = { root: { type: "root", version: 1, children: [{ type: "paragraph", version: 1, children: [textNode], direction: null, format: "", indent: 0 }], direction: null, format: "", indent: 0 } };

async function selectText() {
  await waitFor(() => expect(activeEditor).toBeTruthy());
  await act(async () => {
    activeEditor!.getRootElement()?.focus();
    activeEditor!.update(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error("Expected paragraph");
      const child = paragraph.getFirstChildOrThrow();
      const text = $isElementNode(child) ? child.getFirstChildOrThrow() : child;
      if (!$isTextNode(text)) throw new Error("Expected selectable text");
      text.select(0, text.getTextContentSize());
    }, { discrete: true });
  });
}
function mount(upload?: (file: File) => Promise<{ assetId: string; assetVersionId: string; src: string; altText?: string }>) {
  const change = vi.fn();
  render(<AppThemeProvider><Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="formatting" toolPreset="full" onLexicalChange={change} onUploadImage={upload} /></Provider></AppThemeProvider>);
  return change;
}
function serializedChildren() {
  return activeEditor!.getEditorState().toJSON().root.children[0] as unknown as { children: { type: string; url?: string; text?: string; children?: { text: string }[]; target?: string; rel?: string }[] };
}

describe("owned formatting with the real Lexical host", () => {
  it("formats selected text, headings and font family through the real toolbar and serializes changes", async () => {
    const user=userEvent.setup(); const change=mount(); await selectText();
    await user.click(screen.getByRole("button",{name:"Bold"}));
    await waitFor(()=>expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain('"format":1'));
    expect(screen.getByRole("button",{name:"Bold"}).getAttribute("aria-pressed")).toBe("true");
    await selectText(); await user.click(screen.getByRole("button",{name:/Font family/})); await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(()=>expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain('font-family: Georgia'));
    await selectText(); await user.click(screen.getByRole("button",{name:/Text style heading/})); await user.click(screen.getByRole("option",{name:"Heading 2"}));
    await waitFor(()=>expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain('"tag":"h2"'));
    expect($getText()).toBe("Guide"); expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
  });
  it("captures the selected link text before pointer focus and supports a keyboard dialog commit", async () => {
    const user=userEvent.setup(); const change=mount(); await selectText();
    await user.click(screen.getByRole("button",{name:"Edit link"}));
    expect((screen.getByRole("textbox",{name:"Display Text"}) as HTMLInputElement).value).toBe("Guide");
    await user.type(screen.getByRole("textbox",{name:"URL"}),"/courses/guide"); await user.click(screen.getByRole("button",{name:"Apply"}));
    await waitFor(()=>expect(serializedChildren().children[0].url).toBe("/courses/guide"));
    await selectText(); screen.getByRole("button",{name:"Edit link"}).focus(); await user.keyboard("{Enter}");
    await user.clear(screen.getByRole("textbox",{name:"URL"})); await user.keyboard("{Enter}");
    await waitFor(()=>expect(serializedChildren().children.every(node=>node.type!=="link")).toBe(true));
    expect($getText()).toBe("Guide"); expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
  });
});
function $getText() { return activeEditor!.getEditorState().read(()=>$getRoot().getTextContent()); }
