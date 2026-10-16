'use client';
import {useState} from 'react';
import {TimeField} from '@structured-growth/sg-ui/experimental';
import {Box} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource} from './source';

export function TimeTextExample({cycle}:{cycle:12|24}){
 const [time,setTime]=useState<string|null>(null);
 const density=cycle===12?'compact':'comfortable';
 const body=`<TimeField label="Appointment time" entryMode="text" hourCycle={${cycle}} min="08:00:00" max="18:00:00" name="appointmentTime" value={time} onValueChange={setTime}/>`;
 return <Example title={`Type or select a time — ${cycle}-hour`} density={density} description="Type 8a, 1300 (13:00), 315p (3:15 pm), or 17:00. Blur or Enter normalizes valid input; bare hours and compact HMM/HHMM use the 24-hour clock. The clock button or Alt+Down opens independent hour/minute/AM-PM choices. Apply commits; Cancel discards popup edits. All minute choices stay available; times outside 08:00–18:00 remain invalid. This is a local clock, without a date or timezone." source={exampleSource({name:`TimeText${cycle}`,imports:["import {TimeField} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [time,setTime]=useState<string|null>(${JSON.stringify(time)});`,body:`<ThemeScope density="${density}">\n<Box style={{inlineSize:'22rem',maxInlineSize:'100%'}}>\n${body}\n</Box>\n</ThemeScope>`})}>
  <Box style={{inlineSize:'22rem',maxInlineSize:'100%'}}><TimeField label="Appointment time" entryMode="text" hourCycle={cycle} min="08:00:00" max="18:00:00" name="appointmentTime" value={time} onValueChange={setTime}/></Box>
 </Example>;
}
