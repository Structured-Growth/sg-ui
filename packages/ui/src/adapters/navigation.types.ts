import type { AnchorHTMLAttributes, ComponentType, RefAttributes } from "react";
export type SGLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & RefAttributes<HTMLAnchorElement> & { href: string; replace?: boolean };
export type SGNavigationAdapter = {
  pathname: string;
  navigate: (href: string, options?: { replace?: boolean }) => void;
  Link?: ComponentType<SGLinkProps>;
};
