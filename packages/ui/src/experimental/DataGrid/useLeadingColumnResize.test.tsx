// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {useLeadingColumnResize} from './useLeadingColumnResize';
afterEach(cleanup);
function pointer(element:HTMLElement,type:string,x:number){
 const event=new MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x});
 Object.defineProperty(event,'pointerId',{value:7});fireEvent(element,event);
}
it('tracks a leading edge from its original width in either direction, clamps bounds and restores cancellation',()=>{
 for(const direction of ['ltr','rtl']){
  const change=vi.fn();
  function Host(){const resize=useLeadingColumnResize(change);return <span data-testid="handle" style={{direction}}
   onPointerDownCapture={event=>resize.start(event,{field:'status',widths:{name:300,status:140,score:120},min:80,max:200})}
   onPointerMove={resize.move} onPointerUp={resize.end} onPointerCancel={resize.cancel} onLostPointerCapture={resize.lost}><input type="range" aria-label="Resize Status"/></span>;}
  const {unmount}=render(<Host/>);const handle=screen.getByTestId('handle');const sign=direction==='ltr'?-1:1;
  pointer(handle,'pointerdown',300);
  pointer(handle,'pointermove',300+40*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([180,false]);
  pointer(handle,'pointermove',300+20*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([160,false]);
  pointer(handle,'pointermove',300+400*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([200,false]);
  pointer(handle,'pointermove',300-400*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([80,false]);
  pointer(handle,'pointermove',300+10*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([150,false]);
  pointer(handle,'pointercancel',300+10*sign);expect(change.mock.calls.at(-1)?.slice(1)).toEqual([140,true]);
  expect(handle.dataset.pointerResizing).toBeUndefined();
  change.mockClear();pointer(handle,'pointermove',200);expect(change).not.toHaveBeenCalled();
  unmount();
 }
});
