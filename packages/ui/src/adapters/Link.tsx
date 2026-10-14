"use client";
import { forwardRef, useContext } from "react";
import type { SGLinkProps } from "./navigation";
import { NavigationContext } from "./navigationContext";
const Link = forwardRef<HTMLAnchorElement, SGLinkProps>(function SGLink({ children, replace, ...props }, ref) {
  const adapter = useContext(NavigationContext);
  // Match the owned Link default: absolute/protocol-relative destinations stay native.
  const external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(props.href);
  const CustomLink = external ? undefined : adapter?.Link;
  if (CustomLink) return <CustomLink {...props} replace={replace} ref={ref}>{children}</CustomLink>;
  return <a {...props} ref={ref} onClick={(event) => {
    props.onClick?.(event);
    if (adapter && !external && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (!props.target || props.target === "_self") && (props.download === undefined || props.download === false)) {
      event.preventDefault();
      adapter.navigate(props.href, { replace });
    }
  }}>{children}</a>;
});
export default Link;
