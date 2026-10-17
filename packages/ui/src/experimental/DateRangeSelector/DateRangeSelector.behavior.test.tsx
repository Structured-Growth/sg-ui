// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeSelector,type DateRangeSelectorProps} from './DateRangeSelector';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const cases = [
 ['restart', [['05',''],['13',''],['20',''],['07',''],['16','']]],
 ['adjust-end', [['05',''],['07','13'],['07','20'],['07',''],['07','16']]],
 ['adjust-start', [['05','16'],['13','16'],['20',''],['07','16'],['16','']]],
 ['adjust-nearest', [['05','16'],['07','13'],['07','20'],['07','16'],['07','16']]],
 ['adjust-boundaries', [['05','16'],['07','13'],['07','20'],['07','07'],['07','16']]],
] as const;
it.each(cases)('%s edits completed drafts; initial selection completes in either direction',async(behavior,expected)=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<form data-testid="form"><DateRangeSelector showFields label="Dates" months={1} entryMode="text" name="trip"
   defaultValue={{start:'2026-10-07',end:'2026-10-16'}} rangeClickBehavior={behavior} onValueChange={change}/></form>);
 const start=()=> (screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value;
 const end=()=> (screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value;
 const activate=async(day:number,keyboard=false)=>{
  const button=screen.getAllByRole('button',{name:new RegExp(`October ${day}, 2026`)}).find(button=>button.textContent===String(day))!;
  if(keyboard){button.focus();await user.keyboard('{Enter}');}else await user.click(button);
 };
 for(const [i,day] of [5,13,20,7,16].entries()){
  await activate(day,i%2===1);
  expect(start(),`click ${day} in ${behavior}`).toBe(`10/${expected[i][0]}/2026`);
  expect(end()).toBe(expected[i][1]?`10/${expected[i][1]}/2026`:'');
  expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(!expected[i][1]);
  expect(change).not.toHaveBeenCalled();
  expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('trip.start')).toBe('2026-10-07');
  await user.click(screen.getByRole('button',{name:'Cancel',exact:true}));
 }
 await user.click(screen.getByRole('button',{name:'Clear',exact:true}));
 await activate(5);expect(start()).toBe('10/05/2026');expect(end()).toBe('');
 await activate(1,true);expect(start()).toBe('10/01/2026');expect(end()).toBe('10/05/2026');
 await user.click(screen.getByRole('button',{name:'Apply',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-01',end:'2026-10-05'});
});
it('defaults to adjust-nearest and keeps validation, read-only state and host replacements authoritative',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const props:DateRangeSelectorProps={label:'Dates',months:1,entryMode:'text',value:{start:'2026-10-07',end:'2026-10-16'},onValueChange:change,
 unavailable:[{date:'2026-10-18',reason:'Closed'}]};
 const {rerender}=render(<DateRangeSelector showFields {...props}/>);
 await user.click(screen.getByRole('button',{name:/October 9, 2026/}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/09/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/16/2026');
 await user.click(screen.getByRole('button',{name:'Cancel',exact:true}));
 await user.click(screen.getByRole('button',{name:/October 20, 2026/}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/07/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/20/2026');
 expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 rerender(<DateRangeSelector showFields {...props} value={{start:'2026-10-09',end:'2026-10-12'}} readOnly/>);
 await user.click(screen.getByRole('button',{name:/October 13, 2026/}));
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/12/2026');
 expect(change).not.toHaveBeenCalled();
});

it.each(['adjust-start','adjust-end','adjust-nearest'] as const)('assigns independent From/To endpoints regardless of shared %s policy',async(rangeClickBehavior)=>{
 const user=userEvent.setup(),change=vi.fn(),intent=vi.fn();
 render(<DateRangeSelector label="Trip" showFields months={2} calendarNavigation="independent" calendarEndpoints={['start','end']}
   rangeClickBehavior={rangeClickBehavior} defaultFocusedDate="2026-10-07" defaultValue={{start:'2026-10-07',end:'2026-10-16'}} onValueChange={change} onActiveEndpointChange={intent}/>);
 const day=(index:number,month:string,date:number)=>within(screen.getAllByRole('grid')[index]).getByRole('button',{name:new RegExp(`${month} ${date}, 2026`)});
 await user.click(day(0,'October',9));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/09/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/16/2026');
 await user.click(day(1,'November',5));
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('11/05/2026');
 await user.click(screen.getAllByRole('button',{name:'Previous month',exact:true})[1]);
 day(1,'October',13).focus();await user.keyboard('{Enter}');
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/09/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/13/2026');
 expect(intent.mock.calls.map(([value])=>value)).toEqual(['start','end']);
 expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole('button',{name:'Apply',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-09',end:'2026-10-13'});
});

it('can enter To first, clears only the crossed opposite endpoint, and commits only complete mapped drafts',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateRangeSelector label="Trip" showFields months={2} calendarNavigation="independent" calendarEndpoints={['start','end']}
   defaultFocusedDate="2026-10-07" commitBehavior="immediate" onValueChange={change}/>);
 const day=(index:number,month:string,date:number)=>within(screen.getAllByRole('grid')[index]).getByRole('button',{name:new RegExp(`${month} ${date}, 2026`)});
 await user.click(day(1,'November',5));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('11/05/2026');
 expect(change).not.toHaveBeenCalled();
 await user.click(day(0,'October',9));expect(change).toHaveBeenLastCalledWith({start:'2026-10-09',end:'2026-11-05'});
 await user.click(screen.getAllByRole('button',{name:'Previous month',exact:true})[1]);
 await user.click(day(1,'October',5));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/05/2026');
 expect(change).toHaveBeenCalledTimes(1);
 await user.click(day(0,'October',5));expect(change).toHaveBeenLastCalledWith({start:'2026-10-05',end:'2026-10-05'});
});

it('evaluates mapped endpoint availability separately in each independent calendar',async()=>{
 const user=userEvent.setup();
 render(<DateRangeSelector label="Trip" months={2} showFields calendarNavigation="independent" calendarEndpoints={['start','end']}
   defaultFocusedDate="2026-10-07" defaultValue={{start:'2026-10-07',end:'2026-10-16'}}
   getDateUnavailableReason={(date,context)=>context.endpoint==='start'&&date==='2026-10-13'?'No arrivals':undefined}/>);
 await user.click(screen.getAllByRole('button',{name:'Previous month',exact:true})[1]);
 const day=(index:number)=>within(screen.getAllByRole('grid')[index]).getByRole('button',{name:/October 13, 2026/});
 expect(day(0).getAttribute('aria-disabled')).toBe('true');
 expect(day(1).getAttribute('aria-disabled')).not.toBe('true');
 await user.click(day(1));
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/13/2026');
 expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(false);
});

it.each(['linked','unassigned','scroll'] as const)('preserves the shared click policy for %s calendar slots',async(mode)=>{
 const user=userEvent.setup();
 render(<DateRangeSelector label="Trip" showFields months={2} calendarNavigation={mode==='linked'?'linked':'independent'}
   rangeClickBehavior="adjust-end" calendarLayout={mode==='scroll'?'scroll':'paged'} scrollMonths={2} calendarEndpoints={mode==='unassigned'?[null,'end']:['start','end']}
   defaultFocusedDate="2026-10-07" defaultValue={{start:'2026-10-07',end:'2026-10-16'}}/>);
 await user.click(within(screen.getAllByRole('grid')[0]).getByRole('button',{name:/October 9, 2026/}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/07/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/09/2026');
});

it.each(['start','end',undefined] as const)('adjusts the nearest boundary with %s ties across month and leap-day boundaries',async(tie)=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateRangeSelector label="Nearest" showFields months={1} defaultFocusedDate="2028-03-01"
  defaultValue={{start:'2028-02-28',end:'2028-03-03'}}
  nearestEndpointTieBreak={tie} commitBehavior="immediate" onValueChange={change}/>);
 // March 1 is two civil days from each boundary in this leap year.
 const march1=screen.getByRole('button',{name:/March 1, 2028/});
 march1.focus();await user.keyboard('{Enter}');
 expect(change).toHaveBeenLastCalledWith(tie==='start'?{start:'2028-03-01',end:'2028-03-03'}:{start:'2028-02-28',end:'2028-03-01'});
});
it('uses nearest candidate intent for availability and re-evaluates it after a draft change',async()=>{
 const user=userEvent.setup();
 render(<DateRangeSelector label="Nearest" showFields months={1} defaultFocusedDate="2026-10-01"
  defaultValue={{start:'2026-10-01',end:'2026-10-15'}} rangeClickBehavior="adjust-nearest"
  getDateUnavailableReason={(date,{endpoint})=>(date==='2026-10-03'||date==='2026-10-09')&&endpoint==='start'?'No arrivals':date==='2026-10-14'&&endpoint==='end'?'No departures':undefined}/>);
 const day=(date:number)=>screen.getByRole('button',{name:new RegExp(`October ${date}, 2026`)});
 expect(day(3).getAttribute('aria-disabled')).toBe('true');
 expect(day(14).getAttribute('aria-disabled')).toBe('true');
 expect(day(4).getAttribute('aria-disabled')).not.toBe('true');
 expect(day(9).getAttribute('aria-disabled')).not.toBe('true');
 await user.click(day(4));
 expect(day(9).getAttribute('aria-disabled')).toBe('true');
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/04/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/15/2026');
});
it('extends a one-day nearest range in either direction and keeps fixed length authoritative',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const props:DateRangeSelectorProps={label:'Nearest',months:1,rangeClickBehavior:'adjust-nearest',commitBehavior:'immediate',onValueChange:change};
 const {rerender}=render(<DateRangeSelector {...props} value={{start:'2026-10-08',end:'2026-10-08'}}/>);
 await user.click(screen.getByRole('button',{name:/October 5, 2026/}));
 expect(change).toHaveBeenLastCalledWith({start:'2026-10-05',end:'2026-10-08'});
 rerender(<DateRangeSelector key="reset" {...props} value={{start:'2026-10-08',end:'2026-10-08'}}/>);
 await user.click(screen.getByRole('button',{name:/October 12, 2026/}));
 expect(change).toHaveBeenLastCalledWith({start:'2026-10-08',end:'2026-10-12'});
 rerender(<DateRangeSelector {...props} rangeLength={{mode:'fixed',value:3,unit:'days'}} value={{start:'2026-10-01',end:'2026-10-03'}}/>);
 await user.click(screen.getByRole('button',{name:/October 2, 2026/}));
 expect(change).toHaveBeenLastCalledWith({start:'2026-10-02',end:'2026-10-04'});
});

it('captures a new touch date before the previous synthesized-click fallback expires',()=>{
 class TouchPointerEvent extends MouseEvent {
  readonly pointerId:number;readonly pointerType:string;
  constructor(type:string,init:PointerEventInit={}){super(type,init);this.pointerId=init.pointerId??1;this.pointerType=init.pointerType??'touch';}
 }
 vi.stubGlobal('PointerEvent',TouchPointerEvent);
 render(<DateRangeSelector label="Rapid taps" rangeClickBehavior="adjust-end" showFields months={1} defaultValue={{start:'2026-10-07',end:'2026-10-16'}}/>);
 for(const [index,date] of [16,13].entries()){
  const target=screen.getAllByRole('button',{name:new RegExp(`October ${date}, 2026`)}).find(button=>button.textContent===String(date))!;
  // No synthetic click between these taps, matching WebKit's prevented touch-up.
  fireEvent.pointerDown(target,{pointerId:index+1,pointerType:'touch',button:0});
  fireEvent.pointerUp(target,{pointerId:index+1,pointerType:'touch',button:0});
 }
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/07/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/13/2026');
 const day=(date:number)=>screen.getAllByRole('button',{name:new RegExp(`October ${date}, 2026`)}).find(button=>button.textContent===String(date))!;
 fireEvent.pointerDown(day(5),{pointerId:3,pointerType:'touch',button:0});
 fireEvent.pointerUp(day(5),{pointerId:3,pointerType:'touch',button:0});
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('');
 // Restart left no full range for the gesture handler. Its stale suppression must
 // not consume the next native click that completes reverse-order selection.
 fireEvent.pointerDown(day(1),{pointerId:4,pointerType:'touch',button:0});
 fireEvent.pointerUp(day(1),{pointerId:4,pointerType:'touch',button:0});
 const click=new MouseEvent('click',{bubbles:true,cancelable:true,detail:1});
 fireEvent(day(1),click);
 expect(click.defaultPrevented).toBe(false);
});
