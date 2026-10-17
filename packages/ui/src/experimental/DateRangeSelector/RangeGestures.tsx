"use client";
import {useContext,useEffect,useRef,type ReactNode,type PointerEvent} from "react";
import {RangeCalendarStateContext} from "react-aria-components/RangeCalendar";
import {parseDate} from "@internationalized/date";
import {addCivilDays,differenceInCivilDays} from "../../utils/relative-dates";
import type {DateRange,DateRangeLength} from "./date-contract";
export type RangeDragBehavior = "none" | "move" | "resize" | "move-and-resize";
type DragOperation = "move" | "start" | "end" | "either";

// Keep the grabbed endpoint under the pointer. At a duration boundary the
// opposite endpoint follows, rather than rejecting the gesture or changing length.
export function resolveRangeDrag(value:DateRange,grabbed:string,destination:string,operation:DragOperation,length?:DateRangeLength):DateRange|null {
 if(operation==='move'||length?.mode==='fixed') {
  const delta=differenceInCivilDays(grabbed,destination);
  const start=addCivilDays(value.start,delta),end=addCivilDays(value.end,delta);
  return start&&end?{start,end}:null;
 }
 const edge=operation==='either'?(destination<value.start?'start':'end'):operation;
 const inclusive=length?.unit==='days'?1:0;
 const min=length?.mode==='bounded'?length.min??0:0;
 const max=length?.mode==='bounded'?length.max??Infinity:Infinity;
 if(!Number.isSafeInteger(min)||min<0||(max!==Infinity&&!Number.isSafeInteger(max))||max<min)return null;
 const minDistance=Math.max(0,min-inclusive),maxDistance=max-inclusive;
 if(maxDistance<minDistance)return null;
 const distance=edge==='start'?differenceInCivilDays(destination,value.end):differenceInCivilDays(value.start,destination);
 if(!Number.isFinite(distance))return null;
 const limited=Math.max(minDistance,Math.min(maxDistance,distance));
 const start=edge==='start'?destination:distance===limited?value.start:addCivilDays(destination,-limited);
 const end=edge==='end'?destination:distance===limited?value.end:addCivilDays(destination,limited);
 return start&&end?{start,end}:null;
}

export function RangeGestures({children,value,behavior,length,disabled,onActivate,onEdit,onPreview,isAllowed,onInvalid,onRestart,resetKey}: {
 resetKey:string;children:ReactNode;value:DateRange|null;behavior:RangeDragBehavior;length?:DateRangeLength;disabled?:boolean;
 onActivate:(date:string)=>boolean;onEdit:(range:DateRange)=>void;onPreview:(range:DateRange|null)=>void;
 isAllowed:(range:DateRange)=>boolean;onInvalid:()=>void;onRestart:(date:string)=>void;
}) {
 const state=useContext(RangeCalendarStateContext)!;
 const cleanup=useRef<()=>void>(()=>{});
 const suppressClick=useRef(false);
 const activePointer=useRef<number|null>(null);
 const lengthKey=length?.mode==='fixed'?`fixed/${length.value}/${length.unit}`:length?`bounded/${length.min}/${length.max}/${length.unit}`:'';
 const latest=useRef({state,disabled,behavior,lengthKey,resetKey,isAllowed,onEdit,onInvalid,onActivate,onRestart});
 latest.current={state,disabled,behavior,lengthKey,resetKey,isAllowed,onEdit,onInvalid,onActivate,onRestart};
 useEffect(()=>()=>{
  const active=activePointer.current!==null;
  cleanup.current();onPreview(null);
  if(active){suppressClick.current=true;latest.current.state.setAnchorDate(null);}
 },[resetKey,onPreview,disabled,behavior,lengthKey]);
 function begin(event:PointerEvent<HTMLDivElement>){
  if(activePointer.current!==null){event.preventDefault();event.stopPropagation();return;}
  // Suppression belongs to the previous gesture, even when it left an incomplete
  // range. A fresh pointer press must be allowed to produce its own native click.
  suppressClick.current=false;
  if(disabled||!value?.start||!value.end||event.button!==0)return;
  const cell=(event.target as Element).closest<HTMLElement>('[data-sgui-date]');
  const date=cell?.dataset.sguiDate;
  if(!date||cell?.matches('[data-disabled]'))return;
  const unavailable=cell?.matches('[aria-disabled="true"], [data-unavailable]');
  if(unavailable&&(date<value.start||date>value.end))return;
  cleanup.current();suppressClick.current=false;activePointer.current=event.pointerId;
  event.preventDefault();event.stopPropagation();
  (cell?.matches('[role="button"]')?cell:cell?.querySelector<HTMLElement>('[role="button"]'))?.focus();
  const owner=event.currentTarget,doc=owner.ownerDocument;
  const snapshot={...value};
  const canMove=behavior==='move'||behavior==='move-and-resize';
  const canResize=behavior==='resize'||behavior==='move-and-resize';
  const selected=date>=snapshot.start&&date<=snapshot.end;
  const edge=date===snapshot.start&&date===snapshot.end?'either':date===snapshot.start?'start':date===snapshot.end?'end':null;
  const operation:DragOperation|null=event.shiftKey&&canMove&&selected?'move':canResize&&edge?edge:canMove&&selected?'move':null;
  let moved=false,candidate:DateRange|null=null,destination:string|null=null,destinationElement:HTMLElement|null=null;
  const origin={x:event.clientX,y:event.clientY};
  const currentGesture=()=>!latest.current.disabled&&latest.current.behavior===behavior&&latest.current.lengthKey===lengthKey&&latest.current.resetKey===resetKey;
  const focusDate=(iso:string,target?:HTMLElement|null)=>{
   if(latest.current.disabled)return;
   latest.current.state.setFocusedDate(parseDate(iso));
   if(!owner.contains(doc.activeElement))return;
   const next=target?.isConnected&&owner.contains(target)?target:owner.querySelector<HTMLElement>(`[data-sgui-date="${iso}"][role="button"]:not([data-outside-month]):not([data-disabled])`);
   next?.focus({preventScroll:true});
  };
  const finish=(cancel=false)=>{
   const restoreFocus=currentGesture();
   cancel=cancel||!restoreFocus;
   cleanup.current();onPreview(null);latest.current.state.setAnchorDate(null);
   suppressClick.current=true;
   if(cancel){if(restoreFocus)focusDate(date,cell);return;}
   if(moved){
    if(!operation){focusDate(date,cell);return;}
    if(candidate&&latest.current.isAllowed(candidate)){latest.current.onEdit(candidate);focusDate(destination??date,destinationElement);}
    else {latest.current.onInvalid();focusDate(date,cell);}
   } else {
    if(unavailable)return;
    if(!latest.current.onActivate(date)){latest.current.onRestart(date);latest.current.state.setAnchorDate(parseDate(date));}
    focusDate(date,cell);
   }
  };
  const move=(e:globalThis.PointerEvent)=>{
   if(e.pointerId!==event.pointerId)return;
   if(!currentGesture()){finish(true);return;}
   if(Math.hypot(e.clientX-origin.x,e.clientY-origin.y)<5&&!moved)return;
   moved=true;if(!operation)return;e.preventDefault();
   const hit=doc.elementFromPoint(e.clientX,e.clientY);
   destinationElement=hit&&owner.contains(hit)?hit.closest<HTMLElement>('[data-sgui-date]:not([data-outside-month])'):null;
   destination=destinationElement?.dataset.sguiDate??null;
   candidate=destination?resolveRangeDrag(snapshot,date,destination,operation,length):null;
   onPreview(candidate);
  };
  const up=(e:globalThis.PointerEvent)=>{if(e.pointerId===event.pointerId){e.preventDefault();e.stopPropagation();if(!currentGesture()){finish(true);return;}move(e);finish();}};
  const cancel=(e:globalThis.PointerEvent)=>{if(e.pointerId===event.pointerId)finish(true);};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish(true);}};
  doc.addEventListener('pointermove',move,{passive:false});doc.addEventListener('pointerup',up,true);doc.addEventListener('pointercancel',cancel);doc.addEventListener('keydown',key,true);
  cleanup.current=()=>{activePointer.current=null;doc.removeEventListener('pointermove',move);doc.removeEventListener('pointerup',up,true);doc.removeEventListener('pointercancel',cancel);doc.removeEventListener('keydown',key,true);};
 }
 return <div style={{display:'contents'}} onPointerDownCapture={begin} onClickCapture={event=>{if(suppressClick.current){suppressClick.current=false;if((event.target as Element).closest('[data-sgui-date]')){event.preventDefault();event.stopPropagation();}}}}
 onKeyDownCapture={event=>{
  if(!(event.target as Element).closest('[data-sgui-date]'))return;
  if(disabled||!value?.end||!['ArrowLeft','ArrowRight'].includes(event.key)||(!event.shiftKey&&!event.altKey))return;
  const move=event.shiftKey&&!event.altKey;
  const canMove=behavior==='move'||behavior==='move-and-resize';
  const canResize=behavior==='resize'||behavior==='move-and-resize';
  if(move&&!canMove||!move&&!canResize)return;
  event.preventDefault();event.stopPropagation();
  const rtl=event.currentTarget.closest('[dir]')?.getAttribute('dir')==='rtl';
  const delta=(event.key==='ArrowRight'?1:-1)*(rtl?-1:1);
  const operation=move?'move':event.shiftKey?'start':'end';
  const grabbed=operation==='end'?value.end:value.start;
  const destination=addCivilDays(grabbed,delta);
  const candidate=destination?resolveRangeDrag(value,grabbed,destination,operation,length):null;
  if(candidate&&isAllowed(candidate))onEdit(candidate);else onInvalid();
 }}>{children}</div>;
}
