"use client";
import { useRef, useState } from "react";
import { DateRangeSelector, type DateRangeSelectorProps } from "../DateRangeSelector/DateRangeSelector";
import { Button } from "../Button/Button";
import { Popover } from "../Popover/Popover";
import { useTranslation } from "../../i18n";
import { useCalendarFormReset } from "../DateRangeSelector/useCalendarFormReset";
export type DateRangePickerProps = Omit<DateRangeSelectorProps, "onCancel">;
export function DateRangePicker({ value, defaultValue = null, onValueChange, name, ...props }: DateRangePickerProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState(defaultValue);
  const committed = value === undefined ? internal : value;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useCalendarFormReset(root, () => { if (value === undefined) setInternal(defaultValue); setOpen(false); });
  return <div ref={root}>
    <Popover title={props.label} size="lg" open={open} onOpenChange={setOpen}
      trigger={<Button variant="outlined" tone="neutral" disabled={props.disabled || props.readOnly}
        aria-label={t("common.ui.chooseDate", { defaultMessage: "Choose {label}", values: { label: props.label } })}>
        {props.label}: {committed ? `${committed.start} – ${committed.end}` : t("common.ui.noDates", { defaultMessage: "No dates selected" })}
      </Button>}>
      <DateRangeSelector {...props} value={committed} onCancel={() => setOpen(false)} onValueChange={range => {
        if (value === undefined) setInternal(range); onValueChange?.(range); setOpen(false);
      }} />
    </Popover>
    {name && <><input type="hidden" name={`${name}.start`} value={committed?.start ?? ""} disabled={props.disabled} />
      <input type="hidden" name={`${name}.end`} value={committed?.end ?? ""} disabled={props.disabled} /></>}
  </div>;
}
