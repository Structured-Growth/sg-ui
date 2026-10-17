import {useState} from 'react';
import {AppDataGrid,AppDataGridShell,RowSubHeader,createActionMenuColumn,parseFilterRuleValues,type AppDataGridColumn,type AppDataGridRowDragReorderParams,type DataToolbarFilterRule} from '@structured-growth/sg-ui/components';
import {Button,Typography} from '@structured-growth/sg-ui/experimental';
type SectionRow={id:string;moduleId:string;kind:'module'|'activity';name:string;description:string;status:string;duration:string};
const seed:SectionRow[]=[
 {id:'module-1',moduleId:'module-1',kind:'module',name:'Flight principles',description:'Core aerodynamic concepts',status:'',duration:''},
 {id:'lift',moduleId:'module-1',kind:'activity',name:'Lift and drag',description:'Identify forces',status:'ready',duration:'12 min'},
 {id:'stable',moduleId:'module-1',kind:'activity',name:'Stable flight',description:'Practice flight decisions',status:'draft',duration:'Simulation'},
 {id:'module-2',moduleId:'module-2',kind:'module',name:'Safety and operations',description:'Checklist and readiness',status:'',duration:''},
 {id:'checklist',moduleId:'module-2',kind:'activity',name:'Pre-flight checklist',description:'Run the complete checklist',status:'ready',duration:'8 min'},
 {id:'incident',moduleId:'module-2',kind:'activity',name:'Incident scenarios',description:'Respond to incidents',status:'archived',duration:'Case study'},
];
const fields=[{id:'status',label:'Status',type:'enum' as const,enumOptions:['ready','draft','archived'].map(id=>({id,label:id}))}];
/** Private successor of the original sectioned grid scenarios. The host owns
 * hierarchy visibility, accepted order, selection and criteria; no persistence. */
export function SectionedRows({shell=false,utilities=false}:{shell?:boolean;utilities?:boolean}) {
 const [rows,setRows]=useState(seed);
 const [collapsed,setCollapsed]=useState(new Set<string>());
 const [selected,setSelected]=useState(new Set(utilities?['lift']:[]));
 const [search,setSearch]=useState('');
 const [filters,setFilters]=useState<DataToolbarFilterRule[]>([]);
 const statuses=new Set(filters.filter(rule=>rule.field==='status'&&rule.operator==='is').flatMap(rule=>parseFilterRuleValues(rule.value)));
 const visible=rows.filter(row=>(row.kind==='module'||!collapsed.has(row.moduleId))
  && (!search||`${row.name} ${row.description}`.toLowerCase().includes(search.toLowerCase()))
  && (row.kind==='module'||!statuses.size||statuses.has(row.status)));
 const columns:AppDataGridColumn<SectionRow>[]=[
  {field:'name',headerName:'Module / activity',flex:1,minWidth:240,sortable:false,cellType:'custom',renderCustomCell:row=>row.kind==='module'
   ? <RowSubHeader title={row.name} expanded={!collapsed.has(row.moduleId)} onToggle={()=>setCollapsed(previous=>{const next=new Set(previous);if(next.has(row.moduleId))next.delete(row.moduleId);else next.add(row.moduleId);return next;})}/>
   : <Typography as="span" variant="body2">{row.name}</Typography>},
  {field:'description',headerName:'Description',flex:1,minWidth:180},
  {field:'status',headerName:'Status',width:120},
  {field:'duration',headerName:'Duration',width:140},
  createActionMenuColumn<SectionRow>({getMenuActions:row=>[{id:'open',label:row.kind==='module'?'Open module':'Open activity',href:row.kind==='module'?`/modules/${row.moduleId}`:`/activities/${row.id}`}]}),
 ];
 const reorder=({sourceRowId,targetRowId,position}:AppDataGridRowDragReorderParams<SectionRow>)=>setRows(previous=>{
  const source=previous.find(row=>row.id===sourceRowId);if(!source||source.kind!=='activity')return previous;
  const next=previous.filter(row=>row.id!==sourceRowId),index=next.findIndex(row=>row.id===targetRowId);if(index<0)return previous;
  next.splice(index+(position==='after'?1:0),0,source);return next;
 });
 // Full visible client order supports reorder. While host criteria are active,
 // pass the host-filtered section records through without filtering headers twice.
 const mode:'client'|'server'=search||filters.length?'server':'client';
 const props={label:'Sectioned courses',rows:visible,columns,getRowLabel:(row:SectionRow)=>row.name,mode,rowCount:visible.length,
  selection:utilities?{selectedRowIds:selected,onSelectedRowIdsChange:setSelected}:false,
  rowDrag:utilities?{getRowLabel:(row:SectionRow)=>row.name,isRowDraggable:(row:SectionRow)=>row.kind==='activity',onReorder:reorder}:undefined,
  defaultPaginationModel:{page:0,pageSize:25},pageSizeOptions:[25]};
 return shell?<AppDataGridShell {...props} searchValue={search} onSearchChange={setSearch} filterRules={filters} onFilterRulesChange={setFilters}
  toolbar={{filterFields:fields,showSortButton:false,leftContentWhenSelected:<Button onPress={()=>setSelected(new Set())}>Clear selection</Button>,onRefresh:()=>{setRows(seed);setCollapsed(new Set());setSelected(new Set());setSearch('');setFilters([]);}}}/>
  :<AppDataGrid {...props} hideFooter/>;
}
