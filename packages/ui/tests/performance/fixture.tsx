import React, {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider,DataGrid,AsyncMultiSelect,defaultGridState,type GridState,type MultiSelectOption} from '@structured-growth/sg-ui/experimental';
import '@structured-growth/sg-ui/styles.css';
// Test host only. Production imports use public compiled entry points.
type Sample={action:string;ms:number};
declare global {interface Window {sguiPerf:{samples:Sample[];ready:boolean;updating:boolean;unmount:()=>void}}}
const params=new URLSearchParams(location.search);
const configurations={small:[1000,2,50],wide:[10000,20,50],largePage:[10000,20,200],selector:[2000,0,0]} as const;
const workload=(params.get('workload')??'small') as keyof typeof configurations;
if(!(workload in configurations))throw Error('Unknown workload');
const [count,columnCount,pageSize]=configurations[workload];
const started=performance.now();
const root=createRoot(document.getElementById('root')!);
window.sguiPerf={samples:[],ready:false,updating:false,unmount:()=>root.unmount()};
function Fixture(){
  const [rows,setRows]=useState(()=>Array.from({length:count},(_,id)=>({id:String(id),name:`Course ${id}`,count:id})));
  const columns=useMemo(()=>Array.from({length:columnCount},(_,index)=>({id:index===0?'name':`count${index}`,label:index===0?'Name':`Count ${index}`,getValue:(row:typeof rows[number])=>index===0?row.name:row.count+index})),[]);
  const [state,setState]=useState<GridState>({...defaultGridState,pageSize});
  const [query,setQuery]=useState('');const [selected,setSelected]=useState<MultiSelectOption[]>([]);
  const [running,setRunning]=useState(false);
  const pending=useRef<{action:string;start:number}|null>({action:'initial',start:started});
  const frames=useRef(new Set<number>());
  const mark=(action:string)=>{pending.current={action,start:performance.now()};};
  useLayoutEffect(()=>{
    const sample=pending.current;if(!sample)return;pending.current=null;
    const first=requestAnimationFrame(()=>{frames.current.delete(first);const second=requestAnimationFrame(()=>{
      frames.current.delete(second);window.sguiPerf.samples.push({action:sample.action,ms:performance.now()-sample.start});window.sguiPerf.ready=true;
    });frames.current.add(second);});frames.current.add(first);
  },[rows,state,query,selected]);
  useEffect(()=>()=>{frames.current.forEach(cancelAnimationFrame);frames.current.clear();},[]);
  useEffect(()=>{
    if(!running)return;window.sguiPerf.updating=true;let tick=0;
    const timer=setInterval(()=>{mark('update');setRows(old=>old.map((row,index)=>index<10?{...row,count:row.count+1}:row));
      if(++tick===50){clearInterval(timer);window.sguiPerf.updating=false;setRunning(false);}},100);
    return()=>{clearInterval(timer);window.sguiPerf.updating=false;};
  },[running]);
  const options=useMemo(()=>rows.filter(row=>row.name.toLowerCase().includes(query.toLowerCase())).map(row=>({id:row.id,label:row.name})),[rows,query]);
  return <Provider><main onInputCapture={()=>mark('input')} onClickCapture={event=>{const target=event.target as HTMLElement;const button=target.closest('button');mark(button?.getAttribute('aria-label')?.startsWith('Sort ')?'sort':target.closest('[role=option],label')?'selection':'click');}}>
    <button onClick={()=>setRunning(true)} disabled={running}>Run 50 updates</button>
    {workload==='selector'?<AsyncMultiSelect label="Courses" query={query} onQueryChange={setQuery} options={options} value={selected} onValueChange={setSelected}/>
      :<DataGrid label="Courses" rows={rows} columns={columns} getRowId={row=>row.id} getRowLabel={row=>row.name} state={state} onStateChange={setState}/>}
  </main></Provider>;
}
root.render(<Fixture/>);
