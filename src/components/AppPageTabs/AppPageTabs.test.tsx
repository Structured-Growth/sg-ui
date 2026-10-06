// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
