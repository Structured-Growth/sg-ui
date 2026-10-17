'use client';
import {useState} from 'react';
import {DateField,Calendar,DatePicker,Checkbox,Button,DateRangePicker,DateRangeSelector,getRelativeDateRange,type DateRange,type DateRangePreset} from '@structured-growth/sg-ui/experimental';
import {Box,Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {type Density} from '@structured-growth/sg-ui/theme';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

export function CalendarMonthsExample({kind}:{kind:'Calendar'|'DateRangeSelector'|'DateRangePicker'}) {
  const [date,setDate]=useState<string|null>('2026-10-14');
  const [range,setRange]=useState<DateRange|null>({start:'2026-10-12',end:'2026-12-10'});
  const RangeComponent=kind==='DateRangePicker'?DateRangePicker:DateRangeSelector;
  const body=kind==='Calendar'
    ? '<Calendar label="Quarter overview" months={3} value={date} onValueChange={setDate} />'
    : `<${kind} label="Reporting period" months={3} entryMode="text" value={range} onValueChange={setRange} />`;
  return <Example title={kind==='Calendar'?'Three-month calendar':kind==='DateRangePicker'?'Three-month range dropdown':'Three-month range'} density="compact" description="Three initially consecutive months share one selection. Month/year choices and arrows navigate only the calendar used; set calendarNavigation to linked to move all views together. Each month keeps its minimum width; months wrap in narrow hosts. The picker uses the same selector inside its dropdown." source={exampleSource({name:`ThreeMonth${kind}`,imports:[`import {${kind}${kind==='Calendar'?'':',type DateRange'}} from '@structured-growth/sg-ui/experimental';`,"import {Box} from '@structured-growth/sg-ui/primitives';"],state:kind==='Calendar'?`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`:`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`,body:`<ThemeScope density="compact">\n<Box style={{inlineSize:'fit-content',maxInlineSize:'100%'}}>\n${body}\n</Box>\n</ThemeScope>`})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:'100%'}}>{kind==='Calendar'?<Calendar label="Quarter overview" months={3} value={date} onValueChange={setDate}/>:<RangeComponent label="Reporting period" months={3} entryMode="text" value={range} onValueChange={setRange}/>}</Box>
  </Example>;
}

export function CalendarFootprintExample({density}:{density:Density}) {
  const [date,setDate]=useState<string|null>('2026-10-14');
  const body='<Calendar label="Appointment" value={date} onValueChange={setDate} defaultFocusedDate="2026-10-14" />';
  return <Example title={`${density==='compact'?'Compact':'Comfortable'} calendar footprint`} density={density} description="Calendars fit seven tightly packed day targets by default, without a host width override. Compact pointer targets are 32px square; comfortable and touch targets are at least 44px. Six week rows are reserved as months change; narrow hosts scroll locally when necessary." source={exampleSource({name:`${density}Calendar`,imports:["import {Calendar} from '@structured-growth/sg-ui/experimental';"],state:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`,body:`<ThemeScope density=${literal(density)}>\n${body}\n</ThemeScope>`})}>
    <Calendar label="Appointment" value={date} onValueChange={setDate} defaultFocusedDate="2026-10-14"/>
  </Example>;
}

export function CalendarDropdownExample() {
  const [date,setDate]=useState<string|null>('2026-10-14');
  const body=`<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 20rem)'}}>
  <DatePicker label="Appointment date" entryMode="text" referenceDate="2026-10-16" value={date} onValueChange={setDate} defaultFocusedDate="2026-10-14" name="appointment" />
</Box>`;
  return <Example title="Type a date or open the calendar" density="compact" description="Enter ISO dates, locale-ordered slash/dot dates, or a written month (for example Oct 14, 2026). Two-digit years expand within 1950–2049 (1/1/26 becomes January 1, 2026). Relative phrases such as today and in 2 weeks use the fixed host reference date 2026-10-16. Blur or Enter normalizes valid entry. Use the calendar button to choose a date instead. Impossible dates remain invalid; ambiguous numeric order follows the active locale." source={exampleSource({name:'CalendarDropdown',imports:["import {DatePicker} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`,body:`<ThemeScope density="compact">\n${body}\n</ThemeScope>`})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 20rem)'}}><DatePicker label="Appointment date" entryMode="text" referenceDate="2026-10-16" value={date} onValueChange={setDate} defaultFocusedDate="2026-10-14" name="appointment"/></Box>
  </Example>;
}

export function RangeDropdownExample({months}:{months:1|2}) {
  const [range,setRange]=useState<DateRange|null>({start:'2026-10-12',end:'2026-10-16'});
  const body=`<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 20rem)'}}>
  <DateRangePicker label="Travel dates" showFields entryMode="text" months={${months}} value={range} onValueChange={setRange} defaultFocusedDate="2026-10-12" name="travel" />
</Box>`;
  return <Example title={`Range dropdown with ${months===1?'one calendar':'two calendars'}`} density="compact" description="The field-shaped trigger shows the committed range. Selected dates join into continuous weekly bands with rounded row ends. Initial selection completes in either direction. Once a range is complete, calendar clicks adjust the end by default; a click on or before the start restarts selection. This example enables optional freehand start/end textboxes above the calendar (hidden by default); type either endpoint or select an inclusive range. Apply commits and Cancel discards. The dropdown shifts within the viewport before it needs to scroll. Two months sit alongside each other when space permits and stack on narrow hosts. Formats normalize on blur or Enter; invalid, reversed or unavailable ranges cannot Apply." source={exampleSource({name:`RangeDropdown${months}`,imports:["import {DateRangePicker,type DateRange} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`,body:`<ThemeScope density="compact">\n${body}\n</ThemeScope>`})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 20rem)'}}><DateRangePicker label="Travel dates" showFields entryMode="text" months={months} value={range} onValueChange={setRange} defaultFocusedDate="2026-10-12" name="travel"/></Box>
  </Example>;
}


const presetSetup = `  // Resolve periods from the host's civil date, not the browser clock.
  const referenceDate = '2026-10-16';
  const lastWeek = getRelativeDateRange(referenceDate,{unit:'week',offset:-1,weekStartsOn:1});
  // Example host policy: Monday-Friday, with no holiday-calendar adjustment.
  const friday = new Date(lastWeek.start+'T00:00:00Z');
  friday.setUTCDate(friday.getUTCDate()+4);
  const presets:DateRangePreset[] = [
    {id:'fixed',label:'Autumn launch',value:{start:'2026-09-01',end:'2026-09-30'}},
    {id:'week',label:'This week',value:getRelativeDateRange(referenceDate,{unit:'week',weekStartsOn:1})},
    {id:'month',label:'This month',value:getRelativeDateRange(referenceDate,{unit:'month'})},
    {id:'year',label:'This year',value:getRelativeDateRange(referenceDate,{unit:'year'})},
    {id:'last-year',label:'Last year',value:getRelativeDateRange(referenceDate,{unit:'year',offset:-1})},
    {id:'business',label:'Last business week',description:'Custom host rule: Monday-Friday; holidays are not adjusted.',value:{start:lastWeek.start,end:friday.toISOString().slice(0,10)}},
  ];`;

export function RangePresetExample({months=2,inline=false,placement='side'}:{months?:1|2;inline?:boolean;placement?:'side'|'end'}) {
  const [range,setRange]=useState<DateRange|null>({start:'2026-10-12',end:'2026-10-18'});
  const referenceDate='2026-10-16';
  const lastWeek=getRelativeDateRange(referenceDate,{unit:'week',offset:-1,weekStartsOn:1});
  const friday=new Date(lastWeek.start+'T00:00:00Z');friday.setUTCDate(friday.getUTCDate()+4);
  const presets:DateRangePreset[]=[
    {id:'fixed',label:'Autumn launch',value:{start:'2026-09-01',end:'2026-09-30'}},
    {id:'week',label:'This week',value:getRelativeDateRange(referenceDate,{unit:'week',weekStartsOn:1})},
    {id:'month',label:'This month',value:getRelativeDateRange(referenceDate,{unit:'month'})},
    {id:'year',label:'This year',value:getRelativeDateRange(referenceDate,{unit:'year'})},
    {id:'last-year',label:'Last year',value:getRelativeDateRange(referenceDate,{unit:'year',offset:-1})},
    {id:'business',label:'Last business week',description:'Custom host rule: Monday-Friday; holidays are not adjusted.',value:{start:lastWeek.start,end:friday.toISOString().slice(0,10)}},
  ];
  const Component=inline?DateRangeSelector:DateRangePicker;
  const name=inline?'DateRangeSelector':'DateRangePicker';
  const showFields=inline || months!==1;
  const body=`<Box style={{inlineSize:'fit-content',maxInlineSize:${literal(inline?'min(100%, 48rem)':'min(100%, 20rem)')}}}>
  <${name} label="Reporting period"${showFields?' showFields':''} entryMode="text" months={${months}} presetPlacement=${literal(placement)} presets={presets} firstDayOfWeek="mon" value={range} onValueChange={setRange} name="reporting" />
</Box>`;
  return <Example title={placement==='end'?'Presets after the calendars':inline?'Inline range with preset panel':`Preset panel with ${months===1?'one calendar':'two calendars'}`} density="compact" description={`Fixed and relative choices share one extensible list of selectable labels. ${showFields?'This example explicitly enables the optional freehand endpoint textboxes. ':''}This demo resolves full periods against October 16, 2026, with Monday-start weeks. The custom business-week option belongs to the host and can be omitted. A choice updates the draft; Apply commits and Cancel discards. Presets can precede or follow the calendars; visual and keyboard order match as panels wrap on narrow screens.`} source={exampleSource({name:`RangePresets${inline?'Inline':months}`,imports:[`import {${name},getRelativeDateRange,type DateRange,type DateRangePreset} from '@structured-growth/sg-ui/experimental';`,"import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});\n${presetSetup}`,body:`<ThemeScope density="compact">\n${body}\n</ThemeScope>`})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:inline?'min(100%, 48rem)':'min(100%, 20rem)'}}><Component label="Reporting period" showFields={showFields} entryMode="text" months={months} presetPlacement={placement} presets={presets} firstDayOfWeek="mon" value={range} onValueChange={setRange} name="reporting"/></Box>
  </Example>;
}

export function BirthdayExample({calendar = false}: {calendar?: boolean}) {
  const [date,setDate]=useState<string|null>(null);
  const Component=calendar?DatePicker:DateField;
  const props={label:"Select your birthday",entryMode:"text" as const,value:date,onValueChange:setDate,min:"1900-01-01",max:"2026-10-16",name:"birthday",description:"For example, May 21, 1984. The host supplies the allowed dates."};
  const body=calendar
    ? '<DatePicker label="Select your birthday" entryMode="text" navigation="period" periodPickerProps={{yearsPerPage:24}} min="1900-01-01" max="2026-10-16" defaultFocusedDate="2000-01-01" name="birthday" description="For example, May 21, 1984. The host supplies the allowed dates." value={date} onValueChange={setDate}/>'
    : '<DateField label="Select your birthday" entryMode="text" min="1900-01-01" max="2026-10-16" name="birthday" description="For example, May 21, 1984. The host supplies the allowed dates." value={date} onValueChange={setDate}/>';
  return <Example title={calendar?"Birthday with month and year jumps":"Birthday by direct entry"} density="compact" description={calendar?"Type a known birthday directly or open the optional calendar and jump by year and month. Navigation changes the view; choosing a day commits. This fixed demo permits 1900 through October 16, 2026; hosts choose their actual policy.":"For memorable dates, direct entry avoids navigating a calendar. Leave the birthday empty initially; valid input normalizes on blur or Enter."} source={exampleSource({name:calendar?"BirthdayPicker":"BirthdayField",state:`  const [date,setDate]=useState<string|null>(${JSON.stringify(date)});`,body:`<ThemeScope density="compact">\n<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 22rem)'}}>\n${body}\n</Box>\n</ThemeScope>`,imports:[`import {${calendar?'DatePicker':'DateField'}} from '@structured-growth/sg-ui/experimental';`,"import {Box} from '@structured-growth/sg-ui/primitives';"]})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 22rem)'}}>{calendar?<DatePicker {...props} navigation="period" periodPickerProps={{yearsPerPage:24}} defaultFocusedDate="2000-01-01"/>:<Component {...props}/>}</Box>
  </Example>;
}

export function DateTimePickerExample({hourCycle}:{hourCycle:12|24}) {
  const [value,setValue]=useState<string|null>("2026-10-14T09:30:00");
  const density=hourCycle===24?"compact":"comfortable";
  const body=`<DatePicker label="Appointment date and time" kind="datetime" hourCycle={${hourCycle}} navigation="period" min="2026-10-01T08:00:00" max="2026-10-31T18:00:00" name="appointment" description="Local appointment time in the host's chosen timezone." value={value} onValueChange={setValue}/>`;
  return <Example title={`Date and time — ${hourCycle}-hour`} density={density} description="Edit date and time directly, or open the calendar and type a time such as 8a or use its clock dropdown. Apply commits both together; Cancel discards popup edits. The value is a local datetime without a timezone. The host resolves it to an instant and handles daylight-saving gaps or overlaps." source={exampleSource({name:`DateTimePicker${hourCycle}`,imports:["import {DatePicker} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});`,body:`<ThemeScope density="${density}">\n<Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 28rem)'}}>\n${body}\n</Box>\n</ThemeScope>`})}>
    <Box style={{inlineSize:'fit-content',maxInlineSize:'min(100%, 28rem)'}}><DatePicker label="Appointment date and time" kind="datetime" hourCycle={hourCycle} navigation="period" min="2026-10-01T08:00:00" max="2026-10-31T18:00:00" name="appointment" description="Local appointment time in the host's chosen timezone." value={value} onValueChange={setValue}/></Box>
  </Example>;
}

const rangeBehaviorDescriptions = {
  restart: 'With 7th–16th selected, any calendar click starts a new incomplete range. The next click completes it in either direction.',
  'adjust-end': 'Default: with 7th–16th selected, click 13th for 7th–13th or 20th for 7th–20th. Click on or before 7th to restart; the next click completes in either direction.',
  'adjust-start': 'With 7th–16th selected, click 5th for 5th–16th or 13th for 13th–16th. Click on or after 16th to restart; the next click completes in either direction.',
  'adjust-nearest': 'Each click edits the closer endpoint, measured in calendar days. Outside clicks extend the nearest boundary. Equal distances edit the end by default; nearestEndpointTieBreak="start" edits the start instead. Clicking an existing endpoint leaves the range unchanged. Fixed length, whole-period selection and assigned calendar endpoints take precedence.',
  'adjust-boundaries': 'With 7th–16th selected, click 5th for 5th–16th, 13th for 7th–13th or 20th for 7th–20th. Clicking 7th makes a one-day range. Calendar clicks preserve a complete range until Clear; manual fields remain independently editable.',
} as const;
export function RangeBehaviorExample({kind,behavior}:{kind:'DateRangeSelector'|'DateRangePicker';behavior:keyof typeof rangeBehaviorDescriptions}) {
  const [range,setRange]=useState<DateRange|null>({start:'2026-10-07',end:'2026-10-16'});
  const Component=kind==='DateRangePicker'?DateRangePicker:DateRangeSelector;
  return <Example title={`Selection behavior: ${behavior}`} density="compact" description={`${rangeBehaviorDescriptions[behavior]} Apply commits; Cancel discards. Clear then click 5th and 1st to create 1st–5th in every mode.`}
    source={exampleSource({name:'RangeSelectionBehavior',imports:[`import {${kind},type DateRange} from '@structured-growth/sg-ui/experimental';`],state:`  const [range,setRange]=useState<DateRange|null>(${JSON.stringify(range)});`,body:`<ThemeScope density="compact">\n  <${kind} label="Example range" showFields months={1} entryMode="text" rangeClickBehavior="${behavior}" defaultFocusedDate="2026-10-07" value={range} onValueChange={setRange}/>\n</ThemeScope>`})}>
    <Component label="Example range" showFields months={1} entryMode="text" rangeClickBehavior={behavior} defaultFocusedDate="2026-10-07" value={range} onValueChange={setRange}/>
  </Example>;
}


export function AvailabilityParityExample({mode}:{mode:'text'|'segments'|'datetime'}) {
 const [value,setValue]=useState<string|null>(mode==='datetime'?'2026-10-14T08:00:00':'2026-10-14');
 const [allowBlockedDate,setAllowBlockedDate]=useState(false);
 const [message,setMessage]=useState('');
 const title=mode==='text'?'Flexible entry availability':mode==='segments'?'Segmented entry availability':'Date and time availability';
 const reasonForDate=(date:string)=>!allowBlockedDate&&date==='2026-10-16'?'No appointment capacity':undefined;
 const body=`<ThemeScope density="compact">
<Box style={{inlineSize:'fit-content',maxInlineSize:'100%'}}>
<form aria-label="Booking form" onSubmit={event=>{event.preventDefault();setMessage('Appointment saved locally.');}}>
<Stack gap={3}>
<Checkbox label="Accept bookings on October 16" checked={allowBlockedDate} onCheckedChange={setAllowBlockedDate}/>
<DatePicker label="Booking date" name="booking" entryMode="${mode==='text'?'text':'segments'}" kind="${mode==='datetime'?'datetime':'date'}" hourCycle={24} value={value} onValueChange={date=>{setValue(date);setMessage('');}} getDateUnavailableReason={reasonForDate} defaultFocusedDate="2026-10-14" required/>
<Button type="submit">Save appointment</Button>
{message && <Typography role="status">{message}</Typography>}
</Stack>
</form>
</Box>
</ThemeScope>`;
 return <Example title={title} density="compact" description="One host availability rule covers direct entry and the calendar. An unavailable draft remains editable, blocks native submission and keeps the accepted value. Change the host rule to allow the date. This form saves locally; persistence belongs to the host." source={exampleSource({name:`Availability${mode}`,imports:["import {DatePicker,Checkbox,Button} from '@structured-growth/sg-ui/experimental';","import {Box,Stack,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [value,setValue]=useState<string|null>(${JSON.stringify(value)});
  const [allowBlockedDate,setAllowBlockedDate]=useState(${allowBlockedDate});
  const [message,setMessage]=useState(${JSON.stringify(message)});
  const reasonForDate=(date:string)=>!allowBlockedDate&&date==='2026-10-16'?'No appointment capacity':undefined;`,body})}>
  <Box style={{inlineSize:'fit-content',maxInlineSize:'100%'}}><form aria-label="Booking form" onSubmit={event=>{event.preventDefault();setMessage('Appointment saved locally.');}}><Stack gap={3}>
   <Checkbox label="Accept bookings on October 16" checked={allowBlockedDate} onCheckedChange={setAllowBlockedDate}/>
   <DatePicker label="Booking date" name="booking" entryMode={mode==='text'?'text':'segments'} kind={mode==='datetime'?'datetime':'date'} hourCycle={24} value={value} onValueChange={date=>{setValue(date);setMessage('');}} getDateUnavailableReason={reasonForDate} defaultFocusedDate="2026-10-14" required/>
   <Button type="submit">Save appointment</Button>{message&&<Typography role="status">{message}</Typography>}
  </Stack></form></Box>
 </Example>;
}
