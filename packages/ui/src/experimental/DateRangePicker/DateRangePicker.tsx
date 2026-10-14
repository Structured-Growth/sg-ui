"use client";
import { useEffect, useRef, useState } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const restoreResetFocus = useRef(false);
  useCalendarFormReset(root, () => {
    const active = root.current?.ownerDocument.activeElement;
    restoreResetFocus.current = open && Boolean(active && calendarRef.current?.contains(active));
    if (value === undefined) setInternal(defaultValue);
    setOpen(false);
  });
  useEffect(() => {
    if (open || !restoreResetFocus.current) return;
    restoreResetFocus.current = false;
    const trigger = triggerRef.current;
    const view = trigger?.ownerDocument.defaultView;
    if (!trigger || !view) return;
    // Accepted native reset can dispose the focused scope before its ordinary
    // restoration records ownership. Repair only stranded body focus after close.
    const frame = view.requestAnimationFrame(() => {
      if (trigger.isConnected && !trigger.disabled
        && !trigger.closest('[inert], [hidden], [aria-hidden="true"]')
        && trigger.ownerDocument.activeElement === trigger.ownerDocument.body) trigger.focus();
    });
    return () => view.cancelAnimationFrame(frame);
  }, [open]);
  return <div ref={root}>
    <Popover title={props.label} size="lg" open={open} onOpenChange={setOpen}
      trigger={<Button ref={triggerRef} variant="outlined" tone="neutral" disabled={props.disabled || props.readOnly}
        aria-label={t("common.ui.chooseDate", { defaultMessage: "Choose {label}", values: { label: props.label } })}>
        {props.label}: {committed ? `${committed.start} – ${committed.end}` : t("common.ui.noDates", { defaultMessage: "No dates selected" })}
      </Button>}>
      <div ref={calendarRef}><DateRangeSelector {...props} value={committed} onCancel={() => setOpen(false)} onValueChange={range => {
        if (value === undefined) setInternal(range); onValueChange?.(range); setOpen(false);
      }} /></div>
    </Popover>
    {name && <><input type="hidden" name={`${name}.start`} value={committed?.start ?? ""} disabled={props.disabled} />
      <input type="hidden" name={`${name}.end`} value={committed?.end ?? ""} disabled={props.disabled} /></>}
  </div>;
}
