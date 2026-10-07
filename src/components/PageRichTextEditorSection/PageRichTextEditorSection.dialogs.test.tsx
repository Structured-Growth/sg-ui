// @vitest-environment jsdom
import { useEffect } from "react";
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { $getRoot, $isElementNode, $isTextNode, type LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection.impl";

let activeEditor: LexicalEditor | undefined;
function CaptureEditor() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => { activeEditor = editor; }, [editor]);
  return null;
}

// jsdom lacks caret geometry; native scrolling remains a browser acceptance check.
const originalRangeRect = Range.prototype.getBoundingClientRect;
beforeAll(() => { Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0); });
afterAll(() => { if (originalRangeRect) Range.prototype.getBoundingClientRect = originalRangeRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect; });
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
  render(<Provider><PageRichTextEditorSection lexicalValue={initial} editorKey="dialogs" toolPreset="full" onLexicalChange={change} onUploadImage={upload} /></Provider>);
  return change;
}
async function openImageDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Insert", exact: true }));
  await user.click(screen.getByRole("menuitem", { name: "Image", exact: true }));
}
function serializedChildren() {
  return activeEditor!.getEditorState().toJSON().root.children[0] as unknown as { children: { type: string; url?: string; text?: string; children?: { text: string }[]; target?: string; rel?: string }[] };
}

describe("editor dialog host contracts", () => {
  it("retains local image URLs for read-only and undo, then releases them on document reset and unmount", async () => {
    const create = vi.fn().mockReturnValueOnce("blob:dialog-preview").mockReturnValueOnce("blob:document-image").mockReturnValueOnce("blob:second-preview").mockReturnValueOnce("blob:second-image");
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL { static createObjectURL = create; static revokeObjectURL = revoke; });
    const user = userEvent.setup();
    const props = { lexicalValue: initial, editorKey: "first", toolPreset: "full" as const, onLexicalChange: vi.fn() };
    const view = render(<Provider><PageRichTextEditorSection {...props} /></Provider>);
    try {
      await selectText(); await openImageDialog(user);
      await user.upload(screen.getByLabelText("Choose image"), new File(["image"], "local.png", { type: "image/png" }));
      await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }));
      await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain("blob:document-image"));
      await waitFor(() => expect(revoke).toHaveBeenCalledWith("blob:dialog-preview"));
      view.rerender(<Provider><PageRichTextEditorSection {...props} readOnly /></Provider>);
      expect(revoke).not.toHaveBeenCalledWith("blob:document-image");
      view.rerender(<Provider><PageRichTextEditorSection {...props} editorKey="second" /></Provider>);
      expect(revoke).toHaveBeenCalledWith("blob:document-image");
      await selectText(); await openImageDialog(user);
      await user.upload(screen.getByLabelText("Choose image"), new File(["image"], "second.png", { type: "image/png" }));
      await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }));
      await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain("blob:second-image"));
      view.unmount();
      expect(revoke.mock.calls.filter(([url]) => url === "blob:document-image")).toHaveLength(1);
      expect(revoke.mock.calls.filter(([url]) => url === "blob:second-image")).toHaveLength(1);
      expect(create).toHaveBeenCalledTimes(4);
    } finally { vi.unstubAllGlobals(); }
  });

  it("never releases host-owned image URLs", async () => {
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL { static createObjectURL = vi.fn(() => "blob:host-preview"); static revokeObjectURL = revoke; });
    const user = userEvent.setup();
    try {
      mount(async () => ({ assetId: "host", assetVersionId: "v1", src: "blob:host-owned" }));
      await selectText(); await openImageDialog(user);
      await user.upload(screen.getByLabelText("Choose image"), new File(["image"], "host.png", { type: "image/png" }));
      await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }));
      await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain("blob:host-owned"));
      cleanup();
      expect(revoke).not.toHaveBeenCalledWith("blob:host-owned");
    } finally { vi.unstubAllGlobals(); }
  });
  it.each([["/courses/guide", "/courses/guide"], ["www.example.org/guide", "https://www.example.org/guide"]])("stores accepted %s as %s in actual Lexical output", async (entered, stored) => {
    const user = userEvent.setup(); const change = mount();
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByRole("textbox", { name: "Display Text" }));
    await user.type(screen.getByRole("textbox", { name: "Display Text" }), "Course guide");
    await user.type(screen.getByRole("textbox", { name: "URL" }), entered);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    await waitFor(() => expect(serializedChildren().children.some(node => node.url === stored)).toBe(true));
    const link = serializedChildren().children.find(node => node.type === "link")!;
    expect(link.children?.[0].text).toBe("Course guide");
    expect(link.target).toBe(entered.startsWith("www.") ? "_blank" : null);
    expect(link.rel).toBe(entered.startsWith("www.") ? "noopener noreferrer" : null);
    expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    // Selecting the real link exercises the existing-node edit and unlink paths.
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect((screen.getByRole("textbox", { name: "URL" }) as HTMLInputElement).value).toBe(stored);
    await user.clear(screen.getByRole("textbox", { name: "Display Text" }));
    await user.type(screen.getByRole("textbox", { name: "Display Text" }), "Edited course guide");
    await user.clear(screen.getByRole("textbox", { name: "URL" }));
    await user.type(screen.getByRole("textbox", { name: "URL" }), "/courses/edited");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    await waitFor(() => expect(serializedChildren().children.find(node => node.type === "link")?.url).toBe("/courses/edited"));
    const editedLink = serializedChildren().children.find(node => node.type === "link")!;
    expect(editedLink.children?.[0].text).toBe("Edited course guide");
    expect(editedLink.target).toBeNull(); expect(editedLink.rel).toBeNull();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await selectText(); await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByRole("textbox", { name: "URL" }));
    expect((screen.getByRole("textbox", { name: "URL" }) as HTMLInputElement).value).toBe("");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    await waitFor(() => expect(serializedChildren().children.every(node => node.type !== "link")).toBe(true));
    expect(serializedChildren().children.map(node => node.text).join("")).toBe("Edited course guide");
    expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
  });

  it.each(["A diagram of a course", ""])("persists an explicit image description %j including decorative empty text", async description => {
    const user = userEvent.setup(); const uploaded = { assetId: "asset-42", assetVersionId: "version-3", src: "https://cdn.example.org/image.png", altText: "Host fallback description" };
    const upload = vi.fn(async (_file: File) => uploaded); const change = mount(upload);
    await selectText(); await openImageDialog(user);
    const file = new File(["image"], "diagram.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose image"), file);
    if (description) await user.type(screen.getByRole("textbox", { name: "Image description" }), description);
    await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }));
    await waitFor(() => expect(upload).toHaveBeenCalledExactlyOnceWith(file));
    await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain('"type":"image"'));
    const output = activeEditor!.getEditorState().toJSON();
    const serializedImage = JSON.stringify(output).match(/"altText":"([^"]*)"/);
    expect(serializedImage?.[1]).toBe(description);
    expect(JSON.stringify(output)).toContain('"assetId":"asset-42"');
    expect(change).toHaveBeenCalledWith(output);
  });

  it.each(["resolve", "reject"])("ignores a canceled host upload that later %ss after reopening", async outcome => {
    const user = userEvent.setup();
    let resolveUpload!: (value: { assetId: string; assetVersionId: string; src: string }) => void;
    let rejectUpload!: (reason: Error) => void;
    const upload = vi.fn((_file: File) => new Promise<{ assetId: string; assetVersionId: string; src: string }>((resolve, reject) => {
      resolveUpload = resolve; rejectUpload = reject;
    }));
    mount(upload); await selectText();
    await openImageDialog(user);
    await user.upload(screen.getByLabelText("Choose image"), new File(["old"], "old.png", { type: "image/png" }));
    await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }));
    expect(upload).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await openImageDialog(user);
    await user.upload(screen.getByLabelText("Choose image"), new File(["new"], "new.png", { type: "image/png" }));
    await act(async () => {
      if (outcome === "resolve") resolveUpload({ assetId: "old-asset", assetVersionId: "old-version", src: "https://cdn.example.org/old.png" });
      else rejectUpload(new Error("Old upload failed"));
    });
    expect(screen.getByRole("dialog", { name: "Insert Image" })).toBeTruthy();
    expect(screen.getByText("new.png")).toBeTruthy();
    expect(screen.queryByText("Old upload failed")).toBeNull();
    expect((within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert" }) as HTMLButtonElement).disabled).toBe(false);
    expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).not.toContain('"type":"image"');
  });

});

it("applies semantic color tokens and clears foreground/background through the real editor host", async () => {
  const user = userEvent.setup(); const change = mount();
  await selectText(); await user.click(screen.getByRole("button", {name:"Text color"}));
  await user.click(await screen.findByRole("button", {name:"Primary",exact:true}));
  await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain("color: var(--sgui-action)"));
  if (screen.queryByRole("dialog", {name:"Text color"})) await user.keyboard("{Escape}");
  await selectText(); await user.click(screen.getByRole("button", {name:"Text color"}));
  await user.click(await screen.findByRole("button", {name:"Clear",exact:true}));
  await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).not.toContain("color:"));
  if (screen.queryByRole("dialog", {name:"Text color"})) await user.keyboard("{Escape}");
  await selectText(); await user.click(screen.getByRole("button", {name:"Background color"}));
  await user.click(await screen.findByRole("button", {name:"Subtle surface",exact:true}));
  await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).toContain("background-color: var(--sgui-surface-subtle)"));
  if (screen.queryByRole("dialog", {name:"Background color"})) await user.keyboard("{Escape}");
  await selectText(); await user.click(screen.getByRole("button", {name:"Background color"}));
  await user.click(await screen.findByRole("button", {name:"Clear",exact:true}));
  await waitFor(() => expect(JSON.stringify(activeEditor!.getEditorState().toJSON())).not.toContain("background-color:"));
  expect(change).toHaveBeenCalledWith(activeEditor!.getEditorState().toJSON());
});
