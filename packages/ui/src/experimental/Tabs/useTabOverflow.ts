"use client";

import {useEffect,useLayoutEffect,useState,useRef,type RefObject} from 'react';
import {resolveTabOverflow} from './tab-overflow';
const useCommittedEffect=typeof window==='undefined'?useEffect:useLayoutEffect;
export function useTabOverflow(enabled:boolean,strip:RefObject<HTMLDivElement|null>,more:RefObject<HTMLButtonElement|null>,items:readonly {id:string;label:string;priority?:'primary'|'secondary'}[],selected:string|undefined) {
  const [sizes,setSizes]=useState<{available:number;moreWidth:number;widths:Record<string,number>}|null>(null);
  const latest=useRef('');
  useCommittedEffect(()=>{
    const element=strip.current;
    if(!enabled||!element)return;
    const view=element.ownerDocument.defaultView;if(!view)return;
    let frame:number|null=null;let focusFrame:number|null=null;
    const measure=()=>{
      const widths=Object.fromEntries(Array.from(element.querySelectorAll<HTMLElement>('[data-tab-id]')).map(tab=>[tab.dataset.tabId!,tab.getBoundingClientRect().width]));
      const gap=parseFloat(view.getComputedStyle(element).columnGap)||0;
      const next={available:element.clientWidth,moreWidth:(more.current?.getBoundingClientRect().width??0)+gap,widths};
      const signature=JSON.stringify(next);
      if(latest.current===signature)return;
      latest.current=signature;
      const focused=element.ownerDocument.activeElement;
      const focusedId=focused&&element.contains(focused)?focused.getAttribute('data-tab-id'):null;
      setSizes(next);
      if(focusedId) {
        const visible=resolveTabOverflow(items,selected,widths,next.available,next.moreWidth);
        const id=visible.includes(focusedId)?focusedId:selected;
        if(focusFrame!==null)view.cancelAnimationFrame(focusFrame);
        focusFrame=view.requestAnimationFrame(()=>{
          focusFrame=null;
          const current=element.ownerDocument.activeElement;
          if(current!==focused&&current!==element.ownerDocument.body)return;
          const target=Array.from(element.querySelectorAll<HTMLElement>('[data-tab-id]')).find(tab=>tab.dataset.tabId===id&&!tab.hasAttribute('data-overflow-hidden'));
          (target??more.current)?.focus({preventScroll:true});
        });
      }
    };
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(()=>{
      if(frame!==null)return;
      frame=view.requestAnimationFrame(()=>{frame=null;measure();});
    });
    observer?.observe(element);
    if(more.current)observer?.observe(more.current);
    element.querySelectorAll<HTMLElement>('[data-tab-id]').forEach(tab=>observer?.observe(tab));
    measure();
    view.addEventListener('resize',measure);
    return()=>{observer?.disconnect();view.removeEventListener('resize',measure);if(frame!==null)view.cancelAnimationFrame(frame);if(focusFrame!==null)view.cancelAnimationFrame(focusFrame);};
  },[enabled,strip,more,items,selected]);
  return enabled?sizes:null;
}
