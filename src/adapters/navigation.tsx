"use client";
import { createContext, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode, type RefAttributes } from "react";
export type SGLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & RefAttributes<HTMLAnchorElement> & { href: string; replace?: boolean };
export type SGNavigationAdapter = {
  pathname: string;
  navigate: (href: string, options?: { replace?: boolean }) => void;
  Link?: ComponentType<SGLinkProps>;
};
const defaultAdapter: SGNavigationAdapter = {
  pathname: "/",
  navigate: (href, options) => { if (typeof window !== "undefined") { if (options?.replace) window.location.replace(href); else window.location.assign(href); } },
};
const NavigationContext = createContext(defaultAdapter);
export function SGNavigationProvider({ value, children }: { value: SGNavigationAdapter; children: ReactNode }) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
export const useNavigationAdapter = () => useContext(NavigationContext);
export const usePathname = () => useNavigationAdapter().pathname;
export const useRouter = () => ({ push: useNavigationAdapter().navigate });
