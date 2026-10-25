// @vitest-environment jsdom
import {render,screen,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach,expect,it,vi} from 'vitest';
import {AppDataGrid} from './AppDataGrid';
import {AppDataGridShell} from '../AppDataGridShell/AppDataGridShell';

afterEach(cleanup);
const rows=Array.from({length:6},(_,i)=>({id:String(i+1),name:`Course ${i+1}`}));
const columns=[{field:'name',headerName:'Course'}];
for(const Component of [AppDataGrid,AppDataGridShell]){
 it.each([
  [[1],4,['1','2','3','4']],
  [[1,3],5,['1','3','4','5']],
  [[1,5],3,['1','3','4','5']],
 ] as const)(`${Component.displayName??'grid'} adds the range from the most recent checkbox: %j → %s`,async(clicks,target,expected)=>{
  const user=userEvent.setup(),change=vi.fn();
  render(<Component label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name} selection={{onSelectedRowIdsChange:change}}/>);
  const click=async(n:number)=>user.click(screen.getByRole('checkbox',{name:`Select Course ${n}`,exact:true}).closest('label')!);
  for(const n of clicks)await click(n);
  change.mockClear();
  await user.keyboard('{Shift>}');await click(target);await user.keyboard('{/Shift}');
  expect(change).toHaveBeenCalledExactlyOnceWith(new Set(expected));
  for(const row of rows){
   expect((screen.getByRole('checkbox',{name:`Select Course ${row.id}`,exact:true}) as HTMLInputElement).checked).toBe(expected.some(id=>id===row.id));
   expect(screen.getByRole('row',{name:row.name,exact:true}).getAttribute('aria-selected')).toBe(expected.some(id=>id===row.id)?'true':'false');
  }
 });
}

it('uses loaded server order, skips disabled rows and preserves controlled/off-page IDs',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<AppDataGrid label="Courses" mode="server" rows={[...rows].reverse()} columns={columns} getRowLabel={r=>r.name}
  selection={{selectedRowIds:new Set(['99']),onSelectedRowIdsChange:change,isRowSelectable:r=>r.id!=='3'}}/>);
 const click=async(n:number)=>user.click(screen.getByRole('checkbox',{name:`Select Course ${n}`,exact:true}).closest('label')!);
 await click(5);change.mockClear();
 await user.keyboard('{Shift>}');await click(2);await user.keyboard('{/Shift}');
 expect(change).toHaveBeenCalledExactlyOnceWith(new Set(['99','5','4','2']));
 expect((screen.getByRole('checkbox',{name:'Select Course 5',exact:true}) as HTMLInputElement).checked).toBe(false);
});

it('supports Shift-Space from the last checkbox anchor',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<AppDataGrid label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name} selection={{onSelectedRowIdsChange:change}}/>);
 await user.click(screen.getByRole('checkbox',{name:'Select Course 2',exact:true}).closest('label')!);
 screen.getByRole('checkbox',{name:'Select Course 4',exact:true}).focus();change.mockClear();
 await user.keyboard('{Shift>} {/Shift}');
 expect(change).toHaveBeenCalledExactlyOnceWith(new Set(['2','3','4']));
 screen.getByRole('checkbox',{name:'Select Course 3',exact:true}).focus();change.mockClear();
 await user.keyboard('{Shift>} {/Shift}');
 expect(change).toHaveBeenCalledExactlyOnceWith(new Set(['2']));
});

for(const Component of [AppDataGrid,AppDataGridShell]){
 it('checks and unchecks inclusive intervals from the last Shift destination',async()=>{
  const user=userEvent.setup(),change=vi.fn();
  render(<Component label="Courses" rows={rows} columns={columns} getRowLabel={r=>r.name} selection={{onSelectedRowIdsChange:change}}/>);
  const steps=[
   {row:1,shift:false,expected:['1']},
   {row:6,shift:true,expected:['1','2','3','4','5','6']},
   {row:4,shift:true,expected:['1','2','3']},
   {row:2,shift:true,expected:['1']},
   {row:5,shift:true,expected:['1','2','3','4','5']},
   {row:3,shift:false,expected:['1','2','4','5']},
   {row:1,shift:true,expected:['4','5']},
  ];
  for(const {row,shift,expected} of steps){
   change.mockClear();
   if(shift)await user.keyboard('{Shift>}');
   await user.click(screen.getByRole('checkbox',{name:`Select Course ${row}`,exact:true}).closest('label')!);
   if(shift)await user.keyboard('{/Shift}');
   expect(change).toHaveBeenCalledExactlyOnceWith(new Set(expected));
   for(const item of rows){
    expect((screen.getByRole('checkbox',{name:`Select Course ${item.id}`,exact:true}) as HTMLInputElement).checked).toBe(expected.includes(item.id));
    expect(screen.getByRole('row',{name:item.name,exact:true}).getAttribute('aria-selected')).toBe(String(expected.includes(item.id)));
   }
  }
 });
}

it('unchecks a mixed disabled-row interval without changing off-page or controlled selections',async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<AppDataGrid label="Courses" mode="server" rows={rows} columns={columns} getRowLabel={r=>r.name}
  selection={{selectedRowIds:new Set(['99','1','2','3','4','6']),onSelectedRowIdsChange:change,isRowSelectable:r=>r.id!=='3'}}/>);
 const click=async(n:number)=>user.click(screen.getByRole('checkbox',{name:`Select Course ${n}`,exact:true}).closest('label')!);
 await click(6);change.mockClear();
 await user.keyboard('{Shift>}');await click(2);await user.keyboard('{/Shift}');
 expect(change).toHaveBeenCalledExactlyOnceWith(new Set(['99','1','3']));
 expect((screen.getByRole('checkbox',{name:'Select Course 2',exact:true}) as HTMLInputElement).checked).toBe(true);
});
