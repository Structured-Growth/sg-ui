// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Switch } from "./Switch";
afterEach(cleanup);
it("toggles once with Space and serializes/reset its native checked value", async () => {
 const change = vi.fn(); const user = userEvent.setup();
 const { container } = render(<form><Switch label="Notifications" name="notify" value="yes" description="Course updates" onCheckedChange={change} /><button type="reset">Reset</button></form>);
 const control = screen.getByRole("switch", { name: "Notifications" }); expect(control.getAttribute("aria-describedby")).toBeTruthy();
 await user.tab(); await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith(true);
 expect(new FormData(container.querySelector('form')!).get("notify")).toBe("yes");
 await user.click(screen.getByRole("button")); expect((control as HTMLInputElement).checked).toBe(false);
});
it("keeps controlled values under host authority and prevents disabled/read-only changes", async () => {
 const change = vi.fn(); const user = userEvent.setup(); const { rerender } = render(<Switch label="Notify" checked onCheckedChange={change} />);
 const control = screen.getByRole("switch"); await user.click(control); expect(change).toHaveBeenCalledWith(false); expect((control as HTMLInputElement).checked).toBe(true);
 change.mockClear(); rerender(<Switch label="Notify" checked readOnly onCheckedChange={change} />); await user.click(control); await user.keyboard(" ");
 rerender(<Switch label="Notify" disabled onCheckedChange={change} />); await user.click(control); expect(change).not.toHaveBeenCalled();
});
