"use client";
import { useContext, type ReactNode } from "react";
import { NavigationContext } from "./navigationContext";
import type { SGNavigationAdapter } from "./navigation.types";
export type { SGLinkProps, SGNavigationAdapter } from "./navigation.types";
const defaultAdapter: SGNavigationAdapter = {
  pathname: "/",
  navigate: (href, options) => { if (typeof window !== "undefined") { if (options?.replace) window.location.replace(href); else window.location.assign(href); } },
};

export function SGNavigationProvider({ value, children }: { value: SGNavigationAdapter; children: ReactNode }) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
export const useNavigationAdapter = () => useContext(NavigationContext) ?? defaultAdapter;
export const usePathname = () => useNavigationAdapter().pathname;
export const useRouter = () => ({ push: useNavigationAdapter().navigate });
