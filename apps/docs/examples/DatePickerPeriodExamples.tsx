'use client';
import {useState} from 'react';
import {DatePicker} from '@structured-growth/sg-ui/experimental';
import {Stack} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource} from './source';
export function DatePickerPeriodExamples(){return <Stack gap={4}>{(['compact','comfortable'] as const).map(density=><PeriodNavigationExample key={density} density={density}/>) }<BoundedEventExample/></Stack>;}
function PeriodNavigationExample({density}:{density:'compact'|'comfortable'}){
 const [date,setDate]=useState<string|null>('2026-10-14');
 const rule=(value:string)=>value.startsWith('2026-12')?'Closed in December.':undefined;
 const props={label:'Appointment',min:'2026-09-10',max:'2027-02-20',periodPickerProps:{yearEntry:'select' as const,minYear:2020,maxYear:2030}};
 const body=`<DatePicker label="Appointment" min="2026-09-10" max="2027-02-20" periodPickerProps={{yearEntry:'select',minYear:2020,maxYear:2030}} getDateUnavailableReason={date=>date.startsWith('2026-12')?'Closed in December.':undefined} value={date} onValueChange={setDate}/>`;
 return <Example title={`Choose a month and year — ${density}`} density={density} description="Click the month or year text button for its own inline choices. Selecting a choice immediately returns to days, without action buttons. The popup keeps its dimensions. The date bounds limit years to 2026–2027 even though the optional year bounds are wider. December is unavailable; partially available months remain usable. Choosing a period changes the view; select a day to change the field." source={exampleSource({name:'DatePickerPeriodNavigation',imports:["import {DatePicker} from '@structured-growth/sg-ui/experimental';"],state:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`,body:`<ThemeScope density="${density}">\n${body}\n</ThemeScope>`})}>
 <DatePicker {...props} getDateUnavailableReason={rule} value={date} onValueChange={setDate}/>
 </Example>;
}

function BoundedEventExample(){
 const [date,setDate]=useState<string|null>(null);
 return <Example title="Event within one week" density="compact" source={exampleSource({name:'BoundedEvent',imports:["import {DatePicker} from '@structured-growth/sg-ui/experimental';"],state:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`,body:'<DatePicker label="Event date" min="2026-10-19" max="2026-10-25" defaultFocusedDate="2026-10-19" allowMonthSelection={false} allowYearSelection={false} value={date} onValueChange={setDate}/>'})}>
 <DatePicker label="Event date" min="2026-10-19" max="2026-10-25" defaultFocusedDate="2026-10-19" allowMonthSelection={false} allowYearSelection={false} value={date} onValueChange={setDate}/>
 </Example>;
}
