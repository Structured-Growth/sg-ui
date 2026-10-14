import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { AppShellMain } from "./AppShellMain";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  navigation: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  mainId?: string;
  mainLabel?: string;
}

/** The host supplies width and navigation; the main region scrolls independently. */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell({ navigation, children, className, style, mainId, mainLabel }, ref) {
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="app-shell">
    <div className={styles.layout}>
      <div className={styles.navigation} data-sgui-part="navigation">{navigation}</div>
      <AppShellMain id={mainId} aria-label={mainLabel} className={styles.main} data-sgui-part="main">{children}</AppShellMain>
    </div>
  </div>;
});
