// @vitest-environment jsdom
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DatePicker} from './DatePicker';
afterEach(cleanup);
it('opens the shared period picker by default, narrows relevant years and months, and only commits a day',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DatePicker label="Trip" defaultValue="2026-10-14" min="2025-03-10" max="2027-07-20" periodPickerProps={{minYear:2026,maxYear:2030}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Trip'}));
 await user.click(screen.getByRole('button',{name:'Choose month and year, October 2026'}));
 const chooser=screen.getByRole('group',{name:'Choose month and year',exact:true});
 expect(screen.getAllByRole('dialog')).toHaveLength(1);await user.click(within(chooser).getByRole('button',{name:'Choose year, 2026'}));
 expect(screen.queryByRole('button',{name:'2025',exact:true})).toBeNull();expect(screen.queryByRole('button',{name:'2028',exact:true})).toBeNull();
 await user.click(screen.getByRole('button',{name:'2027',exact:true}));

 expect(screen.getByRole('button',{name:'August',exact:true}).hasAttribute('disabled')).toBe(true);
 await user.click(screen.getByRole('button',{name:'July',exact:true}));await user.click(within(chooser).getByRole('button',{name:'Apply',exact:true}));
 expect(change).not.toHaveBeenCalled();expect(screen.queryByRole('group',{name:'Choose month and year',exact:true})).toBeNull();
 await user.click(screen.getByRole('button',{name:'Thursday, July 15, 2027',exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith('2027-07-15');
});
it('allows a partially available month and uses shared date restrictions to find its first eligible day',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DatePicker label="Limited" min="2026-10-10" max="2026-10-20" defaultFocusedDate="2026-10-14" unavailable={[{date:'2026-10-10',reason:'Closed'}]} getDateUnavailableReason={date=>date==='2026-10-11'?'Closed':undefined} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Limited'}));await user.click(screen.getByRole('button',{name:'Choose month and year, October 2026'}));
 const chooser=screen.getByRole('group',{name:'Choose month and year',exact:true});
 expect((within(chooser).getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(false);

 expect(screen.getByRole('button',{name:'September',exact:true}).hasAttribute('disabled')).toBe(true);
 await user.click(within(chooser).getByRole('button',{name:'Apply',exact:true}));
 expect(change).not.toHaveBeenCalled();
 expect(screen.getByRole('button',{name:'Monday, October 12, 2026',exact:true}).getAttribute('tabindex')).toBe('0');
});
it('can retain arrow-only navigation explicitly',async()=>{
 const user=userEvent.setup();render(<DatePicker label="Date" navigation="arrows" defaultFocusedDate="2026-10-14"/>);
 await user.click(screen.getByRole('button',{name:'Choose Date'}));expect(screen.queryByRole('button',{name:/Choose month and year/})).toBeNull();
});

it('preserves datetime drafts while navigating with a typed year',async()=>{
 const user=userEvent.setup(),change=vi.fn();const {container}=render(<DatePicker name="meeting" label="Meeting" kind="datetime" defaultValue="2026-10-14T09:30:00" periodPickerProps={{yearEntry:"text"}} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:'Choose Meeting'}));await user.click(screen.getByRole('button',{name:'Choose month and year, October 2026'}));
 const chooser=screen.getByRole('group',{name:'Choose month and year',exact:true});
 await user.clear(within(chooser).getByRole('textbox',{name:'Year',exact:true}));await user.type(within(chooser).getByRole('textbox',{name:'Year',exact:true}),'202');
 await user.click(within(chooser).getByRole('button',{name:'May',exact:true}));expect((within(chooser).getByRole('button',{name:'Apply',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 await user.type(within(chooser).getByRole('textbox',{name:'Year',exact:true}),'7');
 await user.click(within(chooser).getByRole('button',{name:'May',exact:true}));await user.click(within(chooser).getByRole('button',{name:'Apply',exact:true}));
 expect(screen.getAllByRole('dialog')).toHaveLength(1);expect(change).not.toHaveBeenCalled();
 expect((container.querySelector('input[name="meeting"]') as HTMLInputElement).value).toBe('2026-10-14T09:30:00');
 expect(screen.getByRole('grid').getAttribute('aria-label')).toContain('May 2027');
});
