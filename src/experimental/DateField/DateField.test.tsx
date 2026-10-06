// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateField } from "./DateField";
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
