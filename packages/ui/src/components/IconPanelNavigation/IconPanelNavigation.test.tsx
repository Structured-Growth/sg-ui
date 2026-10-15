// @vitest-environment jsdom
import {cleanup, render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, expect, it, vi} from "vitest";
import {IconPanelNavigation} from "./IconPanelNavigation";
afterEach(cleanup);
const items = [
  {id:"notes",label:"Notes",icon:<span>N</span>,content:<label>Draft<input defaultValue="Keep me" /></label>},
  {id:"tasks",label:"Tasks",icon:<span>T</span>,content:<button>Task action</button>},
  {id:"locked",label:"Unavailable",icon:<span>X</span>,content:"Unavailable",disabled:true},
];
it("opens, switches and closes panels while retaining drafts and restoring trigger focus", async()=>{
  const user=userEvent.setup();
  render(<IconPanelNavigation items={items}/>);
  const nav=screen.getByRole("navigation",{name:"Panel navigation"});
  const notes=within(nav).getByRole("button",{name:"Notes"});
  expect(screen.queryByRole("region")).toBeNull();
  await user.click(notes);
  expect(notes.getAttribute("aria-expanded")).toBe("true");
  const draft=screen.getByRole("textbox",{name:"Draft"});
  await user.type(draft," edited");
  await user.click(within(nav).getByRole("button",{name:"Tasks"}));
  expect(screen.queryByRole("textbox",{name:"Draft"})).toBeNull();
  await user.click(notes);
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Keep me edited");
  await user.click(screen.getByRole("button",{name:"Close panel"}));
  expect(document.activeElement).toBe(notes);
  await user.click(notes);
  await user.click(screen.getByRole("textbox"));
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("region")).toBeNull();
  expect(document.activeElement).toBe(notes);
  expect((within(nav).getByRole("button",{name:"Unavailable"}) as HTMLButtonElement).disabled).toBe(true);
});
it("requests controlled panel changes without owning host selection",async()=>{
  const user=userEvent.setup(), onChange=vi.fn();
  const {rerender}=render(<IconPanelNavigation items={items} activeId="notes" onActiveIdChange={onChange}/>);
  await user.click(screen.getByRole("button",{name:"Tasks",exact:true}));
  expect(onChange).toHaveBeenLastCalledWith("tasks");
  expect(screen.getByRole("region",{name:"Notes"})).toBeTruthy();
  rerender(<IconPanelNavigation items={items} activeId="tasks" onActiveIdChange={onChange}/>);
  await user.click(screen.getByRole("button",{name:"Tasks",exact:true}));
  expect(onChange).toHaveBeenLastCalledWith(null);
  expect(screen.getByRole("region",{name:"Tasks"})).toBeTruthy();
});
it("keeps separate rails independent and hides removed or disabled active items",async()=>{
  const user=userEvent.setup();
  const {rerender}=render(<><IconPanelNavigation items={items} defaultActiveId="notes" aria-label="Left tools"/><IconPanelNavigation items={items} side="end" aria-label="Right tools"/></>);
  const left=screen.getByRole("navigation",{name:"Left tools"}),right=screen.getByRole("navigation",{name:"Right tools"});
  await user.click(within(right).getByRole("button",{name:"Tasks"}));
  expect(within(left).getByRole("button",{name:"Notes"}).getAttribute("aria-expanded")).toBe("true");
  expect(within(right).getByRole("button",{name:"Tasks"}).getAttribute("aria-expanded")).toBe("true");
  rerender(<IconPanelNavigation items={items.filter(item=>item.id!=="notes")} activeId="notes"/>);
  expect(screen.queryByRole("region")).toBeNull();
});
