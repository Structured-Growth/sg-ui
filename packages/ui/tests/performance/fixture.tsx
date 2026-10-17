import React, {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider,DataGrid,AsyncMultiSelect,defaultGridState,type GridState,type MultiSelectOption} from '@structured-growth/sg-ui/experimental';
import {AppDataGrid} from '@structured-growth/sg-ui/components/AppDataGrid';
import {TextField} from '@structured-growth/sg-ui/experimental';
import '@structured-growth/sg-ui/styles.css';
// Test host only. Production imports use public compiled entry points.
type Sample={action:string;ms:number;duringUpdates:boolean};
declare global {interface Window {sguiPerf:{samples:Sample[];ready:boolean;updating:boolean;lifecycle:{mounted:boolean;pendingFrames:number;activeTimers:number};unmount:()=>void;mount:()=>void}}}
const params=new URLSearchParams(location.search);
const configurations={small:[1000,2,50],wide:[10000,20,50],largePage:[10000,20,200],selector:[2000,0,0]} as const;
const workload=(params.get('workload')??'small') as keyof typeof configurations;
if(!(workload in configurations))throw Error('Unknown workload');
const [count,columnCount,pageSize]=configurations[workload];
const renderer=params.get('renderer')??'processing';
if(!['processing','catalog'].includes(renderer)||renderer==='catalog'&&workload==='selector')throw Error('Unsupported renderer/workload');
let started=performance.now();
let root:ReturnType<typeof createRoot>|null=null;
window.sguiPerf={samples:[],ready:false,updating:false,lifecycle:{mounted:false,pendingFrames:0,activeTimers:0},
  mount:()=>{
    if(root)throw Error('Unmount the previous profiling owner first');
    started=performance.now();window.sguiPerf.samples=[];window.sguiPerf.ready=false;
    root=createRoot(document.getElementById('root')!);root.render(<Fixture/>);
  },
  unmount:()=>{
    root?.unmount();root=null;window.sguiPerf.ready=false;
    // Release diagnostic getter closures as well as the actual React owner.
    window.sguiPerf.lifecycle={...window.sguiPerf.lifecycle};
  }
};
function Fixture(){
  const [rows,setRows]=useState(()=>Array.from({length:count},(_,id)=>({id:String(id),name:`Course ${id}`,count:id})));
  const columns=useMemo(()=>Array.from({length:columnCount},(_,index)=>({id:index===0?'name':`count${index}`,label:index===0?'Name':`Count ${index}`,getValue:(row:typeof rows[number])=>index===0?row.name:row.count+index})),[]);
  const [state,setState]=useState<GridState>({...defaultGridState,pageSize});
  const [query,setQuery]=useState('');const [selected,setSelected]=useState<MultiSelectOption[]>([]);
  const [running,setRunning]=useState(false);
  const [revision,setRevision]=useState(0);
  const catalogColumns=useMemo(()=>columns.map(column=>({field:column.id,headerName:column.label,getCellValue:column.getValue,sortable:true})),[columns]);
  const pending=useRef<Array<{action:string;start:number;duringUpdates:boolean}>>([{action:'initial',start:started,duringUpdates:false}]);
  const frames=useRef(new Set<number>());
  const timers=useRef(new Set<ReturnType<typeof setInterval>>());
  const mounted=useRef(false);
  useLayoutEffect(()=>{mounted.current=true;window.sguiPerf.lifecycle={get mounted(){return mounted.current;},get pendingFrames(){return frames.current.size;},get activeTimers(){return timers.current.size;}};return()=>{mounted.current=false;};},[]);
  const mark=(action:string)=>{pending.current.push({action,start:performance.now(),duringUpdates:window.sguiPerf.updating});};
  useLayoutEffect(()=>{
    const samples=pending.current.splice(0);if(!samples.length)return;
    const first=requestAnimationFrame(()=>{frames.current.delete(first);const second=requestAnimationFrame(()=>{
      frames.current.delete(second);for(const sample of samples)window.sguiPerf.samples.push({action:sample.action,ms:performance.now()-sample.start,duringUpdates:sample.duringUpdates});window.sguiPerf.ready=true;
    });frames.current.add(second);});frames.current.add(first);
  },[rows,state,query,selected,revision]);
  useEffect(()=>()=>{frames.current.forEach(cancelAnimationFrame);frames.current.clear();},[]);
  useEffect(()=>{
    if(!running)return;window.sguiPerf.updating=true;let tick=0;
    const timer=setInterval(()=>{mark('update');setRows(old=>old.map((row,index)=>index<10?{...row,count:row.count+1}:row));
      if(++tick===50){clearInterval(timer);timers.current.delete(timer);window.sguiPerf.updating=false;setRunning(false);}},100);
    timers.current.add(timer);
    return()=>{clearInterval(timer);timers.current.delete(timer);window.sguiPerf.updating=false;};
  },[running]);
  const options=useMemo(()=>rows.filter(row=>row.name.toLowerCase().includes(query.toLowerCase())).map(row=>({id:row.id,label:row.name})),[rows,query]);
  return <Provider><main onInputCapture={()=>mark('input')} onClickCapture={event=>{const target=event.target as HTMLElement;const button=target.closest('button');mark(button?.getAttribute('aria-label')?.startsWith('Sort ')?'sort':target.closest('[role=option],label')?'selection':'click');}}>
    <button onClick={()=>setRunning(true)} disabled={running}>Run 50 updates</button>
    {workload==='selector'?<AsyncMultiSelect label="Courses" query={query} onQueryChange={setQuery} options={options} value={selected} onValueChange={setSelected}/>
      :renderer==='catalog'?<><TextField type="search" label="Search" value={query} onValueChange={setQuery}/><AppDataGrid label="Courses" rows={rows} columns={catalogColumns} getRowId={row=>row.id} getRowLabel={row=>row.name} searchValue={query} defaultPaginationModel={{page:0,pageSize}} pageSizeOptions={[50,200]} onStateChange={()=>setRevision(value=>value+1)}/></>
      :<DataGrid label="Courses" rows={rows} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} state={state} onStateChange={setState}/>}
  </main></Provider>;
}
window.sguiPerf.mount();
