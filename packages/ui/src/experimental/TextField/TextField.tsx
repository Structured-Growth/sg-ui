"use client";
import {FieldMessages,type FieldMessagePlacementProps} from "./FieldMessages";
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
  "required" | "minLength" | "maxLength" | "pattern" | "form" | "inputMode" | "onBlur" | "onFocus">, FieldMessagePlacementProps {
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Decorative icons at the logical start/end; keep actions outside these aria-hidden slots. */
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Fixed, non-interactive text or icons before/after the editable value. Not submitted. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Plain content within the outline, or shaded segments with dividers. */
  affixAppearance?: "inline" | "subtle";
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
  { label, description, descriptionPlacement, errorMessage, errorPlacement, invalid, density, className, inputClassName,
    disabled, readOnly, required, value, defaultValue, onValueChange, form, inputMode, startIcon, endIcon, prefix, suffix, affixAppearance = "inline", ...props }, ref,
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
  const hasPrefix = prefix !== undefined && prefix !== null && prefix !== false && prefix !== "";
  const hasSuffix = suffix !== undefined && suffix !== null && suffix !== false && suffix !== "";
  const hasAffixes = hasPrefix || hasSuffix;
  const control = <Input ref={input} form={form} inputMode={inputMode} onChange={event => {
    // Only native edits request host changes. Engine reset callbacks may
    // still originate from a previously associated form.
    const next = event.currentTarget.value;
    setPreservedError(undefined);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }} className={[styles.input, inputClassName].filter(Boolean).join(" ")}
    data-sgui-part="input" />;
  const messages={descriptionPlacement,errorPlacement,description:description&&<Text slot="description" className={styles.description}>{description}</Text>,error:<FieldError className={styles.error}>{errorMessage ?? preservedError}</FieldError>};
  return (
    <AriaTextField {...props} value={value === undefined ? internal : value}
      isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={preservedError ? true : invalid}
      validationBehavior="native" className={[styles.root, className].filter(Boolean).join(" ")}
      data-sgui-density={density} data-sgui-part="field">
      {label && <Label className={styles.label}>{label}</Label>}
      <FieldMessages position="above" {...messages}/>
      {startIcon || endIcon || hasAffixes ? <div className={styles.decoratedControl} data-sgui-part="field-icon-control"
        data-affixes={hasAffixes || undefined} data-affix-appearance={hasAffixes ? affixAppearance : undefined}
        onClick={event => { if (event.target === event.currentTarget && !input.current?.matches(":disabled")) input.current?.focus(); }}>
        {startIcon && <span className={styles.adornment} data-sgui-part="field-start-icon" aria-hidden="true">{startIcon}</span>}
        {hasPrefix && <span className={styles.affix} data-sgui-part="field-prefix" aria-hidden="true">{prefix}</span>}
        {control}
        {hasSuffix && <span className={styles.affix} data-sgui-part="field-suffix" aria-hidden="true">{suffix}</span>}
        {endIcon && <span className={styles.adornment} data-sgui-part="field-end-icon" aria-hidden="true">{endIcon}</span>}
      </div> : control}
      <FieldMessages position="below" {...messages}/>
    </AriaTextField>
  );
});
