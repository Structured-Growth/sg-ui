// @vitest-environment node
import { expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
it('imports and server-renders an initially open nested dialog composition without browser globals', async () => {
 expect(typeof window).toBe('undefined'); expect(typeof document).toBe('undefined');
 const [{ Dialog }, { Provider }] = await Promise.all([
  import("./Dialog"),
  import("../Provider/Provider"),
 ]);
 const html = renderToString(createElement(Provider, {theme:'system', dir:'rtl', children:
  createElement(Dialog, {open:true, title:'Parent', onDismiss:()=>{}, children:
   createElement(Dialog, {open:true, title:'Child', onDismiss:()=>{}, children:'Host content'})})}));
 expect(html).toContain('data-sgui-theme="system"');
 expect(html).toContain('dir="rtl"');
 expect(typeof window).toBe('undefined'); expect(typeof document).toBe('undefined');
});
