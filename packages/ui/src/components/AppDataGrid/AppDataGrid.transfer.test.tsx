// @vitest-environment jsdom
import {render,screen,cleanup,waitFor,act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,expect,it,vi} from 'vitest';
import {AppDataGrid} from './AppDataGrid';
import {Provider} from '../../experimental/Provider/Provider';
import {AppDataGridShell} from '../AppDataGridShell/AppDataGridShell';
const rows=[{id:'1',name:'Course 1'},{id:'2',name:'Course 2'},{id:'3',name:'Course 3'}];
const columns=[{field:'name',headerName:'Course',flex:1}];
const dropTargets=[{id:'priority',label:'Tag as priority',operation:'copy' as const},{id:'review',label:'Move to Review folder',operation:'move' as const}];
afterEach(cleanup);
for(const Component of [AppDataGrid,AppDataGridShell]){
 it('offers transfer handles on a processed server page and a selection action without reordering',async()=>{
  const user=userEvent.setup(),onDrop=vi.fn();
  render(<Component label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name} mode="server" rowCount={30} paginationModel={{page:2,pageSize:3}}
    searchValue="Course" sortRules={[{field:'name',direction:'desc'}]} selection={{defaultSelectedRowIds:new Set(['99','1','3'])}} rowDrag={{mode:'transfer',dropTargets,onDrop}}/>);
  expect((screen.getByRole('button',{name:'Drag Course 1',exact:true}) as HTMLButtonElement).disabled).toBe(false);
  expect(screen.queryByRole('button',{name:/Move Course .* down/})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Tag as priority',exact:true}));
  expect(onDrop).toHaveBeenCalledExactlyOnceWith({sourceRows:[rows[0],rows[2]],sourceRowIds:['1','3'],targetId:'priority',operation:'copy'});
  await user.click(screen.getByRole('button',{name:'Move to Review folder',exact:true}));
  expect(onDrop).toHaveBeenLastCalledWith({sourceRows:[rows[0],rows[2]],sourceRowIds:['1','3'],targetId:'review',operation:'move'});
  // A move request does not remove rows until the host accepts it.
  expect(screen.getAllByRole('row').slice(1).map(row=>row.textContent?.match(/Course \d/)?.[0])).toEqual(['Course 1','Course 2','Course 3']);
 });
}
it('keyboard dragging transfers a single unselected row to a named target',async()=>{
 const user=userEvent.setup(),onDrop=vi.fn();
 render(<Provider><AppDataGrid label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name} rowDrag={{mode:'transfer',dropTargets,onDrop}}/></Provider>);
 const handle=screen.getByRole('button',{name:'Drag Course 2',exact:true});
 await user.tab();await act(async()=>screen.getByRole('grid').focus());await act(async()=>handle.focus());await user.keyboard('{Enter}');
 await waitFor(()=>expect(document.activeElement?.getAttribute('aria-label')).toBe('Drop rows: Tag as priority'));
 await user.keyboard('{Enter}');
 await waitFor(()=>expect(onDrop).toHaveBeenCalledExactlyOnceWith({sourceRows:[rows[1]],sourceRowIds:['2'],targetId:'priority',operation:'copy'}));
});
it('disables transfers for busy or restricted sources',async()=>{
 const onDrop=vi.fn();
 render(<AppDataGrid label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name}
  selection={{defaultSelectedRowIds:new Set(['1','2'])}} rowDrag={{mode:'transfer',dropTargets,onDrop,isRowDraggable:r=>r.id!=='2'}}/>);
 expect((screen.getByRole('button',{name:'Drag Course 1',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByRole('button',{name:'Tag as priority',exact:true}) as HTMLButtonElement).disabled).toBe(true);
 expect(onDrop).not.toHaveBeenCalled();
});
