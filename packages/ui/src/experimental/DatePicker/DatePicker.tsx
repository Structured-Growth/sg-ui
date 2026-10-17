"use client";
import { useRef, useState } from "react";
import { DateField, type DateFieldProps } from "../DateField/DateField";
import { TimeField } from "../TimeField/TimeField";
import { parseDateTime } from "@internationalized/date";
import type { CalendarProps } from "../Calendar/Calendar";
import { DateFieldActionContext, DateFieldValidationContext } from "../DateField/DateFieldControl";
import { CalendarTodayIcon } from "../../icons/CalendarTodayIcon";
import { Calendar } from "../Calendar/Calendar";
import { Popover } from "../Popover/Popover";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "../../i18n";
import { useFormReset } from "../useFormReset";
import type { DateAvailability } from "../DateRangeSelector/date-contract";
import styles from "./DatePicker.module.css";
export interface DatePickerProps extends DateFieldProps {
  /** Show one visible dropdown title. The field label remains visible. Defaults to false. */
  showTitle?: boolean;
  /** Flexible date text by default; choose segments for segmented entry. Datetime remains segmented. */
  entryMode?: "text" | "segments";
  presentation?: "popover" | "dialog" | "drawer" | "auto";
  getDateUnavailableReason?: CalendarProps["getDateUnavailableReason"];
  renderDayContent?: CalendarProps["renderDayContent"];
  /** Defaults period: separate month/year text buttons open immediate in-place choices. Arrows disables the chooser; month-year uses direct selects. */
  navigation?: CalendarProps["navigation"];
  /** Month heading is interactive in period navigation by default. False leaves plain text. Use min/max to restrict selectable dates. */
  allowMonthSelection?: CalendarProps["allowMonthSelection"];
  /** Year heading is interactive in period navigation by default. False leaves plain text. */
  allowYearSelection?: CalendarProps["allowYearSelection"];
  /** Forwarded month/year chooser options. min/max and availability always inherit from this DatePicker; explicit year bounds may narrow them. */
  periodPickerProps?: CalendarProps["periodPickerProps"];
  visibleYears?: number;
  unavailable?: readonly DateAvailability[];
  defaultFocusedDate?: string;
}
export function DatePicker({ value, defaultValue = null, onValueChange, unavailable, defaultFocusedDate, showTitle = false, entryMode = "text", kind = "date", hourCycle, navigation, periodPickerProps, allowMonthSelection, allowYearSelection, visibleYears, presentation="popover", getDateUnavailableReason, renderDayContent, ...props }: DatePickerProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value === undefined ? internal : value;
  const [open, setOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<string | null>(null);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [timeValid, setTimeValid] = useState(false);
  const datetime = kind === "datetime";
  function openChange(next: boolean) {
    if (next) { setDraftDate(selected?.slice(0,10) ?? null); setDraftTime(selected?.slice(11) || null); }
    setOpen(next);
  }
  function unavailableReasonFor(candidate: string) {
    const date = candidate.slice(0, 10);
    const record = unavailable?.find(day => day.date === date);
    return record ? record.reason || t("common.ui.invalidDate", { defaultMessage: "Enter a valid date." })
      : getDateUnavailableReason?.(date, { range: null, endpoint: null }) || undefined;
  }
  const candidate = draftDate && draftTime ? `${draftDate}T${draftTime}` : null;
  let validCandidate = false;
  if (candidate && timeValid && !props.disabled && !props.readOnly) {
    try { validCandidate = parseDateTime(candidate).toString() === candidate &&
      (!props.min || parseDateTime(candidate).compare(parseDateTime(props.min)) >= 0) && (!props.max || parseDateTime(candidate).compare(parseDateTime(props.max)) <= 0) &&
      !unavailableReasonFor(candidate); } catch { /* Incomplete or malformed local datetime. */ }
  }
  const root = useRef<HTMLDivElement>(null);
  const resetting = useFormReset(root, () => { if (value === undefined) setInternal(defaultValue); setOpen(false); });
  function change(date: string | null) { if (resetting.current || props.disabled || props.readOnly || (date && unavailableReasonFor(date))) return; if (value === undefined) setInternal(date); onValueChange?.(date); }
  const action = <Popover presentation={presentation} title={props.label} showTitle={showTitle} open={open} onOpenChange={openChange} trigger={<Button className={styles.trigger} variant="outlined" tone="neutral" disabled={props.disabled || props.readOnly}
      aria-label={t("common.ui.chooseDate", { defaultMessage: "Choose {label}", values: { label: props.label } })}><CalendarTodayIcon size={16} /></Button>}>
      <div className={styles.popupBody} data-sgui-part="date-picker-calendar-frame"><div className={styles.calendar}><Calendar getDateUnavailableReason={getDateUnavailableReason} renderDayContent={renderDayContent} label={props.label} value={datetime ? draftDate : selected} onValueChange={date => {
        if (datetime) setDraftDate(date); else { change(date); setOpen(false); }
      }} allowMonthSelection={allowMonthSelection} allowYearSelection={allowYearSelection} navigation={navigation} periodPickerProps={{descriptionPlacement:props.descriptionPlacement,errorPlacement:props.errorPlacement,...periodPickerProps}} visibleYears={visibleYears} disabled={props.disabled} readOnly={props.readOnly}
        min={props.min?.slice(0,10)} max={props.max?.slice(0,10)} unavailable={unavailable} defaultFocusedDate={selected?.slice(0,10) ?? defaultFocusedDate} /></div>
      {datetime && <div className={styles.time}>
        <TimeField descriptionPlacement={props.descriptionPlacement} errorPlacement={props.errorPlacement} label={t("common.ui.time", {defaultMessage:"Time"})} value={draftTime} onValueChange={setDraftTime} onValidityChange={setTimeValid}
          hourCycle={hourCycle} disabled={props.disabled} readOnly={props.readOnly} required min={draftDate === props.min?.slice(0,10) ? props.min?.slice(11) : undefined}
          max={draftDate === props.max?.slice(0,10) ? props.max?.slice(11) : undefined}/>
        <div className={styles.actions}>
          <Button disabled={!validCandidate} onPress={() => { if (validCandidate && candidate) { change(candidate); setOpen(false); } }}>{t("common.ui.apply", {defaultMessage:"Apply"})}</Button>
          <Button variant="outlined" tone="neutral" onPress={() => setOpen(false)}>{t("common.ui.cancel", {defaultMessage:"Cancel"})}</Button>
        </div>
      </div>}
      {selected && !props.required && !props.disabled && !props.readOnly && <Button className={styles.clear} variant="outlined" tone="neutral"
        onPress={() => { change(null); setOpen(false); }}>
        {t("common.ui.clear", { defaultMessage: "Clear" })}
      </Button>}
      </div>
    </Popover>;
  return <div ref={root} className={styles.root}>
    <DateFieldValidationContext.Provider value={unavailableReasonFor}>
    <DateFieldActionContext.Provider value={action}>
      <DateField {...props} entryMode={entryMode} kind={kind} hourCycle={hourCycle} value={selected} onValueChange={change} />
    </DateFieldActionContext.Provider>
    </DateFieldValidationContext.Provider>
  </div>;
}
