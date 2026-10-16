'use client';
import {useState} from 'react';
import {DateField,DatePicker,DateRangeSelector,DateRangePicker,type DateRange} from '@structured-growth/sg-ui/experimental';
import {Box} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource} from './source';

export function RelativeDateExample({kind}:{kind:'DateField'|'DatePicker'|'DateRangeSelector'|'DateRangePicker'}){
 const referenceDate='2026-10-16';
 const [date,setDate]=useState<string|null>(referenceDate);
 const [range,setRange]=useState<DateRange|null>({start:referenceDate,end:'2026-10-23'});
 const isRange=kind==='DateRangeSelector'||kind==='DateRangePicker';
 const DateComponent=kind==='DateField'?DateField:DatePicker;
 const RangeComponent=kind==='DateRangeSelector'?DateRangeSelector:DateRangePicker;
 const body=isRange?`<${kind} label="Relative travel dates" showFields entryMode="text" referenceDate={referenceDate} months={1} value={range} onValueChange={setRange}/>`
  :`<${kind} label="Relative appointment date" entryMode="text" referenceDate={referenceDate} value={date} onValueChange={setDate}/>`;
 return <Example title="Relative dates from a fixed reference" density="compact" description={kind==='DateRangePicker' ? "The main range textbox accepts this/last/next week, month or year as complete periods. Open the calendar to try today, a week from today or two weeks from today in its separate endpoint fields. This example pins the host reference date to October 16, 2026; a real host supplies its own civil today and pins it for the editing session. Accepted dates do not drift." : "This repeatable example pins the host reference date to October 16, 2026. Try today, a week from today, two weeks from today, in a month or a week ago. Next/last weekdays are strictly after/before the reference; next month/year preserves the day and clamps at month end. A real host supplies today's civil date in its chosen timezone and pins it for the editing session. Committed values are absolute dates and do not drift."} source={exampleSource({name:`Relative${kind}`,imports:[`import {${kind}${isRange?',type DateRange':''}} from '@structured-growth/sg-ui/experimental';`,"import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  // Host-owned civil date. Keep the same anchor for this editing session.\n  const referenceDate='2026-10-16';\n${isRange?`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`}`,body:`<ThemeScope density="compact">\n<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 22rem)'}}>\n${body}\n</Box>\n</ThemeScope>`})}>
  <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 22rem)'}}>{isRange?<RangeComponent label="Relative travel dates" showFields entryMode="text" referenceDate={referenceDate} months={1} value={range} onValueChange={setRange}/>:<DateComponent label="Relative appointment date" entryMode="text" referenceDate={referenceDate} value={date} onValueChange={setDate}/>}</Box>
 </Example>;
}


export function RangeTextExample(){
 const referenceDate='2026-10-16';
 const [range,setRange]=useState<DateRange|null>({start:'2026-01-01',end:'2026-01-03'});
 return <Example title="Type a range or a relative period" density="compact" description="Try 1/1/2026 - 1/3/26, today - a week from today, or last week, then press Enter or leave the field. Last week is the complete Monday–Sunday week before the fixed October 16, 2026 reference: October 5–11. This/last/next month and year select complete periods too. Change dates in the calendar and Apply, or Cancel to keep the accepted range. A production host supplies today's civil reference date; accepted dates remain absolute." source={exampleSource({name:'EditableDateRange',imports:["import {DateRangePicker,type DateRange} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const referenceDate='2026-10-16';\n  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`,body:`<ThemeScope density="compact">\n<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 24rem)'}}>\n<DateRangePicker showFields label="Reporting period" referenceDate={referenceDate} firstDayOfWeek="mon" entryMode="text" months={1} value={range} onValueChange={setRange}/>\n</Box>\n</ThemeScope>`})}>
 <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 24rem)'}}><DateRangePicker showFields label="Reporting period" referenceDate={referenceDate} firstDayOfWeek="mon" entryMode="text" months={1} value={range} onValueChange={setRange}/></Box>
 </Example>;
}
