// @vitest-environment jsdom
import { useEffect, createRef } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $createParagraphNode, $createTextNode, $getRoot, $isTextNode, $getSelection, type LexicalEditor } from "lexical";
import { Provider } from "../../experimental/Provider/Provider";
import { FloatingTextSelectionToolbar, type FloatingTextSelectionToolbarProps } from "./FloatingTextSelectionToolbar";
let editor: LexicalEditor;
let selectionRect = new DOMRect(100, 120, 90, 20);
const originalRect = Range.prototype.getBoundingClientRect, originalRects = Range.prototype.getClientRects;
beforeAll(() => {
  Range.prototype.getBoundingClientRect = () => selectionRect;
  Range.prototype.getClientRects = () => [selectionRect] as unknown as DOMRectList;
});
afterAll(() => {
  if (originalRect) Range.prototype.getBoundingClientRect = originalRect; else delete (Range.prototype as Partial<Range>).getBoundingClientRect;
  if (originalRects) Range.prototype.getClientRects = originalRects; else delete (Range.prototype as Partial<Range>).getClientRects;
});
afterEach(() => { cleanup(); selectionRect = new DOMRect(100, 120, 90, 20); });
function Capture() { const [value] = useLexicalComposerContext(); useEffect(() => { editor = value; }, [value]); return null; }
function mount(props: FloatingTextSelectionToolbarProps = {}) {
  const ref=createRef<HTMLDivElement>();
  const result=render(<Provider><LexicalComposer initialConfig={{ namespace: "floating-test", onError: error => { throw error; }, editorState: () => $getRoot().append($createParagraphNode().append($createTextNode("Guide text"))) }}><Capture /><FloatingTextSelectionToolbar {...props} ref={ref} /><RichTextPlugin ErrorBoundary={LexicalErrorBoundary} contentEditable={<ContentEditable aria-label="Document" />} placeholder={null} /></LexicalComposer><button>Outside</button></Provider>);
  return {...result,ref};
}
async function select() {
  await act(async () => { editor.getRootElement()!.focus(); editor.update(() => { const text=$getRoot().getFirstDescendant(); if (!$isTextNode(text)) throw new Error("Expected text"); text.select(0,5); }, {discrete:true}); });
  await waitFor(() => expect(screen.getByRole("group",{name:"Selection formatting"})).toBeTruthy());
}
const text = () => editor.getEditorState().read(() => $getRoot().getTextContent());
describe("floating selection formatting", () => {
  it("hides inactive actions from keyboard and applies a pointer command to the selected text", async () => {
    const user=userEvent.setup(); const {ref}=mount({className:"host",style:{margin:2}});
    expect(screen.queryByRole("button",{name:"Bold"})).toBeNull(); await select();
    expect(ref.current?.className).toContain("host"); expect(ref.current?.style.margin).toBe("2px");
    expect((screen.getByRole("button",{name:"Edit link"}) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button",{name:"Bold"}));
    await waitFor(()=>expect(JSON.stringify(editor.getEditorState().toJSON())).toContain('"format":1'));
    expect(text()).toBe("Guide text"); expect(screen.getByRole("button",{name:"Bold"}).getAttribute("aria-pressed")).toBe("true");
  });
  it("offers Alt F10 keyboard access, preserves selection across focus and defers Enter refocus", async () => {
    const user=userEvent.setup(); mount(); await select();
    fireEvent.keyDown(editor.getRootElement()!,{key:"F10",altKey:true});
    const bold=screen.getByRole("button",{name:"Bold"}); expect(document.activeElement).toBe(bold);
    fireEvent.keyDown(bold,{key:"Enter",code:"Enter"}); expect(document.activeElement).toBe(bold); expect(text()).toBe("Guide text");
    fireEvent.keyUp(bold,{key:"Enter",code:"Enter"});
    await waitFor(()=>expect(JSON.stringify(editor.getEditorState().toJSON())).toContain('"format":1'));
    fireEvent.keyDown(editor.getRootElement()!,{key:"F10",altKey:true});
    await user.keyboard("{Tab} ");
    await waitFor(()=>expect(JSON.stringify(editor.getEditorState().toJSON())).toContain('"format":3'));
    expect(text()).toBe("Guide text");
  });
  it("restores selection for links, calls pointer preparation once and supports keyboard activation", async () => {
    const user=userEvent.setup(); const link=vi.fn(),prepare=vi.fn(); mount({onRequestLink:link,onRequestLinkMouseDown:prepare}); await select();
    await user.click(screen.getByRole("button",{name:"Edit link"})); await waitFor(()=>expect(link).toHaveBeenCalledTimes(1)); expect(prepare).toHaveBeenCalledTimes(1);
    screen.getByRole("button",{name:"Edit link"}).focus(); await user.keyboard("{Enter}"); await waitFor(()=>expect(link).toHaveBeenCalledTimes(2)); expect(prepare).toHaveBeenCalledTimes(1); expect(text()).toBe("Guide text");
  });
  it("reanchors on scroll/resize, clamps to viewport and hides offscreen selections", async () => {
    mount(); await select(); const toolbar=screen.getByRole("group",{name:"Selection formatting"});
    expect(toolbar.style.left).toBe("100px"); fireEvent.keyDown(editor.getRootElement()!,{key:"F10",altKey:true}); selectionRect=new DOMRect(1000,40,20,20); fireEvent(window,new Event("resize"));
    expect(Number.parseFloat(toolbar.style.left)).toBeLessThanOrEqual(window.innerWidth-12-240);
    selectionRect=new DOMRect(100,-100,90,20); fireEvent.scroll(document); expect(screen.queryByRole("group",{name:"Selection formatting"})).toBeNull();
  });
  it("preserves every ancestor offset when native offscreen focus ignores preventScroll", async () => {
    const { container } = mount(); await select();
    const root = editor.getRootElement()!;
    const host = root.parentElement!;
    container.scrollTop = 45; container.scrollLeft = -20;
    host.scrollTop = 300; host.scrollLeft = 25;
    root.scrollTop = 10;
    fireEvent.keyDown(root, { key: "F10", altKey: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Bold" }));
    const selectionBefore = editor.getEditorState().read(() => $getSelection()?.clone());
    const nativeFocus = root.focus.bind(root);
    const focus = vi.spyOn(root, "focus").mockImplementation(options => {
      nativeFocus(options);
      // Model the captured WebKit synchronous reveal, including nested axes.
      host.scrollTop = 0; host.scrollLeft = 0;
      container.scrollTop = 0; container.scrollLeft = 0;
      root.scrollTop = 0;
    });
    try {
      selectionRect = new DOMRect(100, -100, 90, 20);
      fireEvent.scroll(host);
      expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
      expect(document.activeElement).toBe(root);
      expect(host.scrollTop).toBe(300); expect(host.scrollLeft).toBe(25);
      expect(container.scrollTop).toBe(45); expect(container.scrollLeft).toBe(-20);
      expect(root.scrollTop).toBe(10);
      expect(editor.getEditorState().read(() => $getSelection()?.is(selectionBefore!))).toBe(true);
      expect(screen.queryByRole("group", { name: "Selection formatting" })).toBeNull();
      selectionRect = new DOMRect(100, 120, 90, 20);
      fireEvent.scroll(host);
      expect(screen.queryByRole("group", { name: "Selection formatting" })).toBeNull();
      expect(focus).toHaveBeenCalledTimes(1);
    } finally { focus.mockRestore(); }
  });
  it("dismisses with Escape/outside pointer/window blur, removes listeners and cleans up listeners", async () => {
    const user=userEvent.setup(); const {unmount}=mount(); await select();
    fireEvent.keyDown(editor.getRootElement()!,{key:"F10",altKey:true}); await user.keyboard("{Escape}");
    await waitFor(()=>expect(document.activeElement).toBe(editor.getRootElement())); expect(screen.queryByRole("group",{name:"Selection formatting"})).toBeNull();
    fireEvent.pointerDown(editor.getRootElement()!); await select(); fireEvent.pointerDown(screen.getByRole("button",{name:"Outside"})); expect(screen.queryByRole("group",{name:"Selection formatting"})).toBeNull();
    fireEvent.pointerDown(editor.getRootElement()!); await select(); fireEvent(window,new Event("blur")); expect(screen.queryByRole("group",{name:"Selection formatting"})).toBeNull();
    unmount(); fireEvent.scroll(document); fireEvent(window,new Event("resize"));
  });
  it("hides a read-only editor and cancels queued commands on unmount", async () => {
    const {unmount}=mount(); await select();
    act(()=>editor.setEditable(false)); expect(screen.queryByRole("group",{name:"Selection formatting"})).toBeNull();
    act(()=>editor.setEditable(true)); await select();
    vi.useFakeTimers();
    try {
      const bold=screen.getByRole("button",{name:"Bold"}); bold.focus();
      fireEvent.keyDown(bold,{key:"Enter",code:"Enter"}); fireEvent.keyUp(bold,{key:"Enter",code:"Enter"});
      unmount(); await act(async()=>{vi.runAllTimers();});
      expect(JSON.stringify(editor.getEditorState().toJSON())).toContain('"format":0');
    } finally { vi.useRealTimers(); }
  });
});
