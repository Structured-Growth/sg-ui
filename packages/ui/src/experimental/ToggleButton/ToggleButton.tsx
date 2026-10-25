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
    onChange={onSelectedChange} onPress={onPress ? () => onPress() : undefined} isDisabled={disabled}
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
  /** Equal widths follow the widest option by default; content sizes each button independently. */
  buttonWidth?: "equal" | "content";
  /** Stagger alternating options across two rows (horizontal) or columns (vertical), using equal widths. */
  layout?: "inline" | "staggered";
  /** Hide visible labels for options with icons; labels remain accessible names. */
  iconOnly?: boolean;
  density?: Density;
}
/** Owns string IDs and callbacks; upstream collection and state types stay internal. */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(
  { label, options, selectionMode = "single", selectedIds, defaultSelectedIds, onSelectionChange,
    allowEmpty = true, disabled, orientation = "horizontal", buttonWidth = "equal", layout = "inline", iconOnly = false, density, className, ...props }, ref,
) {
  const staggered = layout === "staggered";
  return <AriaToggleButtonGroup {...props} ref={ref} aria-label={label} selectionMode={selectionMode}
    selectedKeys={selectedIds} defaultSelectedKeys={defaultSelectedIds}
    onSelectionChange={keys => onSelectionChange?.([...keys].map(String))}
    disallowEmptySelection={!allowEmpty} isDisabled={disabled} orientation={orientation}
    className={[styles.group, className].filter(Boolean).join(" ")}
    data-sgui-density={density} data-layout={staggered ? "staggered" : "inline"} style={{...props.style, ...(staggered ? orientation === "horizontal" ? {gridTemplateColumns: `repeat(${Math.max(4, options.length * 3 + 1)}, 1fr)`} : {gridTemplateRows: `repeat(${Math.max(4, options.length * 3 + 1)}, 1fr)`} : {})}} data-button-width={staggered ? "equal" : buttonWidth} data-sgui-part="toggle-button-group">
    {options.map((option, index) => <ToggleButton key={option.id} id={option.id} style={staggered ? orientation === "horizontal" ? {gridColumn: `${index * 3 + 1} / span 4`, gridRow: index % 2 + 1} : {gridRow: `${index * 3 + 1} / span 4`, gridColumn: index % 2 + 1} : undefined} disabled={option.disabled}
      aria-label={iconOnly && option.icon ? option.label : undefined} title={iconOnly && option.icon ? option.label : undefined}
      data-icon-only={iconOnly && option.icon ? true : undefined}>
      {option.icon && <span aria-hidden="true" className={styles.icon}>{option.icon}</span>}{(!iconOnly || !option.icon) && option.label}
    </ToggleButton>)}
  </AriaToggleButtonGroup>;
});
