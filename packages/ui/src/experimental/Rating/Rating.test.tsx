// @vitest-environment jsdom
import {cleanup,render,screen,waitFor,within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach,expect,it,vi} from "vitest";
import {Rating} from "./Rating";
afterEach(cleanup);

it("keeps required ratings unanswered until selected and supports native values, clearing and reset",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const {container}=render(<form><Rating label="Usefulness" name="score" required clearable description="Rate this session" onValueChange={change}/><button type="reset">Reset form</button></form>);
 const form=container.querySelector('form')!,third=screen.getByRole('radio',{name:'3 of 5 stars'});
 expect(form.checkValidity()).toBe(false);expect(new FormData(form).has('score')).toBe(false);
 await user.hover(third);expect(change).not.toHaveBeenCalled();expect(new FormData(form).has('score')).toBe(false);
 await user.click(third);expect(change).toHaveBeenLastCalledWith(3);expect(new FormData(form).get('score')).toBe('3');expect(form.checkValidity()).toBe(true);
 await user.click(screen.getByRole('button',{name:'Clear rating'}));expect(change).toHaveBeenLastCalledWith(null);expect(form.checkValidity()).toBe(false);
 expect(document.activeElement).toBe(screen.getByRole('radio',{name:'1 of 5 stars'}));
 await user.click(third);change.mockClear();await user.click(screen.getByRole('button',{name:'Reset form'}));
 await waitFor(()=>expect(new FormData(form).has('score')).toBe(false));expect(change).not.toHaveBeenCalled();
});
it("preserves controlled zero, skips disabled answers, and blocks read-only and native fieldset changes",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const options=[{value:0,label:'Low'},{value:1,label:'Medium',disabled:true},{value:2,label:'High'}];
 const {rerender,container}=render(<form><Rating label="Confidence" variant="numbers" options={options} value={0} name="confidence" onValueChange={change}/></form>);
 const low=screen.getByRole('radio',{name:'Low'});await user.tab();await user.keyboard('{ArrowRight}');
 expect(document.activeElement).toBe(screen.getByRole('radio',{name:'High'}));expect(change).toHaveBeenLastCalledWith(2);
 expect((low as HTMLInputElement).checked).toBe(true);expect(new FormData(container.querySelector('form')!).get('confidence')).toBe('0');change.mockClear();
 rerender(<Rating label="Confidence" options={options} value={0} readOnly onValueChange={change}/>);await user.click(screen.getByRole('radio',{name:'High'}));expect(change).not.toHaveBeenCalled();
 rerender(<fieldset disabled><Rating label="Confidence" options={options} value={0} onValueChange={change}/></fieldset>);await user.click(screen.getByText('Confidence'));await user.click(screen.getByRole('radio',{name:'High'}));expect(change).not.toHaveBeenCalled();
});
it("labels custom multi-icon answers, keeps groups independent and retains native reset defaults",async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const options=[{value:1,label:'Some help',icon:<svg aria-label="One symbol"/>},{value:2,label:'Very helpful',icon:<><svg/><svg/></>}];
 const {container}=render(<form><Rating label="First" name="first" variant="icons" options={options} defaultValue={1} onValueChange={change} invalid errorMessage="Confirm the answer"/><Rating label="Second" name="second" variant="labels" options={options} defaultValue={1}/><button type="reset">Reset</button></form>);
 expect(screen.queryByRole('img')).toBeNull();const first=screen.getByRole('radiogroup',{name:'First'}),second=screen.getByRole('radiogroup',{name:'Second'});
 expect(first.getAttribute('aria-invalid')).toBe('true');expect(first.getAttribute('aria-describedby')).toBeTruthy();
 await user.click(within(first).getByRole('radio',{name:'Very helpful'}));expect(change).toHaveBeenCalledExactlyOnceWith(2);
 expect((within(second).getByRole('radio',{name:'Some help'}) as HTMLInputElement).checked).toBe(true);
 change.mockClear();await user.click(screen.getByRole('button',{name:'Reset'}));
 await waitFor(()=>expect(new FormData(container.querySelector('form')!).get('first')).toBe('1'));expect(change).not.toHaveBeenCalled();
});
