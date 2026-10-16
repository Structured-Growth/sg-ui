// @vitest-environment jsdom
import {afterEach,expect,it,vi} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Calendar} from "./Calendar";
afterEach(cleanup);
it("jumps decades and months without committing a date, then selects a leap day",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 render(<Calendar label="Birthday" navigation="month-year" visibleYears={200} min="1900-01-01" max="2026-10-16" defaultFocusedDate="2000-01-31" onValueChange={change}/>);
 await user.click(screen.getByRole("button",{name:/year/i}));await user.click(screen.getByRole("option",{name:"1984",exact:true}));
 expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole("button",{name:"Jan month"}));
 await user.click(screen.getByRole("option",{name:"Feb",exact:true}));
 expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole("button",{name:"Wednesday, February 29, 1984",exact:true}));
 expect(change).toHaveBeenCalledExactlyOnceWith("1984-02-29");
});
it("keeps month/year controls unavailable for read-only calendars",()=>{
 render(<Calendar label="Birthday" navigation="month-year" readOnly defaultFocusedDate="2000-01-01"/>);
 expect((screen.getByRole("button",{name:/year/i}) as HTMLButtonElement).disabled).toBe(true);
});
