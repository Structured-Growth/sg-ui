"use client";
import { useRef, useState } from "react";
import { DateField, type DateFieldProps } from "../DateField/DateField";
import { Calendar } from "../Calendar/Calendar";
import { Popover } from "../Popover/Popover";
import { Button } from "../Button/Button";
import { useTranslation } from "../../i18n";
import { useFormReset } from "../useFormReset";
import type { DateAvailability } from "../DateRangeSelector/date-contract";
import styles from "./DatePicker.module.css";
export interface DatePickerProps extends Omit<DateFieldProps, "kind" | "hourCycle"> {
  unavailable?: readonly DateAvailability[];
  defaultFocusedDate?: string;
}
export function DatePicker({ value, defaultValue = null, onValueChange, unavailable, defaultFocusedDate, ...props }: DatePickerProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value === undefined ? internal : value;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const unavailableReason = unavailable?.find(day => day.date === selected)?.reason;
  const resetting = useFormReset(root, () => { if (value === undefined) setInternal(defaultValue); setOpen(false); });
  function change(date: string | null) { if (resetting.current) return; if (value === undefined) setInternal(date); onValueChange?.(date); }
  return <div ref={root} className={styles.root}>
    <DateField {...props} value={selected} onValueChange={change} invalid={props.invalid || !!unavailableReason} errorMessage={unavailableReason ?? props.errorMessage} />
    <Popover title={props.label} open={open} onOpenChange={setOpen} trigger={<Button variant="outlined" tone="neutral" disabled={props.disabled || props.readOnly}
      aria-label={t("common.ui.chooseDate", { defaultMessage: "Choose {label}", values: { label: props.label } })}>▦</Button>}>
      <Calendar label={props.label} value={selected} onValueChange={date => { change(date); setOpen(false); }}
        min={props.min} max={props.max} unavailable={unavailable} defaultFocusedDate={selected ?? defaultFocusedDate} />
      {selected && !props.required && !props.disabled && !props.readOnly && <Button variant="outlined" tone="neutral"
        onPress={() => { change(null); setOpen(false); }}>
        {t("common.ui.clear", { defaultMessage: "Clear" })}
      </Button>}
    </Popover>
  </div>;
}
