// @vitest-environment jsdom
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, expect, it, vi} from 'vitest';
import {RadioGroup} from '../../../../packages/ui/src/experimental/RadioGroup/RadioGroup';
afterEach(cleanup);
it('leaves empty/all-disabled required group submission to the host and requires a choice once enabled', async () => {
  const change=vi.fn(); const user=userEvent.setup();
  const view=(mode:'empty'|'disabled'|'enabled')=><form><button type="button">Before</button><RadioGroup label="Delivery" name="delivery" required onValueChange={change}
    options={mode==='empty'?[]:[{value:'live',label:'Live',disabled:mode==='disabled'}]}/><button type="button">After</button></form>;
  const {container,rerender}=render(view('empty')); const form=container.querySelector('form')!;
  expect(form.checkValidity()).toBe(true); expect(new FormData(form).has('delivery')).toBe(false);
  rerender(view('disabled')); expect(form.checkValidity()).toBe(true);
  await user.click(screen.getByRole('button',{name:'Before'})); await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('button',{name:'After'}));
  expect(new FormData(form).has('delivery')).toBe(false); expect(change).not.toHaveBeenCalled();
  rerender(view('enabled')); expect(form.checkValidity()).toBe(false);
  await user.click(screen.getByRole('button',{name:'Before'})); await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('radio',{name:'Live'})); expect(change).not.toHaveBeenCalled();
  await user.keyboard(' '); expect(change).toHaveBeenCalledExactlyOnceWith('live');
  expect(form.checkValidity()).toBe(true); expect(new FormData(form).get('delivery')).toBe('live');
});
it('cancels radio reset through an ancestor and accepts the latest uncontrolled default without edit callbacks', async () => {
  const user=userEvent.setup(),change=vi.fn();
  const view=(prevent:boolean,defaultValue:string)=><div onReset={event=>{if(prevent)event.preventDefault();}}><form>
    <RadioGroup label="Delivery" name="delivery" defaultValue={defaultValue} onValueChange={change} options={[{value:'self',label:'Self'},{value:'live',label:'Live'},{value:'review',label:'Review'}]}/>
    <button type="reset">Reset</button></form></div>;
  const {rerender}=render(view(true,'self')); await user.click(screen.getByRole('radio',{name:'Live'})); change.mockClear();
  rerender(view(true,'review')); await user.click(screen.getByRole('button',{name:'Reset'})); await new Promise(resolve=>setTimeout(resolve,20));
  expect(screen.getByRole('radio',{name:'Live'})).toHaveProperty('checked',true); expect(change).not.toHaveBeenCalled();
  rerender(view(false,'review')); await user.click(screen.getByRole('button',{name:'Reset'}));
  await vi.waitFor(()=>expect(screen.getByRole('radio',{name:'Review'})).toHaveProperty('checked',true)); expect(change).not.toHaveBeenCalled();
});
