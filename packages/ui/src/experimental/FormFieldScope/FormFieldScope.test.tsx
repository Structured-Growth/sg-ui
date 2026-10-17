// @vitest-environment jsdom
import {afterEach,expect,it} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import {renderToString} from "react-dom/server";
import userEvent from "@testing-library/user-event";
import {DatePicker} from "../DatePicker/DatePicker";
import {FormFieldScope} from "./FormFieldScope";
import {TextField} from "../TextField/TextField";
import {DateRangeSelector} from "../DateRangeSelector/DateRangeSelector";
afterEach(cleanup);
function before(message:string,control:Element){return !!(screen.getByText(message).compareDocumentPosition(control)&Node.DOCUMENT_POSITION_FOLLOWING);}
it("merges nested defaults independently and preserves explicit field overrides",()=>{
 render(<FormFieldScope descriptionPlacement="below" errorPlacement="above"><FormFieldScope errorPlacement="below">
 <TextField label="Inherited" description="Inherited help" invalid errorMessage="Inherited error"/>
 <TextField label="Override" description="Override help" descriptionPlacement="above" errorPlacement="above" invalid errorMessage="Override error"/>
 </FormFieldScope></FormFieldScope>);
 const inherited=screen.getByRole("textbox",{name:"Inherited"}),override=screen.getByRole("textbox",{name:"Override"});
 expect(before("Inherited help",inherited)).toBe(false);expect(before("Inherited error",inherited)).toBe(false);
 expect(before("Override help",override)).toBe(true);expect(before("Override error",override)).toBe(true);
 expect(override.getAttribute("aria-describedby")?.split(" ").map(id=>document.getElementById(id)?.textContent).join(" ")).toContain("Override error");
});
it("updates defaults without remounting fields or leaking to siblings",()=>{
 const view=(placement:"above"|"below")=><><FormFieldScope descriptionPlacement={placement}><TextField label="Inside" description="Inside help" defaultValue="Keep my draft"/></FormFieldScope><TextField label="Outside" description="Outside help"/></>;
 const {rerender}=render(view("below"));const input=screen.getByRole("textbox",{name:"Inside"});
 rerender(view("above"));expect(screen.getByRole("textbox",{name:"Inside"})).toBe(input);expect(input).toHaveProperty("value","Keep my draft");
 expect(before("Inside help",input)).toBe(true);expect(before("Outside help",screen.getByRole("textbox",{name:"Outside"}))).toBe(true);
});
it("creates no DOM wrapper or form and renders on the server",()=>{
 const plain=renderToString(<span>Content</span>);
 expect(renderToString(<FormFieldScope><span>Content</span></FormFieldScope>)).toBe(plain);
 const {container}=render(<form><FormFieldScope><TextField label="Name" name="name" defaultValue="Ada"/></FormFieldScope></form>);
 expect(container.querySelectorAll("form")).toHaveLength(1);expect(new FormData(container.querySelector("form")!).get("name")).toBe("Ada");
});
it("places aggregate range errors using inherited defaults",()=>{
 render(<FormFieldScope errorPlacement="above"><DateRangeSelector label="Range" months={1} defaultValue={{start:"2026-10-07",end:"2026-10-16"}} rangeLength={{mode:"bounded",max:2,unit:"days"}}/></FormFieldScope>);
 expect(before("Choose an available date range.",screen.getByRole("grid"))).toBe(true);
});

it("inherits live defaults inside a date-time picker portal",async()=>{
 const user=userEvent.setup();
 const view=(placement:"above"|"below")=><FormFieldScope descriptionPlacement={placement}><DatePicker label="Appointment" kind="datetime" defaultValue="2026-10-16T08:00"/></FormFieldScope>;
 const {rerender}=render(view("below"));
 await user.click(screen.getByRole("button",{name:"Choose Appointment"}));
 const time=screen.getByRole("textbox",{name:"Time"});
 const description=()=>document.getElementById(time.getAttribute("aria-describedby")!.split(" ")[0])!;
 expect(description().compareDocumentPosition(time)&Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
 rerender(view("above"));
 expect(screen.getByRole("textbox",{name:"Time"})).toBe(time);
 expect(description().compareDocumentPosition(time)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
