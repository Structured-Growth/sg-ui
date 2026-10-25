// @vitest-environment jsdom
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach,expect,it,vi} from "vitest";
import {Slider} from "./Slider";
import {sliderTicks} from "./slider-ticks";
import {sliderFillInterval} from "./slider-fill";
afterEach(cleanup);

it("steps a single value, commits keyboard changes and submits/resets without edit callbacks",async()=>{
  const user=userEvent.setup(),change=vi.fn(),commit=vi.fn();
  const {container}=render(<form><Slider label="Volume" name="volume" defaultValue={30} step={5} onValueChange={change} onValueCommit={commit} description="Listening level"/><button type="reset">Reset</button></form>);
  const slider=screen.getByRole('slider',{name:'Volume'});
  await user.tab();await user.keyboard('{ArrowRight}');
  expect(change).toHaveBeenLastCalledWith(35);expect(commit).toHaveBeenLastCalledWith(35);
  expect(new FormData(container.querySelector('form')!).get('volume')).toBe('35');
  expect(slider.getAttribute('aria-describedby')).toBeTruthy();
  change.mockClear();commit.mockClear();await user.click(screen.getByRole('button',{name:'Reset'}));
  await waitFor(()=>expect((slider as HTMLInputElement).value).toBe('30'));
  expect(change).not.toHaveBeenCalled();expect(commit).not.toHaveBeenCalled();
});
it("keeps ordered range thumbs bounded, independently named and host controlled",async()=>{
  const user=userEvent.setup(),change=vi.fn();
  const {container,rerender}=render(<form><Slider label="Price" value={[20,60]} thumbLabels={['Minimum price','Maximum price']} thumbNames={['minimum','maximum']} onValueChange={change}/></form>);
  const low=screen.getByRole('slider',{name:/Minimum price/}),high=screen.getByRole('slider',{name:/Maximum price/});
  low.focus();await user.keyboard('{End}');
  expect(change).toHaveBeenLastCalledWith([60,60]);
  expect((low as HTMLInputElement).value).toBe('20');
  expect(new FormData(container.querySelector('form')!).get('maximum')).toBe('60');
  rerender(<form><Slider label="Price" value={[40,60]} thumbLabels={['Minimum price','Maximum price']} onValueChange={change}/></form>);
  expect((low as HTMLInputElement).value).toBe('40');
  expect((low as HTMLInputElement).max).toBe('60');expect((high as HTMLInputElement).min).toBe('40');
  await user.tab();expect(document.activeElement).toBe(high);
});
it("blocks disabled fieldsets and disabled sliders, preserving named native values and descriptions",async()=>{
  const user=userEvent.setup(),change=vi.fn();
  const {container}=render(<form><fieldset disabled><Slider label="Blocked" defaultValue={25} name="blocked" onValueChange={change}/></fieldset><Slider label="Unavailable" disabled defaultValue={50} name="disabled" onValueChange={change}/><Slider label="Rating" min={1} max={5} step={1} defaultValue={3} invalid errorMessage="Confirm your rating" marks={[{value:1,label:'Low'},{value:5,label:'High'}]}/></form>);
  expect(screen.getByRole('slider',{name:'Blocked'}).matches(':disabled')).toBe(true);
  expect(screen.getByRole('slider',{name:'Unavailable'}).matches(':disabled')).toBe(true);
  expect([...new FormData(container.querySelector('form')!).keys()]).toEqual([]);
  await user.tab();await user.keyboard('{ArrowRight}');
  expect((screen.getByRole('slider',{name:'Rating'}) as HTMLInputElement).value).toBe('4');
  expect(screen.getByRole('slider',{name:'Rating'}).getAttribute('aria-invalid')).toBe('true');
  expect(change).not.toHaveBeenCalled();
});

it("defines fills by numeric bounds and outer handles, with optional centered origin",()=>{
 expect(sliderFillInterval([20,50,80],0,100,'auto')).toEqual({start:.2,end:.8});
 expect(sliderFillInterval([20,50,80],0,100,'before')).toEqual({start:0,end:.2});
 expect(sliderFillInterval([20,50,80],0,100,'after')).toEqual({start:.8,end:1});
 expect(sliderFillInterval([20,50,80],0,100,'between')).toEqual({start:.2,end:.8});
 expect(sliderFillInterval([20],0,100,'between')).toBeNull();
 expect(sliderFillInterval([20],0,100,'none')).toBeNull();
 expect(sliderFillInterval([-25],-50,50,'auto',0)).toEqual({start:.25,end:.5});
 expect(sliderFillInterval([25],-50,50,'auto',-100)).toEqual({start:0,end:.75});
});

it("generates incremental ticks and independently switches native keyboard/form snapping",async()=>{
 expect(sliderTicks(0,10,3)).toEqual([0,3,6,9]);
 expect(sliderTicks(-.2,.2,.1)).toEqual([-.2,-.1,0,.1,.2]);
 expect(()=>sliderTicks(0,100,.001)).toThrow(RangeError);
 const user=userEvent.setup(),change=vi.fn();
 const {container,rerender}=render(<form><Slider label="Increment scale" name="scale" defaultValue={20} increment={10} onValueChange={change}/></form>);
 expect(container.querySelectorAll('[data-sgui-part="slider-tick"]').length).toBe(11);
 const input=screen.getByRole('slider');input.focus();await user.keyboard('{ArrowRight}');expect(change).toHaveBeenLastCalledWith(21);
 rerender(<form><Slider label="Increment scale" name="scale" defaultValue={20} increment={10} snapToIncrements onValueChange={change}/></form>);
 await user.keyboard('{ArrowRight}');expect(change).toHaveBeenLastCalledWith(30);expect(new FormData(container.querySelector('form')!).get('scale')).toBe('30');
 rerender(<form><Slider label="Increment scale" name="scale" defaultValue={20} increment={10} snapToIncrements showTicks={false} onValueChange={change}/></form>);
 expect(container.querySelectorAll('[data-sgui-part="slider-tick"]').length).toBe(0);
 await user.keyboard('{ArrowRight}');expect(change).toHaveBeenLastCalledWith(40);
 rerender(<form><Slider label="Increment scale" name="scale" defaultValue={20} increment={0.001} snapToIncrements showTicks={false} onValueChange={change}/></form>);
 await user.keyboard('{ArrowRight}');expect(change).toHaveBeenLastCalledWith(40.001);
});
