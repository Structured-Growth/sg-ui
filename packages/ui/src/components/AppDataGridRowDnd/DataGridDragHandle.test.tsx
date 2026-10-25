// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGridDragHandle } from "./DataGridDragHandle";
import { AppDataGrid } from "../AppDataGrid/AppDataGrid";
afterEach(cleanup);
it("keeps the composed drag slot available to native pointer input", () => {
  render(<AppDataGrid rows={[{ id: "science", name: "Science" }]} columns={[{ field: "name", headerName: "Course" }]}
    label="Courses" getRowLabel={row => row.name} rowDrag={{ onReorder: vi.fn() }} />);
  const handle = screen.getByRole("button", { name: "Reorder Science" });
  expect(handle.style.pointerEvents).toBe("auto");
  expect(handle.closest("tr")?.getAttribute("draggable")).toBe("true");
});
it("normalizes pointer and keyboard activation once and forwards the native button", async () => {
  const user = userEvent.setup(); const onPress = vi.fn(); const ref = createRef<HTMLButtonElement>();
  render(<DataGridDragHandle label="Move History" onPress={onPress} ref={ref} style={{ margin: 4 }} className="host-handle" />);
  const handle = screen.getByRole("button", { name: "Move History" });
  expect(ref.current).toBe(handle); expect(handle.classList.contains("host-handle")).toBe(true);
  expect(handle.style.margin).toBe("4px");
  await user.click(handle); expect(onPress).toHaveBeenCalledTimes(1);
  await user.keyboard("{Enter}"); expect(onPress).toHaveBeenCalledTimes(2);
  await user.keyboard(" "); expect(onPress).toHaveBeenCalledTimes(3);
});
it("suppresses disabled activation and exposes drag slot and state", async () => {
  const user = userEvent.setup(); const onPress = vi.fn();
  render(<DataGridDragHandle label="Move Science" onPress={onPress} disabled dragging slot="drag" />);
  const handle = screen.getByRole("button", { name: "Move Science" });
  await user.click(handle); await user.keyboard("{Enter}");
  expect(onPress).not.toHaveBeenCalled(); expect((handle as HTMLButtonElement).disabled).toBe(true);
  expect(handle.getAttribute("slot")).toBe("drag"); expect(handle.getAttribute("data-dragging")).toBe("true");
});
it('shares the checkbox cell and shows a Reorder heading only for move buttons',()=>{
 const props={rows:[{id:'science',name:'Science'}],columns:[{field:'name',headerName:'Course'}],label:'Courses',getRowLabel:(row:{id:string;name:string})=>row.name};
 const onReorder=vi.fn();
 const {container,rerender}=render(<AppDataGrid {...props} rowDrag={{onReorder}}/>);
 expect(screen.getByRole('button',{name:'Reorder Science'}).closest('[data-grid-field]')?.getAttribute('data-grid-field')).toBe('__selection');
 expect(container.querySelector('tbody [data-grid-field="__reorder"]')).toBeNull();
 expect(screen.queryByText('Reorder',{exact:true})).toBeNull();
 rerender(<AppDataGrid {...props} rowDrag={{onReorder,showMoveButtons:true}}/>);
 expect(screen.getByText('Reorder',{exact:true}).closest('th')).toBeTruthy();
 expect(screen.getByRole('button',{name:'Reorder Science'}).closest('[data-grid-field]')?.getAttribute('data-grid-field')).toBe('__selection');
 expect(container.querySelector('tbody [data-grid-field="__reorder"]')?.querySelector('[data-sgui-part="grid-drag-handle"]')).toBeNull();
 rerender(<AppDataGrid {...props} selection={false} rowDrag={{onReorder}}/>);
 expect(screen.queryByText('Reorder',{exact:true})).toBeNull();
 expect(screen.getByRole('button',{name:'Reorder Science'}).closest('[data-grid-field]')?.getAttribute('data-grid-field')).toBe('__reorder');
 expect(onReorder).not.toHaveBeenCalled();
});
