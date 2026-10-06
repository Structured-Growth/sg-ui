import { forwardRef, type CSSProperties, type ReactNode } from "react";
import styles from "./Status.module.css";

export interface StatusProps {
  children?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Opt in for meaningful host state changes; avoid using this for progress ticks. */
  announcement?: "off" | "polite" | "assertive";
  tone?: "neutral" | "danger";
}

export const Status = forwardRef<HTMLDivElement, StatusProps>(function Status(
  { announcement = "off", tone = "neutral", className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")}
    role={announcement === "polite" ? "status" : announcement === "assertive" ? "alert" : undefined}
    aria-live={announcement} aria-atomic={announcement === "off" ? undefined : true}
    data-tone={tone} data-sgui-part="status" />;
});
