// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "../../primitives";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("isolates public list compositions through callback updates and sibling unmount", async () => {
  const user = userEvent.setup();
  const firstPress = vi.fn();
  const oldSecondPress = vi.fn();
  const nextSecondPress = vi.fn();
  const firstRef = createRef<HTMLButtonElement>();
  const secondRef = createRef<HTMLButtonElement>();
  const textRef = createRef<HTMLSpanElement>();
  const iconRef = createRef<HTMLSpanElement>();
  const view = (showFirst: boolean, secondPress: () => void) => <Provider>
    {showFirst && <List aria-label="First courses"><ListItem><ListItemButton ref={firstRef} selected onPress={firstPress}>Algebra</ListItemButton></ListItem></List>}
    <List aria-label="Second courses"><ListItem><ListItemButton ref={secondRef} selected={false} onPress={secondPress}>
      <ListItemIcon ref={iconRef} className="host-icon" style={{ marginInlineEnd: 4 }}>☆</ListItemIcon>
      <ListItemText ref={textRef} className="host-text" style={{ minWidth: 0 }} primary="Geometry" secondary="Five lessons" />
    </ListItemButton></ListItem></List>
  </Provider>;
  const { rerender, unmount } = render(view(true, oldSecondPress));
  const first = within(screen.getByRole("list", { name: "First courses" })).getByRole("button");
  const second = within(screen.getByRole("list", { name: "Second courses" })).getByRole("button");
  expect(first.getAttribute("aria-pressed")).toBe("true");
  expect(second.getAttribute("aria-pressed")).toBe("false");
  expect(secondRef.current).toBe(second);
  expect(textRef.current?.textContent).toBe("GeometryFive lessons");
  expect(textRef.current?.classList.contains("host-text")).toBe(true);
  expect(textRef.current?.style.minWidth).toBe("0");
  expect(iconRef.current?.getAttribute("aria-hidden")).toBe("true");
  expect(iconRef.current?.classList.contains("host-icon")).toBe(true);
  expect(iconRef.current?.style.marginInlineEnd).toBe("4px");
  await user.click(first);
  expect(firstPress).toHaveBeenCalledTimes(1);
  expect(oldSecondPress).not.toHaveBeenCalled();
  rerender(view(false, nextSecondPress));
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(second);
  expect(second.getAttribute("aria-pressed")).toBe("false");
  await user.click(second);
  expect(nextSecondPress).toHaveBeenCalledTimes(1);
  expect(oldSecondPress).not.toHaveBeenCalled();
  expect(firstPress).toHaveBeenCalledTimes(1);
  unmount();
  expect(secondRef.current).toBeNull();
  expect(textRef.current).toBeNull();
  expect(iconRef.current).toBeNull();
});
