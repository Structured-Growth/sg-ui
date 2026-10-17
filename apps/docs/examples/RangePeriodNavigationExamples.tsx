'use client';
import {useState} from 'react';
import {DateRangePicker,DateRangeSelector,type DateRange} from '@structured-growth/sg-ui/experimental';
import {Stack} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource} from './source';
export function RangePeriodNavigationExamples({kind}:{kind:'DateRangePicker'|'DateRangeSelector'}){return <Stack gap={4}>{(['compact','comfortable'] as const).map(density=><RangePeriodPanel key={density} kind={kind} density={density}/>)}<RangePeriodPanel kind={kind} density="compact" independent/></Stack>;}
function RangePeriodPanel({kind,density,independent=false}:{kind:'DateRangePicker'|'DateRangeSelector';density:'compact'|'comfortable';independent?:boolean}){
 const [range,setRange]=useState<DateRange|null>({start:'2026-10-07',end:'2026-10-16'});
 const props={label:'Travel dates',min:'2026-01-01',max:'2027-12-31',months:2 as const,defaultFocusedDate:'2026-10-07',calendarNavigation:independent?'independent' as const:'linked' as const,calendarEndpoints:independent?['start','end'] as const:undefined};
 const rule=(date:string,context:{endpoint:'start'|'end'|null})=>independent&&context.endpoint==='start'&&date.startsWith('2027')?'No arrivals in 2027.':undefined;
 const extra=independent?' calendarNavigation="independent" calendarEndpoints={["start","end"]} getDateUnavailableReason={(date,context)=>context.endpoint==="start"&&date.startsWith("2027")?"No arrivals in 2027.":undefined}':'';
 return <Example title={independent?'Shared month/year — independent From and To':`Shared month/year — ${density}`} density={density} description="Separate month and year choices navigate without changing the range. Independent From/To calendars retain endpoint-aware availability." source={exampleSource({name:kind+'PeriodNavigation',imports:[`import {${kind},type DateRange} from '@structured-growth/sg-ui/experimental';`],state:`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`,body:`<ThemeScope density="${density}">
<${kind} label="Travel dates" min="2026-01-01" max="2027-12-31" months={2} defaultFocusedDate="2026-10-07"${extra} value={range} onValueChange={setRange}/>
</ThemeScope>`})}>
 {kind==='DateRangePicker'?<DateRangePicker {...props} getDateUnavailableReason={rule} value={range} onValueChange={setRange}/>:<DateRangeSelector {...props} getDateUnavailableReason={rule} value={range} onValueChange={setRange}/>}
 </Example>;
}
