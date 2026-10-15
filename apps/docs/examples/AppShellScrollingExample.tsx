'use client';
import {useState} from 'react';
import {AppShell,SideNavigation,type SideNavigationModel} from '@structured-growth/sg-ui/components';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

const courses=Array.from({length:30},(_,index)=>({id:`course-${index+1}`,label:`Course ${index+1}`}));
const lessonText='Review the learning goals, practice the activity, and reflect on what you learned before continuing.';
export function AppShellScrollingExample({withRightNavigation=false}:{withRightNavigation?:boolean}) {
  const [selected,setSelected]=useState('course-1');
  const model:SideNavigationModel={user:{initials:'AL',name:'Alex Learner',organization:'Structured Growth'},rootMenu:{id:'scrolling',sections:[{id:'courses',title:'Courses',items:courses.map(course=>({...course,active:course.id===selected}))}]}};
  const rightModel:SideNavigationModel={user:{initials:'PG',name:'Page outline',organization:'Structured Growth'},rootMenu:{id:'outline',sections:[{id:'lessons',title:'Lessons',items:courses.map((_,index)=>({id:`lesson-${index+1}`,label:`Lesson ${index+1}`}))}]}};
  const rightProps=withRightNavigation?` rightNavigation={<SideNavigation model={${JSON.stringify(rightModel)}} aria-label="Independently scrolling outline" />}`:'';
  const body=`<AppShell${rightProps} style={{height:420}} mainLabel="Independently scrolling lessons" navigation={<SideNavigation model={model} onItemSelect={setSelected} aria-label="Independently scrolling courses" />}>
  <Stack gap={4}>
    <Typography as="h3" variant="h5">Course lessons</Typography>
    {Array.from({length:24},(_,index)=><Typography key={index}>Lesson {index+1}. ${lessonText}</Typography>)}
  </Stack>
</AppShell>`;
  const state=`  const [selected,setSelected] = useState(${literal(selected)});
  const courses = ${JSON.stringify(courses)};
  const model:SideNavigationModel = {user:${JSON.stringify(model.user)},rootMenu:{id:'scrolling',sections:[{id:'courses',title:'Courses',items:courses.map(course=>({...course,active:course.id===selected}))}]}};`;
  return <Example title={withRightNavigation?"Three independently scrolling columns":"Independent navigation and content scrolling"} description="Scroll the course list and lesson content separately. AppShell fills the viewport by default; this embedded example gives it a fixed height through its native style prop." source={exampleSource({name:'IndependentAppShell',imports:["import { AppShell, SideNavigation, type SideNavigationModel } from '@structured-growth/sg-ui/components';","import { Stack, Typography } from '@structured-growth/sg-ui/primitives';"],state,body})}>
    <AppShell style={{height:420}} mainLabel="Independently scrolling lessons" navigation={<SideNavigation model={model} onItemSelect={setSelected} aria-label="Independently scrolling courses"/>} rightNavigation={withRightNavigation?<SideNavigation model={rightModel} aria-label="Independently scrolling outline"/>:undefined}>
      <Stack gap={4}><Typography as="h3" variant="h5">Course lessons</Typography>{Array.from({length:24},(_,index)=><Typography key={index}>Lesson {index+1}. {lessonText}</Typography>)}</Stack>
    </AppShell>
  </Example>;
}
