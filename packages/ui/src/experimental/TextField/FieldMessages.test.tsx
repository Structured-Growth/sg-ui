// @vitest-environment jsdom
import {afterEach,expect,it} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
import {Select} from "../Select/Select";
import {ComboBox} from "../ComboBox/ComboBox";
import {RadioGroup} from "../RadioGroup/RadioGroup";
import {Checkbox} from "../Checkbox/Checkbox";
import {Switch} from "../Switch/Switch";
import {DateField} from "../DateField/DateField";
import {TimeField} from "../TimeField/TimeField";
import {DatePicker} from "../DatePicker/DatePicker";
import {DateRangePicker} from "../DateRangePicker/DateRangePicker";
import {DateRangeSelector} from "../DateRangeSelector/DateRangeSelector";
import {SearchField} from "../SearchField/SearchField";
import {AsyncMultiSelect} from "../AsyncMultiSelect/AsyncMultiSelect";
import type {ReactNode} from "react";
afterEach(cleanup);
type Placement="above"|"below";
const options=[{id:"one",label:"One"}];
const cases:readonly [string,(placement:Placement)=>ReactNode,"button"|"combobox"|"radiogroup"|"checkbox"|"switch"|"textbox"|"group"|"searchbox",boolean][]=[
 ["Select",p=><Select label="Field" options={options} description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"button",true],
 ["ComboBox",p=><ComboBox label="Field" options={options} description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"combobox",true],
 ["RadioGroup",p=><RadioGroup label="Field" options={[{value:"one",label:"One"}]} description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"radiogroup",true],
 ["Checkbox",p=><Checkbox label="Field" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"checkbox",true],
 ["Switch",p=><Switch label="Field" description="Guidance" descriptionPlacement={p}/>,"switch",false],
 ["DateField text",p=><DateField label="Field" entryMode="text" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"textbox",true],
 ["DateField segments",p=><DateField label="Field" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"group",true],
 ["TimeField text",p=><TimeField label="Field" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"textbox",true],
 ["TimeField segments",p=><TimeField label="Field" entryMode="segments" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"group",true],
 ["DatePicker",p=><DatePicker label="Field" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"textbox",true],
 ["DateRangePicker",p=><DateRangePicker label="Field" description="Guidance" descriptionPlacement={p} errorPlacement={p} invalid errorMessage="Review value"/>,"textbox",true],
 ["SearchField",p=><SearchField label="Field" description="Guidance" descriptionPlacement={p}/>,"searchbox",false],
 ["AsyncMultiSelect",p=><AsyncMultiSelect label="Field" options={options} query="" onQueryChange={()=>{}} description="Guidance" descriptionPlacement={p}/>,"searchbox",false],
];
for(const placement of ["above","below"] as const)it.each(cases)(`%s keeps ${placement} messages associated with its control`,(_name,field,role,hasError)=>{
 const {container}=render(field(placement));
 const control=screen.getByRole(role);
 const visual=container.querySelector('[data-sgui-part="choice-control"]')??(role==="radiogroup"?screen.getByRole("radio").closest("label")!:control);
 const following=placement==="above"?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING;
 expect(screen.getByText("Guidance").compareDocumentPosition(visual)&following).toBeTruthy();
 const described=(control.getAttribute("aria-describedby")??"").split(" ").filter(Boolean).map(id=>document.getElementById(id)?.textContent).join(" ");
 expect(described).toContain("Guidance");
 if(hasError){expect(described).toContain("Review value");expect(screen.getByText("Review value").compareDocumentPosition(visual)&following).toBeTruthy();}
});
it.each(["above","below"] as const)("places an inline range validation summary %s its calendars",errorPlacement=>{
 render(<DateRangeSelector label="Field" months={1} defaultValue={{start:"2026-10-07",end:"2026-10-16"}} rangeLength={{mode:"bounded",max:2,unit:"days"}} errorPlacement={errorPlacement}/>);
 const expected=errorPlacement==="above"?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING;
 expect(screen.getByText("Choose an available date range.").compareDocumentPosition(screen.getByRole("grid"))&expected).toBeTruthy();
});
