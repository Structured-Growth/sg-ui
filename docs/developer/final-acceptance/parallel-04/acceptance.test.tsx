// @vitest-environment jsdom
// Audit-only characterizations. Passing defect cases demonstrate the gap; they do not accept it.
import { afterEach, expect, it, vi } from '../../../../packages/ui/node_modules/vitest';
import { cleanup, render, screen } from '../../../../packages/ui/node_modules/@testing-library/react';
import userEvent from '../../../../packages/ui/node_modules/@testing-library/user-event';
import { PeriodPicker } from '../../../../packages/ui/src/experimental/PeriodPicker/PeriodPicker';
import { DateTimeRangePicker } from '../../../../packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker';
import { DateRangeComparisonPicker } from '../../../../packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker';
import { ToggleButton } from '../../../../packages/ui/src/experimental/ToggleButton/ToggleButton';
import { Select } from '../../../../packages/ui/src/experimental/Select/Select';
import { Button } from '../../../../packages/ui/src/components/Button/Button';
afterEach(cleanup);
const range = { start: '2026-10-01', end: '2026-10-31' };
for (const kind of ['PeriodPicker', 'DateTimeRangePicker', 'DateRangeComparisonPicker'] as const) {
 for (const policy of ['disabled', 'readOnly'] as const) {
  it(`GAP: ${kind} Clear requests null after open host switches to ${policy}`, async () => {
   const user = userEvent.setup(), change = vi.fn();
   const view = (blocked: boolean) => {
    const common = { label: 'Audit picker', onValueChange: change, [policy]: blocked };
    if (kind === 'PeriodPicker') return <PeriodPicker {...common} unit="month" defaultValue={range}/>;
    if (kind === 'DateTimeRangePicker') return <DateTimeRangePicker {...common} defaultValue={{start:'2026-10-01T08:00:00',end:'2026-10-01T09:00:00'}}/>;
    return <DateRangeComparisonPicker {...common} defaultValue={{primary:range,comparison:null,mode:'none'}}/>;
   };
   const { rerender } = render(view(false));
   await user.click(screen.getByRole('button', {name:'Audit picker',exact:true}));
   rerender(view(true));
   const clear = screen.getByRole('button', {name:'Clear',exact:true}) as HTMLButtonElement;
   expect(clear.disabled).toBe(false);
   await user.click(clear);
   expect(change).toHaveBeenCalledExactlyOnceWith(null);
  });
 }
}
it('EXCEPTION: read-only Select removes its trigger from native focus while retaining submission', () => {
 render(<form data-testid="form"><Select label="Status" name="status" readOnly defaultValue="active" options={[{id:'active',label:'Active'}]}/></form>);
 expect((screen.getByRole('button',{name:'Active Status'}) as HTMLButtonElement).disabled).toBe(true);
 expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('status')).toBe('active');
});
it('ToggleButton calls selection and action callbacks separately, once each per click/Enter/Space', async () => {
 const user=userEvent.setup(), change=vi.fn(),press=vi.fn();
 render(<ToggleButton onSelectedChange={change} onPress={press}>Audit toggle</ToggleButton>);
 await user.click(screen.getByRole('button',{name:'Audit toggle'}));
 await user.keyboard('{Enter}'); await user.keyboard(' ');
 expect(change).toHaveBeenCalledTimes(3);expect(press).toHaveBeenCalledTimes(3);
 expect(change.mock.calls).toEqual([[true],[false],[true]]);
});
for(const type of ['button','submit','reset'] as const) it(`native programmatic ${type} click delivers one owned action`,()=>{
 const press=vi.fn(),formAction=vi.fn();
 render(<form onReset={formAction} onSubmit={event=>{event.preventDefault();formAction();}}><Button type={type} onPress={press}>Audit action</Button></form>);
 (screen.getByRole('button',{name:'Audit action'}) as HTMLButtonElement).click();
 expect(press).toHaveBeenCalledTimes(1);expect(formAction).toHaveBeenCalledTimes(type==='button'?0:1);
});
