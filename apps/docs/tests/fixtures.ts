import {test as base,type Page} from '@playwright/test';
export * from '@playwright/test';

async function examplesReady(page:Page) {
 if(!/^\/docs\/components\/[^/]+\/?$/.test(new URL(page.url()).pathname))return;
 await page.waitForFunction(()=>{
  const phases=[...document.querySelectorAll('[data-catalog-phase]')];
  if(phases.length)return phases.every(phase=>phase.querySelector('[data-docs-examples-ready="true"]'));
  return !!document.querySelector('[data-docs-examples-ready="true"]');
 });
}

/** Wait for dynamic client owners before non-retrying geometry/source reads. */
export const test=base.extend({page:async({page},use)=>{
 const goto=page.goto.bind(page);
 page.goto=async(...args)=>{const response=await goto(...args);await examplesReady(page);return response;};
 await use(page);
}});
