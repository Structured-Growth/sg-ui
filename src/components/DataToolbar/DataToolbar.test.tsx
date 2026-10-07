// @vitest-environment jsdom

import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { DataToolbar } from "./DataToolbar";
afterEach(cleanup);
const bare = { showColumnsButton: false, showSortButton: false, showFilterButton: false };
describe("owned DataToolbar", () => {
 it("opens search with keyboard, retains internal text with a callback, clears and returns focus", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<Provider><DataToolbar {...bare} onSearchValueChange={change} /></Provider>);
  screen.getByRole("button", { name: "Search" }).focus(); await user.keyboard("{Enter}");
  const input = screen.getByRole("searchbox", { name: "Search" }); expect(document.activeElement).toBe(input);
  await user.type(input, "course"); expect(input).toHaveProperty("value", "course"); expect(change).toHaveBeenLastCalledWith("course");
  await user.keyboard("{Escape}"); expect(change).toHaveBeenLastCalledWith("");
  expect(screen.queryByRole("searchbox")).toBeNull(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search" }));
 });
 it("requests controlled search and view changes without replacing host values or submitting forms", async () => {
  const user = userEvent.setup(), change = vi.fn(), view = vi.fn(), refresh = vi.fn(), submit = vi.fn();
  render(<Provider><form onSubmit={e => {e.preventDefault();submit();}}><DataToolbar {...bare} searchValue="fixed"
   onSearchValueChange={change} viewMode="cards" onViewModeChange={view} onRefresh={refresh} /></form></Provider>);
  await user.click(screen.getByRole("button", {name:"Search"})); await user.type(screen.getByRole("searchbox"), "x");
  expect(change).toHaveBeenLastCalledWith("fixedx"); expect(screen.getByRole("searchbox")).toHaveProperty("value", "fixed");
  const list = screen.getByRole("button", {name:"List"}); list.focus(); await user.keyboard(" ");
  expect(view).toHaveBeenCalledExactlyOnceWith("list"); expect(list.getAttribute("aria-pressed")).toBe("false");
  await user.click(screen.getByRole("button", {name:"Refresh"})); expect(refresh).toHaveBeenCalledTimes(1); expect(submit).not.toHaveBeenCalled();
 });
 it("labels actions, disables unavailable callbacks and preserves native ref/style and host slots", () => {
  const ref = createRef<HTMLDivElement>();
  render(<Provider><DataToolbar ref={ref} className="host" style={{maxWidth:500}} aria-label="Courses actions"
   leftContent={<span>New course</span>} leftContentWhenSelected={<span>Archive selected</span>} selectedCount={3} showViewModeToggle /></Provider>);
  expect(ref.current).toBe(screen.getByRole("group",{name:"Courses actions"})); expect(ref.current?.className).toContain("host");
  expect(ref.current?.style.maxWidth).toBe("500px"); expect(screen.getByRole("status").textContent).toBe("3 selected");
  expect(screen.getByText("Archive selected")).toBeTruthy(); expect(screen.queryByText("New course")).toBeNull();
  for (const name of ["Refresh","Columns","Sort","Filter","Cards","List"]) expect(screen.getByRole("button",{name})).toHaveProperty("disabled",true);
 });
 it("composes columns and filter/sort popovers with host state and restores trigger focus", async () => {
  const user = userEvent.setup();
  function Host() { const [options, setOptions] = useState([{id:"name",label:"Name",visible:true,locked:true},{id:"status",label:"Status",visible:true}]);
   return <DataToolbar columnOptions={options} onColumnOptionsChange={setOptions} sortOptions={[{id:"name",label:"Name"}]}
    sortRules={[]} onSortRulesChange={() => {}} filterFields={[{id:"name",label:"Name",type:"string"}]} filterRules={[]} onFilterRulesChange={() => {}} />; }
  render(<Provider><Host /></Provider>);
  await user.click(screen.getByRole("button",{name:"Columns"}));
  await user.click(screen.getByRole("checkbox",{name:"Status"})); expect(screen.getByRole("checkbox",{name:"Status"})).toHaveProperty("checked",false);
  await user.keyboard("{Escape}"); await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button",{name:"Columns"})));
  await user.click(screen.getByRole("button",{name:"Sort"})); expect(screen.getByRole("dialog")).toBeTruthy(); await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button",{name:"Filter"})); expect(screen.getByRole("dialog")).toBeTruthy(); await user.keyboard("{Escape}");
 });
});
