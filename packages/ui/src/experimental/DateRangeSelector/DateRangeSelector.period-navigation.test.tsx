// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeSelector} from './DateRangeSelector';
import {DateRangePicker} from '../DateRangePicker/DateRangePicker';
afterEach(cleanup);
it('shares linked month choices and preserves complete drafts until a day is chosen',async()=>{
 const user=userEvent.setup(),change=vi.fn(),draft=vi.fn();render(<DateRangeSelector label="Trip" calendarNavigation="linked" defaultValue={{start:'2026-10-07',end:'2026-10-16'}} defaultFocusedDate="2026-10-07" onValueChange={change} onDraftChange={draft}/>);
 draft.mockClear();await user.click(screen.getByRole('button',{name:'Choose month, October'}));
 expect(screen.getByRole('group',{name:'Month choices'})).toBeTruthy();await user.click(screen.getByRole('button',{name:'December',exact:true}));
 expect(screen.queryByRole('group',{name:'Choose month',exact:true})).toBeNull();expect(screen.getByRole('button',{name:'Choose month, December'})).toBe(document.activeElement);
 expect(screen.getByRole('button',{name:'Choose month, January'})).toBeTruthy();expect(change).not.toHaveBeenCalled();expect(draft).not.toHaveBeenCalled();
});
it('keeps independent From/To navigation isolated and uses endpoint-aware restrictions',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<DateRangeSelector label="Trip" defaultValue={{start:'2026-10-07',end:'2026-10-16'}} defaultFocusedDate="2026-10-07" calendarNavigation="independent" calendarEndpoints={['start','end']} min="2026-01-01" max="2027-12-31" onValueChange={change} getDateUnavailableReason={(date,context)=>context.endpoint==='start'&&date.startsWith('2027')?'No arrivals':undefined}/>);
 const start=within(screen.getByRole('application',{name:/^Trip, Start date, calendar 1,/})),end=within(screen.getByRole('application',{name:/^Trip, End date, calendar 2,/}));
 await user.click(start.getByRole('button',{name:'Choose year, 2026'}));expect(start.getByRole('button',{name:'2027',exact:true}).hasAttribute('disabled')).toBe(true);
 await user.click(end.getByRole('button',{name:'Choose year, 2026'}));expect(start.queryByRole('group',{name:'Choose year',exact:true})).toBeNull();await user.click(end.getByRole('button',{name:'2027',exact:true}));
 expect(start.getByRole('button',{name:'Choose month, October'})).toBeTruthy();expect(end.getByRole('button',{name:'Choose month, November'})).toBeTruthy();expect(end.getByRole('button',{name:'Choose year, 2027'})).toBe(document.activeElement);expect(change).not.toHaveBeenCalled();
});
it('forwards picker restrictions and preserves the single popup on Escape',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<DateRangePicker label="Trip" allowMonthSelection={false} min="2026-01-01" max="2027-12-31" defaultFocusedDate="2026-10-07" onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Trip'}));expect(screen.queryByRole('button',{name:/Choose month,/})).toBeNull();
 await user.click(screen.getAllByRole('button',{name:'Choose year, 2026'})[0]);expect(screen.getAllByRole('dialog')).toHaveLength(1);
 await user.keyboard('{Escape}');expect(screen.queryByRole('group',{name:'Choose year',exact:true})).toBeNull();expect(screen.getAllByRole('dialog')).toHaveLength(1);expect(change).not.toHaveBeenCalled();
});

it('defaults to independent month/year navigation without changing the range draft',async()=>{
 const user=userEvent.setup(),change=vi.fn(),draft=vi.fn();render(<DateRangeSelector label="Trip" months={3} defaultValue={{start:'2026-10-07',end:'2026-10-16'}} defaultFocusedDate="2026-10-07" onValueChange={change} onDraftChange={draft}/>);
 const second=within(screen.getByRole('application',{name:/^Trip, calendar 2,/})),third=within(screen.getByRole('application',{name:/^Trip, calendar 3,/}));draft.mockClear();
 await user.click(second.getByRole('button',{name:'Choose month, November'}));await user.click(second.getByRole('button',{name:'March',exact:true}));
 await user.click(third.getByRole('button',{name:'Choose year, 2026'}));await user.click(third.getByRole('button',{name:'2028',exact:true}));
 expect(screen.getByRole('button',{name:'Choose month, October'})).toBeTruthy();expect(second.getByRole('button',{name:'Choose year, 2026'})).toBeTruthy();expect(third.getByRole('button',{name:'Choose month, December'})).toBeTruthy();expect(change).not.toHaveBeenCalled();expect(draft).not.toHaveBeenCalled();
});
