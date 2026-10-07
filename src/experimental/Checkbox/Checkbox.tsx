"use client";
import { forwardRef, useId } from "react";
import { Checkbox as AriaCheckbox } from "react-aria-components/Checkbox";
import styles from "./Checkbox.module.css";
export interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  mixed?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  slot?: "selection";
}
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox({ label, checked, defaultChecked,
  onCheckedChange, mixed, disabled, readOnly, required, name, value, slot }, ref) {
  const labelId = useId();
  return <AriaCheckbox ref={ref} isSelected={checked} defaultSelected={defaultChecked} onChange={onCheckedChange}
    isIndeterminate={mixed} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} name={name} value={value}
    slot={slot} aria-labelledby={labelId} validationBehavior="native" className={styles.root}>
    {({ isSelected, isIndeterminate }) => <><span className={styles.indicator} aria-hidden="true">{isIndeterminate ? "−" : isSelected ? "✓" : ""}</span><span id={labelId}>{label}</span></>}
  </AriaCheckbox>;
});
