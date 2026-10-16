"use client";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TextField as AriaTextField } from "react-aria-components/TextField";
import { TextArea as AriaTextArea } from "react-aria-components/TextArea";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import type { TextFieldProps } from "../TextField/TextField";
import field from "../TextField/TextField.module.css";
import styles from "./TextArea.module.css";
type MultilineOptions<T> = T extends unknown ? Omit<T, "type" | "pattern" | "inputClassName"> : never;
export type TextAreaProps = MultilineOptions<TextFieldProps> & { rows?: number; inputClassName?: string };
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, description, errorMessage, invalid, density, className, inputClassName, disabled, readOnly, required, value, defaultValue, onValueChange, form, inputMode, startIcon, endIcon, rows = 4, ...props }, ref) {
  const [draft, setDraft] = useState(defaultValue ?? "");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [preservedError, setPreservedError] = useState<string | undefined>();
  useImperativeHandle(ref, () => inputRef.current!, []);
  useStandaloneFormReset(inputRef, () => {
    if (value === undefined) setDraft(defaultValue ?? "");
    setPreservedError(undefined);
  }, () => {
    const message = inputRef.current?.getAttribute("aria-invalid") === "true" ? inputRef.current.validationMessage : "";
    return message ? () => setPreservedError(message) : undefined;
  });
  const control = <AriaTextArea ref={inputRef} form={form} inputMode={inputMode} rows={rows} onChange={event => {
      // Only native edits request changes; engine resets can retain an old form.
      const next = event.currentTarget.value;
      setPreservedError(undefined);
      if (value === undefined) setDraft(next);
      onValueChange?.(next);
    }} data-sgui-part="input" className={[field.input, styles.input, inputClassName].filter(Boolean).join(" ")} />;
  return <AriaTextField {...props} value={value ?? draft} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={preservedError ? true : invalid} validationBehavior="native"
    className={[field.root, className].filter(Boolean).join(" ")} data-sgui-density={density}>
    {label && <Label className={field.label}>{label}</Label>}
    {startIcon || endIcon ? <div className={[field.decoratedControl, styles.decoratedControl].join(" ")} data-sgui-part="field-icon-control">
      {startIcon && <span className={[field.adornment, styles.adornment].join(" ")} data-sgui-part="field-start-icon" aria-hidden="true">{startIcon}</span>}
      {control}
      {endIcon && <span className={[field.adornment, styles.adornment].join(" ")} data-sgui-part="field-end-icon" aria-hidden="true">{endIcon}</span>}
    </div> : control}
    {description && <Text slot="description" className={field.description}>{description}</Text>}
    <FieldError className={field.error}>{errorMessage ?? preservedError}</FieldError>
  </AriaTextField>;
});
