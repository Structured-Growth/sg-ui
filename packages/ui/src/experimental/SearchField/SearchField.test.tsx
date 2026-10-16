// @vitest-environment jsdom
import {afterEach,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SearchField} from "./SearchField";
afterEach(cleanup);
const items=[{id:"combo",label:"ComboBox",description:"Forms",keywords:["Autocomplete"],href:"#combo"},{id:"grid",label:"DataGrid",description:"Tables",href:"#grid"}];
it("filters aliases, navigates results with arrows and Escape, and clears with native reset",async()=>{
 const user=userEvent.setup();
 render(<form><SearchField label="Search components" items={items} name="q"/><button type="reset">Reset</button></form>);
 const input=screen.getByRole("searchbox",{name:"Search components"});await user.type(input,"auto");
 const link=await screen.findByRole("link",{name:"ComboBox"});expect(screen.getByRole("status").textContent).toBe("1 result");expect(screen.queryByRole("link",{name:"DataGrid"})).toBeNull();
 await user.keyboard("{ArrowDown}");await waitFor(()=>expect(document.activeElement).toBe(link));await user.keyboard("{Escape}");expect(document.activeElement).toBe(input);await waitFor(()=>expect(screen.queryByRole("region")).toBeNull());
 await user.click(screen.getByRole("button",{name:"Clear search"}));expect((input as HTMLInputElement).value).toBe("");expect(document.activeElement).toBe(input);
 await user.type(input,"grid");await user.click(screen.getByRole("button",{name:"Reset"}));await waitFor(()=>expect((input as HTMLInputElement).value).toBe(""));
});
it("requests host selection once and respects controlled query, loading, retry and disabled states",async()=>{
 const user=userEvent.setup(),change=vi.fn(),select=vi.fn(),retry=vi.fn();
 const data=[{id:"course",label:"Design course"}];
 const {rerender}=render(<SearchField aria-label="Courses" items={data} value="Design" onValueChange={change} onResultSelect={select}/>);
 const input=screen.getByRole("searchbox",{name:"Courses"});await user.click(input);await user.click(await screen.findByRole("button",{name:"Design course"}));expect(select).toHaveBeenCalledExactlyOnceWith(data[0]);expect((input as HTMLInputElement).value).toBe("Design");
 rerender(<SearchField aria-label="Courses" items={data} value="Design" loading/>);await user.click(input);await user.tab();await user.click(input);expect((await screen.findByRole("status")).textContent).toBe("Searching…");expect(screen.queryByRole("button",{name:"Design course"})).toBeNull();
 rerender(<SearchField aria-label="Courses" items={data} value="Design" errorMessage="Request failed" onRetry={retry}/>);await user.click(await screen.findByRole("button",{name:"Retry"}));expect(retry).toHaveBeenCalledOnce();expect(document.activeElement).toBe(input);
 rerender(<SearchField aria-label="Courses" items={data} value="Design" disabled/>);expect((input as HTMLInputElement).disabled).toBe(true);await waitFor(()=>expect(screen.queryByRole("region")).toBeNull());
});
it("keeps empty announcements, full-search submission and outside focus owned by their controls",async()=>{
 const user=userEvent.setup(),submit=vi.fn();render(<><SearchField label="Find" items={items} onSearch={submit}/><button>Outside</button></>);
 const input=screen.getByRole("searchbox",{name:"Find"});await user.type(input,"unknown");expect((await screen.findByRole("status")).textContent).toBe("No results found.");await user.keyboard("{Enter}");expect(submit).toHaveBeenCalledWith("unknown");
 await user.click(screen.getByRole("button",{name:"Outside"}));expect(document.activeElement).toBe(screen.getByRole("button",{name:"Outside"}));await waitFor(()=>expect(screen.queryByRole("region")).toBeNull());
});
