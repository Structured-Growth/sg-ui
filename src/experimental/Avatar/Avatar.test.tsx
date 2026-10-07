// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Avatar } from "./Avatar";
afterEach(cleanup);
it("keeps one accessible host name and a stable native root through load/error", () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Avatar ref={ref} alt="Ada Lovelace" src="/ada.png" fallback="AL" size="large" />);
  const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
  expect(ref.current).toBe(avatar);
  const image = avatar.querySelector("img")!;
  expect(image.alt).toBe("");
  expect(image.hasAttribute("data-loaded")).toBe(false);
  fireEvent.load(image);
  expect(image.hasAttribute("data-loaded")).toBe(true);
  fireEvent.error(image);
  expect(avatar.querySelector("img")).toBeNull();
  expect(avatar.textContent).toBe("AL");
  expect(avatar.dataset.size).toBe("large");
  expect(ref.current).toBe(avatar);
});
it("resets failed/loaded images when the host changes the source", () => {
  const { rerender } = render(<Avatar alt="Ada" src="/broken.png" fallback="A" />);
  const avatar = screen.getByRole("img", { name: "Ada" });
  fireEvent.error(avatar.querySelector("img")!);
  rerender(<Avatar alt="Ada" src="/new.png" fallback="A" />);
  expect(avatar.querySelector("img")?.getAttribute("src")).toBe("/new.png");
  fireEvent.load(avatar.querySelector("img")!);
  rerender(<Avatar alt="Ada" src="/third.png" fallback="A" />);
  expect(avatar.querySelector("img")?.hasAttribute("data-loaded")).toBe(false);
});
it("hides decorative fallbacks and renders stably on the server", () => {
  render(<Avatar alt="" fallback="AL" />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText("AL").parentElement?.getAttribute("aria-hidden")).toBe("true");
  expect(renderToString(<Avatar alt="Ada" fallback="A" src="/ada.png" />)).toContain('data-size="medium"');
});
