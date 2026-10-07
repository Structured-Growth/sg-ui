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
  invalid?: boolean;
  description?: string;
  errorMessage?: string;
  name?: string;
  value?: string;
  slot?: "selection";
}
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox({ label, checked, defaultChecked,
  onCheckedChange, mixed, disabled, readOnly, required, invalid, description, errorMessage, name, value, slot }, ref) {
  const labelId = useId();
  return <AriaCheckbox ref={ref} isSelected={checked} defaultSelected={defaultChecked} onChange={onCheckedChange}
    isIndeterminate={mixed} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid} name={name} value={value}
    slot={slot} aria-labelledby={labelId}
    aria-describedby={[description && `${labelId}-description`, errorMessage && `${labelId}-error`].filter(Boolean).join(" ") || undefined} validationBehavior="native" className={styles.root}>
    {({ isSelected, isIndeterminate, isInvalid }) => <>
      <span className={styles.indicator} aria-hidden="true">{isIndeterminate ? "−" : isSelected ? "✓" : ""}</span>
      <span className={styles.content}>
        <span id={labelId}>{label}</span>
        {description && <span id={`${labelId}-description`} className={styles.description}>{description}</span>}
        {isInvalid && errorMessage && <span id={`${labelId}-error`} className={styles.error}>{errorMessage}</span>}
      </span>
    </>}
  </AriaCheckbox>;
});
