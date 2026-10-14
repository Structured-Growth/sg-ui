"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { scrollTabIntoView } from "../../experimental/Tabs/scrollTabIntoView";
import { Tabs } from "../../experimental/Tabs/Tabs";
import { Link } from "../../experimental/Link/Link";
import { useTranslation } from "../../i18n";
import styles from "./AppPageTabs.module.css";

export type AppPageTabItem = {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  replace?: boolean;
  disabled?: boolean;
  /** Controlled tabs own their associated panel. Route tabs omit content. */
  content?: ReactNode;
};
export type AppPageTabsProps = {
  value: string;
  items: readonly AppPageTabItem[];
  onChange?: (value: string) => void;
  density?: "default" | "comfortable" | "compact";
  label?: string;
  activation?: "automatic" | "manual";
  className?: string;
  style?: CSSProperties;
};
export const AppPageTabs = forwardRef<HTMLDivElement, AppPageTabsProps>(function AppPageTabs(
  { value, items, onChange, density = "default", label, activation, className, style }, ref,
) {
  const { t } = useTranslation();
  const name = label ?? t("common.ui.pageTabs", { defaultMessage: "Page sections" });
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="page-tabs" data-sgui-density={density === "default" ? undefined : density}>
    {onChange ? <Tabs label={name} items={items.map(item => ({ ...item, content: item.content ?? null }))}
      value={value} onValueChange={onChange} activation={activation} /> :
      <nav aria-label={name} className={styles.navigation} onFocusCapture={event => scrollTabIntoView(event.currentTarget, event.target as HTMLElement)}>{items.map(item => item.disabled || !item.href ?
        <span key={item.id} className={styles.link} aria-disabled={item.disabled || undefined} aria-current={item.id === value ? "page" : undefined}>
          {item.icon && <span aria-hidden="true" className={styles.icon}>{item.icon}</span>}{item.label}
        </span> : <Link key={item.id} href={item.href} replace={item.replace} underline="none" tone="inherit"
          className={styles.link} aria-current={item.id === value ? "page" : undefined}>
          {item.icon && <span aria-hidden="true" className={styles.icon}>{item.icon}</span>}{item.label}
        </Link>)}</nav>}
  </div>;
});
