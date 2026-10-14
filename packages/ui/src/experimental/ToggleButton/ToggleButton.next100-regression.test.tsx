// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "./ToggleButton";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("initializes default pressed state once per mount and isolates standalone instances", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const otherChange = vi.fn();
  const view = (defaultSelected: boolean, key: string) => <Provider>
    <ToggleButton key={key} defaultSelected={defaultSelected} onSelectedChange={change}>Bold</ToggleButton>
    <ToggleButton onSelectedChange={otherChange}>Italic</ToggleButton>
  </Provider>;
  const { rerender } = render(view(true, "first"));
  expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "Italic" }).getAttribute("aria-pressed")).toBe("false");
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Bold" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(false);
  rerender(view(true, "first"));
  expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("false");
  await user.click(screen.getByRole("button", { name: "Italic" }));
  expect(otherChange).toHaveBeenCalledExactlyOnceWith(true);
  rerender(view(true, "second"));
  expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "Italic" }).getAttribute("aria-pressed")).toBe("true");
  expect(change).toHaveBeenCalledTimes(1);
  expect(otherChange).toHaveBeenCalledTimes(1);
});
