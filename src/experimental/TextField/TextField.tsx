"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { TextField as AriaTextField } from "react-aria-components/TextField";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import type { Density } from "../../foundation/ThemeScope";
import styles from "./TextField.module.css";

interface FieldOptions extends Pick<InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "placeholder" | "autoComplete" | "autoFocus" | "disabled" | "readOnly" |
  "required" | "minLength" | "maxLength" | "pattern" | "form" | "inputMode" | "onBlur" | "onFocus"> {
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  description?: ReactNode;
  errorMessage?: string;
  invalid?: boolean;
  density?: Density;
  className?: string;
  inputClassName?: string;
  "aria-describedby"?: string;
}

export type TextFieldProps = FieldOptions & (
  { label: string; "aria-label"?: string } | { label?: never; "aria-label": string }
);

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, errorMessage, invalid, density, className, inputClassName,
    disabled, readOnly, required, value, defaultValue, onValueChange, form, inputMode, ...props }, ref,
) {
  return (
    <AriaTextField {...props} value={value} defaultValue={defaultValue} onChange={onValueChange}
      isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid}
      validationBehavior="native" className={[styles.root, className].filter(Boolean).join(" ")}
      data-sgui-density={density} data-sgui-part="field">
      {label && <Label className={styles.label}>{label}</Label>}
      <Input ref={ref} form={form} inputMode={inputMode} className={[styles.input, inputClassName].filter(Boolean).join(" ")}
        data-sgui-part="input" />
      {description && <Text slot="description" className={styles.description}>{description}</Text>}
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaTextField>
  );
});
