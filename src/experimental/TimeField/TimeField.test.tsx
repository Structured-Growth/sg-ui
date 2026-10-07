// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeField } from "./TimeField";
afterEach(cleanup);
it("edits clock segments, serializes seconds and resets the uncontrolled value", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><TimeField label="Start time" defaultValue="23:59:00" hourCycle={24} name="time" onValueChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByRole("spinbutton", { name: /second/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("23:59:01");
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("time")).toBe("23:59:01");
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("time")).toBe("23:59:00");
});
it("preserves controlled values, descriptions/errors and disabled form semantics", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form data-testid="form"><TimeField label="Start time" value="09:00:00" name="time" onValueChange={change} invalid errorMessage="Outside hours" description="Local clock time" /></form>);
  await user.click(screen.getByRole("spinbutton", { name: /minute/ })); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("09:01:00");
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("time")).toBe("09:00:00");
  expect(screen.getByText("Outside hours")).toBeTruthy();
  rerender(<form data-testid="form"><TimeField label="Start time" value="09:00:00" name="time" disabled /></form>);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).has("time")).toBe(false);
});
it("marks invalid external time strings without throwing or reporting a valid value", () => {
 render(<TimeField label="Imported time" value="25:90:00" />);
 expect(screen.getByText("Enter a valid time.")).toBeDefined();
});
