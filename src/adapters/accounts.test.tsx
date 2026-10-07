// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { SGAccountProvider, useAccountAdapter, type SGAccountAdapter } from "./accounts";

afterEach(cleanup);
describe("account callback ownership", () => {
  it("returns disabled safe defaults without a host", async () => {
    const { result } = renderHook(useAccountAdapter);
    expect(result.current.enabled).toBe(false);
    expect(result.current.getStoredAuthSessions()).toEqual([]);
    expect(result.current.getStoredAuthSession()).toBeNull();
    await expect(result.current.logoutAllAccounts()).resolves.toBeUndefined();
  });
  it("preserves host records, operation promises and errors without implicit work", async () => {
    let resolve!: () => void;
    const pending = new Promise<void>(done => { resolve = done; });
    const failure = new Error("Host logout failed");
    const session = { accountId: "account-1", email: "host@example.com", activeOrgId: "org-1", organizations: [{ id: "org-1", name: "Host organization" }] };
    const host: SGAccountAdapter = {
      getStoredAuthSessions: vi.fn(() => [session]), getStoredAuthSession: vi.fn(() => session),
      setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(),
      logoutAccount: vi.fn(() => pending), logoutAllAccounts: vi.fn(() => Promise.reject(failure)), organizationStorageKey: "host:organization",
    };
    const { result } = renderHook(useAccountAdapter, { wrapper: ({ children }) => <SGAccountProvider value={host}>{children}</SGAccountProvider> });
    expect(result.current.enabled).toBe(true);
    expect(host.getStoredAuthSessions).not.toHaveBeenCalled();
    expect(result.current.getStoredAuthSession()).toBe(session);
    expect(result.current.getStoredAuthSessions()[0]).toBe(session);
    expect(result.current.organizationStorageKey).toBe("host:organization");
    const operation = result.current.logoutAccount("account-1");
    expect(operation).toBe(pending);
    expect(host.logoutAccount).toHaveBeenCalledExactlyOnceWith("account-1");
    expect(host.setActiveStoredAuthSession).not.toHaveBeenCalled();
    expect(host.markOrganizationSwitched).not.toHaveBeenCalled();
    resolve();
    await expect(operation).resolves.toBeUndefined();
    await expect(result.current.logoutAllAccounts()).rejects.toBe(failure);
    result.current.setActiveStoredAuthSession("account-2");
    result.current.markOrganizationSwitched();
    expect(host.setActiveStoredAuthSession).toHaveBeenCalledExactlyOnceWith("account-2");
    expect(host.markOrganizationSwitched).toHaveBeenCalledOnce();
  });
});
