// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeSelector,type DateRangeSelectorProps} from './DateRangeSelector';
afterEach(cleanup);
const cases = [
 ['restart', [['05',''],['13',''],['20',''],['07',''],['16','']]],
 ['adjust-end', [['05',''],['07','13'],['07','20'],['07',''],['07','16']]],
 ['adjust-start', [['05','16'],['13','16'],['20',''],['07','16'],['16','']]],
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
it('defaults to adjust-end and keeps validation, read-only state and host replacements authoritative',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const props:DateRangeSelectorProps={label:'Dates',months:1,entryMode:'text',value:{start:'2026-10-07',end:'2026-10-16'},onValueChange:change,
 unavailable:[{date:'2026-10-18',reason:'Closed'}]};
 const {rerender}=render(<DateRangeSelector showFields {...props}/>);
 await user.click(screen.getByRole('button',{name:/October 20, 2026/}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/07/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/20/2026');
 expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 rerender(<DateRangeSelector showFields {...props} value={{start:'2026-10-09',end:'2026-10-12'}} readOnly/>);
 await user.click(screen.getByRole('button',{name:/October 13, 2026/}));
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/12/2026');
 expect(change).not.toHaveBeenCalled();
});

it.each(['adjust-start','adjust-end'] as const)('assigns independent From/To endpoints regardless of shared %s policy',async(rangeClickBehavior)=>{
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
   calendarLayout={mode==='scroll'?'scroll':'paged'} scrollMonths={2} calendarEndpoints={mode==='unassigned'?[null,'end']:['start','end']}
   defaultFocusedDate="2026-10-07" defaultValue={{start:'2026-10-07',end:'2026-10-16'}}/>);
 await user.click(within(screen.getAllByRole('grid')[0]).getByRole('button',{name:/October 9, 2026/}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/07/2026');
 expect((screen.getByRole('textbox',{name:'End date'}) as HTMLInputElement).value).toBe('10/09/2026');
});
