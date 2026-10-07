// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppPageTabs } from "./AppPageTabs";
import { SGNavigationProvider } from "../../adapters/navigation";
afterEach(cleanup);
const items = [{ id: "a", label: "Details", href: "/details", content: "Details content" }, { id: "locked", label: "Locked", href: "/locked", disabled: true }, { id: "b", label: "Access", href: "/access", content: "Access content", replace: true }];
describe("AppPageTabs", () => {
  it("connects selected tabs to panels, skips disabled tabs and preserves controlled selection", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const { rerender } = render(<AppPageTabs value="a" items={items} onChange={change} label="Course sections" />);
    const details = screen.getByRole("tab", { name: "Details" });
    expect(details.getAttribute("aria-controls")).toBe(screen.getByRole("tabpanel").id);
    await user.click(details); await user.keyboard("{ArrowRight}");
    expect(change).toHaveBeenLastCalledWith("b"); expect(details.getAttribute("aria-selected")).toBe("true");
    rerender(<AppPageTabs value="b" items={items} onChange={change} />);
    expect(screen.getByRole("tabpanel").textContent).toBe("Access content");
  });
  it("offers manual activation separate from arrow focus", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<AppPageTabs value="a" items={items} onChange={change} activation="manual" />);
    await user.click(screen.getByRole("tab", { name: "Details" })); change.mockClear();
    await user.keyboard("{ArrowRight}"); expect(change).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
    await user.keyboard("{Enter}"); expect(change).toHaveBeenCalledExactlyOnceWith("b");
  });
  it("uses route navigation with current-page semantics, replacement and disabled links", () => {
    const navigate = vi.fn(); render(<SGNavigationProvider value={{ pathname: "/details", navigate }}><AppPageTabs value="a" items={items} /></SGNavigationProvider>);
    expect(screen.getByRole("navigation", { name: "Page sections" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Details" }).getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Locked" })).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: "Access" })); expect(navigate).toHaveBeenCalledExactlyOnceWith("/access", { replace: true });
    navigate.mockClear(); fireEvent.click(screen.getByRole("link", { name: "Access" }), { ctrlKey: true }); expect(navigate).not.toHaveBeenCalled();
  });
});
it("reveals a focused route link inside its overflowing strip without scrolling ancestors", async () => {
  const user = userEvent.setup();
  render(<AppPageTabs value="a" items={items} />);
  const strip = screen.getByRole("navigation");
  const details = screen.getByRole("link", { name: "Details" });
  const access = screen.getByRole("link", { name: "Access" });
  Object.defineProperty(strip, "clientWidth", { value: 260 });
  vi.spyOn(strip, "getBoundingClientRect").mockReturnValue({ left: 16, right: 276 } as DOMRect);
  vi.spyOn(details, "getBoundingClientRect").mockImplementation(() => ({ left: 16 - strip.scrollLeft, right: 140 - strip.scrollLeft } as DOMRect));
  vi.spyOn(access, "getBoundingClientRect").mockImplementation(() => ({ left: 254 - strip.scrollLeft, right: 388 - strip.scrollLeft } as DOMRect));
  const pageScroll = vi.spyOn(window, "scrollTo");
  await user.tab(); expect(document.activeElement).toBe(details);
  await user.tab(); expect(document.activeElement).toBe(access); expect(strip.scrollLeft).toBe(112);
  await user.tab({ shift: true }); expect(strip.scrollLeft).toBe(0);
  expect(pageScroll).not.toHaveBeenCalled();
});

it("keeps duplicate item IDs independent and leaves manual requests under host control", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn(); const secondChange = vi.fn();
  const composition = (first: string) => <>
    <AppPageTabs label="First sections" value={first} items={items} activation="manual" onChange={firstChange} />
    <AppPageTabs label="Second sections" value="a" items={items} activation="manual" onChange={secondChange} />
  </>;
  const { rerender } = render(composition("a"));
  const first = screen.getByRole("tablist", { name: "First sections" });
  const second = screen.getByRole("tablist", { name: "Second sections" });
  const details = within(first).getByRole("tab", { name: "Details" });
  const access = within(first).getByRole("tab", { name: "Access" });
  const other = within(second).getByRole("tab", { name: "Details" });
  expect(details.id).not.toBe(other.id);
  expect(details.getAttribute("aria-controls")).not.toBe(other.getAttribute("aria-controls"));
  expect(screen.queryByRole("link")).toBeNull(); // href does not override tab mode.
  await user.click(details); firstChange.mockClear();
  await user.keyboard("{End}");
  expect(document.activeElement).toBe(access);
  expect(firstChange).not.toHaveBeenCalled();
  await user.keyboard(" ");
  expect(firstChange).toHaveBeenCalledExactlyOnceWith("b");
  expect(details.getAttribute("aria-selected")).toBe("true");
  expect(screen.getAllByRole("tabpanel").map(panel => panel.textContent)).toEqual(["Details content", "Details content"]);
  rerender(composition("b"));
  const panels = screen.getAllByRole("tabpanel");
  expect(panels.map(panel => panel.textContent)).toEqual(["Access content", "Details content"]);
  expect(access.getAttribute("aria-controls")).toBe(panels[0].id);
  expect(panels[0].getAttribute("aria-labelledby")).toBe(access.id);
  expect(other.getAttribute("aria-controls")).toBe(panels[1].id);
  expect(secondChange).not.toHaveBeenCalled();
  await user.keyboard("{Home}");
  expect(document.activeElement).toBe(details);
  expect(access.getAttribute("aria-selected")).toBe("true");
});
it("keeps route mode free of tab panels and tab keyboard selection", async () => {
  const user = userEvent.setup(); const navigate = vi.fn();
  render(<SGNavigationProvider value={{ pathname: "/details", navigate }}><AppPageTabs items={items} value="a" activation="manual" /></SGNavigationProvider>);
  expect(screen.queryByRole("tablist")).toBeNull();
  expect(screen.queryByRole("tabpanel")).toBeNull();
  await user.tab(); await user.keyboard("{ArrowRight}");
  expect(document.activeElement).toBe(screen.getByRole("link", { name: "Details" }));
  expect(navigate).not.toHaveBeenCalled();
  await user.tab(); await user.keyboard("{Enter}");
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/access", { replace: true });
});
