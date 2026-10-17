"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Tabs as AriaTabs, TabList, Tab, TabPanel } from "react-aria-components/Tabs";
import {TabIndicator} from "./TabIndicator";
import { scrollTabIntoView } from "./scrollTabIntoView";
import {Menu} from "../Menu/Menu";
import {IconButton} from "../IconButton/IconButton";
import {MoreHorizIcon} from "../icons/MoreHorizIcon";
import {useTranslation} from "../../i18n";
import {resolveTabOverflow} from "./tab-overflow";
import {useTabOverflow} from "./useTabOverflow";
import styles from "./Tabs.module.css";

export interface TabItem { id: string; label: string; content: ReactNode; icon?: ReactNode; disabled?: boolean; /** Secondary tabs begin in the overflow menu and are promoted while selected. */ priority?: "primary" | "secondary" }
export interface TabsProps {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activation?: "automatic" | "manual";
  /** Horizontal strips can replace scrolling with an overflow menu. Vertical strips keep scrolling. */
  overflow?: "scroll" | "menu";
  /** Accessible name for the overflow action and menu. */
  overflowLabel?: string;
  className?: string;
  style?: CSSProperties;
}
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { label, items, value, defaultValue, onValueChange, activation = "automatic", orientation = "horizontal", overflow = "scroll", overflowLabel, className, style }, ref,
) {
  const root=useRef<HTMLDivElement|null>(null);
  const strip=useRef<HTMLDivElement|null>(null);
  const more=useRef<HTMLButtonElement|null>(null);
  useImperativeHandle(ref,()=>root.current!,[]);
  const [internal,setInternal]=useState(defaultValue);
  const [menuOpen,setMenuOpen]=useState(false);
  const pendingFocus=useRef<string|null>(null);
  const selected=value!==undefined?value:(items.some(item=>item.id===internal)?internal:items.find(item=>!item.disabled)?.id);
  const menuMode=overflow==='menu'&&orientation==='horizontal';
  const sizes=useTabOverflow(menuMode,strip,more,items,selected);
  const visible=menuMode?resolveTabOverflow(items,selected,sizes?.widths??{},sizes?.available??Infinity,sizes?.moreWidth??0):items.map(item=>item.id);
  const hidden=items.filter(item=>!visible.includes(item.id));
  const ordered=menuMode?[...visible.map(id=>items.find(item=>item.id===id)!),...hidden]:items;
  const disabled=items.filter(item=>item.disabled||!visible.includes(item.id)).map(item=>item.id);
  const {t}=useTranslation();
  const moreLabel=overflowLabel??t('common.ui.moreTabs',{defaultMessage:'More tabs'});
  const select=(id:string)=>{if(value===undefined)setInternal(id);onValueChange?.(id);};
  const visibleKey=JSON.stringify(visible);
  useEffect(()=>{if(!hidden.length)setMenuOpen(false);},[hidden.length]);
  useEffect(()=>{
    if(menuOpen||pendingFocus.current!==selected||!visible.includes(selected!))return;
    const view=root.current?.ownerDocument.defaultView;if(!view)return;
    const frame=view.requestAnimationFrame(()=>{
      const target=Array.from(root.current?.querySelectorAll<HTMLElement>('[data-tab-id]')??[]).find(tab=>tab.dataset.tabId===selected);
      target?.focus({preventScroll:true});pendingFocus.current=null;
    });
    return()=>view.cancelAnimationFrame(frame);
  },[selected,menuOpen,visibleKey]);
  return <AriaTabs ref={root} selectedKey={selected}
    onSelectionChange={key=>select(String(key))} disabledKeys={disabled}
    orientation={orientation} keyboardActivation={activation} style={style} className={[styles.root, menuMode?styles.menuMode:undefined, className].filter(Boolean).join(" ")}>
    <div ref={strip} className={styles.strip} style={menuMode&&sizes?{'--tabs-available-width':`${Math.max(1,sizes.available-sizes.moreWidth)}px`} as CSSProperties:undefined} onKeyDown={event => {
      // React Aria's manual handlers move focus but return false, leaving native
      // scroll defaults enabled. Cancel only the plain keys this list owns,
      // after the upstream handler has processed focus and disabled-item skipping.
      const list = event.currentTarget.firstElementChild;
      const target = event.target;
      if (orientation === "vertical" && activation === "manual" &&
          !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.nativeEvent.isComposing &&
          target instanceof HTMLElement && target.parentElement === list && target.getAttribute("role") === "tab" &&
          target.getAttribute("aria-disabled") !== "true" &&
          ["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) event.preventDefault();
    }} onFocusCapture={event => {
      const strip = event.currentTarget.firstElementChild;
      if (strip instanceof HTMLElement) scrollTabIntoView(strip, event.target as HTMLElement, orientation);
    }}><TabList aria-label={label} className={styles.list}>{ordered.map(item => <Tab key={item.id} id={item.id}
      data-tab-id={item.id} data-overflow-hidden={!visible.includes(item.id)||undefined} aria-hidden={!visible.includes(item.id)||undefined}
      aria-label={item.label} className={styles.tab}>{item.icon && <span aria-hidden="true" className={styles.icon}>{item.icon}</span>}<span className={styles.tabLabel} title={menuMode?item.label:undefined}>{item.label}</span></Tab>)}</TabList>
      {menuMode&&<div className={styles.more} data-overflow-hidden={!hidden.length||undefined} aria-hidden={!hidden.length||undefined}>
        <Menu label={moreLabel} open={menuOpen&&hidden.length>0} onOpenChange={setMenuOpen}
          trigger={<IconButton ref={more} label={moreLabel}><MoreHorizIcon/></IconButton>}
          items={hidden.map(item=>({id:item.id,label:item.label,icon:item.icon,disabled:item.disabled}))}
          onAction={id=>{pendingFocus.current=id;select(id);setMenuOpen(false);}} placement="bottom end"/>
      </div>}
      <TabIndicator container={strip} value={selected} orientation={orientation} revision={visibleKey+JSON.stringify(items.map(item=>[item.id,item.label]))}/>
    </div>
    {items.map(item => <TabPanel key={item.id} id={item.id} className={styles.panel}>{item.content}</TabPanel>)}
  </AriaTabs>;
});
