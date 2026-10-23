// @vitest-environment jsdom
import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../../experimental/Provider/Provider";
import { DataToolbarColumnsMenu, type DataToolbarColumnOption } from "./DataToolbarColumnsMenu";
afterEach(cleanup);
const initial = [
  { id: "name", label: "Course name", locked: true, visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "instructor", label: "Instructor", visible: false },
];
function Harness({ change }: { change: (options: DataToolbarColumnOption[]) => void }) {
  const [options, setOptions] = useState(initial);
  return <DataToolbarColumnsMenu options={options} onChange={next => { setOptions(next); change(next); }} />;
}
it("keeps locked columns disabled, toggles controlled visibility once and resets all columns", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const submit = vi.fn(event => event.preventDefault());
  render(<Provider theme="dark"><form onSubmit={submit}><Harness change={change} /></form></Provider>);
  await user.tab(); await user.keyboard("{Enter}");
  expect(screen.getByRole("dialog", { name: "Columns" }).closest('[data-sgui-theme="dark"]')).toBeTruthy();
  expect((screen.getByRole("checkbox", { name: "Course name" }) as HTMLInputElement).disabled).toBe(true);
  await user.click(screen.getByRole("checkbox", { name: "Course name" })); expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("checkbox", { name: "Status" }));
  expect(change).toHaveBeenCalledExactlyOnceWith([initial[0], { ...initial[1], visible: false }, initial[2]]);
  expect((screen.getByRole("checkbox", { name: "Status" }) as HTMLInputElement).checked).toBe(false);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(change).toHaveBeenLastCalledWith(initial.map(option => ({ ...option, visible: true })));
  expect(submit).not.toHaveBeenCalled();
  await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Columns" })));
});
it("searches literal host labels, reports no matches and clears search after dismissal", async () => {
  const user = userEvent.setup(); render(<Provider><Harness change={vi.fn()} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Columns" }));
  const search = screen.getByRole("searchbox", { name: "Search" });
  await user.type(search, "  INSTRUCTOR ");
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  expect(screen.getByRole("checkbox", { name: "Instructor" })).toBeTruthy();
  await user.clear(search); await user.type(search, "missing"); expect(screen.queryByRole("checkbox")).toBeNull();
  expect(screen.getByText("No matching columns")).toBeTruthy();
  await user.keyboard("{Escape}"); await user.click(screen.getByRole("button", { name: "Columns" }));
  expect((screen.getByRole("searchbox", { name: "Search" }) as HTMLInputElement).value).toBe("");
  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
});
it("supports keyboard checkbox changes without closing the dialog", async () => {
  const user = userEvent.setup(); const change = vi.fn(); render(<Provider><Harness change={change} /></Provider>);
  await user.tab(); await user.keyboard("{Enter}");
  screen.getByRole("button", { name: "Move Course name down" }).focus(); await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "Status" }));
  await user.keyboard(" "); expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("dialog", { name: "Columns" })).toBeTruthy();
});
it("translates library strings while searching host labels without generated translation keys", async () => {
  const { SGTranslationProvider } = await import("../../../i18n");
  const user = userEvent.setup();
  const t = vi.fn((_key: string, { defaultMessage }: { defaultMessage: string }) => `Local ${defaultMessage}`);
  render(<SGTranslationProvider value={{ locale: "en-US", t, useNamespace: () => {} }}><Provider><Harness change={vi.fn()} /></Provider></SGTranslationProvider>);
  await user.click(screen.getByRole("button", { name: "Local Columns" }));
  expect(screen.getByRole("checkbox", { name: "Course name" })).toBeTruthy();
  await user.type(screen.getByRole("searchbox", { name: "Local Search" }), "course");
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  expect(t.mock.calls.some(([key]) => key.startsWith("common.ui.label"))).toBe(false);
});

it("requests full-array moves through filtered results without changing visibility or locking text positions", async () => {
  const user = userEvent.setup(); const change = vi.fn(); render(<Provider><Harness change={change} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Columns" }));
  expect((screen.getByRole("button", { name: "Move Course name up" }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole("button", { name: "Move Instructor down" }) as HTMLButtonElement).disabled).toBe(true);
  await user.type(screen.getByRole("searchbox"), "Course");
  const move = screen.getByRole("button", { name: "Move Course name down" });
  move.focus(); await user.keyboard("{Enter}");
  expect(change).toHaveBeenCalledExactlyOnceWith([initial[1], initial[0], initial[2]]);
  await user.clear(screen.getByRole("searchbox"));
  expect(screen.getAllByRole("checkbox")).toEqual(["Status", "Course name", "Instructor"].map(name => screen.getByRole("checkbox", { name })));
  await user.click(screen.getByRole("button", { name: "Move Instructor up" }));
  expect(change).toHaveBeenLastCalledWith([initial[1], initial[2], initial[0]]);
});

function pointer(handle: HTMLElement, type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX, clientY });
  Object.defineProperty(event, "pointerId", { value: 7 });
  fireEvent(handle, event);
}
function mockColumnRows() {
  return [...screen.getByRole("dialog").querySelectorAll<HTMLElement>('[data-sgui-part="column-option"]')].map((row,index)=>
    vi.spyOn(row,"getBoundingClientRect").mockReturnValue({left:0,right:400,top:index*60,bottom:index*60+50,width:400,height:50,x:0,y:index*60,toJSON:()=>({})}));
}
it("drags a column above or below its target only on release while retaining visibility and locks", async () => {
  const user=userEvent.setup(),change=vi.fn();render(<Provider><Harness change={change}/></Provider>);
  await user.click(screen.getByRole("button",{name:"Columns"}));
  const dialog=screen.getByRole("dialog");
  let mocks=mockColumnRows();
  const handles=dialog.querySelectorAll<HTMLElement>('[data-sgui-part="column-option-handle"]');
  try {
    pointer(handles[2],"pointerdown",10,140);
    pointer(handles[2],"pointermove",10,45);
    expect(dialog.querySelector('[data-drop-target]')).toBeNull();
    pointer(handles[2],"pointermove",10,10);
    const chip=dialog.querySelector<HTMLElement>('[data-sgui-part="column-drag-preview"]');
    expect(chip?.textContent).toBe("Instructor");expect(chip?.style.left).toBe("14px");
    expect(dialog.querySelector('[data-column-id="name"]')?.getAttribute("data-drop-target")).toBe("before");
    expect(change).not.toHaveBeenCalled();
    pointer(handles[2],"pointerup",10,10);
    expect(change).toHaveBeenCalledExactlyOnceWith([initial[2],initial[0],initial[1]]);
    expect(dialog.querySelector('[data-sgui-part="column-drag-preview"]')).toBeNull();
    mocks.forEach(mock=>mock.mockRestore());mocks=mockColumnRows();
    pointer(handles[2],"pointerdown",10,10);
    pointer(handles[2],"pointermove",10,65);
    expect(dialog.querySelector('[data-drop-target]')).toBeNull();
    pointer(handles[2],"pointermove",10,100);
    expect(dialog.querySelector('[data-column-id="name"]')?.getAttribute("data-drop-target")).toBe("after");
    pointer(handles[2],"pointerup",10,100);
    expect(change).toHaveBeenLastCalledWith([initial[0],initial[2],initial[1]]);
    expect(screen.getByRole("checkbox",{name:"Course name"})).toHaveProperty("disabled",true);
    expect(screen.getByRole("checkbox",{name:"Instructor"})).toHaveProperty("checked",false);
  }finally{mocks.forEach(mock=>mock.mockRestore());}
});
it("cancels lost/cancelled captures and taps without changing the controlled order", async () => {
 const user=userEvent.setup(),change=vi.fn();render(<Provider><Harness change={change}/></Provider>);
 await user.click(screen.getByRole("button",{name:"Columns"}));const mocks=mockColumnRows();
 const handles=screen.getByRole("dialog").querySelectorAll<HTMLElement>('[data-sgui-part="column-option-handle"]');
 try{
  for(const cancel of ["pointercancel","lostpointercapture"]){
   pointer(handles[1],"pointerdown",10,80);pointer(handles[1],"pointermove",10,10);
   pointer(handles[1],cancel,10,10);pointer(handles[1],"pointerup",10,10);
   expect(document.querySelector('[data-sgui-part="column-drag-preview"]')).toBeNull();
  }
  pointer(handles[1],"pointerdown",10,80);pointer(handles[1],"pointerup",11,81);
  expect(change).not.toHaveBeenCalled();
 }finally{mocks.forEach(mock=>mock.mockRestore());}
});
it("reorders filtered targets in the full host array and waits for host acceptance",async()=>{
 const user=userEvent.setup(),change=vi.fn();render(<Provider><DataToolbarColumnsMenu options={initial} onChange={change}/></Provider>);
 await user.click(screen.getByRole("button",{name:"Columns"}));await user.type(screen.getByRole("searchbox"),"t");
 const mocks=mockColumnRows(),handles=screen.getByRole("dialog").querySelectorAll<HTMLElement>('[data-sgui-part="column-option-handle"]');
 try{
  expect(handles).toHaveLength(2);
  pointer(handles[1],"pointerdown",10,80);pointer(handles[1],"pointerup",10,10);
  expect(change).toHaveBeenCalledExactlyOnceWith([initial[0],initial[2],initial[1]]);
  expect(screen.getAllByRole("checkbox")).toEqual(["Status","Instructor"].map(name=>screen.getByRole("checkbox",{name})));
 }finally{mocks.forEach(mock=>mock.mockRestore());}
});

it("removes reorder controls for position-fixed columns and prevents moves across their boundaries",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const options=[initial[0]!,{id:"fixed",label:"Fixed",visible:true,reorderable:false},initial[1]!,initial[2]!,{id:"actions",label:"Actions",visible:true,locked:true,reorderable:false}];
 render(<Provider><DataToolbarColumnsMenu options={options} onChange={change}/></Provider>);
 await user.click(screen.getByRole("button",{name:"Columns"}));const dialog=screen.getByRole("dialog");
 for(const id of ["fixed","actions"]){
  const row=dialog.querySelector(`[data-column-id="${id}"]`)!;
  expect(row.querySelector('[data-sgui-part="column-option-handle"]')).toBeNull();expect(row.querySelector('button')).toBeNull();
 }
 expect(screen.getByRole("button",{name:"Move Course name down"})).toHaveProperty("disabled",true);
 expect(screen.getByRole("button",{name:"Move Status up"})).toHaveProperty("disabled",true);
 expect(screen.getByRole("button",{name:"Move Instructor down"})).toHaveProperty("disabled",true);
 const mocks=mockColumnRows(),handle=dialog.querySelector<HTMLElement>('[data-column-id="name"] [data-sgui-part="column-option-handle"]')!;
 try{
  pointer(handle,"pointerdown",10,20);pointer(handle,"pointermove",10,220);
  expect(dialog.querySelector('[data-drop-target]')).toBeNull();pointer(handle,"pointerup",10,220);expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button",{name:"Move Instructor up"}));
  expect(change).toHaveBeenCalledExactlyOnceWith([options[0],options[1],options[3],options[2],options[4]]);
 }finally{mocks.forEach(mock=>mock.mockRestore());}
});
