// Source-context counterparts of the docs-owned section/server fixtures.
// Unit checks run before dist exists; native docs continue using public exports.
import {useEffect,useRef,useState} from 'react';
import {AppDataGrid} from './AppDataGrid';
import {AppDataGridShell} from '../AppDataGridShell/AppDataGridShell';
import {RowSubHeader} from './components/RowSubHeader';
import {createActionMenuColumn} from './createActionMenuColumn';
import {parseFilterRuleValues} from '../DataToolbar/filterRuleValue';
import type {AppDataGridColumn,AppDataGridRowDragReorderParams} from './types';
import type {DataToolbarFilterRule} from '../DataToolbar/components/DataToolbarFilterMenu';
import type {OwnedGridCriteriaState} from './ownedGridState';
import {Button} from '../Button/Button';
import {Typography} from '../../experimental/Typography/Typography';

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
 const reorder=({sourceRowIds,targetRowId,position}:AppDataGridRowDragReorderParams<SectionRow>)=>setRows(previous=>{
  const source=previous.filter(row=>sourceRowIds.includes(row.id));if(!source.length||source.some(row=>row.kind!=='activity'))return previous;
  const next=previous.filter(row=>!sourceRowIds.includes(row.id)),index=next.findIndex(row=>row.id===targetRowId);if(index<0)return previous;
  next.splice(index+(position==='after'?1:0),0,...source);return next;
 });
 // Full visible client order supports reorder. While host criteria are active,
 // pass the host-filtered section records through without filtering headers twice.
 const mode:'client'|'server'=search||filters.length?'server':'client';
 const props={label:'Sectioned courses',rows:visible,columns,getRowLabel:(row:SectionRow)=>row.name,mode,rowCount:visible.length,
  selection:utilities?{selectedRowIds:selected,onSelectedRowIdsChange:setSelected}:false,
  rowDrag:utilities?{showMoveButtons:true,getRowLabel:(row:SectionRow)=>row.name,isRowDraggable:(row:SectionRow)=>row.kind==='activity',onReorder:reorder}:undefined,
  defaultPaginationModel:{page:0,pageSize:25},pageSizeOptions:[25]};
 return shell?<AppDataGridShell {...props} searchValue={search} onSearchChange={setSearch} filterRules={filters} onFilterRulesChange={setFilters}
  toolbar={{filterFields:fields,showSortButton:false,leftContentWhenSelected:<Button onPress={()=>setSelected(new Set())}>Clear selection</Button>,onRefresh:()=>{setRows(seed);setCollapsed(new Set());setSelected(new Set());setSearch('');setFilters([]);}}}/>
  :<AppDataGrid {...props} hideFooter/>;
}

type Course = { id: string; name: string; status: "active" | "archived"; score: number };
const rows: Course[] = Array.from({ length: 58 }, (_, index) => ({ id: `course-${index + 1}`, name: `Course ${index + 1}`,
  status: index % 3 ? "active" : "archived", score: 100 - index }));
const columns: AppDataGridColumn<Course>[] = [
  { field: "name", headerName: "Course", flex: 2, minWidth: 200 },
  { field: "status", headerName: "Status", width: 150, filterType: "enum" },
  { field: "score", headerName: "Score", flex: 1, minWidth: 100, filterType: "number" },
];
const serverRows = rows.map(row => ({ ...row, email: `${row.id}@example.test` }));

function ServerPreview({ debounced = false }: { debounced?: boolean }) {
  const [request, setRequest] = useState<OwnedGridCriteriaState>({ paginationModel: { page: 0, pageSize: debounced ? 5 : 10 }, sortRules: debounced ? [{ field: "name", direction: "asc" }] : [],
    filterRules: [], searchValue: "", selectedRowIds: new Set() });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!debounced) return;
    const timer = window.setTimeout(() => setDebouncedSearch(request.searchValue), 250);
    return () => window.clearTimeout(timer);
  }, [debounced, request.searchValue]);
  const query = debounced ? debouncedSearch : request.searchValue;
  const serverSort = debounced ? request.sortRules : undefined;
  const [loaded, setLoaded] = useState<Course[]>([]);
  const [pending, setPending] = useState(false);
  const latest = useRef(0);
  useEffect(() => {
    const identity = ++latest.current;
    setPending(true);
    // This simulates host work. A slower older request cannot replace new rows.
    const timer = window.setTimeout(() => {
      if (identity !== latest.current) return;
      const matching = (serverSort ? serverRows : rows).filter(row => row.name.toLowerCase().includes(query.toLowerCase()) ||
        ("email" in row && String(row.email).toLowerCase().includes(query.toLowerCase())));
      if (serverSort) matching.sort((a, b) => {
        for (const rule of serverSort) {
          const field = rule.field as keyof Course;
          const left = a[field], right = b[field];
          const comparison = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
          if (comparison) return rule.direction === "desc" ? -comparison : comparison;
        }
        return 0;
      });
      const start = request.paginationModel.page * request.paginationModel.pageSize;
      setLoaded(matching.slice(start, start + request.paginationModel.pageSize)); setTotal(matching.length);
      setPending(false);
    }, query.length % 2 ? 600 : 150);
    return () => { window.clearTimeout(timer); };
  }, [request.paginationModel, query, serverSort]);
  return <AppDataGridShell label="Server courses" rows={loaded} columns={columns} getRowLabel={row => row.name}
    mode="server" paginationModel={request.paginationModel} searchValue={request.searchValue} sortRules={serverSort} pageSizeOptions={debounced ? [5, 10] : [10]}
    hasNextPage={loaded.length === request.paginationModel.pageSize} rowCount={debounced ? total : undefined} refreshing={pending} onStateChange={setRequest}
    view={{ cards: { renderCard: row => <article><h3>{row.name}</h3><p>{row.status}</p></article> } }}
    toolbar={{ showFilterButton: false, showSortButton: debounced }} />;
}

export function DebouncedServerSearchAndSort(){return <ServerPreview debounced/>;}
