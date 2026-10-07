// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./DatePicker";
afterEach(cleanup);
it("synchronizes calendar and field, serializes the date and restores trigger focus", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DatePicker label="Course date" defaultValue="2024-02-28" name="date" onValueChange={change} /><button type="reset">Reset</button></form>);
  const trigger = screen.getByRole("button", { name: "Choose Course date" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("2024-02-29"); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("2024-02-29");
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("date")).toBe("2024-02-28");
});
it("closes on Escape without changing selection and prevents opening read-only fields", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<DatePicker label="Course date" value="2024-02-28" onValueChange={change} />);
  await user.click(screen.getByRole("button", { name: "Choose Course date" })); await user.keyboard("{Escape}"); expect(change).not.toHaveBeenCalled();
  rerender(<DatePicker label="Course date" value="2024-02-28" readOnly />);
  expect((screen.getByRole("button", { name: "Choose Course date" }) as HTMLButtonElement).disabled).toBe(true);
});
