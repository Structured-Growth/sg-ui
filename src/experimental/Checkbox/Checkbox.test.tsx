// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
afterEach(cleanup);
it("toggles by Space, submits checked values and restores native defaults on reset", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><Checkbox label="Available" name="available" value="yes" onCheckedChange={change} /><button type="reset">Reset</button></form>);
  await user.tab(); await user.keyboard(" "); expect(change).toHaveBeenCalledExactlyOnceWith(true);
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("available")).toBe("yes");
  await user.click(screen.getByRole("button")); expect(new FormData(form).has("available")).toBe(false);
});
it("exposes mixed state and leaves controlled state with the host", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Checkbox label="All rows" checked={false} mixed onCheckedChange={change} />);
  const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true);
  await user.click(checkbox); expect(change).toHaveBeenCalledExactlyOnceWith(true); expect(checkbox.checked).toBe(false);
});
it("prevents disabled and read-only edits", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<Checkbox label="Available" disabled onCheckedChange={change} />);
  await user.click(screen.getByRole("checkbox")); expect(change).not.toHaveBeenCalled();
  rerender(<Checkbox label="Available" readOnly onCheckedChange={change} />);
  await user.click(screen.getByRole("checkbox")); expect(change).not.toHaveBeenCalled();
});
