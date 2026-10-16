// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { DataGridDragHandle } from "./DataGridDragHandle";
afterEach(cleanup);
it("normalizes reorder activation to one parameterless notification per input", async () => {
  const press = vi.fn(); const user = userEvent.setup();
  const { rerender } = render(<DataGridDragHandle label="Reorder course" onPress={press} />);
  const button = screen.getByRole("button", { name: "Reorder course" });
  await user.click(button); expect(press.mock.calls).toEqual([[]]);
  await user.keyboard("{Enter}"); expect(press.mock.calls).toEqual([[], []]);
  await user.keyboard(" "); expect(press.mock.calls).toEqual([[], [], []]);
  rerender(<DataGridDragHandle label="Reorder course" disabled onPress={press} />);
  await user.click(button); button.focus(); await user.keyboard("{Enter} ");
  expect(press).toHaveBeenCalledTimes(3);
});
