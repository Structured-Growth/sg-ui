// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Badge } from "./Badge";
afterEach(cleanup);
it("preserves zero and text values without silently capping host content", () => {
  const ref = createRef<HTMLSpanElement>();
  const { rerender } = render(<Badge ref={ref} content={0} aria-label="0 unread messages" />);
  expect(screen.getByText("0")).toBeTruthy();
  expect(ref.current?.getAttribute("aria-label")).toBe("0 unread messages");
  rerender(<Badge content="999+" />);
  expect(screen.getByText("999+")).toBeTruthy();
});
it("keeps attached anchor interactions and accessible names", () => {
  render(<Badge content={4}><button aria-label="Notifications">Inbox</button></Badge>);
  expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
  expect(screen.getByText("4").getAttribute("data-sgui-part")).toBe("badge-content");
});
