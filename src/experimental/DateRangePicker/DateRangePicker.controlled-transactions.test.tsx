// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./DateRangePicker";

afterEach(cleanup);
const initial = { start: "2024-02-28", end: "2024-02-29" };
const march = { start: "2024-03-01", end: "2024-03-31" };
const replacement = { start: "2024-02-20", end: "2024-02-21" };
const props = { label: "Reporting", name: "range", months: 2 as const, defaultFocusedDate: initial.start,
  presets: [{ id: "march", label: "March", value: march }] };
const trigger = () => screen.getByRole("button", { name: "Choose Reporting" });
const endpoints = () => {
  const data = new FormData(screen.getByTestId("host-form") as HTMLFormElement);
  return [data.get("range.start"), data.get("range.end")];
};
it("keeps both hidden endpoints authoritative after rejected Apply and reopens the host commit", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<form data-testid="host-form" aria-label="Host form"><DateRangePicker {...props} value={initial} onValueChange={change} /></form>);
  await user.click(trigger()); await user.click(screen.getByRole("button", { name: "March", exact: true }));
  expect(endpoints()).toEqual([initial.start, initial.end]);
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith(march);
  expect(endpoints()).toEqual([initial.start, initial.end]);
  await waitFor(() => expect(document.activeElement).toBe(trigger()));
  await user.click(trigger());
  expect(screen.getByRole("status").textContent).toBe(`${initial.start} – ${initial.end}`);
  await user.click(screen.getByRole("button", { name: "March", exact: true }));
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  rerender(<form data-testid="host-form" aria-label="Host form"><DateRangePicker {...props} value={march} onValueChange={change} /></form>);
  expect(change).toHaveBeenCalledTimes(2);
  expect(endpoints()).toEqual([march.start, march.end]);
  await user.click(trigger());
  expect(screen.getByRole("status").textContent).toBe(`${march.start} – ${march.end}`);
});
it("invalidates an open draft and unfinished anchor when host endpoints change", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const fixture = (value: typeof initial) => <form data-testid="host-form" aria-label="Host form"><DateRangePicker {...props} value={value} onValueChange={change} /></form>;
  const { rerender } = render(fixture(initial));
  await user.click(trigger());
  screen.getAllByRole("button", { name: /Wednesday, February 28, 2024/ }).find(node => !node.hasAttribute("data-outside-month"))!.focus();
  await user.keyboard("{Enter}{ArrowRight}");
  expect(screen.getByText(/Range preview:/)).toBeTruthy();
  rerender(fixture(replacement));
  await waitFor(() => expect(screen.queryByText(/Range preview:/)).toBeNull());
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe(`${replacement.start} – ${replacement.end}`);
  expect((screen.getByRole("button", { name: "Apply", exact: true }) as HTMLButtonElement).disabled).toBe(false);
  expect(endpoints()).toEqual([replacement.start, replacement.end]);
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith(replacement);
});
it("retains an open draft on prevented native reset and closes on accepted reset without a controlled request", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  let prevent = true;
  render(<form data-testid="host-form" aria-label="Host form" onReset={event => { if (prevent) event.preventDefault(); }}>
    <DateRangePicker {...props} value={initial} defaultValue={march} onValueChange={change} /></form>);
  await user.click(trigger()); await user.click(screen.getByRole("button", { name: "March", exact: true }));
  const form = screen.getByTestId("host-form") as HTMLFormElement;
  await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe(`${march.start} – ${march.end}`);
  expect(endpoints()).toEqual([initial.start, initial.end]);
  prevent = false;
  await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(endpoints()).toEqual([initial.start, initial.end]);
  expect(change).not.toHaveBeenCalled();
  await user.click(trigger());
  expect(screen.getByRole("status").textContent).toBe(`${initial.start} – ${initial.end}`);
});
