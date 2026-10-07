// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { SideNavigation } from "../SideNavigation/SideNavigation";
afterEach(cleanup);
it("provides one main landmark with host navigation and native hooks", () => {
  render(<AppShell className="host-shell" mainId="content" mainLabel="Course workspace" navigation={<SideNavigation model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [] } }} />}>Content</AppShell>);
  expect(screen.getByRole("main", { name: "Course workspace" }).id).toBe("content"); expect(screen.getByRole("main").textContent).toBe("Content"); expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  expect(screen.getByRole("main").parentElement?.classList.contains("host-shell")).toBe(true);
});
it("keeps main content available when composed navigation collapses and exposes native refs", async () => {
  const { createRef } = await import("react"); const { default: userEvent } = await import("@testing-library/user-event"); const shellRef = createRef<HTMLDivElement>(); const navRef = createRef<HTMLElement>();
  render(<AppShell ref={shellRef} navigation={<SideNavigation ref={navRef} model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [] } }} />}>Learning content</AppShell>);
  expect(shellRef.current?.contains(navRef.current)).toBe(true); await userEvent.setup().click(screen.getByRole("button", { name: "Collapse navigation" })); expect(navRef.current?.hasAttribute("data-collapsed")).toBe(true); expect(screen.getByRole("main").textContent).toBe("Learning content");
});
