// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";
import { AddIcon } from "../icons/AddIcon";
afterEach(cleanup);
it("requires an accessible action name and forwards a native ref with normalized activation", async () => {
  const ref = createRef<HTMLButtonElement>(); const action = vi.fn(); const user = userEvent.setup();
  render(<IconButton ref={ref} label="Add course" onPress={action}><AddIcon label="Plus symbol" /></IconButton>);
  const button = screen.getByRole("button", { name: "Add course" }); expect(ref.current).toBe(button);
  expect(screen.queryByRole("img")).toBeNull();
  await user.tab(); await user.keyboard("{Enter} "); await user.click(button); expect(action).toHaveBeenCalledTimes(3);
});
it("includes its action name in the pending announcement and prevents activation", async () => {
  const action = vi.fn(); const user = userEvent.setup(); render(<IconButton loading label="Save" onPress={action}><AddIcon /></IconButton>);
  await user.click(screen.getByRole("button", { name: "Save Pending" })); expect(action).not.toHaveBeenCalled(); expect(screen.getByRole("progressbar")).toBeDefined();
});
