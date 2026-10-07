"use client";
import { forwardRef, useState } from "react";
import { parseDate, parseDateTime, toCalendar, GregorianCalendar } from "@internationalized/date";
import { DateField as AriaDateField, DateInput, DateSegment } from "react-aria-components/DateField";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { useTranslation } from "../../i18n";
import field from "../TextField/TextField.module.css";
import styles from "./DateField.module.css";

export interface DateFieldProps {
  label: string;
  /** date: YYYY-MM-DD; datetime: YYYY-MM-DDTHH:mm:ss without timezone. */
  kind?: "date" | "datetime";
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
export const DateField = forwardRef<HTMLDivElement, DateFieldProps>(function DateField({ label, kind = "date", value,
  defaultValue, onValueChange, min, max, name, description, errorMessage, invalid, required, disabled, readOnly, hourCycle }, ref) {
  const parse = kind === "date" ? parseDate : parseDateTime;
  const { t } = useTranslation();
  const safeParse = (raw: string | null | undefined) => {
    if (!raw || !(kind === "date" ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).test(raw)) return null;
    try { return parse(raw); } catch { return null; }
  };
  const [invalidDefault, setInvalidDefault] = useState(() => Boolean(defaultValue && !safeParse(defaultValue)));
  const parsedValue = value === undefined ? undefined : safeParse(value);
  const invalidInput = value === undefined ? invalidDefault : Boolean(value && !parsedValue);
  const invalidBounds = Boolean((min && !safeParse(min)) || (max && !safeParse(max)));
  return <AriaDateField ref={ref} value={parsedValue}
    defaultValue={safeParse(defaultValue) ?? undefined} onChange={date => { setInvalidDefault(false); onValueChange?.(date ? toCalendar(date, new GregorianCalendar()).toString() : null); }}
    minValue={safeParse(min) ?? undefined} maxValue={safeParse(max) ?? undefined} name={name}
    granularity={kind === "date" ? "day" : "second"} hourCycle={hourCycle}
    isInvalid={invalid || invalidInput || invalidBounds} isRequired={required} isDisabled={disabled} isReadOnly={readOnly} validationBehavior="native" className={field.root}>
    <Label className={field.label}>{label}</Label>
    <DateInput className={[field.input, styles.input].join(" ")}>{segment => <DateSegment segment={segment} className={styles.segment} />}</DateInput>
    {description && <Text slot="description" className={field.description}>{description}</Text>}
    <FieldError className={field.error}>{errorMessage ?? ((invalidInput || invalidBounds) ? t("common.ui.invalidDate", { defaultMessage: "Enter a valid date." }) : undefined)}</FieldError>
  </AriaDateField>;
});
