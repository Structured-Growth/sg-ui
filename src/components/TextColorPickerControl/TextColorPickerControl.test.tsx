// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextColorPickerControl } from "./TextColorPickerControl";
import { ThemeScope } from "../../foundation/ThemeScope";
afterEach(cleanup);

describe("owned text color picker", () => {
  it("validates hex, associates errors, normalizes Enter and avoids a second blur commit", async () => {
    const user = userEvent.setup(); const onChange = vi.fn();
    render(<TextColorPickerControl value="#ffffff" onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: "Text color" });
    await user.click(trigger);
    const field = await screen.findByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "invalid{Enter}");
    expect(onChange).not.toHaveBeenCalled(); expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(field.getAttribute("aria-describedby")!)?.textContent).toContain("six-digit hex");
    await user.clear(field); await user.type(field, " #AbCdEf {Enter}");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("#abcdef");
    await user.tab(); expect(onChange).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it("commits owned swatches and native colors, and exposes clear and background reset", async () => {
    const user = userEvent.setup(); const onChange = vi.fn();
    render(<ThemeScope theme="dark"><TextColorPickerControl mode="background" onChange={onChange} /></ThemeScope>);
    await user.click(screen.getByRole("button", { name: "Background color" }));
    const field = await screen.findByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "invalid");
    await user.click(screen.getByRole("button", { name: "Primary", exact: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(field.getAttribute("aria-invalid")).not.toBe("true");
    expect(onChange).toHaveBeenLastCalledWith("var(--sgui-action)");
    expect(screen.getByRole("button", { name: "Primary", exact: true }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("dialog").closest('[data-sgui-scope]')?.getAttribute("data-sgui-theme")).toBe("dark");
    fireEvent.change(screen.getByLabelText("Custom color"), { target: { value: "#123456" } });
    expect(onChange).toHaveBeenLastCalledWith("#123456");
    await user.click(screen.getByRole("button", { name: "Clear" })); expect(onChange).toHaveBeenLastCalledWith("");
    await user.click(screen.getByRole("button", { name: "Reset" })); expect(onChange).toHaveBeenLastCalledWith("#ffffff");
  });
  it("reloads the host value on reopen and responds to external value changes", async () => {
    const user = userEvent.setup(); const onChange = vi.fn();
    const { rerender } = render(<TextColorPickerControl value="#123456" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Text color" }));
    await user.clear(await screen.findByRole("textbox")); await user.type(screen.getByRole("textbox"), "bad");
    await user.keyboard("{Escape}"); await user.click(screen.getByRole("button", { name: "Text color" }));
    expect((await screen.findByRole("textbox") as HTMLInputElement).value).toBe("#123456");
    rerender(<TextColorPickerControl value="#abcdef" onChange={onChange} />);
    await waitFor(() => expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("#abcdef"));
    expect(onChange).not.toHaveBeenCalled();
  });
  it("keeps color actions out of host submission and ignores composing Enter", async () => {
    const user = userEvent.setup(); const onChange = vi.fn(); const onSubmit = vi.fn();
    render(<form onSubmit={onSubmit}><TextColorPickerControl onChange={onChange} /><button type="submit">Save course</button></form>);
    await user.click(screen.getByRole("button", { name: "Text color" }));
    const field = await screen.findByRole("textbox", { name: "Hex color" });
    fireEvent.change(field, { target: { value: "#ABCDEF" } });
    expect(fireEvent.keyDown(field, { key: "Enter", isComposing: true })).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard("{Enter}"); expect(onChange).toHaveBeenCalledExactlyOnceWith("#abcdef");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onChange).toHaveBeenLastCalledWith("#000000"); expect(onSubmit).not.toHaveBeenCalled();
  });
  it("disables activation without a callback or with disabled", () => {
    const { rerender } = render(<TextColorPickerControl />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    rerender(<TextColorPickerControl disabled onChange={vi.fn()} />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
  it.each(["disabled", "callback removed"])("discards a pending valid draft when the host becomes %s", async restriction => {
    const user = userEvent.setup(); const onChange = vi.fn();
    const { rerender } = render(<TextColorPickerControl value="#123456" onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: "Text color" });
    await user.click(trigger);
    const field = await screen.findByRole("textbox", { name: "Hex color" });
    await user.clear(field); await user.type(field, "#abcdef");
    rerender(<TextColorPickerControl value="#123456" disabled={restriction === "disabled"}
      onChange={restriction === "callback removed" ? undefined : onChange} />);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onChange).not.toHaveBeenCalled();
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
    rerender(<TextColorPickerControl value="#123456" onChange={onChange} />);
    await user.click(trigger);
    expect((await screen.findByRole("textbox", { name: "Hex color" }) as HTMLInputElement).value).toBe("#123456");
    expect(onChange).not.toHaveBeenCalled();
  });
});
