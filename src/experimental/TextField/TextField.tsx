"use client";

import { forwardRef, useRef, useState, useImperativeHandle, type InputHTMLAttributes, type ReactNode } from "react";
import { TextField as AriaTextField } from "react-aria-components/TextField";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import type { Density } from "../../foundation/ThemeScope";
import { useStandaloneFormReset } from "./useStandaloneFormReset";
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
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const [preservedError, setPreservedError] = useState<string | undefined>();
  useStandaloneFormReset(input, () => {
    if (value === undefined) setInternal(defaultValue ?? "");
    setPreservedError(undefined);
  }, () => {
    // The interaction engine clears native validation synchronously even when
    // a delegated host later prevents reset. Retain that displayed error.
    const message = input.current?.getAttribute("aria-invalid") === "true" ? input.current.validationMessage : "";
    return message ? () => setPreservedError(message) : undefined;
  });
  return (
    <AriaTextField {...props} value={value === undefined ? internal : value}
      isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={preservedError ? true : invalid}
      validationBehavior="native" className={[styles.root, className].filter(Boolean).join(" ")}
      data-sgui-density={density} data-sgui-part="field">
      {label && <Label className={styles.label}>{label}</Label>}
      <Input ref={input} form={form} inputMode={inputMode} onChange={event => {
        // Only native edits request host changes. Engine reset callbacks may
        // still originate from a previously associated form.
        const next = event.currentTarget.value;
        setPreservedError(undefined);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }} className={[styles.input, inputClassName].filter(Boolean).join(" ")}
        data-sgui-part="input" />
      {description && <Text slot="description" className={styles.description}>{description}</Text>}
      <FieldError className={styles.error}>{errorMessage ?? preservedError}</FieldError>
    </AriaTextField>
  );
});
