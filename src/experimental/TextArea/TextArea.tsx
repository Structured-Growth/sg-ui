"use client";
import { forwardRef } from "react";
import { TextField as AriaTextField } from "react-aria-components/TextField";
import { TextArea as AriaTextArea } from "react-aria-components/TextArea";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import type { TextFieldProps } from "../TextField/TextField";
import field from "../TextField/TextField.module.css";
import styles from "./TextArea.module.css";
type MultilineOptions<T> = T extends unknown ? Omit<T, "type" | "pattern" | "inputClassName"> : never;
export type TextAreaProps = MultilineOptions<TextFieldProps> & { rows?: number; inputClassName?: string };
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, description, errorMessage, invalid, density, className, inputClassName, disabled, readOnly, required, value, defaultValue, onValueChange, form, inputMode, rows = 4, ...props }, ref) {
  return <AriaTextField {...props} value={value} defaultValue={defaultValue} onChange={onValueChange} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid} validationBehavior="native"
    className={[field.root, className].filter(Boolean).join(" ")} data-sgui-density={density}>
    {label && <Label className={field.label}>{label}</Label>}
    <AriaTextArea ref={ref} form={form} inputMode={inputMode} rows={rows} className={[field.input, styles.input, inputClassName].filter(Boolean).join(" ")} />
    {description && <Text slot="description" className={field.description}>{description}</Text>}
    <FieldError className={field.error}>{errorMessage}</FieldError>
  </AriaTextField>;
});
