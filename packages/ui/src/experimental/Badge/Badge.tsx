import { forwardRef, type AriaAttributes, type CSSProperties, type ReactNode } from "react";
import styles from "./Badge.module.css";

export interface BadgeProps extends AriaAttributes {
  /** Host-formatted content; zero and overflow text are rendered without capping. */
  content: string | number;
  /** Optional anchor. Content remains accessible text; name icon-only anchors. */
  children?: ReactNode;
  tone?: "neutral" | "primary";
  id?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/** Host aria-label/aria-labelledby names a group; aria-hidden hides the whole badge. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { content, children, tone = "primary", className, ...props }, ref,
) {
  return <span {...props} role={props["aria-label"] || props["aria-labelledby"] ? "group" : undefined}
    ref={ref} className={[styles.root, className].filter(Boolean).join(" ")}
    data-sgui-part="badge" data-attached={children != null || undefined}>
    {children}<span className={styles.content} data-sgui-part="badge-content" data-tone={tone}>{content}</span>
  </span>;
});
