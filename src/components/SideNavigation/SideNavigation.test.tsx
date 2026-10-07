// @vitest-environment jsdom
import { useState } from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SideNavigation, type SideNavigationModel } from "./SideNavigation";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGAccountProvider, type SGAccountAdapter } from "../../adapters/accounts";
import { Provider } from "../../experimental/Provider/Provider";
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
const model: SideNavigationModel = {
  user: { initials: "HP", name: "Harry Potter", organization: "Hogwarts", email: "harry@example.com", defaultOrganizationId: "org-1", organizations: [{ id: "org-1", name: "Hogwarts", role: "Member", billingScopeLabel: "Billing" }, { id: "org-2", name: "Another School", role: "Member", billingScopeLabel: "Billing" }] },
  rootMenu: { id: "root", sections: [{ id: "main", title: "Workspace", items: [{ id: "courses", label: "Courses", defaultExpanded: true, children: [{ id: "course", label: "Course", href: "/course" }] }, { id: "admin", label: "Admin", childBehavior: "drilldown", children: [{ id: "people", label: "People", href: "/people" }] }] }] },
};
function setup(options: { pathname?: string; accounts?: SGAccountAdapter; onOrganizationChange?: (id: string, accountId?: string) => Promise<void> | void } = {}) {
  const navigate = vi.fn(); const select = vi.fn();
  const view = <Provider theme="dark"><SGNavigationProvider value={{ pathname: options.pathname ?? "/course", navigate }}><SideNavigation model={model} onItemSelect={select} onOrganizationChange={options.onOrganizationChange} /></SGNavigationProvider></Provider>;
  render(options.accounts ? <SGAccountProvider value={options.accounts}>{view}</SGAccountProvider> : view);
  return { navigate, select, user: userEvent.setup() };
}
function accounts(): SGAccountAdapter { return { getStoredAuthSession: () => null, getStoredAuthSessions: () => [], setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(), logoutAccount: vi.fn(async () => {}), logoutAllAccounts: vi.fn(async () => {}) }; }
it("uses native route links, selected state, keyboard activation and collapse", async () => {
  const { navigate, select, user } = setup();
  const link = screen.getByRole("link", { name: "Course" }); expect(link.getAttribute("href")).toBe("/course"); expect(link.getAttribute("aria-current")).toBe("page");
  link.focus(); await user.keyboard("{Enter}"); expect(navigate).toHaveBeenCalledExactlyOnceWith("/course", { replace: undefined }); expect(select).toHaveBeenCalledExactlyOnceWith("course");
  await user.click(screen.getByRole("button", { name: "Courses" })); expect(screen.queryByRole("link", { name: "Course" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Collapse navigation" })); expect(screen.queryByRole("button", { name: "Courses" })).toBeNull();
  const expand = screen.getByRole("button", { name: "Expand navigation" }); expect(document.activeElement).toBe(expand); await user.keyboard(" "); expect(screen.getByRole("button", { name: "Courses" })).toBeTruthy();
});
it("recovers focus on drilldown and back while preserving host navigation", async () => {
  const { navigate, user } = setup(); await user.click(screen.getByRole("button", { name: "Admin" }));
  expect(navigate).toHaveBeenCalledWith("/people"); expect(screen.getByRole("link", { name: "People" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Admin" })); expect(screen.queryByRole("link", { name: "People" })).toBeNull(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Admin" }));
});
it("provides compact scoped account menu, Escape focus, and disabled host account actions", async () => {
  const { user } = setup(); const trigger = screen.getByRole("button", { name: "Harry Potter Hogwarts" }); trigger.focus(); await user.keyboard("{ArrowDown}");
  const menu = screen.getByRole("menu"); expect(menu.closest('[data-sgui-theme="dark"]')).toBeTruthy(); expect(menu.closest('[data-sgui-density="compact"]')).toBeTruthy();
  expect(screen.getByRole("menuitem", { name: "Logout" }).getAttribute("aria-disabled")).toBe("true"); expect(screen.getByRole("menuitem", { name: "Add account" }).getAttribute("aria-disabled")).toBe("true");
  await user.keyboard("{Escape}"); await waitFor(() => expect(document.activeElement).toBe(trigger));
});
it("keeps failed organization switches retryable and does not mark failed selections", async () => {
  const host = accounts(); const change = vi.fn().mockRejectedValueOnce(new Error("failure")).mockResolvedValue(undefined); const { user } = setup({ accounts: host, onOrganizationChange: change });
  const trigger = screen.getByRole("button", { name: "Harry Potter Hogwarts" }); await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Another School" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Unable to switch")); expect(host.markOrganizationSwitched).not.toHaveBeenCalled();
  if (!screen.queryByRole("menu")) await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Another School" }));
  await waitFor(() => expect(host.markOrganizationSwitched).toHaveBeenCalledTimes(1)); expect(change).toHaveBeenNthCalledWith(2, "org-2", undefined); expect(screen.queryByRole("alert")).toBeNull();
});
it("does not navigate after rejected logout and permits retry", async () => {
  const host = accounts(); host.logoutAccount = vi.fn().mockRejectedValueOnce(new Error("failure")).mockResolvedValue(undefined); const { user, navigate } = setup({ accounts: host }); const trigger = screen.getByRole("button", { name: "Harry Potter Hogwarts" });
  await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Logout" })); await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Unable to log out")); expect(navigate).not.toHaveBeenCalled();
  if (!screen.queryByRole("menu")) await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Logout" })); await waitFor(() => expect(navigate).toHaveBeenCalledWith("/login?next=%2Fcourse")); expect(host.logoutAccount).toHaveBeenCalledTimes(2);
});
it("qualifies multiple accounts, switches the requested account and logs out all through the host", async () => {
  const host = accounts(); const sessions = [{ accountId: "a", email: "a@example.com", activeOrgId: "org-1", organizations: [{ id: "org-1", name: "Hogwarts" }] }, { accountId: "b", email: "b@example.com", activeOrgId: "org-2", organizations: [{ id: "org-2", name: "Another School" }] }]; host.getStoredAuthSession = () => sessions[0]; host.getStoredAuthSessions = () => sessions;
  const change = vi.fn(); const { user } = setup({ accounts: host, onOrganizationChange: change }); await user.click(screen.getByRole("button", { name: "Harry Potter Hogwarts" }));
  expect(screen.getByRole("menuitem", { name: "Logout (a@example.com)" })).toBeTruthy(); expect(screen.getByRole("menuitem", { name: "Logout (b@example.com)" })).toBeTruthy();
  await user.click(screen.getByRole("menuitem", { name: "Another School (b@example.com)" })); await waitFor(() => expect(change).toHaveBeenCalledExactlyOnceWith("org-2", "b")); expect(host.setActiveStoredAuthSession).toHaveBeenCalledExactlyOnceWith("b");
  await user.click(screen.getByRole("button", { name: /Harry Potter/ })); await user.click(screen.getByRole("menuitem", { name: "Log out of all accounts" })); await waitFor(() => expect(host.logoutAllAccounts).toHaveBeenCalledTimes(1));
});
it("guards concurrent async account operations and returns focus on success", async () => {
  let finish!: () => void; const change = vi.fn(() => new Promise<void>(resolve => { finish = resolve; })); const { user } = setup({ accounts: accounts(), onOrganizationChange: change }); const trigger = screen.getByRole("button", { name: "Harry Potter Hogwarts" });
  await user.click(trigger); await user.click(screen.getByRole("menuitem", { name: "Another School" })); await user.click(screen.getByRole("menuitem", { name: "Another School" })); expect(change).toHaveBeenCalledTimes(1);
  finish(); await waitFor(() => expect(screen.queryByRole("menu")).toBeNull()); await waitFor(() => expect(document.activeElement).toBe(trigger));
});

for (const action of ["account", "all"] as const) {
  for (const outcome of ["success", "rejection"] as const) {
    for (const boundary of ["replacement", "removal", "unmount"] as const) {
      it(`ignores late ${action} logout ${outcome} after adapter ${boundary}`, async () => {
        let resolve!: () => void;
        let reject!: (error: Error) => void;
        const pending = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
        const oldHost = accounts();
        const sessions = [
          { accountId: "a", email: "a@example.com", organizations: [{ id: "org-1", name: "Hogwarts" }] },
          { accountId: "b", email: "b@example.com", organizations: [{ id: "org-2", name: "Another School" }] },
        ];
        oldHost.getStoredAuthSessions = vi.fn(() => sessions);
        oldHost.logoutAccount = vi.fn(() => pending);
        oldHost.logoutAllAccounts = vi.fn(() => pending);
        const nextHost = accounts();
        let finishNext!: () => void;
        nextHost.logoutAccount = vi.fn(() => new Promise<void>(yes => { finishNext = yes; }));
        const navigate = vi.fn();
        const view = (host?: SGAccountAdapter) => {
          const content = <SideNavigation model={model} />;
          return <Provider><SGNavigationProvider value={{ pathname: "/course", navigate }}>
            {host ? <SGAccountProvider value={host}>{content}</SGAccountProvider> : content}
          </SGNavigationProvider></Provider>;
        };
        const rendered = render(view(oldHost));
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "Harry Potter Hogwarts" }));
        await user.click(screen.getByRole("menuitem", { name: action === "all" ? "Log out of all accounts" : "Logout (a@example.com)" }));
        if (boundary === "unmount") rendered.unmount();
        else {
          rendered.rerender(view(boundary === "replacement" ? nextHost : undefined));
          if (boundary === "removal") await user.click(screen.getByRole("button", { name: "Harry Potter Hogwarts" }));
          await waitFor(() => expect(screen.getByRole("menuitem", { name: "Logout" }).getAttribute("aria-disabled")).toBe(boundary === "replacement" ? null : "true"));
          if (boundary === "replacement") await user.click(screen.getByRole("menuitem", { name: "Logout" }));
        }
        const readsBeforeCompletion = vi.mocked(oldHost.getStoredAuthSessions).mock.calls.length;
        await act(async () => { if (outcome === "success") resolve(); else reject(new Error("late failure")); await pending.catch(() => {}); });
        expect(navigate).not.toHaveBeenCalled();
        expect(oldHost.getStoredAuthSessions).toHaveBeenCalledTimes(readsBeforeCompletion);
        expect(screen.queryByRole("alert")).toBeNull();
        if (boundary === "replacement") {
          expect(screen.getByRole("menu")).toBeTruthy();
          expect(screen.getByRole("menuitem", { name: "Logout" }).getAttribute("aria-disabled")).toBe("true");
          await act(async () => finishNext());
          await waitFor(() => expect(navigate).toHaveBeenCalledExactlyOnceWith("/login?next=%2Fcourse"));
        }
      });
    }
  }
}

it.each(["/settings/people", "/people"])("retains a drilled menu with accepted host routes and restores its parent (%s)", async childHref => {
  const navigate = vi.fn();
  const branchModel: SideNavigationModel = { ...model, rootMenu: { id: "root", sections: [{ id: "main", items: [
    { id: "settings", label: "Settings", href: "/settings", childBehavior: "drilldown", children: [{ id: "people", label: "People", href: childHref }] },
    { id: "home", label: "Home", href: "/home" },
  ] }] } };
  function Host() {
    const [pathname, setPathname] = useState("/home");
    return <Provider><SGNavigationProvider value={{ pathname, navigate: href => { navigate(href); setPathname(href); } }}>
      <SideNavigation model={branchModel} />
    </SGNavigationProvider></Provider>;
  }
  render(<Host />);
  const user = userEvent.setup();
  screen.getByRole("button", { name: "Settings" }).focus();
  await user.keyboard("{Enter}");
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/settings");
  expect(screen.getByRole("link", { name: "People" })).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  await user.keyboard("{Enter}");
  expect(screen.queryByRole("link", { name: "People" })).toBeNull();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  expect(navigate).toHaveBeenCalledTimes(1);
  await user.keyboard("{Enter}");
  expect(screen.getByRole("link", { name: "People" })).toBeTruthy();
  await user.tab(); await user.keyboard("{Enter}");
  expect(screen.getByRole("link", { name: "People" }).getAttribute("aria-current")).toBe("page");
  expect(navigate).toHaveBeenNthCalledWith(3, childHref);
  await user.tab({ shift: true }); await user.keyboard("{Enter}");
  expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
  expect(navigate).toHaveBeenCalledTimes(childHref === "/people" ? 4 : 3);
  if (childHref === "/people") expect(navigate).toHaveBeenLastCalledWith("/settings");
});

// JSDOM supplies no layout/native focus scrolling. These measurements model a
// bordered scrollport after the browser has performed its own focus scroll.
function measuredFocusPort(controlTop: number, initialScroll = 130) {
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
  setup();
  const port = screen.getByRole("navigation").querySelector<HTMLElement>('[data-sgui-part="side-navigation-scroll"]')!;
  const control = screen.getByRole("link", { name: "Course" });
  Object.defineProperties(port, {
    clientTop: { configurable: true, value: 2 },
    clientHeight: { configurable: true, value: 200 },
    scrollHeight: { configurable: true, value: 600 },
  });
  port.scrollTop = initialScroll;
  port.scrollLeft = -15; // RTL horizontal position must remain host/browser-owned.
  vi.spyOn(port, "getBoundingClientRect").mockReturnValue({ top: 100, bottom: 320, height: 220 } as DOMRect);
  vi.spyOn(control, "getBoundingClientRect").mockImplementation(() => ({
    top: controlTop - (port.scrollTop - initialScroll),
    bottom: controlTop + 40 - (port.scrollTop - initialScroll), height: 40,
  } as DOMRect));
  control.style.outlineStyle = "solid";
  control.style.outlineWidth = "2px";
  control.style.outlineOffset = "2px";
  const flush = () => act(() => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(0);
  });
  return { port, control, flush, cancel };
}

it.each([
  { top: 280, expectedScroll: 152 },
  { top: 80, expectedScroll: 104 },
  { top: 160, expectedScroll: 130 },
])("reveals the whole focused control and outline inside the client scrollport ($top)", ({ top, expectedScroll }) => {
  const { port, control, flush } = measuredFocusPort(top);
  control.focus();
  expect(port.scrollTop).toBe(130); // Wait until native focus scrolling has settled.
  flush();
  expect(port.scrollTop).toBe(expectedScroll);
  expect(port.scrollLeft).toBe(-15);
  expect(document.activeElement).toBe(control);
});

it("measures the current native scroll result and clamps the repair to owned scroll bounds", () => {
  const { port, control, flush } = measuredFocusPort(350, 390);
  control.focus();
  // Simulate native scrolling that happens after focus dispatch, before the frame.
  port.scrollTop = 395;
  flush();
  expect(port.scrollTop).toBe(400);
  expect(document.activeElement).toBe(control);
});

it("does not repair scroll or reclaim focus after focus moves to the host", () => {
  const { port, control, flush } = measuredFocusPort(280);
  const host = document.createElement("button");
  document.body.append(host);
  try {
    control.focus();
    host.focus();
    flush();
    expect(port.scrollTop).toBe(130);
    expect(document.activeElement).toBe(host);
  } finally { host.remove(); }
});

it("cancels the pending visibility measurement on unmount", () => {
  const { control, flush, cancel } = measuredFocusPort(280);
  control.focus();
  cleanup();
  expect(cancel).toHaveBeenCalled();
  flush();
});
