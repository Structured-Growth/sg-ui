// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridColumnWidthControl } from "./GridColumnWidthControl";
afterEach(cleanup);
it("requests exact and single-pointer step widths, preserving rejecting host authority on reopen", async () => {
  const user = userEvent.setup(); const request = vi.fn(); let width = 180;
  render(<GridColumnWidthControl label="Course" width={() => width} minWidth={120} maxWidth={300} onWidthChange={request} />);
  const open = () => user.click(screen.getByRole("button", { name: "Width of Course" }));
  await open();
  await user.click(screen.getByRole("button", { name: "Wider by 1 pixel" }));
  expect(request).toHaveBeenLastCalledWith(181);
  await open();
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("180");
  await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "237.5");
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(request).toHaveBeenLastCalledWith(237.5);
  width = 237.5;
  await open();
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("237.5");
  await user.keyboard("{Escape}");
  expect(request).toHaveBeenCalledTimes(2);
});
it("rejects blank, nonfinite and out-of-bounds drafts; disables fixed and boundary operations", async () => {
  const user = userEvent.setup(); const request = vi.fn();
  render(<><GridColumnWidthControl label="Course" width={() => 120} minWidth={120} maxWidth={300} onWidthChange={request} />
    <GridColumnWidthControl label="Actions" width={() => 96} minWidth={96} maxWidth={96} onWidthChange={request} /></>);
  expect((screen.getByRole("button", { name: "Width of Actions" }) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole("button", { name: "Width of Course" }));
  expect((screen.getByRole("button", { name: "Narrower by 1 pixel" }) as HTMLButtonElement).disabled).toBe(true);
  for (const value of ["", "119", "301", "Infinity", "garbage"]) {
    await user.clear(screen.getByRole("textbox")); if (value) await user.type(screen.getByRole("textbox"), value);
    expect((screen.getByRole("button", { name: "Apply", exact: true }) as HTMLButtonElement).disabled).toBe(true);
  }
  await user.keyboard("{Escape}"); expect(request).not.toHaveBeenCalled();
});
