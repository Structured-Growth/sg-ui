import {type Page,expect} from '@playwright/test';
export async function openSiteTool(page:Page,name:'Demo settings'|'Page documentation') {
  const trigger=page.getByRole('navigation',{name:'Component tools navigation',exact:true}).getByRole('button',{name,exact:true});
  await expect(trigger).toBeVisible();
  if(await trigger.getAttribute('aria-expanded')!=='true')await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded','true');
}
export async function closeSiteTool(page:Page) {
  const active=page.getByRole('navigation',{name:'Component tools navigation',exact:true}).locator('button[aria-expanded="true"]');
  if(await active.count())await active.click();
}
