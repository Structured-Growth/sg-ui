// @vitest-environment jsdom
import { type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
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

function deferred() {
  let resolve!: () => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}
function hostAdapter(): SGAccountAdapter {
  return {
    getStoredAuthSessions: vi.fn(() => []), getStoredAuthSession: vi.fn(() => null),
    setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(),
    logoutAccount: vi.fn(async () => {}), logoutAllAccounts: vi.fn(async () => {}),
  };
}

describe("account adapter lifetimes (H-04/H-05)", () => {
  it.each(["resolve", "reject"] as const)("uses replacement callbacks while the previous host request can %s", async settlement => {
    const previous = hostAdapter();
    const replacement = hostAdapter();
    const pending = deferred();
    previous.logoutAccount = vi.fn(() => pending.promise);
    let host: SGAccountAdapter | null = previous;
    const { result, rerender } = renderHook(useAccountAdapter, {
      wrapper: ({ children }: { children: ReactNode }) => host
        ? <SGAccountProvider value={host}>{children}</SGAccountProvider> : <>{children}</>,
    });
    const operation = result.current.logoutAccount("previous-account");
    const failure = new Error("Previous host diagnostic", { cause: { requestId: "old-request" } });
    const outcome = settlement === "resolve"
      ? expect(operation).resolves.toBeUndefined() : expect(operation).rejects.toBe(failure);
    host = replacement;
    rerender();
    expect(result.current.logoutAccount).toBe(replacement.logoutAccount);
    expect(result.current.logoutAllAccounts).toBe(replacement.logoutAllAccounts);
    expect(result.current.getStoredAuthSessions).toBe(replacement.getStoredAuthSessions);
    await result.current.logoutAccount("replacement-account");
    await act(async () => {
      if (settlement === "resolve") pending.resolve(); else pending.reject(failure);
      await outcome;
    });
    expect(result.current.logoutAccount).toBe(replacement.logoutAccount);
    expect(previous.logoutAccount).toHaveBeenCalledExactlyOnceWith("previous-account");
    expect(replacement.logoutAccount).toHaveBeenCalledExactlyOnceWith("replacement-account");
    expect(replacement.getStoredAuthSessions).not.toHaveBeenCalled();
    expect(replacement.setActiveStoredAuthSession).not.toHaveBeenCalled();
    expect(replacement.markOrganizationSwitched).not.toHaveBeenCalled();
    host = null;
    rerender();
    expect(result.current.enabled).toBe(false);
    expect(result.current.getStoredAuthSessions()).toEqual([]);
    await result.current.logoutAccount("disabled-account");
    expect(replacement.logoutAccount).toHaveBeenCalledTimes(1);
  });

  it.each(["resolve", "reject"] as const)("leaves the host promise caller-owned after unmount and %s", async settlement => {
    const host = hostAdapter();
    const pending = deferred();
    host.logoutAllAccounts = vi.fn(() => pending.promise);
    const { result, unmount } = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => <SGAccountProvider value={host}>{children}</SGAccountProvider>,
    });
    const operation = result.current.logoutAllAccounts();
    expect(operation).toBe(pending.promise);
    const diagnostic = { code: "HOST_REJECTION", requestId: "request-1" };
    const outcome = settlement === "resolve"
      ? expect(operation).resolves.toBeUndefined() : expect(operation).rejects.toBe(diagnostic);
    unmount();
    const replacement = hostAdapter();
    const remounted = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => <SGAccountProvider value={replacement}>{children}</SGAccountProvider>,
    });
    await remounted.result.current.logoutAllAccounts();
    if (settlement === "resolve") pending.resolve(); else pending.reject(diagnostic);
    await outcome;
    expect(remounted.result.current.logoutAllAccounts).toBe(replacement.logoutAllAccounts);
    expect(replacement.logoutAllAccounts).toHaveBeenCalledOnce();
    expect(replacement.getStoredAuthSessions).not.toHaveBeenCalled();
    expect(host.logoutAllAccounts).toHaveBeenCalledOnce();
    expect(host.getStoredAuthSessions).not.toHaveBeenCalled();
    expect(host.markOrganizationSwitched).not.toHaveBeenCalled();
  });

  it("disables new requests when the provider is removed during a pending request", async () => {
    const host = hostAdapter();
    const pending = deferred();
    host.logoutAccount = vi.fn(() => pending.promise);
    let provided = true;
    const { result, rerender } = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => provided
        ? <SGAccountProvider value={host}>{children}</SGAccountProvider> : <>{children}</>,
    });
    const operation = result.current.logoutAccount("old-account");
    provided = false;
    rerender();
    expect(result.current.enabled).toBe(false);
    await result.current.logoutAccount("disabled-account");
    pending.resolve();
    await operation;
    expect(result.current.enabled).toBe(false);
    expect(result.current.getStoredAuthSession()).toBeNull();
    expect(host.logoutAccount).toHaveBeenCalledExactlyOnceWith("old-account");
    expect(host.getStoredAuthSessions).not.toHaveBeenCalled();
  });

  it("isolates nested and sibling providers, including replacement and removal", async () => {
    const outer = hostAdapter();
    const inner = hostAdapter();
    const sibling = hostAdapter();
    const replacement = hostAdapter();
    const pending = deferred();
    inner.logoutAccount = vi.fn(() => pending.promise);
    let innerHost: SGAccountAdapter | null = inner;
    const { result, rerender } = renderHook(() => ({
      outer: useAccountAdapter(),
    }), { wrapper: ({ children }) => <SGAccountProvider value={outer}>{children}</SGAccountProvider> });
    const nested = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => <SGAccountProvider value={outer}>{innerHost
        ? <SGAccountProvider value={innerHost}>{children}</SGAccountProvider> : children}</SGAccountProvider>,
    });
    const adjacent = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => <SGAccountProvider value={sibling}>{children}</SGAccountProvider>,
    });
    const operation = nested.result.current.logoutAccount("inner-account");
    await result.current.outer.logoutAllAccounts();
    await adjacent.result.current.logoutAccount("sibling-account");
    innerHost = replacement;
    nested.rerender();
    rerender();
    expect(nested.result.current.logoutAccount).toBe(replacement.logoutAccount);
    expect(result.current.outer.logoutAccount).toBe(outer.logoutAccount);
    expect(adjacent.result.current.logoutAccount).toBe(sibling.logoutAccount);
    pending.resolve();
    await operation;
    innerHost = null;
    nested.rerender();
    expect(nested.result.current.logoutAccount).toBe(outer.logoutAccount);
    expect(nested.result.current.enabled).toBe(true);
    expect(inner.logoutAccount).toHaveBeenCalledExactlyOnceWith("inner-account");
    expect(outer.logoutAllAccounts).toHaveBeenCalledOnce();
    expect(sibling.logoutAccount).toHaveBeenCalledExactlyOnceWith("sibling-account");
    expect(replacement.logoutAccount).not.toHaveBeenCalled();
  });

  it("preserves overlapping requests, out-of-order rejection diagnostics and explicit retry", async () => {
    const first = deferred();
    const second = deferred();
    const retry = deferred();
    const all = deferred();
    const host = hostAdapter();
    host.logoutAccount = vi.fn().mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise).mockReturnValueOnce(retry.promise);
    host.logoutAllAccounts = vi.fn(() => all.promise);
    const { result } = renderHook(useAccountAdapter, {
      wrapper: ({ children }) => <SGAccountProvider value={host}>{children}</SGAccountProvider>,
    });
    const firstOperation = result.current.logoutAccount("account-1");
    const secondOperation = result.current.logoutAccount("account-1");
    const allOperation = result.current.logoutAllAccounts();
    expect(firstOperation).toBe(first.promise);
    expect(secondOperation).toBe(second.promise);
    expect(allOperation).toBe(all.promise);
    const cause = { code: "HOST_DENIED", requestId: "request-2" };
    const failure = new Error("Host diagnostic", { cause });
    const rejected = expect(secondOperation).rejects.toBe(failure);
    second.reject(failure);
    await rejected;
    expect(failure.cause).toBe(cause);
    const retryOperation = result.current.logoutAccount("account-1");
    expect(retryOperation).toBe(retry.promise);
    retry.resolve();
    await retryOperation;
    all.resolve();
    await allOperation;
    const oldDiagnostic = { code: "OLD_REQUEST_FAILED", requestId: "request-1" };
    const oldRejected = expect(firstOperation).rejects.toBe(oldDiagnostic);
    first.reject(oldDiagnostic);
    await oldRejected;
    expect(host.logoutAccount).toHaveBeenCalledTimes(3);
    expect(host.logoutAllAccounts).toHaveBeenCalledOnce();
    expect(host.getStoredAuthSessions).not.toHaveBeenCalled();
    expect(host.setActiveStoredAuthSession).not.toHaveBeenCalled();
    expect(host.markOrganizationSwitched).not.toHaveBeenCalled();
  });
});
