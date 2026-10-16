// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeComparisonPicker} from './DateRangeComparisonPicker';
afterEach(cleanup);
it('commits an adjacent equal-length previous period atomically',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<DateRangeComparisonPicker label="Compare" defaultValue={{primary:{start:'2026-10-07',end:'2026-10-16'},comparison:null,mode:'previous-period'}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Compare',exact:true}));expect(change).not.toHaveBeenCalled();await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({primary:{start:'2026-10-07',end:'2026-10-16'},comparison:{start:'2026-09-27',end:'2026-10-06'},mode:'previous-period'});
});
it('clamps previous-year leap endpoints and lets Cancel discard the whole composition',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<DateRangeComparisonPicker label="Compare" defaultValue={{primary:{start:'2024-02-29',end:'2024-03-02'},comparison:null,mode:'previous-year'}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Compare',exact:true}));expect((screen.getByRole('textbox',{name:'Comparison period',exact:true}) as HTMLInputElement).value).toBe('02/28/2023 – 03/02/2023');await user.click(screen.getByRole('button',{name:'Cancel',exact:true}));expect(change).not.toHaveBeenCalled();
});


it.each([['disabled',false],['readOnly',false],['disabled',true],['readOnly',true]] as const)('locks an open panel when %s changes; controlled=%s',async(policy,controlled)=>{
 const user=userEvent.setup(),change=vi.fn(),initial={primary:{start:'2026-10-07',end:'2026-10-16'},comparison:null,mode:'none' as const};
 const view=(locked:boolean)=><form><DateRangeComparisonPicker  label="Guarded interval" name="trip" {...(controlled?{value:initial}:{defaultValue:initial})} {...{[policy]:locked}} onValueChange={change}/></form>;
 const {rerender,container}=render(view(false));
 const trigger=()=>screen.getByRole('button',{name:'Guarded interval',exact:true});
 const accepted=()=>container.querySelector<HTMLInputElement>('input[name="trip"]')!.value;
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
