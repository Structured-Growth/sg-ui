// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RichTextFormattingToolbar, type RichTextFormattingToolbarProps } from "./index";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);

describe("RichTextFormattingToolbar next100 regressions", () => {
  it("follows host history availability and pressed-state updates without inventing formatting state", async () => {
    const user = userEvent.setup();
    const undo = vi.fn(); const redo = vi.fn(); const bold = vi.fn();
    const toolbar = (props: RichTextFormattingToolbarProps) => <Provider><RichTextFormattingToolbar {...props} /></Provider>;
    const { rerender } = render(toolbar({ onUndo: undo, onBold: bold, boldActive: "mixed" }));
    expect((screen.getByRole("button", { name: "Redo" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Undo" }));
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(bold).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("mixed");
    rerender(toolbar({ onRedo: redo, onBold: bold, boldActive: false }));
    expect((screen.getByRole("button", { name: "Undo" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Undo" }));
    await user.click(screen.getByRole("button", { name: "Redo" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("cancels an unmounted instance's queued choice while a Strict Mode sibling keeps its own value and callback", async () => {
    const user = userEvent.setup(); const removed = vi.fn(); const surviving = vi.fn();
    const first = render(<StrictMode><Provider><RichTextFormattingToolbar aria-label="First editor" onHeadingChange={removed} /></Provider></StrictMode>);
    render(<StrictMode><Provider><RichTextFormattingToolbar aria-label="Second editor" headingValue="Heading 2" onHeadingChange={surviving} /></Provider></StrictMode>);
    await user.click(within(screen.getByRole("group", { name: "First editor" })).getByRole("button", { name: /Text style heading/ }));
    fireEvent.click(screen.getByRole("option", { name: "Heading 3" }));
    expect(removed).not.toHaveBeenCalled();
    first.unmount();
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
    expect(removed).not.toHaveBeenCalled();
    expect(surviving).not.toHaveBeenCalled();
    const trigger = within(screen.getByRole("group", { name: "Second editor" })).getByRole("button", { name: /Text style heading/ });
    expect(trigger.textContent).toContain("Heading 2");
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Heading 4" }));
    expect(surviving).toHaveBeenCalledExactlyOnceWith("Heading 4");
    expect(trigger.textContent).toContain("Heading 2");
    expect(removed).not.toHaveBeenCalled();
  });
});
