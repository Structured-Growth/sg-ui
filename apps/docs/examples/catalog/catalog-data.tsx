'use client';
import {PersistedGridExample,ServerGridExample} from '../GridHostExamples';
import {GridTransferExample} from '../GridTransferExample';
import {GridReorderExample} from '../GridReorderExamples';
import {CourseCollectionExample} from '../CourseCollectionExample';
import {LearnerDueExamples} from '../LearnerDueExamples';
import { useState } from 'react';
import { Button, AppInlineProgress, AppOperationSteps, AppPaginationFooter, CardCollectionWithFooter, CourseCardFrame, InstructorCourseCard, LearnerCourseCard, AppDataGrid, AppDataGridShell, DataToolbar, DataToolbarSelectionMenu, DataGridDragHandle, RowSubHeader, createDataGridColumns, createActionMenuColumn, createAdminCourseGridOptions, createAdminPeopleGridOptions, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions, type AppOperationStepStatus, type AppDataGridColumn, type AppDataGridRowDragReorderParams, type DataToolbarColumnOption, type DataToolbarFilterRule, type DataToolbarSortRule, type InstructorCourseCardStatus } from '@structured-growth/sg-ui/components';
import { Stack, Typography, Link } from '@structured-growth/sg-ui/primitives';
import { type Density } from '@structured-growth/sg-ui/theme';
import { Checkbox, TextField, Select, DataGrid, defaultGridState, type GridState, type GridColumn } from '@structured-growth/sg-ui/experimental';
import { Example } from '../../components/Example';
import {useExamplePresentation} from '../../components/ExamplePresentation';
import styles from './catalog-data.module.css';
import { useExampleSource } from '../useExampleSource';
import { literal } from '../source';
import type { CatalogEntry } from '../../content/catalog-types';
const common = "import { Stack, Typography, Link } from '@structured-growth/sg-ui/primitives';";
function useSource(names: string) { const source=useExampleSource();return (name:string,body:string,state='',extra:string[]=[])=>source({name,body,state,imports:[`import { ${names} } from '@structured-growth/sg-ui/components';`,common,...extra]}); }
function ProgressPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><ProgressPlaygroundPanel1 reference={reference} /></> : <><ProgressPlaygroundPanel2 reference={reference} /><ProgressPlayground reference/></>}</Stack>;
}

function ProgressPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppInlineProgress');
const [value,setValue]=useState('45');
const [width,setWidth]=useState('240');
const amount=Number(value)||0;
return <Example title="Empty, partial, complete and invalid values" source={source('ProgressStates','<Stack gap={3}>\n  <AppInlineProgress value={0} />\n  <AppInlineProgress value={50} />\n  <AppInlineProgress value={100} />\n  <AppInlineProgress value={Number.NaN} />\n</Stack>')}><Stack gap={3}>{[0,50,100,NaN].map((v,i)=><AppInlineProgress key={i} value={v}/>)}</Stack></Example>;
}

function ProgressPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppInlineProgress');
const [value,setValue]=useState('45');
const [width,setWidth]=useState('240');
const amount=Number(value)||0;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Progress percentage" value={value} onValueChange={setValue}/><TextField label="Bar width in pixels" value={width} onValueChange={setWidth}/></Stack>} source={source('InlineProgress',`<AppInlineProgress value={${amount}} barWidth={${Math.max(40,Number(width)||240)}} />`)}><AppInlineProgress value={amount} barWidth={Math.max(40,Number(width)||240)}/></Example>;
}
function StepsPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><StepsPlaygroundPanel1 reference={reference} /></> : <><StepsPlaygroundPanel2 reference={reference} /><StepsPlayground reference/></>}</Stack>;
}

function StepsPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppOperationSteps');
const [title,setTitle]=useState('Publish course');
const [status,setStatus]=useState<AppOperationStepStatus>('in_progress');
const steps=[{id:'draft',label:'Prepare draft',status:'completed' as const},{id:'review',label:'Review content',status},{id:'publish',label:'Publish',status:'pending' as const}];
return <Example title="Single step and recovery state" source={source('SingleStep','<AppOperationSteps title="Upload" steps={[{id:"upload",label:"Upload file",status:"error"}]} />')}><AppOperationSteps title="Upload" steps={[{id:'upload',label:'Upload file',status:'error'}]}/></Example>;
}

function StepsPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppOperationSteps');
const [title,setTitle]=useState('Publish course');
const [status,setStatus]=useState<AppOperationStepStatus>('in_progress');
const steps=[{id:'draft',label:'Prepare draft',status:'completed' as const},{id:'review',label:'Review content',status},{id:'publish',label:'Publish',status:'pending' as const}];
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Operation title" value={title} onValueChange={setTitle}/><Select label="Review status" value={status} options={['pending','in_progress','completed','error'].map(id=>({id,label:id}))} onValueChange={v=>setStatus(v as AppOperationStepStatus)}/></Stack>} source={source('OperationSteps',`<AppOperationSteps title={${literal(title)}} subtitle="Host-owned operation" steps={${JSON.stringify(steps)}} />`)}><AppOperationSteps title={title} subtitle="Host-owned operation" steps={steps}/></Example>;
}
function FooterPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><FooterPlaygroundPanel1 reference={reference} /></> : <><FooterPlaygroundPanel2 reference={reference} /><FooterPlayground reference/></>}</Stack>;
}

function FooterPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppPaginationFooter');
const [page,setPage]=useState(0);
const [size,setSize]=useState(5);
const [unknown,setUnknown]=useState(false);
const [disabled,setDisabled]=useState(false);
const props=`page={page} pageSize={size} pageSizeOptions={[5,10,25]} totalCount={${unknown?'undefined':'42'}} hasNextPage onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} disabled={${disabled}}`;
return <Example title="Empty collection" source={source('EmptyFooter','<AppPaginationFooter page={0} pageSize={10} pageSizeOptions={[10]} totalCount={0} onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} />','  const [page,setPage] = useState(0);\n  const [size,setSize] = useState(10);')}><AppPaginationFooter page={0} pageSize={10} pageSizeOptions={[10]} totalCount={0} onPaginationModelChange={model => { (setPage)(model.page); (setSize)(model.pageSize); }} /></Example>;
}

function FooterPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('AppPaginationFooter');
const [page,setPage]=useState(0);
const [size,setSize]=useState(5);
const [unknown,setUnknown]=useState(false);
const [disabled,setDisabled]=useState(false);
const props=`page={page} pageSize={size} pageSizeOptions={[5,10,25]} totalCount={${unknown?'undefined':'42'}} hasNextPage onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} disabled={${disabled}}`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><Checkbox label="Unknown total" checked={unknown} onCheckedChange={setUnknown}/><Checkbox label="Disable pagination" checked={disabled} onCheckedChange={setDisabled}/></Stack>} source={source('PaginationFooter',`<AppPaginationFooter ${props} />`,`  const [page,setPage] = useState(${page});\n  const [size,setSize] = useState(${size});`)}><AppPaginationFooter page={page} pageSize={size} pageSizeOptions={[5,10,25]} totalCount={unknown?undefined:42} hasNextPage onPaginationModelChange={model => { (setPage)(model.page); (setSize)(model.pageSize); }}  disabled={disabled}/></Example>;
}
function FramePlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><FramePlaygroundPanel1 reference={reference} /></> : <><FramePlaygroundPanel2 reference={reference} /><FramePlayground reference/></>}</Stack>;
}

function FramePlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('CourseCardFrame');
const [title,setTitle]=useState('Course basics');
const [footer,setFooter]=useState(true);
const [width,setWidth]=useState('420');
const frame=(name:string,withFooter:boolean)=>`<CourseCardFrame width={${Math.max(200,Number(width)||420)}} header={<Typography as="h3" variant="h5">{${literal(name)}}</Typography>} body={<Typography>Host supplied course details and learning objectives.</Typography>}${withFooter?' footer={<Link href="#main-content">Open course</Link>}':''} />`;
return <Example title="Long content without footer" source={source('LongFrame',frame('A much longer course title that demonstrates wrapping and readable content',false))}><CourseCardFrame width={Math.max(200,Number(width)||420)} header={<Typography as="h3" variant="h5">A much longer course title that demonstrates wrapping and readable content</Typography>} body={<Typography>Host supplied course details and learning objectives.</Typography>}/></Example>;
}

function FramePlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('CourseCardFrame');
const [title,setTitle]=useState('Course basics');
const [footer,setFooter]=useState(true);
const [width,setWidth]=useState('420');
const frame=(name:string,withFooter:boolean)=>`<CourseCardFrame width={${Math.max(200,Number(width)||420)}} header={<Typography as="h3" variant="h5">{${literal(name)}}</Typography>} body={<Typography>Host supplied course details and learning objectives.</Typography>}${withFooter?' footer={<Link href="#main-content">Open course</Link>}':''} />`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Card title" value={title} onValueChange={setTitle}/><TextField label="Maximum card width" value={width} onValueChange={setWidth}/><Checkbox label="Show footer" checked={footer} onCheckedChange={setFooter}/></Stack>} source={source('CardFrame',frame(title,footer))}><CourseCardFrame width={Math.max(200,Number(width)||420)} header={<Typography as="h3" variant="h5">{title}</Typography>} body={<Typography>Host supplied course details and learning objectives.</Typography>} footer={footer?<Link href="#main-content">Open course</Link>:undefined}/></Example>;
}
function InstructorPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><InstructorPlaygroundPanel1 reference={reference} /></> : <><InstructorPlaygroundPanel2 reference={reference} /><InstructorPlayground reference/></>}</Stack>;
}

function InstructorPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('InstructorCourseCard');
const [name,setName]=useState('Course basics');
const [status,setStatus]=useState<InstructorCourseCardStatus>('active');
const [count,setCount]=useState('24');
const code=(state:InstructorCourseCardStatus,title:string)=>`<InstructorCourseCard courseName={${literal(title)}} siteName="Learning Studio" status={${literal(state)}} learnerCount={${Number(count)||0}} lastLearnerActivityLabel="Recent activity" actionLabel="Open course" actionHref="#main-content" />`;
return <Example title="Status matrix" source={source('InstructorStatuses',`<Stack direction="row" wrap gap={3}>${(['active','draft','closed','archived'] as const).map(s=>code(s,`${s} course`)).join('\n')}</Stack>`)}><Stack direction="row" wrap gap={3}>{(['active','draft','closed','archived'] as const).map(s=><InstructorCourseCard key={s} courseName={`${s} course`} siteName="Learning Studio" status={s} learnerCount={Number(count)||0} lastLearnerActivityLabel="Recent activity" actionLabel="Open course" actionHref="#main-content"/>)}</Stack></Example>;
}

function InstructorPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('InstructorCourseCard');
const [name,setName]=useState('Course basics');
const [status,setStatus]=useState<InstructorCourseCardStatus>('active');
const [count,setCount]=useState('24');
const code=(state:InstructorCourseCardStatus,title:string)=>`<InstructorCourseCard courseName={${literal(title)}} siteName="Learning Studio" status={${literal(state)}} learnerCount={${Number(count)||0}} lastLearnerActivityLabel="Recent activity" actionLabel="Open course" actionHref="#main-content" />`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Course name" value={name} onValueChange={setName}/><Select label="Course status" value={status} options={['active','draft','closed','archived'].map(id=>({id,label:id}))} onValueChange={v=>setStatus(v as InstructorCourseCardStatus)}/><TextField label="Learner count" value={count} onValueChange={setCount}/></Stack>} source={source('InstructorCard',code(status,name))}><InstructorCourseCard courseName={name} siteName="Learning Studio" status={status} learnerCount={Number(count)||0} lastLearnerActivityLabel="Recent activity" actionLabel="Open course" actionHref="#main-content"/></Example>;
}
function LearnerPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><LearnerPlaygroundPanel1 reference={reference} /></> : <><LearnerPlaygroundPanel2 reference={reference} /><LearnerPlayground reference/><LearnerDueExamples/></>}</Stack>;
}

function LearnerPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('LearnerCourseCard');
const [name,setName]=useState('Course basics');
const [progress,setProgress]=useState('35');
const [continued,setContinued]=useState(0);
const code=(percent:number)=>`<LearnerCourseCard courseName={${literal(name)}} instructorName="Morgan Reed" progressPercent={${percent}} nextActivity="Practice exercise" dueAt="2026-10-20T12:00:00Z" referenceNow={new Date("2026-10-14T12:00:00Z")} detailsHref="#main-content" onContinue={() => setContinued(value=>value+1)} />`;
const state=`  const [continued,setContinued] = useState(${continued});`;
return <Example title="Completion states" source={source('LearnerProgress',`<Stack direction="row" wrap gap={3}>${[0,50,100].map(code).join('\n')}</Stack>`,state)}><Stack direction="row" wrap gap={3}>{[0,50,100].map(p=><LearnerCourseCard key={p} courseName={name} instructorName="Morgan Reed" progressPercent={p} nextActivity="Practice exercise" dueAt="2026-10-20T12:00:00Z" referenceNow={new Date('2026-10-14T12:00:00Z')} detailsHref="#main-content" onContinue={()=>setContinued(v=>v+1)}/>)}</Stack></Example>;
}

function LearnerPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('LearnerCourseCard');
const [name,setName]=useState('Course basics');
const [progress,setProgress]=useState('35');
const [continued,setContinued]=useState(0);
const code=(percent:number)=>`<LearnerCourseCard courseName={${literal(name)}} instructorName="Morgan Reed" progressPercent={${percent}} nextActivity="Practice exercise" dueAt="2026-10-20T12:00:00Z" referenceNow={new Date("2026-10-14T12:00:00Z")} detailsHref="#main-content" onContinue={() => setContinued(value=>value+1)} />`;
const state=`  const [continued,setContinued] = useState(${continued});`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Course name" value={name} onValueChange={setName}/><TextField label="Completion percentage" value={progress} onValueChange={setProgress}/></Stack>} source={source('LearnerCard',`<Stack gap={3}>${code(Number(progress)||0)}<Typography>Continue requests: {continued}</Typography></Stack>`,state)}><LearnerCourseCard courseName={name} instructorName="Morgan Reed" progressPercent={Number(progress)||0} nextActivity="Practice exercise" dueAt="2026-10-20T12:00:00Z" referenceNow={new Date('2026-10-14T12:00:00Z')} detailsHref="#main-content" onContinue={()=>setContinued(v=>v+1)}/><Typography>Continue requests: {continued}</Typography></Example>;
}
const cards=Array.from({length:12},(_,i)=>({id:String(i+1),name:`Course ${i+1}`}));
function CollectionPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><CollectionPlaygroundPanel1 reference={reference} /></> : <><CollectionPlaygroundPanel2 reference={reference} /><CollectionPlayground reference/></>}</Stack>;
}

function CollectionPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('CardCollectionWithFooter, CourseCardFrame');
const [page,setPage]=useState(0);
const [size,setSize]=useState(3);
const [loading,setLoading]=useState(false);
const [empty,setEmpty]=useState(false);
const body=(isEmpty:boolean)=>`<CardCollectionWithFooter rows={${isEmpty?'[]':JSON.stringify(cards)}} getRowId={row=>row.id} page={page} pageSize={size} pageSizeOptions={[3,6,12]} onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} loading={${loading}} renderCard={row=><CourseCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>Host-owned course summary</Typography>} />} />`;
const state=`  const [page,setPage] = useState(${page});\n  const [size,setSize] = useState(${size});`;
return <Example title="Empty dataset with helpful content" source={source('EmptyCards','<CardCollectionWithFooter rows={[]} getRowId={(row: {id:string})=>row.id} page={0} pageSize={3} pageSizeOptions={[3]} onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} renderCard={row=><Typography>{row.id}</Typography>} emptyContent={<Typography>Create your first course to get started.</Typography>} />',state)}><CardCollectionWithFooter rows={[]} getRowId={(row:{id:string})=>row.id} page={0} pageSize={3} pageSizeOptions={[3]} onPaginationModelChange={model => { (setPage)(model.page); (setSize)(model.pageSize); }}  renderCard={row=><Typography>{row.id}</Typography>} emptyContent={<Typography>Create your first course to get started.</Typography>}/></Example>;
}

function CollectionPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('CardCollectionWithFooter, CourseCardFrame');
const [page,setPage]=useState(0);
const [size,setSize]=useState(3);
const [loading,setLoading]=useState(false);
const [empty,setEmpty]=useState(false);
const body=(isEmpty:boolean)=>`<CardCollectionWithFooter rows={${isEmpty?'[]':JSON.stringify(cards)}} getRowId={row=>row.id} page={page} pageSize={size} pageSizeOptions={[3,6,12]} onPaginationModelChange={model => { setPage(model.page); setSize(model.pageSize); }} loading={${loading}} renderCard={row=><CourseCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>Host-owned course summary</Typography>} />} />`;
const state=`  const [page,setPage] = useState(${page});\n  const [size,setSize] = useState(${size});`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><Checkbox label="Loading collection" checked={loading} onCheckedChange={setLoading}/><Checkbox label="Empty dataset" checked={empty} onCheckedChange={setEmpty}/></Stack>} source={source('CardCollection',body(empty),state)}><CardCollectionWithFooter rows={empty?[]:cards} getRowId={row=>row.id} page={page} pageSize={size} pageSizeOptions={[3,6,12]} onPaginationModelChange={model => { (setPage)(model.page); (setSize)(model.pageSize); }}  loading={loading} renderCard={row=><CourseCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>Host-owned course summary</Typography>}/>}/></Example>;
}
type Course={id:string;name:string;status:string;score:number};
const courses:Course[]=Array.from({length:18},(_,i)=>({id:String(i+1),name:`Course ${i+1}`,status:i%3?'active':'archived',score:100-i*3}));
const fieldOptions=[{id:'status',label:'Status',type:'enum' as const,enumOptions:[{id:'active',label:'Active'},{id:'archived',label:'Archived'}]}];
function GridPlayground({shell=false, reference=false}: {shell?:boolean; reference?:boolean}) {

return <Stack gap={4}>{reference ? <><GridPlaygroundPanel1 shell={shell} reference={reference} /></> : <><GridPlaygroundPanel2 shell={shell} reference={reference} /><GridPlayground shell={shell} reference/>{!shell && <GridReferences/>}</>}</Stack>;
}

function GridPlaygroundPanel1({shell=false}: {shell?:boolean; reference?:boolean}) {
const source=useSource('AppDataGrid, AppDataGridShell, type AppDataGridColumn');
const [message,setMessage]=useState('');
const rows=[
 {id:'foundations',name:'Foundations of accessible learning experiences and inclusive course design'},
 {id:'practice',name:'Practical workshop on building accessible activities and providing meaningful learner feedback'},
 {id:'leadership',name:'Leading collaborative projects across distributed learning teams'},
];
type Row=typeof rows[number];
const columns:AppDataGridColumn<Row>[]=[
 {field:'name',headerName:'Wrapped text',flex:1,minWidth:200,truncate:false,locked:true},
 {field:'truncated',headerName:'Truncated text',getCellValue:row=>row.name,flex:1,minWidth:200,truncate:true},
];
const Component=shell?AppDataGridShell<Row>:AppDataGrid<Row>;
const name=shell?'AppDataGridShell':'AppDataGrid';
const state=`  type Row={id:string;name:string};
  const rows:Row[]=${JSON.stringify(rows)};
  const [message,setMessage]=useState(${literal(message)});
  const columns:AppDataGridColumn<Row>[]=[
    {field:'name',headerName:'Wrapped text',flex:1,minWidth:200,truncate:false,locked:true},
    {field:'truncated',headerName:'Truncated text',getCellValue:row=>row.name,flex:1,minWidth:200,truncate:true},
  ];`;
const body=`<Stack gap={3}>
  <${name} label="Courses with wrapped text" rows={rows} columns={columns} getRowLabel={row=>row.name} onRowAction={row=>setMessage('Opened '+row.name)} hideFooter${shell?' toolbar={{show:false}}':''} style={{height:"max-content",flex:"none"}}/>
  {message && <Typography role="status">{message}</Typography>}
</Stack>`;
return <Example title="Wrapped and truncated cells" description="Both columns display the same long course name at equal widths. The first wraps onto multiple lines; the second stays on one line with an ellipsis. Activate a row to see the host callback result; your application supplies navigation." source={source('MultilineGrid',body,state)}>
 <Stack gap={3}>
  <Component label="Courses with wrapped text" rows={rows} columns={columns} getRowLabel={row=>row.name} onRowAction={row=>setMessage('Opened '+row.name)} hideFooter {...(shell?{toolbar:{show:false}}:{})} style={{height:"max-content",flex:"none"}}/>
  {message && <Typography role="status">{message}</Typography>}
 </Stack>
</Example>;
}

function GridPlaygroundPanel2({shell=false, reference=false}: {shell?:boolean; reference?:boolean}) {
const presentation=useExamplePresentation();
const overview=shell&&presentation?.phase==='overview';
const source=useSource('Button, AppDataGrid, AppDataGridShell, CourseCardFrame, createDataGridColumns, createActionMenuColumn, type AppDataGridColumn, type AppDataGridRowDragReorderParams');
const [density,setDensity]=useState<Density>('comfortable');
const [label,setLabel]=useState('Courses');
const [sizePreset,setSizePreset]=useState('default');
const [initialPageSize,setInitialPageSize]=useState(25);
const pageSizes=sizePreset==='small'?[5,10,25]:[25,50,100];
const [showFooter,setShowFooter]=useState(true);
const [wrapCells,setWrapCells]=useState(false);
const [longNames,setLongNames]=useState(false);
const [showReset,setShowReset]=useState(true);
const [showToolbar,setShowToolbar]=useState(true);
const [allowViewSwitch,setAllowViewSwitch]=useState(true);
const [toolbarActions,setToolbarActions]=useState({showSearchButton:true,showRefreshButton:true,showColumnsButton:true,showSortButton:true,showFilterButton:true});

const [rowSorter,setRowSorter]=useState(false);
const [showMoveButtons,setShowMoveButtons]=useState(false);
const [dragDisabled,setDragDisabled]=useState(false);
const [rows,setRows]=useState<Course[]>(()=>[...courses]);
const displayRows=longNames?rows.map(row=>({...row,name:row.name+' — Designing accessible learning experiences with practical activities and meaningful feedback'})):rows;
const effectivePageSizes=rowSorter?[25]:pageSizes;
const effectiveInitialPageSize=rowSorter?25:initialPageSize;

function reorder({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<Course>){
 setRows(current=>{
  const source=current.filter(row=>sourceRowIds.includes(row.id));
  if(!source.length||sourceRowIds.includes(targetRowId))return current;
  const next=current.filter(row=>!sourceRowIds.includes(row.id));
  const target=next.findIndex(row=>row.id===targetRowId);
  if(target<0)return current;
  next.splice(target+(position==='after'?1:0),0,...source);
  return next;
 });
}
const [view,setView]=useState<'list'|'cards'>('list');
const [state,setState]=useState('ready');
const [selection,setSelection]=useState(true);
const [message,setMessage]=useState('');
const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(()=>new Set());
const [search,setSearch]=useState('');
const requestExport=()=>setMessage('Export requested for all courses.');
const defaultActions=<Stack role="group" aria-label="Course actions" direction="row" wrap gap={2}>
  <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage('New course requested.')}>New course</Button>
  <Button density="compact" variant="outlined" tone="neutral" onPress={requestExport}>Export all</Button>
</Stack>;
const selectedActions=<Stack role="group" aria-label="Course actions" direction="row" wrap gap={2}>
  <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage('New course requested.')}>New course</Button>
  <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage(`Export requested for ${selectedRowIds.size} selected course(s).`)}>Export selected</Button>
  <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage(`Archive requested for ${selectedRowIds.size} selected course(s).`)}>Archive selected</Button>
</Stack>;
const actionState=shell?`  const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(new Set(${JSON.stringify([...selectedRowIds])}));
  const defaultActions=<Stack role="group" aria-label="Course actions" direction="row" wrap gap={2}>
    <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage('New course requested.')}>New course</Button>
    <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage('Export requested for all courses.')}>Export all</Button>
  </Stack>;
  const selectedActions=<Stack role="group" aria-label="Course actions" direction="row" wrap gap={2}>
    <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage('New course requested.')}>New course</Button>
    <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage(\`Export requested for \${selectedRowIds.size} selected course(s).\`)}>Export selected</Button>
    <Button density="compact" variant="outlined" tone="neutral" onPress={()=>setMessage(\`Archive requested for \${selectedRowIds.size} selected course(s).\`)}>Archive selected</Button>
  </Stack>;`:'';
const columns:AppDataGridColumn<Course>[]=createDataGridColumns([{field:'name',headerName:'Course',flex:2,minWidth:180,locked:true,truncate:!wrapCells},{field:'status',headerName:'Status',width:140,filterType:'enum'},{field:'score',headerName:'Score',width:120,filterType:'number'},createActionMenuColumn<Course>({getMenuActions:row=>[{id:'open',label:'Open course',onPress:()=>setMessage(`Opened ${row.name}`)}]})]);
const Component=shell?AppDataGridShell<Course>:AppDataGrid<Course>;
const sourceState=`  type Course={id:string;name:string;status:string;score:number};\n  const [rows,setRows]=useState<Course[]>(${JSON.stringify(displayRows)});${rowSorter?`\n  function reorder({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<Course>){\n    setRows(current=>{\n      const source=current.filter(row=>sourceRowIds.includes(row.id));\n      if(!source.length||sourceRowIds.includes(targetRowId))return current;\n      const next=current.filter(row=>!sourceRowIds.includes(row.id));\n      const target=next.findIndex(row=>row.id===targetRowId);\n      if(target<0)return current;\n      next.splice(target+(position==='after'?1:0),0,...source);\n      return next;\n    });\n  }`:""}\n  const [message,setMessage]=useState(${literal(message)});\n  const [search,setSearch]=useState(${literal(search)});\n  const [view,setView]=useState<'list'|'cards'>(${literal(view)});\n${actionState}\n  const columns:AppDataGridColumn<Course>[] = createDataGridColumns([{field:'name',headerName:'Course',flex:2,minWidth:180,locked:true,truncate:${!wrapCells}},{field:'status',headerName:'Status',width:140,filterType:'enum'},{field:'score',headerName:'Score',width:120,filterType:'number'},createActionMenuColumn<Course>({getMenuActions:row=>[{id:'open',label:'Open course',onPress:()=>setMessage(\`Opened \${row.name}\`)}]})]);`;
const name=shell?'AppDataGridShell':'AppDataGrid';
const extra=shell?` toolbar={{show:${showToolbar},showViewModeToggle:${allowViewSwitch},showSearchButton:${toolbarActions.showSearchButton},showColumnsButton:${toolbarActions.showColumnsButton},showSortButton:${toolbarActions.showSortButton},showFilterButton:${toolbarActions.showFilterButton},leftContent:defaultActions,leftContentWhenSelected:selectedActions,showRefreshButton:${!overview&&toolbarActions.showRefreshButton},onRefresh:()=>setMessage('Refresh requested'),filterFields:${JSON.stringify(fieldOptions)}}} view={{mode:view,onModeChange:setView,cards:{renderCard:row=><CourseCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>{row.status}</Typography>} />}}}`:'';
const body=`<Stack gap={3}><${name} label=${literal(label)} rows={${state==='empty'||state==='loading'?'[]':'rows'}} columns={columns} getRowLabel={row=>row.name} selection={${selection?(shell?'{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}':'true'):'false'}} searchValue={search} onSearchChange={setSearch} ${rowSorter?`rowDrag={{onReorder:reorder,showMoveButtons:${showMoveButtons},dragDisabled:${dragDisabled}}} `:''}pageSizeOptions={${JSON.stringify(effectivePageSizes)}} defaultPaginationModel={{page:0,pageSize:${effectiveInitialPageSize}}} hideFooter={${!showFooter}} filterFields={${JSON.stringify(fieldOptions)}} loading={${state==='loading'}} refreshing={${state==='refreshing'}} errorMessage={${state==='error'?literal('Unable to load courses'):'undefined'}} onRetry={()=>setMessage('Retry requested')} showResetView={${showReset}}${extra} style={{height:"max-content",flex:"none"}}/>{message && <Typography role="status">{message}</Typography>}</Stack>`;
return <Example title="Prop playground" density={density} description={shell?"Page-size configuration restarts pagination; the row sorter uses one complete 25-row page. Select rows to replace Export all with Export selected and reveal Archive selected. Shift-click a row selector to check or uncheck the range from the last clicked selector. Each click becomes the next anchor; selections outside the range stay unchanged. Enable the row sorter to show drag handles on one complete page, with or without checkboxes. Reordering requires an unsorted, unfiltered list. Dragging a selected row moves the whole selection. Actions announce local requests; the host owns creation, exports and persistence.":undefined} controls={<Stack direction="row" wrap gap={3}><TextField label="Grid accessible label" value={label} onValueChange={setLabel}/><Select label="Page-size options" value={sizePreset} disabled={rowSorter} options={[{id:'default',label:'Default: 25, 50, 100'},{id:'small',label:'Small pages: 5, 10, 25'}]} onValueChange={value=>{const preset=value??'default';setSizePreset(preset);setInitialPageSize(preset==='small'?5:25);}}/><Select label="Initial rows per page" value={String(effectiveInitialPageSize)} disabled={rowSorter} options={effectivePageSizes.map(size=>({id:String(size),label:String(size)}))} onValueChange={value=>setInitialPageSize(Number(value))}/><Checkbox label="Show pagination footer" checked={showFooter} onCheckedChange={setShowFooter}/><Checkbox label="Wrap cell text" checked={wrapCells} onCheckedChange={setWrapCells}/><Checkbox label="Use long course names" checked={longNames} onCheckedChange={setLongNames}/><Checkbox label="Show Reset view" checked={showReset} onCheckedChange={setShowReset}/>{shell&&<><Checkbox label="Show toolbar" checked={showToolbar} onCheckedChange={setShowToolbar}/><Checkbox label="Allow view switching" checked={allowViewSwitch} onCheckedChange={setAllowViewSwitch}/>{(Object.keys(toolbarActions) as (keyof typeof toolbarActions)[]).map(key=><Checkbox key={key} label={{showSearchButton:'Show search action',showRefreshButton:'Show refresh action',showColumnsButton:'Show columns action',showSortButton:'Show sort action',showFilterButton:'Show filter action'}[key]} checked={toolbarActions[key]} onCheckedChange={checked=>setToolbarActions(current=>({...current,[key]:checked}))}/>)}</>}<Select label="Density" value={density} options={[{id:'comfortable',label:'Comfortable'},{id:'compact',label:'Compact'}]} onValueChange={value=>setDensity(value as Density)}/><Select label="Dataset state" value={state} options={['ready','loading','refreshing','error','empty'].map(id=>({id,label:id}))} onValueChange={v=>setState(v??'ready')}/><Checkbox label="Enable row sorter" checked={rowSorter} onCheckedChange={setRowSorter}/>{rowSorter&&<><Checkbox label="Show row move buttons" checked={showMoveButtons} onCheckedChange={setShowMoveButtons}/><Checkbox label="Disable row dragging" checked={dragDisabled} onCheckedChange={setDragDisabled}/></>}<Checkbox label="Enable row selection" checked={selection} onCheckedChange={checked=>{setSelection(checked);if(!checked)setSelectedRowIds(new Set());}}/>{shell?<Select label="View mode" value={view} options={[{id:'list',label:'List'},{id:'cards',label:'Cards'}]} onValueChange={v=>setView(v as typeof view)}/>:<TextField label="Search dataset" value={search} onValueChange={setSearch}/>}</Stack>} source={source(shell?'GridShell':'DataGrid',`<ThemeScope density=${literal(density)}>\n${body}\n</ThemeScope>`,sourceState)}><Stack gap={3}><Component key={`${rowSorter}:${sizePreset}:${initialPageSize}`} label={label} rows={state==='empty'||state==='loading'?[]:displayRows} rowDrag={rowSorter?{onReorder:reorder,showMoveButtons,dragDisabled}:undefined} columns={columns} getRowLabel={row=>row.name} selection={selection?(shell?{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}:true):false} searchValue={search} onSearchChange={setSearch} pageSizeOptions={effectivePageSizes} defaultPaginationModel={{page:0,pageSize:effectiveInitialPageSize}} hideFooter={!showFooter} filterFields={fieldOptions} loading={state==='loading'} refreshing={state==='refreshing'} errorMessage={state==='error'?'Unable to load courses':undefined} onRetry={()=>setMessage('Retry requested')} showResetView={showReset} className={overview?styles.overviewShell:undefined} style={{height:'max-content',flex:'none'}} {...(shell?{toolbar:{...toolbarActions,show:showToolbar,showViewModeToggle:allowViewSwitch,leftContent:defaultActions,leftContentWhenSelected:selectedActions,showRefreshButton:!overview&&toolbarActions.showRefreshButton,onRefresh:()=>setMessage('Refresh requested'),filterFields:fieldOptions},view:{mode:view,onModeChange:setView,cards:{renderCard:(row:Course)=><CourseCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>{row.status}</Typography>}/>}}}:{})}/>{message && <Typography role="status">{message}</Typography>}</Stack></Example>;
}
function GridShellPlayground(){return <Stack gap={4}><GridPlayground shell/><GridReferences shell/><PersistedGridExample/><ServerGridExample/><CourseCollectionExample/><GridReorderExample selection={false}/><GridReorderExample selection={true}/><GridTransferExample/></Stack>;}
function ToolbarPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><ToolbarPlaygroundPanel1 reference={reference} /></> : <><ToolbarPlaygroundPanel2 reference={reference} /><ToolbarPlayground reference/></>}</Stack>;
}

function ToolbarPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbar, type DataToolbarColumnOption');
const [search,setSearch]=useState('');
const [view,setView]=useState<'list'|'cards'>('list');
const [filters,setFilters]=useState<DataToolbarFilterRule[]>([]);
const [sort,setSort]=useState<DataToolbarSortRule[]>([]);
const [selected,setSelected]=useState('0');
const [message,setMessage]=useState('No refresh requested');
const columns=[{id:'name',label:'Course',visible:true,locked:true},{id:'status',label:'Status',visible:true},{id:'actions',label:'Actions',visible:true,locked:true,reorderable:false}];
const [options,setOptions]=useState<DataToolbarColumnOption[]>(columns);
const state=`  const [search,setSearch]=useState(${literal(search)});\n  const [view,setView]=useState<'list'|'cards'>(${literal(view)});\n  const [filters,setFilters]=useState<DataToolbarFilterRule[]>(${JSON.stringify(filters)});\n  const [sort,setSort]=useState<DataToolbarSortRule[]>(${JSON.stringify(sort)});\n  const [options,setOptions]=useState<DataToolbarColumnOption[]>(${JSON.stringify(options)});\n  const [message,setMessage]=useState(${literal(message)});`;
const body=`<DataToolbar selectedCount={${Number(selected)||0}} searchValue={search} onSearchValueChange={setSearch} viewMode={view} onViewModeChange={setView} columnOptions={options} onColumnOptionsChange={setOptions} filterFields={${JSON.stringify(fieldOptions)}} filterRules={filters} onFilterRulesChange={setFilters} sortOptions={[{id:'name',label:'Course'}]} sortRules={sort} onSortRulesChange={setSort} onRefresh={()=>setMessage('Refresh requested')} />`;
return <Example title="Compact host toolbar with custom action" source={source('ToolbarAction','<DataToolbar showViewModeToggle={false} showColumnsButton={false} showFilterButton={false} showSortButton={false} leftContent={<Link href="#main-content">Create course</Link>} onRefresh={()=>setMessage("Refresh requested")} />',`  const [message,setMessage]=useState('No refresh requested');`)}><DataToolbar showViewModeToggle={false} showColumnsButton={false} showFilterButton={false} showSortButton={false} leftContent={<Link href="#main-content">Create course</Link>} onRefresh={()=>setMessage('Refresh requested')}/></Example>;
}

function ToolbarPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbar, type DataToolbarColumnOption');
const [search,setSearch]=useState('');
const [view,setView]=useState<'list'|'cards'>('list');
const [filters,setFilters]=useState<DataToolbarFilterRule[]>([]);
const [sort,setSort]=useState<DataToolbarSortRule[]>([]);
const [selected,setSelected]=useState('0');
const [refreshing,setRefreshing]=useState(false);
const [errorMessage,setErrorMessage]=useState('');
const [message,setMessage]=useState('No refresh requested');
const columns=[{id:'name',label:'Course',visible:true,locked:true},{id:'status',label:'Status',visible:true},{id:'actions',label:'Actions',visible:true,locked:true,reorderable:false}];
const [options,setOptions]=useState<DataToolbarColumnOption[]>(columns);
const state=`  const [search,setSearch]=useState(${literal(search)});\n  const [view,setView]=useState<'list'|'cards'>(${literal(view)});\n  const [filters,setFilters]=useState<DataToolbarFilterRule[]>(${JSON.stringify(filters)});\n  const [sort,setSort]=useState<DataToolbarSortRule[]>(${JSON.stringify(sort)});\n  const [options,setOptions]=useState<DataToolbarColumnOption[]>(${JSON.stringify(options)});\n  const [message,setMessage]=useState(${literal(message)});`;
const body=`<DataToolbar errorMessage={${errorMessage?literal(errorMessage):'undefined'}} onRetry={()=>setMessage('Retry requested')} refreshing={${refreshing}} selectedCount={${Number(selected)||0}} searchValue={search} onSearchValueChange={setSearch} viewMode={view} onViewModeChange={setView} columnOptions={options} onColumnOptionsChange={setOptions} filterFields={${JSON.stringify(fieldOptions)}} filterRules={filters} onFilterRulesChange={setFilters} sortOptions={[{id:'name',label:'Course'}]} sortRules={sort} onSortRulesChange={setSort} onRefresh={()=>setMessage('Refresh requested')} />`;
return <Example title="Prop playground" controls={<Stack direction="row" wrap gap={3}><TextField label="Selected row count" value={selected} onValueChange={setSelected}/><Checkbox label="Refreshing" checked={refreshing} onCheckedChange={setRefreshing}/><TextField label="Error message" value={errorMessage} onValueChange={setErrorMessage}/></Stack>} source={source('DataToolbar',body,state,["import { type DataToolbarFilterRule, type DataToolbarSortRule } from '@structured-growth/sg-ui/components';"])}><DataToolbar errorMessage={errorMessage||undefined} onRetry={()=>setMessage('Retry requested')} refreshing={refreshing} selectedCount={Number(selected)||0} searchValue={search} onSearchValueChange={setSearch} viewMode={view} onViewModeChange={setView} columnOptions={options} onColumnOptionsChange={setOptions} filterFields={fieldOptions} filterRules={filters} onFilterRulesChange={setFilters} sortOptions={[{id:'name',label:'Course'}]} sortRules={sort} onSortRulesChange={setSort} onRefresh={()=>setMessage('Refresh requested')}/></Example>;
}
function SelectionMenuPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><SelectionMenuPlaygroundPanel1 reference={reference} /></> : <><SelectionMenuPlaygroundPanel2 reference={reference} /><SelectionMenuPlayground reference/></>}</Stack>;
}

function SelectionMenuPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbarSelectionMenu');
const [state,setState]=useState<'none'|'some'|'all'>('none');
const [message,setMessage]=useState('No selection command');
const [mixed,setMixed]=useState<'none'|'some'|'all'>('some');
const [mixedMessage,setMixedMessage]=useState('Mixed selection');
const body=(selection:string)=>`<DataToolbarSelectionMenu options={[{id:'page',label:'Select current page'},{id:'none',label:'Clear selection'}]} selectionState={${selection}} onToggleSelection={()=>setSelection(previous=>previous==='all'?'none':'all')} onSelectOption={id=>{setSelection(id==='none'?'none':'all');setMessage(id);}} />`;
const stateCode=`  const [selection,setSelection]=useState<'none'|'some'|'all'>(${literal(state)});\n  const [message,setMessage]=useState(${literal(message)});`;
return <Example title="Mixed selection" source={source('MixedSelection',body('selection'),`  const [selection,setSelection]=useState<'none'|'some'|'all'>(${literal(mixed)});\n  const [message,setMessage]=useState(${literal(mixedMessage)});`)}><DataToolbarSelectionMenu options={[{id:'page',label:'Select current page'},{id:'none',label:'Clear selection'}]} selectionState={mixed} onToggleSelection={()=>setMixed(v=>v==='all'?'none':'all')} onSelectOption={id=>{setMixed(id==='none'?'none':'all');setMixedMessage(id);}}/></Example>;
}

function SelectionMenuPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbarSelectionMenu');
const [state,setState]=useState<'none'|'some'|'all'>('none');
const [message,setMessage]=useState('No selection command');
const [mixed,setMixed]=useState<'none'|'some'|'all'>('some');
const [mixedMessage,setMixedMessage]=useState('Mixed selection');
const body=(selection:string)=>`<DataToolbarSelectionMenu options={[{id:'page',label:'Select current page'},{id:'none',label:'Clear selection'}]} selectionState={${selection}} onToggleSelection={()=>setSelection(previous=>previous==='all'?'none':'all')} onSelectOption={id=>{setSelection(id==='none'?'none':'all');setMessage(id);}} />`;
const stateCode=`  const [selection,setSelection]=useState<'none'|'some'|'all'>(${literal(state)});\n  const [message,setMessage]=useState(${literal(message)});`;
return <Example title="Prop playground" controls={<Select label="Selection state" value={state} options={['none','some','all'].map(id=>({id,label:id}))} onValueChange={v=>setState(v as typeof state)}/>} source={source('SelectionMenu',body('selection'),stateCode)}><DataToolbarSelectionMenu options={[{id:'page',label:'Select current page'},{id:'none',label:'Clear selection'}]} selectionState={state} onToggleSelection={()=>setState(v=>v==='all'?'none':'all')} onSelectOption={id=>{setState(id==='none'?'none':'all');setMessage(id);}}/></Example>;
}
function DragPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><DragPlaygroundPanel1 reference={reference} /></> : <><DragPlaygroundPanel2 reference={reference} /><DragPlayground reference/></>}</Stack>;
}

function DragPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataGridDragHandle, AppDataGrid, type AppDataGridRowDragReorderParams');
const [disabled,setDisabled]=useState(false);
const [dragging,setDragging]=useState(false);
const [label,setLabel]=useState('Move Course 1');
const [pressed,setPressed]=useState(0);
const [rows,setRows]=useState(courses.slice(0,4));
function reorder({sourceRowIds,targetRowId,position}:{sourceRowIds:readonly string[];targetRowId:string;position:'before'|'after'}){setRows(current=>{const source=current.filter(row=>sourceRowIds.includes(row.id));if(!source.length||sourceRowIds.includes(targetRowId))return current;const next=current.filter(row=>!sourceRowIds.includes(row.id));const target=next.findIndex(row=>row.id===targetRowId);if(target<0)return current;next.splice(target+(position==='after'?1:0),0,...source);return next;});}
const reorderState=`  const [rows,setRows]=useState(${JSON.stringify(rows)});\n  function reorder({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<(typeof rows)[number]>) {\n    setRows(current=>{const source=current.filter(row=>sourceRowIds.includes(row.id));if(!source.length||sourceRowIds.includes(targetRowId))return current;const next=current.filter(row=>!sourceRowIds.includes(row.id));const target=next.findIndex(row=>row.id===targetRowId);if(target<0)return current;next.splice(target+(position==='after'?1:0),0,...source);return next;});\n  }`;
return <Example title="Complete single-page reorder with host acceptance" source={source('GridReorder','<AppDataGrid label="Reorder courses" rows={rows} columns={[{field:"name",headerName:"Course",flex:1}]} getRowLabel={row=>row.name} defaultPaginationModel={{page:0,pageSize:10}} pageSizeOptions={[10]} rowDrag={{onReorder:reorder}} style={{height:"max-content",flex:"none"}}/>',reorderState)}><AppDataGrid label="Reorder courses" rows={rows} columns={[{field:'name',headerName:'Course',flex:1}]} getRowLabel={row=>row.name} defaultPaginationModel={{page:0,pageSize:10}} pageSizeOptions={[10]} rowDrag={{onReorder:reorder}} style={{height:"max-content",flex:"none"}}/></Example>;
}

function DragPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataGridDragHandle, AppDataGrid, type AppDataGridRowDragReorderParams');
const [disabled,setDisabled]=useState(false);
const [dragging,setDragging]=useState(false);
const [label,setLabel]=useState('Move Course 1');
const [pressed,setPressed]=useState(0);
const [rows,setRows]=useState(courses.slice(0,4));
function reorder({sourceRowIds,targetRowId,position}:{sourceRowIds:readonly string[];targetRowId:string;position:'before'|'after'}){setRows(current=>{const source=current.filter(row=>sourceRowIds.includes(row.id));if(!source.length||sourceRowIds.includes(targetRowId))return current;const next=current.filter(row=>!sourceRowIds.includes(row.id));const target=next.findIndex(row=>row.id===targetRowId);if(target<0)return current;next.splice(target+(position==='after'?1:0),0,...source);return next;});}
const reorderState=`  const [rows,setRows]=useState(${JSON.stringify(rows)});\n  function reorder({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<(typeof rows)[number]>) {\n    setRows(current=>{const source=current.filter(row=>sourceRowIds.includes(row.id));if(!source.length||sourceRowIds.includes(targetRowId))return current;const next=current.filter(row=>!sourceRowIds.includes(row.id));const target=next.findIndex(row=>row.id===targetRowId);if(target<0)return current;next.splice(target+(position==='after'?1:0),0,...source);return next;});\n  }`;
return <Example title="Prop playground" controls={<Stack gap={3}><TextField label="Handle accessible name" value={label} onValueChange={setLabel}/><Checkbox label="Disabled handle" checked={disabled} onCheckedChange={setDisabled}/><Checkbox label="Dragging appearance" checked={dragging} onCheckedChange={setDragging}/></Stack>} source={source('DragHandle',`<DataGridDragHandle label={${literal(label)}} disabled={${disabled}} dragging={${dragging}} onPress={()=>setPressed(n=>n+1)} /><Typography>Move requests: {pressed}</Typography>`,`  const [pressed,setPressed]=useState(${pressed});`)}><DataGridDragHandle label={label} disabled={disabled} dragging={dragging} onPress={()=>setPressed(n=>n+1)}/><Typography>Move requests: {pressed}</Typography></Example>;
}
function ProofGridExample() {
  const source=useExampleSource();
  const [state,setState]=useState<GridState>({...defaultGridState,pageSize:5});
  const columns:GridColumn<Course>[]=[{id:'name',label:'Course',getValue:row=>row.name},{id:'status',label:'Status',getValue:row=>row.status},{id:'score',label:'Score',getValue:row=>row.score}];
  return <Example title="Course data grid" description="Search, sort, resize columns and choose how many courses to show per page. The host owns this grid’s state." source={source({
    name:'CourseDataGrid',
    imports:["import { DataGrid, type GridColumn, type GridState } from '@structured-growth/sg-ui/experimental';"],
    state:`  type Course={id:string;name:string;status:string;score:number};
  const rows:Course[]=${JSON.stringify(courses)};
  const columns:GridColumn<Course>[]=[{id:'name',label:'Course',getValue:row=>row.name},{id:'status',label:'Status',getValue:row=>row.status},{id:'score',label:'Score',getValue:row=>row.score}];
  const [state,setState]=useState<GridState>(${JSON.stringify(state)});`,
    body:'<DataGrid label="Courses" rows={rows} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} state={state} onStateChange={setState} />',
  })}><DataGrid label="Courses" rows={courses} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} state={state} onStateChange={setState}/></Example>;
}
function SubheaderPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><SubheaderPlaygroundPanel1 reference={reference} /></> : <><SubheaderPlaygroundPanel2 reference={reference} /><SubheaderPlayground reference/></>}</Stack>;
}

function SubheaderPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('RowSubHeader');
const [title,setTitle]=useState('Course group');
return <Example title="Heading with supporting content" source={source('RowSubheaderDetails','<RowSubHeader title="Required courses" trailingContent={<Typography variant="caption">Complete all courses to finish the pathway.</Typography>} />')}><RowSubHeader title="Required courses" trailingContent={<Typography variant="caption">Complete all courses to finish the pathway.</Typography>} /></Example>;
}

function SubheaderPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('RowSubHeader');
const [title,setTitle]=useState('Course group');
return <Example title="Prop playground" controls={<TextField label="Group heading" value={title} onValueChange={setTitle}/>} source={source('RowSubHeader',`<RowSubHeader title={${literal(title)}} />`)}><RowSubHeader title={title}/></Example>;
}
function PresetsPlayground({reference=false}: {reference?:boolean} = {}) {

return <Stack gap={4}>{reference ? <><PresetsPlaygroundPanel1 reference={reference} /></> : <><PresetsPlaygroundPanel2 reference={reference} /><PresetsPlayground reference/></>}</Stack>;
}

function PresetsPlaygroundPanel1({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbar, createAdminCourseGridOptions, createAdminPeopleGridOptions, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions');
const [preset,setPreset]=useState('admin-courses');
const [message,setMessage]=useState('Open columns, filters or sorting');
const options=preset==='admin-people'?createAdminPeopleGridOptions():preset==='instructor-courses'?createInstructorCourseGridOptions():preset==='instructor-learners'?createInstructorCourseLearnersGridOptions():createAdminCourseGridOptions();
const functionName=preset==='admin-people'?'createAdminPeopleGridOptions':preset==='instructor-courses'?'createInstructorCourseGridOptions':preset==='instructor-learners'?'createInstructorCourseLearnersGridOptions':'createAdminCourseGridOptions';
const body=`<DataToolbar columnOptions={options.columnOptions} sortOptions={options.sortOptions} filterFields={${'filterFields' in options?'options.filterFields':'[]'}} onRefresh={()=>setMessage('Refresh requested')} />`;
return <Example title="Explicit host localization" source={source('LocalizedPreset','<DataToolbar columnOptions={options.columnOptions} sortOptions={options.sortOptions} filterFields={options.filterFields} />',`  const options=createAdminCourseGridOptions((_key,parameters)=>'Host: '+parameters.defaultMessage);`)}><DataToolbar columnOptions={createAdminCourseGridOptions((_key,p)=>'Host: '+p.defaultMessage).columnOptions} sortOptions={createAdminCourseGridOptions((_key,p)=>'Host: '+p.defaultMessage).sortOptions} filterFields={createAdminCourseGridOptions((_key,p)=>'Host: '+p.defaultMessage).filterFields}/></Example>;
}

function PresetsPlaygroundPanel2({reference=false}: {reference?:boolean} = {}) {
const source=useSource('DataToolbar, createAdminCourseGridOptions, createAdminPeopleGridOptions, createInstructorCourseGridOptions, createInstructorCourseLearnersGridOptions');
const [preset,setPreset]=useState('admin-courses');
const [message,setMessage]=useState('Open columns, filters or sorting');
const options=preset==='admin-people'?createAdminPeopleGridOptions():preset==='instructor-courses'?createInstructorCourseGridOptions():preset==='instructor-learners'?createInstructorCourseLearnersGridOptions():createAdminCourseGridOptions();
const functionName=preset==='admin-people'?'createAdminPeopleGridOptions':preset==='instructor-courses'?'createInstructorCourseGridOptions':preset==='instructor-learners'?'createInstructorCourseLearnersGridOptions':'createAdminCourseGridOptions';
const body=`<DataToolbar columnOptions={options.columnOptions} sortOptions={options.sortOptions} filterFields={${'filterFields' in options?'options.filterFields':'[]'}} onRefresh={()=>setMessage('Refresh requested')} />`;
return <Example title="Prop playground" controls={<Select label="Grid preset" value={preset} options={['admin-courses','admin-people','instructor-courses','instructor-learners'].map(id=>({id,label:id}))} onValueChange={v=>setPreset(v??'admin-courses')}/>} source={source('GridPresets',body,`  const options=${functionName}();\n  const [message,setMessage]=useState(${literal(message)});`)}><DataToolbar columnOptions={options.columnOptions} sortOptions={options.sortOptions} filterFields={'filterFields' in options?options.filterFields:[]} onRefresh={()=>setMessage('Refresh requested')}/></Example>;
}
export const dataEntries:CatalogEntry[]=[
 {slug:'inline-progress',title:'AppInlineProgress',description:'Finite progress, widths and completion states.',exports:['AppInlineProgress'],Playground:ProgressPlayground},
 {slug:'operation-steps',title:'AppOperationSteps',description:'Host-owned operation states, labels and errors.',exports:['AppOperationSteps'],Playground:StepsPlayground},
 {slug:'pagination-footer',title:'AppPaginationFooter',description:'Controlled page sizes, known and unknown totals.',exports:['AppPaginationFooter'],Playground:FooterPlayground},
 {slug:'card-frame',title:'CourseCardFrame',description:'Course-card slots, widths and long content.',exports:['CourseCardFrame'],Playground:FramePlayground},
 {slug:'instructor-card',title:'InstructorCourseCard',description:'Course status, learner counts and instructor actions.',exports:['InstructorCourseCard'],Playground:InstructorPlayground},
 {slug:'learner-card',title:'LearnerCourseCard',description:'Progress, deadlines and host continuation callbacks.',exports:['LearnerCourseCard'],Playground:LearnerPlayground},
 {slug:'card-collection',title:'CardCollectionWithFooter',description:'One owner for card pagination and loading/empty content.',exports:['CardCollectionWithFooter'],Playground:CollectionPlayground},
 {slug:'app-data-grid',title:'AppDataGrid',description:'Owned selection, sorting, filtering, columns and paging.',exports:['AppDataGrid','createDataGridColumns','createActionMenuColumn'],Playground:GridPlayground},
 {slug:'data-grid-shell',title:'AppDataGridShell',description:'Shared toolbar state, cards/list mode and criteria.',exports:['AppDataGridShell'],Playground:GridShellPlayground},
 {slug:'data-toolbar',title:'DataToolbar',description:'Controlled search, sort/filter menus, columns and refresh.',exports:['DataToolbar'],Playground:ToolbarPlayground},
 {slug:'selection-menu',title:'DataToolbarSelectionMenu',description:'Host selection commands and mixed states.',exports:['DataToolbarSelectionMenu'],Playground:SelectionMenuPlayground},
 {slug:'row-reorder',title:'DataGridDragHandle',description:'Named drag handles and complete-dataset Move requests.',exports:['DataGridDragHandle'],Playground:DragPlayground},
 {slug:'processing-grid',title:'DataGrid',description:'Search, sorting, flexible columns and pagination for host-owned course data.',exports:['DataGrid'],exampleTitle:'Course data grid',Playground:ProofGridExample},
 {slug:'row-subheader',title:'RowSubHeader',description:'Grouped-row headings and supporting content.',exports:['RowSubHeader'],Playground:SubheaderPlayground},
 {slug:'grid-presets',title:'Grid presets',description:'Admin/instructor factories, canonical statuses and host translations.',exports:['createAdminCourseGridOptions','createAdminPeopleGridOptions','createInstructorCourseGridOptions','createInstructorCourseLearnersGridOptions'],Playground:PresetsPlayground},
];

/** Fixed view/density and dataset-state comparisons never receive playground props. */
function GridReferences({shell=false}: {shell?:boolean}) {
  return <Stack gap={4}>
    {(shell ? ['list','cards'] as const : ['list'] as const).flatMap(mode => (['compact','comfortable'] as const).map(density =>
      <GridReference key={`${mode}-${density}`} shell={shell} mode={mode} density={density}/>))}
    {(['loading','refreshing','empty','error'] as const).map(state => <GridReference key={state} shell={shell} state={state} mode="list" density="comfortable"/>)}
  </Stack>;
}
function GridReference({shell,mode,density,state='ready'}: {shell:boolean;mode:'list'|'cards';density:Density;state?:'ready'|'loading'|'refreshing'|'empty'|'error'}) {
  const source=useSource('AppDataGrid, AppDataGridShell, CourseCardFrame, type AppDataGridColumn');
  const [message,setMessage]=useState('No reference action yet');
  const title=state==='ready' ? `${mode==='list'?'List':'Cards'} · ${density}` : `${state[0].toUpperCase()+state.slice(1)} dataset · ${density}`;
  const columns:AppDataGridColumn<Course>[]=[{field:'name',headerName:'Course',flex:1,minWidth:180,locked:true},{field:'status',headerName:'Status',width:100}];
  const rows=state==='empty'||state==='loading'?[]:courses.slice(0,6);
  const Component=shell?AppDataGridShell<Course>:AppDataGrid<Course>;
  const sourceState=`  type Course={id:string;name:string;status:string;score:number};\n  const rows:Course[]=${JSON.stringify(rows)};\n  const columns:AppDataGridColumn<Course>[]=${JSON.stringify(columns)};\n  const [message,setMessage]=useState(${literal(message)});`;
  const extra=shell?` toolbar={{showViewModeToggle:false}} view={{mode:${literal(mode)},cards:{renderCard:row=><CourseCardFrame header={<Typography as="h3" variant="subtitle1">{row.name}</Typography>} body={<Typography>{row.status}</Typography>}/>}}}`:'';
  const body=`<ThemeScope density=${literal(density)}>\n  <Stack gap={3}>\n    <${shell?'AppDataGridShell':'AppDataGrid'} label=${literal(title)} rows={rows} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} defaultPaginationModel={{page:0,pageSize:6}} pageSizeOptions={[6,10]} loading={${state==='loading'}} refreshing={${state==='refreshing'}} errorMessage={${state==='error'?literal('Sample request failed.'): 'undefined'}} onRetry={()=>setMessage('Retry requested')} onRowAction={row=>setMessage('Opened '+row.name)}${extra} style={{height:"max-content",flex:"none"}}/>\n    \n  </Stack>\n</ThemeScope>`;
  return <Example title={title} density={density} description={state==='error'&&shell?"The toolbar shows the request failure and its retry action while existing rows remain in place. The host owns retry and request completion.":state==='loading'?"Initial loading: no rows have arrived yet.":state==='refreshing'?(shell?"Existing rows remain in place while the toolbar refresh icon shows pending progress. The host owns request completion.":"Existing rows remain in place during refresh, with busy semantics and a polite announcement. Standalone hosts can compose DataToolbar to show refresh progress."):"A fixed reference configuration with its own row interactions and host feedback."} source={source('GridReference',body,sourceState)}>
    <Stack gap={3}><Component label={title} rows={rows} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} defaultPaginationModel={{page:0,pageSize:6}} pageSizeOptions={[6,10]} loading={state==='loading'} refreshing={state==='refreshing'} errorMessage={state==='error'?'Sample request failed.':undefined} onRetry={()=>setMessage('Retry requested')} onRowAction={row=>setMessage('Opened '+row.name)} style={{height:"max-content",flex:"none"}} {...(shell?{toolbar:{showViewModeToggle:false},view:{mode,cards:{renderCard:(row:Course)=><CourseCardFrame header={<Typography as="h3" variant="subtitle1">{row.name}</Typography>} body={<Typography>{row.status}</Typography>}/>}}}:{})}/></Stack>
  </Example>;
}
