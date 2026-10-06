// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Navigation, NavigationItem } from "./Navigation";
import { List, ListItem } from "../List/List";
import { SGNavigationProvider } from "../../adapters/navigation";
afterEach(cleanup);
it("uses links and host navigation with current page and native anchor refs", async () => {
  const navigate = vi.fn(); const ref = createRef<HTMLAnchorElement>();
  render(<SGNavigationProvider value={{ pathname: "/courses", navigate }}><Navigation label="Main"><List><ListItem><NavigationItem ref={ref} href="/courses" current>Courses</NavigationItem></ListItem><ListItem><NavigationItem href="/settings">Settings</NavigationItem></ListItem></List></Navigation></SGNavigationProvider>);
  expect(screen.getByRole("navigation", { name: "Main" })).toBeDefined();
  expect(screen.queryByRole("menu")).toBeNull(); expect(screen.queryByRole("menuitem")).toBeNull();
  expect(ref.current).toBe(screen.getByRole("link", { name: "Courses" })); expect(ref.current?.getAttribute("aria-current")).toBe("page");
  const user = userEvent.setup(); await user.tab(); await user.tab(); await user.keyboard("{Enter}");
  expect(navigate).toHaveBeenCalledWith("/settings", { replace: undefined });
  expect(screen.getByRole("link", { name: "Settings" }).hasAttribute("aria-current")).toBe(false);
});
it("leaves modified internal clicks and external destinations to native navigation", () => {
  const navigate = vi.fn(); render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Navigation label="Help"><NavigationItem href="#guide">Guide</NavigationItem><NavigationItem href="https://example.com" target="_blank">External</NavigationItem></Navigation></SGNavigationProvider>);
  fireEvent.click(screen.getByRole("link", { name: "Guide" }), { ctrlKey: true }); expect(navigate).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: "External" }).getAttribute("rel")).toContain("noopener");
});
