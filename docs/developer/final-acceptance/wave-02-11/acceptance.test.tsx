// @vitest-environment jsdom
// Passing characterizations establish gaps, not acceptable behavior or native conformance.
import {afterEach,expect,it,vi} from '../../../../packages/ui/node_modules/vitest';
import {cleanup,render,screen} from '../../../../packages/ui/node_modules/@testing-library/react';
import userEvent from '../../../../packages/ui/node_modules/@testing-library/user-event';
import {DatePicker} from '../../../../packages/ui/src/experimental/DatePicker/DatePicker';
import {Calendar} from '../../../../packages/ui/src/experimental/Calendar/Calendar';
import {Provider} from '../../../../packages/ui/src/experimental/Provider/Provider';
import {SGTranslationProvider} from '../../../../packages/ui/src/i18n';
afterEach(cleanup);
it('GAP K04: typed DatePicker accepts a dynamically unavailable date as valid form data',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const {container}=render(<form><DatePicker label="Appointment" name="appointment" defaultValue="2026-10-14" onValueChange={change}
   getDateUnavailableReason={date=>date==='2026-10-16'?'No appointment capacity':undefined}/></form>);
 const input=screen.getByRole('textbox',{name:'Appointment'}) as HTMLInputElement;
 await user.clear(input);await user.type(input,'10/16/2026{Enter}');
 expect(change).toHaveBeenCalledExactlyOnceWith('2026-10-16');
 expect(input.validity.valid).toBe(true);
 expect(new FormData(container.querySelector('form')!).get('appointment')).toBe('2026-10-16');
});
it('GAP K17: standalone Calendar marks a callback-restricted day unavailable but omits its explanation',()=>{
 render(<Calendar label="Appointments" defaultFocusedDate="2026-10-14"
  getDateUnavailableReason={date=>date==='2026-10-16'?'No appointment capacity':undefined}/>);
 const day=screen.getByRole('button',{name:/Friday, October 16, 2026/});
 expect(day.getAttribute('aria-disabled')).toBe('true');
 expect(screen.queryByText('No appointment capacity')).toBeNull();
 expect(screen.queryByText('Unavailable dates')).toBeNull();
 expect(day.getAttribute('aria-describedby')).toBeNull();
});
it('K09: host translations coexist with Arabic RTL, unavailable and selected calendar semantics',()=>{
 const messages:Record<string,string>={'common.ui.nextMonth':'الشهر التالي','common.ui.previousMonth':'الشهر السابق','common.ui.unavailableDates':'تواريخ غير متاحة'};
 render(<SGTranslationProvider value={{locale:'ar-EG',t:(key,options)=>messages[key]??options.defaultMessage,useNamespace:()=>{}}}><Provider>
  <Calendar label="تواريخ الحجز" defaultValue="2026-10-14" defaultFocusedDate="2026-10-14" unavailable={[{date:'2026-10-16',reason:'السعة ممتلئة'}]}/>
 </Provider></SGTranslationProvider>);
 expect(screen.getByRole('button',{name:'الشهر التالي'})).toBeTruthy();
 expect(screen.getByRole('button',{name:'الشهر السابق'})).toBeTruthy();
 expect(screen.getByText('تواريخ غير متاحة')).toBeTruthy();
 expect(screen.getByText('2026-10-16: السعة ممتلئة')).toBeTruthy();
 expect(screen.getAllByRole('gridcell').filter(cell=>cell.getAttribute('aria-selected')==='true')).toHaveLength(1);
 expect(screen.getAllByRole('button').filter(button=>button.getAttribute('aria-disabled')==='true').length).toBeGreaterThan(0);
});
