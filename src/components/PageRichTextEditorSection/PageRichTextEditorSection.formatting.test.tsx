// @vitest-environment jsdom
import { createRef, useEffect } from "react";
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $createParagraphNode, $createTextNode, $getRoot, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { $createListNode, $createListItemNode } from "@lexical/list";
import { $createLinkNode } from "@lexical/link";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createImageNode } from "./lexical/ImageNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SGTranslationProvider, type SGTranslationOptions } from "../../i18n";
import { Provider } from "../../experimental/Provider/Provider";
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
  render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="formatting" toolPreset="full" onLexicalChange={change} onUploadImage={upload} /></Provider>);
  return change;
}
function serializedChildren() {
  return activeEditor!.getEditorState().toJSON().root.children[0] as unknown as { children: { type: string; url?: string; text?: string; children?: { text: string; format: number; style: string }[]; target?: string; rel?: string }[] };
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
  it("preserves differently formatted runs when linking, changing the URL and unlinking", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const runs = [
      { ...textNode, text: "Guide", format: 1, style: "color: var(--sgui-action);" },
      { ...textNode, text: " notes", format: 2, style: "font-family: Georgia;" },
    ];
    const value = { root: { ...initial.root, children: [{ ...initial.root.children[0], children: runs }] } };
    render(<Provider><PageRichTextEditorSection lexicalValue={value} editorKey="styled-link" toolPreset="full" onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(activeEditor).toBeTruthy());
    await act(async () => {
      activeEditor!.getRootElement()!.focus();
      activeEditor!.update(() => {
        const paragraph = $getRoot().getFirstChildOrThrow();
        if (!$isElementNode(paragraph)) throw new Error("Expected paragraph");
        paragraph.select(0, paragraph.getChildrenSize());
      }, { discrete: true });
    });
    await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect((screen.getByRole("textbox", { name: "Display Text" }) as HTMLInputElement).value).toBe("Guide notes");
    await user.type(screen.getByRole("textbox", { name: "URL" }), "/courses/guide");
    await user.keyboard("{Enter}");
    const expectRuns = () => expect(serializedChildren().children[0].children).toEqual(runs);
    await waitFor(expectRuns);
    expect(serializedChildren().children[0].url).toBe("/courses/guide");
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByRole("textbox", { name: "URL" }));
    await user.type(screen.getByRole("textbox", { name: "URL" }), "/courses/updated");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(serializedChildren().children[0].url).toBe("/courses/updated"));
    expectRuns();
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByRole("textbox", { name: "URL" }));
    await user.keyboard("{Enter}");
    await waitFor(() => expect(serializedChildren().children).toEqual(runs));
    expect($getText()).toBe("Guide notes");
    expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
  });
  it("round-trips registered document nodes and host image metadata across document reload", async () => {
    const change = vi.fn();
    const rendered = render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="nodes-source" onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(activeEditor).toBeTruthy());
    await act(async () => {
      activeEditor!.update(() => {
        const root = $getRoot(); root.clear();
        const link = $createLinkNode("/courses/guide").append($createTextNode("Guide").toggleFormat("bold"));
        const item = $createListItemNode().append($createTextNode("Checklist"));
        root.append(
          $createHeadingNode("h2").append($createTextNode("Heading")),
          $createQuoteNode().append($createTextNode("Quotation")),
          $createCodeNode("javascript").append($createTextNode("const answer = 42;")),
          $createListNode("bullet").append(item),
          $createParagraphNode().setTextFormat(1).append(link),
          $createTableNodeWithDimensions(1, 2, false),
          $createHorizontalRuleNode(),
          $createParagraphNode().append($createImageNode({ src: "/course-cover.png", altText: "Course cover", width: 640, height: 480, assetId: "asset-42", assetVersionId: "version-7" })),
        );
      }, { discrete: true });
    });
    const saved = activeEditor!.getEditorState().toJSON();
    await waitFor(() => expect(change).toHaveBeenCalledWith(saved));
    const firstEditor = activeEditor!;
    rendered.rerender(<Provider><PageRichTextEditorSection lexicalValue={saved} editorKey="nodes-reloaded" readOnly onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(activeEditor).not.toBe(firstEditor));
    expect(activeEditor!.getEditorState().toJSON()).toEqual(saved);
    expect(screen.getByRole("heading", { name: "Heading", level: 2 })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Guide" }).getAttribute("href")).toBe("/courses/guide");
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Course cover" }).getAttribute("src")).toBe("/course-cover.png");
  });
  it("uses host translations and native style slots with an accessible editable name", async () => {
    const t = vi.fn((key: string, options: SGTranslationOptions) => key === "editor.document" ? "Documento" : key === "editor.placeholder" ? "Escribe contenido" : options.defaultMessage);
    const value = { root: { ...initial.root, children: [{ ...initial.root.children[0], children: [] }] } };
    const ref = createRef<HTMLDivElement>();
    const rendered = render(<SGTranslationProvider value={{ locale: "es", t, useNamespace: vi.fn() }}><Provider locale="es"><PageRichTextEditorSection lexicalValue={value} editorKey="translated" ref={ref} className="host-editor" style={{ maxWidth: 600 }} onLexicalChange={vi.fn()} /></Provider></SGTranslationProvider>);
    const editable = screen.getByRole("textbox", { name: "Documento" });
    expect(editable.getAttribute("contenteditable")).toBe("true");
    expect(screen.getByText("Escribe contenido")).toBeTruthy();
    const root = editable.closest('[data-sgui-part="editor-section"]') as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root.classList.contains("host-editor")).toBe(true);
    expect(root.style.maxWidth).toBe("600px");
    expect(t).toHaveBeenCalledWith("editor.document", { defaultMessage: "Document" });
    rendered.rerender(<Provider><PageRichTextEditorSection lexicalValue={value} editorKey="translated" aria-label="Course content" placeholder="Host placeholder" onLexicalChange={vi.fn()} /></Provider>);
    expect(screen.getByRole("textbox", { name: "Course content" })).toBeTruthy();
    expect(screen.getByText("Host placeholder")).toBeTruthy();
  });
  it("updates read-only interaction on the existing editor without losing content", async () => {
    const change = vi.fn();
    const view = (readOnly: boolean) => <Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="editable-state" toolPreset="full" readOnly={readOnly} onLexicalChange={change} /></Provider>;
    const rendered = render(view(false));
    await waitFor(() => expect(activeEditor?.isEditable()).toBe(true));
    const originalEditor = activeEditor!;
    rendered.rerender(view(true));
    await waitFor(() => expect(activeEditor?.isEditable()).toBe(false));
    expect(activeEditor).toBe(originalEditor);
    expect(originalEditor.getRootElement()?.getAttribute("contenteditable")).toBe("false");
    expect(screen.queryByRole("button", { name: "Bold" })).toBeNull();
    expect($getText()).toBe("Guide");
    rendered.rerender(view(false));
    await waitFor(() => expect(activeEditor?.isEditable()).toBe(true));
    expect(activeEditor).toBe(originalEditor);
    expect(originalEditor.getRootElement()?.getAttribute("contenteditable")).toBe("true");
    expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
  });
  it("loads a new document and closes its dialogs when the host changes editorKey", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const nextValue = { root: { ...initial.root, children: [{ ...initial.root.children[0], children: [{ ...textNode, text: "Next document" }] }] } };
    const rendered = render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="first-document" toolPreset="full" onLexicalChange={change} /></Provider>);
    await selectText(); const firstEditor = activeEditor!;
    await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    rendered.rerender(<Provider><PageRichTextEditorSection lexicalValue={nextValue} editorKey="next-document" toolPreset="full" onLexicalChange={change} /></Provider>);
    await waitFor(() => expect(activeEditor).not.toBe(firstEditor));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect($getText()).toBe("Next document");
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect((screen.getByRole("textbox", { name: "Display Text" }) as HTMLInputElement).value).toBe("Next document");
    expect((screen.getByRole("textbox", { name: "URL" }) as HTMLInputElement).value).toBe("");
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
