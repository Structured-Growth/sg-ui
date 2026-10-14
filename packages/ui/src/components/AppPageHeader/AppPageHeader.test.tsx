// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppPageHeader } from "./AppPageHeader";
import { SGNavigationProvider } from "../../adapters/navigation";
import { Provider } from "../../experimental/Provider/Provider";
afterEach(cleanup);
describe("AppPageHeader", () => {
  it("preserves headings, metadata and native refs with explicit hierarchy", () => {
    const ref = createRef<HTMLElement>(); render(<AppPageHeader ref={ref} title="Biology" headingLevel={2} hierarchy="primary" description="Course details" metaItems={[{ label: "28 Learners", icon: <span>icon</span> }]} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Biology");
    expect(ref.current?.tagName).toBe("HEADER"); expect(ref.current?.getAttribute("data-hierarchy")).toBe("primary");
    expect(screen.getByText("icon").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });
  it("collapses intermediate ancestors into a keyboard menu with host navigation", async () => {
    const navigate = vi.fn(); const user = userEvent.setup();
    render(<SGNavigationProvider value={{ pathname: "/course", navigate }}><AppPageHeader title="Course" breadcrumbs={[{ label: "Org", href: "/" }, { label: "Library", href: "/library" }, { label: "Courses", href: "/courses" }, { label: "Current", href: "/current" }]} /></SGNavigationProvider>);
    expect(screen.getByText("Current").getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Library" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show path" }));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/library", { replace: undefined });
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Show path" })));
  });
  it("skips disabled commands, invokes once, closes and restores focus in scoped portals", async () => {
    const user = userEvent.setup(); const edit = vi.fn(); const locked = vi.fn();
    render(<Provider theme="dark"><AppPageHeader title="Course" moreMenuItems={[{ label: "Locked", disabled: true, onClick: locked }, { label: "Edit", onClick: edit, danger: true }]} /></Provider>);
    await user.tab(); await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu").closest('[data-sgui-theme="dark"]')).not.toBeNull();
    await user.keyboard("{Enter}"); expect(edit).toHaveBeenCalledTimes(1); expect(locked).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "More actions" })));
  });
  it("lets supplied actions take precedence and Escape dismiss without invoking callbacks", async () => {
    const user = userEvent.setup(); const action = vi.fn();
    const { rerender } = render(<AppPageHeader title="Course" actionButtons={<button>Add</button>} moreMenuItems={[{ label: "Edit", onClick: action }]} />);
    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
    rerender(<AppPageHeader title="Course" moreMenuItems={[{ label: "Edit", onClick: action }]} />);
    await user.click(screen.getByRole("button", { name: "More actions" })); await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull(); expect(action).not.toHaveBeenCalled();
  });
});
