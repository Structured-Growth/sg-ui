"use client";
import {FieldMessages} from "../TextField/FieldMessages";
import {forwardRef,useEffect,useId,useImperativeHandle,useRef,useState} from "react";
import type {TimeFieldProps} from "./TimeField.types";
import {parseTimeText,formatTimeText,isClockTime} from "./parseTimeText";
import {useStandaloneFormReset} from "../TextField/useStandaloneFormReset";
import {useTranslation} from "../../i18n";
import {Button} from "../../components/Button/Button";
import {Popover} from "../Popover/Popover";
import {Select} from "../Select/Select";
import {AccessTimeFilledIcon} from "../../icons/AccessTimeFilledIcon";
import field from "../TextField/TextField.module.css";
import styles from "./TimeField.module.css";

export const TextTimeField=forwardRef<HTMLDivElement,TimeFieldProps&{locale:string}>(function TextTimeField({
 label,value,defaultValue=null,onValueChange,onValidityChange,min,max,name,description,descriptionPlacement,errorPlacement,errorMessage,invalid,required,disabled,readOnly,hourCycle,locale,minuteStep=1,getTimeUnavailableReason
},ref){
 const {t}=useTranslation(),id=useId(),root=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null);
 useImperativeHandle(ref,()=>root.current!);
 const [internal,setInternal]=useState(defaultValue),selected=value===undefined?internal:value;
 const [validationAttempted,setValidationAttempted]=useState(false);
 const [previous,setPrevious]=useState(selected),[draft,setDraft]=useState<string|null>(null),[open,setOpen]=useState(false);
 const [hour,setHour]=useState<string|null>(null),[minute,setMinute]=useState<string|null>(null),[second,setSecond]=useState<string|null>(null),[period,setPeriod]=useState<string|null>(null);
 if(previous!==selected){setPrevious(selected);setDraft(null);setValidationAttempted(false);}
 const resetting=useStandaloneFormReset(root,()=>{if(value===undefined)setInternal(defaultValue);setDraft(null);setValidationAttempted(false);setOpen(false);});
 const twelve=hourCycle===12 || (!hourCycle && new Intl.DateTimeFormat(locale,{hour:"numeric"}).resolvedOptions().hour12===true);
 const text=draft??formatTimeText(selected,locale,hourCycle);
 const parsed=text.trim()?parseTimeText(text,locale):null;
 const allowed=(time:string|null)=>!invalid && (!time||!getTimeUnavailableReason?.(time)) && (!min || isClockTime(min)) && (!max || isClockTime(max)) && (!min || !max || min<=max) &&
   (time===null ? !required : isClockTime(time)&&(!min||time>=min)&&(!max||time<=max));
 const valid=(draft!==null || selected===null || isClockTime(selected)) && (!text.trim()||parsed!==null)&&allowed(parsed);
 const showError=Boolean(invalid)||(validationAttempted&&!valid);
 const message=errorMessage??(parsed?getTimeUnavailableReason?.(parsed):undefined)??t("common.ui.invalidTime",{defaultMessage:"Enter a valid time within the allowed hours."});
 const hint=t("common.ui.timeTextFormats",{defaultMessage:"Type a time such as 8a, 1300, 315p, or 20:30, or open the time picker. Bare hours and compact HMM/HHMM use the 24-hour clock; a/p specifies AM/PM."});
 useEffect(()=>{input.current?.setCustomValidity(valid||disabled||readOnly?"":message);},[valid,disabled,readOnly,message]);
 useEffect(()=>{onValidityChange?.(valid);},[valid,onValidityChange]);
 function change(time:string|null){
  if(resetting.current||disabled||readOnly)return;
  setDraft(null);setValidationAttempted(false);if(value===undefined)setInternal(time);if(time!==selected)onValueChange?.(time);
 }
 function commit(){if(resetting.current||disabled||readOnly)return;setValidationAttempted(true);if(valid)change(parsed);}
 function openChange(next:boolean){
  if(next){
   const time=parsed&&allowed(parsed)?parsed:isClockTime(selected)?selected:null;
   const parts=time?.split(":")??[];
   setHour(time?String(twelve?(Number(parts[0])%12||12):Number(parts[0])):null);
   setMinute(parts[1]??null);setSecond(parts[2]??"00");setPeriod(time?(Number(parts[0])<12?"am":"pm"):null);
  }
  setOpen(next);
 }
 const candidate=hour!==null&&minute!==null&&(!twelve||period!==null)
  ? parseTimeText(`${hour}:${minute}:${second??"00"}${twelve?period:""}`):null;
 const candidateValid=candidate!==null&&allowed(candidate);
 const numbers=(start:number,count:number,pad=false)=>{const formatter=new Intl.NumberFormat(locale,{minimumIntegerDigits:pad?2:1,useGrouping:false});return Array.from({length:count},(_,index)=>({id:pad?String(index+start).padStart(2,"0"):String(index+start),label:formatter.format(index+start)}));};
 const periods=[{id:"am",label:new Intl.DateTimeFormat(locale,{hour:"numeric",hour12:true,timeZone:"UTC"}).formatToParts(new Date(Date.UTC(2026,0,1,1))).find(part=>part.type==="dayPeriod")?.value??"AM"},
 {id:"pm",label:new Intl.DateTimeFormat(locale,{hour:"numeric",hour12:true,timeZone:"UTC"}).formatToParts(new Date(Date.UTC(2026,0,1,13))).find(part=>part.type==="dayPeriod")?.value??"PM"}];
 const messages={descriptionPlacement,errorPlacement,description:(<div id={`${id}-description`} className={field.description}>{description??hint}</div>),error:(showError&&<div id={`${id}-error`} className={field.error}>{message}</div>)};
 return <div ref={root} className={field.root} data-invalid={showError||undefined} data-disabled={disabled||undefined} data-readonly={readOnly||undefined}>
  <label htmlFor={id} className={field.label}>{label}</label><FieldMessages position="above" {...messages}/>
  <div className={field.controlGroup} data-sgui-part="time-field-control-group">
   <input ref={input} id={id} type="text" className={field.input} value={text} required={required} disabled={disabled} readOnly={readOnly}
    aria-invalid={showError||undefined} aria-describedby={`${id}-description${showError?` ${id}-error`:""}`}
    onChange={event=>{setDraft(event.currentTarget.value);setValidationAttempted(false);}} onInvalid={()=>setValidationAttempted(true)} onBlur={commit}
    onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();commit();}else if(event.key==="ArrowDown"&&event.altKey){event.preventDefault();if(!disabled&&!readOnly)openChange(true);}}}/>
   <Popover title={label} showTitle={false} open={open} onOpenChange={openChange} trigger={<Button className={styles.trigger} variant="outlined" tone="neutral" disabled={disabled||readOnly}
     aria-label={t("common.ui.chooseTime",{defaultMessage:"Choose {label}",values:{label}})}><AccessTimeFilledIcon size={16}/></Button>}>
    <div className={styles.options}>
     <Select label={t("common.ui.hour",{defaultMessage:"Hour"})} value={hour} onValueChange={setHour} options={numbers(twelve?1:0,twelve?12:24)} disabled={disabled} readOnly={readOnly}/>
     <Select label={t("common.ui.minute",{defaultMessage:"Minute"})} value={minute} onValueChange={setMinute} options={numbers(0,60,true).filter(option=>Number(option.id)%Math.max(1,Math.min(60,Math.floor(minuteStep)||1))===0||option.id===minute)} disabled={disabled} readOnly={readOnly}/>
     {twelve&&<Select label={t("common.ui.dayPeriod",{defaultMessage:"AM/PM"})} value={period} onValueChange={setPeriod} options={periods} disabled={disabled} readOnly={readOnly}/>}
     {Number(second)>0&&<Select label={t("common.ui.second",{defaultMessage:"Second"})} value={second} onValueChange={setSecond} options={numbers(0,60,true).filter(option=>Number(option.id)%Math.max(1,Math.min(60,Math.floor(minuteStep)||1))===0||option.id===minute)} disabled={disabled} readOnly={readOnly}/>}
    </div>
    {candidate!==null&&!candidateValid&&<p className={field.error} role="status">{(candidate?getTimeUnavailableReason?.(candidate):undefined)??message}</p>}
    <div className={styles.actions}><Button disabled={!candidateValid||disabled||readOnly} onPress={()=>{if(candidateValid){change(candidate);setOpen(false);}}}>{t("common.ui.apply",{defaultMessage:"Apply"})}</Button>
     <Button variant="outlined" tone="neutral" onPress={()=>setOpen(false)}>{t("common.ui.cancel",{defaultMessage:"Cancel"})}</Button></div>
   </Popover>
  </div>
  <FieldMessages position="below" {...messages}/>
  {name&&<input type="hidden" name={name} value={selected??""} disabled={disabled}/>}
 </div>;
});
