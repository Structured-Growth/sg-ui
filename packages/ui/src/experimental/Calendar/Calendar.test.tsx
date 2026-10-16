// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./Calendar";
import { DatePicker } from "../DatePicker/DatePicker";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
it("shares selection across three consecutive calendar months", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Calendar label="Quarter" months={3} defaultFocusedDate="2026-10-14" onValueChange={change}/>);
  expect(screen.getAllByRole("grid")).toHaveLength(3);
  await user.click(screen.getByRole("button",{name:"Tuesday, November 10, 2026"}));
  expect(change).toHaveBeenCalledExactlyOnceWith("2026-11-10");
});
it("keeps focus and selected date distinct and commits keyboard selection", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const focus = vi.fn();
  render(<Calendar label="Course date" defaultFocusedDate="2024-02-28" onValueChange={change} onFocusedDateChange={focus} />);
  await user.click(screen.getByRole("button", { name: "Wednesday, February 28, 2024" }));
  change.mockClear(); await user.keyboard("{ArrowRight}"); expect(change).not.toHaveBeenCalled();
  expect(focus).toHaveBeenLastCalledWith("2024-02-29");
  await user.keyboard("{Enter}"); expect(change).toHaveBeenLastCalledWith("2024-02-29");
});
it("proves arbitrary multiple dates using the installed collection contract", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Calendar label="Course dates" selection="multiple" defaultFocusedDate="2024-02-01" onValueChange={change} />);
  await user.click(screen.getByRole("button", { name: "Thursday, February 1, 2024" }));
  await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
  expect(change).toHaveBeenLastCalledWith(["2024-02-01", "2024-02-29"]);
  await user.click(screen.getByRole("button", { name: /Thursday, February 1, 2024 selected/ }));
  expect(change).toHaveBeenLastCalledWith(["2024-02-29"]);
});
it("exposes unavailable reasons to keyboard users and respects host RTL", async () => {
  const user = userEvent.setup(); const focus = vi.fn(); const change = vi.fn();
  render(<SGTranslationProvider value={{ locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}><Provider>
    <Calendar label="Dates" defaultFocusedDate="2024-02-28" onFocusedDateChange={focus} onValueChange={change}
      unavailable={[{ date: "2024-02-29", reason: "No capacity" }]} /></Provider></SGTranslationProvider>);
  const focused = screen.getAllByRole("button").find(button => button.tabIndex === 0 && button.closest('[role="grid"]'))!;
  await user.click(focused); await user.keyboard("{ArrowLeft}{Enter}");
  expect(focus).toHaveBeenLastCalledWith("2024-02-29"); expect(change).toHaveBeenCalledTimes(1);
  await user.click(screen.getByText("Unavailable dates")); expect(screen.getByText("2024-02-29: No capacity")).toBeTruthy();
});

function description(button: HTMLElement) {
  return (button.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)
    .map(id => document.getElementById(id)?.textContent).join(" ");
}

it("describes callback and static restrictions while preserving date focus and selection semantics", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const focus = vi.fn();
  render(<Calendar label="Appointments" defaultFocusedDate="2026-10-14" defaultValue="2026-10-14"
    onValueChange={change} onFocusedDateChange={focus}
    unavailable={[{ date: "2026-10-15", reason: "Office closed" }]}
    getDateUnavailableReason={date => date === "2026-10-16" ? "No appointment capacity" : undefined}
    renderDayContent={() => "Decorative annotation"} />);
  const selected = screen.getByRole("button", { name: /Wednesday, October 14, 2026 selected/ });
  expect(selected.closest('[role="gridcell"]')?.getAttribute("aria-selected")).toBe("true");
  await user.click(selected); change.mockClear(); await user.keyboard("{ArrowRight}");
  const staticDay = screen.getByRole("button", { name: "Thursday, October 15, 2026" });
  expect(document.activeElement).toBe(staticDay);
  expect(description(staticDay)).toBe("Office closed");
  await user.keyboard("{ArrowRight}{Enter}");
  const callbackDay = screen.getByRole("button", { name: /Friday, October 16, 2026/ });
  expect(document.activeElement).toBe(callbackDay);
  expect(callbackDay.getAttribute("aria-disabled")).toBe("true");
  expect(description(callbackDay)).toBe("No appointment capacity");
  expect(focus).toHaveBeenLastCalledWith("2026-10-16");
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByText("Unavailable dates"));
  expect(screen.getByText("2026-10-15: Office closed").closest("details")?.open).toBe(true);
  expect(screen.getByText("2026-10-16: No appointment capacity")).toBeTruthy();
});

it("refreshes callback/selection replacements and removes only owned stale descriptions", () => {
  const first = (date: string) => date === "2026-10-16" ? "Old capacity" : undefined;
  const second = (date: string) => date === "2026-10-16" ? "New capacity" : undefined;
  const { rerender } = render(<><p id="host-description">Host context</p><Calendar label="Appointments" value="2026-10-14"
    defaultFocusedDate="2026-10-14" getDateUnavailableReason={first} /></>);
  const day = screen.getByRole("button", { name: /Friday, October 16, 2026/ });
  const ownedId = day.getAttribute("aria-describedby")!;
  day.setAttribute("aria-describedby", `${ownedId} host-description`);
  rerender(<><p id="host-description">Host context</p><Calendar label="Appointments" value="2026-10-15"
    defaultFocusedDate="2026-10-14" getDateUnavailableReason={second} /></>);
  expect(description(day)).toBe("Host context New capacity");
  expect(screen.queryByText("Old capacity")).toBeNull();
  expect(screen.getByRole("button", { name: /Thursday, October 15, 2026 selected/ })).toBeTruthy();
  rerender(<><p id="host-description">Host context</p><Calendar label="Appointments" value="2026-10-16" defaultFocusedDate="2026-10-14" /></>);
  expect(day.getAttribute("aria-describedby")).toBe("host-description");
  expect(day.getAttribute("aria-disabled")).toBeNull();
  expect(screen.queryByText("New capacity")).toBeNull();
  expect(screen.queryByText("Unavailable dates")).toBeNull();
  expect(screen.getByRole("button", { name: /Friday, October 16, 2026 selected/ })).toBe(day);
});

it.each(["disabled", "readOnly"] as const)("keeps reasons discoverable without selection in %s calendars", async mode => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Calendar label="Appointments" {...{ [mode]: true }} defaultValue="2026-10-14" defaultFocusedDate="2026-10-14"
    onValueChange={change} getDateUnavailableReason={date => date === "2026-10-16" ? "No capacity" : undefined} />);
  const day = screen.getByRole("button", { name: /Friday, October 16, 2026/ });
  expect(day.getAttribute("aria-disabled")).toBe("true");
  expect(description(day)).toBe("No capacity");
  const selected = screen.getByRole("button", { name: /Wednesday, October 14, 2026/ });
  const selectionBefore = selected.closest('[role="gridcell"]')?.getAttribute("aria-selected");
  expect(screen.getByRole("grid").getAttribute(mode === "disabled" ? "aria-disabled" : "aria-readonly")).toBe("true");
  await user.click(day);
  await user.click(screen.getByText("Unavailable dates"));
  expect(screen.getByText("2026-10-16: No capacity").closest("details")?.open).toBe(true);
  expect(change).not.toHaveBeenCalled();
  expect(selected.closest('[role="gridcell"]')?.getAttribute("aria-selected")).toBe(selectionBefore);
});

it("updates the callback disclosure on month navigation and removes replaced static restrictions", async () => {
  const user = userEvent.setup();
  const reason = (date: string) => date === "2026-11-10" ? "November capacity" : undefined;
  const { rerender } = render(<Calendar label="Appointments" defaultFocusedDate="2026-10-14"
    unavailable={[{ date: "2026-10-15", reason: "October closure" }]} getDateUnavailableReason={reason} />);
  const oldDay = screen.getByRole("button", { name: "Thursday, October 15, 2026" });
  expect(description(oldDay)).toBe("October closure");
  rerender(<Calendar label="Appointments" defaultFocusedDate="2026-10-14" getDateUnavailableReason={reason} />);
  expect(oldDay.getAttribute("aria-describedby")).toBeNull();
  expect(screen.queryByText("Unavailable dates")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Next month" }));
  await user.click(screen.getByText("Unavailable dates"));
  expect(screen.getByText("2026-11-10: November capacity")).toBeTruthy();
  expect(description(screen.getByRole("button", { name: "Tuesday, November 10, 2026" }))).toBe("November capacity");
});

it("exposes callback reasons automatically inside the composed DatePicker", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DatePicker label="Appointment" defaultValue="2026-10-14" onValueChange={change}
    getDateUnavailableReason={date => date === "2026-10-16" ? "No appointment capacity" : undefined} />);
  await user.click(screen.getByRole("button", { name: "Choose Appointment" }));
  const day = screen.getByRole("button", { name: /Friday, October 16, 2026/ });
  expect(description(day)).toBe("No appointment capacity");
  await user.click(day);
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByText("Unavailable dates"));
  expect(screen.getByText("2026-10-16: No appointment capacity").closest("details")?.open).toBe(true);
});
