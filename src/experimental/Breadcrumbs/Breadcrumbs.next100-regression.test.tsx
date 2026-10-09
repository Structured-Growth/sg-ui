// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SGNavigationProvider } from "../../adapters/navigation";
import { Breadcrumbs, type BreadcrumbItem, type BreadcrumbsProps } from "../index";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("updates one public breadcrumb composition and releases its nav ref without changing a sibling", () => {
  const firstNavigate = vi.fn();
  const siblingNavigate = vi.fn();
  const navRef = createRef<HTMLElement>();
  const longLabel = "An ancestor course title with complete descriptive text ".repeat(8);
  const initial: readonly BreadcrumbItem[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "course", label: longLabel, href: "/course" },
  ];
  function Composition({ items }: Pick<BreadcrumbsProps, "items">) {
    return <Provider>
      <SGNavigationProvider value={{ pathname: "/course", navigate: firstNavigate }}>
        <Breadcrumbs ref={navRef} label="First hierarchy" items={items} className="host-breadcrumbs" style={{ maxWidth: 200 }} />
      </SGNavigationProvider>
      <SGNavigationProvider value={{ pathname: "/other/current", navigate: siblingNavigate }}>
        <Breadcrumbs label="Sibling hierarchy" items={[{ id: "other", label: "Other", href: "/other" }, { id: "current", label: "Sibling current" }]} />
      </SGNavigationProvider>
    </Provider>;
  }
  const view = render(<Composition items={initial} />);
  const firstNav = screen.getByRole("navigation", { name: "First hierarchy" });
  const siblingNav = screen.getByRole("navigation", { name: "Sibling hierarchy" });
  expect(navRef.current).toBe(firstNav);
  expect(firstNav.classList.contains("host-breadcrumbs")).toBe(true);
  expect(firstNav.style.maxWidth).toBe("200px");
  expect(within(firstNav).getByText(longLabel.trim()).getAttribute("aria-current")).toBe("page");

  view.rerender(<Composition items={[initial[0], { ...initial[1], href: "/renamed-course" }, { id: "lesson", label: "New lesson", href: "/lesson" }]} />);
  expect(navRef.current).toBe(firstNav);
  const ancestor = within(firstNav).getByRole("link", { name: longLabel.trim() });
  expect(ancestor.textContent).toBe(longLabel);
  expect(ancestor.getAttribute("href")).toBe("/renamed-course");
  expect(within(firstNav).getByText("New lesson").getAttribute("aria-current")).toBe("page");
  fireEvent.click(ancestor);
  expect(firstNavigate).toHaveBeenCalledWith("/renamed-course", { replace: undefined });
  expect(siblingNavigate).not.toHaveBeenCalled();
  expect(within(siblingNav).getByText("Sibling current").getAttribute("aria-current")).toBe("page");
  fireEvent.click(within(siblingNav).getByRole("link", { name: "Other" }));
  expect(siblingNavigate).toHaveBeenCalledWith("/other", { replace: undefined });
  expect(firstNavigate).toHaveBeenCalledTimes(1);

  view.rerender(<Composition items={[{ id: "course", label: "Renamed current", href: "/renamed-course" }]} />);
  expect(within(firstNav).queryByRole("link")).toBeNull();
  expect(within(firstNav).getByText("Renamed current").getAttribute("aria-current")).toBe("page");
  expect(within(siblingNav).getAllByRole("listitem")).toHaveLength(2);
  view.unmount();
  expect(navRef.current).toBeNull();
});
