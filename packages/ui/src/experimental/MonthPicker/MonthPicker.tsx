"use client";
import {useState} from "react";
import {useLocale} from "react-aria-components/I18nProvider";
import {Button} from "../../components/Button/Button";
import {useTranslation} from "../../i18n";
import {getCivilPeriod} from "../../utils/relative-dates";
import {firstPeriodNavigationDate} from "../PeriodPicker/period-navigation";
import type {DateRangeConstraints} from "../DateRangeSelector/date-contract";
import styles from "../PeriodPicker/PeriodPicker.module.css";
export interface MonthPickerProps extends Pick<DateRangeConstraints,"min"|"max"|"unavailable"|"getDateUnavailableReason"> {
 /** Accessible group name. Defaults to Month choices. */
 label?:string;
 /** Gregorian year, 1–9999. Supply explicitly; no live clock is consulted. */
 year:number;
 /** Month number 1–12, or null. Controlled when supplied. */
 value?:number|null;
 defaultValue?:number|null;
 onValueChange?:(month:number)=>void;
 disabled?:boolean;
 readOnly?:boolean;
 /** Additional month-level policy, combined with date restrictions. True disables the choice. */
 isMonthUnavailable?:(month:number)=>boolean;
}
/** Inline month choices. Emits a month number immediately; creates no overlay or date selection. */
export function MonthPicker({label,year,value,defaultValue=null,onValueChange,disabled,readOnly,isMonthUnavailable,...constraints}:MonthPickerProps){
 const {t}=useTranslation();const {locale}=useLocale();const [internal,setInternal]=useState(defaultValue);const selected=value===undefined?internal:value;
 return <div className={styles.grid} role="group" aria-label={label??t("common.ui.monthChoices",{defaultMessage:"Month choices"})}>{Array.from({length:12},(_,index)=>{
  const month=index+1,period=Number.isInteger(year)&&year>=1&&year<=9999?getCivilPeriod(`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-01`,"month"):null;
  const blocked=!period||!firstPeriodNavigationDate(period,constraints)||Boolean(isMonthUnavailable?.(month));
  const format=(width:"long"|"short")=>new Intl.DateTimeFormat(locale,{month:width,calendar:"gregory",timeZone:"UTC"}).format(new Date(Date.UTC(2000,index,1)));
  return <Button key={month} aria-label={format("long")} aria-pressed={selected===month} variant={selected===month?"filled":"text"} tone={selected===month?"primary":"neutral"} disabled={disabled||readOnly||blocked} onPress={()=>{if(value===undefined)setInternal(month);onValueChange?.(month);}}>{format("short")}</Button>;
 })}</div>;
}
