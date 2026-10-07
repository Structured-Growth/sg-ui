import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ButtonGroup.module.css";
export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "aria-label" | "aria-labelledby"> {
  label: string;
  orientation?: "horizontal" | "vertical";
  joined?: boolean;
}
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup({ label, orientation = "horizontal", joined = false, className, ...props }, ref) {
  return <div {...props} ref={ref} role="group" aria-label={label} data-orientation={orientation} data-joined={joined || undefined} className={[styles.root, className].filter(Boolean).join(" ")} />;
});
