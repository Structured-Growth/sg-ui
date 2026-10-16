// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateField} from './DateField';
import {DateRangePicker} from '../DateRangePicker/DateRangePicker';
afterEach(cleanup);
it('normalizes typed dates on commit, preserves invalid edits, serializes ISO and resets silently',async()=>{
  const user=userEvent.setup(),change=vi.fn();
  render(<form data-testid="form"><DateField label="Date" entryMode="text" name="date" defaultValue="2026-10-14" onValueChange={change}/><button type="reset">Reset</button><button>Submit</button></form>);
  const field=screen.getByRole('textbox',{name:'Date'}),form=screen.getByTestId('form') as HTMLFormElement;
  expect(screen.queryByText(/Use a date such as/)).toBeNull();
  expect(field.hasAttribute("aria-describedby")).toBe(false);
  await user.clear(field);await user.type(field,'Oct 16, 2026');await user.tab();
  expect(change).toHaveBeenCalledExactlyOnceWith('2026-10-16');expect((field as HTMLInputElement).value).toBe('10/16/2026');
  expect(new FormData(form).get('date')).toBe('2026-10-16');
  await user.clear(field);await user.type(field,'2/30/2026');await user.tab();
  expect((field as HTMLInputElement).validity.valid).toBe(false);expect((field as HTMLInputElement).value).toBe('2/30/2026');expect(change).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button',{name:'Reset'}));await waitFor(()=>expect((field as HTMLInputElement).value).toBe('10/14/2026'));
  expect(new FormData(form).get('date')).toBe('2026-10-14');expect(change).toHaveBeenCalledTimes(1);
});
it('keeps controlled host authority and bounds when a text request is rejected',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateField label="Date" entryMode="text" value="2026-10-14" min="2026-10-01" max="2026-10-31" onValueChange={change}/>);
 const field=screen.getByRole('textbox',{name:'Date'}) as HTMLInputElement;
 await user.clear(field);await user.type(field,'Oct 16, 2026{Enter}');expect(change).toHaveBeenCalledExactlyOnceWith('2026-10-16');expect(field.value).toBe('10/14/2026');
 await user.clear(field);await user.type(field,'Nov 1, 2026{Enter}');expect(change).toHaveBeenCalledTimes(1);expect(field.validity.valid).toBe(false);
});
it('guards invalid range drafts and commits normalized endpoints only on Apply',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateRangePicker showFields label="Travel" entryMode="text" referenceDate="2026-10-16" months={1} defaultValue={{start:'2026-10-12',end:'2026-10-16'}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Travel'}));
 const start=screen.getByRole('textbox',{name:'Start date'}),end=screen.getByRole('textbox',{name:'End date'});
 await user.clear(start);await user.type(start,'2/30/2026');await user.tab();expect((screen.getByRole('button',{name:'Apply'}) as HTMLButtonElement).disabled).toBe(true);
 await user.clear(start);await user.type(start,'3 days ago');await user.tab();
 await user.clear(end);await user.type(end,'tomorrow');await user.tab();expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole('button',{name:'Apply'}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-13',end:'2026-10-17'});
 await user.click(screen.getByRole('button',{name:'Choose Travel'}));await user.clear(screen.getByRole('textbox',{name:'Start date'}));await user.type(screen.getByRole('textbox',{name:'Start date'}),'bad');
 await user.click(screen.getByRole('button',{name:'Cancel'}));await user.click(screen.getByRole('button',{name:'Choose Travel'}));
 expect((screen.getByRole('textbox',{name:'Start date'}) as HTMLInputElement).value).toBe('10/13/2026');
});
it('normalizes relative dates against the host anchor and keeps committed dates stable when it changes',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const {rerender}=render(<DateField label="Date" entryMode="text" referenceDate="2026-10-16" name="date" max="2026-10-31" onValueChange={change}/>);
 const field=screen.getByRole('textbox',{name:'Date'}) as HTMLInputElement;
 await user.type(field,'today{Enter}');expect(field.value).toBe('10/16/2026');expect(change).toHaveBeenCalledExactlyOnceWith('2026-10-16');
 rerender(<DateField label="Date" entryMode="text" referenceDate="2026-10-17" name="date" max="2026-10-31" onValueChange={change}/>);
 expect(field.value).toBe('10/16/2026');expect(change).toHaveBeenCalledTimes(1);
 await user.clear(field);await user.type(field,'in 2 months{Enter}');expect(field.validity.valid).toBe(false);expect(field.value).toBe('in 2 months');expect(change).toHaveBeenCalledTimes(1);
});
it.each(['date','range'] as const)('defers %s errors until Enter, blur or native validation, and clears feedback while correcting',async kind=>{
 const user=userEvent.setup(),change=vi.fn(),validity=vi.fn();
 render(<form data-testid="deferred-form">{kind==='date'?<DateField label="Entry" entryMode="text" required name="entry" onValueChange={change} onValidityChange={validity}/>:<DateRangePicker label="Entry" required name="entry" onValueChange={change} onValidityChange={validity}/>}<button type="reset">Reset entry</button><button>Outside</button></form>);
 const input=screen.getByRole('textbox',{name:'Entry'}) as HTMLInputElement;
 expect(input.hasAttribute('aria-invalid')).toBe(false);
 await user.type(input,'dec');
 expect(input.validity.valid).toBe(false);expect(validity).toHaveBeenLastCalledWith(false);
 expect(input.hasAttribute('aria-invalid')).toBe(false);expect(change).not.toHaveBeenCalled();
 await user.keyboard('{Enter}');expect(input.getAttribute('aria-invalid')).toBe('true');
 await user.type(input,' ');expect(input.hasAttribute('aria-invalid')).toBe(false);
 await user.tab();expect(input.getAttribute('aria-invalid')).toBe('true');
 await user.clear(input);await user.type(input,kind==='date'?'dec 3 2026':'dec 3 2026 - dec 4 2026');
 expect(input.hasAttribute('aria-invalid')).toBe(false);await user.keyboard('{Enter}');
 expect(input.value).toBe(kind==='date'?'12/03/2026':'12/03/2026 – 12/04/2026');expect(change).toHaveBeenCalledTimes(1);
 await user.clear(input);await user.type(input,'dec');
 expect(input.hasAttribute('aria-invalid')).toBe(false);
 // Native submit/checkValidity is also an explicit validation attempt.
 await user.click(screen.getByRole('button',{name:'Reset entry'}));
 await waitFor(()=>expect(input.hasAttribute('aria-invalid')).toBe(false));
 expect((screen.getByTestId('deferred-form') as HTMLFormElement).checkValidity()).toBe(false);
 await waitFor(()=>expect(input.getAttribute('aria-invalid')).toBe('true'));
});
