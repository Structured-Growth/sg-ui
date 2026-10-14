"use client";
import { forwardRef, useId, useImperativeHandle, useRef, useState } from "react";
import { Checkbox as AriaCheckbox } from "react-aria-components/Checkbox";
import { useFormReset } from "../useFormReset";
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
/** The forwarded ref targets the label; its native `control` owns focus and form validation. */
export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox({ label, checked, defaultChecked,
  onCheckedChange, mixed, disabled, readOnly, required, invalid, description, errorMessage, name, value, slot }, ref) {
  const labelId = useId();
  const root = useRef<HTMLLabelElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const selected = checked ?? internalChecked;
  const resetting = useFormReset(root, () => {
    if (slot !== "selection" && checked === undefined) setInternalChecked(defaultChecked ?? false);
  });
  function change(next: boolean) {
    // React Aria's form listener runs before delegated host onReset handlers.
    // Reset requests are handled after cancellation is known, without edit callbacks.
    if (resetting.current) return;
    // Label press handling can run even when a fieldset disables the input.
    // Native :disabled includes fieldset inheritance and its first-legend exception.
    if (root.current?.control?.matches(":disabled")) return;
    if (checked === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  }
  // Collection selection slots inherit their state and requests from the table.
  // Supplying a local selected value would override that collection authority.
  return <AriaCheckbox ref={root} isSelected={slot === "selection" ? checked : selected}
    defaultSelected={slot === "selection" ? defaultChecked : undefined}
    onChange={slot === "selection" ? onCheckedChange : change}
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
