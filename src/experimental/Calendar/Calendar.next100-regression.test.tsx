// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, type CalendarProps, Provider } from "../index";

afterEach(cleanup);

it("rejects dates outside min/max and unavailable dates while accepting both inclusive boundaries", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const props: CalendarProps = {
    label: "Bounded course date", defaultFocusedDate: "2024-02-14",
    min: "2024-02-14", max: "2024-02-16",
    unavailable: [{ date: "2024-02-15", reason: "No capacity" }],
    onValueChange: change,
  };
  render(<Provider><Calendar {...props} /></Provider>);
  for (const name of ["Tuesday, February 13, 2024", "Thursday, February 15, 2024", "Saturday, February 17, 2024"]) {
    const day = screen.getByRole("button", { name });
    expect(day.getAttribute("aria-disabled")).toBe("true");
    await user.click(day);
  }
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Wednesday, February 14, 2024" }));
  expect(change).toHaveBeenLastCalledWith("2024-02-14");
  await user.click(screen.getByRole("button", { name: "Friday, February 16, 2024" }));
  expect(change).toHaveBeenLastCalledWith("2024-02-16");
  expect(change).toHaveBeenCalledTimes(2);
});

it("isolates selection and visible month across siblings and restores defaults on keyed remount", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const firstFocus = vi.fn();
  const secondFocus = vi.fn();
  const composition = (key: string) => <Provider>
    <section aria-label="First calendar"><Calendar key={key} label="First course date"
      defaultValue="2024-02-28" defaultFocusedDate="2024-02-28"
      onValueChange={firstChange} onFocusedDateChange={firstFocus} /></section>
    <section aria-label="Second calendar"><Calendar label="Second course date"
      defaultValue="2024-04-10" defaultFocusedDate="2024-04-10"
      onValueChange={secondChange} onFocusedDateChange={secondFocus} /></section>
  </Provider>;
  const { rerender } = render(composition("initial"));
  const first = within(screen.getByRole("region", { name: "First calendar" }));
  const second = within(screen.getByRole("region", { name: "Second calendar" }));
  await user.click(first.getByRole("button", { name: /Wednesday, February 28, 2024 selected/ }));
  firstChange.mockClear(); firstFocus.mockClear();
  await user.keyboard("{ArrowRight}{Enter}");
  expect(firstFocus).toHaveBeenLastCalledWith("2024-02-29");
  expect(firstChange).toHaveBeenLastCalledWith("2024-02-29");
  await user.click(first.getByRole("button", { name: "Next month" }));
  expect(first.getByText("March 2024")).toBeTruthy();
  expect(second.getByText("April 2024")).toBeTruthy();
  expect(second.getByRole("button", { name: /Wednesday, April 10, 2024 selected/ })).toBeTruthy();
  expect(secondChange).not.toHaveBeenCalled(); expect(secondFocus).not.toHaveBeenCalled();
  firstChange.mockClear(); firstFocus.mockClear();
  rerender(composition("replacement"));
  expect(first.getByText("February 2024")).toBeTruthy();
  expect(first.getByRole("button", { name: /Wednesday, February 28, 2024 selected/ })).toBeTruthy();
  expect(second.getByRole("button", { name: /Wednesday, April 10, 2024 selected/ })).toBeTruthy();
  expect(firstChange).not.toHaveBeenCalled(); expect(firstFocus).not.toHaveBeenCalled();
});
