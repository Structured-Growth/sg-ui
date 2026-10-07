"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Tabs as AriaTabs, TabList, Tab, TabPanel } from "react-aria-components/Tabs";
import { scrollTabIntoView } from "./scrollTabIntoView";
import styles from "./Tabs.module.css";

export interface TabItem { id: string; label: string; content: ReactNode; icon?: ReactNode; disabled?: boolean }
export interface TabsProps {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activation?: "automatic" | "manual";
  className?: string;
  style?: CSSProperties;
}
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { label, items, value, defaultValue, onValueChange, activation = "automatic", className, style }, ref,
) {
  return <AriaTabs ref={ref} selectedKey={value} defaultSelectedKey={defaultValue}
    onSelectionChange={key => onValueChange?.(String(key))} disabledKeys={items.filter(item => item.disabled).map(item => item.id)}
    keyboardActivation={activation} style={style} className={[styles.root, className].filter(Boolean).join(" ")}>
    <div className={styles.strip} onFocusCapture={event => {
      const strip = event.currentTarget.firstElementChild;
      if (strip instanceof HTMLElement) scrollTabIntoView(strip, event.target as HTMLElement);
    }}><TabList aria-label={label} className={styles.list}>{items.map(item => <Tab key={item.id} id={item.id} className={styles.tab}>{item.icon && <span aria-hidden="true" className={styles.icon}>{item.icon}</span>}{item.label}</Tab>)}</TabList></div>
    {items.map(item => <TabPanel key={item.id} id={item.id} className={styles.panel}>{item.content}</TabPanel>)}
  </AriaTabs>;
});
