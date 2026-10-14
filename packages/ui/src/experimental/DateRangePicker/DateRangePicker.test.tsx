// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
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
it("keeps host-owned outside focus after an accepted reset closes a focused calendar", async () => {
  const user = userEvent.setup();
  render(<form data-testid="form">
    <DateRangePicker label="Reporting" defaultValue={initial} presets={[preset]} />
    <button type="button">Outside action</button>
  </form>);
  const outside = screen.getByRole("button", {name:"Outside action"});
  await user.click(screen.getByRole("button", {name:"Choose Reporting"}));
  await user.click(screen.getByRole("button", {name:"March"}));
  act(() => (screen.getByTestId("form") as HTMLFormElement).reset());
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  act(() => outside.focus());
  await act(async () => { await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); });
  expect(document.activeElement).toBe(outside);
});
