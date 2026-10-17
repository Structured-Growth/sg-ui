'use client';
import {useState} from 'react';
import {AppShell,IconPanelNavigation,SideNavigation,type IconPanelNavigationItem} from '@structured-growth/sg-ui/components';
import {BookIcon,GroupIcon,CalendarTodayIcon,DescriptionIcon,TaskAltIcon} from '@structured-growth/sg-ui/icons';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {SGNavigationProvider} from '@structured-growth/sg-ui/adapters';
import {Checkbox,Select,TextArea,TextField,Navigation,NavigationItem,List,ListItem} from '@structured-growth/sg-ui/experimental';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';

function RailExample({title,side:initialSide='start',density:initialDensity='comfortable',embedded=false,playground=false,initialOpen=null,resizable:initialResizable=false}:{resizable?:boolean;title:string;side?:'start'|'end';density?:'compact'|'comfortable';embedded?:boolean;playground?:boolean;initialOpen?:string|null}) {
  const [side,setSide]=useState(initialSide);
  const [density,setDensity]=useState<'compact'|'comfortable'>(initialDensity);
  const [activeId,setActiveId]=useState<string|null>(initialOpen);
  const [draft,setDraft]=useState('Review the course outline.');
  const [complete,setComplete]=useState(false);
  const [panelWidth,setPanelWidth]=useState('20rem');
  const [resizable,setResizable]=useState(initialResizable);
  const [minimum,setMinimum]=useState('240');const [maximum,setMaximum]=useState('960');
  const minPanelWidth=Math.max(0,Number(minimum)||240),maxPanelWidth=Math.max(minPanelWidth,Number(maximum)||960);
  const items:IconPanelNavigationItem[]=[
    {id:'calendar',label:'Calendar',icon:<CalendarTodayIcon/>,content:<Stack gap={3}>{Array.from({length:18},(_,index)=><Typography key={index}>Day {index+1}: Review and practice</Typography>)}</Stack>},
    {id:'notes',label:'Notes',icon:<DescriptionIcon/>,content:<TextArea label="Workspace notes" value={draft} onValueChange={setDraft}/>},
    {id:'tasks',label:'Tasks',icon:<TaskAltIcon/>,content:<Checkbox label="Review the outline" checked={complete} onCheckedChange={setComplete}/>},
  ];
  const rail=<IconPanelNavigation items={items} activeId={activeId} onActiveIdChange={setActiveId} side={side} resizable={resizable} minPanelWidth={minPanelWidth} maxPanelWidth={maxPanelWidth} panelWidth={panelWidth} aria-label="Workspace tools"/>;
  const nav=<SideNavigation aria-label="Course routes" model={{user:{initials:'AL',name:'Alex Learner',organization:'Structured Growth'},rootMenu:{id:'workspace',sections:[{id:'courses',items:[{id:'overview',label:'Overview'},{id:'lessons',label:'Lessons'}]}]}}}/>;
  const itemSource=`  const items:IconPanelNavigationItem[] = [
    {id:'calendar',label:'Calendar',icon:<CalendarTodayIcon/>,content:<Stack gap={3}>{Array.from({length:18},(_,index)=><Typography key={index}>Day {index+1}: Review and practice</Typography>)}</Stack>},
    {id:'notes',label:'Notes',icon:<DescriptionIcon/>,content:<TextArea label="Workspace notes" value={draft} onValueChange={setDraft}/>},
    {id:'tasks',label:'Tasks',icon:<TaskAltIcon/>,content:<Checkbox label="Review the outline" checked={complete} onCheckedChange={setComplete}/>},
  ];`;
  const railSource=`<IconPanelNavigation items={items} activeId={activeId} onActiveIdChange={setActiveId} side={${literal(side)}} resizable={${resizable}} minPanelWidth={${minPanelWidth}} maxPanelWidth={${maxPanelWidth}} panelWidth={${literal(panelWidth)}} aria-label="Workspace tools"/>`;
  const navSource=`<SideNavigation aria-label="Course routes" model={{user:{initials:'AL',name:'Alex Learner',organization:'Structured Growth'},rootMenu:{id:'workspace',sections:[{id:'courses',items:[{id:'overview',label:'Overview'},{id:'lessons',label:'Lessons'}]}]}}}/>`;
  const content=<Stack gap={3}><Typography as="h3" variant="h5">Course workspace</Typography><Typography>Use the icon rail to open a tool alongside the page. Course routes and workspace tools are separate navigation sections.</Typography></Stack>;
  const contentSource='<Stack gap={3}><Typography as="h3" variant="h5">Course workspace</Typography><Typography>Use the icon rail to open a tool alongside the page. Course routes and workspace tools are separate navigation sections.</Typography></Stack>';
  const body=embedded?`<AppShell style={{height:420}} mainLabel="Course workspace" navigation={${side==='start'?railSource:navSource}}${side==='end'?` rightNavigation={${railSource}}`:''}>${contentSource}</AppShell>`:`<div style={{height:360,maxWidth:'100%'}}>${railSource}</div>`;
  const source=exampleSource({name:'WorkspaceTools',imports:["import { AppShell, IconPanelNavigation, SideNavigation, type IconPanelNavigationItem } from '@structured-growth/sg-ui/components';","import { CalendarTodayIcon, DescriptionIcon, TaskAltIcon } from '@structured-growth/sg-ui/icons';","import { Stack, Typography } from '@structured-growth/sg-ui/primitives';","import { TextArea, Checkbox } from '@structured-growth/sg-ui/experimental';"],state:`  const [activeId,setActiveId] = useState<string|null>(${activeId===null?'null':literal(activeId)});\n  const [draft,setDraft] = useState(${literal(draft)});\n  const [complete,setComplete] = useState(${complete});\n${itemSource}`,body:`<ThemeScope density=${literal(density)}>${body}</ThemeScope>`});
  return <Example title={title} density={density} source={source} description={playground?'An icon-only rail with independent, non-modal content panels. Open a tool, then switch tools to preserve its draft.':undefined} controls={playground?<Stack direction="row" wrap gap={3} align="end">
    <Select label="Rail side" value={side} onValueChange={value=>setSide(value as 'start'|'end')} options={[{id:'start',label:'Start / left'},{id:'end',label:'End / right'}]}/>
    <TextField label="Panel width" value={panelWidth} onValueChange={setPanelWidth}/>
    <Select label="Preview density" value={density} onValueChange={value=>setDensity(value as 'compact'|'comfortable')} options={[{id:'compact',label:'Compact'},{id:'comfortable',label:'Comfortable'}]}/>
    <TextField label="Minimum panel width (px)" value={minimum} onValueChange={setMinimum}/>
    <TextField label="Maximum panel width (px)" value={maximum} onValueChange={setMaximum}/>
    <Checkbox label="Resizable panel" checked={resizable} onCheckedChange={setResizable}/>
    <Checkbox label="Open Notes" checked={activeId==='notes'} onCheckedChange={checked=>setActiveId(checked?'notes':null)}/>
  </Stack>:undefined}>
    {embedded?<AppShell style={{height:420}} mainLabel="Course workspace" navigation={side==='start'?rail:nav} rightNavigation={side==='end'?rail:undefined}>{content}</AppShell>:<div style={{height:360,maxWidth:'100%'}}>{rail}</div>}
  </Example>;
}
function PanelMenusExample() {
  const [activeId,setActiveId]=useState<string|null>('courses');
  const [pathname,setPathname]=useState('/courses/overview');
  const courses=[{href:'/courses/overview',label:'Course overview'},{href:'/courses/lessons',label:'Lessons'},{href:'/courses/progress',label:'Progress'}];
  const people=[{href:'/people/learners',label:'Learners'},{href:'/people/instructors',label:'Instructors'}];
  const routes=[...courses,...people];
  const title=routes.find(route=>route.href===pathname)?.label??'Course overview';
  const items:IconPanelNavigationItem[]=[
    {id:'courses',label:'Courses',icon:<BookIcon/>,content:<Navigation label="Course pages"><List>{courses.map(route=><ListItem key={route.href}><NavigationItem href={route.href} current={pathname===route.href}>{route.label}</NavigationItem></ListItem>)}</List></Navigation>},
    {id:'people',label:'People',icon:<GroupIcon/>,content:<Navigation label="People pages"><List>{people.map(route=><ListItem key={route.href}><NavigationItem href={route.href} current={pathname===route.href}>{route.label}</NavigationItem></ListItem>)}</List></Navigation>},
  ];
  const source=exampleSource({name:'IconMenuWorkspace',imports:["import { AppShell, IconPanelNavigation, type IconPanelNavigationItem } from '@structured-growth/sg-ui/components';","import { BookIcon, GroupIcon } from '@structured-growth/sg-ui/icons';","import { Navigation, NavigationItem, List, ListItem } from '@structured-growth/sg-ui/experimental';","import { Typography } from '@structured-growth/sg-ui/primitives';","import { SGNavigationProvider } from '@structured-growth/sg-ui/adapters';"],state:`  const [activeId,setActiveId] = useState<string|null>(${activeId===null?'null':literal(activeId)});
  const [pathname,setPathname] = useState(${literal(pathname)});
  const courses = ${JSON.stringify(courses)};
  const people = ${JSON.stringify(people)};
  const title = [...courses,...people].find(route=>route.href===pathname)?.label??'Course overview';
  const items:IconPanelNavigationItem[] = [
    {id:'courses',label:'Courses',icon:<BookIcon/>,content:<Navigation label="Course pages"><List>{courses.map(route=><ListItem key={route.href}><NavigationItem href={route.href} current={pathname===route.href}>{route.label}</NavigationItem></ListItem>)}</List></Navigation>},
    {id:'people',label:'People',icon:<GroupIcon/>,content:<Navigation label="People pages"><List>{people.map(route=><ListItem key={route.href}><NavigationItem href={route.href} current={pathname===route.href}>{route.label}</NavigationItem></ListItem>)}</List></Navigation>},
  ];`,body:'<SGNavigationProvider value={{pathname,navigate:setPathname}}><AppShell style={{height:360}} mainLabel="Icon menu workspace" navigation={<IconPanelNavigation items={items} activeId={activeId} onActiveIdChange={setActiveId} aria-label="Workspace sections"/>}><Typography as="h3" variant="h5">{title}</Typography></AppShell></SGNavigationProvider>'});
  return <Example title="Icon sections with independent page menus" description="Each icon opens a separate menu. The host routing adapter changes the active page; the icon rail does not own page routes." source={source}>
    <SGNavigationProvider value={{pathname,navigate:setPathname}}><AppShell style={{height:360}} mainLabel="Icon menu workspace" navigation={<IconPanelNavigation items={items} activeId={activeId} onActiveIdChange={setActiveId} aria-label="Workspace sections"/>}><Typography as="h3" variant="h5">{title}</Typography></AppShell></SGNavigationProvider>
  </Example>;
}
export function IconPanelNavigationExamples(){return <Stack gap={4}>
  <RailExample title="Prop playground" playground/>
  <RailExample title="Left icon rail with sliding panels" initialOpen="notes"/>
  <RailExample title="Right icon rail with sliding panels" side="end" initialOpen="calendar"/>
  <RailExample title="Compact icon rail" density="compact" initialOpen="tasks"/>
  <RailExample title="Compact right icon rail" density="compact" side="end" initialOpen="notes"/>
  <RailExample title="Resizable right panel" side="end" initialOpen="notes" resizable/>
  <RailExample title="Compact resizable left panel" density="compact" initialOpen="notes" resizable/>
  <AppShellIconNavigationExamples/>
</Stack>;}

/** Shared shell compositions; every panel mounts its own state-owning example. */
export function AppShellIconNavigationExamples(){return <Stack gap={4}>
  <PanelMenusExample/>
  <RailExample title="AppShell main icon navigation" embedded initialOpen="notes"/>
  <RailExample title="AppShell tools separate from the main menu" embedded side="end" initialOpen="calendar"/>
</Stack>;}
