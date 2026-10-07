// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./DateRangePicker";
afterEach(cleanup);
const initial = { start: "2024-02-01", end: "2024-02-29" };
const preset = { id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } };
it("cancels drafts, applies once, returns focus and resets native defaults", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateRangePicker label="Reporting" name="range" defaultValue={initial} presets={[preset]} onValueChange={change} /><button type="reset">Reset</button></form>);
  const trigger = screen.getByRole("button", { name: "Choose Reporting" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "March" })); await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(change).not.toHaveBeenCalled(); await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.click(trigger); expect(screen.getByRole("status").textContent).toContain(initial.start);
  await user.click(screen.getByRole("button", { name: "March" })); await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(preset.value);
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("range.start")).toBe(preset.value.start);
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("range.start")).toBe(initial.start);
});
it("respects a host-prevented reset of uncontrolled committed state", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form" onReset={event => event.preventDefault()}><DateRangePicker label="Reporting" defaultValue={initial} presets={[preset]} name="range" onValueChange={change} /><button type="reset">Reset</button></form>);
  await user.click(screen.getByRole("button", { name: "Choose Reporting" })); await user.click(screen.getByRole("button", { name: "March" })); await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(preset.value);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("range.start")).toBe(preset.value.start);
});
