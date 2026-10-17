"use client";
import {useEffect,useRef,useState,type RefObject} from 'react';
import styles from './TabIndicator.module.css';
type Geometry={left:number;top:number;width:number;height:number;x:number;y:number;lineWidth:number;lineHeight:number;animate:boolean};
/** One clipped moving line per strip. Selection moves animate; scrolling/resizing tracks immediately. */
export function TabIndicator({container,value,orientation='horizontal',revision}:{container:RefObject<HTMLElement|null>;value:string|undefined;orientation?:'horizontal'|'vertical';revision?:string}){
 const [geometry,setGeometry]=useState<Geometry|null>(null);
 const previous=useRef<string|undefined>(undefined);
 useEffect(()=>{
  const host=container.current,view=host?.ownerDocument.defaultView;if(!host||!view)return;
  let frame:number|null=null;
  const measure=()=>{
   const list=host.querySelector<HTMLElement>('[role="tablist"]')??host;
   const selected=list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"],[aria-current="page"]');
   if(!selected||selected.hasAttribute('data-overflow-hidden')){setGeometry(null);previous.current=value;return;}
   const bounds=host.getBoundingClientRect(),area=list.getBoundingClientRect(),tab=selected.getBoundingClientRect();
   if(!tab.width||!tab.height){setGeometry(null);return;}
   const vertical=orientation==='vertical',rtl=view.getComputedStyle(list).direction==='rtl';
   const next={left:area.left-bounds.left+host.scrollLeft,top:area.top-bounds.top+host.scrollTop,width:list.clientWidth,height:list.clientHeight,
    x:vertical?(rtl?tab.left-area.left:tab.right-area.left-2):tab.left-area.left,
    y:vertical?tab.top-area.top:tab.bottom-area.top-2,lineWidth:vertical?2:tab.width,lineHeight:vertical?tab.height:2,
    animate:previous.current!==undefined&&previous.current!==value};
   previous.current=value;
   setGeometry(current=>current&&Object.keys(next).filter(key=>key!=="animate").every(key=>current[key as keyof Geometry]===next[key as keyof Geometry])?current:next);
  };
  const schedule=()=>{if(frame!==null)return;frame=view.requestAnimationFrame(()=>{frame=null;measure();});};
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(schedule);
  observer?.observe(host);host.querySelectorAll<HTMLElement>('[role="tab"],[aria-current]').forEach(node=>observer?.observe(node));
  schedule();view.addEventListener('resize',schedule);host.ownerDocument.addEventListener('scroll',schedule,true);
  return()=>{observer?.disconnect();view.removeEventListener('resize',schedule);host.ownerDocument.removeEventListener('scroll',schedule,true);if(frame!==null)view.cancelAnimationFrame(frame);};
 },[container,value,orientation,revision]);
 return geometry?<span aria-hidden="true" className={styles.clip} style={{left:geometry.left,top:geometry.top,width:geometry.width,height:geometry.height}}><span data-sgui-part="tab-indicator" data-animate={geometry.animate||undefined} className={styles.line} style={{transform:`translate(${geometry.x}px, ${geometry.y}px)`,width:geometry.lineWidth,height:geometry.lineHeight}}/></span>:null;
}
