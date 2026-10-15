"use client";
import { forwardRef, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { IconButton } from "../../experimental/IconButton/IconButton";
import { Tooltip } from "../../experimental/Tooltip/Tooltip";
import { Typography } from "../../experimental/Typography/Typography";
import { CloseIcon } from "../../experimental/icons/CloseIcon";
import { useTranslation } from "../../i18n";
import styles from "./IconPanelNavigation.module.css";

export interface IconPanelNavigationItem {
  /** Unique, stable identity within this rail. */
  id: string;
  /** Accessible button name, tooltip and panel heading; translated by the host. */
  label: string;
  icon: ReactNode;
  /** Host-supplied content, independent from the main SideNavigation model. */
  content: ReactNode;
  disabled?: boolean;
}
export interface IconPanelNavigationProps {
  items: IconPanelNavigationItem[];
  /** Controlled open panel; null closes all panels. */
  activeId?: string | null;
  /** Initial panel for uncontrolled use. */
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  /** Outer edge occupied by the rail. The panel opens inward. */
  side?: "start" | "end";
  /** Panel width; constrained by the available container width. */
  panelWidth?: CSSProperties["width"];
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

/** Non-modal icon rail and sliding workspace panels; usable independently or in AppShell. */
export const IconPanelNavigation = forwardRef<HTMLDivElement, IconPanelNavigationProps>(function IconPanelNavigation(
  { items, activeId, defaultActiveId = null, onActiveIdChange, side = "start", panelWidth = "20rem", "aria-label": ariaLabel, className, style }, ref,
) {
  const { t } = useTranslation();
  const [internalId, setInternalId] = useState(defaultActiveId);
  const requested = activeId === undefined ? internalId : activeId;
  const selected = items.find(item => item.id === requested && !item.disabled)?.id ?? null;
  const previous = useRef(selected);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const panels = useRef(new Map<string, HTMLElement>());
  const prefix = useId();
  const returnFocus = useRef<string | null>(null);
  const change = (next: string | null) => {
    const panel = selected ? panels.current.get(selected) : undefined;
    if (selected !== next && panel?.contains(panel.ownerDocument.activeElement)) returnFocus.current = selected;
    if (activeId === undefined) setInternalId(next);
    onActiveIdChange?.(next);
  };
  useEffect(() => {
    const old = previous.current;
    if (old !== null && old !== selected) {
      const panel = panels.current.get(old);
      if (returnFocus.current === old || panel?.contains(panel.ownerDocument.activeElement)) buttons.current.get(selected ?? old)?.focus();
    }
    returnFocus.current = null;
    previous.current = selected;
  }, [selected]);
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-side={side} data-sgui-part="icon-panel-navigation">
    <nav className={styles.rail} aria-label={ariaLabel ?? t("common.ui.panelNavigation", { defaultMessage: "Panel navigation" })}>
      {items.map((item, index) => <Tooltip key={item.id} content={item.label} placement={side === "start" ? "end" : "start"} trigger={
        <IconButton ref={node => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }}
          label={item.label} disabled={item.disabled} className={styles.trigger} aria-expanded={selected === item.id} aria-controls={`${prefix}-panel-${index}`}
          onPress={() => change(selected === item.id ? null : item.id)}><span className={styles.icon}>{item.icon}</span></IconButton>
      } />)}
    </nav>
    {items.map((item, index) => <section key={item.id} ref={node => { if (node) panels.current.set(item.id, node); else panels.current.delete(item.id); }}
      id={`${prefix}-panel-${index}`} aria-label={item.label} hidden={selected !== item.id} className={styles.panel} style={{inlineSize:panelWidth}}
      data-sgui-part="icon-navigation-panel" onKeyDown={event => {
        if (event.key === "Escape" && !event.defaultPrevented) { event.stopPropagation(); change(null); }
      }}>
      <div className={styles.header}>
        <Typography as="h2" variant="h6">{item.label}</Typography>
        <IconButton className={styles.trigger} label={t("common.ui.closePanel", { defaultMessage: "Close panel" })} onPress={() => change(null)}><span className={styles.icon}><CloseIcon /></span></IconButton>
      </div>
      <div className={styles.content} data-sgui-part="icon-navigation-content">{item.content}</div>
    </section>)}
  </div>;
});
