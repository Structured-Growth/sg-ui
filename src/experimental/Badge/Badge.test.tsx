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
it("exposes a host-named overflow badge without replacing its anchor name", () => {
  const { rerender } = render(<Badge content="999+" aria-label="1,234 unread messages">
    <button aria-label="Open inbox">Inbox</button>
  </Badge>);
  expect(screen.getByRole("group", { name: "1,234 unread messages" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Open inbox" })).toBeTruthy();
  rerender(<><span id="badge-label">No unread messages</span>
    <Badge content={0} aria-labelledby="badge-label" />
  </>);
  expect(screen.getByRole("group", { name: "No unread messages" })).toBeTruthy();
});
it("keeps decorative badges hidden and returns unnamed content to plain text", () => {
  const { rerender } = render(<Badge content="99+" aria-label="Unread messages" aria-hidden />);
  expect(screen.queryByRole("group")).toBeNull();
  expect(screen.getByText("99+").closest('[aria-hidden="true"]')).toBeTruthy();
  rerender(<Badge content={99} />);
  expect(screen.queryByRole("group")).toBeNull();
  expect(screen.getByText("99")).toBeTruthy();
});
