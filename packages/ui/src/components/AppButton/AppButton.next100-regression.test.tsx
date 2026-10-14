// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { AppButton, type AppButtonProps } from "./index";

afterEach(cleanup);

it("preserves the public native ref, class and style through host updates and unmount", () => {
  const ref = createRef<HTMLButtonElement>();
  const props: AppButtonProps = { className: "host-action", style: { marginInlineStart: 12 }, name: "action", value: "save" };
  const { rerender, unmount } = render(<Provider><AppButton {...props} ref={ref}>Save</AppButton></Provider>);
  const button = screen.getByRole("button", { name: "Save" });
  expect(ref.current).toBe(button);
  expect(button.classList.contains("host-action")).toBe(true);
  expect(button.style.marginInlineStart).toBe("12px");
  expect(button.getAttribute("name")).toBe("action");
  expect(button.getAttribute("value")).toBe("save");
  rerender(<Provider><AppButton ref={ref} className="host-updated" style={{ marginInlineStart: 24 }}>Save</AppButton></Provider>);
  expect(ref.current).toBe(button);
  expect(button.classList.contains("host-action")).toBe(false);
  expect(button.classList.contains("host-updated")).toBe(true);
  expect(button.style.marginInlineStart).toBe("24px");
  unmount();
  expect(ref.current).toBeNull();
});

it("isolates sibling activation and uses the latest host callback after pending clears", async () => {
  const firstPress = vi.fn();
  const latestPress = vi.fn();
  const siblingPress = vi.fn();
  const user = userEvent.setup();
  const composition = (loading: boolean, onPress: AppButtonProps["onPress"]) => <Provider>
    <AppButton loading={loading} onPress={onPress}>Save</AppButton>
    <AppButton onPress={siblingPress}>Preview</AppButton>
  </Provider>;
  const { rerender } = render(composition(false, firstPress));
  const save = screen.getByRole("button", { name: "Save" });
  await user.click(save);
  expect(firstPress).toHaveBeenCalledTimes(1);
  expect(siblingPress).not.toHaveBeenCalled();
  rerender(composition(true, latestPress));
  await user.click(save);
  await user.click(screen.getByRole("button", { name: "Preview" }));
  expect(latestPress).not.toHaveBeenCalled();
  expect(siblingPress).toHaveBeenCalledTimes(1);
  rerender(composition(false, latestPress));
  expect(screen.getByRole("button", { name: "Save" })).toBe(save);
  await user.click(save);
  expect(latestPress).toHaveBeenCalledTimes(1);
  expect(firstPress).toHaveBeenCalledTimes(1);
  expect(siblingPress).toHaveBeenCalledTimes(1);
});
