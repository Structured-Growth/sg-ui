// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "./List";
afterEach(cleanup);
it("keeps list semantics and gives list actions one keyboard activation with selected state", async () => {
  const user = userEvent.setup(); const onPress = vi.fn(); const ref = createRef<HTMLButtonElement>();
  render(<List aria-label="Courses"><ListItem><ListItemButton ref={ref} selected onPress={onPress}><ListItemIcon>☆</ListItemIcon><ListItemText primary="Algebra" secondary="Three lessons" /></ListItemButton></ListItem></List>);
  expect(screen.getByRole("list", { name: "Courses" })).toBeDefined();
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(ref.current).toBe(screen.getByRole("button"));
  expect(ref.current?.getAttribute("aria-pressed")).toBe("true");
  await user.tab(); await user.keyboard(" "); expect(onPress).toHaveBeenCalledTimes(1);
  expect(screen.getByText("☆").getAttribute("aria-hidden")).toBe("true");
});
it("does not activate disabled list actions", async () => {
  const onPress = vi.fn(); render(<List><ListItem><ListItemButton disabled onPress={onPress}>Archived</ListItemButton></ListItem></List>);
  await userEvent.click(screen.getByRole("button")); expect(onPress).not.toHaveBeenCalled();
});
