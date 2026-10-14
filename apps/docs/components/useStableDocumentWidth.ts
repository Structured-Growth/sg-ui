'use client';
import {useLayoutEffect} from 'react';

/** Preserve the unlocked document width where native scroll locks drop its gutter. */
export function useStableDocumentWidth() {
  useLayoutEffect(()=>{
    const root=document.documentElement;
    const property='--docs-layout-width';
    const previous=root.style.getPropertyValue(property);
    const priority=root.style.getPropertyPriority(property);
    let gutter=0;
    let frame:number|null=null;
    const measure=()=>{
      const overflow=getComputedStyle(root).overflowY;
      if(overflow!=='hidden' && overflow!=='clip')gutter=Math.max(0,window.innerWidth-root.getBoundingClientRect().width);
      const width=`${Math.max(0,window.innerWidth-gutter)}px`;
      if(root.style.getPropertyValue(property)!==width)root.style.setProperty(property,width);
    };
    const schedule=()=>{
      if(frame!==null)return;
      frame=requestAnimationFrame(()=>{frame=null;measure();});
    };
    measure();
    const resize=typeof ResizeObserver==='undefined' ? null : new ResizeObserver(schedule);
    resize?.observe(root);
    const mutations=new MutationObserver(schedule);
    mutations.observe(root,{attributes:true,attributeFilter:['style']});
    window.addEventListener('resize',measure);
    return ()=>{
      resize?.disconnect();mutations.disconnect();window.removeEventListener('resize',measure);
      if(frame!==null)cancelAnimationFrame(frame);
      if(previous)root.style.setProperty(property,previous,priority);else root.style.removeProperty(property);
    };
  },[]);
}
