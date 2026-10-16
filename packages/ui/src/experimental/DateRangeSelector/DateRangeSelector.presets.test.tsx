// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DateRangeSelector} from './DateRangeSelector';
import {getRelativeDateRange} from './relative-date-range';
afterEach(cleanup);
it('places trailing presets after three calendars in document and keyboard order',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const range={start:'2026-10-12',end:'2026-12-10'};
 render(<DateRangeSelector label="Quarter" months={3} entryMode="text" presetPlacement="end" defaultValue={range}
  presets={[{id:'quarter',label:'Quarter report',value:range}]} onValueChange={change}/>);
 expect(screen.getAllByRole('grid')).toHaveLength(3);
 const apply=screen.getByRole('button',{name:'Apply',exact:true}),preset=screen.getByRole('option',{name:'Quarter report',exact:true});
 expect(apply.compareDocumentPosition(preset)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 await user.click(screen.getByRole('button',{name:'Clear',exact:true}));await user.click(preset);await user.click(apply);
 expect(change).toHaveBeenCalledExactlyOnceWith(range);
});
it('selects configurable fixed, relative and host-defined presets as drafts, with Cancel and Apply ownership',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const initial={start:'2026-10-12',end:'2026-10-18'},year=getRelativeDateRange('2026-10-16',{unit:'year',offset:-1});
 render(<DateRangeSelector label="Reporting" defaultValue={initial} onValueChange={change} presets={[
  {id:'week',label:'This week',value:initial},
  {id:'year',label:'Last year',value:year},
  {id:'custom',label:'Last business week',value:{start:'2026-10-05',end:'2026-10-09'}},
 ]}/>);
 expect(screen.getByRole('group',{name:'Date presets'}).closest('[data-preset-placement]')?.getAttribute('data-preset-placement')).toBe('side');
 expect(screen.getByRole('option',{name:'This week'}).getAttribute('aria-selected')).toBe('true');
 await user.click(screen.getByRole('option',{name:'Last year'}));expect(change).not.toHaveBeenCalled();
 expect(screen.getByRole('option',{name:'Last year'}).getAttribute('aria-selected')).toBe('true');
 await user.click(screen.getByRole('button',{name:'Cancel'}));expect(screen.getByRole('option',{name:'This week'}).getAttribute('aria-selected')).toBe('true');
 await user.click(screen.getByRole('option',{name:'Last business week'}));await user.click(screen.getByRole('button',{name:'Apply'}));
 expect(change).toHaveBeenCalledExactlyOnceWith({start:'2026-10-05',end:'2026-10-09'});
});
it('opens a nested category even when its parent has no direct presets',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<DateRangeSelector label="Dates" months={1} presetGroups={[{id:'parent',label:'Reports',presets:[],children:[{id:'year',label:'Yearly',presets:[{id:'last',label:'Last year',value:{start:'2025-01-01',end:'2025-12-31'}}]}]}]} onValueChange={change}/>);
 await user.click(screen.getByRole('button',{name:/Preset category/}));await user.click(screen.getByRole('option',{name:'Reports / Yearly',exact:true}));await user.click(screen.getByRole('option',{name:'Last year',exact:true}));await user.click(screen.getByRole('button',{name:'Apply',exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith({start:'2025-01-01',end:'2025-12-31'});
});
