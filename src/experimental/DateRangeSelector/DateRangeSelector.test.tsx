// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangeSelector } from "./DateRangeSelector";
import { isDateOnly, isDateRangeAllowed } from "./date-contract";
afterEach(cleanup);
const initial = { start: "2024-02-28", end: "2024-02-29" };
const preset = { id: "march", label: "March", value: { start: "2024-03-01", end: "2024-03-31" } };
it("validates leap years, inclusive boundaries and unavailable dates without timezone conversion", () => {
  expect(isDateOnly("2024-02-29")).toBe(true); expect(isDateOnly("2023-02-29")).toBe(false);
  expect(isDateOnly("2024-2-29")).toBe(false); expect(isDateOnly("2024-02-29T00:00:00Z")).toBe(false);
  expect(isDateRangeAllowed(initial, { min: initial.start, max: initial.end })).toBe(true);
  expect(isDateRangeAllowed(initial, { unavailable: [{ date: initial.end, reason: "Full" }] })).toBe(false);
  expect(isDateRangeAllowed({ start: initial.end, end: initial.start })).toBe(false);
});
it("keeps presets in a draft until Apply and Cancel restores committed values", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const cancel = vi.fn();
  render(<form data-testid="form"><DateRangeSelector label="Reporting dates" defaultValue={initial} presets={[preset]} name="range" onValueChange={change} onCancel={cancel} /></form>);
  expect(screen.getAllByRole("grid")).toHaveLength(2);
  await user.click(screen.getByRole("button", { name: "March" }));
  expect(change).not.toHaveBeenCalled();
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("range.start")).toBe(initial.start);
  await user.click(screen.getByRole("button", { name: "Cancel" })); expect(cancel).toHaveBeenCalledOnce();
  expect(screen.getByRole("status").textContent).toContain(initial.start);
  await user.click(screen.getByRole("button", { name: "March" }));
  await user.click(screen.getByRole("button", { name: "Apply" })); expect(change).toHaveBeenLastCalledWith(preset.value);
  expect(new FormData(form).get("range.end")).toBe(preset.value.end);
});
it("disables presets crossing unavailable dates, announces explanations and enforces required selection", async () => {
  const user = userEvent.setup();
  render(<DateRangeSelector label="Booking dates" defaultFocusedDate="2024-03-01" required presets={[preset]}
    unavailable={[{ date: "2024-03-15", reason: "Fully booked" }]} />);
  expect((screen.getByRole("button", { name: "March" }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByText("Unavailable dates")); expect(screen.getByText("2024-03-15: Fully booked")).toBeTruthy();
  const unavailable = screen.getAllByRole("button").find(button => button.getAttribute("aria-label")?.includes("March 15"));
  expect(unavailable?.getAttribute("aria-disabled")).toBe("true");
});
it("requests a controlled commit once without changing committed form values", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form data-testid="form"><DateRangeSelector label="Dates" value={initial} presets={[preset]} name="dates" onValueChange={change} /></form>);
  await user.click(screen.getByRole("button", { name: "March" })); await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(preset.value);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("dates.start")).toBe(initial.start);
  rerender(<form data-testid="form"><DateRangeSelector label="Dates" value={preset.value} name="dates" onValueChange={change} /></form>);
  expect(screen.getByRole("status").textContent).toContain(preset.value.start);
});
it("exposes visible descriptions for available and disabled presets without changing their names", () => {
  render(<DateRangeSelector label="Dates" presets={[
    { ...preset, description: "Inclusive March dates" },
    { id: "early", label: "Early March", description: "Before capacity closes", value: { start: "2024-03-01", end: "2024-03-14" } },
  ]} unavailable={[{ date: "2024-03-15", reason: "Fully booked" }]} />);
  for (const [name, description] of [["March", "Inclusive March dates"], ["Early March", "Before capacity closes"]]) {
    const button = screen.getByRole("button", { name, exact: true });
    const text = screen.getByText(description);
    expect(button.getAttribute("aria-describedby")).toBe(text.id);
    expect(text.closest("[hidden]")).toBeNull();
    expect(button.hasAttribute("title")).toBe(false);
  }
  expect((screen.getByRole("button", { name: "March", exact: true }) as HTMLButtonElement).disabled).toBe(true);
});
it("preserves full date labels and describes keyboard-focused unavailable days without editing the draft", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DateRangeSelector label="Dates" months={1} defaultFocusedDate="2024-03-14"
    unavailable={[{ date: "2024-03-15", reason: "Fully booked" }]} onValueChange={change} />);
  const date = screen.getByRole("button", { name: /Thursday, March 14, 2024/ });
  date.focus(); await user.keyboard("{ArrowRight}");
  const unavailableDate = screen.getByRole("button", { name: /Friday, March 15, 2024/ });
  expect(document.activeElement).toBe(unavailableDate);
  const reasonId = unavailableDate.getAttribute("aria-describedby");
  expect(reasonId).toBeTruthy();
  expect(document.getElementById(reasonId!)?.textContent).toBe("Fully booked");
  expect(screen.getByText("2024-03-15: Fully booked", { selector: "p" })).toBeTruthy();
  expect(screen.getByText("No dates selected")).toBeTruthy();
  await user.keyboard("{Enter}"); expect(change).not.toHaveBeenCalled();
  await user.keyboard("{ArrowRight}");
  expect(screen.queryByText("2024-03-15: Fully booked", { selector: "p" })).toBeNull();
});
it("updates and removes host availability descriptions while preserving the date button", async () => {
  const { rerender } = render(<DateRangeSelector label="Dates" months={1} defaultFocusedDate="2024-03-15"
    unavailable={[{ date: "2024-03-15", reason: "Fully booked" }]} />);
  const date = screen.getByRole("button", { name: /Friday, March 15, 2024/ });
  const reasonId = date.getAttribute("aria-describedby")!;
  expect(document.getElementById(reasonId)?.textContent).toBe("Fully booked");
  rerender(<DateRangeSelector label="Dates" months={1} defaultFocusedDate="2024-03-15"
    unavailable={[{ date: "2024-03-15", reason: "Maintenance" }]} />);
  expect(screen.getByRole("button", { name: /Friday, March 15, 2024/ })).toBe(date);
  expect(document.getElementById(reasonId)?.textContent).toBe("Maintenance");
  expect(date.getAttribute("aria-describedby")).toBe(reasonId);
  rerender(<DateRangeSelector label="Dates" months={1} defaultFocusedDate="2024-03-15" />);
  expect(date.hasAttribute("aria-describedby")).toBe(false);
  expect(document.getElementById(reasonId)).toBeNull();
  expect(date.hasAttribute("aria-disabled")).toBe(false);
});
