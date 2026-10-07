"use client";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import SGLink from "../../adapters/Link";
import styles from "./Link.module.css";
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  /** Absolute and protocol-relative URLs use native navigation by default. */
  external?: boolean;
  underline?: "always" | "hover" | "none";
  tone?: "primary" | "inherit";
}
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href), replace, underline = "hover", tone = "primary", className, rel, target, ...props }, ref) {
  const nativeProps = { ...props, href, target, ref, rel: target === "_blank" ? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])].join(" ") : rel,
    className: [styles.root, className].filter(Boolean).join(" "), "data-underline": underline, "data-tone": tone };
  return external ? <a {...nativeProps} /> : <SGLink {...nativeProps} replace={replace} />;
});
