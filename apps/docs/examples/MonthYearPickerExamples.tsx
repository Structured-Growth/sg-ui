"use client";
import {useState} from "react";
import {MonthPicker,YearPicker,TextField,Select,Checkbox} from "@structured-growth/sg-ui/experimental";
import {Box,Stack} from "@structured-growth/sg-ui/primitives";
import {Example} from "../components/Example";
import {exampleSource} from "./source";
export function MonthYearPickerExamples({kind}:{kind:"MonthPicker"|"YearPicker"}){return <Stack gap={4}><PickerPanel kind={kind} title="Prop playground" playground/>{(["compact","comfortable"] as const).map(density=><PickerPanel key={density} kind={kind} title={`${kind} — ${density}`} density={density}/>)}{kind==="MonthPicker"&&(["compact","comfortable"] as const).map(density=><Stack key={`fit-${density}`} gap={4}>{([6,4,2] as const).map(rows=><MonthFitPanel key={rows} density={density} rows={rows}/>)}</Stack>)}{kind==="YearPicker"&&(["compact","comfortable"] as const).map(density=><PickerPanel key={`pages-${density}`} kind={kind} title={`YearPicker pages — ${density}`} density={density} navigation="paged"/>)}</Stack>;}
function PickerPanel({kind,title,density="comfortable",playground=false,navigation="scroll"}:{kind:"MonthPicker"|"YearPicker";title:string;density?:"compact"|"comfortable";playground?:boolean;navigation?:"scroll"|"paged"}){
 const [value,setValue]=useState<number|null>(kind==="MonthPicker"?10:2026);
 const [label,setLabel]=useState(kind==="MonthPicker"?"Month choices":"Year choices"),[disabled,setDisabled]=useState(false),[readOnly,setReadOnly]=useState(false);
 const [year,setYear]=useState("2026"),[minYear,setMinYear]=useState("1900"),[maxYear,setMaxYear]=useState("2030"),[yearsPerPage,setYearsPerPage]=useState<12|16|24>(12),[entry,setEntry]=useState<"select"|"text">("select");
 const [yearNavigation,setYearNavigation]=useState<"scroll"|"paged">(navigation);
 const [bounds,setBounds]=useState(false);
 const controls=playground?<Stack direction="row" wrap gap={3}><TextField label="Accessible label" value={label} onValueChange={setLabel}/>{kind==="MonthPicker"?<><TextField label="Calendar year" value={year} onValueChange={setYear}/><Checkbox label="Limit to March–October" checked={bounds} onCheckedChange={setBounds}/></>:<><TextField label="Minimum year" value={minYear} onValueChange={setMinYear}/><TextField label="Maximum year" value={maxYear} onValueChange={setMaxYear}/><Select label="Year navigation" value={yearNavigation} options={[{id:"scroll",label:"Vertical scroll"},{id:"paged",label:"Pages"}]} onValueChange={v=>setYearNavigation(v==='paged'?'paged':'scroll')}/><Select label="Years per page" disabled={yearNavigation!=="paged"} value={String(yearsPerPage)} options={[12,16,24].map(n=>({id:String(n),label:String(n)}))} onValueChange={v=>setYearsPerPage(v==='24'?24:v==='16'?16:12)}/><Select label="Year entry" value={entry} options={[{id:"select",label:"Year buttons"},{id:"text",label:"Type a year"}]} onValueChange={v=>setEntry(v==="text"?"text":"select")}/></>}<Checkbox label="Disabled" checked={disabled} onCheckedChange={setDisabled}/><Checkbox label="Read only" checked={readOnly} onCheckedChange={setReadOnly}/></Stack>:undefined;
 const currentYear=/^\d{1,4}$/.test(year)&&Number(year)>0?Number(year):2026;
 const lower=/^\d{1,4}$/.test(minYear)?Number(minYear):1900,upper=/^\d{1,4}$/.test(maxYear)?Number(maxYear):2030;
 const min=bounds?`${String(currentYear).padStart(4,'0')}-03-15`:undefined,max=bounds?`${String(currentYear).padStart(4,'0')}-10-20`:undefined;
 const props=`label={${JSON.stringify(label)}} disabled={${disabled}} readOnly={${readOnly}} value={value} onValueChange={setValue}`;
 const extra=kind==="MonthPicker"?`year={${currentYear}}${bounds?` min="${min}" max="${max}"`:''}`:`referenceYear={2026} minYear={${lower}} maxYear={${upper}} yearNavigation="${yearNavigation}" yearsPerPage={${yearsPerPage}} yearEntry="${entry}"`;
 return <Example title={title} density={density} controls={controls} source={exampleSource({name:kind+"Example",imports:[`import {${kind}} from '@structured-growth/sg-ui/experimental';`],state:`  const [value,setValue]=useState<number|null>(${JSON.stringify(value)});`,body:`<ThemeScope density="${density}">\n<${kind} ${extra} ${props}/>\n</ThemeScope>`})}>
 {kind==="MonthPicker"?<MonthPicker label={label} year={currentYear} min={min} max={max} disabled={disabled} readOnly={readOnly} value={value} onValueChange={setValue}/>:<YearPicker label={label} referenceYear={2026} minYear={lower} maxYear={upper} yearNavigation={yearNavigation} yearsPerPage={yearsPerPage} yearEntry={entry} disabled={disabled} readOnly={readOnly} value={value} onValueChange={setValue}/>}
 </Example>;
}

function MonthFitPanel({density,rows}:{density:"compact"|"comfortable";rows:2|4|6}){
 const [month,setMonth]=useState<number|null>(10);
 const width=rows===2?'32rem':'20rem';
 const height=`calc(${rows} * max(var(--sgui-control-height), var(--sgui-control-minimum-target-size)) + ${rows+1} * var(--sgui-space1))`;
 return <Example title={`Month choices — ${rows===6?'tall':rows===4?'medium':'short and wide'} — ${density}`} density={density} description="The grid prefers two columns and six rows when they fit. Shorter hosts use more columns while preserving month labels and interaction targets. Resize the host to see the grid adapt; selecting a month does not resize it." source={exampleSource({name:'ResponsiveMonths',imports:["import {MonthPicker} from '@structured-growth/sg-ui/experimental';","import {Box} from '@structured-growth/sg-ui/primitives';"],state:`  const [month,setMonth]=useState<number|null>(${JSON.stringify(month)});`,body:`<ThemeScope density="${density}">
<Box style={{inlineSize:${JSON.stringify(width)},maxInlineSize:'100%',blockSize:${JSON.stringify(height)},resize:'both',overflow:'auto'}}>
<MonthPicker year={2026} value={month} onValueChange={setMonth}/>
</Box>
</ThemeScope>`})}>
 <Box style={{inlineSize:width,maxInlineSize:'100%',blockSize:height,resize:'both',overflow:'auto'}}><MonthPicker year={2026} value={month} onValueChange={setMonth}/></Box>
 </Example>;
}
