// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, type ListItemButtonProps } from "./List";
import { Button } from "../Button/Button";
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
it("preserves host pressed state when selected is omitted and gives explicit selected state precedence", () => {
  const ref = createRef<HTMLButtonElement>();
  const listRef = createRef<HTMLUListElement>();
  const itemRef = createRef<HTMLLIElement>();
  const view = (props: ListItemButtonProps, reverse = false) => <List ref={listRef} aria-label="Courses" data-host="courses">{(reverse ? ["other", "toggle"] : ["toggle", "other"]).map(id => <ListItem key={id} ref={id === "toggle" ? itemRef : undefined} id={id}>
    {id === "toggle" ? <><ListItemButton {...props} ref={ref} aria-describedby="selection-detail">Toggle courses</ListItemButton><span id="selection-detail">Some courses included</span><Button>Inspect courses</Button></> : <ListItemText primary="Other courses" />}
  </ListItem>)}</List>;
  const { rerender } = render(view({ "aria-pressed": "mixed" }));
  const action = screen.getByRole("button", { name: "Toggle courses" });
  const item = itemRef.current;
  const list = listRef.current;
  expect(list).toBe(screen.getByRole("list", { name: "Courses" }));
  expect(list?.getAttribute("data-host")).toBe("courses");
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(item?.contains(screen.getByRole("button", { name: "Inspect courses" }))).toBe(true);
  expect(action.contains(screen.getByRole("button", { name: "Inspect courses" }))).toBe(false);
  expect(ref.current).toBe(action);
  expect(action.getAttribute("aria-pressed")).toBe("mixed");
  expect(action.getAttribute("aria-describedby")).toBe("selection-detail");
  rerender(view({ selected: false, "aria-pressed": "mixed" }, true));
  expect(listRef.current).toBe(list);
  expect(itemRef.current).toBe(item);
  expect(list?.lastElementChild).toBe(item);
  expect(ref.current).toBe(action);
  expect(action.getAttribute("aria-pressed")).toBe("false");
  rerender(view({ selected: true, "aria-pressed": false }));
  expect(action.getAttribute("aria-pressed")).toBe("true");
  rerender(view({}));
  expect(action.hasAttribute("aria-pressed")).toBe(false);
});
