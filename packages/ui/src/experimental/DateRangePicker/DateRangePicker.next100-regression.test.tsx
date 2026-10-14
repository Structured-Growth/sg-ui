// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../theme";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

afterEach(cleanup);
const initial = { start: "2024-02-20", end: "2024-02-22" };
const endpoints = (form: HTMLFormElement, name: string) => {
  const data = new FormData(form);
  return [data.get(`${name}.start`), data.get(`${name}.end`)];
};

it("edits both owned endpoint fields as a draft and commits Clear as null", async () => {
  const user = userEvent.setup();
  const change = vi.fn<NonNullable<DateRangePickerProps["onValueChange"]>>();
  render(<Provider><form data-testid="host"><DateRangePicker label="Reporting" name="range"
    defaultValue={initial} defaultFocusedDate={initial.start} onValueChange={change} /></form></Provider>);
  const form = screen.getByTestId("host") as HTMLFormElement;
  await user.click(screen.getByRole("button", { name: "Choose Reporting" }));
  await user.click(screen.getByRole("spinbutton", { name: /day, Start date/ }));
  await user.keyboard("{ArrowUp}");
  await user.click(screen.getByRole("spinbutton", { name: /day, End date/ }));
  await user.keyboard("{ArrowUp}");
  expect(screen.getByRole("status").textContent).toBe("2024-02-21 – 2024-02-23");
  expect(endpoints(form, "range")).toEqual([initial.start, initial.end]);
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith({ start: "2024-02-21", end: "2024-02-23" });
  await user.click(screen.getByRole("button", { name: "Choose Reporting" }));
  await user.click(screen.getByRole("button", { name: "Clear", exact: true }));
  expect(endpoints(form, "range")).toEqual(["2024-02-21", "2024-02-23"]);
  expect(change).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(change.mock.calls).toEqual([[{ start: "2024-02-21", end: "2024-02-23" }], [null]]);
  expect(endpoints(form, "range")).toEqual(["", ""]);
});

it("isolates sibling commits and resets draft state after an open instance unmounts", async () => {
  const user = userEvent.setup(); const first = vi.fn(); const second = vi.fn();
  const fixture = (showFirst: boolean) => <Provider><form data-testid="siblings">
    {showFirst && <DateRangePicker label="First" name="first" defaultValue={initial}
      defaultFocusedDate={initial.start} onValueChange={first} />}
    <DateRangePicker label="Second" name="second" defaultValue={initial}
      defaultFocusedDate={initial.start} onValueChange={second} />
  </form></Provider>;
  const { rerender } = render(fixture(true));
  const form = screen.getByTestId("siblings") as HTMLFormElement;
  await user.click(screen.getByRole("button", { name: "Choose First" }));
  await user.click(screen.getByRole("button", { name: "Clear", exact: true }));
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(first).toHaveBeenCalledExactlyOnceWith(null);
  expect(second).not.toHaveBeenCalled();
  expect(endpoints(form, "first")).toEqual(["", ""]);
  expect(endpoints(form, "second")).toEqual([initial.start, initial.end]);
  await user.click(screen.getByRole("button", { name: "Choose Second" }));
  expect(within(screen.getByRole("dialog")).getByRole("status").textContent).toBe(`${initial.start} – ${initial.end}`);
  await user.click(screen.getByRole("button", { name: "Cancel", exact: true }));
  await user.click(screen.getByRole("button", { name: "Choose First" }));
  rerender(fixture(false));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(endpoints(form, "first")).toEqual([null, null]);
  rerender(fixture(true));
  await user.click(screen.getByRole("button", { name: "Choose First" }));
  expect(screen.getByRole("status").textContent).toBe(`${initial.start} – ${initial.end}`);
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).not.toHaveBeenCalled();
});
