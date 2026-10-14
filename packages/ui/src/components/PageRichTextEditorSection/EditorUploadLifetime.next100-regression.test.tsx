// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

// Selection geometry is outside this resource-ownership regression.
vi.mock("../FloatingTextSelectionToolbar", () => ({ FloatingTextSelectionToolbar: () => null }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const initial = { root: { type: "root", version: 1, children: [{ type: "paragraph", version: 1,
  children: [{ type: "text", version: 1, text: "Guide", detail: 0, format: 0, mode: "normal", style: "" }],
  direction: null, format: "", indent: 0 }], direction: null, format: "", indent: 0 } };

describe("EditorUploadLifetime concurrent consumers", () => {
  it("releases only the replaced or unmounted editor's URLs while a sibling keeps its image and callback state", async () => {
    const user = userEvent.setup();
    let sequence = 0;
    const create = vi.fn(() => `blob:owned-${++sequence}`);
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL { static createObjectURL = create; static revokeObjectURL = revoke; });
    const leftChange = vi.fn(), rightChange = vi.fn();
    function composition(leftKey: string, showLeft = true) {
      return <Provider>
        {showLeft && <section aria-label="Left consumer"><PageRichTextEditorSection aria-label="Left document"
          lexicalValue={initial} editorKey={leftKey} toolPreset="full" onLexicalChange={leftChange} /></section>}
        <section aria-label="Right consumer"><PageRichTextEditorSection aria-label="Right document"
          lexicalValue={initial} editorKey="right" toolPreset="full" onLexicalChange={rightChange} /></section>
      </Provider>;
    }
    const view = render(composition("left"));
    async function insert(side: "Left" | "Right") {
      const consumer = within(screen.getByRole("region", { name: `${side} consumer` }));
      consumer.getByRole("textbox", { name: `${side} document` }).focus();
      await user.click(consumer.getByRole("button", { name: "Insert", exact: true }));
      await user.click(screen.getByRole("menuitem", { name: "Image", exact: true }));
      await user.upload(screen.getByLabelText("Choose image"), new File(["image"], `${side}.png`, { type: "image/png" }));
      await user.type(screen.getByRole("textbox", { name: "Image description" }), `${side} image`);
      await user.click(within(screen.getByRole("dialog", { name: "Insert Image" })).getByRole("button", { name: "Insert", exact: true }));
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      return (await consumer.findByRole("img", { name: `${side} image` })).getAttribute("src")!;
    }
    const left = await insert("Left"), right = await insert("Right");
    expect(left).not.toBe(right);
    await waitFor(() => expect(JSON.stringify(rightChange.mock.lastCall?.[0])).toContain(right));
    rightChange.mockClear();
    view.rerender(composition("replacement"));
    expect(revoke.mock.calls.filter(([url]) => url === left)).toHaveLength(1);
    expect(revoke).not.toHaveBeenCalledWith(right);
    expect(screen.getByRole("img", { name: "Right image" }).getAttribute("src")).toBe(right);
    expect(rightChange).not.toHaveBeenCalled();
    view.rerender(composition("replacement", false));
    expect(revoke).not.toHaveBeenCalledWith(right);
    expect(screen.getByRole("img", { name: "Right image" }).getAttribute("src")).toBe(right);
    expect(rightChange).not.toHaveBeenCalled();
    view.unmount();
    expect(create).toHaveBeenCalledTimes(4);
    for (const { value: url } of create.mock.results) {
      expect(revoke.mock.calls.filter(([released]) => released === url)).toHaveLength(1);
    }
  });
});
