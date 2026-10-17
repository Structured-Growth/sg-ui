// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeSelector,type DateRangeSelectorProps} from './DateRangeSelector';
import {resolveRangeDrag} from './RangeGestures';
import {isDateRangeAllowed} from './date-contract';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('validates inclusive days, nights and endpoint-aware restrictions through one contract',()=>{
 const range={start:'2026-10-07',end:'2026-10-08'};
 expect(isDateRangeAllowed(range,{rangeLength:{mode:'fixed',value:2,unit:'days'}})).toBe(true);
 expect(isDateRangeAllowed(range,{rangeLength:{mode:'fixed',value:2,unit:'nights'}})).toBe(false);
 expect(isDateRangeAllowed(range,{rangeLength:{mode:'bounded',min:2,max:4,unit:'days'}})).toBe(true);
 expect(isDateRangeAllowed(range,{getDateUnavailableReason:(date,context)=>date===range.end&&context.endpoint==='end'?'Departure closed':undefined})).toBe(false);
 expect(isDateRangeAllowed(range,{rangeLength:{mode:'bounded',min:4,max:2,unit:'days'}})).toBe(false);
 expect(isDateRangeAllowed({start:range.start,end:range.start},{getDateUnavailableReason:(_date,context)=>context.endpoint==='end'?'Departure closed':undefined})).toBe(false);
});

it.each([
 ['read-only',{readOnly:true}],
 ['drag mode',{rangeDragBehavior:'none'}],
 ['range length',{rangeLength:{mode:'fixed',value:3,unit:'days'}}],
] as const)('cancels a pending gesture after the host changes %s',(_name,updated)=>{
 const change=vi.fn(),props:DateRangeSelectorProps={label:'Trip',months:1,defaultValue:{start:'2026-10-07',end:'2026-10-09'},commitBehavior:'immediate',onValueChange:change};
 const {container,rerender}=render(<DateRangeSelector showFields {...props}/>),p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  rerender(<DateRangeSelector showFields {...props} {...updated}/>);
  fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/09/2026');
 }finally{p.restore();}
});

it.each(['escape','pointercancel','outside'] as const)('rolls back %s and allows the next independent drag',cancel=>{
 const change=vi.fn();
 const {container}=render(<DateRangeSelector showFields label="Trip" months={1} defaultValue={{start:'2026-10-07',end:'2026-10-09'}} commitBehavior="immediate" onValueChange={change}/>),p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  if(cancel==='escape')fireEvent.keyDown(document,{key:'Escape'});
  if(cancel==='pointercancel')fireEvent.pointerCancel(document,p.event);
  if(cancel==='outside')p.hit.mockReturnValue(document.body);
  fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/09/2026');
  p.hit.mockImplementation(()=>p.cell('2026-10-11'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:60});fireEvent.pointerUp(document,{...p.event,clientX:60});
  expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-07',end:'2026-10-11'});
 }finally{p.restore();}
});

it('ignores another pointer releasing or cancelling the active gesture',()=>{
 const change=vi.fn();
 const {container}=render(<DateRangeSelector showFields label="Trip" months={1} defaultValue={{start:'2026-10-07',end:'2026-10-09'}} commitBehavior="immediate" onValueChange={change}/>),p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  fireEvent.pointerDown(p.cell('2026-10-08'),{...p.event,pointerId:99});
  fireEvent.pointerMove(document,{...p.event,pointerId:99,clientX:90});
  fireEvent.pointerUp(document,{...p.event,pointerId:99,clientX:90});
  fireEvent.pointerCancel(document,{...p.event,pointerId:99});
  expect(change).not.toHaveBeenCalled();
  fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-07',end:'2026-10-12'});
 }finally{p.restore();}
});

it.each([
 ['move','2026-10-09','2026-10-12',{start:'2026-10-10',end:'2026-10-12'}],
 ['resize','2026-10-08','2026-10-12',null],
 ['resize','2026-10-09','2026-10-12',{start:'2026-10-07',end:'2026-10-12'}],
] as const)('%s mode applies only its supported operation from %s',(mode,grabbed,destination,expected)=>{
 const change=vi.fn();
 const {container}=render(<DateRangeSelector showFields label="Trip" months={1} rangeDragBehavior={mode} defaultValue={{start:'2026-10-07',end:'2026-10-09'}} commitBehavior="immediate" onValueChange={change}/>),p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell(destination));
  fireEvent.pointerDown(p.cell(grabbed),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});fireEvent.pointerUp(document,{...p.event,clientX:50});
  if(expected)expect(change).toHaveBeenCalledExactlyOnceWith(expected);else expect(change).not.toHaveBeenCalled();
 }finally{p.restore();}
});
it('fixed length completes on one activation, keyboard moves preserve length, invalid moves keep the draft',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateRangeSelector showFields label="Trip" months={1} entryMode="text" defaultFocusedDate="2026-10-01" rangeLength={{mode:'fixed',value:2,unit:'days'}} onValueChange={change} min="2026-10-01"/>);
 const day=screen.getByRole('button',{name:/October 7, 2026/});await user.click(day);
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/08/2026');
 day.focus();await user.keyboard('{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}');
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/01/2026');expect(screen.getByRole('alert').textContent).toContain('previous range');
 await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/02/2026');
 await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/03/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/04/2026');
 await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-03',end:'2026-10-04'});
});
it('active endpoint controls allow a departure but block arrival under distinct rules',async()=>{
 const user=userEvent.setup();
 render(<DateRangeSelector showFields label="Trip" months={1} entryMode="text" rangeClickBehavior="active-endpoint" defaultValue={{start:'2026-10-07',end:'2026-10-16'}} getDateUnavailableReason={(date,ctx)=>date==='2026-10-13'&&ctx.endpoint==='start'?'No arrivals':undefined}/>);
 await user.click(screen.getByRole('button',{name:'Start date',exact:true}));
 expect(screen.getByRole('button',{name:/Tuesday, October 13, 2026/}).getAttribute('aria-disabled')).toBe('true');
 await user.click(screen.getByRole('button',{name:'End date',exact:true}));
 await user.click(screen.getByRole('button',{name:/Tuesday, October 13, 2026/}));
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/13/2026');
});

it('resizes whole endpoint days and pushes the opposite boundary at duration limits',()=>{
 const range={start:'2026-10-07',end:'2026-10-09'};
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end')).toEqual({start:'2026-10-07',end:'2026-10-12'});
 expect(resolveRangeDrag(range,range.start,'2026-10-05','start')).toEqual({start:'2026-10-05',end:'2026-10-09'});
 expect(resolveRangeDrag(range,'2026-10-08','2026-10-13','move')).toEqual({start:'2026-10-12',end:'2026-10-14'});
 const fixed={mode:'fixed',value:3,unit:'days'} as const;
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end',fixed)).toEqual({start:'2026-10-10',end:'2026-10-12'});
 expect(resolveRangeDrag(range,range.start,'2026-10-05','start',fixed)).toEqual({start:'2026-10-05',end:'2026-10-07'});
 const bounded={mode:'bounded',min:2,max:3,unit:'days'} as const;
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end',bounded)).toEqual({start:'2026-10-10',end:'2026-10-12'});
 expect(resolveRangeDrag(range,range.start,'2026-10-05','start',bounded)).toEqual({start:'2026-10-05',end:'2026-10-07'});
 expect(resolveRangeDrag(range,range.end,'2026-10-08','end',bounded)).toEqual({start:'2026-10-07',end:'2026-10-08'});
 expect(resolveRangeDrag(range,range.end,'2026-10-06','end',bounded)).toEqual({start:'2026-10-05',end:'2026-10-06'});
 expect(resolveRangeDrag(range,range.start,'2026-10-10','start',bounded)).toEqual({start:'2026-10-10',end:'2026-10-11'});
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end',{...bounded,min:3})).toEqual({start:'2026-10-10',end:'2026-10-12'});
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end',{...bounded,min:2,max:3,unit:'nights'})).toEqual({start:'2026-10-09',end:'2026-10-12'});
 const single={start:'2026-10-07',end:'2026-10-07'};
 expect(resolveRangeDrag(single,single.start,'2026-10-05','either')).toEqual({start:'2026-10-05',end:'2026-10-07'});
 expect(resolveRangeDrag(single,single.start,'2026-10-09','either')).toEqual({start:'2026-10-07',end:'2026-10-09'});
 expect(resolveRangeDrag({start:'2028-02-28',end:'2028-03-01'},'2028-03-01','2028-03-03','end',fixed)).toEqual({start:'2028-03-01',end:'2028-03-03'});
 expect(resolveRangeDrag(range,range.end,'2026-10-12','end',{...bounded,min:4})).toBeNull();
});

function pointerSetup(container:HTMLElement){
 class TestPointerEvent extends MouseEvent {readonly pointerId:number;constructor(type:string,init:PointerEventInit={}){super(type,init);this.pointerId=init.pointerId??1;}}
 vi.stubGlobal('PointerEvent',TestPointerEvent);
 const cell=(date:string)=>container.querySelector<HTMLElement>(`[data-sgui-date="${date}"]`)!;
 const hit=vi.fn<(x:number,y:number)=>Element|null>();
 const previous=document.elementFromPoint;
 document.elementFromPoint=hit;
 return {cell,hit,restore:()=>{document.elementFromPoint=previous;},event:{pointerId:31,button:0,clientX:10,clientY:10}};
}
it('uses the release position rather than a stale preview and commits only once',()=>{
 const change=vi.fn();
 const {container}=render(<DateRangeSelector showFields label="Trip" months={1} defaultValue={{start:'2026-10-07',end:'2026-10-09'}} commitBehavior="immediate" onValueChange={change}/>);
 const p=pointerSetup(container);
 try{
  p.hit.mockImplementation(x=>p.cell(x>=70?'2026-10-13':'2026-10-11'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);
  fireEvent.pointerMove(document,{...p.event,clientX:50});expect(change).not.toHaveBeenCalled();
  fireEvent.pointerUp(document,{...p.event,clientX:70});
  expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-07',end:'2026-10-13'});
 }finally{p.restore();}
});
it('checks new availability when the host changes it during a drag',()=>{
 const change=vi.fn(),initial={start:'2026-10-07',end:'2026-10-09'};
 const {container,rerender}=render(<DateRangeSelector showFields label="Trip" months={1} defaultValue={initial} commitBehavior="immediate" onValueChange={change}/>);
 const p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  rerender(<DateRangeSelector showFields label="Trip" months={1} defaultValue={initial} commitBehavior="immediate" onValueChange={change} unavailable={[{date:'2026-10-12',reason:'Just booked'}]}/>);
  fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).not.toHaveBeenCalled();expect(screen.getByRole('alert').textContent).toContain('previous range');
  expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/09/2026');
 }finally{p.restore();}
});
it('cancels when disabled mid-drag, then allows a new gesture after re-enabling',()=>{
 const change=vi.fn(),initial={start:'2026-10-07',end:'2026-10-09'};
 const props={label:'Trip',months:1 as const,defaultValue:initial,commitBehavior:'immediate' as const,onValueChange:change};
 const {container,rerender}=render(<DateRangeSelector showFields {...props}/>);
 const p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  rerender(<DateRangeSelector showFields {...props} disabled/>);
  fireEvent.pointerUp(document,{...p.event,clientX:50});expect(change).not.toHaveBeenCalled();
  rerender(<DateRangeSelector showFields {...props}/>);
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-07',end:'2026-10-12'});
 }finally{p.restore();}
});
it('keeps a new host value when it replaces the range during a drag',()=>{
 const change=vi.fn(),initial={start:'2026-10-07',end:'2026-10-09'};
 const {container,rerender}=render(<DateRangeSelector showFields label="Trip" months={1} value={initial} commitBehavior="immediate" onValueChange={change}/>);
 const p=pointerSetup(container);
 try{
  p.hit.mockImplementation(()=>p.cell('2026-10-12'));
  fireEvent.pointerDown(p.cell('2026-10-09'),p.event);fireEvent.pointerMove(document,{...p.event,clientX:50});
  rerender(<DateRangeSelector showFields label="Trip" months={1} value={{start:'2026-10-20',end:'2026-10-22'}} commitBehavior="immediate" onValueChange={change}/>);
  fireEvent.pointerUp(document,{...p.event,clientX:50});
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/20/2026');
  expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/22/2026');
 }finally{p.restore();}
});
