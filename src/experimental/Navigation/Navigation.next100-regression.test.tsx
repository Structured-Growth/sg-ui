// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import {
  Disclosure, List, ListItem, ListItemButton, Navigation, NavigationItem, Provider,
  type NavigationProps, type NavigationItemProps,
} from "../index";
import { SGNavigationProvider } from "../../adapters/navigation";

afterEach(cleanup);

it("composes public navigation links, disclosure and commands in isolated host scopes through unmount", async () => {
  const user = userEvent.setup();
  const firstNavigate = vi.fn();
  const secondNavigate = vi.fn();
  const command = vi.fn();
  const navRef = createRef<HTMLElement>();
  const linkRef = createRef<HTMLAnchorElement>();
  const navProps: NavigationProps = { label: "First", className: "host-nav", style: { maxWidth: 320 } };
  const itemProps: NavigationItemProps = { href: "/first", current: true, replace: true };
  function View({ showFirst = true }: { showFirst?: boolean }) {
    return <Provider>
      {showFirst && <SGNavigationProvider value={{ pathname: "/first", navigate: firstNavigate }}>
        <Navigation {...navProps} ref={navRef}>
          <List>
            <ListItem><Disclosure label="First courses" defaultExpanded>
              <NavigationItem {...itemProps} ref={linkRef}>First course</NavigationItem>
            </Disclosure></ListItem>
            <ListItem><ListItemButton onPress={command}>Create course</ListItemButton></ListItem>
          </List>
        </Navigation>
      </SGNavigationProvider>}
      <SGNavigationProvider value={{ pathname: "/second", navigate: secondNavigate }}>
        <Navigation label="Second"><Disclosure label="Second courses" defaultExpanded>
          <NavigationItem href="/second" current>Second course</NavigationItem>
        </Disclosure></Navigation>
      </SGNavigationProvider>
    </Provider>;
  }
  const view = render(<View />);
  const first = screen.getByRole("navigation", { name: "First" });
  const second = screen.getByRole("navigation", { name: "Second" });
  const secondLink = within(second).getByRole("link", { name: "Second course" });
  expect(navRef.current).toBe(first);
  expect(first.classList.contains("host-nav")).toBe(true);
  expect(first.style.maxWidth).toBe("320px");
  expect(linkRef.current).toBe(within(first).getByRole("link", { name: "First course" }));
  await user.click(linkRef.current!);
  expect(firstNavigate).toHaveBeenCalledExactlyOnceWith("/first", { replace: true });
  expect(secondNavigate).not.toHaveBeenCalled();
  await user.click(within(first).getByRole("button", { name: "Create course" }));
  expect(command).toHaveBeenCalledTimes(1);
  expect(firstNavigate).toHaveBeenCalledTimes(1);
  await user.click(within(first).getByRole("button", { name: "First courses" }));
  expect(within(first).queryByRole("link")).toBeNull();
  expect(within(second).getByRole("button", { name: "Second courses" }).getAttribute("aria-expanded")).toBe("true");
  expect(secondLink.getAttribute("aria-current")).toBe("page");

  view.rerender(<View showFirst={false} />);
  expect(navRef.current).toBeNull();
  expect(linkRef.current).toBeNull();
  expect(screen.queryByRole("navigation", { name: "First" })).toBeNull();
  expect(within(second).getByRole("link", { name: "Second course" })).toBe(secondLink);
  await user.click(secondLink);
  expect(secondNavigate).toHaveBeenCalledExactlyOnceWith("/second", { replace: undefined });
  expect(firstNavigate).toHaveBeenCalledTimes(1);
  expect(command).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(screen.queryByRole("navigation")).toBeNull();
});
