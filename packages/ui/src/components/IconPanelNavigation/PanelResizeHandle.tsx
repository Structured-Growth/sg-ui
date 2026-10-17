"use client";
import {useEffect, useRef, useState} from "react";
import styles from "./IconPanelNavigation.module.css";

/** Private accessible splitter; width ownership remains in the rail. */
export function PanelResizeHandle({side,minWidth,maxWidth,label,controls,onResize}:{
  side:"start"|"end";minWidth:number;maxWidth:number;label:string;controls:string;onResize:(width:number)=>void;
}) {
  const ref=useRef<HTMLDivElement>(null);
  const drag=useRef<{id:number;x:number;width:number;sign:number}|null>(null);
  const [metrics,setMetrics]=useState({width:0,min:0,max:960});
  const [dragging,setDragging]=useState(false);
  const minimum=Number.isFinite(minWidth)?Math.max(0,minWidth):240;
  const maximum=Number.isFinite(maxWidth)?Math.max(minimum,maxWidth):Math.max(minimum,960);
  function geometry() {
    const panel=ref.current!.parentElement!;
    const rtl=getComputedStyle(panel).direction==="rtl";
    const sign=(side==="start"?1:-1)*(rtl?-1:1);
    const rail=panel.parentElement!.querySelector("nav")!.getBoundingClientRect();
    const viewport=panel.ownerDocument.documentElement.getBoundingClientRect();
    const right=Math.min(panel.ownerDocument.documentElement.clientWidth,viewport.right);
    const available=Math.max(0,sign===1?right-rail.right:rail.left-Math.max(0,viewport.left));
    const max=Math.min(maximum,available);
    return {width:panel.getBoundingClientRect().width,sign,min:Math.min(minimum,max),max};
  }
  function resize(next:number) {const bounds=geometry();onResize(Math.min(bounds.max,Math.max(bounds.min,next)));}
  useEffect(()=>{
    const panel=ref.current!.parentElement!;
    const measure=()=>{
      const next=geometry();const limit=`${next.max}px`;
      if(panel.style.getPropertyValue("--panel-resize-limit")!==limit)panel.style.setProperty("--panel-resize-limit",limit);
      setMetrics({width:next.width,min:Math.min(next.min,next.width),max:Math.max(next.width,next.max)});
    };
    measure();
    const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(measure):null;
    observer?.observe(panel);window.addEventListener("resize",measure);
    return ()=>{observer?.disconnect();window.removeEventListener("resize",measure);};
  },[side,minimum,maximum]);
  const stop=()=>{const id=drag.current?.id;drag.current=null;setDragging(false);if(id!==undefined&&ref.current?.hasPointerCapture?.(id))ref.current.releasePointerCapture(id);};
  return <div ref={ref} role="separator" tabIndex={0} aria-label={label} aria-controls={controls} aria-orientation="vertical"
    aria-valuemin={Math.round(metrics.min)} aria-valuemax={Math.round(metrics.max)} aria-valuenow={Math.round(metrics.width)}
    className={styles.resizeHandle} data-sgui-part="icon-navigation-resize-handle" data-dragging={dragging||undefined}
    onPointerDown={event=>{
      if(event.button!==0||drag.current)return;
      const bounds=geometry();event.preventDefault();event.currentTarget.focus();
      drag.current={id:event.pointerId,x:event.clientX,width:bounds.width,sign:bounds.sign};setDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }} onPointerMove={event=>{
      const start=drag.current;if(start?.id===event.pointerId)resize(start.width+(event.clientX-start.x)*start.sign);
    }} onPointerUp={event=>{
      if(drag.current?.id!==event.pointerId)return;
      stop();
    }} onPointerCancel={event=>{if(drag.current?.id===event.pointerId){onResize(drag.current.width);stop();}}} onLostPointerCapture={stop}
    onKeyDown={event=>{
      if(event.key==="Escape"&&drag.current){event.preventDefault();event.stopPropagation();onResize(drag.current.width);stop();return;}
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
      event.preventDefault();event.stopPropagation();const bounds=geometry();
      resize(event.key==="Home"?bounds.min:event.key==="End"?bounds.max:bounds.width+(event.key==="ArrowRight"?1:-1)*bounds.sign*(event.shiftKey?50:10));
    }}/>
}
