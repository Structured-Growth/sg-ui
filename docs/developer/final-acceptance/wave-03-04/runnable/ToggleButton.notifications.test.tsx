// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ToggleButton } from "/Users/thomashall/Repositories/sg-ui/packages/ui/src/experimental/ToggleButton/ToggleButton";
afterEach(cleanup);
it("reports distinct selection and parameterless press notifications once per activation", async () => {
  const selection = vi.fn(); const press = vi.fn(); const user = userEvent.setup();
  const { rerender } = render(<ToggleButton onSelectedChange={selection} onPress={press}>Bold</ToggleButton>);
  const button = screen.getByRole("button", { name: "Bold" });
  await user.click(button);
  expect(selection.mock.calls).toEqual([[true]]); expect(press.mock.calls).toEqual([[]]);
  await user.keyboard("{Enter}");
  expect(selection.mock.calls).toEqual([[true], [false]]); expect(press.mock.calls).toEqual([[], []]);
  await user.keyboard(" ");
  expect(selection.mock.calls).toEqual([[true], [false], [true]]); expect(press.mock.calls).toEqual([[], [], []]);
  expect(button.getAttribute("aria-pressed")).toBe("true");
  rerender(<ToggleButton selected={false} onSelectedChange={selection} onPress={press}>Bold</ToggleButton>);
  await user.click(button);
  expect(selection.mock.calls).toEqual([[true], [false], [true], [true]]);
  expect(press.mock.calls).toEqual([[], [], [], []]);
  expect(button.getAttribute("aria-pressed")).toBe("false");
  rerender(<ToggleButton disabled onSelectedChange={selection} onPress={press}>Bold</ToggleButton>);
  await user.click(button); button.focus(); await user.keyboard("{Enter} ");
  expect(selection).toHaveBeenCalledTimes(4); expect(press).toHaveBeenCalledTimes(4);
});
