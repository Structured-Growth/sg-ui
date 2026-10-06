"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Tabs as AriaTabs, TabList, Tab, TabPanel } from "react-aria-components/Tabs";
import styles from "./Tabs.module.css";

export interface TabItem { id: string; label: string; content: ReactNode; disabled?: boolean }
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
    <TabList aria-label={label} className={styles.list}>{items.map(item => <Tab key={item.id} id={item.id} className={styles.tab}>{item.label}</Tab>)}</TabList>
    {items.map(item => <TabPanel key={item.id} id={item.id} className={styles.panel}>{item.content}</TabPanel>)}
  </AriaTabs>;
});
