"use client";
import { forwardRef } from "react";
import { useNavigationAdapter, type SGLinkProps } from "./navigation";
const Link = forwardRef<HTMLAnchorElement, SGLinkProps>(function SGLink({ children, replace, ...props }, ref) {
  const { Link: CustomLink, navigate } = useNavigationAdapter();
  if (CustomLink) return <CustomLink {...props} replace={replace} ref={ref}>{children}</CustomLink>;
  return <a {...props} ref={ref} onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (!props.target || props.target === "_self") && (props.download === undefined || props.download === false)) {
      event.preventDefault();
      navigate(props.href, { replace });
    }
  }}>{children}</a>;
});
export default Link;
