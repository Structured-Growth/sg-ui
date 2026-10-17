"use client";
import {FieldMessages,type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import {CalendarFormValidity} from "../DateRangeSelector/CalendarFormValidity";
import {useRef,useState} from "react";
import {DatePicker} from "../DatePicker/DatePicker";
import {TimeField} from "../TimeField/TimeField";
import {Popover,type PopoverProps} from "../Popover/Popover";
import {Button} from "../../components/Button/Button";
import {Stack} from "../Stack/Stack";
import {useCalendarFormReset} from "../DateRangeSelector/useCalendarFormReset";
import {useTranslation} from "../../i18n";
import {isDateOnly,isDateRangeAllowed,type DateRangeConstraints} from "../DateRangeSelector/date-contract";
import {isClockTime} from "../TimeField/parseTimeText";
export interface DateTimeRange {start:string;end:string}
export interface DateTimeRangePickerProps extends Omit<DateRangeConstraints,'min'|'max'|'rangeLength'>, FieldMessagePlacementProps {
 label:string;value?:DateTimeRange|null;defaultValue?:DateTimeRange|null;onValueChange?:(value:DateTimeRange|null)=>void;
 /** Local YYYY-MM-DDTHH:mm:ss bounds. Hosts own timezone conversion and DST disambiguation. */
 min?:string;max?:string;
 /** Suggested minute choices (1–60); arbitrary typed minutes remain valid unless a rule rejects them. */
 minuteStep?:number;hourCycle?:12|24;referenceDate?:string;presentation?:PopoverProps['presentation'];
 /** Endpoint-aware local datetime restriction; return the host's translated reason or undefined. */
 getDateTimeUnavailableReason?:(value:string,endpoint:'start'|'end')=>string|undefined;
 name?:string;disabled?:boolean;readOnly?:boolean;required?:boolean;
}
export function DateTimeRangePicker({label,value,defaultValue=null,onValueChange,min,max,minuteStep=15,hourCycle,referenceDate,presentation='popover',getDateTimeUnavailableReason,name,disabled,readOnly,required,descriptionPlacement="above",errorPlacement="below",...constraints}:DateTimeRangePickerProps){
 const {t}=useTranslation(),root=useRef<HTMLDivElement>(null);
 const [internal,setInternal]=useState(defaultValue),selected=value===undefined?internal:value;
 const [open,setOpen]=useState(false),[draft,setDraft]=useState<DateTimeRange|null>(null);
 const [validity,setValidity]=useState([true,true,true,true]);
 const start=draft?.start??'',end=draft?.end??'';
 const validLocal=(value:string)=>value.length===19&&value[10]==='T'&&isDateOnly(value.slice(0,10))&&isClockTime(value.slice(11));
 const valid=Boolean(validLocal(start)&&validLocal(end)&&(!min||validLocal(min))&&(!max||validLocal(max))&&start<=end&&isClockTime(start.slice(11))&&isClockTime(end.slice(11))&&(!min||start>=min)&&(!max||end<=max)&&validity.every(Boolean)&&
  isDateRangeAllowed({start:start.slice(0,10),end:end.slice(0,10)},constraints)&&!getDateTimeUnavailableReason?.(start,'start')&&!getDateTimeUnavailableReason?.(end,'end'));
 const update=(endpoint:'start'|'end',part:'date'|'time',next:string|null)=>setDraft(previous=>{
  const old=previous?.[endpoint]??'';const changed=part==='date'?`${next??''}T${old.slice(11)||'00:00:00'}`:`${old.slice(0,10)}T${next??''}`;
  return {start:previous?.start??'',end:previous?.end??'',[endpoint]:changed};
 });
 const report=(index:number,next:boolean)=>setValidity(previous=>previous[index]===next?previous:previous.map((old,i)=>i===index?next:old));
 const accept=(next:DateTimeRange|null)=>{if(disabled||readOnly)return;if(value===undefined)setInternal(next);onValueChange?.(next);setOpen(false);};
 useCalendarFormReset(root,()=>{if(value===undefined)setInternal(defaultValue);setOpen(false);setDraft(null);});
 const validationMessage=(!valid&&validity.every(Boolean)&&<p role="status">{t('common.ui.completeDateTimeRange',{defaultMessage:'Choose a complete, available start and end in order.'})}</p>);
 return <div ref={root}><Popover title={label} showTitle={false} presentation={presentation} size="content" open={open} onOpenChange={next=>{setOpen(next);if(next){setDraft(selected);setValidity([true,true,true,true]);}}} trigger={<Button variant="outlined" tone="neutral" aria-label={label} disabled={disabled||readOnly}>{selected?`${selected.start.replace('T',' ')} – ${selected.end.replace('T',' ')}`:label}</Button>}>
  <Stack gap={3} align="start"><FieldMessages position="above" errorPlacement={errorPlacement} error={validationMessage}/><Stack direction="row" wrap gap={3}>{(['start','end'] as const).map((endpoint,index)=><Stack key={endpoint} gap={2}>
   <DatePicker descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} label={endpoint==='start'?t('common.ui.startDate',{defaultMessage:'Start date'}):t('common.ui.endDate',{defaultMessage:'End date'})} getDateUnavailableReason={(date)=>constraints.getDateUnavailableReason?.(date,{range:draft?.start&&draft.end?{start:draft.start.slice(0,10),end:draft.end.slice(0,10)}:null,endpoint})} value={draft?.[endpoint]?.slice(0,10)||null} onValueChange={next=>update(endpoint,'date',next)} referenceDate={referenceDate} disabled={disabled} readOnly={readOnly} onValidityChange={next=>report(index*2,next)} min={min?.slice(0,10)} max={max?.slice(0,10)} navigation="month-year" required/>
   <TimeField descriptionPlacement={descriptionPlacement} errorPlacement={errorPlacement} label={endpoint==='start'?t('common.ui.startTime',{defaultMessage:'Start time'}):t('common.ui.endTime',{defaultMessage:'End time'})} value={draft?.[endpoint]?.slice(11)||null} onValueChange={next=>update(endpoint,'time',next)} onValidityChange={next=>report(index*2+1,next)} minuteStep={minuteStep} hourCycle={hourCycle} disabled={disabled} readOnly={readOnly} required getTimeUnavailableReason={time=>(isDateOnly(draft?.[endpoint]?.slice(0,10)??'')?getDateTimeUnavailableReason?.(`${draft?.[endpoint]?.slice(0,10)}T${time}`,endpoint):undefined)}/>
  </Stack>)}</Stack>
   <FieldMessages position="below" errorPlacement={errorPlacement} error={validationMessage}/>
  <Stack direction="row" gap={2}><Button variant="text" disabled={required||disabled||readOnly} onPress={()=>accept(null)}>{t('common.ui.clear',{defaultMessage:'Clear'})}</Button><Button variant="outlined" onPress={()=>setOpen(false)}>{t('common.ui.cancel',{defaultMessage:'Cancel'})}</Button><Button disabled={!valid||disabled||readOnly} onPress={()=>accept(draft)}>{t('common.ui.apply',{defaultMessage:'Apply'})}</Button></Stack>
  </Stack>
 </Popover><CalendarFormValidity label={label} empty={selected===null} valid={selected===null||Boolean(validLocal(selected.start)&&validLocal(selected.end)&&selected.start<=selected.end&&(!min||validLocal(min)&&selected.start>=min)&&(!max||validLocal(max)&&selected.end<=max)&&isDateRangeAllowed({start:selected.start.slice(0,10),end:selected.end.slice(0,10)},constraints)&&!getDateTimeUnavailableReason?.(selected.start,'start')&&!getDateTimeUnavailableReason?.(selected.end,'end'))} required={required} disabled={disabled||readOnly}/>{name&&<><input type="hidden" name={`${name}.start`} value={selected?.start??''} disabled={disabled}/><input type="hidden" name={`${name}.end`} value={selected?.end??''} disabled={disabled}/></>}</div>;
}
