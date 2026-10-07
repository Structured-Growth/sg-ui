"use client";
import { forwardRef, useCallback, useRef, useState } from "react";
import { parseTime } from "@internationalized/date";
import { TimeField as AriaTimeField, DateInput, DateSegment } from "react-aria-components/TimeField";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { useFormReset } from "../useFormReset";
import { useTranslation } from "../../i18n";
import field from "../TextField/TextField.module.css";
import styles from "../DateField/DateField.module.css";

export interface TimeFieldProps {
  label: string;
  /** Local clock time HH:mm:ss; this is not an instant. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  min?: string;
  max?: string;
  name?: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourCycle?: 12 | 24;
}
export const TimeField = forwardRef<HTMLDivElement, TimeFieldProps>(function TimeField({ label, value, defaultValue,
  onValueChange, min, max, name, description, errorMessage, invalid, required, disabled, readOnly, hourCycle }, ref) {
  const { t } = useTranslation();
  const safeParse = (raw: string | null | undefined) => {
    if (!raw || !/^\d{2}:\d{2}:\d{2}$/.test(raw)) return null;
    try { return parseTime(raw); } catch { return null; }
  };
  const [invalidDefault, setInvalidDefault] = useState(() => Boolean(defaultValue && !safeParse(defaultValue)));
  const root = useRef<HTMLDivElement | null>(null);
  const nativeRef = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === "function") return ref(node);
    if (ref) ref.current = node;
  }, [ref]);
  // Restore owned parse feedback alongside the interaction engine's default.
  // The shared helper waits for delegated host reset prevention.
  useFormReset(root, () => {
    if (value === undefined) setInvalidDefault(Boolean(defaultValue && !safeParse(defaultValue)));
  });
  const parsedValue = value === undefined ? undefined : safeParse(value);
  const invalidInput = value === undefined ? invalidDefault : Boolean(value && !parsedValue);
  const invalidBounds = Boolean((min && !safeParse(min)) || (max && !safeParse(max)));
  return <AriaTimeField ref={nativeRef} value={parsedValue}
    defaultValue={safeParse(defaultValue) ?? undefined} onChange={time => { setInvalidDefault(false); onValueChange?.(time?.toString() ?? null); }}
    minValue={safeParse(min) ?? undefined} maxValue={safeParse(max) ?? undefined} name={name}
    granularity="second" hourCycle={hourCycle} isInvalid={invalid || invalidInput || invalidBounds} isRequired={required} isDisabled={disabled} isReadOnly={readOnly}
    validationBehavior="native" className={field.root}>
    <Label className={field.label}>{label}</Label>
    <DateInput className={[field.input, styles.input].join(" ")}>{segment => <DateSegment segment={segment} className={styles.segment} />}</DateInput>
    {description && <Text slot="description" className={field.description}>{description}</Text>}
    <FieldError className={field.error}>{errorMessage ?? ((invalidInput || invalidBounds) ? t("common.ui.invalidTime", { defaultMessage: "Enter a valid time." }) : undefined)}</FieldError>
  </AriaTimeField>;
});
