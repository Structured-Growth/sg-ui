// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { SideNavigation } from "../SideNavigation/SideNavigation";
afterEach(cleanup);
it("provides one main landmark with host navigation and native hooks", () => {
  render(<AppShell className="host-shell" mainId="content" mainLabel="Course workspace" navigation={<SideNavigation model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [] } }} />}>Content</AppShell>);
  expect(screen.getByRole("main", { name: "Course workspace" }).id).toBe("content"); expect(screen.getByRole("main").textContent).toBe("Content"); expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  expect(screen.getByRole("main").closest('[data-sgui-part="app-shell"]')?.classList.contains("host-shell")).toBe(true);
});
it("keeps outer customization and region hooks stable when the host resizes independent shells", async () => {
  const { createRef } = await import("react");
  const ref = createRef<HTMLDivElement>();
  const shell = (width: number) => <>
    <AppShell ref={ref} className="host-shell" style={{ inlineSize: width, blockSize: 420 }} mainId="narrow-main" mainLabel="Narrow workspace" navigation={<nav aria-label="Narrow routes">Routes</nav>}>
      <input aria-label="Unsaved host title" defaultValue="Draft" />
    </AppShell>
    <AppShell mainId="wide-main" mainLabel="Wide workspace" navigation={<nav aria-label="Wide routes">Routes</nav>}>Wide content</AppShell>
  </>;
  const { rerender } = render(shell(320));
  const root = ref.current;
  const main = screen.getByRole("main", { name: "Narrow workspace" });
  const input = screen.getByRole("textbox", { name: "Unsaved host title" }) as HTMLInputElement;
  input.value = "Unsaved draft";
  input.focus();
  const layout = main.parentElement;
  expect(layout?.parentElement).toBe(root);
  expect(layout?.querySelector('[data-sgui-part="navigation"] nav')).toBe(screen.getByRole("navigation", { name: "Narrow routes" }));
  expect(main.dataset.sguiPart).toBe("main");
  rerender(shell(900));
  expect(ref.current).toBe(root);
  expect(root?.classList.contains("host-shell")).toBe(true);
  expect(root?.style.inlineSize).toBe("900px");
  expect(root?.style.blockSize).toBe("420px");
  expect(screen.getByRole("main", { name: "Narrow workspace" })).toBe(main);
  expect(document.activeElement).toBe(input);
  expect(input.value).toBe("Unsaved draft");
  expect(screen.getByRole("main", { name: "Wide workspace" }).id).toBe("wide-main");
});
it("keeps main content available when composed navigation collapses and exposes native refs", async () => {
  const { createRef } = await import("react"); const { default: userEvent } = await import("@testing-library/user-event"); const shellRef = createRef<HTMLDivElement>(); const navRef = createRef<HTMLElement>();
  render(<AppShell ref={shellRef} navigation={<SideNavigation ref={navRef} model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [] } }} />}>Learning content</AppShell>);
  expect(shellRef.current?.contains(navRef.current)).toBe(true); await userEvent.setup().click(screen.getByRole("button", { name: "Collapse navigation" })); expect(navRef.current?.hasAttribute("data-collapsed")).toBe(true); expect(screen.getByRole("main").textContent).toBe("Learning content");
});
it("retains an unsaved host field and main node through composed navigation collapse and expansion", async () => {
  const { default: userEvent } = await import("@testing-library/user-event");
  const user = userEvent.setup();
  render(<AppShell mainLabel="Host workspace" navigation={<SideNavigation model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [] } }} />}>
    <label>Host title<input defaultValue="Learning plan" /></label>
  </AppShell>);
  const main = screen.getByRole("main", { name: "Host workspace" });
  const input = screen.getByRole("textbox", { name: "Host title" });
  await user.clear(input);
  await user.type(input, "Unsaved title");
  await user.click(screen.getByRole("button", { name: "Collapse navigation" }));
  await user.click(screen.getByRole("button", { name: "Expand navigation" }));
  expect(screen.getByRole("main", { name: "Host workspace" })).toBe(main);
  expect(screen.getByRole("textbox", { name: "Host title" })).toBe(input);
  expect((input as HTMLInputElement).value).toBe("Unsaved title");
});
