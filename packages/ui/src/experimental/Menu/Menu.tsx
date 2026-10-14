"use client";
import { useCallback, useId, useRef, type ReactElement, type ReactNode } from "react";
import { MenuTrigger, Menu as AriaMenu, MenuItem as AriaMenuItem, MenuSection } from "react-aria-components/Menu";
import { Popover } from "react-aria-components/Popover";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayScope, useOverlayDirectionRef } from "../../foundation/ThemeScope";
import type { Density } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../Button/Button";
import { useNavigationAdapter } from "../../adapters/navigation";
import styles from "./Menu.module.css";
export interface MenuItem { id: string; label: string; icon?: ReactNode; disabled?: boolean; href?: string; target?: "_blank" | "_self" | "_parent" | "_top"; rel?: string; replace?: boolean; tone?: "default" | "danger"; selected?: boolean; shortcut?: string; separatorBefore?: boolean; }
export interface MenuProps {
  trigger: ReactElement<ButtonProps>;
  label: string;
  density?: Density;
  selectionMode?: "single" | "multiple";
  /** Host-translated retryable action error, kept inside the accessible overlay scope. */
  errorMessage?: string;
  items: readonly MenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
}
export function Menu({ trigger, label, density, selectionMode = "multiple", errorMessage, items, onAction, open, defaultOpen, onOpenChange, placement = "bottom start" }: MenuProps) {
  const { navigate } = useNavigationAdapter();
  const scope = useOverlayScope();
  const { direction } = useLocale();
  const directionRef = useOverlayDirectionRef(direction);
  const labelId = useId();
  const errorId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const removeFocusListener = useRef<(() => void) | null>(null);
  const setMenuRef = useCallback((node: HTMLDivElement | null) => {
    removeFocusListener.current?.();
    removeFocusListener.current = null;
    menuRef.current = node;
    const view = node?.ownerDocument.defaultView;
    if (!node || !view) return;
    let frame: number | null = null;
    let active = true;
    const reconcileContainerFocus = () => {
      if (frame !== null) view.cancelAnimationFrame(frame);
      // Virtual/programmatic entry can defer item focus until after collection
      // autofocus. Follow the committed Aria strategy, rather than picking first.
      frame = view.requestAnimationFrame(() => {
        frame = null;
        if (!active || menuRef.current !== node || !node.isConnected || node.ownerDocument.activeElement !== node) return;
        const item = node.querySelector<HTMLElement>('[role^="menuitem"][data-focused="true"][tabindex="0"]:not([aria-disabled="true"])');
        if (item?.closest('[role="menu"]') === node) item.focus({ preventScroll: true });
      });
    };
    // Native focus does not bubble: only collection focus schedules a repair.
    node.addEventListener("focus", reconcileContainerFocus);
    removeFocusListener.current = () => {
      active = false;
      node.removeEventListener("focus", reconcileContainerFocus);
      if (frame !== null) view.cancelAnimationFrame(frame);
    };
  }, []);
  const groups: MenuItem[][] = [];
  for (const item of items) {
    const group = groups[groups.length - 1];
    if (!group || item.separatorBefore || (group[0].selected === undefined) !== (item.selected === undefined)) groups.push([item]);
    else group.push(item);
  }
  const renderItem = (item: MenuItem) => <AriaMenuItem id={item.id} textValue={item.label} href={item.href} target={item.target}
    rel={item.target === "_blank" ? [...new Set([...(item.rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])].join(" ") : item.rel} onClick={event => {
    if (item.href && (!item.target || item.target === "_self") && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(item.href) && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault(); navigate(item.href, { replace: item.replace });
    }
  }} isDisabled={item.disabled} data-tone={item.tone} className={styles.item}>
    {item.selected !== undefined && <span className={styles.check} aria-hidden="true">{item.selected ? "✓" : ""}</span>}
    {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}<span className={styles.itemLabel}>{item.label}</span>
    {item.shortcut && <span className={styles.shortcut} aria-hidden="true">{item.shortcut}</span>}
  </AriaMenuItem>;
  return <MenuTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}<Popover {...scope} ref={directionRef} data-sgui-density={density ?? scope["data-sgui-density"]} placement={placement} className={styles.popover}>
      <span id={labelId} className={styles.label}>{label}</span>
      {errorMessage && <p id={errorId} role="alert" className={styles.error}>{errorMessage}</p>}
      <AriaMenu ref={setMenuRef} aria-labelledby={labelId} aria-describedby={errorMessage ? errorId : undefined} onAction={key => onAction?.(String(key))} className={styles.menu} data-shortcuts={items.some(item => item.shortcut) || undefined}>
        {groups.map((group, index) => <MenuSection key={group[0].id} items={group}
          selectionMode={group[0].selected === undefined ? "none" : selectionMode}
          selectedKeys={group.filter(item => item.selected).map(item => item.id)}
          onSelectionChange={() => {}} shouldCloseOnSelect
          className={index > 0 && group[0].separatorBefore ? styles.sectionDivider : undefined}>
          {renderItem}
        </MenuSection>)}
      </AriaMenu>
    </Popover>
  </MenuTrigger>;
}
