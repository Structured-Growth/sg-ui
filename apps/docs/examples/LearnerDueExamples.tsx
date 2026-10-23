'use client';
import {useState} from 'react';
import {LearnerCourseCard} from '@structured-growth/sg-ui/components';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
const scenarios=[
  {id:'overdue',courseName:'An overdue introduction to assessment and practical course design',dueAt:'2026-10-13T18:00:00Z',instructorName:'Morgan Reed',nextActivity:'Reflect on the previous lesson'},
  {id:'today',courseName:'Due today',dueAt:'2026-10-14T18:00:00Z',instructorName:'Morgan Reed',nextActivity:'Complete the practice activity'},
  {id:'tomorrow',courseName:'Due tomorrow',dueAt:'2026-10-15T18:00:00Z',instructorName:'Morgan Reed',nextActivity:'Review the next lesson'},
  {id:'later',courseName:'A later deadline',dueAt:'2026-10-20T18:00:00Z',instructorName:'Morgan Reed',nextActivity:'Build a plan for the week'},
  {id:'missing',courseName:'No deadline or supporting content supplied',dueAt:'',instructorName:'',nextActivity:''},
];
export function LearnerDueExamples() {
  const [result,setResult]=useState('');
  const body=`<Stack gap={3}>
  <Stack direction="row" wrap gap={3}>
    {${JSON.stringify(scenarios)}.map(({id,...course})=><LearnerCourseCard key={id} {...course} progressPercent={35} referenceNow={new Date('2026-10-14T12:00:00Z')} detailsHref="#course-details" onContinue={()=>setResult('Continue requested for '+course.courseName+'. Host owns navigation.')} />)}
  </Stack>
  <Typography role="status">{result}</Typography>
</Stack>`;
  return <Example title="Due dates and course content" description="A fixed host reference clock keeps overdue, today, tomorrow and later states reproducible. The host locale formats the date/time in its browser timezone. The current dueAt contract requires a string or Date; an empty host string demonstrates the unavailable-date fallback, not an invented optional prop. The last card also shows missing supporting strings." source={exampleSource({name:'LearnerDueDates',imports:["import {LearnerCourseCard} from '@structured-growth/sg-ui/components';","import {Stack,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  const [result,setResult]=useState(${literal(result)});`,body})}>
    <Stack gap={3}><Stack direction="row" wrap gap={3}>{scenarios.map(({id,...course})=><LearnerCourseCard key={id} {...course} progressPercent={35} referenceNow={new Date('2026-10-14T12:00:00Z')} detailsHref="#course-details" onContinue={()=>setResult('Continue requested for '+course.courseName+'. Host owns navigation.')}/>)}</Stack><Typography role="status">{result}</Typography></Stack>
  </Example>;
}
