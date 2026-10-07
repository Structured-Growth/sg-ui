// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { $createLinkNode } from "@lexical/link";
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";
import { registerOwnedLinkActivation } from "./OwnedLinkActivationPlugin";

afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); });

function mount(url = "https://example.com/guide", editable = true) {
  const root = document.createElement("div");
  document.body.append(root);
  const editor = createEditor({ namespace: "link-activation", nodes: EXPERIENCE_EDITOR_NODES, editable, onError: error => { throw error; } });
  editor.setRootElement(root);
  const dispose = registerOwnedLinkActivation(editor);
  editor.update(() => { $getRoot().append($createParagraphNode().append($createLinkNode(url).append($createTextNode("Guide")))); }, { discrete: true });
  const anchor = root.querySelector("a")!;
  const open = vi.spyOn(window, "open").mockReturnValue(null);
  return { editor, root, anchor, open, dispose };
}

describe("owned editor link activation", () => {
  it.each([true, false])("isolates ordinary, modifier and middle activation when editable=%s", editable => {
    const { anchor, open } = mount(undefined, editable);
    for (const init of [{}, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { button: 1 }]) {
      const event = new MouseEvent(init.button === 1 ? "auxclick" : "click", { bubbles: true, cancelable: true, ...init });
      anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(open).toHaveBeenCalledTimes(5);
    for (const call of open.mock.calls) expect(call).toEqual(["https://example.com/guide", "_blank", "noopener,noreferrer"]);
  });

  it("preserves selection without opening the destination", () => {
    const { editor, anchor, open } = mount();
    editor.update(() => { $getRoot().select(0, 1); }, { discrete: true });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(open).not.toHaveBeenCalled();
  });

  it.each(["javascript:alert(1)", "sms:123", "//example.com/path"])("blocks rejected saved URL %s", url => {
    const { anchor, open } = mount(url);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(open).not.toHaveBeenCalled();
  });

  it("ignores right clicks and removes listeners when disposed or the root changes", () => {
    const { editor, root, anchor, open, dispose } = mount();
    anchor.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, button: 2 }));
    const replacement = document.createElement("div"); document.body.append(replacement);
    editor.setRootElement(replacement);
    anchor.addEventListener("click", event => event.preventDefault());
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(open).not.toHaveBeenCalled();
    expect(root.querySelector("a")).toBeNull();
    dispose();
    const current = replacement.querySelector("a")!;
    current.addEventListener("click", event => event.preventDefault());
    current.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(open).not.toHaveBeenCalled();
  });
});
