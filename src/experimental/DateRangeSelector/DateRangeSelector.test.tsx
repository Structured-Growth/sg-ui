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
it("previews a keyboard range across leap day without applying the previous draft", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateRangeSelector label="Dates" months={2} defaultValue={initial}
    defaultFocusedDate="2024-02-28" name="dates" onValueChange={change} /></form>);
  screen.getAllByRole("button", { name: /Wednesday, February 28, 2024/ }).find(button => !button.hasAttribute("data-outside-month"))!.focus();
  await user.keyboard("{Enter}{ArrowRight}");
  expect(document.activeElement?.getAttribute("aria-label")).toContain("March 1, 2024");
  expect(screen.getByText("Range preview: 2024-02-28 – 2024-03-01. Choose an end date to finish.")).toBeTruthy();
  expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("dates.end")).toBe(initial.end);
  await user.keyboard("{Enter}");
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(change).toHaveBeenCalledExactlyOnceWith({ start: "2024-02-28", end: "2024-03-01" });
});
it("cancels an anchor and starts a fresh range rather than retaining an unfinished selection", async () => {
  const user = userEvent.setup();
  render(<DateRangeSelector label="Dates" months={1} defaultValue={initial} presets={[preset]} />);
  screen.getAllByRole("button", { name: /Wednesday, February 28, 2024/ }).find(button => !button.hasAttribute("data-outside-month"))!.focus();
  await user.keyboard("{Enter}{ArrowLeft}{ArrowLeft}");
  expect(screen.getByText(/Range preview: 2024-02-27/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("2024-02-28 – 2024-02-29");
  screen.getAllByRole("button", { name: /Wednesday, February 28, 2024/ }).find(button => !button.hasAttribute("data-outside-month"))!.focus();
  await user.keyboard("{Enter}");
  await user.click(screen.getByRole("button", { name: "March", exact: true }));
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(false);
});
it("validates century leap and month/year boundaries with inclusive unavailable interior days", () => {
  expect(isDateOnly("2000-02-29")).toBe(true);
  expect(isDateOnly("1900-02-29")).toBe(false);
  expect(isDateOnly("2024-04-31")).toBe(false);
  const range = { start: "2023-12-31", end: "2024-01-02" };
  expect(isDateRangeAllowed(range, { min: range.start, max: range.end })).toBe(true);
  expect(isDateRangeAllowed(range, { unavailable: [{ date: "2024-01-01", reason: "Closed" }] })).toBe(false);
  expect(isDateRangeAllowed(range, { min: "2024-01-01" })).toBe(false);
});
it("resets standalone committed values, drafts and pending anchors through the native form", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateRangeSelector label="Dates" months={1} defaultValue={initial} presets={[preset]} name="dates" onValueChange={change} /><button type="reset">Reset dates</button></form>);
  await user.click(screen.getByRole("button", { name: "March", exact: true }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  await user.click(screen.getByRole("button", { name: "Reset dates" }));
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("dates.start")).toBe(initial.start);
  expect(screen.getByRole("status").textContent).toContain("2024-02-28 – 2024-02-29");
  screen.getByRole("button", { name: /Wednesday, February 28, 2024/ }).focus();
  await user.keyboard("{Enter}");
  expect(screen.getByText(/Range preview:/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Reset dates" }));
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect(change).toHaveBeenCalledTimes(1);
});
it("retains a draft on prevented native reset and clears the anchor on a changed host value", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<form onReset={event => event.preventDefault()}><DateRangeSelector label="Dates" value={initial} months={1} presets={[preset]} /><button type="reset">Reset dates</button></form>);
  await user.click(screen.getByRole("button", { name: "March", exact: true }));
  await user.click(screen.getByRole("button", { name: "Reset dates" }));
  expect(screen.getByRole("status").textContent).toContain("2024-03-01 – 2024-03-31");
  expect(screen.getAllByRole("spinbutton", { name: /day/ })[1].getAttribute("aria-valuenow")).toBe("31");
  await user.click(screen.getByRole("button", { name: "Next month", exact: true }));
  screen.getByRole("button", { name: /Friday, March 1, 2024/ }).focus();
  await user.keyboard("{Enter}");
  expect(screen.getByText(/Range preview:/)).toBeTruthy();
  rerender(<form><DateRangeSelector label="Dates" value={{ ...initial }} months={1} /></form>);
  expect(screen.getByText(/Range preview:/)).toBeTruthy();
  expect(screen.getByText("2024-03-01 – 2024-03-31", { selector: "p" })).toBeTruthy();
  rerender(<form><DateRangeSelector label="Dates" value={{ start: "2024-04-01", end: "2024-04-02" }} months={1} /></form>);
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("2024-04-01 – 2024-04-02");
});
it("synchronizes segmented edits and refuses reversed drafts", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<DateRangeSelector label="Dates" months={1} defaultValue={initial}
    onValueChange={change} />);
  const days = screen.getAllByRole("spinbutton", { name: /day/ });
  await user.click(days[1]); await user.keyboard("27");
  expect(screen.getByRole("status").textContent).toContain("2024-02-28 – 2024-02-27");
  expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
  expect(change).not.toHaveBeenCalled();
});
it("cancels an unfinished range on leaving the calendar without inventing an endpoint", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<><DateRangeSelector label="Dates" months={2} defaultValue={initial} onValueChange={change} /><button>Outside</button></>);
  screen.getAllByRole("button", { name: /Wednesday, February 28, 2024/ }).find(button => !button.hasAttribute("data-outside-month"))!.focus();
  await user.keyboard("{Enter}{ArrowRight}");
  expect(screen.getByText(/Range preview: 2024-02-28 – 2024-03-01/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Outside", exact: true }));
  expect(screen.queryByText(/Range preview:/)).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("2024-02-28 – 2024-02-29");
  expect(change).not.toHaveBeenCalled();
});
it("associates only the focused preview endpoint, keeping anchor, reverse preview and committed draft distinct", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { container } = render(<form data-testid="form"><DateRangeSelector label="Dates" months={2} defaultValue={initial}
    defaultFocusedDate={initial.start} name="dates" onValueChange={change} /></form>);
  const day = (name: RegExp) => screen.getAllByRole("button", { name }).find(button => !button.hasAttribute("data-outside-month"))!;
  const descriptions = (button: HTMLElement) => (button.getAttribute("aria-describedby") ?? "").split(/\s+/).map(id => document.getElementById(id)?.textContent).filter(Boolean).join(" ");
  const anchor = day(/Wednesday, February 28, 2024/);
  anchor.focus(); await user.keyboard("{Enter}{ArrowLeft}{ArrowLeft}");
  const endpoint = day(/Tuesday, February 27, 2024/);
  expect(document.activeElement).toBe(endpoint);
  expect(descriptions(endpoint)).toContain("Range preview: 2024-02-27 – 2024-02-28");
  expect(descriptions(endpoint)).toContain("Anchor: 2024-02-28. Focused endpoint: 2024-02-27. Draft: 2024-02-28 – 2024-02-29.");
  expect(descriptions(anchor)).not.toContain("Range preview:");
  expect(container.querySelector('[data-sgui-part="date-range-preview"]')?.hasAttribute("role")).toBe(false);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("dates.end")).toBe(initial.end);
  await user.keyboard("{ArrowRight}");
  expect(descriptions(endpoint)).not.toContain("Range preview:");
  expect(descriptions(anchor)).toContain("Focused endpoint: 2024-02-28");
  await user.keyboard("{Enter}");
  expect(screen.queryByText(/Anchor:/)).toBeNull();
  expect(descriptions(anchor)).not.toContain("Range preview:");
  expect(screen.getByText("2024-02-28 – 2024-02-28", { selector: "p" })).toBeTruthy();
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.getByRole("status").textContent).toBe("2024-02-28 – 2024-02-29");
});
it("uses the constrained endpoint at unavailable boundaries and removes preview descriptions on Cancel and host replacement", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const props = { label: "Dates", months: 1 as const, value: initial, defaultFocusedDate: initial.start,
    unavailable: [{ date: "2024-03-01", reason: "Closed" }], onValueChange: change };
  const { rerender } = render(<DateRangeSelector {...props} />);
  const anchor = screen.getByRole("button", { name: /Wednesday, February 28, 2024/ });
  anchor.focus(); await user.keyboard("{Enter}{ArrowRight}");
  const endpoint = screen.getByRole("button", { name: /Thursday, February 29, 2024/ });
  expect(document.activeElement).toBe(endpoint);
  expect(screen.getByText(/Anchor: 2024-02-28. Focused endpoint: 2024-02-29/)).toBeTruthy();
  expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(true);
  rerender(<DateRangeSelector {...props} value={{ ...initial }} />);
  expect(screen.getByText(/Anchor: 2024-02-28/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByText(/Anchor:/)).toBeNull();
  expect(endpoint.getAttribute("aria-describedby") ?? "").not.toContain("preview");
  anchor.focus(); await user.keyboard("{Enter}");
  rerender(<DateRangeSelector {...props} value={{ start: "2024-02-20", end: "2024-02-21" }} />);
  expect(screen.queryByText(/Anchor:/)).toBeNull();
  expect(screen.getByRole("status").textContent).toBe("2024-02-20 – 2024-02-21");
  expect(change).not.toHaveBeenCalled();
});
