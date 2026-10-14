import {test,expect} from '@playwright/test';
import catalog from '../content/catalog.json' with {type:'json'};

test('owned button composed actions do not change the comparison or playground',async({page})=>{
  await page.goto('/docs/components/owned-button');
  const comparison=page.getByRole('region',{name:'Compact and comfortable comparison',exact:true});
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const composed=page.getByRole('region',{name:'Composed example',exact:true});
  const beforeComparison=await comparison.locator('code').textContent();
  const beforePlayground=await playground.locator('code').textContent();
  await composed.getByRole('button',{name:'Save draft',exact:true}).click();
  await expect(composed.getByRole('status')).toHaveText('Draft');
  await expect(comparison.getByRole('status')).toHaveText(['No action yet','No action yet']);
  expect(await comparison.locator('code').textContent()).toBe(beforeComparison);
  expect(await playground.locator('code').textContent()).toBe(beforePlayground);
  await comparison.getByRole('button',{name:'Publish course',exact:true}).first().click();
  await expect(comparison.getByRole('status')).toHaveText(['Published locally','Published locally']);
  await expect(composed.getByRole('status')).toHaveText('Draft');
});

test('interacting with catalog panels leaves every sibling source snapshot unchanged',async({page})=>{
  test.setTimeout(180000);
  let interactions=0,changedSources=0;
  for(const entry of catalog)await test.step(entry.slug,async()=>{
    await page.goto(`/docs/components/${entry.slug}`);
    await expect(page.getByRole('heading',{name:'Prop playground',exact:true})).toBeVisible();
    const panels=page.locator('section[aria-labelledby]').filter({has:page.locator('[data-docs-preview]')});
    const count=await panels.count();
    for(let index=0;index<count;index++) {
      const before=await page.locator('code[aria-label^="Source:"]').allTextContents();
      const preview=panels.nth(index).locator('[data-docs-preview]').first();
      const textboxes=preview.getByRole('textbox');
      let interacted=false;
      for(let field=0;field<await textboxes.count();field++) {
        const textbox=textboxes.nth(field);
        if(await textbox.isVisible() && await textbox.isEditable()) {await textbox.fill('Independent example');interacted=true;break;}
      }
      if(!interacted) {
        const checkboxes=preview.getByRole('checkbox');
        for(let checkbox=0;checkbox<await checkboxes.count();checkbox++) {
          const control=checkboxes.nth(checkbox);
          if(await control.isVisible() && await control.isEnabled()) {await control.locator('xpath=ancestor::label[1]').click();interacted=true;break;}
        }
      }
      if(!interacted) {
        const buttons=preview.getByRole('button');
        for(let button=0;button<await buttons.count();button++) {
          const control=buttons.nth(button);
          if(await control.isVisible() && await control.isEnabled()) {await control.click();interacted=true;break;}
        }
      }
      if(!interacted)continue;
      interactions++;
      // Opening a menu/dialog is itself local state. Close overlays before the next panel.
      const after=await page.locator('code[aria-label^="Source:"]').allTextContents();
      expect(after.filter((_,i)=>i!==index),`${entry.slug}, panel ${index}: sibling source changed`).toEqual(before.filter((_,i)=>i!==index));
      if(after[index]!==before[index])changedSources++;
      await page.keyboard.press('Escape');await page.keyboard.press('Escape');
      const settled=await page.locator('code[aria-label^="Source:"]').allTextContents();
      expect(settled.filter((_,i)=>i!==index),`${entry.slug}, panel ${index}: dismissal changed a sibling`).toEqual(before.filter((_,i)=>i!==index));
    }
  });
  expect(interactions).toBeGreaterThan(100);
  expect(changedSources).toBeGreaterThan(30);
  console.log(`${interactions} catalog panel interactions; ${changedSources} current sources changed locally; sibling sources preserved`);
});
