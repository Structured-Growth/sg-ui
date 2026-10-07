import { forwardRef, type AriaAttributes, type CSSProperties, type ReactNode } from "react";
import styles from "./Badge.module.css";

export interface BadgeProps extends AriaAttributes {
  content: string | number;
  /** Optional anchor. Content remains accessible text; name icon-only anchors. */
  children?: ReactNode;
  tone?: "neutral" | "primary";
  id?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { content, children, tone = "primary", className, ...props }, ref,
) {
  return <span {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")}
    data-sgui-part="badge" data-attached={children != null || undefined}>
    {children}<span className={styles.content} data-sgui-part="badge-content" data-tone={tone}>{content}</span>
  </span>;
});
