'use client';
import {useState} from 'react';
import {AppDataGridShell,type AppDataGridColumn,type AppDataGridRowTransferParams} from '@structured-growth/sg-ui/components';
import {Stack,Typography} from '@structured-growth/sg-ui/primitives';
import {Example} from '../components/Example';
import {exampleSource} from './source';

type Course={id:string;name:string;tag:string};
const initialRows:Course[]=Array.from({length:4},(_,i)=>({id:String(i+1),name:`Course ${i+1}`,tag:'None'}));
const columns:AppDataGridColumn<Course>[]=[{field:'name',headerName:'Course',flex:1,minWidth:180,locked:true},{field:'tag',headerName:'Tag',width:140}];
const dropTargets=[{id:'priority',label:'Tag as priority',operation:'copy' as const},{id:'review',label:'Move to Review folder',operation:'move' as const}];
const transferCode=`  function transfer({sourceRowIds,targetId}:AppDataGridRowTransferParams<Course>){
    if(targetId==='priority'){
      setRows(current=>current.map(row=>sourceRowIds.includes(row.id)?{...row,tag:'Priority'}:row));
      setResult('Tagged '+sourceRowIds.length+' course(s) as Priority.');
    } else if(targetId==='review'){
      // This demo removes rows from the current view; the host saves folder membership.
      setRows(current=>current.filter(row=>!sourceRowIds.includes(row.id)));
      setSelectedRowIds(current=>new Set([...current].filter(id=>!sourceRowIds.includes(id))));
      setResult('Moved '+sourceRowIds.length+' course(s) to Review.');
    }
  }`;
export function GridTransferExample(){
 const [rows,setRows]=useState<Course[]>(()=>initialRows.map(row=>({...row})));
 const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(()=>new Set());
 const [result,setResult]=useState('');
 function transfer({sourceRowIds,targetId}:AppDataGridRowTransferParams<Course>){
  if(targetId==='priority'){
   setRows(current=>current.map(row=>sourceRowIds.includes(row.id)?{...row,tag:'Priority'}:row));
   setResult('Tagged '+sourceRowIds.length+' course(s) as Priority.');
  }else if(targetId==='review'){
   setRows(current=>current.filter(row=>!sourceRowIds.includes(row.id)));
   setSelectedRowIds(current=>new Set([...current].filter(id=>!sourceRowIds.includes(id))));
   setResult('Moved '+sourceRowIds.length+' course(s) to Review.');
  }
 }
 const body=`<Stack gap={3}>
  <AppDataGridShell label="Inbox courses" rows={rows} columns={columns} getRowLabel={row=>row.name}
    selection={{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}}
    rowDrag={{mode:'transfer',dropTargets,onDrop:transfer}}
    defaultPaginationModel={{page:0,pageSize:3}} pageSizeOptions={[3]}
    style={{height:'max-content',flex:'none'}}/>
  {result && <Typography role="status">{result}</Typography>}
</Stack>`;
 return <Example title="Drag to tag or move to a folder" description="Drag a handle onto a named target, or select rows and press its button. Tagging keeps rows in place; moving removes them from this Inbox view. Dragging a selected row transfers the selected rows on the current loaded page; dragging an unselected row transfers only that row. Sorting, search and pagination remain available. Keyboard: activate a handle with Enter, Tab to a destination, then Enter to drop; Escape cancels. Changes are local: the host owns permissions, saving folder/tag changes, errors and server-page refreshes." source={exampleSource({name:'TransferCourseRows',imports:["import {AppDataGridShell,type AppDataGridColumn,type AppDataGridRowTransferParams} from '@structured-growth/sg-ui/components';","import {Stack,Typography} from '@structured-growth/sg-ui/primitives';"],state:`  type Course={id:string;name:string;tag:string};
  const [rows,setRows]=useState<Course[]>(${JSON.stringify(rows)});
  const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(new Set(${JSON.stringify([...selectedRowIds])}));
  const [result,setResult]=useState(${JSON.stringify(result)});
  const columns:AppDataGridColumn<Course>[]=${JSON.stringify(columns)};
  const dropTargets=${JSON.stringify(dropTargets)} as const;
${transferCode}`,body})}>
  <Stack gap={3}><AppDataGridShell label="Inbox courses" rows={rows} columns={columns} getRowLabel={row=>row.name} selection={{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}} rowDrag={{mode:'transfer',dropTargets,onDrop:transfer}} defaultPaginationModel={{page:0,pageSize:3}} pageSizeOptions={[3]} style={{height:'max-content',flex:'none'}}/>{result&&<Typography role="status">{result}</Typography>}</Stack>
 </Example>;
}
