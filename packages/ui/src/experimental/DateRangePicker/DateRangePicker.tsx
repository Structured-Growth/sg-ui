"use client";
import {FieldMessages} from "../TextField/FieldMessages";
import {CalendarFormValidity} from "../DateRangeSelector/CalendarFormValidity";
import { useEffect, useId, useRef, useState } from "react";
import { DateRangeSelector, type DateRangeSelectorProps } from "../DateRangeSelector/DateRangeSelector";
import { CalendarTodayIcon } from "../../icons/CalendarTodayIcon";
import { Button } from "../../components/Button/Button";
import { Popover } from "../Popover/Popover";
import { useLocale } from "react-aria/I18nProvider";
import { isDateOnly, isDateRangeAllowed, type DateRange } from "../DateRangeSelector/date-contract";
import { parseDateRangeText } from "./parseDateRangeText";
import { formatDateText } from "../DateField/parseDateText";
import fields from "../TextField/TextField.module.css";
import styles from "./DateRangePicker.module.css";
import { useTranslation } from "../../i18n";
import { useCalendarFormReset } from "../DateRangeSelector/useCalendarFormReset";
export interface DateRangePickerProps extends Omit<DateRangeSelectorProps, "onCancel"> {
  /** Endpoint fields inside the dropdown are hidden by default; enable flexible text fields with showFields. */
  showFields?: boolean;
  /** Editable range textbox by default; button retains a selection-only trigger. */
  fieldMode?: "text" | "button";
  /** Anchored by default; auto uses a drawer on narrow screens without losing the draft. */
  presentation?: "popover" | "dialog" | "drawer" | "auto";
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  onValidityChange?: (valid: boolean) => void;
}
export function DateRangePicker({ value, defaultValue = null, onValueChange, name, showTitle = false, showFields = false, entryMode = "text", fieldMode = "text", presentation="popover", description, descriptionPlacement="above", errorPlacement="below", errorMessage, invalid, onValidityChange, ...props }: DateRangePickerProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [internal, setInternal] = useState(defaultValue);
  const committed = value === undefined ? internal : value;
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [previous, setPrevious] = useState(committed);
  if (previous?.start !== committed?.start || previous?.end !== committed?.end) {
    setPrevious(committed); setDraft(null); setValidationAttempted(false);
  }
  const formatted = committed ? `${formatDateText(committed.start, locale)} – ${formatDateText(committed.end, locale)}` : "";
  const text = draft ?? formatted;
  const weekStartsOn = props.firstDayOfWeek ? (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const).indexOf(props.firstDayOfWeek) as 0 | 1 | 2 | 3 | 4 | 5 | 6 : 1;
  const parsed = text.trim() ? parseDateRangeText(text, locale, props.referenceDate, weekStartsOn) : null;
  const valid = !invalid && (fieldMode === "button" ? (!props.required || Boolean(committed)) && isDateRangeAllowed(committed, props)
    : (!text.trim() ? !props.required : Boolean(parsed) && isDateRangeAllowed(parsed, props)));
  const showError = Boolean(invalid) || (!valid && (validationAttempted || fieldMode === "button"));
  const message = errorMessage ?? t("common.ui.invalidDateRangeText", { defaultMessage: "Enter a valid date range in order, within the allowed dates." });
  useEffect(() => { inputRef.current?.setCustomValidity(valid || props.disabled || props.readOnly ? "" : message); }, [valid, props.disabled, props.readOnly, message]);
  useEffect(() => { onValidityChange?.(valid); }, [valid, onValidityChange]);
  function accept(range: DateRange | null) {
    setDraft(null); setValidationAttempted(false);
    if (range?.start === committed?.start && range?.end === committed?.end) return;
    if (value === undefined) setInternal(range);
    onValueChange?.(range);
  }
  function commitText() {
    if (resetting.current || props.disabled || props.readOnly) return;
    setValidationAttempted(true);
    if (!valid) return;
    accept(parsed);
  }
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const restoreResetFocus = useRef(false);
  const resetting = useCalendarFormReset(root, () => {
    const active = root.current?.ownerDocument.activeElement;
    restoreResetFocus.current = open && Boolean(active && calendarRef.current?.contains(active));
    if (value === undefined) setInternal(defaultValue);
    setDraft(null); setValidationAttempted(false);
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
  const messages={descriptionPlacement,errorPlacement,description:((fieldMode === "text" || description) && <div id={`${id}-description`} className={fields.description}>{description ?? t("common.ui.dateRangeTextFormats", { defaultMessage: "Enter two dates separated by a spaced dash, such as {example}.", values: { example: `${formatDateText("2026-01-01", locale)} – ${formatDateText("2026-01-03", locale)}` } })}
      {fieldMode === "text" && props.referenceDate && isDateOnly(props.referenceDate) && <> {t("common.ui.relativeRangeTextFormats", { defaultMessage: "This, last or next week, month and year use reference date {referenceDate}. Weeks start on {weekday}.", values: { referenceDate: props.referenceDate, weekday: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 4 + weekStartsOn))) } })}</>}
    </div>),error:(showError && <div id={`${id}-error`} className={fields.error}>{message}</div>)};
  return <div ref={root} className={`${fields.root} ${styles.root}`} data-invalid={showError || undefined} data-disabled={props.disabled || undefined}>
    {fieldMode === "text" ? <label htmlFor={id} className={fields.label}>{props.label}</label> : <span className={fields.label}>{props.label}</span>}
    <FieldMessages position="above" {...messages}/>
    <div data-sgui-part={fieldMode === "text" ? "date-range-field-control-group" : undefined} className={fieldMode === "text" ? fields.controlGroup : undefined}>
    {fieldMode === "text" && <input id={id} ref={inputRef} type="text" className={fields.input} value={text}
      disabled={props.disabled} readOnly={props.readOnly} required={props.required} aria-invalid={showError || undefined}
      aria-describedby={`${id}-description${showError ? ` ${id}-error` : ""}`}
      onChange={event => { setDraft(event.currentTarget.value); setValidationAttempted(false); }} onInvalid={() => setValidationAttempted(true)} onBlur={commitText}
      onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); commitText(); } }} /> }
    <Popover presentation={presentation} title={props.label} showTitle={showTitle} size="content" open={open} onOpenChange={setOpen}
      trigger={<Button endIcon={fieldMode === "button" ? <CalendarTodayIcon size={16}/> : undefined} className={fieldMode === "text" ? styles.action : styles.trigger} ref={triggerRef} variant="outlined" tone="neutral" disabled={props.disabled || props.readOnly}
        aria-label={t("common.ui.chooseDate", { defaultMessage: "Choose {label}", values: { label: props.label } })}>
        {fieldMode === "text" ? <CalendarTodayIcon size={16}/> : formatted || t("common.ui.noDates", { defaultMessage: "No dates selected" })}
      </Button>}>
      <div ref={calendarRef} className={styles.calendarContent}><DateRangeSelector {...props} descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} showFields={showFields} entryMode={entryMode} firstDayOfWeek={props.firstDayOfWeek ?? "mon"} defaultFocusedDate={committed?.start ?? props.defaultFocusedDate} value={committed} onCancel={() => setOpen(false)} onValueChange={range => {
        accept(range); setOpen(false);
      }} /></div>
    </Popover>
    </div>
    <FieldMessages position="below" {...messages}/>
    {fieldMode==='button'&&<CalendarFormValidity label={props.label} empty={committed===null} valid={valid} required={props.required} disabled={props.disabled||props.readOnly}/>}
    {name && <><input type="hidden" name={`${name}.start`} value={committed?.start ?? ""} disabled={props.disabled} />
      <input type="hidden" name={`${name}.end`} value={committed?.end ?? ""} disabled={props.disabled} /></>}
  </div>;
}
