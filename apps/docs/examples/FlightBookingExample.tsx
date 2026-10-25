'use client';
import {useState} from 'react';
import {Calendar} from '@structured-growth/sg-ui/experimental';
import {Example} from '../components/Example';
import {exampleSource} from './source';
import {offsetCivilDate,useCivilToday} from './relative-date-limits';

export function FlightBookingExample(){
  const today=useCivilToday();
  const [date,setDate]=useState<string|null>(null);
  const latest=today?offsetCivilDate(today,2,'months'):undefined;
  return <Example title="Flight booking — today through two months ahead" description="Choose a departure date from today through two calendar months from today, inclusive. This demo uses your browser’s timezone and pins the window when opened. The host owns the booking timezone, availability and final booking validation. Month-end dates clamp to the last valid day." source={exampleSource({name:'FlightBooking',imports:["import {useEffect} from 'react';","import {Calendar} from '@structured-growth/sg-ui/experimental';"],state:`  function offsetCivilDate(iso:string,amount:number,unit:'days'|'months'|'years'):string {
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
  const [today,setToday]=useState<string|null>(null);
  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});
  useEffect(()=>{
    // Use the booking timezone's civil date in your application.
    const now=new Date();
    setToday(now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'));
  },[]);
  const latest=today?offsetCivilDate(today,2,'months'):undefined;`,body:'{today && <Calendar label="Departure date" min={today} max={latest} defaultFocusedDate={today} value={date} onValueChange={setDate}/>}'})}>
    {today&&<Calendar label="Departure date" min={today} max={latest} defaultFocusedDate={today} value={date} onValueChange={setDate}/>}
  </Example>;
}
