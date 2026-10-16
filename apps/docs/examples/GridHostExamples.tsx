'use client';
import {useEffect,useState} from 'react';
import {AppDataGridShell,ClassCardFrame,createActionMenuColumn,parseFilterRuleValues,type AppDataGridColumn,type AppDataGridProps,type DataToolbarFilterField} from '@structured-growth/sg-ui/components';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource,literal} from './source';
type Course={id:string;name:string;status:string};
type Criteria=Parameters<NonNullable<AppDataGridProps<Course>['onStateChange']>>[0];
const records:Course[]=Array.from({length:18},(_,index)=>({id:String(index+1),name:`Course ${String(index+1).padStart(2,'0')}`,status:index%3===0?'archived':'active'}));
const fields=[{id:'status',label:'Status',type:'enum' as const,enumOptions:[{id:'active',label:'Active'},{id:'archived',label:'Archived'}]}];
const imports=["import {AppDataGridShell,ClassCardFrame,createActionMenuColumn,parseFilterRuleValues,type AppDataGridColumn,type AppDataGridProps,type DataToolbarFilterField} from '@structured-growth/sg-ui/components';","import {Stack,Typography} from '@structured-growth/sg-ui/primitives';"];
const columnsCode=`  const columns:AppDataGridColumn<Course>[]=[{field:'name',headerName:'Course',minWidth:160,flex:1,locked:true},{field:'status',headerName:'Status',width:120},createActionMenuColumn<Course>({getMenuActions:row=>[{id:'open',label:'Open course',onPress:()=>setResult('Open requested for '+row.name)}]})];`;
function columnsFor(setResult:(value:string)=>void):AppDataGridColumn<Course>[] {return [{field:'name',headerName:'Course',minWidth:160,flex:1,locked:true},{field:'status',headerName:'Status',width:120},createActionMenuColumn<Course>({getMenuActions:row=>[{id:'open',label:'Open course',onPress:()=>setResult('Open requested for '+row.name)}]})];}
const dataCode=`  type Course={id:string;name:string;status:string};\n  const records:Course[]=${JSON.stringify(records)};\n  const fields:DataToolbarFilterField[]=${JSON.stringify(fields)};`;
export function PersistedGridExample() {
 const [result,setResult]=useState('');
 const columns=columnsFor(setResult);
 const body=`<Stack gap={3}>
  <AppDataGridShell label="Saved course view" rows={records} columns={columns} getRowLabel={row=>row.name} persistence={{key:'docs-course-view-v1'}} showResetView
    defaultPaginationModel={{page:0,pageSize:5}} pageSizeOptions={[5,10]} defaultSearchValue="" defaultSortRules={[{field:'name',direction:'asc'}]} defaultFilterRules={[]}
    defaultColumnVisibilityModel={{name:true,status:true,actions:true}} defaultColumnOrder={['name','status','actions']} defaultColumnWidths={{status:120}}
    filterFields={fields} toolbar={{showRefreshButton:true,onRefresh:()=>setResult('Local course records refreshed.')}}
    view={{defaultMode:'list',cards:{renderCard:row=><ClassCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>{row.status}</Typography>}/>}}} style={{height:420}} />
  <Typography role="status">{result}</Typography>
</Stack>`;
 return <Example title="Persisted course view and reset" description="An isolated localStorage key restores criteria, columns, widths and view mode after reload. Selection, host rows and request state are never persisted. Reset view restores the declared page size 5, ascending Course sort, empty search/filters, visible ordered columns and list mode. Storage initialization is SSR-safe and unavailable storage falls back to local state." source={exampleSource({name:'PersistedCourseView',imports,state:`${dataCode}\n  const [result,setResult]=useState(${literal(result)});\n${columnsCode}`,body})}>
  <Stack gap={3}><AppDataGridShell label="Saved course view" rows={records} columns={columns} getRowLabel={row=>row.name} persistence={{key:'docs-course-view-v1'}} showResetView defaultPaginationModel={{page:0,pageSize:5}} pageSizeOptions={[5,10]} defaultSearchValue="" defaultSortRules={[{field:'name',direction:'asc'}]} defaultFilterRules={[]} defaultColumnVisibilityModel={{name:true,status:true,actions:true}} defaultColumnOrder={['name','status','actions']} defaultColumnWidths={{status:120}} filterFields={fields} toolbar={{showRefreshButton:true,onRefresh:()=>setResult('Local course records refreshed.')}} view={{defaultMode:'list',cards:{renderCard:row=><ClassCardFrame header={<Typography as="h3" variant="h5">{row.name}</Typography>} body={<Typography>{row.status}</Typography>}/>}}} style={{height:420}}/><Typography role="status">{result}</Typography></Stack>
 </Example>;
}
/** This bounded local adapter deliberately leaves old timers running to exercise freshness. */
function queryCourses(criteria:Criteria,fail:boolean):Promise<{rows:Course[];total:number}> {
 return new Promise((resolve,reject)=>setTimeout(()=>{
  if(fail){reject(new Error('Sample course request failed. Retry to recover.'));return;}
  let matches=records.filter(row=>row.name.toLowerCase().includes(criteria.searchValue.toLowerCase()));
  for(const rule of criteria.filterRules)if(rule.field==='status'){const values=parseFilterRuleValues(rule.value);if(values.length)matches=matches.filter(row=>rule.operator==='is_not'?!values.includes(row.status):values.includes(row.status));}
  for(const rule of [...criteria.sortRules].reverse())matches.sort((a,b)=>String(a[rule.field as 'name'|'status']).localeCompare(String(b[rule.field as 'name'|'status']))*(rule.direction==='desc'?-1:1));
  const start=criteria.paginationModel.page*criteria.paginationModel.pageSize;
  resolve({rows:matches.slice(start,start+criteria.paginationModel.pageSize),total:matches.length});
 },criteria.searchValue==='Course 01'?650:200));
}
const queryCode=`  function queryCourses(criteria:Criteria,fail:boolean):Promise<{rows:Course[];total:number}> {
    return new Promise((resolve,reject)=>setTimeout(()=>{
      if(fail){reject(new Error('Sample course request failed. Retry to recover.'));return;}
      let matches=records.filter(row=>row.name.toLowerCase().includes(criteria.searchValue.toLowerCase()));
      for(const rule of criteria.filterRules)if(rule.field==='status'){const values=parseFilterRuleValues(rule.value);if(values.length)matches=matches.filter(row=>rule.operator==='is_not'?!values.includes(row.status):values.includes(row.status));}
      for(const rule of [...criteria.sortRules].reverse())matches.sort((a,b)=>String(a[rule.field as 'name'|'status']).localeCompare(String(b[rule.field as 'name'|'status']))*(rule.direction==='desc'?-1:1));
      const start=criteria.paginationModel.page*criteria.paginationModel.pageSize;
      resolve({rows:matches.slice(start,start+criteria.paginationModel.pageSize),total:matches.length});
    },criteria.searchValue==='Course 01'?650:200));
  }`;
export function ServerGridExample() {
 const [criteria,setCriteria]=useState<Criteria>({paginationModel:{page:0,pageSize:5},searchValue:'',sortRules:[],filterRules:[],selectedRowIds:new Set()});
 const [response,setResponse]=useState<{rows:Course[];total:number}>({rows:[],total:0});
 const [loading,setLoading]=useState(true);const [error,setError]=useState<string>();const [retry,setRetry]=useState(0);const [result,setResult]=useState('');
 const columns=columnsFor(setResult);
 const requestKey=JSON.stringify({paginationModel:criteria.paginationModel,searchValue:criteria.searchValue,sortRules:criteria.sortRules,filterRules:criteria.filterRules});
 useEffect(()=>{
  let current=true;setLoading(true);setError(undefined);
  queryCourses(criteria,criteria.searchValue.toLowerCase()==='fail'&&retry===0).then(next=>{if(current)setResponse(next);},reason=>{if(current)setError(reason instanceof Error?reason.message:'Course request failed.');}).finally(()=>{if(current)setLoading(false);});
  return ()=>{current=false;};
 },[requestKey,retry]);
 const state=`${dataCode}
  type Criteria=Parameters<NonNullable<AppDataGridProps<Course>['onStateChange']>>[0];
  const [criteria,setCriteria]=useState<Criteria>({paginationModel:${JSON.stringify(criteria.paginationModel)},searchValue:${literal(criteria.searchValue)},sortRules:${JSON.stringify(criteria.sortRules)},filterRules:${JSON.stringify(criteria.filterRules)},selectedRowIds:new Set(${JSON.stringify([...criteria.selectedRowIds])})});
  const [response,setResponse]=useState<{rows:Course[];total:number}>({rows:[],total:0});
  const [loading,setLoading]=useState(true);const [error,setError]=useState<string>();const [retry,setRetry]=useState(0);const [result,setResult]=useState(${literal(result)});
${columnsCode}
${queryCode}
  const requestKey=JSON.stringify({paginationModel:criteria.paginationModel,searchValue:criteria.searchValue,sortRules:criteria.sortRules,filterRules:criteria.filterRules});
  useEffect(()=>{
    let current=true;setLoading(true);setError(undefined);
    queryCourses(criteria,criteria.searchValue.toLowerCase()==='fail'&&retry===0).then(next=>{if(current)setResponse(next);},reason=>{if(current)setError(reason instanceof Error?reason.message:'Course request failed.');}).finally(()=>{if(current)setLoading(false);});
    return ()=>{current=false;};
  },[requestKey,retry]);`;
 const body=`<Stack gap={3}>
  <AppDataGridShell label="Server course search" mode="server" rows={response.rows} rowCount={response.total} columns={columns} getRowLabel={row=>row.name} loading={loading} errorMessage={error} onRetry={()=>setRetry(value=>value+1)}
    paginationModel={criteria.paginationModel} searchValue={criteria.searchValue} sortRules={criteria.sortRules} filterRules={criteria.filterRules} selection={{selectedRowIds:criteria.selectedRowIds}}
    onStateChange={next=>{setCriteria(next);setRetry(0);}} pageSizeOptions={[5,10]} filterFields={fields} toolbar={{showRefreshButton:true,onRefresh:()=>setRetry(value=>value+1)}} showResetView defaultPaginationModel={{page:0,pageSize:5}} style={{height:420}} />
  <Typography role="status">{result}</Typography>
</Stack>`;
 return <Example title="Controlled server criteria and responses" description="One host criteria owner accepts the shell's combined page/search/sort/filter/selection transaction; criteria changes reset page zero before querying. A bounded local promise models server processing. Search fail for rejection/retry; quickly replace Course 01 with Course 02 to exercise late-response rejection. The freshness guard protects success, error and pending state after changes/unmount. Production hosts translate criteria into their server contract and may additionally abort transport work." source={exampleSource({name:'ServerCourseView',imports:[...imports,"import {useEffect} from 'react';"],state,body})}>
  <Stack gap={3}><AppDataGridShell label="Server course search" mode="server" rows={response.rows} rowCount={response.total} columns={columns} getRowLabel={row=>row.name} loading={loading} errorMessage={error} onRetry={()=>setRetry(value=>value+1)} paginationModel={criteria.paginationModel} searchValue={criteria.searchValue} sortRules={criteria.sortRules} filterRules={criteria.filterRules} selection={{selectedRowIds:criteria.selectedRowIds}} onStateChange={next=>{setCriteria(next);setRetry(0);}} pageSizeOptions={[5,10]} filterFields={fields} toolbar={{showRefreshButton:true,onRefresh:()=>setRetry(value=>value+1)}} showResetView defaultPaginationModel={{page:0,pageSize:5}} style={{height:420}}/><Typography role="status">{result}</Typography></Stack>
 </Example>;
}
