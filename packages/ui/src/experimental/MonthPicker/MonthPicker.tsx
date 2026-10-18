"use client";
import {useEffect,useRef,useState,type CSSProperties} from "react";
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
 const {t}=useTranslation();const {locale}=useLocale();const [columns,setColumns]=useState(2);const grid=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=grid.current;if(!element)return;
  const measure=()=>{
   const buttons=Array.from(element.querySelectorAll("button"));if(!buttons.length)return;
   const style=getComputedStyle(element),gap=parseFloat(style.rowGap)||0;
   const width=element.clientWidth-(parseFloat(style.paddingLeft)||0)-(parseFloat(style.paddingRight)||0);
   const height=element.clientHeight-(parseFloat(style.paddingTop)||0)-(parseFloat(style.paddingBottom)||0);
   if(width<=0||height<=0)return;
   let minimumWidth=0,minimumHeight=0;
   for(const button of buttons){const computed=getComputedStyle(button),label=button.querySelector("span");
    minimumWidth=Math.max(minimumWidth,parseFloat(computed.minBlockSize)||0,parseFloat(computed.minInlineSize)||0,(label?.scrollWidth??0)+(parseFloat(computed.paddingLeft)||0)+(parseFloat(computed.paddingRight)||0)+(parseFloat(computed.borderLeftWidth)||0)+(parseFloat(computed.borderRightWidth)||0));
    minimumHeight=Math.max(minimumHeight,parseFloat(computed.minBlockSize)||0,(label?.getBoundingClientRect().height??0)+(parseFloat(computed.paddingTop)||0)+(parseFloat(computed.paddingBottom)||0)+(parseFloat(computed.borderTopWidth)||0)+(parseFloat(computed.borderBottomWidth)||0));
   }
   const candidates=[2,3,4,6,12],fitsWidth=(count:number)=>count*minimumWidth+(count-1)*gap<=width+1;
   const next=candidates.find(count=>fitsWidth(count)&&Math.ceil(12/count)*minimumHeight+(Math.ceil(12/count)-1)*gap<=height+1)??[12,6,4,3,2,1].find(fitsWidth)??1;
   setColumns(previous=>previous===next?previous:next);
  };
  measure();const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(measure):null;observer?.observe(element);for(const button of element.querySelectorAll("button")){observer?.observe(button);if(button.firstElementChild)observer?.observe(button.firstElementChild);}
  return ()=>observer?.disconnect();
 },[locale]);
 const [internal,setInternal]=useState(defaultValue);const selected=value===undefined?internal:value;
 return <div ref={grid} className={`${styles.grid} ${styles.monthGrid}`} data-month-columns={columns} style={{"--month-columns":columns} as CSSProperties} role="group" aria-label={label??t("common.ui.monthChoices",{defaultMessage:"Month choices"})}>{Array.from({length:12},(_,index)=>{
  const month=index+1,period=Number.isInteger(year)&&year>=1&&year<=9999?getCivilPeriod(`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-01`,"month"):null;
  const blocked=!period||!firstPeriodNavigationDate(period,constraints)||Boolean(isMonthUnavailable?.(month));
  const format=(width:"long"|"short")=>new Intl.DateTimeFormat(locale,{month:width,calendar:"gregory",timeZone:"UTC"}).format(new Date(Date.UTC(2000,index,1)));
  return <Button key={month} className={styles.choice} aria-label={format("long")} aria-pressed={selected===month} variant={selected===month?"filled":"text"} tone={selected===month?"primary":"neutral"} disabled={disabled||readOnly||blocked} onPress={()=>{if(value===undefined)setInternal(month);onValueChange?.(month);}}>{format("short")}</Button>;
 })}</div>;
}
