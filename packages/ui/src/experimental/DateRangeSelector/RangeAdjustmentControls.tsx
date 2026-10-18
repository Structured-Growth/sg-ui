"use client";
import {Button} from "../../components/Button/Button";
import {useTranslation} from "../../i18n";
import {addCivilDays} from "../../utils/relative-dates";
import {resolveRangeDrag,type RangeDragBehavior} from "./RangeGestures";
import {isDateOnly,type DateRange,type DateRangeLength} from "./date-contract";
import styles from "./DateRangeSelector.module.css";

export type RangeAdjustmentOperation="move"|"start"|"end";

/** Pointer equivalents share the gesture solver, including coupled boundaries. */
export function RangeAdjustmentControls({value,behavior,length,disabled,isAllowed,onEdit,operation,onOperationChange}:{
  value:DateRange|null;behavior:RangeDragBehavior;length?:DateRangeLength;disabled?:boolean;
  isAllowed:(range:DateRange)=>boolean;onEdit:(range:DateRange)=>void;
  operation:RangeAdjustmentOperation|null;onOperationChange:(operation:RangeAdjustmentOperation|null)=>void;
}) {
  const {t}=useTranslation();
  // Fixed ranges already relocate, preserving their duration, on one day click.
  if(disabled||behavior==='none'||length?.mode==='fixed'||!value||!isDateOnly(value.start)||!isDateOnly(value.end)||value.end<value.start)return null;
  const operations=[
    {id:'move' as const,enabled:behavior!=='resize',label:t('common.ui.adjustWholeRange',{defaultMessage:'Whole range'}),
      earlier:t('common.ui.moveRangeEarlier',{defaultMessage:'Move range one day earlier'}),later:t('common.ui.moveRangeLater',{defaultMessage:'Move range one day later'})},
    {id:'start' as const,enabled:behavior!=='move',label:t('common.ui.startDate',{defaultMessage:'Start date'}),
      earlier:t('common.ui.moveRangeStartEarlier',{defaultMessage:'Move start one day earlier'}),later:t('common.ui.moveRangeStartLater',{defaultMessage:'Move start one day later'})},
    {id:'end' as const,enabled:behavior!=='move',label:t('common.ui.endDate',{defaultMessage:'End date'}),
      earlier:t('common.ui.moveRangeEndEarlier',{defaultMessage:'Move end one day earlier'}),later:t('common.ui.moveRangeEndLater',{defaultMessage:'Move end one day later'})},
  ];
  const title=t('common.ui.adjustDates',{defaultMessage:'Adjust dates'});
  const enabled=operations.filter(item=>item.enabled);
  const selected=enabled.find(item=>item.id===operation);
  return <div className={styles.adjustment}>
    <Button variant="outlined" tone="neutral" aria-expanded={Boolean(selected)} onPress={()=>onOperationChange(selected?null:enabled[0].id)}>{title}</Button>
    {selected&&<>
      <div className={styles.actions} role="group" aria-label={title}>
        {enabled.map(item=><Button key={item.id} className={styles.rangeChoice} variant={item===selected?'filled':'outlined'} tone="neutral" aria-pressed={item===selected} onPress={()=>onOperationChange(item.id)}>{item.label}</Button>)}
      </div>
      <p>{t('common.ui.rangeAdjustmentTarget',{defaultMessage:'Choose a day in this calendar as the target for the selected adjustment. Toggle Adjust dates to return to ordinary selection.'})}</p>
      <div className={styles.actions}>
        {([-1,1] as const).map(delta=>{
          const grabbed=selected.id==='end'?value.end:value.start;
          const destination=addCivilDays(grabbed,delta);
          const candidate=destination?resolveRangeDrag(value,grabbed,destination,selected.id,length):null;
          return <Button key={delta} variant="outlined" tone="neutral" disabled={!candidate||!isAllowed(candidate)} onPress={()=>{if(candidate&&isAllowed(candidate))onEdit(candidate);}}>{delta<0?selected.earlier:selected.later}</Button>;
        })}
      </div>
    </>}
  </div>;
}
