"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import {CalendarStateContext,CalendarHeading} from "react-aria-components/Calendar";
import {RangeCalendarStateContext} from "react-aria-components/RangeCalendar";
import {ButtonContext} from "react-aria-components/Button";
import {useLocale} from "react-aria-components/I18nProvider";
import {toCalendar,GregorianCalendar,parseDate} from "@internationalized/date";
import {Button} from "../../components/Button/Button";
import {MonthPicker} from "../MonthPicker/MonthPicker";
import {YearPicker,type YearPickerProps} from "../YearPicker/YearPicker";
import {useTranslation} from "../../i18n";
import {getCivilPeriod} from "../../utils/relative-dates";
import {firstPeriodNavigationDate} from "../PeriodPicker/period-navigation";
import type {DateAvailability,DateAvailabilityRule} from "../DateRangeSelector/date-contract";
import type {FieldMessagePlacementProps} from "../TextField/FieldMessages";
import styles from "../DateRangeSelector/DateRangeSelector.module.css";
export type CalendarPeriodOptions=Pick<YearPickerProps,"yearsPerPage"|"yearNavigation"|"yearEntry"|"visibleYears"|"minYear"|"maxYear"> & FieldMessagePlacementProps;
function usePeriodCalendarState(){const calendar=useContext(CalendarStateContext),range=useContext(RangeCalendarStateContext);return range??calendar!;}
export type PeriodView="month"|"year";
export type PeriodTarget={offset:number;view:PeriodView};
const CalendarPeriodContext=createContext<((target:PeriodTarget)=>void)|null>(null);
export function CalendarPeriodHeading({offset,disabled,readOnly,allowMonthSelection,allowYearSelection}:{offset:number;disabled?:boolean;readOnly?:boolean;allowMonthSelection:boolean;allowYearSelection:boolean}) {
 const state=usePeriodCalendarState();const open=useContext(CalendarPeriodContext)!;const {locale}=useLocale();const {t}=useTranslation();
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
export function CalendarPeriodViewport({children,options,visibleYears,activeTarget,onActiveTargetChange,...constraints}:{children:ReactNode;options?:CalendarPeriodOptions;visibleYears?:number;activeTarget?:PeriodTarget|null;onActiveTargetChange?:(target:PeriodTarget|null)=>void;min?:string;max?:string;unavailable:readonly DateAvailability[];getDateUnavailableReason?:DateAvailabilityRule;disabled?:boolean;readOnly?:boolean}) {
 const state=usePeriodCalendarState();const {t}=useTranslation();
 const [internalTarget,setInternalTarget]=useState<PeriodTarget|null>(null);const target=activeTarget===undefined?internalTarget:activeTarget;const setTarget=(next:PeriodTarget|null)=>{if(activeTarget===undefined)setInternalTarget(next);onActiveTargetChange?.(next);};const offset=target?.offset??null;const root=useRef<HTMLDivElement>(null);const restore=useRef<PeriodTarget|null>(null);
 function close(){restore.current=target;setTarget(null);}
 useEffect(()=>{if(offset===null&&restore.current!==null){root.current?.querySelector<HTMLElement>(`[data-period-heading="${restore.current.offset}-${restore.current.view}"]`)?.closest('button')?.focus();restore.current=null;}},[offset]);
 const date=toCalendar(state.visibleRange.start.add({months:offset??0}),new GregorianCalendar());
 const bounded={...constraints,min:constraints.min,max:constraints.max};
 if(options?.minYear!==undefined){const min=`${String(Math.max(1,Math.floor(options.minYear))).padStart(4,'0')}-01-01`;if(!bounded.min||min>bounded.min)bounded.min=min;}
 if(options?.maxYear!==undefined){const max=`${String(Math.min(9999,Math.floor(options.maxYear))).padStart(4,'0')}-12-31`;if(!bounded.max||max<bounded.max)bounded.max=max;}
 const eligible=(period:ReturnType<typeof getCivilPeriod>)=>period?firstPeriodNavigationDate(period,bounded):null;
 const navigate=(period:ReturnType<typeof getCivilPeriod>)=>{const date=eligible(period);if(date)state.setFocusedDate(parseDate(date));close();};
 useEffect(()=>{if(target)(root.current?.querySelector<HTMLElement>('[data-sgui-part="calendar-period-view"] button[aria-pressed="true"]:not(:disabled)')??root.current?.querySelector<HTMLElement>('[data-sgui-part="calendar-period-view"] button:not(:disabled),[data-sgui-part="calendar-period-view"] input:not(:disabled)'))?.focus({preventScroll:true});},[target?.view,offset]);
 return <CalendarPeriodContext.Provider value={setTarget}><div ref={root} className={styles.periodViewport}>
  <div className={styles.calendar} aria-hidden={offset!==null||undefined} ref={node=>{node?.toggleAttribute("inert",offset!==null);}} style={{visibility:offset!==null?"hidden":undefined}}>{children}</div>
  {offset!==null&&<div className={styles.periodContents} data-sgui-part="calendar-period-view" onKeyDown={event=>{if(event.key!=="Tab"&&event.key!=="Escape")event.stopPropagation();}}><ButtonContext.Provider value={null}><div role="group" aria-label={target!.view==="month"?t("common.ui.chooseMonthInline",{defaultMessage:"Choose month"}):t("common.ui.chooseYearInline",{defaultMessage:"Choose year"})} onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();}}}>
   {target!.view==="month"?<MonthPicker {...constraints} year={date.year} value={date.month} isMonthUnavailable={month=>!eligible(getCivilPeriod(`${String(date.year).padStart(4,'0')}-${String(month).padStart(2,'0')}-01`,"month"))} onValueChange={month=>navigate(getCivilPeriod(`${String(date.year).padStart(4,'0')}-${String(month).padStart(2,'0')}-01`,"month"))}/>:
   <YearPicker {...options} {...constraints} referenceYear={date.year} value={date.year} visibleYears={options?.visibleYears??visibleYears} onValueChange={year=>{const month=getCivilPeriod(`${String(year).padStart(4,'0')}-${String(date.month).padStart(2,'0')}-01`,"month");navigate(eligible(month)?month:getCivilPeriod(`${String(year).padStart(4,'0')}-01-01`,"year"));}}/>}
   </div></ButtonContext.Provider></div>}
 </div></CalendarPeriodContext.Provider>;
}
