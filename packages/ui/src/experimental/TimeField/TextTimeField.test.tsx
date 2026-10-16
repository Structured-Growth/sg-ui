// @vitest-environment jsdom
import {afterEach,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import {TimeField} from "./TimeField";
afterEach(cleanup);
it("normalizes text on blur/Enter, preserves invalid drafts and silently resets",async()=>{
 const user=userEvent.setup(),change=vi.fn(),valid=vi.fn();
 render(<form data-testid="form"><TimeField label="Time" name="time" defaultValue="09:30:00" hourCycle={12} min="08:00:00" max="18:00:00" onValueChange={change} onValidityChange={valid}/><button type="reset">Reset</button></form>);
 const input=screen.getByRole("textbox",{name:"Time"}),form=screen.getByTestId("form") as HTMLFormElement;
 await user.clear(input);await user.type(input,"8a");expect(change).not.toHaveBeenCalled();await user.tab();
 expect((input as HTMLInputElement).value).toBe("8:00 AM");expect(change).toHaveBeenCalledExactlyOnceWith("08:00:00");
 await user.clear(input);await user.type(input,"8:99{Enter}");expect(form.checkValidity()).toBe(false);expect(valid).toHaveBeenLastCalledWith(false);expect(new FormData(form).get("time")).toBe("08:00:00");
 await user.click(screen.getByRole("button",{name:"Reset"}));await waitFor(()=>expect((input as HTMLInputElement).value).toBe("9:30 AM"));expect(change).toHaveBeenCalledTimes(1);
});
it("applies independent hour/minute/period choices and respects Cancel and host authority",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 function Host(){const [value,setValue]=useState<string|null>(null);return <TimeField label="Time" hourCycle={12} value={value} onValueChange={time=>{change(time);setValue(time);}}/>;}
 render(<Host/>);
 await user.click(screen.getByRole("button",{name:"Choose Time"}));
 await user.click(screen.getByRole("button",{name:/Hour/}));await user.click(screen.getByRole("option",{name:"8",exact:true}));
 await user.click(screen.getByRole("button",{name:/Minute/}));await user.click(screen.getByRole("option",{name:"00",exact:true}));
 await user.click(screen.getByRole("button",{name:/AM\/PM/}));await user.click(screen.getByRole("option",{name:"AM",exact:true}));
 expect(change).not.toHaveBeenCalled();
 await user.click(screen.getByRole("button",{name:"Apply",exact:true}));expect(change).toHaveBeenCalledExactlyOnceWith("08:00:00");
 await user.click(screen.getByRole("button",{name:"Choose Time"}));await user.click(screen.getByRole("button",{name:/Hour/}));await user.click(screen.getByRole("option",{name:"9",exact:true}));
 await user.click(screen.getByRole("button",{name:"Cancel",exact:true}));expect(change).toHaveBeenCalledTimes(1);
 expect((screen.getByRole("textbox",{name:"Time"}) as HTMLInputElement).value).toBe("8:00 AM");
});
it("preserves controlled authority, prevented resets, seconds and read-only guards",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const {rerender}=render(<form onReset={event=>event.preventDefault()}><TimeField label="Time" hourCycle={12} value="09:30:00" onValueChange={change}/><button type="reset">Reset</button></form>);
 const input=screen.getByRole("textbox",{name:"Time"}) as HTMLInputElement;
 await user.clear(input);await user.type(input,"8a{Enter}");expect(change).toHaveBeenCalledExactlyOnceWith("08:00:00");expect(input.value).toBe("9:30 AM");
 await user.clear(input);await user.type(input,"8:");await user.click(screen.getByRole("button",{name:"Reset"}));
 await new Promise(resolve=>setTimeout(resolve,10));expect(input.value).toBe("8:");
 rerender(<TimeField label="Time" hourCycle={12} value="12:10:15" readOnly/>);
 const replacement=screen.getByRole("textbox",{name:"Time"}) as HTMLInputElement;
 expect(replacement.value).toBe("12:10:15 PM");expect(replacement.readOnly).toBe(true);
 expect((screen.getByRole("button",{name:"Choose Time"}) as HTMLButtonElement).disabled).toBe(true);
});
