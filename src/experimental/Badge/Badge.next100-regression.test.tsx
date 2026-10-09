// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { Badge, type BadgeProps } from "./Badge";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

it("keeps composed badge instances independent through updates, removal and remount", () => {
  const inboxRef = createRef<HTMLSpanElement>();
  const alertsRef = createRef<HTMLSpanElement>();
  const inbox: BadgeProps = {
    content: "99+", "aria-label": "123 unread messages", tone: "neutral",
    className: "host-badge", style: { marginInlineStart: 8 }, title: "Inbox count",
  };
  const compose = (content: BadgeProps["content"], showInbox = true) => <ThemeScope>
    {showInbox && <Badge {...inbox} content={content} ref={inboxRef}>
      <button aria-label="Open inbox">Inbox</button>
    </Badge>}
    <Badge content={4} aria-label="4 alerts" ref={alertsRef}>
      <button aria-label="Open alerts">Alerts</button>
    </Badge>
  </ThemeScope>;
  const { rerender, unmount } = render(compose("99+"));
  const alerts = screen.getByRole("group", { name: "4 alerts" });
  const inboxNode = screen.getByRole("group", { name: "123 unread messages" });
  expect(inboxRef.current).toBe(inboxNode);
  expect(inboxNode.tagName).toBe("SPAN");
  expect(inboxNode.classList.contains("host-badge")).toBe(true);
  expect(inboxNode.style.marginInlineStart).toBe("8px");
  expect(inboxNode.title).toBe("Inbox count");
  expect(within(inboxNode).getByRole("button", { name: "Open inbox" })).toBeTruthy();

  rerender(compose(0));
  expect(within(inboxNode).getByText("0")).toBeTruthy();
  expect(within(inboxNode).queryByText("99+")).toBeNull();
  expect(alertsRef.current).toBe(alerts);
  expect(within(alerts).getByText("4")).toBeTruthy();
  expect(within(alerts).getByRole("button", { name: "Open alerts" })).toBeTruthy();

  rerender(compose(0, false));
  expect(inboxRef.current).toBeNull();
  expect(screen.queryByRole("group", { name: "123 unread messages" })).toBeNull();
  expect(alertsRef.current).toBe(alerts);
  rerender(compose("99+"));
  expect(inboxRef.current).not.toBe(inboxNode);
  expect(within(inboxRef.current!).getByText("99+")).toBeTruthy();
  expect(alertsRef.current).toBe(alerts);
  unmount();
  expect(inboxRef.current).toBeNull();
  expect(alertsRef.current).toBeNull();
});
