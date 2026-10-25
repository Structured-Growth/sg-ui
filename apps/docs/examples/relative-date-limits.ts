'use client';
import {useEffect,useState} from 'react';

/** Calendar arithmetic on civil dates; month/year offsets clamp to the last valid day. */
export function offsetCivilDate(iso:string,amount:number,unit:'days'|'months'|'years'):string {
  const [year,month,day]=iso.split('-').map(Number);
  const date=new Date(0);
  date.setUTCFullYear(year,month-1,day);
  if(unit==='days')date.setUTCDate(day+amount);
  else {
    date.setUTCDate(1);
    if(unit==='months')date.setUTCMonth(month-1+amount);
    else date.setUTCFullYear(year+amount);
    const last=new Date(date.getTime());
    last.setUTCMonth(last.getUTCMonth()+1,0);
    date.setUTCDate(Math.min(day,last.getUTCDate()));
  }
  return date.toISOString().slice(0,10);
}

/** The docs use the browser's local civil today, pinned once after hydration. */
export function useCivilToday(){
  const [today,setToday]=useState<string|null>(null);
  useEffect(()=>{
    const now=new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
  },[]);
  return today;
}

export const relativeLimitOptions=[
  {id:'none',label:'No limit'}, {id:'0:days',label:'Today'},
  ...(['days','months','years'] as const).flatMap(unit=>(unit==='days'?[1,7,30]:unit==='months'?[1,2,6]:[1,10,100]).flatMap(amount=>[
    {id:`-${amount}:${unit}`,label:`${amount} ${amount===1?unit.slice(0,-1):unit} ago`},
    {id:`${amount}:${unit}`,label:`${amount} ${amount===1?unit.slice(0,-1):unit} from today`},
  ])),
];
export function resolveDateLimit(today:string,option:string){
  if(option==='none')return undefined;
  const [amount,unit]=option.split(':');
  return offsetCivilDate(today,Number(amount),unit as 'days'|'months'|'years');
}
