"use client";
import { useId, type ReactElement, type ReactNode } from "react";
import { MenuTrigger, Menu as AriaMenu, MenuItem as AriaMenuItem } from "react-aria-components/Menu";
import { Popover } from "react-aria-components/Popover";
import { useOverlayScope } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../Button/Button";
import styles from "./Menu.module.css";
export interface MenuItem { id: string; label: string; icon?: ReactNode; disabled?: boolean; tone?: "default" | "danger"; }
export interface MenuProps {
  trigger: ReactElement<ButtonProps>;
  label: string;
  items: readonly MenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
}
export function Menu({ trigger, label, items, onAction, open, defaultOpen, onOpenChange, placement = "bottom start" }: MenuProps) {
  const scope = useOverlayScope();
  const labelId = useId();
  return <MenuTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}<Popover {...scope} placement={placement} className={styles.popover}>
      <span id={labelId} className={styles.label}>{label}</span>
      <AriaMenu aria-labelledby={labelId} items={items} onAction={key => onAction?.(String(key))} className={styles.menu}>
        {item => <AriaMenuItem id={item.id} textValue={item.label} isDisabled={item.disabled} data-tone={item.tone} className={styles.item}>
          {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}<span>{item.label}</span>
        </AriaMenuItem>}
      </AriaMenu>
    </Popover>
  </MenuTrigger>;
}
