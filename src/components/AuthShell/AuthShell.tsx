import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Typography } from "../../experimental/Typography/Typography";
import styles from "./AuthShell.module.css";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerContent?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Presentation only: forms, account actions and routing belong to the host. */
export const AuthShell = forwardRef<HTMLDivElement, AuthShellProps>(function AuthShell(
  { title, subtitle, children, footerContent, className, style }, ref,
) {
  return (
    <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="auth-shell">
      <div className={styles.panel} data-sgui-part="auth-shell-panel">
        <header className={styles.header}>
          <Typography as="h1" variant="h1">{title}</Typography>
          {subtitle ? <Typography tone="muted" className={styles.subtitle}>{subtitle}</Typography> : null}
        </header>
        <div className={styles.content} data-sgui-part="auth-shell-content">{children}</div>
        {footerContent ? <div className={styles.footer} data-sgui-part="auth-shell-footer">{footerContent}</div> : null}
      </div>
    </div>
  );
});
