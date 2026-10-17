"use client";
import {PeriodPicker,type PeriodPickerProps} from "../PeriodPicker/PeriodPicker";
import {firstPeriodNavigationDate} from "../PeriodPicker/period-navigation";
import {getCivilPeriod} from "../../utils/relative-dates";
import {ButtonContext} from "react-aria-components/Button";
import { CalendarMonthTransition } from "./CalendarMonthTransition";
import { CalendarNavigation } from "../Calendar/CalendarNavigation";
import { useLocale } from "react-aria-components/I18nProvider";
import { useNarrowWeekdays } from "../DateRangeSelector/useNarrowWeekdays";
import { parseDate, toCalendar, GregorianCalendar, type CalendarDate } from "@internationalized/date";
import { Calendar as AriaCalendar, CalendarHeading, CalendarGrid, CalendarGridHeader, CalendarHeaderCell,
  CalendarGridBody, CalendarCell, CalendarStateContext, type DateValue } from "react-aria-components/Calendar";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "../../i18n";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { DateAvailabilityRule, DateOnly, DateAvailability } from "../DateRangeSelector/date-contract";
import styles from "../DateRangeSelector/DateRangeSelector.module.css";
interface CalendarOptions {
  label: string;
  /** Show a visible calendar title in addition to its accessible label. Defaults to false. */
  showTitle?: boolean;
  /** Defaults period: separate month and year text buttons open immediate in-place choices without selecting a day. Arrows keeps a static heading; month-year shows direct selects. */
  navigation?: "period" | "arrows" | "month-year";
  /** Enable the month heading button in period navigation. Defaults true; false keeps a static month label. Does not restrict date validity or arrow navigation; use min/max for that. */
  allowMonthSelection?: boolean;
  /** Enable the year heading button in period navigation. Defaults true; false keeps a static year label. Does not restrict date validity. */
  allowYearSelection?: boolean;
  /** Relevant PeriodPicker options. Date bounds, availability, focus, labels and callbacks are owned by the calendar; year bounds can only narrow the date limits. */
  periodPickerProps?: Pick<PeriodPickerProps,"yearsPerPage"|"yearEntry"|"visibleYears"|"minYear"|"maxYear"|"descriptionPlacement"|"errorPlacement">;
  /** Number of localized years offered around focus, constrained by min/max. Defaults to 120. */
  visibleYears?: number;
  min?: DateOnly;
  max?: DateOnly;
  getDateUnavailableReason?: DateAvailabilityRule;
  renderDayContent?: (date: DateOnly) => ReactNode;
  unavailable?: readonly DateAvailability[];
  focusedDate?: DateOnly;
  defaultFocusedDate?: DateOnly;
  onFocusedDateChange?: (date: DateOnly) => void;
  months?: 1 | 2 | 3;
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
  const { locale } = useLocale();
  const narrowWeekdays = useNarrowWeekdays(locale);
  const { label, showTitle = false, navigation = "period", periodPickerProps, allowMonthSelection=true, allowYearSelection=true, visibleYears, min, max, unavailable = [], getDateUnavailableReason, renderDayContent, focusedDate, defaultFocusedDate, onFocusedDateChange, months = 1,
    firstDayOfWeek, disabled, readOnly } = props;
  const descriptionId = useId();
  const reasonForDate = (date: DateOnly) => unavailable.find(day => day.date === date)?.reason ?? getDateUnavailableReason?.(date, { range: null, endpoint: null });
  const shared = { "aria-label": label, minValue: min ? parseDate(min) : undefined, maxValue: max ? parseDate(max) : undefined,
    focusedValue: focusedDate ? parseDate(focusedDate) : undefined, defaultFocusedValue: defaultFocusedDate ? parseDate(defaultFocusedDate) : undefined,
    onFocusChange: (date: ReturnType<typeof parseDate>) => onFocusedDateChange?.(toCalendar(date, new GregorianCalendar()).toString()),
    isDateUnavailable: (date: DateValue) => unavailable.some(day => day.date === toCalendar(date,new GregorianCalendar()).toString()) || Boolean(getDateUnavailableReason?.(toCalendar(date,new GregorianCalendar()).toString(),{range:null,endpoint:null})),
    visibleDuration: { months }, firstDayOfWeek, isDisabled: disabled, isReadOnly: readOnly, className: styles.calendar };
  const calendarBody = <>{showTitle && <h2 className={styles.heading}>{label}</h2>}{navigation === "month-year" && months > 1 && <CalendarNavigation visibleYears={visibleYears} disabled={disabled} readOnly={readOnly}/>}<div className={styles.months}>{Array.from({ length: months }, (_, index) => <div key={index} className={styles.month}>
    <header className={styles.monthHeader}>
      {index === months - 1 && <Button className={styles.previous} slot="previous" variant="text" tone="neutral" aria-label={t("common.ui.previousMonth", { defaultMessage: "Previous month" })}>‹</Button>}
      {navigation === "month-year" && months === 1 ? <div className={styles.monthHeading}><CalendarNavigation visibleYears={visibleYears} disabled={disabled} readOnly={readOnly}/></div> : navigation === "period" ? <div className={styles.monthHeading}><CalendarPeriodHeading allowMonthSelection={allowMonthSelection} allowYearSelection={allowYearSelection} offset={index} disabled={disabled} readOnly={readOnly}/></div> : <CalendarHeading offset={{ months: index }} className={`${styles.heading} ${styles.monthHeading}`} />}
      {index === months - 1 && <Button className={styles.next} slot="next" variant="text" tone="neutral" aria-label={t("common.ui.nextMonth", { defaultMessage: "Next month" })}>›</Button>}
    </header>
    <CalendarMonthMotion><div className={styles.gridViewport}><CalendarGrid offset={{ months: index }} weekdayStyle="short" className={styles.grid}>
      <CalendarGridHeader>{day => <CalendarHeaderCell className={styles.weekday} data-narrow-label={narrowWeekdays.get(day) ?? day}><span className={styles.weekdayLabel}>{day}</span></CalendarHeaderCell>}</CalendarGridHeader>
      <CalendarGridBody>{date => {
        const iso = toCalendar(date, new GregorianCalendar()).toString();
        return <DescribedCalendarCell date={date} reason={reasonForDate(iso)} reasonId={`${descriptionId}-date-${iso}-${index}`} content={renderDayContent?.(iso)} />;
      }}</CalendarGridBody>
    </CalendarGrid></div></CalendarMonthMotion>
  </div>)}</div><AvailabilityDisclosure unavailable={unavailable} reasonForDate={reasonForDate} /></>;
  const content=<CalendarPeriodViewport options={periodPickerProps} visibleYears={visibleYears} min={min} max={max} unavailable={unavailable} getDateUnavailableReason={getDateUnavailableReason} disabled={disabled} readOnly={readOnly}>{calendarBody}</CalendarPeriodViewport>;
  return <div className={styles.root} data-months={months}>
    {props.selection === "multiple" ? <AriaCalendar {...shared} selectionMode="multiple" value={props.value?.map(parseDate)} defaultValue={props.defaultValue?.map(parseDate)}
      onChange={dates => props.onValueChange?.(dates.map(date => toCalendar(date, new GregorianCalendar()).toString()))}>{content}</AriaCalendar> :
      <AriaCalendar {...shared} value={props.value === undefined ? undefined : props.value === null ? null : parseDate(props.value)} defaultValue={props.defaultValue ? parseDate(props.defaultValue) : undefined}
        onChange={date => props.onValueChange?.(date ? toCalendar(date, new GregorianCalendar()).toString() : null)}>{content}</AriaCalendar>}
  </div>;
}

// CalendarCell filters labelable ARIA props. Match the range calendar's private
// ref bridge, retaining the engine's complete date name and host descriptions.
function DescribedCalendarCell({ date, reason, reasonId, content }: { date: CalendarDate; reason?: string; reasonId: string; content?: ReactNode }) {
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
    {({ formattedDate }) => <><span title={reason}>{formattedDate}</span>{content && <span aria-hidden="true" className={styles.dayContent}>{content}</span>}
      {reason && <span id={reasonId} className={styles.visuallyHidden}>{reason}</span>}</>}
  </CalendarCell>;
}

// Static dates remain discoverable outside the viewport; callback policies are
// evaluated for the visible interval as navigation changes, without fetching data.
function AvailabilityDisclosure({ unavailable, reasonForDate }: { unavailable: readonly DateAvailability[]; reasonForDate: (date: DateOnly) => string | undefined }) {
  const state = useContext(CalendarStateContext)!;
  const { t } = useTranslation();
  const reasons = new Map(unavailable.map(day => [day.date, day.reason]));
  for (let date = state.visibleRange.start; date.compare(state.visibleRange.end) <= 0; date = date.add({ days: 1 })) {
    const iso = toCalendar(date, new GregorianCalendar()).toString();
    const reason = reasonForDate(iso);
    if (reason) reasons.set(iso, reason);
  }
  return reasons.size > 0 ? <details className={styles.availability}>
    <summary>{t("common.ui.unavailableDates", { defaultMessage: "Unavailable dates" })}</summary>
    <ul>{[...reasons].map(([date, reason]) => <li key={date}>{date}: {reason}</li>)}</ul>
  </details> : null;
}

function CalendarMonthMotion({children}: {children: ReactNode}) {
 const state=useContext(CalendarStateContext)!;
 const {direction}=useLocale();
 return <CalendarMonthTransition month={state.visibleRange.start.toString()} direction={direction}>{children}</CalendarMonthTransition>;
}

type PeriodView="month"|"year";
type PeriodTarget={offset:number;view:PeriodView};
const CalendarPeriodContext=createContext<((target:PeriodTarget)=>void)|null>(null);
function CalendarPeriodHeading({offset,disabled,readOnly,allowMonthSelection,allowYearSelection}:{offset:number;disabled?:boolean;readOnly?:boolean;allowMonthSelection:boolean;allowYearSelection:boolean}) {
 const state=useContext(CalendarStateContext)!;const open=useContext(CalendarPeriodContext)!;const {locale}=useLocale();const {t}=useTranslation();
 if(state.visibleRange.start.calendar.identifier!=="gregory")return <CalendarHeading offset={{months:offset}} className={styles.heading}/>;
 const date=toCalendar(state.visibleRange.start.add({months:offset}),new GregorianCalendar());
 const month=new Intl.DateTimeFormat(locale,{month:"long",calendar:"gregory",timeZone:"UTC"}).format(date.toDate("UTC"));
 const year=new Intl.NumberFormat(locale,{useGrouping:false}).format(date.year);
 return <ButtonContext.Provider value={null}><div role="group" aria-label={t("common.ui.calendarNavigation",{defaultMessage:"Calendar navigation"})} className={styles.periodHeading}>
  {allowMonthSelection?<Button variant="text" tone="neutral" disabled={disabled||readOnly} aria-label={t("common.ui.chooseMonth",{defaultMessage:"Choose month, {month}",values:{month}})} onPress={()=>open({offset,view:"month"})}><span data-period-heading={`${offset}-month`}>{month}</span></Button>:<span className={styles.heading}>{month}</span>}
  {allowYearSelection?<Button variant="text" tone="neutral" disabled={disabled||readOnly} aria-label={t("common.ui.chooseYear",{defaultMessage:"Choose year, {year}",values:{year}})} onPress={()=>open({offset,view:"year"})}><span data-period-heading={`${offset}-year`}>{year}</span></Button>:<span className={styles.heading}>{year}</span>}
 </div></ButtonContext.Provider>;
}

/** Keep the day layout mounted as a size reservation, but inert and hidden from AT while replacing its contents. */
function CalendarPeriodViewport({children,options,visibleYears,...constraints}:{children:ReactNode;options?:CalendarOptions["periodPickerProps"];visibleYears?:number;min?:string;max?:string;unavailable:readonly DateAvailability[];getDateUnavailableReason?:DateAvailabilityRule;disabled?:boolean;readOnly?:boolean}) {
 const state=useContext(CalendarStateContext)!;const {t}=useTranslation();
 const [target,setTarget]=useState<PeriodTarget|null>(null);const offset=target?.offset??null;const root=useRef<HTMLDivElement>(null);const restore=useRef<PeriodTarget|null>(null);
 function close(){restore.current=target;setTarget(null);}
 useEffect(()=>{if(offset===null&&restore.current!==null){root.current?.querySelector<HTMLElement>(`[data-period-heading="${restore.current.offset}-${restore.current.view}"]`)?.closest('button')?.focus();restore.current=null;}},[offset]);
 const date=toCalendar(state.visibleRange.start.add({months:offset??0}),new GregorianCalendar());
 return <CalendarPeriodContext.Provider value={setTarget}><div ref={root} className={styles.periodViewport}>
  <div className={styles.calendar} aria-hidden={offset!==null||undefined} ref={node=>{node?.toggleAttribute("inert",offset!==null);}} style={{visibility:offset!==null?"hidden":undefined}}>{children}</div>
  {offset!==null&&<div className={styles.periodContents} data-sgui-part="calendar-period-view" onKeyDown={event=>{if(event.key!=="Tab"&&event.key!=="Escape")event.stopPropagation();}}><ButtonContext.Provider value={null}><PeriodPicker {...options} {...constraints} visibleYears={options?.visibleYears??visibleYears}
   display="inline" unit="month" purpose="navigation" navigationView={target!.view} referenceDate={date.toString()} label={target!.view==="month"?t("common.ui.chooseMonthInline",{defaultMessage:"Choose month"}):t("common.ui.chooseYearInline",{defaultMessage:"Choose year"})}
   value={getCivilPeriod(date.toString(),"month")} onCancel={close} onValueChange={period=>{
    if(!period)return;const target=firstPeriodNavigationDate(period,constraints);if(target)state.setFocusedDate(parseDate(target));close();
   }}/></ButtonContext.Provider></div>}
 </div></CalendarPeriodContext.Provider>;
}
