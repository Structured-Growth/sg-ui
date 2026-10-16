// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SideNavigation, type SideNavigationModel } from "./SideNavigation";
import { SGAccountProvider, type SGAccountAdapter } from "../../adapters/accounts";
import { SGNavigationProvider } from "../../adapters/navigation";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(() => { cleanup(); localStorage.clear(); });
const model: SideNavigationModel = {
  user: { initials: "HP", name: "Harry", organization: "School", defaultOrganizationId: "one" },
  rootMenu: { id: "root", sections: [] },
};
type Operation = "logoutAccount" | "logoutAllAccounts" | "onOrganizationChange";
const labels: Record<Operation, string> = {
  logoutAccount: "Logout (a@example.com)", logoutAllAccounts: "Log out of all accounts",
  onOrganizationChange: "Other (b@example.com)",
};
function deferred() {
  let resolve!: () => void; let reject!: (cause: unknown) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function setup(operation: Operation) {
  const pending = deferred();
  const diagnostics = vi.fn((_entry: { operation: Operation; cause: unknown }) => {});
  const request = vi.fn().mockImplementationOnce(() => pending.promise).mockResolvedValue(undefined);
  // This is the host boundary documented in react-aria-host-adapter-acceptance.md.
  const action = async (...args: (string | undefined)[]) => {
    try { await request(...args); }
    catch (cause: unknown) { diagnostics({ operation, cause }); throw cause; }
  };
  const sessions = [
    { accountId: "a", email: "a@example.com", activeOrgId: "one", organizations: [{ id: "one", name: "School" }] },
    { accountId: "b", email: "b@example.com", activeOrgId: "two", organizations: [{ id: "two", name: "Other" }] },
  ];
  const host: SGAccountAdapter = {
    getStoredAuthSession: vi.fn(() => sessions[0]), getStoredAuthSessions: vi.fn(() => sessions),
    setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(),
    logoutAccount: vi.fn(async () => {}), logoutAllAccounts: vi.fn(async () => {}),
  };
  const change = operation === "onOrganizationChange" ? action : vi.fn(async () => {});
  if (operation !== "onOrganizationChange") host[operation] = action;
  const navigate = vi.fn();
  const view = (accounts = host, onOrganizationChange = change) => <Provider>
    <SGNavigationProvider value={{ pathname: "/courses", navigate }}>
      <SGAccountProvider value={accounts}><SideNavigation model={model} onOrganizationChange={onOrganizationChange} /></SGAccountProvider>
    </SGNavigationProvider>
  </Provider>;
  return { pending, diagnostics, request, host, change, navigate, view };
}
const operations: Operation[] = ["logoutAccount", "logoutAllAccounts", "onOrganizationChange"];
for (const operation of operations) {
  for (const kind of ["Error(cause)", "opaque"] as const) {
    it(`${operation}: retains ${kind} once, suppresses repeats, shows safe error and explicitly retries`, async () => {
      const h = setup(operation); render(h.view()); const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Harry School" }));
      const target = screen.getByRole("menuitem", { name: labels[operation] });
      await user.click(target); await user.click(target);
      for (const other of operations.filter(value => value !== operation)) {
        await user.click(screen.getByRole("menuitem", { name: labels[other] }));
      }
      expect(h.request).toHaveBeenCalledExactlyOnceWith(...(operation === "logoutAccount" ? ["a"] : operation === "onOrganizationChange" ? ["two", "b"] : []));
      for (const other of operations.filter(value => value !== operation)) {
        expect(other === "onOrganizationChange" ? h.change : h.host[other]).not.toHaveBeenCalled();
      }
      expect(target.getAttribute("aria-disabled")).toBe("true");
      expect(h.diagnostics).not.toHaveBeenCalled();
      const inner = new Error("private cause: credential detail");
      const cause = kind === "opaque" ? { privateToken: "secret", nested: inner } : new Error("private failure", { cause: inner });
      const reads = vi.mocked(h.host.getStoredAuthSessions).mock.calls.length;
      await act(async () => { h.pending.reject(cause); await h.pending.promise.catch(() => {}); });
      expect(h.diagnostics).toHaveBeenCalledTimes(1);
      expect(h.diagnostics.mock.calls[0][0].operation).toBe(operation);
      expect(h.diagnostics.mock.calls[0][0].cause).toBe(cause);
      expect(screen.getByRole("alert").textContent).toBe(operation === "onOrganizationChange"
        ? "Unable to switch organization. Try again." : "Unable to log out. Try again.");
      expect(document.body.textContent).not.toContain("private failure");
      expect(document.body.textContent).not.toContain("credential detail");
      expect(document.body.textContent).not.toContain("secret");
      expect(h.navigate).not.toHaveBeenCalled();
      expect(h.host.setActiveStoredAuthSession).not.toHaveBeenCalled();
      expect(h.host.markOrganizationSwitched).not.toHaveBeenCalled();
      expect(h.host.getStoredAuthSessions).toHaveBeenCalledTimes(reads);
      expect(localStorage.getItem("sgui:active-organization")).not.toBe('"two"');
      expect(target.getAttribute("aria-disabled")).not.toBe("true");
      await user.click(target);
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
      expect(h.request).toHaveBeenCalledTimes(2);
      expect(h.diagnostics).toHaveBeenCalledTimes(1);
      if (operation === "onOrganizationChange") {
        expect(h.host.setActiveStoredAuthSession).toHaveBeenCalledExactlyOnceWith("b");
        expect(h.host.markOrganizationSwitched).toHaveBeenCalledTimes(1);
        expect(h.navigate).not.toHaveBeenCalled();
      } else expect(h.navigate).toHaveBeenCalledTimes(1);
    });
  }
  it(`${operation}: stale rejection remains diagnosed by host without altering the replacement owner`, async () => {
    const h = setup(operation); const rendered = render(h.view()); const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Harry School" }));
    await user.click(screen.getByRole("menuitem", { name: labels[operation] }));
    const replacement = setup(operation);
    rendered.rerender(h.view(replacement.host, replacement.change));
    const target = screen.getByRole("menuitem", { name: labels[operation] });
    await waitFor(() => expect(target.getAttribute("aria-disabled")).not.toBe("true"));
    await user.click(target);
    const reads = vi.mocked(replacement.host.getStoredAuthSessions).mock.calls.length;
    const cause = { obsolete: "private diagnostic" };
    await act(async () => { h.pending.reject(cause); await h.pending.promise.catch(() => {}); });
    expect(h.diagnostics).toHaveBeenCalledTimes(1);
    expect(h.diagnostics.mock.calls[0][0].cause).toBe(cause);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(target.getAttribute("aria-disabled")).toBe("true");
    expect(h.navigate).not.toHaveBeenCalled();
    expect(h.host.markOrganizationSwitched).not.toHaveBeenCalled();
    expect(h.host.setActiveStoredAuthSession).not.toHaveBeenCalled();
    expect(replacement.host.getStoredAuthSessions).toHaveBeenCalledTimes(reads);
    expect(replacement.host.markOrganizationSwitched).not.toHaveBeenCalled();
    expect(replacement.host.setActiveStoredAuthSession).not.toHaveBeenCalled();
    await act(async () => replacement.pending.resolve());
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(h.request).toHaveBeenCalledTimes(1);
    expect(replacement.request).toHaveBeenCalledTimes(1);
    expect(replacement.diagnostics).not.toHaveBeenCalled();
  });
}
