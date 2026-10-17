// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ComboBox} from './ComboBox';
afterEach(cleanup);
const options=[{id:'one',label:'First choice'},{id:'two',label:'Second choice'}];
for(const controlled of [false,true]) it(`canceled native ComboBox reset keeps ${controlled?'controlled':'uncontrolled'} selection and sends no edit request`,async()=>{
 const user=userEvent.setup(),change=vi.fn();
 const markup=(prevent:boolean,seed:string|null)=><div onReset={event=>{if(prevent)event.preventDefault();}}><form data-testid="form">
  <ComboBox label="Course" name="course" required options={options} defaultValue={seed} {...(controlled?{value:'two'}:{})} onValueChange={change}/>
  <button type="reset">Reset</button>
 </form></div>;
 const {rerender}=render(markup(true,'one'));
 if(!controlled){await user.click(screen.getByRole('button',{name:'Show options Course'}));await user.click(screen.getByRole('option',{name:'Second choice'}));}
 change.mockClear();
 await user.click(screen.getByRole('button',{name:'Reset'}));
 await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});
 expect(change).not.toHaveBeenCalled();
 expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Second choice');
 expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('course')).toBe('two');
 // Replacing nonempty text keeps the selected ID, unlike clearing before typing.
 await user.click(screen.getByRole('combobox'));
 // A new input event can arrive before the canceled reset's deferred cleanup.
 fireEvent.reset(screen.getByTestId('form'));
 fireEvent.input(screen.getByRole('combobox'),{target:{value:'Partial'}});
 expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Partial');
 expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('course')).toBe('two');
 await act(async()=>{(screen.getByTestId('form') as HTMLFormElement).reset();await new Promise(resolve=>setTimeout(resolve,20));});
 expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Partial');
 expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('course')).toBe('two');
 expect(change).not.toHaveBeenCalled();
 // A canceled reset also preserves a live editable query, independently of the selected ID.
 await user.clear(screen.getByRole('combobox'));expect(change).toHaveBeenLastCalledWith(null);await user.type(screen.getByRole('combobox'),'Partial');change.mockClear();
 await act(async()=>{(screen.getByTestId('form') as HTMLFormElement).reset();await new Promise(resolve=>setTimeout(resolve,20));});
 expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Partial');expect(change).not.toHaveBeenCalled();
 // Latest uncontrolled default is restored only on an accepted reset; host value stays authoritative.
 rerender(markup(false,null));change.mockClear();
 await act(async()=>{(screen.getByTestId('form') as HTMLFormElement).reset();await new Promise(resolve=>setTimeout(resolve,20));});
 expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe(controlled?'Second choice':'');
 expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('course')).toBe(controlled?'two':'');
 expect(change).not.toHaveBeenCalled();
 if(!controlled){
  rerender(markup(true,null));
  await act(async()=>{(screen.getByTestId('form') as HTMLFormElement).reportValidity();});
  expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
  await act(async()=>{(screen.getByTestId('form') as HTMLFormElement).reset();await new Promise(resolve=>setTimeout(resolve,20));});
  expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
 }
});
