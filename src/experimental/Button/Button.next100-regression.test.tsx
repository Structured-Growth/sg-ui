// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Button, ThemeScope, type ButtonProps } from "../index";

afterEach(cleanup);

it("maps owned variants, tones and density overrides through a scoped public composition", () => {
  const ref = createRef<HTMLButtonElement>();
  const props: ButtonProps = { variant: "outlined", tone: "neutral", density: "compact",
    className: "host-action", style: { marginInlineStart: 8 }, name: "action", value: "save" };
  const content = (override: ButtonProps) => <ThemeScope density="comfortable">
    <Button>Default</Button><Button {...override} ref={ref}>Save</Button>
  </ThemeScope>;
  const { rerender } = render(content(props));
  const button = screen.getByRole("button", { name: "Save" });
  const defaultButton = screen.getByRole("button", { name: "Default" });
  expect(defaultButton.getAttribute("data-variant")).toBe("filled");
  expect(defaultButton.getAttribute("data-tone")).toBe("primary");
  expect(defaultButton.hasAttribute("data-sgui-density")).toBe(false);
  expect(defaultButton.closest("[data-sgui-scope]")?.getAttribute("data-sgui-density")).toBe("comfortable");
  expect(ref.current).toBe(button);
  expect(button.getAttribute("data-variant")).toBe("outlined");
  expect(button.getAttribute("data-tone")).toBe("neutral");
  expect(button.getAttribute("data-sgui-density")).toBe("compact");
  expect(button.classList.contains("host-action")).toBe(true);
  expect(button.style.marginInlineStart).toBe("8px");
  expect(ref.current?.name).toBe("action");
  expect(ref.current?.value).toBe("save");
  rerender(content({ variant: "text", tone: "primary", density: "comfortable", loading: true }));
  expect(ref.current).toBe(button);
  expect(button.getAttribute("data-variant")).toBe("text");
  expect(button.getAttribute("data-tone")).toBe("primary");
  expect(button.getAttribute("data-sgui-density")).toBe("comfortable");
  expect(screen.getByRole("progressbar", { name: "Pending" })).toBeDefined();
});

it("isolates sibling pending transitions and releases refs before a fresh mount", async () => {
  const first = vi.fn(); const second = vi.fn(); const replacement = vi.fn();
  const ref = createRef<HTMLButtonElement>(); const user = userEvent.setup();
  const content = (loading: boolean) => <ThemeScope>
    <Button ref={ref} loading={loading} onPress={first}>First</Button>
    <Button onPress={second}>Second</Button>
  </ThemeScope>;
  const { rerender, unmount } = render(content(true));
  const initial = ref.current;
  await user.click(screen.getByRole("button", { name: "First" }));
  await user.click(screen.getByRole("button", { name: "Second" }));
  expect(first).not.toHaveBeenCalled(); expect(second).toHaveBeenCalledTimes(1);
  rerender(content(false));
  await user.click(screen.getByRole("button", { name: "First" }));
  expect(ref.current).toBe(initial);
  expect(first).toHaveBeenCalledTimes(1); expect(second).toHaveBeenCalledTimes(1);
  unmount(); expect(ref.current).toBeNull();
  render(<ThemeScope><Button ref={ref} onPress={replacement}>First</Button></ThemeScope>);
  expect(ref.current).not.toBe(initial);
  await user.click(screen.getByRole("button", { name: "First" }));
  expect(replacement).toHaveBeenCalledTimes(1); expect(first).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("progressbar")).toBeNull();
});
