// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MonthPicker} from './MonthPicker';
afterEach(cleanup);
it('selects immediately, reports numeric months and retains partial-date bounds',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<MonthPicker year={2026} min="2026-03-15" max="2026-05-10" onValueChange={change}/>);
 expect(screen.getAllByRole('button')).toHaveLength(12);
 expect(screen.getByRole('button',{name:'February'}).hasAttribute('disabled')).toBe(true);
 await user.click(screen.getByRole('button',{name:'March'}));expect(change).toHaveBeenCalledExactlyOnceWith(3);expect(screen.getByRole('button',{name:'March'}).getAttribute('aria-pressed')).toBe('true');
});
it('combines custom month availability and date policy while respecting read only',async()=>{
 const user=userEvent.setup(),change=vi.fn();const {rerender}=render(<MonthPicker year={2026} isMonthUnavailable={month=>month===4} getDateUnavailableReason={date=>date.startsWith('2026-05')?'Closed':undefined} onValueChange={change}/>);
 for(const name of ['April','May'])expect(screen.getByRole('button',{name}).hasAttribute('disabled')).toBe(true);
 rerender(<MonthPicker year={2026} readOnly onValueChange={change}/>);await user.click(screen.getByRole('button',{name:'June'}));expect(change).not.toHaveBeenCalled();
});
