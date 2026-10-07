"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
  const [draft, setDraft] = useState(defaultValue ?? "");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const resetting = useRef(false);
  const latest = useRef({ value, defaultValue });
  latest.current = { value, defaultValue };
  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => {
    const owner = inputRef.current?.form;
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      resetting.current = true;
      // Wait for delegated host prevention before applying the latest default.
      const timer = setTimeout(() => {
        pending.delete(timer);
        resetting.current = pending.size > 0;
        if (!event.defaultPrevented && latest.current.value === undefined) {
          setDraft(latest.current.defaultValue ?? "");
        }
      }, 0);
      pending.add(timer);
    };
    owner?.addEventListener("reset", reset, true);
    return () => {
      owner?.removeEventListener("reset", reset, true);
      pending.forEach(timer => clearTimeout(timer));
      resetting.current = false;
    };
  }, [form]);
  const change = (next: string) => {
    // React Aria's field reset must neither notify hosts nor bypass prevention.
    if (resetting.current) return;
    if (value === undefined) setDraft(next);
    onValueChange?.(next);
  };
  return <AriaTextField {...props} value={value ?? draft} onChange={change} isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid} validationBehavior="native"
    className={[field.root, className].filter(Boolean).join(" ")} data-sgui-density={density}>
    {label && <Label className={field.label}>{label}</Label>}
    <AriaTextArea ref={inputRef} form={form} inputMode={inputMode} rows={rows} className={[field.input, styles.input, inputClassName].filter(Boolean).join(" ")} />
    {description && <Text slot="description" className={field.description}>{description}</Text>}
    <FieldError className={field.error}>{errorMessage}</FieldError>
  </AriaTextField>;
});
