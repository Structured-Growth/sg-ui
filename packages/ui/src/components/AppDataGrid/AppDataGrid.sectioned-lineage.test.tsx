// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {act,cleanup,render,screen,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from '../../experimental/Provider/Provider';
import {SectionedRows,DebouncedServerSearchAndSort} from './AppDataGrid.sectioned.native-fixture';
afterEach(cleanup);
it('plain sectioned grid hides only host-owned children and restores them without utility columns',async()=>{
 const user=userEvent.setup();
 for(const shell of [false,true]){
 const view=render(<Provider><SectionedRows shell={shell}/></Provider>);
 expect(screen.queryByRole('checkbox')).toBeNull();expect(screen.queryByRole('button',{name:'Reorder Lift and drag'})).toBeNull();
 await user.click(screen.getByRole('button',{name:'Collapse Flight principles'}));
 expect(screen.queryByText('Lift and drag')).toBeNull();expect(screen.getByText('Pre-flight checklist')).toBeTruthy();
 await user.click(screen.getByRole('button',{name:'Expand Flight principles'}));expect(screen.getByText('Lift and drag')).toBeTruthy();
 view.unmount();
 }
});
it('private server successor debounces new search text and accepts host-side sorting',async()=>{
 const user=userEvent.setup();render(<Provider><DebouncedServerSearchAndSort/></Provider>);
 await screen.findByText('Course 1');
 expect(screen.getByRole('button',{name:'Sort Course'}).closest('th')?.getAttribute('aria-sort')).toBe('ascending');
 expect([...screen.getByRole('grid',{name:'Server courses'}).querySelectorAll('tbody tr[data-grid-row]')].map(row=>row.getAttribute('data-grid-row'))).toEqual(['course-1','course-10','course-11','course-12','course-13']);
 await user.click(screen.getByRole('button',{name:'Search'}));await user.type(screen.getByRole('searchbox',{name:'Search'}),'Course 2');
 // New query latency is 150ms: without the 250ms debounce these rows would
 // already be replaced at 200ms. Observe the actual result boundary.
 await act(async()=>{await new Promise(resolve=>setTimeout(resolve,200));});
 expect(screen.getByText('Course 1')).toBeTruthy();
 await screen.findByText('Course 23');
 expect(screen.queryByText('Course 1')).toBeNull();
 await user.click(screen.getByRole('button',{name:'Sort Course'}));await user.click(screen.getByRole('menuitemradio',{name:'Sort Descending'}));
 await screen.findByText('Course 29');
 expect(screen.getByRole('grid',{name:'Server courses'}).querySelector('tbody tr[data-grid-row]')?.getAttribute('data-grid-row')).toBe('course-29');
 await user.clear(screen.getByRole('searchbox',{name:'Search'}));await user.type(screen.getByRole('searchbox',{name:'Search'}),'course-3@example.test');
 await screen.findByText('Course 3');expect(screen.queryByText('Course 29')).toBeNull();
});
it('sectioned selection survives collapse and accepted activity-only order while module sources stay disabled',async()=>{
 const user=userEvent.setup();render(<Provider><SectionedRows utilities/></Provider>);
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(true);
 expect((screen.getByRole('button',{name:'Reorder Flight principles'}) as HTMLButtonElement).disabled).toBe(true);
 await user.click(screen.getByRole('button',{name:'Collapse Flight principles'}));await user.click(screen.getByRole('button',{name:'Expand Flight principles'}));
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(true);
 await user.click(screen.getByRole('button',{name:'Move Lift and drag down'}));
 const grid=screen.getByRole('grid',{name:'Sectioned courses'});
 expect([...grid.querySelectorAll('tbody tr[data-grid-row]')].map(row=>(row as HTMLElement).dataset.gridRow)).toEqual(['module-1','stable','lift','module-2','checklist','incident']);
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(true);
});
it('sectioned shell owns search and refresh while preserving the grid composition',async()=>{
 const user=userEvent.setup();render(<Provider><SectionedRows shell utilities/></Provider>);
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(true);
 await user.click(screen.getByRole('button',{name:'Clear selection'}));
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(false);
 await user.click(screen.getByRole('checkbox',{name:'Select Lift and drag'}));
 await user.click(screen.getByRole('button',{name:'Move Lift and drag down'}));
 expect([...screen.getByRole('grid',{name:'Sectioned courses'}).querySelectorAll('tbody tr[data-grid-row]')].slice(0,3).map(row=>(row as HTMLElement).dataset.gridRow)).toEqual(['module-1','stable','lift']);
 await user.click(screen.getByRole('button',{name:'Filter'}));
 await user.click(screen.getByRole('button',{name:/Columns 1/}));await user.click(screen.getByRole('option',{name:'Status'}));
 await user.click(screen.getByRole('button',{name:'Value 1'}));await user.click(screen.getByRole('checkbox',{name:'draft'}));
 await user.keyboard('{Escape}');await user.click(screen.getByRole('button',{name:'Apply'}));
 expect(screen.getByText('Stable flight')).toBeTruthy();expect(screen.queryByText('Lift and drag')).toBeNull();
 await user.click(screen.getByRole('button',{name:'Refresh'}));expect(screen.getByText('Lift and drag')).toBeTruthy();
 await user.click(screen.getByRole('button',{name:'Search'}));await user.type(screen.getByRole('searchbox',{name:'Search'}),'Stable');
 expect(screen.getByText('Stable flight')).toBeTruthy();expect(screen.queryByText('Lift and drag')).toBeNull();
 await user.click(screen.getByRole('button',{name:'Refresh'}));
 expect((screen.getByRole('searchbox',{name:'Search'}) as HTMLInputElement).value).toBe('');
 expect(screen.getByText('Lift and drag')).toBeTruthy();
 expect((screen.getByRole('checkbox',{name:'Select Lift and drag'}) as HTMLInputElement).checked).toBe(false);
 expect(within(screen.getByRole('grid',{name:'Sectioned courses'})).getByRole('button',{name:'Collapse Flight principles'})).toBeTruthy();
});
