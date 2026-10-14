import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Divider.module.css";
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}
export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider({ orientation = "horizontal", decorative = false, className, ...props }, ref) {
  const elementProps = { ...props, ref: ref as React.Ref<HTMLHRElement>, className: [styles.root, className].filter(Boolean).join(" "),
    "data-orientation": orientation, "aria-orientation": decorative ? undefined : orientation, role: decorative ? "presentation" : "separator" };
  return <hr {...elementProps} />;
});
