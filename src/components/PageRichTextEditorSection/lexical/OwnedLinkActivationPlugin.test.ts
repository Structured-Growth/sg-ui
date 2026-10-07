// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement, StrictMode } from "react";
import { cleanup, render } from "@testing-library/react";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createLinkNode } from "@lexical/link";
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from "lexical";
import { EXPERIENCE_EDITOR_NODES } from "./editorConfig";
import { OwnedLinkActivationPlugin, registerOwnedLinkActivation } from "./OwnedLinkActivationPlugin";

afterEach(() => { cleanup(); document.body.replaceChildren(); vi.restoreAllMocks(); });

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

  it.each([{}, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }])("preserves selection without opening the destination (%j)", init => {
    const { editor, anchor, open } = mount();
    editor.update(() => { $getRoot().select(0, 1); }, { discrete: true });
    const event = new MouseEvent(init.button === 1 ? "auxclick" : "click", { bubbles: true, cancelable: true, ...init });
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

  it.each(["/courses/guide", "#section", "?view=details", "www.example.org", "mailto:teacher@example.org", "tel:+15551234567"])("uses the shared normalized activation destination for %s", url => {
    const { anchor, open } = mount(url);
    // A rich child's text node, rather than the anchor itself, is the event target.
    anchor.firstChild!.firstChild!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(open).toHaveBeenCalledExactlyOnceWith(url.startsWith("www.") ? `https://${url}` : url, "_blank", "noopener,noreferrer");
  });

  it.each([{ button: 1, type: "click" }, { button: 2, type: "click" }, { button: 0, type: "auxclick" }, { button: 2, type: "auxclick" }])("ignores nonactivation events (%j)", ({ type, button }) => {
    const { anchor, open } = mount("#guide");
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, button });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });

  it.each(["click", "auxclick"])("respects host cancellation of %s before the root listener", type => {
    const { anchor, open } = mount();
    anchor.addEventListener(type, event => event.preventDefault());
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(open).not.toHaveBeenCalled();
  });

  it.each(["javascript:alert(1)", "sms:123", "//example.com/path"])("blocks modified and middle activation of rejected URL %s", url => {
    const { anchor, open } = mount(url);
    for (const init of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
      const event = new MouseEvent(init.button === 1 ? "auxclick" : "click", { bubbles: true, cancelable: true, ...init });
      anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(open).not.toHaveBeenCalled();
  });

  it.each([true, false])("lets only the nearest independent editor govern nested activation (outer selection=%s)", outerSelected => {
    const outer = mount("/outer");
    const inner = mount("/inner");
    const selected = outerSelected ? outer : inner;
    selected.editor.update(() => { $getRoot().select(0, 1); }, { discrete: true });
    outer.root.append(inner.root);
    for (const type of ["click", "auxclick"]) {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
      inner.anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(inner.open).toHaveBeenCalledTimes(outerSelected ? 2 : 0);
    for (const call of inner.open.mock.calls) expect(call).toEqual(["/inner", "_blank", "noopener,noreferrer"]);
    inner.dispose(); outer.dispose();
  });

  it("moves both listeners to the replacement root and removes them on disposal", () => {
    const { editor, root, open, dispose } = mount("#guide");
    const removed = vi.spyOn(root, "removeEventListener");
    const replacement = document.createElement("div"); document.body.append(replacement);
    editor.setRootElement(replacement);
    const current = replacement.querySelector("a")!;
    const currentRemoved = vi.spyOn(replacement, "removeEventListener");
    for (const type of ["click", "auxclick"]) {
      expect(removed).toHaveBeenCalledWith(type, expect.any(Function));
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
      current.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(open).toHaveBeenCalledTimes(2);
    dispose();
    for (const type of ["click", "auxclick"]) {
      expect(currentRemoved).toHaveBeenCalledWith(type, expect.any(Function));
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
      current.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("replays the actual plugin effect in React StrictMode and cleans up on unmount", () => {
    const { editor, root, anchor, open, dispose } = mount("#guide");
    dispose();
    const added = vi.spyOn(root, "addEventListener");
    const removed = vi.spyOn(root, "removeEventListener");
    const plugin = render(createElement(StrictMode, null,
      createElement(LexicalComposerContext.Provider, { value: [editor, { getTheme: () => ({}) }] },
        createElement(OwnedLinkActivationPlugin))));
    for (const type of ["click", "auxclick"]) {
      expect(added.mock.calls.filter(([eventType]) => eventType === type)).toHaveLength(2);
      expect(removed.mock.calls.filter(([eventType]) => eventType === type)).toHaveLength(1);
      anchor.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 }));
    }
    expect(open).toHaveBeenCalledTimes(2);
    plugin.unmount();
    for (const type of ["click", "auxclick"]) {
      expect(removed.mock.calls.filter(([eventType]) => eventType === type)).toHaveLength(2);
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
      anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("detaches and reattaches a temporarily absent root without duplicate activation", () => {
    const { editor, root, open, dispose } = mount("#guide");
    editor.setRootElement(null);
    editor.setRootElement(root);
    const anchor = root.querySelector("a")!;
    for (const type of ["click", "auxclick"]) {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: type === "auxclick" ? 1 : 0 });
      anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    }
    expect(open).toHaveBeenCalledTimes(2);
    dispose();
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(open).toHaveBeenCalledTimes(2);
  });
});
