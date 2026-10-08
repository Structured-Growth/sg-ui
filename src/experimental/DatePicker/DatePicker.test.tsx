// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, useRef } from "react";
import { useFormReset } from "../useFormReset";
import { DatePicker } from "./DatePicker";
afterEach(cleanup);
it("selects and clears the date, restores trigger focus and silently resets the native default", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><DatePicker label="Course date" defaultValue="2024-02-28" name="date" onValueChange={change} /><button type="reset">Reset</button></form>);
  const trigger = screen.getByRole("button", { name: "Choose Course date" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("2024-02-29"); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(new FormData(form).get("date")).toBe("2024-02-29");
  change.mockClear();
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(null);
  expect(new FormData(form).get("date")).toBe(""); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  await user.click(screen.getByRole("button", { name: "Reset" })); expect(new FormData(form).get("date")).toBe("2024-02-28");
  expect(change).toHaveBeenCalledExactlyOnceWith(null);
});
it("preserves controlled authority on Clear and guards empty, required and read-only dates", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<DatePicker label="Course date" name="date" value="2024-02-28" onValueChange={change} />);
  await user.click(screen.getByRole("button", { name: "Choose Course date" })); await user.keyboard("{Escape}"); expect(change).not.toHaveBeenCalled();
  const trigger = screen.getByRole("button", { name: "Choose Course date" });
  await user.click(trigger); await user.click(screen.getByRole("button", { name: "Clear" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(null); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect((document.querySelector('input[name="date"]') as HTMLInputElement).value).toBe("2024-02-28");
  rerender(<DatePicker label="Course date" value={null} onValueChange={change} />);
  await user.click(trigger); expect(screen.queryByRole("button", { name: "Clear" })).toBeNull(); await user.keyboard("{Escape}");
  rerender(<DatePicker label="Course date" value="2024-02-28" required onValueChange={change} />);
  await user.click(trigger); expect(screen.queryByRole("button", { name: "Clear" })).toBeNull(); await user.keyboard("{Escape}");
  rerender(<DatePicker label="Course date" value="2024-02-28" readOnly />);
  expect((screen.getByRole("button", { name: "Choose Course date" }) as HTMLButtonElement).disabled).toBe(true);
  rerender(<DatePicker label="Course date" value="2024-02-28" disabled />);
  expect((screen.getByRole("button", { name: "Choose Course date" }) as HTMLButtonElement).disabled).toBe(true);
});

for (const controlled of [false, true]) {
  it(`keeps ${controlled ? "controlled" : "uncontrolled"} dates on prevented reset and resets silently`, async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const props = { label: "Course date", name: "date", defaultValue: "2024-02-28", onValueChange: change };
    const { rerender } = render(<StrictMode><form data-testid="reset-form" onReset={event => event.preventDefault()}>
      <DatePicker {...props} value={controlled ? "2024-02-29" : undefined} />
    </form></StrictMode>);
    const form = screen.getByTestId("reset-form") as HTMLFormElement;
    const trigger = screen.getByRole("button", { name: "Choose Course date" });
    if (!controlled) {
      await user.click(trigger); await user.click(screen.getByRole("button", { name: "Thursday, February 29, 2024" }));
    }
    change.mockClear(); await user.click(trigger);
    await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
    expect(new FormData(form).get("date")).toBe("2024-02-29");
    expect(screen.getByRole("dialog")).toBeTruthy(); expect(change).not.toHaveBeenCalled();
    rerender(<StrictMode><form data-testid="reset-form"><DatePicker {...props}
      defaultValue="2024-03-01" value={controlled ? "2024-02-29" : undefined} /></form></StrictMode>);
    await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
    expect(new FormData(form).get("date")).toBe(controlled ? "2024-02-29" : "2024-03-01");
    expect(screen.queryByRole("dialog")).toBeNull(); expect(change).not.toHaveBeenCalled();
  });
}

it("cancels pending resets on unmount and keeps one StrictMode listener with the latest callback", async () => {
  vi.useFakeTimers();
  const first = vi.fn(); const latest = vi.fn();
  function Probe({ reset }: { reset: () => void }) {
    const ref = useRef<HTMLDivElement>(null); useFormReset(ref, reset);
    return <div ref={ref} />;
  }
  try {
    const { rerender, unmount } = render(<StrictMode><form data-testid="probe"><Probe reset={first} /></form></StrictMode>);
    const form = screen.getByTestId("probe") as HTMLFormElement;
    act(() => form.reset());
    rerender(<StrictMode><form data-testid="probe"><Probe reset={latest} /></form></StrictMode>);
    act(() => vi.runAllTimers());
    expect(first).not.toHaveBeenCalled(); expect(latest).toHaveBeenCalledOnce();
    act(() => { form.reset(); form.reset(); }); unmount();
    act(() => vi.runAllTimers()); expect(latest).toHaveBeenCalledOnce();
    act(() => form.reset()); act(() => vi.runAllTimers()); expect(latest).toHaveBeenCalledOnce();
  } finally { vi.useRealTimers(); }
});
