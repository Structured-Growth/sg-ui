"use client";
import { forwardRef, type AriaAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { ToggleButton as AriaToggleButton } from "react-aria-components/ToggleButton";
import { ToggleButtonGroup as AriaToggleButtonGroup } from "react-aria-components/ToggleButtonGroup";
import type { Density } from "../../foundation/ThemeScope";
import styles from "./ToggleButton.module.css";

export interface ToggleButtonProps extends AriaAttributes, Pick<ButtonHTMLAttributes<HTMLButtonElement>,
  "id" | "children" | "disabled" | "autoFocus" | "className" | "style" | "title" | "tabIndex"> {
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onPress?: () => void;
  density?: Density;
}
/** A pressed-state action. Form values belong to fields, not editor commands. */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { selected, defaultSelected, onSelectedChange, onPress, disabled, density, className, ...props }, ref,
) {
  return <AriaToggleButton {...props} ref={ref} isSelected={selected} defaultSelected={defaultSelected}
    onChange={onSelectedChange} onPress={onPress} isDisabled={disabled}
    className={[styles.button, className].filter(Boolean).join(" ")}
    data-sgui-density={density} data-sgui-part="toggle-button" />;
});

export interface ToggleOption { id: string; label: string; icon?: ReactNode; disabled?: boolean; }
export interface ToggleButtonGroupProps extends Pick<HTMLAttributes<HTMLDivElement>, "id" | "className" | "style" | "aria-describedby"> {
  label: string;
  options: readonly ToggleOption[];
  selectionMode?: "single" | "multiple";
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Allow the last selected option to be toggled off. Defaults to true. */
  allowEmpty?: boolean;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  density?: Density;
}
/** Owns string IDs and callbacks; upstream collection and state types stay internal. */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(
  { label, options, selectionMode = "single", selectedIds, defaultSelectedIds, onSelectionChange,
    allowEmpty = true, disabled, orientation = "horizontal", density, className, ...props }, ref,
) {
  return <AriaToggleButtonGroup {...props} ref={ref} aria-label={label} selectionMode={selectionMode}
    selectedKeys={selectedIds} defaultSelectedKeys={defaultSelectedIds}
    onSelectionChange={keys => onSelectionChange?.([...keys].map(String))}
    disallowEmptySelection={!allowEmpty} isDisabled={disabled} orientation={orientation}
    className={[styles.group, className].filter(Boolean).join(" ")}
    data-sgui-density={density} data-sgui-part="toggle-button-group">
    {options.map(option => <ToggleButton key={option.id} id={option.id} disabled={option.disabled}>
      {option.icon && <span aria-hidden="true" className={styles.icon}>{option.icon}</span>}{option.label}
    </ToggleButton>)}
  </AriaToggleButtonGroup>;
});
