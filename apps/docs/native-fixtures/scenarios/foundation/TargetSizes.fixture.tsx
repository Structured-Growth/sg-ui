import {useState,type ReactNode} from 'react';
import type {Meta,StoryObj} from '../../types';
import {Provider} from '@structured-growth/sg-ui/theme';
import {TextColorPickerControl,DataToolbarSelectionMenu,ContentEditorChrome,AppDataGrid,IconPanelNavigation} from '@structured-growth/sg-ui/components';
import {Checkbox,RadioGroup,Calendar,PeriodPicker,DateRangeSelector,Link,DataGrid,type DateRange} from '@structured-growth/sg-ui/experimental';
const meta={title:'Acceptance/Target sizes'} satisfies Meta;export default meta;type Story=StoryObj<typeof meta>;
const modes=[['pointer','compact'],['auto','compact'],['touch','comfortable']] as const;
function Scopes({children}:{children:()=>ReactNode}){return <>{modes.map(([mode,density])=><Provider key={mode} interactionMode={mode} density={density} theme="light" data-testid={`target-${mode}`} style={{boxSizing:'border-box',width:'50rem',maxWidth:'100%',padding:'var(--sgui-space4)',marginBlockEnd:'var(--sgui-space4)',background:'var(--sgui-surface)',color:'var(--sgui-text)'}}>{children()}</Provider>)}</>}
function Color(){const [color,setColor]=useState('var(--sgui-action)');return <TextColorPickerControl value={color} onChange={setColor}/>}
export const ColorTargets:Story={render:()=> <Scopes>{()=> <Color/>}</Scopes>};
const rows=[{id:'one',name:'Course',score:20}];
function Grid({kind}:{kind:'proof'|'catalog'}){return <div data-testid={`grid-${kind}`} style={{height:'30rem'}}>{kind==='proof'?<DataGrid label="Proof courses" rows={rows} getRowId={r=>r.id} getRowLabel={r=>r.name} columns={[{id:'name',label:'Name',minWidth:120,getValue:r=>r.name},{id:'score',label:'Score',width:200,minWidth:120,maxWidth:300,getValue:r=>r.score}]}/>:<AppDataGrid label="Catalog courses" rows={rows} getRowLabel={r=>r.name} selection columns={[{field:'name',headerName:'Name',minWidth:120,flex:1},{field:'score',headerName:'Score',width:200,minWidth:120,maxWidth:300}]} />}</div>}
function Labels(){const [selected,setSelected]=useState(false),[commands,setCommands]=useState(0);return <div style={{display:'grid',gap:'var(--sgui-space4)'}}>
 <div data-testid="bulk"><DataToolbarSelectionMenu selectionState={selected?'all':'none'} onToggleSelection={()=>setSelected(v=>!v)} options={[{id:'clear',label:'Clear selection'}]} onSelectOption={()=>setSelected(false)}/></div>
 <div data-testid="short-check"><Checkbox label="A"/></div><RadioGroup label="Letter" orientation="horizontal" options={[{value:'a',label:'A'},{value:'b',label:'B'}]}/>
 <ContentEditorChrome icon={<span aria-hidden="true">◆</span>} title="Target document" titleReadOnly onTitleSave={()=>{}} menuItems={[{id:'go',label:'Go',onPress:anchor=>{if(anchor.tagName==='BUTTON')setCommands(n=>n+1)}}]} rightSlot={<span role="status">{commands?'Command complete':'Ready'}</span>}/>
 <Grid kind="catalog"/>
 </div>}
export const LabelTargets:Story={render:()=> <Scopes>{()=> <Labels/>}</Scopes>};
function Dates(){const [quarter,setQuarter]=useState<DateRange|null>({start:'2026-10-01',end:'2026-12-31'});return <div style={{display:'grid',gap:'var(--sgui-space4)'}}>
 <div data-testid="calendar"><Calendar label="Target calendar" defaultValue="2026-10-07" defaultFocusedDate="2026-10-07" navigation="arrows"/></div>
 <form aria-label="Quarter target form"><PeriodPicker label="Quarter target" display="inline" unit="quarter" name="quarter" value={quarter} onValueChange={setQuarter} referenceDate="2026-10-16"/></form>
 <div data-testid="range"><DateRangeSelector label="Target range" months={1} rangeClickBehavior="active-endpoint" defaultValue={{start:'2026-10-07',end:'2026-10-09'}}/></div>
 <p data-testid="prose">Read the <Link href="#target-note" external underline="none">note</Link> in this sentence.</p><p id="target-note">Target note</p>
 </div>}
export const DateTargets:Story={render:()=> <Scopes>{()=> <Dates/>}</Scopes>};
function Resizes(){return <div style={{display:'grid',gap:'var(--sgui-space4)'}}><Grid kind="proof"/><Grid kind="catalog"/>
 <div data-testid="shelf" style={{height:'25rem',width:'100%'}}><IconPanelNavigation aria-label="Target shelf" defaultActiveId="notes" resizable panelWidth={320} minPanelWidth={300} maxPanelWidth={340} items={[{id:'notes',label:'Notes',icon:<span aria-hidden="true">N</span>,content:'Host notes'}]}/></div>
 </div>}
export const ResizeTargets:Story={render:()=> <Scopes>{()=> <Resizes/>}</Scopes>};
