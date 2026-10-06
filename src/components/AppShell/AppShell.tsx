import { forwardRef, type CSSProperties, type ReactNode } from "react";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  navigation: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  mainId?: string;
  mainLabel?: string;
}

/** The host owns navigation content; the main region scrolls independently. */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell({ navigation, children, className, style, mainId, mainLabel }, ref) {
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="app-shell">
    <div className={styles.navigation} data-sgui-part="navigation">{navigation}</div>
    <main id={mainId} aria-label={mainLabel} className={styles.main} data-sgui-part="main">{children}</main>
  </div>;
});
