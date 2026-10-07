"use client";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { parseDate, toCalendarDate, toCalendar, GregorianCalendar } from "@internationalized/date";
import { RangeCalendar, CalendarHeading, CalendarGrid, CalendarGridHeader, CalendarHeaderCell,
  CalendarGridBody, CalendarCell, RangeCalendarStateContext } from "react-aria-components/RangeCalendar";
import { ButtonContext } from "react-aria-components/Button";
import { Button } from "../Button/Button";
import { DateField } from "../DateField/DateField";
import { useCalendarFormReset } from "./useCalendarFormReset";
import { useTranslation } from "../../i18n";
import { isDateOnly, isDateRangeAllowed, type DateOnly, type DateRange, type DateAvailability, type DateRangePreset } from "./date-contract";
import styles from "./DateRangeSelector.module.css";

export interface DateRangeSelectorProps {
  label: string;
  /** Committed range. Changes outside the control replace the current draft. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  onCancel?: () => void;
  min?: DateOnly;
  max?: DateOnly;
  unavailable?: readonly DateAvailability[];
  presets?: readonly DateRangePreset[];
  months?: 1 | 2;
  defaultFocusedDate?: DateOnly;
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
}

export function DateRangeSelector({ label, value, defaultValue = null, onValueChange, onCancel, min, max,
  unavailable = [], presets = [], months = 2, defaultFocusedDate, firstDayOfWeek, disabled, readOnly, required, name }: DateRangeSelectorProps) {
  const { t } = useTranslation();
  const descriptionId = useId();
  const [focusedDate, setFocusedDate] = useState<DateOnly | undefined>(defaultFocusedDate);
  const focusedReason = unavailable.find(day => day.date === focusedDate)?.reason;
  const [internal, setInternal] = useState<DateRange | null>(defaultValue);
  const committed = value === undefined ? internal : value;
  const [previous, setPrevious] = useState(committed);
  const [draft, setDraft] = useState(committed);
  // Compare serialized endpoints, so new parent objects with the same value do not erase edits.
  if (previous?.start !== committed?.start || previous?.end !== committed?.end) {
    setPrevious(committed); setDraft(committed);
  }
  const root = useRef<HTMLDivElement>(null);
  const [resetRevision, setResetRevision] = useState(0);
  const resetting = useCalendarFormReset(root, () => {
    if (value === undefined) setInternal(defaultValue);
    setDraft(value === undefined ? defaultValue : value);
    setResetRevision(revision => revision + 1);
  });
  const allowed = (!required || draft !== null) && isDateRangeAllowed(draft, { min, max, unavailable });
  const calendarValue = draft && isDateOnly(draft.start) && isDateOnly(draft.end) && draft.start <= draft.end
    ? { start: parseDate(draft.start), end: parseDate(draft.end) } : null;
  return <div ref={root} className={styles.root} data-sgui-part="date-range-selector">
    <RangeCalendar aria-label={label} value={calendarValue} visibleDuration={{ months }} pageBehavior="single" selectionAlignment="start" commitBehavior="reset"
      defaultFocusedValue={defaultFocusedDate && isDateOnly(defaultFocusedDate) ? parseDate(defaultFocusedDate) : undefined} firstDayOfWeek={firstDayOfWeek}
      minValue={min && isDateOnly(min) ? parseDate(min) : undefined} maxValue={max && isDateOnly(max) ? parseDate(max) : undefined}
      onFocusChange={date => setFocusedDate(toCalendar(toCalendarDate(date), new GregorianCalendar()).toString())}
      isDisabled={disabled} isReadOnly={readOnly} isInvalid={!allowed}
      isDateUnavailable={date => unavailable.some(day => day.date === toCalendar(toCalendarDate(date), new GregorianCalendar()).toString())}
      onChange={range => setDraft(range ? {
        start: toCalendar(toCalendarDate(range.start), new GregorianCalendar()).toString(),
        end: toCalendar(toCalendarDate(range.end), new GregorianCalendar()).toString(),
      } : null)} className={styles.calendar}>
    {({ state }) => <>
    <ResetCalendarAnchor start={committed?.start} end={committed?.end} resetRevision={resetRevision} />
    <ButtonContext.Provider value={null}>
    <div className={styles.fields}>
      <DateField label={t("common.ui.startDate", { defaultMessage: "Start date" })} value={draft?.start || null}
        onValueChange={start => { if (resetting.current) return; state.setAnchorDate(null); setDraft({ start: start ?? "", end: draft?.end ?? "" }); }} min={min} max={max} disabled={disabled} readOnly={readOnly} required={required} />
      <DateField label={t("common.ui.endDate", { defaultMessage: "End date" })} value={draft?.end || null}
        onValueChange={end => { if (resetting.current) return; state.setAnchorDate(null); setDraft({ start: draft?.start ?? "", end: end ?? "" }); }} min={min} max={max} disabled={disabled} readOnly={readOnly} required={required} />
    </div>
    {presets.length > 0 && <div className={styles.presets} aria-label={t("common.ui.datePresets", { defaultMessage: "Date presets" })}>
      {presets.map((preset, index) => <div key={preset.id} className={styles.preset}>
        <Button variant="outlined" tone="neutral" aria-describedby={preset.description ? `${descriptionId}-preset-${index}` : undefined}
        disabled={disabled || readOnly || !isDateRangeAllowed(preset.value, { min, max, unavailable })}
        onPress={() => { state.setAnchorDate(null); setDraft(preset.value); }}>{preset.label}</Button>
        {preset.description && <p id={`${descriptionId}-preset-${index}`} className={styles.presetDescription}>{preset.description}</p>}
      </div>)}
    </div>}
    </ButtonContext.Provider>
      <header className={styles.header}>
        <Button slot="previous" variant="outlined" tone="neutral" aria-label={t("common.ui.previousMonth", { defaultMessage: "Previous month" })}>‹</Button>
        <h2 className={styles.heading}>{label}</h2>
        <Button slot="next" variant="outlined" tone="neutral" aria-label={t("common.ui.nextMonth", { defaultMessage: "Next month" })}>›</Button>
      </header>
      <div className={styles.months}>
        {Array.from({ length: months }, (_, index) => <div key={index} className={styles.month}>
          <CalendarHeading offset={{ months: index }} className={styles.heading} />
          <CalendarGrid offset={{ months: index }} weekdayStyle="short" className={styles.grid}>
          <CalendarGridHeader>{day => <CalendarHeaderCell className={styles.weekday}>{day}</CalendarHeaderCell>}</CalendarGridHeader>
          <CalendarGridBody>{date => {
            const dateOnly = toCalendar(date, new GregorianCalendar()).toString();
            const reason = unavailable.find(day => day.date === dateOnly)?.reason;
            return <DescribedCalendarCell date={date} reason={reason} reasonId={`${descriptionId}-date-${dateOnly}-${index}`} />;
          }}</CalendarGridBody>
        </CalendarGrid></div>)}
      </div>
    {focusedReason && <p className={styles.summary} role="status" data-sgui-part="date-availability">{focusedDate}: {focusedReason}</p>}
    {unavailable.length > 0 && <details className={styles.availability}>
      <summary>{t("common.ui.unavailableDates", { defaultMessage: "Unavailable dates" })}</summary>
      <ul>{unavailable.map(day => <li key={day.date}>{day.date}: {day.reason}</li>)}</ul>
    </details>}
    {state.anchorDate && <p className={styles.summary} role="status" data-sgui-part="date-range-preview">
      {t("common.ui.dateRangePreview", { defaultMessage: "Range preview: {start} – {end}. Choose an end date to finish.", values: {
        start: toCalendar(state.highlightedRange?.start ?? state.anchorDate, new GregorianCalendar()).toString(),
        end: toCalendar(state.highlightedRange?.end ?? state.anchorDate, new GregorianCalendar()).toString(),
      } })}
    </p>}
    <p className={styles.summary} role="status" data-sgui-part="date-range-draft">{draft ? `${draft.start} – ${draft.end}` : t("common.ui.noDates", { defaultMessage: "No dates selected" })}</p>
    {!allowed && <p className={styles.summary}>{t("common.ui.invalidDateRange", { defaultMessage: "Choose an available date range." })}</p>}
    <ButtonContext.Provider value={null}>
    <div className={styles.actions}>
      <Button variant="text" tone="neutral" disabled={disabled || readOnly || required} onPress={() => { state.setAnchorDate(null); setDraft(null); }}>{t("common.ui.clear", { defaultMessage: "Clear" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={disabled} onPress={() => { state.setAnchorDate(null); setDraft(committed); onCancel?.(); }}>{t("common.ui.cancel", { defaultMessage: "Cancel" })}</Button>
      <Button disabled={disabled || readOnly || !allowed || state.anchorDate !== null} onPress={() => {
        if (value === undefined) setInternal(draft);
        onValueChange?.(draft);
      }}>{t("common.ui.apply", { defaultMessage: "Apply" })}</Button>
    </div>
    </ButtonContext.Provider>
    </>}
    </RangeCalendar>
    {name && <><input type="hidden" name={`${name}.start`} value={committed?.start ?? ""} disabled={disabled} />
      <input type="hidden" name={`${name}.end`} value={committed?.end ?? ""} disabled={disabled} /></>}
  </div>;
}

// CalendarCell filters labelable ARIA props. Keep its native interaction and full
// date label, and attach only the owned reason after its button has mounted.
function DescribedCalendarCell({ date, reason, reasonId }: { date: ReturnType<typeof parseDate>; reason?: string; reasonId: string }) {
  const ref = useRef<HTMLTableCellElement>(null);
  useEffect(() => {
    const button = ref.current?.firstElementChild;
    if (!reason || !button) return;
    const existing = button.getAttribute("aria-describedby")?.split(/\s+/).filter(Boolean) ?? [];
    button.setAttribute("aria-describedby", [...new Set([...existing, reasonId])].join(" "));
    return () => {
      const remaining = button.getAttribute("aria-describedby")?.split(/\s+/).filter(id => id && id !== reasonId) ?? [];
      if (remaining.length) button.setAttribute("aria-describedby", remaining.join(" "));
      else button.removeAttribute("aria-describedby");
    };
  });
  return <CalendarCell ref={ref} date={date} className={styles.cell}>
    {({ formattedDate }) => <><span>{formattedDate}</span>
      {reason && <span id={reasonId} className={styles.visuallyHidden}>{reason}</span>}</>}
  </CalendarCell>;
}

// Host replacements and native resets invalidate an unfinished range without
// remounting the calendar or duplicating the interaction engine's selection state.
function ResetCalendarAnchor({ start, end, resetRevision }: { start?: DateOnly; end?: DateOnly; resetRevision: number }) {
  const state = useContext(RangeCalendarStateContext);
  const setAnchorDate = state?.setAnchorDate;
  useEffect(() => { setAnchorDate?.(null); }, [setAnchorDate, start, end, resetRevision]);
  return null;
}
