// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Button, Menu, Provider, type MenuProps } from "../index";

afterEach(cleanup);

it("preserves explicit compact density and requests close once for action and Escape", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  const change = vi.fn();
  const props: MenuProps = {
    label: "Compact actions", density: "compact", onAction: action, onOpenChange: change,
    trigger: <Button>Compact</Button>, items: [{ id: "save", label: "Save" }],
  };
  render(<Provider density="comfortable"><Menu {...props} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Compact" }));
  expect(screen.getByRole("menu").closest('[data-sgui-density="compact"]')).not.toBeNull();
  expect(change.mock.calls).toEqual([[true]]);
  await user.click(screen.getByRole("menuitem", { name: "Save" }));
  expect(action).toHaveBeenCalledExactlyOnceWith("save");
  expect(change.mock.calls).toEqual([[true], [false]]);
  expect(screen.queryByRole("menu")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Compact" }));
  await user.keyboard("{Escape}");
  expect(change.mock.calls).toEqual([[true], [false], [true], [false]]);
  expect(action).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("menu")).toBeNull();
});

it("isolates sibling open state and dispatches to the current host callback after rerender", async () => {
  const user = userEvent.setup();
  const first = vi.fn(); const replacement = vi.fn(); const second = vi.fn();
  const firstOpen = vi.fn(); const secondOpen = vi.fn();
  const items = [{ id: "shared", label: "Shared command" }];
  const composition = (onAction: (id: string) => void) => <Provider>
    <Menu label="First commands" items={items} onAction={onAction} onOpenChange={firstOpen} trigger={<Button>First</Button>} />
    <Menu label="Second commands" items={items} onAction={second} onOpenChange={secondOpen} trigger={<Button>Second</Button>} />
  </Provider>;
  const { rerender } = render(composition(first));
  await user.click(screen.getByRole("button", { name: "First" }));
  expect(screen.queryByRole("menu", { name: "Second commands" })).toBeNull();
  expect(secondOpen).not.toHaveBeenCalled();
  rerender(composition(replacement));
  await user.click(screen.getByRole("menuitem", { name: "Shared command" }));
  expect(replacement).toHaveBeenCalledExactlyOnceWith("shared");
  expect(first).not.toHaveBeenCalled(); expect(second).not.toHaveBeenCalled();
  expect(firstOpen.mock.calls).toEqual([[true], [false]]);
  await user.click(screen.getByRole("button", { name: "Second" }));
  expect(screen.queryByRole("menu", { name: "First commands" })).toBeNull();
  await user.click(screen.getByRole("menuitem", { name: "Shared command" }));
  expect(second).toHaveBeenCalledExactlyOnceWith("shared");
  expect(replacement).toHaveBeenCalledTimes(1);
  expect(secondOpen.mock.calls).toEqual([[true], [false]]);
});
