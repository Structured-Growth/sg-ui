"use client";
import {MonthPicker} from "../MonthPicker/MonthPicker";
import {YearPicker,type YearPickerProps} from "../YearPicker/YearPicker";
import {KeyboardArrowDownIcon} from "../../icons/KeyboardArrowDownIcon";
import styles from "./PeriodPicker.module.css";
import {FieldMessages,type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {CalendarFormValidity} from "../DateRangeSelector/CalendarFormValidity";
import {useEffect,useRef,useState} from "react";
import {DateRangeSelector} from "../DateRangeSelector/DateRangeSelector";
import {Select} from "../Select/Select";
import {TextField} from "../TextField/TextField";
import {Button} from "../../components/Button/Button";
import {Popover,type PopoverProps} from "../Popover/Popover";
import {Stack} from "../Stack/Stack";
import {useTranslation} from "../../i18n";
import {useCalendarFormReset} from "../DateRangeSelector/useCalendarFormReset";
import {firstPeriodNavigationDate} from "./period-navigation";
import {getCivilPeriod} from "../../utils/relative-dates";
import {isDateOnly,isDateRangeAllowed,type DateRange,type DateRangeConstraints} from "../DateRangeSelector/date-contract";
export interface PeriodPickerProps extends DateRangeConstraints, FieldMessagePlacementProps {
 label:string;
 /** Popup trigger by default; inline renders the chooser in place without creating an overlay. */
 display?:"popup"|"inline";
 /** Called on Cancel, or unhandled Escape in inline mode. The host owns returning to its previous view. */
 onCancel?:()=>void;
 /** Inline year choices scroll in four columns by default; paged shows page controls. */
 yearNavigation?:YearPickerProps["yearNavigation"];
 /** Number of year buttons per inline page in paged mode. Defaults 12. */
 yearsPerPage?:12|16|24;
 /** Selection requires the entire period to be allowed (default). Navigation requires any selectable day and emits the period without committing a day. */
 purpose?:"selection"|"navigation";
 /** For inline navigation only: show month or year choices exclusively and navigate immediately on selection. No action buttons. Escape returns without navigating. Omit for the combined draft chooser. */
 navigationView?:"month"|"year";
 /** Year input style. Defaults text for selection, select for navigation. */
 yearEntry?:"text"|"select";
 /** Additional inclusive Gregorian year bounds, intersected with min/max dates. Defaults 1–9999. */
 minYear?:number;maxYear?:number;
 /** Year choices when one or both year bounds are absent. Defaults 120 around the anchor. Explicit two-sided bounds offer the complete interval. */
 visibleYears?:number;
 /** Select a whole calendar period; week starts Monday unless firstDayOfWeek overrides it. */
 unit:"week"|"month"|"quarter"|"year";
 value?:DateRange|null;defaultValue?:DateRange|null;onValueChange?:(value:DateRange|null)=>void;
 /** Civil anchor for the initial view. Supply this for deterministic SSR; never interpreted as an instant. */
 referenceDate?:string;
 firstDayOfWeek?:"sun"|"mon";
 presentation?:PopoverProps["presentation"];
 name?:string;disabled?:boolean;readOnly?:boolean;required?:boolean;
}
export function PeriodPicker({label,unit,value,defaultValue=null,onValueChange,referenceDate,firstDayOfWeek='mon',presentation='popover',name,disabled,readOnly,required,descriptionPlacement,errorPlacement,display="popup",onCancel,yearsPerPage=12,yearNavigation="scroll",purpose="selection",navigationView,yearEntry=purpose==="navigation"?"select":"text",minYear,maxYear,visibleYears=120,...constraints}:PeriodPickerProps){
 const {t,locale}=useTranslation();const root=useRef<HTMLDivElement>(null);
 const [internal,setInternal]=useState(defaultValue),selected=value===undefined?internal:value;
 const [yearDraft,setYearDraft]=useState<string|null>(null);
 const [open,setOpen]=useState(false),[anchor,setAnchor]=useState<string|null>(null);
 const [inlineYears,setInlineYears]=useState(false);
 const direct=display==="inline"&&purpose==="navigation"&&navigationView!==undefined;
 const showYears=direct?navigationView==="year":inlineYears;
 const expanded=display==="inline"||open;
 useEffect(()=>{if(display==="inline")root.current?.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled)')?.focus();},[display]);
 const cancel=()=>{setOpen(false);setYearDraft(null);setAnchor(selected?.start??referenceDate??null);onCancel?.();};
 const proposed=anchor??selected?.start??referenceDate;
 const current=proposed&&isDateOnly(proposed)?proposed:'2000-01-01';
 const candidate=getCivilPeriod(current,unit,firstDayOfWeek==='sun'?0:1);
 const lowerYear=Math.max(1,Number.isFinite(minYear)?Math.floor(minYear!):1,Number(constraints.min?.slice(0,4)??1));
 const upperYear=Math.min(9999,Number.isFinite(maxYear)?Math.floor(maxYear!):9999,Number(constraints.max?.slice(0,4)??9999));
 const boundedConstraints={...constraints,min:constraints.min&&constraints.min>`${String(lowerYear).padStart(4,'0')}-01-01`?constraints.min:`${String(lowerYear).padStart(4,'0')}-01-01`,max:constraints.max&&constraints.max<`${String(upperYear).padStart(4,'0')}-12-31`?constraints.max:`${String(upperYear).padStart(4,'0')}-12-31`};
 const available=(period:DateRange|null)=>Boolean(period&&(purpose==="navigation"?firstPeriodNavigationDate(period,boundedConstraints):isDateRangeAllowed(period,boundedConstraints)));
 const valid=Boolean(Number(current.slice(0,4))>=lowerYear&&Number(current.slice(0,4))<=upperYear&&(yearDraft===null||/^\d{4}$/.test(yearDraft)&&Number(yearDraft)>0)&&(!expanded||available(candidate)));
 const change=(next:DateRange|null)=>{if(disabled||readOnly)return;if(value===undefined)setInternal(next);onValueChange?.(next);setOpen(false);};
 useCalendarFormReset(root,()=>{if(value===undefined)setInternal(defaultValue);setAnchor(null);setOpen(false);});
 const year=Number(current.slice(0,4)),month=Number(current.slice(5,7));
 const count=Number.isFinite(visibleYears)?Math.max(1,Math.min(9999,Math.floor(visibleYears))):120;
 const bothBounds=(minYear!==undefined||constraints.min!==undefined)&&(maxYear!==undefined||constraints.max!==undefined);
 const firstYear=bothBounds?lowerYear:Math.max(lowerYear,Math.min(year-Math.floor(count/2),upperYear-count+1));
 const lastYear=bothBounds?upperYear:Math.min(upperYear,firstYear+count-1);
 const years=expanded&&display==="popup"&&yearEntry==="select"?Array.from({length:Math.max(0,lastYear-firstYear+1)},(_,i)=>{const y=firstYear+i,period=getCivilPeriod(`${String(y).padStart(4,'0')}-01-01`,"year");return {id:String(y),label:new Intl.NumberFormat(locale,{useGrouping:false}).format(y),disabled:!period||!firstPeriodNavigationDate(period,boundedConstraints)};}):[];
 const validationMessage=(!valid&&<p role="alert">{t("common.ui.periodUnavailable",{defaultMessage:"This period is unavailable."})}</p>);
 const formFields=(purpose==="selection"&&<><CalendarFormValidity label={label} empty={selected===null} valid={selected===null||Number(selected.start.slice(0,4))>=lowerYear&&Number(selected.end.slice(0,4))<=upperYear&&Boolean(getCivilPeriod(selected.start,unit,firstDayOfWeek==='sun'?0:1)?.end===selected.end&&isDateRangeAllowed(selected,boundedConstraints))} required={required} disabled={disabled||readOnly}/>{name&&<><input type="hidden" name={`${name}.start`} value={selected?.start??''} disabled={disabled}/><input type="hidden" name={`${name}.end`} value={selected?.end??''} disabled={disabled}/></>}</>);
 const popupContent=(  <Stack gap={3} align="start"><FieldMessages position="above" errorPlacement={errorPlacement} error={validationMessage}/>
   {yearEntry==="select"?<Select label={t("common.ui.year",{defaultMessage:"Year"})} options={years} value={String(year)} onValueChange={text=>{if(text){setYearDraft(null);setAnchor(`${text.padStart(4,'0')}-${String(month).padStart(2,'0')}-01`);}}} disabled={disabled} readOnly={readOnly}/>:<TextField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} disabled={disabled} readOnly={readOnly} label={t("common.ui.year",{defaultMessage:"Year"})} value={yearDraft??String(year)} onValueChange={text=>{setYearDraft(text);if(/^\d{4}$/.test(text)&&Number(text)>0)setAnchor(`${text}-${String(month).padStart(2,'0')}-01`);}}/>}
   {(unit==='month'||unit==='quarter')&&<Select descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} disabled={disabled} readOnly={readOnly} label={unit==='month'?t("common.ui.month",{defaultMessage:"Month"}):t("common.ui.quarter",{defaultMessage:"Quarter"})} value={String(unit==='month'?month:Math.floor((month-1)/3)+1)} options={expanded?Array.from({length:unit==='month'?12:4},(_,i)=>({id:String(i+1),disabled:!available(getCivilPeriod(`${String(year).padStart(4,'0')}-${String(unit==='month'?i+1:i*3+1).padStart(2,'0')}-01`,unit)),label:unit==='month'?new Intl.DateTimeFormat(locale,{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2000,i,1))):t("common.ui.quarterNumber",{defaultMessage:"Quarter {number}",values:{number:i+1}})})):[]} onValueChange={v=>setAnchor(`${String(year).padStart(4,'0')}-${String(unit==='month'?Number(v):(Number(v)-1)*3+1).padStart(2,'0')}-01`)}/>}
   {unit==='week'&&<DateRangeSelector descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} {...constraints} disabled={disabled} readOnly={readOnly} label={label} navigation="month-year" firstDayOfWeek={firstDayOfWeek} value={candidate} defaultFocusedDate={current} months={1} selectionUnit="week" commitBehavior="immediate" showFields={false} showActions={false} rangeDragBehavior="none" onValueChange={next=>{if(next)setAnchor(next.start);}}/>}
   <FieldMessages position="below" errorPlacement={errorPlacement} error={validationMessage}/>
   <Stack direction="row" wrap gap={2}>
    {purpose==="selection"&&<Button variant="text" disabled={required||disabled||readOnly} onPress={()=>change(null)}>{t("common.ui.clear",{defaultMessage:"Clear"})}</Button>}
    <Button variant="outlined" onPress={cancel}>{t("common.ui.cancel",{defaultMessage:"Cancel"})}</Button>
    <Button disabled={!valid||disabled||readOnly} onPress={()=>change(candidate)}>{t("common.ui.apply",{defaultMessage:"Apply"})}</Button>
   </Stack>
  </Stack>);
 const chooseYear=(text:string)=>{
  const next=`${text.padStart(4,'0')}-${String(month).padStart(2,'0')}-01`;
  if(direct){const period=getCivilPeriod(next,"month");change(available(period)?period:getCivilPeriod(`${text.padStart(4,'0')}-01-01`,"year"));}
  else {setYearDraft(null);setAnchor(next);setInlineYears(false);}
 };
 const inlineContent=<div className={styles.inline}>
  {!showYears&&<div className={styles.header}>
   {yearEntry==="text"?<TextField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} label={t("common.ui.year",{defaultMessage:"Year"})} value={yearDraft??String(year)} disabled={disabled} readOnly={readOnly} onValueChange={text=>{setYearDraft(text);if(/^\d{4}$/.test(text)&&Number(text)>0)setAnchor(`${text}-${String(month).padStart(2,'0')}-01`);}}/>:
    <Button variant="text" tone="neutral" disabled={disabled||readOnly} aria-label={t("common.ui.chooseYear",{defaultMessage:"Choose year, {year}",values:{year}})} endIcon={<KeyboardArrowDownIcon size={16}/>} aria-expanded={inlineYears} onPress={()=>setInlineYears(true)}>{String(year)}</Button>}
  </div>}
  <FieldMessages position="above" errorPlacement={errorPlacement} error={validationMessage}/>
  <div className={unit==="quarter"&&!showYears?styles.grid:undefined}>
   {showYears?<YearPicker yearNavigation={yearNavigation} {...boundedConstraints} value={year} minYear={minYear} maxYear={maxYear} visibleYears={visibleYears} yearsPerPage={yearsPerPage} disabled={disabled} readOnly={readOnly} onValueChange={next=>chooseYear(String(next))}/>:unit==='month'?<MonthPicker {...boundedConstraints} year={year} value={month} disabled={disabled} readOnly={readOnly} isMonthUnavailable={next=>!available(getCivilPeriod(`${String(year).padStart(4,'0')}-${String(next).padStart(2,'0')}-01`,"month"))} onValueChange={next=>setAnchor(`${String(year).padStart(4,'0')}-${String(next).padStart(2,'0')}-01`)}/>:unit==='quarter'?Array.from({length:4},(_,i)=>{
    const m=i*3+1,period=getCivilPeriod(`${String(year).padStart(4,'0')}-${String(m).padStart(2,'0')}-01`,unit);
    const full=t("common.ui.quarterNumber",{defaultMessage:"Quarter {number}",values:{number:i+1}});
    return <Button key={m} className={styles.choice} aria-label={full} aria-pressed={Math.floor((month-1)/3)===i} disabled={disabled||readOnly||!available(period)} variant={Math.floor((month-1)/3)===i?"filled":"text"} tone={Math.floor((month-1)/3)===i?"primary":"neutral"} onPress={()=>setAnchor(`${String(year).padStart(4,'0')}-${String(m).padStart(2,'0')}-01`)}>{full}</Button>;
   }):null}
  </div>
  <FieldMessages position="below" errorPlacement={errorPlacement} error={validationMessage}/>
  {!direct&&<Stack direction="row" wrap gap={2}>{purpose==="selection"&&<Button variant="text" disabled={required||disabled||readOnly} onPress={()=>change(null)}>{t("common.ui.clear",{defaultMessage:"Clear"})}</Button>}<Button variant="text" tone="neutral" onPress={cancel}>{t("common.ui.cancel",{defaultMessage:"Cancel"})}</Button><Button disabled={disabled||readOnly||!valid} onPress={()=>change(candidate)}>{t("common.ui.apply",{defaultMessage:"Apply"})}</Button></Stack>}
 </div>;
 if(display==="inline")return <div ref={root} role="group" aria-label={label} onKeyDown={event=>{if(event.key==="Escape"&&!event.defaultPrevented&&onCancel){event.preventDefault();event.stopPropagation();cancel();}}}>{direct?(navigationView==="year"?<YearPicker yearNavigation={yearNavigation} {...boundedConstraints} value={year} minYear={minYear} maxYear={maxYear} visibleYears={visibleYears} yearsPerPage={yearsPerPage} yearEntry={yearEntry} disabled={disabled} readOnly={readOnly} onValueChange={next=>chooseYear(String(next))}/>:<MonthPicker {...boundedConstraints} year={year} value={month} disabled={disabled} readOnly={readOnly} onValueChange={next=>change(getCivilPeriod(`${String(year).padStart(4,'0')}-${String(next).padStart(2,'0')}-01`,"month"))}/>):unit==='week'?popupContent:inlineContent}{formFields}</div>;
 return <div ref={root}><Popover title={label} showTitle={false} presentation={presentation} size="content" open={open} onOpenChange={next=>{setOpen(next);if(next){setYearDraft(null);setAnchor(selected?.start??referenceDate??'2000-01-01');}}} trigger={<Button variant="outlined" tone="neutral" disabled={disabled||readOnly} aria-label={label}>{selected?`${selected.start} – ${selected.end}`:label}</Button>}>
{popupContent}
 </Popover>{formFields}</div>;
}
