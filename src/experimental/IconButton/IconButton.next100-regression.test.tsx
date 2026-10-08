// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { IconButton, ThemeScope, type IconButtonProps } from "../index";
import { AddIcon } from "../icons/AddIcon";

afterEach(cleanup);

it("isolates disabled and pending siblings and restores only the current host callback after remount", async () => {
  const first = vi.fn(); const second = vi.fn(); const latest = vi.fn();
  const ref = createRef<HTMLButtonElement>(); const user = userEvent.setup();
  const content = (state: Pick<IconButtonProps, "disabled" | "loading">, onPress = first) => <ThemeScope>
    <IconButton {...state} ref={ref} label="First" onPress={onPress}><AddIcon /></IconButton>
    <IconButton label="Second" onPress={second}><AddIcon /></IconButton>
  </ThemeScope>;
  const { rerender, unmount } = render(content({ disabled: true }));
  const initial = ref.current;
  expect(initial?.disabled).toBe(true);
  await user.click(screen.getByRole("button", { name: "First" }));
  await user.click(screen.getByRole("button", { name: "Second" }));
  expect(first).not.toHaveBeenCalled(); expect(second).toHaveBeenCalledTimes(1);
  rerender(content({ loading: true }, latest));
  const pending = screen.getByRole("button", { name: "First Pending" });
  pending.focus(); await user.keyboard("{Enter} "); await user.click(pending);
  await user.click(screen.getByRole("button", { name: "Second" }));
  expect(first).not.toHaveBeenCalled(); expect(latest).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledTimes(2); expect(ref.current).toBe(initial);
  rerender(content({}, latest));
  await user.click(screen.getByRole("button", { name: "First" }));
  expect(latest).toHaveBeenCalledTimes(1); expect(first).not.toHaveBeenCalled();
  unmount(); expect(ref.current).toBeNull();
  render(<ThemeScope><IconButton ref={ref} label="First" onPress={first}><AddIcon /></IconButton></ThemeScope>);
  expect(ref.current).not.toBe(initial);
  await user.click(screen.getByRole("button", { name: "First" }));
  expect(first).toHaveBeenCalledTimes(1); expect(latest).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("progressbar")).toBeNull();
});
