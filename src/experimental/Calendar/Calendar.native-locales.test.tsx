// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NativeCalendarFixture } from "./Calendar.native-locales.stories";
afterEach(cleanup);
const selected = () => screen.getByLabelText("Selected civil dates").textContent;
const focused = () => screen.getByLabelText("Focused civil date").textContent;
const count = () => screen.getByLabelText("Selection callback count").textContent;

it("selects and deselects noncontiguous days across two months without selecting focused days", async () => {
  const user = userEvent.setup(); render(<NativeCalendarFixture />);
  expect(screen.getAllByRole("grid")).toHaveLength(2);
  const start = within(screen.getAllByRole("grid")[0]!).getByRole("button", { name: "Wednesday, February 28, 2024" });
  start.focus(); await user.keyboard("{Enter}{ArrowRight}");
  expect(selected()).toBe('["2024-02-28"]'); expect(count()).toBe("1");
  expect(focused()).toBe("2024-02-29");
  await user.keyboard("{ArrowRight}{Enter}");
  expect(focused()).toBe("2024-03-01"); expect(count()).toBe("1");
  expect(within(screen.getAllByRole("grid")[1]!).getByRole("button", { name: /Friday, March 1, 2024/ }).getAttribute("aria-disabled")).toBe("true");
  await user.keyboard("{ArrowRight}{Enter}");
  expect(selected()).toBe('["2024-02-28","2024-03-02"]'); expect(count()).toBe("2");
  await user.keyboard("{Enter}");
  expect(selected()).toBe('["2024-02-28"]'); expect(count()).toBe("3");
  await user.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{Enter}");
  expect(selected()).toBe("[]"); expect(count()).toBe("4");
});
for (const [firstDayOfWeek, order] of [["sun", ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]],
  ["mon", ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]]] as const) {
  it(`uses explicit ${firstDayOfWeek} header order in both months`, () => {
    render(<NativeCalendarFixture firstDayOfWeek={firstDayOfWeek} />);
    for (const grid of screen.getAllByRole("grid")) expect(within(grid).getAllByRole("columnheader", { hidden: true }).map(cell => cell.textContent)).toEqual(order);
  });
}
it("uses locale RTL arrows while emitting Gregorian focus and selection", async () => {
  const user = userEvent.setup(); render(<NativeCalendarFixture locale="ar-EG" />);
  const start = screen.getAllByRole("button").find(button => button.closest('[role="grid"]') && button.tabIndex === 0)!;
  start.focus(); await user.keyboard("{Enter}{ArrowLeft}");
  expect(focused()).toBe("2024-02-29"); expect(selected()).toBe('["2024-02-28"]');
  await user.keyboard("{Enter}{ArrowRight}");
  expect(focused()).toBe("2024-02-28"); expect(selected()).toBe('["2024-02-28","2024-02-29"]');
});
it("displays Hebrew civil dates and emits exact Gregorian leap-day values", async () => {
  const user = userEvent.setup(); render(<NativeCalendarFixture locale="en-US-u-ca-hebrew" />);
  expect(screen.getByText("Adar I 5784")).toBeTruthy(); expect(screen.getByText("Adar II 5784")).toBeTruthy();
  const start = screen.getByRole("button", { name: /19 Adar I 5784/ });
  start.focus(); await user.keyboard("{Enter}{ArrowRight}{Enter}");
  expect(focused()).toBe("2024-02-29"); expect(selected()).toBe('["2024-02-28","2024-02-29"]');
  await user.keyboard("{ArrowRight}{Enter}"); expect(focused()).toBe("2024-03-01"); expect(count()).toBe("2");
});
