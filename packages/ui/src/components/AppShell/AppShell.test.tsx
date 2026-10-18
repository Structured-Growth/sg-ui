// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
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

it("adds an optional trailing column without replacing main content or the left column", () => {
  const shell = (show: boolean) => <AppShell navigation={<nav aria-label="Routes">Routes</nav>} rightNavigation={show ? <nav aria-label="Page outline">Outline</nav> : undefined}>
    <input aria-label="Draft" defaultValue="Unsaved" />
  </AppShell>;
  const {container, rerender} = render(shell(false));
  const main = screen.getByRole("main");
  const routes = screen.getByRole("navigation", {name:"Routes"});
  const draft = screen.getByRole("textbox") as HTMLInputElement;
  draft.value = "Keep this draft";
  expect(container.querySelector('[data-sgui-part="right-navigation"]')).toBeNull();
  rerender(shell(true));
  const right = container.querySelector('[data-sgui-part="right-navigation"]');
  expect(main.nextElementSibling).toBe(right);
  expect(right?.contains(screen.getByRole("navigation", {name:"Page outline"}))).toBe(true);
  expect(screen.getAllByRole("main")).toHaveLength(1);
  rerender(shell(false));
  expect(screen.getByRole("main")).toBe(main);
  expect(screen.getByRole("navigation", {name:"Routes"})).toBe(routes);
  expect(draft.value).toBe("Keep this draft");
});


it("reveals the whole focus outline in main without scrolling navigation", () => {
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { frames.push(callback); return frames.length; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  const { unmount } = render(<AppShell navigation={<nav aria-label="Routes">Routes</nav>}><button style={{ outlineStyle: "solid", outlineWidth: 2, outlineOffset: 2 }}>Host action</button></AppShell>);
  try {
    const main = screen.getByRole("main");
    const navigation = screen.getByRole("navigation").parentElement!;
    const button = screen.getByRole("button", { name: "Host action" });
    Object.defineProperties(main, { clientHeight: { value: 180 }, scrollHeight: { value: 1200 } });
    main.scrollTop = 400;
    navigation.scrollTop = 125;
    vi.spyOn(main, "getBoundingClientRect").mockReturnValue({ top: 160, bottom: 340, left: 0, right: 320, width: 320, height: 180, x: 0, y: 160, toJSON() {} });
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({ top: 160, bottom: 204, left: 10, right: 210, width: 200, height: 44, x: 10, y: 160, toJSON() {} });
    act(() => button.focus());
    frames.pop()!(0);
    expect(document.activeElement).toBe(button);
    expect(main.scrollTop).toBe(396);
    expect(navigation.scrollTop).toBe(125);
    unmount();
  } finally {
    unmount();
    vi.restoreAllMocks();
  }
});
