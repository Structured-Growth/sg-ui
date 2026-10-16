"use client";
import { CalendarMonthPicker, CalendarYearPicker } from "react-aria-components/Calendar";
import { ButtonContext } from "react-aria-components/Button";
import { Select } from "../Select/Select";
import styles from "../DateRangeSelector/DateRangeSelector.module.css";

/** Private adapter: date objects and interaction-engine props stay internal. */
export function CalendarNavigation({visibleYears = 120, disabled, readOnly}: {visibleYears?: number; disabled?: boolean; readOnly?: boolean}) {
  const count = Number.isFinite(visibleYears) ? Math.max(1, Math.min(9999, Math.floor(visibleYears))) : 120;
  return <ButtonContext.Provider value={null}><div className={styles.monthSelectors}>
    <CalendarMonthPicker>{props => <Select className={styles.navigationField} label={props["aria-label"]!} value={String(props.value)}
      options={props.items.map(item => ({id:String(item.id), label:item.formatted}))}
      onValueChange={value => props.onChange(value === null ? null : Number(value))} disabled={disabled} readOnly={readOnly}/>}</CalendarMonthPicker>
    <CalendarYearPicker visibleYears={count}>{props => <Select className={styles.navigationField} label={props["aria-label"]!} value={String(props.value)}
      options={props.items.map(item => ({id:String(item.id), label:item.formatted}))}
      onValueChange={value => props.onChange(value === null ? null : Number(value))} disabled={disabled} readOnly={readOnly}/>}</CalendarYearPicker>
  </div></ButtonContext.Provider>;
}
