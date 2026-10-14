// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SideNavigation, type SideNavigationProps } from "./index";
import { SGNavigationProvider } from "../../adapters/navigation";
import { Provider } from "../../theme";

afterEach(() => { cleanup(); localStorage.clear(); });

it("preserves public native refs and independent navigation state through sibling removal", async () => {
  const model: SideNavigationProps["model"] = {
    user: { initials: "HP", name: "Harry", organization: "School" },
    rootMenu: { id: "root", sections: [{ id: "main", items: [{
      id: "courses", label: "Courses", defaultExpanded: true,
      children: [{ id: "course", label: "Course", href: "/course" }],
    }] }] },
  };
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const firstSelect = vi.fn();
  const secondSelect = vi.fn();
  const firstNavigate = vi.fn();
  const secondNavigate = vi.fn();
  const view = (showFirst: boolean) => <Provider>
    {showFirst && <SGNavigationProvider value={{ pathname: "/course", navigate: firstNavigate }}>
      <SideNavigation ref={firstRef} model={model} aria-label="First workspace" onItemSelect={firstSelect} />
    </SGNavigationProvider>}
    <SGNavigationProvider value={{ pathname: "/other", navigate: secondNavigate }}>
      <SideNavigation ref={secondRef} model={model} aria-label="Second workspace"
        className="host-navigation" style={{ width: "280px" }} onItemSelect={secondSelect} />
    </SGNavigationProvider>
  </Provider>;
  const rendered = render(view(true));
  const first = screen.getByRole("navigation", { name: "First workspace" });
  const second = screen.getByRole("navigation", { name: "Second workspace" });
  expect(firstRef.current).toBe(first);
  expect(secondRef.current).toBe(second);
  expect(second.classList.contains("host-navigation")).toBe(true);
  expect(second.style.width).toBe("280px");
  expect(within(first).getByRole("link", { name: "Course" }).getAttribute("aria-current")).toBe("page");
  expect(within(second).getByRole("link", { name: "Course" }).getAttribute("aria-current")).toBeNull();
  const user = userEvent.setup();
  await user.click(within(first).getByRole("button", { name: "Courses" }));
  expect(within(first).queryByRole("link", { name: "Course" })).toBeNull();
  const secondLink = within(second).getByRole("link", { name: "Course" });
  secondLink.focus();
  await user.keyboard("{Enter}");
  expect(secondNavigate).toHaveBeenCalledExactlyOnceWith("/course", { replace: undefined });
  expect(secondSelect).toHaveBeenCalledExactlyOnceWith("course");
  expect(firstNavigate).not.toHaveBeenCalled();
  expect(firstSelect).not.toHaveBeenCalled();
  await user.click(within(first).getByRole("button", { name: "Collapse navigation" }));
  expect(within(second).getByRole("link", { name: "Course" })).toBe(secondLink);
  rendered.rerender(view(false));
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(second);
  expect(within(second).getByRole("link", { name: "Course" })).toBe(secondLink);
  rendered.unmount();
  expect(secondRef.current).toBeNull();
});
