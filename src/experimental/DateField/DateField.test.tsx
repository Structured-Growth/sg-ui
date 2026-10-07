// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateField } from "./DateField";
import { createRef } from "react";
import { dateTimeToInstant } from "../DateRangeSelector/date-contract";
afterEach(cleanup);
it("edits a date by keyboard and participates in submission and native reset", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateField label="Course date" defaultValue="2024-02-28" name="date" onValueChange={change} /><button type="reset">Reset</button></form>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenLastCalledWith("2024-02-29");
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("2024-02-29");
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(new FormData(form).get("date")).toBe("2024-02-28");
});
it("reports controlled date edits without replacing the host value and associates validation text", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateField label="Course date" value="2024-02-28" name="date" onValueChange={change}
    description="Date only" invalid errorMessage="Choose an available day" /></form>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("{ArrowUp}"); expect(change).toHaveBeenLastCalledWith("2024-02-29");
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("date")).toBe("2024-02-28");
  const descriptions = day.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
  expect(descriptions).toContain("Date only"); expect(descriptions).toContain("Choose an available day");
});
it("keeps read-only fields unchanged and serializes local datetime independently of timezone", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DateField label="Starts" kind="datetime" value="2024-11-03T01:30:00" name="start" readOnly onValueChange={change} /></form>);
  await user.click(screen.getByRole("spinbutton", { name: /minute/ })); await user.keyboard("{ArrowUp}");
  expect(change).not.toHaveBeenCalled();
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).get("start")).toBe("2024-11-03T01:30:00");
});
it("requires an explicit timezone and resolves or rejects daylight-saving gaps and overlaps", () => {
  expect(() => dateTimeToInstant("2024-03-10T02:30:00", "America/Chicago")).toThrow();
  expect(() => dateTimeToInstant("2024-11-03T01:30:00", "America/Chicago")).toThrow();
  expect(dateTimeToInstant("2024-11-03T01:30:00", "America/Chicago", "earlier")).toBe("2024-11-03T06:30:00.000Z");
  expect(dateTimeToInstant("2024-11-03T01:30:00", "America/Chicago", "later")).toBe("2024-11-03T07:30:00.000Z");
  expect(dateTimeToInstant("2024-03-10T02:30:00", "America/Chicago", "earlier")).toBe("2024-03-10T07:30:00.000Z");
  expect(dateTimeToInstant("2024-03-10T02:30:00", "America/Chicago", "later")).toBe("2024-03-10T08:30:00.000Z");
  expect(dateTimeToInstant("2024-03-11T00:00:00", "Asia/Tokyo")).toBe("2024-03-10T15:00:00.000Z");
});
it("shows invalid external strings without crashing or submitting them as valid dates", () => {
 const change = vi.fn(); render(<form data-testid="invalid-form"><DateField label="Imported date" name="date" value="2024-02-30" onValueChange={change} /></form>);
 expect(screen.getByText("Enter a valid date.")).toBeDefined();
 expect(new FormData(screen.getByTestId("invalid-form") as HTMLFormElement).get("date")).toBe(""); expect(change).not.toHaveBeenCalled();
});

it("honors delegated reset prevention and restores uncontrolled defaults without callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  let prevent = true;
  render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="reset-form">
    <DateField label="Reset field" name="field" defaultValue="2024-02-28" onValueChange={change} />
    <button type="reset">Reset field</button>
  </form></div>);
  await user.click(screen.getByRole("spinbutton", { name: /day/ })); await user.keyboard("{ArrowUp}");
  const form = screen.getByTestId("reset-form") as HTMLFormElement;
  change.mockClear();
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  expect(new FormData(form).get("field")).toBe("2024-02-29");
  expect(screen.getByRole("spinbutton", { name: /day/ }).getAttribute("aria-valuenow")).toBe("29");
  expect(change).not.toHaveBeenCalled();
  prevent = false;
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  await waitFor(() => expect(new FormData(form).get("field")).toBe("2024-02-28"));
  expect(change).not.toHaveBeenCalled();
});
it("keeps controlled reset values authoritative without edit callbacks", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="controlled-reset-form"><DateField label="Reset field" name="field"
    value="2024-02-29" defaultValue="2024-02-28" onValueChange={change} /><button type="reset">Reset field</button></form>);
  await user.click(screen.getByRole("button", { name: "Reset field" }));
  expect(new FormData(screen.getByTestId("controlled-reset-form") as HTMLFormElement).get("field")).toBe("2024-02-29");
  expect(screen.getByRole("spinbutton", { name: /day/ }).getAttribute("aria-valuenow")).toBe("29");
  expect(change).not.toHaveBeenCalled();
});

it("restores an invalid uncontrolled default after correcting it without emitting a reset edit", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="invalid-reset"><DateField label="Imported date" name="date" defaultValue="invalid" onValueChange={change} /></form>);
  expect(screen.getByText("Enter a valid date.")).toBeDefined();
  for (const [segment, text] of [[/month/, "02"], [/day/, "28"], [/year/, "2024"]] as const) {
    await user.click(screen.getByRole("spinbutton", { name: segment })); await user.keyboard(text);
  }
  const form = screen.getByTestId("invalid-reset") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("2024-02-28");
  expect(screen.queryByText("Enter a valid date.")).toBeNull();
  change.mockClear(); act(() => form.reset());
  await waitFor(() => expect(screen.getByText("Enter a valid date.")).toBeDefined());
  expect(new FormData(form).get("date")).toBe(""); expect(change).not.toHaveBeenCalled();
});

it("clears incomplete segments on reset to an empty default without a value callback", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form><DateField label="Empty date" onValueChange={change} /><button type="reset">Clear draft</button></form>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("28");
  expect(day.getAttribute("aria-valuenow")).toBe("28"); change.mockClear();
  await user.click(screen.getByRole("button", { name: "Clear draft" }));
  await waitFor(() => expect(day.getAttribute("aria-valuenow")).toBeNull());
  expect(change).not.toHaveBeenCalled();
});

it("preserves an incomplete day draft and focused segment after a delegated prevented reset", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<div onReset={event => event.preventDefault()}><form data-testid="incomplete-reset">
    <DateField label="Incomplete date" name="date" onValueChange={change} />
  </form></div>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("28");
  expect(day.getAttribute("aria-valuenow")).toBe("28");
  const focused = document.activeElement;
  const form = screen.getByTestId("incomplete-reset") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("");
  expect(change).not.toHaveBeenCalled();
  act(() => form.reset());
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(document.activeElement).toBe(focused);
  expect(day.getAttribute("aria-valuenow")).toBe("28");
  expect(screen.getByRole("spinbutton", { name: /month/ }).getAttribute("aria-valuenow")).toBeNull();
  expect(screen.getByRole("spinbutton", { name: /year/ }).getAttribute("aria-valuenow")).toBeNull();
  expect(new FormData(form).get("date")).toBe("");
  expect(change).not.toHaveBeenCalled();
});


it("preserves a controlled-null incomplete draft on prevented reset and clears it silently on accepted reset", async () => {
  const user = userEvent.setup(); const change = vi.fn(); let prevent = true;
  render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="null-draft">
    <DateField label="Host empty date" name="date" value={null} defaultValue="2024-02-28" onValueChange={change} />
    <button type="reset">Reset host draft</button>
  </form></div>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  const month = screen.getByRole("spinbutton", { name: /month/ });
  const year = screen.getByRole("spinbutton", { name: /year/ });
  await user.click(day); await user.keyboard("28");
  await user.click(year); await user.keyboard("2024");
  const form = screen.getByTestId("null-draft") as HTMLFormElement;
  const nativeInput = form.elements.namedItem("date");
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Reset host draft" }));
  expect(day.getAttribute("aria-valuenow")).toBe("28");
  expect(year.getAttribute("aria-valuenow")).toBe("2024");
  expect(month.getAttribute("aria-valuenow")).toBeNull();
  expect(new FormData(form).get("date")).toBe("");
  prevent = false;
  await user.click(screen.getByRole("button", { name: "Reset host draft" }));
  await waitFor(() => expect(day.getAttribute("aria-valuenow")).toBeNull());
  expect(year.getAttribute("aria-valuenow")).toBeNull();
  expect(new FormData(form).get("date")).toBe("");
  expect(form.elements.namedItem("date")).toBe(nativeInput);
  expect(change).not.toHaveBeenCalled();
  // Completing a draft remains an ordinary host request. A rejecting host keeps
  // its null value; reset must never substitute the uncontrolled default.
  for (const [segment, text] of [[year, "2024"], [month, "02"], [day, "7"]] as const) {
    await user.click(segment); await user.keyboard(text);
  }
  expect(change).toHaveBeenLastCalledWith("2024-02-07");
  expect(new FormData(form).get("date")).toBe("");
});

it("keeps native required validation and its descriptions through prevented draft reset", async () => {
  const user = userEvent.setup(); const change = vi.fn(); let prevent = true;
  render(<div onReset={event => { if (prevent) event.preventDefault(); }}><form data-testid="draft-validation">
    <DateField label="Required draft" name="date" required description="Choose the full date"
      errorMessage="Complete the course date" onValueChange={change} />
    <button type="reset">Reset validation draft</button>
  </form></div>);
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("28");
  const form = screen.getByTestId("draft-validation") as HTMLFormElement;
  expect(screen.queryByText("Complete the course date")).toBeNull();
  act(() => { expect(form.checkValidity()).toBe(false); });
  await screen.findByText("Complete the course date");
  await user.click(screen.getByRole("button", { name: "Reset validation draft" }));
  expect(day.getAttribute("aria-valuenow")).toBe("28");
  expect(day.getAttribute("aria-invalid")).toBe("true");
  const descriptions = day.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)?.textContent).join(" ");
  expect(descriptions).toContain("Choose the full date");
  expect(descriptions).toContain("Complete the course date");
  expect((form.elements.namedItem("date") as HTMLInputElement).validity.valueMissing).toBe(true);
  prevent = false;
  await user.click(screen.getByRole("button", { name: "Reset validation draft" }));
  await waitFor(() => expect(day.getAttribute("aria-valuenow")).toBeNull());
  expect(screen.queryByText("Complete the course date")).toBeNull();
  expect(day.getAttribute("aria-invalid")).toBeNull();
  expect((form.elements.namedItem("date") as HTMLInputElement).validity.valueMissing).toBe(true);
  expect(change).not.toHaveBeenCalled();
});

it("restores the current default after draft reset and retains the native root/input/segments", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLDivElement>();
  const content = (defaultValue: string | null) => <form data-testid="current-draft-default">
    <DateField ref={ref} label="Current draft" name="date" defaultValue={defaultValue} onValueChange={change} />
  </form>;
  const { rerender } = render(content(null));
  const root = ref.current;
  const day = screen.getByRole("spinbutton", { name: /day/ });
  await user.click(day); await user.keyboard("28");
  const form = screen.getByTestId("current-draft-default") as HTMLFormElement;
  const input = form.elements.namedItem("date");
  rerender(content("2025-03-12"));
  expect(day.getAttribute("aria-valuenow")).toBe("28");
  const focused = document.activeElement;
  act(() => form.reset());
  await waitFor(() => expect(new FormData(form).get("date")).toBe("2025-03-12"));
  expect(day.getAttribute("aria-valuenow")).toBe("12");
  expect(ref.current).toBe(root);
  expect(form.elements.namedItem("date")).toBe(input);
  expect(screen.getByRole("spinbutton", { name: /day/ })).toBe(day);
  expect(document.activeElement).toBe(focused);
  expect(change).not.toHaveBeenCalled();
});
