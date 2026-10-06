// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./Calendar";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
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
