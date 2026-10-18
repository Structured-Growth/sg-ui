// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,within,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangePicker} from '../DateRangePicker/DateRangePicker';
import {DateRangeSelector,type DateRangeSelectorProps} from './DateRangeSelector';
afterEach(cleanup);

it('collapses a required hidden-field nearest range through pointer actions',async()=>{
  const user=userEvent.setup(),change=vi.fn();
  render(<DateRangeSelector label="Trip" months={1} required defaultValue={{start:'2026-10-07',end:'2026-10-09'}} unavailable={[{date:'2026-10-10',reason:'No availability'}]} commitBehavior="immediate" onValueChange={change}/>);
  expect(screen.queryByRole('textbox')).toBeNull();
  expect((screen.getByRole('button',{name:'Clear',exact:true}) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole('button',{name:'Adjust dates',exact:true}));
  await user.click(screen.getByRole('button',{name:'Whole range',exact:true}));
  await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
  expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole('button',{name:'Move range one day later'}) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole('button',{name:'End date',exact:true}));
  await user.click(screen.getByRole('button',{name:'Move end one day earlier'}));
  await user.click(screen.getByRole('button',{name:'Move end one day earlier'}));
  expect(change.mock.calls.map(([range])=>range)).toEqual([{start:'2026-10-07',end:'2026-10-08'},{start:'2026-10-07',end:'2026-10-07'}]);
  // A target-date calendar can jump past unavailable intermediate ranges.
  await user.click(screen.getByRole('button',{name:'Whole range',exact:true}));
  expect(screen.queryByRole('dialog')).toBeNull();
  await user.click(screen.getByRole('button',{name:/Tuesday, October 13, 2026/}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-10-13',end:'2026-10-13'});
  await user.click(screen.getByRole('button',{name:'Next month',exact:true}));
  await user.click(screen.getByRole('button',{name:/Friday, November 13, 2026/}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-11-13',end:'2026-11-13'});
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('shares bounded duration coupling and respects rejected controlled host values and bounds',async()=>{
  const user=userEvent.setup(),change=vi.fn();
  render(<form data-testid="form"><DateRangeSelector label="Trip" name="trip" months={1} required rangeClickBehavior="adjust-end" rangeLength={{mode:'bounded',min:3,max:3,unit:'days'}} min="2026-10-07" max="2026-10-11" value={{start:'2026-10-07',end:'2026-10-09'}} commitBehavior="immediate" onValueChange={change}/></form>);
  await user.click(screen.getByRole('button',{name:'Adjust dates',exact:true}));
  await user.click(screen.getByRole('button',{name:'Start date',exact:true}));
  expect((screen.getByRole('button',{name:'Move start one day earlier'}) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole('button',{name:/Thursday, October 8, 2026/}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-10-08',end:'2026-10-10'});
  await user.click(screen.getByRole('button',{name:'Whole range',exact:true}));
  await user.click(screen.getByRole('button',{name:'Move range one day later'}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-10-09',end:'2026-10-11'});
  await user.click(screen.getByRole('button',{name:'End date',exact:true}));
  expect((screen.getByRole('button',{name:'Move end one day later'}) as HTMLButtonElement).disabled).toBe(true);
  const wire=new FormData(screen.getByTestId('form') as HTMLFormElement);
  expect(wire.get('trip.start')).toBe('2026-10-07');
  expect(wire.get('trip.end')).toBe('2026-10-09');
  expect(change).toHaveBeenCalledTimes(2);
});

it('uses fixed-length day relocation and omits alternatives for unavailable gestures',async()=>{
  const user=userEvent.setup(),change=vi.fn();
  const props:DateRangeSelectorProps={label:'Trip',months:1,defaultValue:{start:'2026-10-07',end:'2026-10-09'},commitBehavior:'immediate',onValueChange:change};
  const {rerender}=render(<DateRangeSelector {...props} rangeLength={{mode:'fixed',value:3,unit:'days'}}/>);
  expect(screen.queryByRole('button',{name:'Adjust dates',exact:true})).toBeNull();
  await user.click(screen.getByRole('button',{name:/Thursday, October 8, 2026/}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-10-08',end:'2026-10-10'});
  for(const updated of [{disabled:true},{readOnly:true},{rangeDragBehavior:'none' as const}]){
    rerender(<DateRangeSelector {...props} {...updated}/>);
    expect(screen.queryByRole('button',{name:'Adjust dates',exact:true})).toBeNull();
  }
  rerender(<DateRangeSelector {...props} value={null}/>);
  expect(screen.queryByRole('button',{name:'Adjust dates',exact:true})).toBeNull();
  change.mockClear();
  rerender(<DateRangePicker {...props} required/>);
  await user.click(screen.getByRole('button',{name:'Choose Trip',exact:true}));
  let popup=screen.getByRole('dialog',{name:'Trip',exact:true});
  await user.click(within(popup).getByRole('button',{name:'Adjust dates',exact:true}));
  await user.click(within(popup).getByRole('button',{name:'End date',exact:true}));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole('button',{name:'Choose Trip',exact:true})));
  await user.click(screen.getByRole('button',{name:'Choose Trip',exact:true}));
  popup=screen.getByRole('dialog',{name:'Trip',exact:true});
  await user.click(within(popup).getByRole('button',{name:'Adjust dates',exact:true}));
  await user.click(within(popup).getByRole('button',{name:'End date',exact:true}));
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  await user.click(within(popup).getByRole('button',{name:/Wednesday, October 7, 2026/}));
  expect(change).toHaveBeenLastCalledWith({start:'2026-10-07',end:'2026-10-07'});
  expect(screen.queryByRole('dialog')).toBeNull(); // Immediate DateRangePicker commit closes its sole popup.
});
