// @vitest-environment jsdom
import { StrictMode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeScope } from "./ThemeScope";
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });
it("balances StrictMode document observation and cancels the last owner's scroll timer", () => {
  vi.useFakeTimers();
  const add = vi.spyOn(document, "addEventListener");
  const remove = vi.spyOn(document, "removeEventListener");
  const active = () => {
    const listeners = new Set(add.mock.calls.filter(([type]) => type === "scroll").map(([, listener]) => listener));
    for (const [type, listener] of remove.mock.calls) if (type === "scroll") listeners.delete(listener);
    return listeners.size;
  };
  const first = render(<StrictMode><ThemeScope><ThemeScope data-testid="pane" /></ThemeScope></StrictMode>);
  const second = render(<StrictMode><ThemeScope data-testid="survivor" /></StrictMode>);
  expect(active()).toBe(1);
  const pane = first.getByTestId("pane");
  pane.dispatchEvent(new Event("scroll"));
  expect(pane.hasAttribute("data-sgui-scrolling")).toBe(true);
  first.unmount();
  expect(active()).toBe(1);
  const survivor = second.getByTestId("survivor");
  survivor.dispatchEvent(new Event("scroll"));
  expect(survivor.hasAttribute("data-sgui-scrolling")).toBe(true);
  second.unmount();
  expect(active()).toBe(0);
  expect(pane.hasAttribute("data-sgui-scrolling")).toBe(false);
  expect(survivor.hasAttribute("data-sgui-scrolling")).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
  survivor.dispatchEvent(new Event("scroll"));
  expect(survivor.hasAttribute("data-sgui-scrolling")).toBe(false);
});
