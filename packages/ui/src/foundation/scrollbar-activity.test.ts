// @vitest-environment jsdom
import {afterEach,expect,it,vi} from "vitest";
import {observeScrollbarActivity} from "./scrollbar-activity";
afterEach(()=>{vi.useRealTimers();document.body.replaceChildren();});
it("reveals the actual scrolling pane and refreshes the idle delay, including scoped portals",()=>{
  vi.useFakeTimers();
  document.body.innerHTML='<div data-sgui-scope><div id="pane"></div><div id="sibling"></div></div><div data-sgui-scope id="portal"></div><div id="outside"></div>';
  const release=observeScrollbarActivity(document);
  const pane=document.getElementById('pane')!;
  pane.dispatchEvent(new Event('scroll'));
  expect(pane.hasAttribute('data-sgui-scrolling')).toBe(true);
  expect(document.getElementById('sibling')!.hasAttribute('data-sgui-scrolling')).toBe(false);
  vi.advanceTimersByTime(800);pane.dispatchEvent(new Event('scroll'));vi.advanceTimersByTime(800);
  expect(pane.hasAttribute('data-sgui-scrolling')).toBe(true);
  vi.advanceTimersByTime(200);expect(pane.hasAttribute('data-sgui-scrolling')).toBe(false);
  const portal=document.getElementById('portal')!;portal.dispatchEvent(new Event('scroll'));
  expect(portal.hasAttribute('data-sgui-scrolling')).toBe(true);
  const outside=document.getElementById('outside')!;outside.dispatchEvent(new Event('scroll'));
  expect(outside.hasAttribute('data-sgui-scrolling')).toBe(false);
  release();expect(portal.hasAttribute('data-sgui-scrolling')).toBe(false);
});
it("shares document observation between scopes and cleans up after the last owner",()=>{
  vi.useFakeTimers();document.body.innerHTML='<div data-sgui-scope></div>';
  const root=document.body.firstElementChild!;
  const first=observeScrollbarActivity(document),second=observeScrollbarActivity(document);
  first();root.dispatchEvent(new Event('scroll'));
  expect(root.hasAttribute('data-sgui-scrolling')).toBe(true);
  second();expect(root.hasAttribute('data-sgui-scrolling')).toBe(false);
  root.dispatchEvent(new Event('scroll'));expect(root.hasAttribute('data-sgui-scrolling')).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
