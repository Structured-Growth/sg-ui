"use client";
import {FieldMessages,type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {CalendarFormValidity} from "../DateRangeSelector/CalendarFormValidity";
import {useRef,useState} from "react";
import {DateRangeSelector} from "../DateRangeSelector/DateRangeSelector";
import {Select} from "../Select/Select";
import {TextField} from "../TextField/TextField";
import {Button} from "../../components/Button/Button";
import {Popover,type PopoverProps} from "../Popover/Popover";
import {Stack} from "../Stack/Stack";
import {useTranslation} from "../../i18n";
import {useCalendarFormReset} from "../DateRangeSelector/useCalendarFormReset";
import {getCivilPeriod} from "../../utils/relative-dates";
import {isDateOnly,isDateRangeAllowed,type DateRange,type DateRangeConstraints} from "../DateRangeSelector/date-contract";
export interface PeriodPickerProps extends DateRangeConstraints, FieldMessagePlacementProps {
 label:string;
 /** Select a whole calendar period; week starts Monday unless firstDayOfWeek overrides it. */
 unit:"week"|"month"|"quarter"|"year";
 value?:DateRange|null;defaultValue?:DateRange|null;onValueChange?:(value:DateRange|null)=>void;
 /** Civil anchor for the initial view. Supply this for deterministic SSR; never interpreted as an instant. */
 referenceDate?:string;
 firstDayOfWeek?:"sun"|"mon";
 presentation?:PopoverProps["presentation"];
 name?:string;disabled?:boolean;readOnly?:boolean;required?:boolean;
}
export function PeriodPicker({label,unit,value,defaultValue=null,onValueChange,referenceDate,firstDayOfWeek='mon',presentation='popover',name,disabled,readOnly,required,descriptionPlacement,errorPlacement,...constraints}:PeriodPickerProps){
 const {t,locale}=useTranslation();const root=useRef<HTMLDivElement>(null);
 const [internal,setInternal]=useState(defaultValue),selected=value===undefined?internal:value;
 const [yearDraft,setYearDraft]=useState<string|null>(null);
 const [open,setOpen]=useState(false),[anchor,setAnchor]=useState<string|null>(null);
 const proposed=anchor??selected?.start??referenceDate;
 const current=proposed&&isDateOnly(proposed)?proposed:'2000-01-01';
 const candidate=getCivilPeriod(current,unit,firstDayOfWeek==='sun'?0:1);
 const valid=Boolean((yearDraft===null||/^\d{4}$/.test(yearDraft)&&Number(yearDraft)>0)&&candidate&&isDateRangeAllowed(candidate,constraints));
 const change=(next:DateRange|null)=>{if(disabled||readOnly)return;if(value===undefined)setInternal(next);onValueChange?.(next);setOpen(false);};
 useCalendarFormReset(root,()=>{if(value===undefined)setInternal(defaultValue);setAnchor(null);setOpen(false);});
 const year=Number(current.slice(0,4)),month=Number(current.slice(5,7));
 const validationMessage=(!valid&&<p role="alert">{t("common.ui.periodUnavailable",{defaultMessage:"This period is unavailable."})}</p>);
 return <div ref={root}><Popover title={label} showTitle={false} presentation={presentation} size="content" open={open} onOpenChange={next=>{setOpen(next);if(next){setYearDraft(null);setAnchor(selected?.start??referenceDate??'2000-01-01');}}} trigger={<Button variant="outlined" tone="neutral" disabled={disabled||readOnly} aria-label={label}>{selected?`${selected.start} – ${selected.end}`:label}</Button>}>
  <Stack gap={3} align="start"><FieldMessages position="above" errorPlacement={errorPlacement} error={validationMessage}/>
   <TextField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} disabled={disabled} readOnly={readOnly} label={t("common.ui.year",{defaultMessage:"Year"})} value={yearDraft??String(year)} onValueChange={text=>{setYearDraft(text);if(/^\d{4}$/.test(text)&&Number(text)>0)setAnchor(`${text}-${String(month).padStart(2,'0')}-01`);}}/>
   {(unit==='month'||unit==='quarter')&&<Select descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} disabled={disabled} readOnly={readOnly} label={unit==='month'?t("common.ui.month",{defaultMessage:"Month"}):t("common.ui.quarter",{defaultMessage:"Quarter"})} value={String(unit==='month'?month:Math.floor((month-1)/3)+1)} options={Array.from({length:unit==='month'?12:4},(_,i)=>({id:String(i+1),label:unit==='month'?new Intl.DateTimeFormat(locale,{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2000,i,1))):t("common.ui.quarterNumber",{defaultMessage:"Quarter {number}",values:{number:i+1}})}))} onValueChange={v=>setAnchor(`${String(year).padStart(4,'0')}-${String(unit==='month'?Number(v):(Number(v)-1)*3+1).padStart(2,'0')}-01`)}/>}
   {unit==='week'&&<DateRangeSelector descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} {...constraints} disabled={disabled} readOnly={readOnly} label={label} navigation="month-year" firstDayOfWeek={firstDayOfWeek} value={candidate} defaultFocusedDate={current} months={1} selectionUnit="week" commitBehavior="immediate" showFields={false} showActions={false} rangeDragBehavior="none" onValueChange={next=>{if(next)setAnchor(next.start);}}/>}
   <FieldMessages position="below" errorPlacement={errorPlacement} error={validationMessage}/>
   <Stack direction="row" wrap gap={2}>
    <Button variant="text" disabled={required||disabled||readOnly} onPress={()=>change(null)}>{t("common.ui.clear",{defaultMessage:"Clear"})}</Button>
    <Button variant="outlined" onPress={()=>setOpen(false)}>{t("common.ui.cancel",{defaultMessage:"Cancel"})}</Button>
    <Button disabled={!valid||disabled||readOnly} onPress={()=>change(candidate)}>{t("common.ui.apply",{defaultMessage:"Apply"})}</Button>
   </Stack>
  </Stack>
 </Popover><CalendarFormValidity label={label} empty={selected===null} valid={selected===null||Boolean(getCivilPeriod(selected.start,unit,firstDayOfWeek==='sun'?0:1)?.end===selected.end&&isDateRangeAllowed(selected,constraints))} required={required} disabled={disabled||readOnly}/>{name&&<><input type="hidden" name={`${name}.start`} value={selected?.start??''} disabled={disabled}/><input type="hidden" name={`${name}.end`} value={selected?.end??''} disabled={disabled}/></>}</div>;
}
