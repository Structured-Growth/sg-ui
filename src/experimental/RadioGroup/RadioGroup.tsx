"use client";
import { forwardRef, type CSSProperties } from "react";
import { RadioGroup as AriaRadioGroup, Radio } from "react-aria-components/RadioGroup";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import styles from "./RadioGroup.module.css";
export interface RadioOption { value: string; label: string; disabled?: boolean; }
export interface RadioGroupProps {
  label: string;
  options: readonly RadioOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  description?: string;
  errorMessage?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({ label, options, value, defaultValue, onValueChange, disabled, readOnly, required, invalid, name, description, errorMessage, orientation = "vertical", className, style }, ref) {
  return <AriaRadioGroup ref={ref} value={value} defaultValue={defaultValue} onChange={onValueChange} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid} name={name} orientation={orientation}
    validationBehavior="native" className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
    <Label className={styles.label}>{label}</Label><div className={styles.options} data-orientation={orientation}>
      {options.map(option => <Radio key={option.value} value={option.value} isDisabled={option.disabled} className={styles.radio}><span aria-hidden="true" className={styles.indicator} />{option.label}</Radio>)}
    </div>{description && <Text slot="description" className={styles.description}>{description}</Text>}<FieldError className={styles.error}>{errorMessage}</FieldError>
  </AriaRadioGroup>;
});
