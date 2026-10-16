"use client";
import {useEffect,useRef,useState} from "react";
import {useTranslation} from "../../i18n";
import styles from "./DateRangeSelector.module.css";
/** Native constraint participation for button-triggered compositions. Canonical named values remain separate. */
export function CalendarFormValidity({label,empty,valid,required,disabled}:{label:string;empty:boolean;valid:boolean;required?:boolean;disabled?:boolean}){
 const {t}=useTranslation(),ref=useRef<HTMLInputElement>(null),[showError,setShowError]=useState(false);
 const message=t('common.ui.calendarRequiredValue',{defaultMessage:'Choose a complete, available {label}.',values:{label}});
 useEffect(()=>{ref.current?.setCustomValidity(disabled||valid&&(!required||!empty)?'':message);if(valid&&(!required||!empty))setShowError(false);},[disabled,valid,required,empty,message]);
 return <><input ref={ref} className={styles.visuallyHidden} aria-hidden="true" tabIndex={-1} value={empty?'':'selected'} onChange={()=>{}} required={required} disabled={disabled} onInvalid={event=>{event.preventDefault();setShowError(true);event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('button')?.focus();}}/>{showError&&<p role="alert">{message}</p>}</>;
}
