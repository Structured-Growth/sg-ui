'use client';
import {useState} from 'react';
import {AppDataGridShell,type AppDataGridColumn,type AppDataGridRowDragReorderParams} from '@structured-growth/sg-ui/components';
import {Example} from '../components/Example';
import {exampleSource} from './source';

type Course={id:string;name:string;status:string};
const initialRows:Course[]=[{id:'plan',name:'Plan the project',status:'Ready'},{id:'research',name:'Research the topic',status:'Ready'},{id:'draft',name:'Draft the proposal',status:'In progress'},{id:'review',name:'Review the proposal',status:'Pending'}];
const columns:AppDataGridColumn<Course>[]=[{field:'name',headerName:'Course',flex:1,minWidth:200,sortable:false,locked:true},{field:'status',headerName:'Status',width:140,sortable:false}];
const reorderCode=`  function reorder({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<Course>) {
    setRows(current=>{
      const source=current.filter(row=>sourceRowIds.includes(row.id));
      if(!source.length||sourceRowIds.includes(targetRowId))return current;
      const next=current.filter(row=>!sourceRowIds.includes(row.id));
      const target=next.findIndex(row=>row.id===targetRowId);
      if(target<0)return current;
      next.splice(target+(position==='after'?1:0),0,...source);
      return next;
    });
  }`;
export function GridReorderExample({selection}:{selection:boolean}){
 const [rows,setRows]=useState<Course[]>(()=>initialRows.map(row=>({...row})));
 const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(()=>new Set());
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
 const title=selection?'Checkbox selection and drag handles':'Drag handles without checkboxes';
 const label=selection?'Select and reorder courses':'Reorder courses without selection';
 const body=`<AppDataGridShell label=${JSON.stringify(label)} rows={rows} columns={columns} getRowLabel={row=>row.name}
  selection={${selection?'{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}':'false'}} rowDrag={{onReorder:reorder}} defaultPaginationModel={{page:0,pageSize:10}} pageSizeOptions={[10]}
  toolbar={{showSortButton:false,showSearchButton:false,showFilterButton:false,showRefreshButton:false}} style={{height:"max-content",flex:"none"}} />`;
 return <Example title={title} description={`Drag a grabber to move a row. Handles also support keyboard dragging. All four rows stay on one unfiltered, unsorted page. ${selection?'Drag a selected row to move all selected rows together in their current order; dragging an unselected row moves only that row. ':''}This example accepts order changes locally; the host owns saving the order.`} source={exampleSource({name:selection?'SelectionAndReorder':'HandleOnlyReorder',imports:["import {AppDataGridShell,type AppDataGridColumn,type AppDataGridRowDragReorderParams} from '@structured-growth/sg-ui/components';"],state:`  type Course={id:string;name:string;status:string};\n  const [rows,setRows]=useState<Course[]>(${JSON.stringify(rows)});\n${selection?`  const [selectedRowIds,setSelectedRowIds]=useState<Set<string>>(new Set(${JSON.stringify([...selectedRowIds])}));\n`:''}  const columns:AppDataGridColumn<Course>[]=${JSON.stringify(columns)};\n${reorderCode}`,body})}>
  <AppDataGridShell label={label} rows={rows} columns={columns} getRowLabel={row=>row.name} selection={selection?{selectedRowIds,onSelectedRowIdsChange:setSelectedRowIds}:false} rowDrag={{onReorder:reorder}} defaultPaginationModel={{page:0,pageSize:10}} pageSizeOptions={[10]} toolbar={{showSortButton:false,showSearchButton:false,showFilterButton:false,showRefreshButton:false}} style={{height:"max-content",flex:"none"}}/>
 </Example>;
}
