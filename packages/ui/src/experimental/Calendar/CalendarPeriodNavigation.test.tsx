// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DatePicker} from '../DatePicker/DatePicker';
afterEach(cleanup);
it('separates month and year choices, immediately navigates within bounds, and only commits a day',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DatePicker label="Trip" defaultValue="2026-10-14" min="2025-03-10" max="2027-07-20" periodPickerProps={{minYear:2026,maxYear:2030}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Trip'}));
 await user.click(screen.getByRole('button',{name:'Choose year, 2026'}));
 const years=screen.getByRole('group',{name:'Choose year',exact:true});
 expect(screen.getAllByRole('dialog')).toHaveLength(1);
 expect(screen.queryByRole('button',{name:'2025',exact:true})).toBeNull();expect(screen.queryByRole('button',{name:'2028',exact:true})).toBeNull();
 expect(screen.queryByRole('button',{name:'October',exact:true})).toBeNull();
 for(const name of ['Apply','Cancel','Clear'])expect(within(years).queryByRole('button',{name,exact:true})).toBeNull();
 await user.click(within(years).getByRole('button',{name:'2027',exact:true}));
 expect(screen.queryByRole('group',{name:'Choose year',exact:true})).toBeNull();
 // October is outside the new year's bounds, so navigation falls back to its first eligible day.
 await user.click(screen.getByRole('button',{name:'Choose month, January'}));
 const chooser=screen.getByRole('group',{name:'Choose month',exact:true});
 expect(within(chooser).getAllByRole('button')).toHaveLength(12);
 expect(screen.getByRole('button',{name:'August',exact:true}).hasAttribute('disabled')).toBe(true);
 await user.click(screen.getByRole('button',{name:'July',exact:true}));
 expect(change).not.toHaveBeenCalled();expect(screen.queryByRole('group',{name:'Choose month',exact:true})).toBeNull();
 expect(screen.getByRole('button',{name:'Choose month, July'})).toBe(document.activeElement);
 await user.click(screen.getByRole('button',{name:'Thursday, July 15, 2027',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith('2027-07-15');
});
it('allows a partially available month, preserves Escape and uses the first eligible day',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DatePicker label="Limited" min="2026-10-10" max="2026-10-20" defaultFocusedDate="2026-10-14" unavailable={[{date:'2026-10-10',reason:'Closed'}]} getDateUnavailableReason={date=>date==='2026-10-11'?'Closed':undefined} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Limited'}));await user.click(screen.getByRole('button',{name:'Choose month, October'}));
 expect(screen.getByRole('button',{name:'September',exact:true}).hasAttribute('disabled')).toBe(true);
 await user.keyboard('{Escape}');expect(screen.getByRole('button',{name:'Choose month, October'})).toBe(document.activeElement);
 await user.keyboard('{Enter}');await user.click(screen.getByRole('button',{name:'October',exact:true}));
 expect(change).not.toHaveBeenCalled();
 expect(screen.getByRole('button',{name:'Monday, October 12, 2026',exact:true}).getAttribute('tabindex')).toBe('0');
});
it('independently disables month and year heading selection without weakening date bounds',async()=>{
 const user=userEvent.setup();const {rerender}=render(<DatePicker label="Date" allowMonthSelection={false} min="2026-10-12" max="2026-10-18" defaultFocusedDate="2026-10-14"/>);
 await user.click(screen.getByRole('button',{name:'Choose Date'}));expect(screen.queryByRole('button',{name:/Choose month,/})).toBeNull();expect(screen.getByRole('button',{name:'Choose year, 2026'})).toBeTruthy();
 rerender(<DatePicker label="Date" allowYearSelection={false} min="2026-10-12" max="2026-10-18" defaultFocusedDate="2026-10-14"/>);
 expect(screen.queryByRole('button',{name:/Choose year,/})).toBeNull();expect(screen.getByRole('button',{name:'Choose month, October'})).toBeTruthy();
 rerender(<DatePicker label="Date" allowYearSelection={false} allowMonthSelection={false} min="2026-10-12" max="2026-10-18" defaultFocusedDate="2026-10-14"/>);
 expect(screen.queryByRole('button',{name:/Choose (month|year),/})).toBeNull();
 expect(screen.getByRole('button',{name:'Previous month'}).hasAttribute('disabled')).toBe(true);expect(screen.getByRole('button',{name:'Next month'}).hasAttribute('disabled')).toBe(true);
});
it('preserves datetime drafts while navigating with a typed year',async()=>{
 const user=userEvent.setup(),change=vi.fn();const {container}=render(<DatePicker name="meeting" label="Meeting" kind="datetime" defaultValue="2026-10-14T09:30:00" periodPickerProps={{yearEntry:"text"}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Meeting'}));await user.click(screen.getByRole('button',{name:'Choose year, 2026'}));
 const chooser=screen.getByRole('group',{name:'Choose year',exact:true});const input=within(chooser).getByRole('textbox',{name:'Year',exact:true});
 await user.clear(input);await user.type(input,'202{Enter}');expect(screen.getByRole('group',{name:'Choose year',exact:true})).toBeTruthy();
 await user.type(input,'7{Enter}');expect(screen.queryByRole('group',{name:'Choose year',exact:true})).toBeNull();
 expect(screen.getAllByRole('dialog')).toHaveLength(1);expect(change).not.toHaveBeenCalled();
 expect((container.querySelector('input[name="meeting"]') as HTMLInputElement).value).toBe('2026-10-14T09:30:00');
 expect(screen.getByRole('grid').getAttribute('aria-label')).toContain('October 2027');
});
