// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {YearPicker} from './YearPicker';
afterEach(cleanup);
it('pages deterministic years, honors bounds and selects immediately',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<YearPicker yearNavigation="paged" referenceYear={2000} minYear={1980} maxYear={2026} yearsPerPage={12} onValueChange={change}/>);
 expect(screen.queryByRole('button',{name:'2027'})).toBeNull();await user.click(screen.getByRole('button',{name:'Previous years'}));await user.click(screen.getByRole('button',{name:'1984'}));expect(change).toHaveBeenCalledExactlyOnceWith(1984);
 await user.tab();expect(document.activeElement).toBe(screen.getByRole('button',{name:'1985'}));expect(screen.getByRole('button',{name:'1984'}).getAttribute('aria-pressed')).toBe('true');expect(screen.getByRole('button',{name:'1985'}).getAttribute('aria-pressed')).toBe('false');expect(change).toHaveBeenCalledTimes(1);
});
it('defers typed validation until Enter or blur and commits only eligible four-digit years',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<YearPicker yearEntry="text" minYear={1900} maxYear={2026} onValueChange={change}/>);
 const field=screen.getByRole('textbox',{name:'Year'});await user.type(field,'20');expect(field.getAttribute('aria-invalid')).not.toBe('true');await user.keyboard('{Enter}');expect(change).not.toHaveBeenCalled();expect(field.getAttribute('aria-invalid')).toBe('true');
 await user.type(field,'24');await user.tab();expect(change).toHaveBeenCalledExactlyOnceWith(2024);
});
it('disables wholly unavailable years and honors controlled selection',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<YearPicker minYear={2025} maxYear={2027} value={2025} getDateUnavailableReason={date=>date.startsWith('2026')?'Closed':undefined} onValueChange={change}/>);
 expect(screen.getByRole('button',{name:'2026'}).hasAttribute('disabled')).toBe(true);await user.click(screen.getByRole('button',{name:'2027'}));expect(change).toHaveBeenCalledExactlyOnceWith(2027);expect(screen.getByRole('button',{name:'2025'}).getAttribute('aria-pressed')).toBe('true');
});

it('defaults to four-column scroll choices with keyboard navigation and no paging header',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<YearPicker value={2026} minYear={2020} maxYear={2030} onValueChange={change}/>);
 expect(screen.queryByRole('button',{name:'Previous years'})).toBeNull();expect(screen.queryByRole('button',{name:'Next years'})).toBeNull();expect(screen.getAllByRole('button')).toHaveLength(11);
 screen.getByRole('button',{name:'2026',exact:true}).focus();await user.keyboard('{ArrowUp}{Enter}');expect(change).toHaveBeenCalledExactlyOnceWith(2022);
 await user.keyboard('{End}');expect(document.activeElement).toBe(screen.getByRole('button',{name:'2030',exact:true}));
});
