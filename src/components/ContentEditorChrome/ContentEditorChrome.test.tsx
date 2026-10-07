// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentEditorChrome } from "./ContentEditorChrome";
afterEach(cleanup);
describe("ContentEditorChrome", () => {
  it("preserves native refs, title and slots, with a labelled action group", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ContentEditorChrome ref={ref} id="chrome" className="host" style={{ margin: 3 }} aria-label="Course document" icon={<span>Document icon</span>} title="Lesson" onTitleSave={vi.fn()} rightSlot={<span>Draft</span>} menuItems={[{ id: "file", label: "File", onPress: vi.fn(), "aria-haspopup": "menu", "aria-expanded": false, "aria-controls": "file-menu" }]} />);
    expect(ref.current?.id).toBe("chrome"); expect(ref.current?.classList.contains("host")).toBe(true);
    expect(ref.current?.getAttribute("aria-label")).toBe("Course document");
    expect(screen.getByRole("heading", { level: 4 }).textContent).toBe("Lesson");
    expect(screen.getByText("Document icon").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Draft")).toBeTruthy(); expect(screen.getByRole("group", { name: "Document actions" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "File" }).getAttribute("aria-controls")).toBe("file-menu");
  });
  it("activates once by pointer, Enter and Space with a native menu anchor without submitting a form", async () => {
    const onPress = vi.fn(); const submit = vi.fn(); const user = userEvent.setup();
    render(<form onSubmit={event => { event.preventDefault(); submit(); }}><ContentEditorChrome icon={null} title="Lesson" titleReadOnly onTitleSave={vi.fn()} menuItems={[{ id: "file", label: "File", onPress }]} /></form>);
    const button = screen.getByRole("button", { name: "File" });
    await user.click(button); expect(onPress).toHaveBeenCalledExactlyOnceWith(button);
    await user.keyboard("{Enter}"); await user.keyboard(" "); expect(onPress).toHaveBeenCalledTimes(3);
    expect(onPress.mock.calls.every(([anchor]) => anchor === button)).toBe(true); expect(submit).not.toHaveBeenCalled();
  });
  it("blocks disabled, loading and unavailable actions while announcing pending state", async () => {
    const press = vi.fn(); const user = userEvent.setup();
    render(<ContentEditorChrome icon={null} title="Lesson" onTitleSave={vi.fn()} menuItems={[{ id: "disabled", label: "Disabled", onPress: press, disabled: true }, { id: "loading", label: "Loading", onPress: press, loading: true }, { id: "unavailable", label: "Unavailable" }]} />);
    for (const name of ["Disabled", "Loading", "Unavailable"]) { const button = screen.getByRole("button", { name }); await user.click(button); button.focus(); await user.keyboard("{Enter} "); }
    expect(press).not.toHaveBeenCalled(); expect(screen.getByRole("progressbar", { name: "Pending" })).toBeTruthy();
  });
  it("composes the real title editor, saving once and restoring keyboard focus", async () => {
    const save = vi.fn(); const user = userEvent.setup();
    function Host() { const [title, setTitle] = useState("Lesson"); return <ContentEditorChrome icon={null} title={title} onTitleSave={next => { save(next); setTitle(next); }} menuItems={[]} />; }
    render(<Host />); await user.tab(); await user.keyboard("{Enter}");
    const input = screen.getByRole("textbox", { name: "Document title" }); await user.clear(input); await user.type(input, "Updated{Enter}");
    await waitFor(() => expect(screen.getByRole("heading").textContent).toBe("Updated")); expect(save).toHaveBeenCalledExactlyOnceWith("Updated");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit title" })));
    expect(screen.queryByRole("group")).toBeNull();
  });
  it("supports a read-only title and no icon or action row", async () => {
    render(<ContentEditorChrome icon={null} title="Lesson" titleReadOnly onTitleSave={vi.fn()} menuItems={[]} />);
    expect(screen.queryByRole("group")).toBeNull(); expect(screen.getByRole("button", { name: "Edit title" }).hasAttribute("disabled")).toBe(true);
  });
});
