// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SideNavigation, type SideNavigationModel } from "./SideNavigation";
import { SGAccountProvider, type SGAccountAdapter } from "../../adapters/accounts";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(() => { cleanup(); localStorage.clear(); });
const model: SideNavigationModel = {
  user: { initials: "HP", name: "Harry", organization: "School", defaultOrganizationId: "one" },
  rootMenu: { id: "root", sections: [] },
};
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function adapter(): SGAccountAdapter {
  const sessions = [
    { accountId: "a", email: "a@example.com", activeOrgId: "one", organizations: [{ id: "one", name: "School" }] },
    { accountId: "b", email: "b@example.com", activeOrgId: "two", organizations: [{ id: "two", name: "Other" }] },
  ];
  return { getStoredAuthSession: vi.fn(() => sessions[0]), getStoredAuthSessions: vi.fn(() => sessions),
    setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(), logoutAccount: vi.fn(async () => {}), logoutAllAccounts: vi.fn(async () => {}) };
}
for (const boundary of ["callback", "adapter", "session setter", "marker", "storage key", "removal", "unmount"] as const) {
  for (const outcome of ["success", "failure"] as const) {
    it(`ignores obsolete switch ${outcome} after ${boundary} and preserves the current operation`, async () => {
      const old = deferred(); const current = deferred();
      const oldChange = vi.fn(() => old.promise); const nextChange = vi.fn(() => current.promise);
      const host = adapter();
      const nextHost = boundary === "adapter" ? adapter() : boundary === "session setter" ? { ...host, setActiveStoredAuthSession: vi.fn() }
        : boundary === "marker" ? { ...host, markOrganizationSwitched: vi.fn() }
        : boundary === "storage key" ? { ...host, organizationStorageKey: "replacement-organization" } : host;
      const view = (accounts: SGAccountAdapter | null, change: typeof oldChange) => {
        const content = <SideNavigation model={model} onOrganizationChange={change} />;
        return <Provider>{accounts ? <SGAccountProvider value={accounts}>{content}</SGAccountProvider> : content}</Provider>;
      };
      const rendered = render(view(host, oldChange)); const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Harry School" }));
      await user.click(screen.getByRole("menuitem", { name: "Other (b@example.com)" }));
      expect(oldChange).toHaveBeenCalledExactlyOnceWith("two", "b");
      if (boundary === "unmount") rendered.unmount();
      else {
        rendered.rerender(view(boundary === "removal" ? null : nextHost, boundary === "callback" || boundary === "removal" ? nextChange : oldChange));
        // Non-callback boundaries start a second request with the same host callback.
        if (boundary !== "callback" && boundary !== "removal") oldChange.mockImplementation(() => current.promise);
        if (boundary === "removal") await user.click(screen.getByRole("button", { name: "Harry School" }));
        const target = screen.getByRole("menuitem", { name: boundary === "removal" ? "School" : "Other (b@example.com)" });
        await waitFor(() => expect(target.getAttribute("aria-disabled")).not.toBe("true"));
        if (boundary !== "removal") await user.click(target);
      }
      const reads = vi.mocked(host.getStoredAuthSessions).mock.calls.length;
      await act(async () => { if (outcome === "success") old.resolve(); else old.reject(new Error("obsolete")); await old.promise.catch(() => {}); });
      expect(host.getStoredAuthSessions).toHaveBeenCalledTimes(reads);
      expect(host.markOrganizationSwitched).not.toHaveBeenCalled();
      expect(host.setActiveStoredAuthSession).not.toHaveBeenCalled();
      expect(screen.queryByRole("alert")).toBeNull();
      expect(localStorage.getItem("sgui:active-organization")).not.toBe('"two"');
      if (boundary !== "unmount" && boundary !== "removal") {
        expect(screen.getByRole("menu")).toBeTruthy();
        expect(screen.getByRole("menuitem", { name: "Other (b@example.com)" }).getAttribute("aria-disabled")).toBe("true");
        await act(async () => current.resolve());
        await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
        expect(nextHost.markOrganizationSwitched).toHaveBeenCalledTimes(1);
        expect(nextHost.setActiveStoredAuthSession).toHaveBeenCalledExactlyOnceWith("b");
      }
    });
  }
}
it("keeps current-owner failure retryable and prevents concurrent switch/logout requests", async () => {
  const pending = deferred(); const host = adapter(); const change = vi.fn().mockImplementationOnce(() => pending.promise).mockResolvedValue(undefined);
  render(<Provider><SGAccountProvider value={host}><SideNavigation model={model} onOrganizationChange={change} /></SGAccountProvider></Provider>);
  const user = userEvent.setup(); await user.click(screen.getByRole("button", { name: "Harry School" }));
  const target = screen.getByRole("menuitem", { name: "Other (b@example.com)" });
  await user.click(target); await user.click(target); await user.click(screen.getByRole("menuitem", { name: "Logout (a@example.com)" }));
  expect(change).toHaveBeenCalledTimes(1); expect(host.logoutAccount).not.toHaveBeenCalled();
  await act(async () => pending.reject(new Error("current")));
  expect(screen.getByRole("alert").textContent).toContain("Unable to switch");
  await user.click(target); await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(change).toHaveBeenCalledTimes(2); expect(host.markOrganizationSwitched).toHaveBeenCalledTimes(1);
});

for (const boundary of ["callback", "adapter"] as const) {
  for (const outcome of ["success", "failure"] as const) {
    it(`suppresses deferred ${outcome} results after ${boundary} replacement before a new request`, async () => {
      const pending = deferred(); const oldHost = adapter(); const nextHost = boundary === "adapter" ? adapter() : oldHost;
      const oldChange = vi.fn(() => pending.promise); const nextChange = vi.fn();
      const view = (host: SGAccountAdapter, change: typeof oldChange) => <Provider><SGAccountProvider value={host}>
        <SideNavigation model={model} onOrganizationChange={change} />
      </SGAccountProvider></Provider>;
      const rendered = render(view(oldHost, oldChange)); const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Harry School" }));
      await user.click(screen.getByRole("menuitem", { name: "Other (b@example.com)" }));
      rendered.rerender(view(nextHost, boundary === "callback" ? nextChange : oldChange));
      const reads = vi.mocked(oldHost.getStoredAuthSessions).mock.calls.length;
      await act(async () => { if (outcome === "success") pending.resolve(); else pending.reject(new Error("obsolete")); await pending.promise.catch(() => {}); });
      expect(oldHost.markOrganizationSwitched).not.toHaveBeenCalled();
      expect(oldHost.setActiveStoredAuthSession).not.toHaveBeenCalled();
      expect(oldHost.getStoredAuthSessions).toHaveBeenCalledTimes(reads);
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByRole("menu")).toBeTruthy();
      expect(screen.getByRole("menuitem", { name: "Other (b@example.com)" }).getAttribute("aria-disabled")).not.toBe("true");
      expect(localStorage.getItem("sgui:active-organization")).not.toBe('"two"');
    });
  }
}
