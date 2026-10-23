"use client";
import {useEffect,useRef,type PointerEvent} from "react";

type ResizeSnapshot={field:string;widths:Record<string,number>;min:number;max?:number};
/** Pointer geometry for a leading-edge handle; the Aria resizer retains native keyboard/range behavior. */
export function useLeadingColumnResize(onResize:(snapshot:ResizeSnapshot,width:number,cancelled:boolean)=>void){
 const drag=useRef<(ResizeSnapshot&{pointerId:number;x:number;width:number;sign:number;handle:HTMLSpanElement})|null>(null);
 const stop=()=>{
  const current=drag.current;drag.current=null;
  if(!current)return;
  delete current.handle.dataset.pointerResizing;
  if(current.handle.hasPointerCapture?.(current.pointerId))current.handle.releasePointerCapture(current.pointerId);
 };
 useEffect(()=>()=>stop(),[]);
 return {
  start(event:PointerEvent<HTMLSpanElement>,snapshot:ResizeSnapshot){
   if(event.button!==0||drag.current)return;
   const width=snapshot.widths[snapshot.field];if(!Number.isFinite(width))return;
   event.preventDefault();event.stopPropagation();
   event.currentTarget.querySelector<HTMLInputElement>('input[type="range"]')?.focus();
   const rtl=event.currentTarget.ownerDocument.defaultView?.getComputedStyle(event.currentTarget).direction==='rtl';
   drag.current={...snapshot,pointerId:event.pointerId,x:event.clientX,width,sign:rtl?1:-1,handle:event.currentTarget};
   event.currentTarget.dataset.pointerResizing='true';
   event.currentTarget.setPointerCapture?.(event.pointerId);
  },
  move(event:PointerEvent<HTMLSpanElement>){
   const current=drag.current;if(!current||event.pointerId!==current.pointerId)return;
   event.preventDefault();event.stopPropagation();
   const width=Math.max(current.min,Math.min(current.max??Infinity,current.width+(event.clientX-current.x)*current.sign));
   onResize(current,width,false);
  },
  end(event:PointerEvent<HTMLSpanElement>){
   if(drag.current?.pointerId!==event.pointerId)return;
   event.stopPropagation();stop();
  },
  cancel(event:PointerEvent<HTMLSpanElement>){
   const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;
   onResize(current,current.width,true);stop();
  },
  lost(event:PointerEvent<HTMLSpanElement>){
   if(drag.current?.pointerId===event.pointerId)stop();
  },
 };
}
