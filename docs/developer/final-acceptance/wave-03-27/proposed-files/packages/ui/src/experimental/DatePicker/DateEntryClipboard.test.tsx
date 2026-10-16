// @vitest-environment jsdom
// Synthetic clipboard coverage only; trusted OS clipboard is the proposed native spec.
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';
import { TimeField } from '../TimeField/TimeField';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
afterEach(cleanup);
const cases = [
  {kind:'date', initial:'2026-10-14', paste:'20261016', accepted:'2026-10-16', display:'10/16/2026', invalid:'2/30/2026', partial:'10/'},
  {kind:'time', initial:'09:30:00', paste:'315p', accepted:'15:15:00', display:'15:15', invalid:'25:00', partial:'8:'},
  {kind:'range', initial:{start:'2026-10-12',end:'2026-10-14'}, paste:'2026-10-16 to 2026-10-18', accepted:{start:'2026-10-16',end:'2026-10-18'}, display:'10/16/2026 – 10/18/2026', invalid:'10/18/2026 - 10/16/2026', partial:'10/16/2026 -'},
] as const;
it.each(cases)('$kind paste uses the text transaction; rejects partial/invalid drafts and honors prevented/accepted reset',async c=>{
 const user=userEvent.setup(),change=vi.fn(),submit=vi.fn();let preventReset=true;
 render(<form aria-label="Entry form" onReset={e=>{if(preventReset)e.preventDefault();}} onSubmit={e=>{e.preventDefault();submit();}}>
  {c.kind==='date'?<DatePicker label="Entry" name="entry" defaultValue={c.initial as string} required onValueChange={change}/>:
   c.kind==='time'?<TimeField label="Entry" name="entry" defaultValue={c.initial as string} hourCycle={24} required onValueChange={change}/>:
   <DateRangePicker label="Entry" name="entry" defaultValue={c.initial as {start:string;end:string}} required onValueChange={change}/>}
  <button type="button">Leave</button><button type="submit">Submit</button><button type="reset">Reset</button>
 </form>);
 const input=screen.getByRole('textbox',{name:'Entry'}) as HTMLInputElement,form=screen.getByRole('form') as HTMLFormElement;
 const accepted=()=>c.kind==='range'?{start:new FormData(form).get('entry.start'),end:new FormData(form).get('entry.end')}:new FormData(form).get('entry');
 await user.clear(input);await user.paste(c.paste);
 expect(change).not.toHaveBeenCalled();expect(accepted()).toEqual(c.initial);
 await user.keyboard('{Enter}');expect(submit).not.toHaveBeenCalled();
 expect(change).toHaveBeenCalledExactlyOnceWith(c.accepted);expect(input.value).toBe(c.display);expect(accepted()).toEqual(c.accepted);
 await user.click(screen.getByRole('button',{name:'Submit'}));expect(submit).toHaveBeenCalledOnce();
 for(const invalid of [c.partial,c.invalid]){
  await user.clear(input);await user.paste(invalid);await user.click(screen.getByRole('button',{name:'Leave'}));
  expect(input.value).toBe(invalid);expect(input.validity.valid).toBe(false);expect(accepted()).toEqual(c.accepted);expect(change).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button',{name:'Submit'}));expect(submit).toHaveBeenCalledTimes(1);
 }
 await user.click(screen.getByRole('button',{name:'Reset'}));await new Promise(r=>setTimeout(r,10));
 expect(input.value).toBe(c.invalid);expect(accepted()).toEqual(c.accepted);
 preventReset=false;await user.click(screen.getByRole('button',{name:'Reset'}));
 await waitFor(()=>expect(accepted()).toEqual(c.initial));expect(input.validity.valid).toBe(true);expect(change).toHaveBeenCalledTimes(1);
});
it('DatePicker text uses inclusive min/max, required native validity, and optional clear without accepting forbidden drafts',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const props={label:'Window',name:'window',min:'2026-10-14',max:'2026-10-16',onValueChange:change};
 const {rerender}=render(<form aria-label="Window form"><DatePicker {...props} required/></form>);
 const input=screen.getByRole('textbox',{name:'Window'}) as HTMLInputElement,form=screen.getByRole('form') as HTMLFormElement;
 expect(form.checkValidity()).toBe(false);
 for(const raw of ['10/13/2026','10/17/2026']){
  await user.clear(input);await user.type(input,`${raw}{Enter}`);expect(input.value).toBe(raw);expect(input.validity.valid).toBe(false);
  expect(change).not.toHaveBeenCalled();expect(new FormData(form).get('window')).toBe('');
 }
 for(const [raw,iso] of [['10/14/2026','2026-10-14'],['10/16/2026','2026-10-16']]){
  await user.clear(input);await user.type(input,`${raw}{Enter}`);expect(input.validity.valid).toBe(true);expect(change).toHaveBeenLastCalledWith(iso);expect(new FormData(form).get('window')).toBe(iso);
 }
 await user.clear(input);await user.keyboard('{Enter}');expect(input.validity.valid).toBe(false);expect(change).toHaveBeenCalledTimes(2);expect(new FormData(form).get('window')).toBe('2026-10-16');
 rerender(<form aria-label="Window form"><DatePicker {...props}/></form>);
 await user.keyboard('{Enter}');expect(input.validity.valid).toBe(true);expect(change).toHaveBeenLastCalledWith(null);expect(new FormData(form).get('window')).toBe('');
});
