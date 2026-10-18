// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {PeriodPicker} from './PeriodPicker';
afterEach(cleanup);
it('resolves a whole Gregorian quarter only on Apply',async()=>{
 const user=userEvent.setup(),change=vi.fn();const {rerender}=render(<PeriodPicker label="Quarter" unit="quarter" referenceDate="2026-10-16" onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Quarter',exact:true}));expect(change).not.toHaveBeenCalled();await user.click(screen.getByRole('button',{name:'Apply',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-01',end:'2026-12-31'});
 change.mockClear();rerender(<PeriodPicker key="inline-quarter" label="Inline quarter" display="inline" unit="quarter" referenceDate="2026-10-16" onValueChange={change}/>);
 expect(screen.getByRole('button',{name:'Quarter 4',exact:true}).getAttribute('aria-pressed')).toBe('true');
 await user.click(screen.getByRole('button',{name:'Quarter 2',exact:true}));expect(change).not.toHaveBeenCalled();
 expect(screen.getByRole('button',{name:'Quarter 2',exact:true}).getAttribute('aria-pressed')).toBe('true');expect(screen.getByRole('button',{name:'Quarter 4',exact:true}).getAttribute('aria-pressed')).toBe('false');
 await user.tab();expect(document.activeElement).toBe(screen.getByRole('button',{name:'Quarter 3',exact:true}));expect(screen.getByRole('button',{name:'Quarter 2',exact:true}).getAttribute('aria-pressed')).toBe('true');
 await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-04-01',end:'2026-06-30'});
});
it('rejects an unavailable date anywhere in the complete period',async()=>{
 const user=userEvent.setup();render(<PeriodPicker label="Year" unit="year" referenceDate="2026-10-16" unavailable={[{date:'2026-07-01',reason:'Closed'}]}/>);
 await user.click(screen.getByRole('button',{name:'Year',exact:true}));expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
});
it('blocks native submission of an empty required picker and focuses its trigger',async()=>{
 const user=userEvent.setup(),submit=vi.fn();render(<form onSubmit={submit}><PeriodPicker label="Required period" unit="month" required referenceDate="2026-10-16"/><button type="submit">Submit</button></form>);
 await user.click(screen.getByRole('button',{name:'Submit',exact:true}));expect(submit).not.toHaveBeenCalled();expect(document.activeElement).toBe(screen.getByRole('button',{name:'Required period',exact:true}));expect(screen.getByRole('alert').textContent).toContain('Required period');
});


it.each([['disabled',false],['readOnly',false],['disabled',true],['readOnly',true]] as const)('locks an open panel when %s changes; controlled=%s',async(policy,controlled)=>{
 const user=userEvent.setup(),change=vi.fn(),initial={start:'2026-10-01',end:'2026-10-31'};
 const view=(locked:boolean)=><form><PeriodPicker unit="month" label="Guarded interval" name="trip" {...(controlled?{value:initial}:{defaultValue:initial})} {...{[policy]:locked}} onValueChange={change}/></form>;
 const {rerender,container}=render(view(false));
 const trigger=()=>screen.getByRole('button',{name:'Guarded interval',exact:true});
 const accepted=()=>container.querySelector<HTMLInputElement>('input[name="trip.start"]')!.value;
 const original=accepted();
 await user.click(trigger());rerender(view(true));
 const clear=screen.getByRole('button',{name:'Clear',exact:true}) as HTMLButtonElement;
 expect(clear.disabled).toBe(true);clear.click();
 expect(change).not.toHaveBeenCalled();expect(accepted()).toBe(original);
 expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 await user.click(screen.getByRole('button',{name:'Cancel',exact:true}));
 expect(screen.queryByRole('dialog')).toBeNull();expect(change).not.toHaveBeenCalled();
 rerender(view(false));await user.click(trigger());await user.click(screen.getByRole('button',{name:'Clear',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith(null);
 expect(accepted()).toBe(controlled?original:'');
});
it('renders inline without an overlay, retains selection form ownership and cancels draft edits',async()=>{
 const user=userEvent.setup(),change=vi.fn(),cancel=vi.fn();const {container}=render(<form><PeriodPicker label="Inline month" display="inline" unit="month" referenceDate="2026-10-16" name="period" onValueChange={change} onCancel={cancel}/></form>);
 expect(screen.queryByRole('dialog')).toBeNull();
 await user.click(screen.getByRole('button',{name:'November',exact:true}));expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-11-01',end:'2026-11-30'});
 expect(new FormData(container.querySelector('form')!).get('period.start')).toBe('2026-11-01');
 await user.click(screen.getByRole('button',{name:'December',exact:true}));await user.click(screen.getByRole('button',{name:'Cancel',exact:true}));
 expect(cancel).toHaveBeenCalledOnce();expect(change).toHaveBeenCalledTimes(1);expect(new FormData(container.querySelector('form')!).get('period.start')).toBe('2026-11-01');
});
