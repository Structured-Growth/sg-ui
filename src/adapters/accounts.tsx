"use client";
import { createContext, useContext, type ReactNode } from "react";
export type AuthOrganization = { id: string; name: string };
export type StoredAuthSession = {
  accountId: string; email: string; activeOrgId?: string; organizations: AuthOrganization[];
};
/** Host-owned account operations. SGUI never stores credentials or calls auth endpoints. */
export type SGAccountAdapter = {
  getStoredAuthSessions: () => StoredAuthSession[];
  getStoredAuthSession: () => StoredAuthSession | null;
  setActiveStoredAuthSession: (accountId: string) => void;
  markOrganizationSwitched: () => void;
  logoutAccount: (accountId: string) => Promise<void>;
  logoutAllAccounts: () => Promise<void>;
  organizationStorageKey?: string;
};
const emptyAdapter: SGAccountAdapter = {
  getStoredAuthSessions: () => [], getStoredAuthSession: () => null,
  setActiveStoredAuthSession: () => {}, markOrganizationSwitched: () => {},
  logoutAccount: async () => {}, logoutAllAccounts: async () => {},
};
const AccountContext = createContext<SGAccountAdapter | null>(null);
export function SGAccountProvider({ value, children }: { value: SGAccountAdapter; children: ReactNode }) {
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
export function useAccountAdapter() {
  const adapter = useContext(AccountContext);
  return { ...emptyAdapter, ...adapter, enabled: adapter !== null };
}
