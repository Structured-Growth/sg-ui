// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
it("does not request changes through the label of a native disabled fieldset", async () => {
 const change = vi.fn(); const user = userEvent.setup();
 render(<fieldset disabled><Switch label="Fieldset updates" defaultChecked onCheckedChange={change} /></fieldset>);
 await user.click(screen.getByText("Fieldset updates"));
 expect(change).not.toHaveBeenCalled();
 expect((screen.getByRole("switch") as HTMLInputElement).checked).toBe(true);
});
it("preserves independent names and a controlled rejection through prevented reset", async () => {
 const change = vi.fn(); const user = userEvent.setup();
 const { container } = render(<form onReset={event => event.preventDefault()}>
  <Switch label="Email updates" name="emailUpdates" value="email" defaultChecked />
  <Switch label="SMS updates" name="smsUpdates" value="sms" checked onCheckedChange={change} />
  <button type="reset">Reset choices</button>
 </form>);
 await user.click(screen.getByText("Email updates"));
 await user.click(screen.getByText("SMS updates"));
 await user.click(screen.getByRole("button"));
 expect(change).toHaveBeenCalledExactlyOnceWith(false);
 expect(Object.fromEntries(new FormData(container.querySelector("form")!))).toEqual({ smsUpdates: "sms" });
 expect((screen.getByRole("switch", { name: "Email updates" }) as HTMLInputElement).checked).toBe(false);
});
it("restores unchecked and checked defaults without making host editing requests", async () => {
 const change = vi.fn(); const user = userEvent.setup();
 render(<form>
  <Switch label="Initially on" defaultChecked onCheckedChange={change} />
  <Switch label="Initially off" onCheckedChange={change} />
  <button type="reset">Reset defaults</button>
 </form>);
 await user.click(screen.getByText("Initially on"));
 await user.click(screen.getByText("Initially off"));
 change.mockClear();
 await user.click(screen.getByRole("button"));
 await waitFor(() => expect((screen.getByRole("switch", { name: "Initially on" }) as HTMLInputElement).checked).toBe(true));
 expect((screen.getByRole("switch", { name: "Initially off" }) as HTMLInputElement).checked).toBe(false);
 expect(change).not.toHaveBeenCalled();
});
