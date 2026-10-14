// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../Provider/Provider";
import { SplitAction, type SplitActionProps } from "./SplitAction";

afterEach(cleanup);

it("isolates host commands and clears an unmounted instance's open menu before remount", async () => {
  const user = userEvent.setup();
  const firstPress = vi.fn(); const firstAction = vi.fn();
  const secondPress = vi.fn(); const secondAction = vi.fn();
  const first: SplitActionProps = { label: "Create first", menuLabel: "First actions", items: [{ id: "shared", label: "Import first" }], onPress: firstPress, onAction: firstAction };
  const second: SplitActionProps = { label: "Create second", menuLabel: "Second actions", items: [{ id: "shared", label: "Import second" }], onPress: secondPress, onAction: secondAction };
  const Host = ({ showFirst }: { showFirst: boolean }) => <Provider>
    {showFirst && <SplitAction {...first} />}
    <SplitAction {...second} />
  </Provider>;
  const { rerender } = render(<Host showFirst />);
  await user.click(screen.getByRole("button", { name: "Create first" }));
  await user.click(screen.getByRole("button", { name: "First actions" }));
  expect(screen.getByRole("menuitem", { name: "Import first" })).toBeDefined();
  rerender(<Host showFirst={false} />);
  expect(screen.queryByRole("menu")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Create second" }));
  await user.click(screen.getByRole("button", { name: "Second actions" }));
  await user.click(screen.getByRole("menuitem", { name: "Import second" }));
  expect(secondAction).toHaveBeenCalledExactlyOnceWith("shared");
  expect(firstAction).not.toHaveBeenCalled();
  expect(firstPress).toHaveBeenCalledTimes(1);
  expect(secondPress).toHaveBeenCalledTimes(1);
  rerender(<Host showFirst />);
  expect(screen.queryByRole("menu")).toBeNull();
  await user.click(screen.getByRole("button", { name: "First actions" }));
  await user.click(screen.getByRole("menuitem", { name: "Import first" }));
  expect(firstAction).toHaveBeenCalledExactlyOnceWith("shared");
  expect(secondAction).toHaveBeenCalledTimes(1);
});
