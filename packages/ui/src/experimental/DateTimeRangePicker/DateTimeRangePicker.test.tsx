// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateTimeRangePicker} from './DateTimeRangePicker';
afterEach(cleanup);
it('keeps flexible time edits local and applies the whole local interval',async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<DateTimeRangePicker label="Meeting" defaultValue={{start:'2026-10-07T08:00:00',end:'2026-10-07T09:00:00'}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Meeting',exact:true}));const end=screen.getByRole('textbox',{name:'End time',exact:true});await user.clear(end);await user.type(end,'315p');await user.tab();expect(change).not.toHaveBeenCalled();await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-07T08:00:00',end:'2026-10-07T15:15:00'});
});
it('blocks reversed and endpoint-unavailable local intervals',async()=>{
 const user=userEvent.setup();render(<DateTimeRangePicker label="Meeting" defaultValue={{start:'2026-10-07T08:00:00',end:'2026-10-07T09:00:00'}} getDateTimeUnavailableReason={(_,end)=>end==='end'?'Closed':undefined}/>);
 await user.click(screen.getByRole('button',{name:'Meeting',exact:true}));expect((screen.getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
});


it.each([['disabled',false],['readOnly',false],['disabled',true],['readOnly',true]] as const)('locks an open panel when %s changes; controlled=%s',async(policy,controlled)=>{
 const user=userEvent.setup(),change=vi.fn(),initial={start:'2026-10-07T08:00:00',end:'2026-10-07T09:00:00'};
 const view=(locked:boolean)=><form><DateTimeRangePicker  label="Guarded interval" name="trip" {...(controlled?{value:initial}:{defaultValue:initial})} {...{[policy]:locked}} onValueChange={change}/></form>;
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
