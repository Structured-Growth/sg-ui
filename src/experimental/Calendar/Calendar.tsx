"use client";
import { parseDate, toCalendar, GregorianCalendar } from "@internationalized/date";
import { Calendar as AriaCalendar, CalendarHeading, CalendarGrid, CalendarGridHeader, CalendarHeaderCell,
  CalendarGridBody, CalendarCell, type DateValue } from "react-aria-components/Calendar";
import { Button } from "../Button/Button";
import { useTranslation } from "../../i18n";
import type { DateOnly, DateAvailability } from "../DateRangeSelector/date-contract";
import styles from "../DateRangeSelector/DateRangeSelector.module.css";
interface CalendarOptions {
  label: string;
  min?: DateOnly;
  max?: DateOnly;
  unavailable?: readonly DateAvailability[];
  focusedDate?: DateOnly;
  defaultFocusedDate?: DateOnly;
  onFocusedDateChange?: (date: DateOnly) => void;
  months?: 1 | 2;
  firstDayOfWeek?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  disabled?: boolean;
  readOnly?: boolean;
}
export type CalendarProps = CalendarOptions & (
  { selection?: "single"; value?: DateOnly | null; defaultValue?: DateOnly | null; onValueChange?: (value: DateOnly | null) => void } |
  { selection: "multiple"; value?: readonly DateOnly[]; defaultValue?: readonly DateOnly[]; onValueChange?: (value: DateOnly[]) => void }
);
export function Calendar(props: CalendarProps) {
  const { t } = useTranslation();
  const { label, min, max, unavailable = [], focusedDate, defaultFocusedDate, onFocusedDateChange, months = 1,
    firstDayOfWeek, disabled, readOnly } = props;
  const shared = { "aria-label": label, minValue: min ? parseDate(min) : undefined, maxValue: max ? parseDate(max) : undefined,
    focusedValue: focusedDate ? parseDate(focusedDate) : undefined, defaultFocusedValue: defaultFocusedDate ? parseDate(defaultFocusedDate) : undefined,
    onFocusChange: (date: ReturnType<typeof parseDate>) => onFocusedDateChange?.(toCalendar(date, new GregorianCalendar()).toString()),
    isDateUnavailable: (date: DateValue) => unavailable.some(day => day.date === toCalendar(date, new GregorianCalendar()).toString()),
    visibleDuration: { months }, firstDayOfWeek, isDisabled: disabled, isReadOnly: readOnly, className: styles.calendar };
  const content = <><header className={styles.header}>
    <Button slot="previous" variant="outlined" tone="neutral" aria-label={t("common.ui.previousMonth", { defaultMessage: "Previous month" })}>‹</Button>
    <h2 className={styles.heading}>{label}</h2>
    <Button slot="next" variant="outlined" tone="neutral" aria-label={t("common.ui.nextMonth", { defaultMessage: "Next month" })}>›</Button>
  </header><div className={styles.months}>{Array.from({ length: months }, (_, index) => <div key={index} className={styles.month}>
    <CalendarHeading offset={{ months: index }} className={styles.heading} />
    <CalendarGrid offset={{ months: index }} weekdayStyle="short" className={styles.grid}>
      <CalendarGridHeader>{day => <CalendarHeaderCell className={styles.weekday}>{day}</CalendarHeaderCell>}</CalendarGridHeader>
      <CalendarGridBody>{date => <CalendarCell date={date} className={styles.cell}>{({ formattedDate }) => <span
        title={unavailable.find(day => day.date === toCalendar(date, new GregorianCalendar()).toString())?.reason}>{formattedDate}</span>}</CalendarCell>}</CalendarGridBody>
    </CalendarGrid>
  </div>)}</div></>;
  return <div className={styles.root}>
    {props.selection === "multiple" ? <AriaCalendar {...shared} selectionMode="multiple" value={props.value?.map(parseDate)} defaultValue={props.defaultValue?.map(parseDate)}
      onChange={dates => props.onValueChange?.(dates.map(date => toCalendar(date, new GregorianCalendar()).toString()))}>{content}</AriaCalendar> :
      <AriaCalendar {...shared} value={props.value === undefined ? undefined : props.value === null ? null : parseDate(props.value)} defaultValue={props.defaultValue ? parseDate(props.defaultValue) : undefined}
        onChange={date => props.onValueChange?.(date ? toCalendar(date, new GregorianCalendar()).toString() : null)}>{content}</AriaCalendar>}
    {unavailable.length > 0 && <details className={styles.availability}><summary>{t("common.ui.unavailableDates", { defaultMessage: "Unavailable dates" })}</summary>
      <ul>{unavailable.map(day => <li key={day.date}>{day.date}: {day.reason}</li>)}</ul></details>}
  </div>;
}
