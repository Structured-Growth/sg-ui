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
it("keeps current destination host-controlled across removal and router callback replacement", () => {
  const firstNavigate = vi.fn();
  const nextNavigate = vi.fn();
  const removedRef = createRef<HTMLAnchorElement>();
  const survivingRef = createRef<HTMLAnchorElement>();
  function View({ current, removeCourses = false, navigate = firstNavigate }: {
    current: string;
    removeCourses?: boolean;
    navigate?: typeof firstNavigate;
  }) {
    return <SGNavigationProvider value={{ pathname: "/settings", navigate }}>
      <Navigation label="Main">
        {!removeCourses && <NavigationItem ref={removedRef} href="/courses" current={current === "/courses"}>Courses</NavigationItem>}
        <NavigationItem ref={survivingRef} href="/settings" replace current={current === "/settings"} target="_self" rel="author" data-host="settings">Settings</NavigationItem>
      </Navigation>
    </SGNavigationProvider>;
  }
  const { rerender } = render(<View current="/courses" />);
  const settings = screen.getByRole("link", { name: "Settings" });
  expect(screen.getByRole("link", { name: "Courses" }).getAttribute("aria-current")).toBe("page");
  // Pathname and click requests cannot select a destination before the host accepts it.
  expect(settings.hasAttribute("aria-current")).toBe(false);
  fireEvent.click(settings);
  expect(firstNavigate).toHaveBeenCalledExactlyOnceWith("/settings", { replace: true });
  expect(settings.hasAttribute("aria-current")).toBe(false);
  firstNavigate.mockClear();

  rerender(<View current="/settings" removeCourses navigate={nextNavigate} />);
  expect(screen.queryByRole("link", { name: "Courses" })).toBeNull();
  expect(removedRef.current).toBeNull();
  expect(survivingRef.current).toBe(settings);
  expect(settings.getAttribute("aria-current")).toBe("page");
  for (const [attribute, value] of Object.entries({ href: "/settings", target: "_self", rel: "author", "data-host": "settings" })) {
    expect(settings.getAttribute(attribute)).toBe(value);
  }
  expect(settings.hasAttribute("replace")).toBe(false);
  expect(settings.hasAttribute("current")).toBe(false);
  fireEvent.click(settings);
  expect(nextNavigate).toHaveBeenCalledExactlyOnceWith("/settings", { replace: true });
  expect(firstNavigate).not.toHaveBeenCalled();

  rerender(<View current="/removed" removeCourses navigate={nextNavigate} />);
  expect(settings.hasAttribute("aria-current")).toBe(false);
  expect(nextNavigate).toHaveBeenCalledTimes(1);
});
