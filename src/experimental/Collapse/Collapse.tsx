import { forwardRef, type HTMLAttributes } from "react";
export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, "hidden"> {
  expanded: boolean;
  /** Keep child state while collapsed by default. Hidden content cannot receive focus. */
  unmountOnCollapse?: boolean;
}
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse({ expanded, unmountOnCollapse = false, children, ...props }, ref) {
  return <div {...props} ref={ref} hidden={!expanded} data-sgui-part="collapse">{expanded || !unmountOnCollapse ? children : null}</div>;
});
