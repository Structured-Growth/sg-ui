"use client";
import {CalendarFormValidity} from "../DateRangeSelector/CalendarFormValidity";
import {useRef,useState} from "react";
import {DateRangePicker,type DateRangePickerProps} from "../DateRangePicker/DateRangePicker";
import {Select} from "../Select/Select";
import {Popover,type PopoverProps} from "../Popover/Popover";
import {Button} from "../../components/Button/Button";
import {Stack} from "../Stack/Stack";
import {useTranslation} from "../../i18n";
import {useCalendarFormReset} from "../DateRangeSelector/useCalendarFormReset";
import {isDateRangeAllowed,type DateRange} from "../DateRangeSelector/date-contract";
import {addCivilDays,differenceInCivilDays,parseRelativeDateText} from "../../utils/relative-dates";
export interface DateRangeComparison {primary:DateRange;comparison:DateRange|null;mode:'none'|'previous-period'|'previous-year'|'custom'}
export interface DateRangeComparisonPickerProps {
 label:string;value?:DateRangeComparison|null;defaultValue?:DateRangeComparison|null;onValueChange?:(value:DateRangeComparison|null)=>void;
 /** Shared restrictions and calendar configuration; the composition owns each child value and commit callbacks. */
 rangeProps?:Omit<DateRangePickerProps,'label'|'value'|'defaultValue'|'onValueChange'|'name'|'disabled'|'readOnly'|'required'>;
 presentation?:PopoverProps['presentation'];name?:string;disabled?:boolean;readOnly?:boolean;required?:boolean;
}
function comparisonFor(primary:DateRange|null,mode:DateRangeComparison['mode'],custom:DateRange|null):DateRange|null{
 if(!primary||mode==='none')return null;
 if(mode==='custom')return custom;
 if(mode==='previous-year'){
  const start=parseRelativeDateText('a year ago',primary.start,'en-US'),end=parseRelativeDateText('a year ago',primary.end,'en-US');
  return start&&end?{start,end}:null;
 }
 const count=differenceInCivilDays(primary.start,primary.end)+1;
 const start=addCivilDays(primary.start,-count),end=addCivilDays(primary.start,-1);
 return start&&end?{start,end}:null;
}
export function DateRangeComparisonPicker({label,value,defaultValue=null,onValueChange,rangeProps,presentation='popover',name,disabled,readOnly,required}:DateRangeComparisonPickerProps){
 const {t}=useTranslation(),root=useRef<HTMLDivElement>(null);
 const [internal,setInternal]=useState(defaultValue),selected=value===undefined?internal:value;
 const [open,setOpen]=useState(false),[primary,setPrimary]=useState<DateRange|null>(null),[custom,setCustom]=useState<DateRange|null>(null),[mode,setMode]=useState<DateRangeComparison['mode']>('previous-period');
 const [validity,setValidity]=useState([true,true]);
 const report=(index:number,next:boolean)=>setValidity(previous=>previous[index]===next?previous:previous.map((old,i)=>i===index?next:old));
 const comparison=comparisonFor(primary,mode,custom);
 const valid=validity[0]&&(mode==='none'||validity[1])&&primary&&isDateRangeAllowed(primary,rangeProps)&& (mode==='none'||comparison&&isDateRangeAllowed(comparison,rangeProps));
 const accept=(next:DateRangeComparison|null)=>{if(disabled||readOnly)return;if(value===undefined)setInternal(next);onValueChange?.(next);setOpen(false);};
 useCalendarFormReset(root,()=>{if(value===undefined)setInternal(defaultValue);setOpen(false);});
 return <div ref={root}><Popover title={label} showTitle={false} presentation={presentation} size="content" open={open} onOpenChange={next=>{setOpen(next);if(next){setValidity([true,true]);setPrimary(selected?.primary??null);setCustom(selected?.comparison??null);setMode(selected?.mode??'previous-period');}}} trigger={<Button variant="outlined" tone="neutral" aria-label={label} disabled={disabled||readOnly}>{selected?`${selected.primary.start} – ${selected.primary.end}`:label}</Button>}>
  <Stack gap={3} align="start"><DateRangePicker {...rangeProps} disabled={disabled} readOnly={readOnly} label={t('common.ui.primaryPeriod',{defaultMessage:'Primary period'})} value={primary} onValidityChange={next=>report(0,next)} onValueChange={setPrimary} required/>
  <Select disabled={disabled} readOnly={readOnly} label={t('common.ui.compareWith',{defaultMessage:'Compare with'})} value={mode} onValueChange={next=>setMode(next as DateRangeComparison['mode'])} options={[
   {id:'none',label:t('common.ui.noComparison',{defaultMessage:'No comparison'})},{id:'previous-period',label:t('common.ui.previousPeriod',{defaultMessage:'Previous period'})},{id:'previous-year',label:t('common.ui.previousYear',{defaultMessage:'Previous year'})},{id:'custom',label:t('common.ui.customPeriod',{defaultMessage:'Custom period'})},]}/>
  {mode!=='none'&&<DateRangePicker {...rangeProps} disabled={disabled} readOnly={readOnly} label={t('common.ui.comparisonPeriod',{defaultMessage:'Comparison period'})} value={comparison} onValidityChange={next=>report(1,next)} onValueChange={next=>{setCustom(next);setMode('custom');}} required/>}
  {!valid&&validity[0]&&(mode==='none'||validity[1])&&<p role="status">{t('common.ui.completeComparison',{defaultMessage:'Choose complete, available primary and comparison periods.'})}</p>}
  <Stack direction="row" gap={2}><Button variant="text" disabled={required||disabled||readOnly} onPress={()=>accept(null)}>{t('common.ui.clear',{defaultMessage:'Clear'})}</Button><Button variant="outlined" onPress={()=>setOpen(false)}>{t('common.ui.cancel',{defaultMessage:'Cancel'})}</Button><Button disabled={!valid||disabled||readOnly} onPress={()=>{if(primary)accept({primary,comparison,mode});}}>{t('common.ui.apply',{defaultMessage:'Apply'})}</Button></Stack>
  </Stack>
 </Popover><CalendarFormValidity label={label} empty={selected===null} valid={selected===null||Boolean(isDateRangeAllowed(selected.primary,rangeProps)&&(selected.mode==='none'||selected.comparison&&isDateRangeAllowed(selected.comparison,rangeProps)))} required={required} disabled={disabled||readOnly}/>{name&&<input type="hidden" name={name} value={selected?JSON.stringify(selected):''} disabled={disabled}/>}</div>;
}
