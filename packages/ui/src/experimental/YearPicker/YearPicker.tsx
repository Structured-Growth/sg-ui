"use client";
import {useEffect,useRef,useState} from "react";
import {useLocale} from "react-aria-components/I18nProvider";
import {Button} from "../../components/Button/Button";
import type {FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {TextField} from "../TextField/TextField";
import {useTranslation} from "../../i18n";
import {getCivilPeriod} from "../../utils/relative-dates";
import {firstPeriodNavigationDate} from "../PeriodPicker/period-navigation";
import type {DateRangeConstraints} from "../DateRangeSelector/date-contract";
import styles from "../PeriodPicker/PeriodPicker.module.css";
export interface YearPickerProps extends FieldMessagePlacementProps, Pick<DateRangeConstraints,"min"|"max"|"unavailable"|"getDateUnavailableReason"> {
 label?:string;
 /** Gregorian year 1–9999, or null. Controlled when supplied. */
 value?:number|null;
 defaultValue?:number|null;
 onValueChange?:(year:number)=>void;
 /** Deterministic initial year window. Defaults to the selected year, or 2000. */
 referenceYear?:number;
 /** Inclusive bounds, intersected with date bounds and years 1–9999. */
 minYear?:number;maxYear?:number;
 /** Default 120. With two explicit bounds, offer the entire applicable interval. */
 visibleYears?:number;
 /** Four-column vertical scrolling by default. Paged retains the range heading and Previous/Next year-page buttons. Text entry ignores this option. */
 yearNavigation?:"scroll"|"paged";
 /** Number of buttons per page in paged navigation; default 12. Ignored by scroll. */
 yearsPerPage?:12|16|24;
 /** Buttons by default; text accepts a four-digit year on Enter or blur. */
 yearEntry?:"select"|"text";
 disabled?:boolean;readOnly?:boolean;
 isYearUnavailable?:(year:number)=>boolean;
}
/** Inline year choices; no overlay, Apply, Cancel or Clear. */
export function YearPicker({label,value,defaultValue=null,onValueChange,referenceYear,minYear,maxYear,visibleYears=120,yearsPerPage=12,yearNavigation="scroll",yearEntry="select",descriptionPlacement,errorPlacement,disabled,readOnly,isYearUnavailable,...constraints}:YearPickerProps){
 const {t}=useTranslation();const {locale,direction}=useLocale();const [internal,setInternal]=useState(defaultValue);const selected=value===undefined?internal:value;
 const anchor=selected??referenceYear??2000;
 const lower=Math.max(1,Number.isFinite(minYear)?Math.floor(minYear!):1,Number(constraints.min?.slice(0,4)??1));
 const upper=Math.min(9999,Number.isFinite(maxYear)?Math.floor(maxYear!):9999,Number(constraints.max?.slice(0,4)??9999));
 const count=Number.isFinite(visibleYears)?Math.max(1,Math.min(9999,Math.floor(visibleYears))):120;
 const bounded=(minYear!==undefined||constraints.min!==undefined)&&(maxYear!==undefined||constraints.max!==undefined);
 const first=bounded?lower:Math.max(lower,Math.min(anchor-Math.floor(count/2),upper-count+1));const last=bounded?upper:Math.min(upper,first+count-1);
 const size=[12,16,24].includes(yearsPerPage)?yearsPerPage:12;
 const [page,setPage]=useState<number|null>(null),[draft,setDraft]=useState<string|null>(null),[attempted,setAttempted]=useState(false);
 const start=Math.max(0,Math.min(page??Math.floor(Math.max(0,anchor-first)/size)*size,Math.floor(Math.max(0,last-first)/size)*size));
 const allowed=(year:number)=>{const period=Number.isInteger(year)&&year>=lower&&year<=upper?getCivilPeriod(`${String(year).padStart(4,'0')}-01-01`,"year"):null;return Boolean(period&&firstPeriodNavigationDate(period,constraints)&&!isYearUnavailable?.(year));};
 const choose=(year:number)=>{if(disabled||readOnly||!allowed(year))return;if(value===undefined)setInternal(year);onValueChange?.(year);};
 const text=draft??String(selected??referenceYear??"");const valid=/^\d{4}$/.test(text)&&allowed(Number(text));
 const accept=()=>{if(draft===null)return;setAttempted(true);if(valid){choose(Number(text));setDraft(null);setAttempted(false);}};
 const scroll=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const viewport=scroll.current;if(!viewport||yearNavigation!=="scroll"||yearEntry!=="select")return;
  const reveal=()=>{const target=viewport.querySelector<HTMLElement>(`[data-year="${Math.max(first,Math.min(last,anchor))}"]`);if(!target)return;const offset=target.getBoundingClientRect().top-viewport.getBoundingClientRect().top+viewport.scrollTop;viewport.scrollTop=Math.max(0,offset-(viewport.clientHeight-target.offsetHeight)/2);};
  reveal();const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(reveal):null;observer?.observe(viewport);return ()=>observer?.disconnect();
 },[anchor,first,last,yearNavigation,yearEntry]);
 const format=(year:number)=>new Intl.NumberFormat(locale,{useGrouping:false}).format(year);
 return <div className={`${styles.inline} ${styles.yearRoot}`} data-year-navigation={yearEntry==="select"?yearNavigation:undefined} role="group" aria-label={label??t("common.ui.yearChoices",{defaultMessage:"Year choices"})}>
 {yearEntry==="text"?<div onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();accept();}}} onBlur={accept}><TextField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} label={t("common.ui.year",{defaultMessage:"Year"})} value={text} onValueChange={next=>{setDraft(next);setAttempted(false);}} disabled={disabled} readOnly={readOnly} invalid={attempted&&!valid} errorMessage={t("common.ui.yearUnavailable",{defaultMessage:"Enter an available four-digit year."})}/></div>:yearNavigation==="scroll"?<div ref={scroll} className={styles.yearScroll} data-sgui-part="year-scroll" onKeyDown={event=>{
  const button=(event.target as HTMLElement).closest<HTMLElement>('[data-year]');if(!button)return;
  const year=Number(button.dataset.year),rowStep=4,rows=Math.max(1,Math.floor(event.currentTarget.clientHeight/Math.max(1,button.offsetHeight))),delta:Record<string,number>={ArrowLeft:direction==="rtl"?1:-1,ArrowRight:direction==="rtl"?-1:1,ArrowUp:-rowStep,ArrowDown:rowStep,PageUp:-rows*rowStep,PageDown:rows*rowStep};
  if(!(event.key in delta)&&event.key!=="Home"&&event.key!=="End")return;
  event.preventDefault();event.stopPropagation();const step=event.key==="End"?-1:event.key==="Home"?1:Math.sign(delta[event.key]);let next=event.key==="Home"?first:event.key==="End"?last:Math.max(first,Math.min(last,year+delta[event.key]));
  while(next>=first&&next<=last){const target=event.currentTarget.querySelector<HTMLButtonElement>(`button[data-year="${next}"]:not(:disabled)`);if(target){target.focus();break;}next+=step;}
 }}><div className={styles.grid}>{Array.from({length:Math.max(0,last-first+1)},(_,index)=>{const year=first+index;return <Button key={year} className={styles.choice} data-year={year} aria-pressed={selected===year} variant={selected===year?"filled":"text"} tone={selected===year?"primary":"neutral"} disabled={disabled||readOnly||!allowed(year)} onPress={()=>choose(year)}>{format(year)}</Button>;})}</div></div>:<>
 <div className={styles.header}><span>{first<=last?`${format(first+start)} – ${format(Math.min(last,first+start+size-1))}`:t("common.ui.noAvailableYears",{defaultMessage:"No available years"})}</span>
 <Button variant="text" tone="neutral" aria-label={t("common.ui.previousYears",{defaultMessage:"Previous years"})} disabled={disabled||readOnly||start===0} onPress={()=>setPage(Math.max(0,start-size))}>‹</Button><Button variant="text" tone="neutral" aria-label={t("common.ui.nextYears",{defaultMessage:"Next years"})} disabled={disabled||readOnly||first+start+size>last} onPress={()=>setPage(start+size)}>›</Button></div>
 <div className={styles.grid}>{Array.from({length:Math.max(0,Math.min(size,last-first-start+1))},(_,index)=>{const year=first+start+index;return <Button key={year} className={styles.choice} aria-pressed={selected===year} variant={selected===year?"filled":"text"} tone={selected===year?"primary":"neutral"} disabled={disabled||readOnly||!allowed(year)} onPress={()=>choose(year)}>{format(year)}</Button>;})}</div>
 </>}
 </div>;
}
