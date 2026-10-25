'use client';
import { AppDataGridShell, createActionMenuColumn, type AppDataGridColumn } from '@structured-growth/sg-ui/components';
import { formatDueDateLabel } from '@structured-growth/sg-ui/components/LearnerCourseCard';
import { Example } from '../components/Example';
import { useExampleSource } from './useExampleSource';

type Course = {id:string;name:string;site:string;dueAt:string;detailsHref:string;launchHref:string};
const rows:Course[]=[{id:'course-1',name:'Working with feedback',site:'Learning Studio',dueAt:'2026-10-20T12:00:00Z',detailsHref:'#course-details',launchHref:'#course-activity'},{id:'course-2',name:'Planning a project',site:'Learning Studio',dueAt:'invalid',detailsHref:'#project-details',launchHref:'#project-activity'}];
const columnSource=`  const columns:AppDataGridColumn<Course>[]=[
    {field:'name',headerName:'Course',flex:1,minWidth:230,cellType:'link',getLink:row=>({href:row.detailsHref})},
    {field:'site',headerName:'Site',width:180},
    {field:'dueAt',headerName:'Due',width:220,formatValue:value=>formatDueDateLabel(String(value),undefined,{locale:'en-US'})},
    createActionMenuColumn<Course>({headerName:'Actions',getMenuActions:row=>[
      {id:'details',label:'Details',href:row.detailsHref},
      {id:'continue',label:'Continue',href:row.launchHref,target:'_blank',rel:'noopener noreferrer'},
    ]}),
  ];`;
export function CourseCollectionExample(){
 const source=useExampleSource();
 const columns:AppDataGridColumn<Course>[]=[
  {field:'name',headerName:'Course',flex:1,minWidth:230,cellType:'link',getLink:row=>({href:row.detailsHref})},
  {field:'site',headerName:'Site',width:180},
  {field:'dueAt',headerName:'Due',width:220,formatValue:value=>formatDueDateLabel(String(value),undefined,{locale:'en-US'})},
  createActionMenuColumn<Course>({headerName:'Actions',getMenuActions:row=>[
   {id:'details',label:'Details',href:row.detailsHref},
   {id:'continue',label:'Continue',href:row.launchHref,target:'_blank',rel:'noopener noreferrer'},
  ]}),
 ];
 const body='<AppDataGridShell label="Assigned courses" rows={rows} columns={columns} getRowLabel={row=>row.name} pageSizeOptions={[6,10]} defaultPaginationModel={{page:0,pageSize:6}} style={{height:"max-content",flex:"none"}} />';
 return <Example title="Course collection with host actions" description="The host supplies course columns, localized date formatting and destination URLs. Details use the navigation adapter; Continue opens a new tab. This example does not persist course changes." source={source({name:'CourseCollection',imports:["import { AppDataGridShell, createActionMenuColumn, type AppDataGridColumn } from '@structured-growth/sg-ui/components';","import { formatDueDateLabel } from '@structured-growth/sg-ui/components/LearnerCourseCard';"],state:`  type Course={id:string;name:string;site:string;dueAt:string;detailsHref:string;launchHref:string};\n  const rows:Course[]=${JSON.stringify(rows)};\n${columnSource}`,body})}><AppDataGridShell label="Assigned courses" rows={rows} columns={columns} getRowLabel={row=>row.name} pageSizeOptions={[6,10]} defaultPaginationModel={{page:0,pageSize:6}} style={{height:"max-content",flex:"none"}}/></Example>;
}
