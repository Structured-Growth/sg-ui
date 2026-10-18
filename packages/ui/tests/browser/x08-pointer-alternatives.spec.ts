import {expect,test} from '@playwright/test';

test('required hidden-field ranges have click equivalents with bounded rejected-host requests',async({page})=>{
  await page.goto('/fixtures/?id=migration-proofs-daterangeselector--pointer-alternatives&globals=locale:en-US;theme:light;density:compact');
  const nearest=page.getByRole('form',{name:'Required nearest range',exact:true});
  await expect(nearest.getByRole('textbox')).toHaveCount(0);
  await expect(nearest.getByRole('button',{name:'Clear',exact:true})).toBeDisabled();
  await nearest.getByRole('button',{name:'Adjust dates',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(nearest.getByRole('button',{name:'Move range one day later'})).toBeDisabled();
  await nearest.getByRole('button',{name:'End date',exact:true}).click();
  await nearest.getByRole('button',{name:'Move end one day earlier'}).click();
  await nearest.getByRole('button',{name:'Move end one day earlier'}).click();
  await nearest.getByRole('button',{name:'Whole range',exact:true}).click();
  await nearest.getByRole('button',{name:/Tuesday, October 13, 2026/}).click();
  await nearest.getByRole('button',{name:'Next month',exact:true}).click();
  await nearest.getByRole('button',{name:/Friday, November 13, 2026/}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(nearest.getByLabel('Range requests')).toHaveText(JSON.stringify([{start:'2026-10-07',end:'2026-10-08'},{start:'2026-10-07',end:'2026-10-07'},{start:'2026-10-13',end:'2026-10-13'},{start:'2026-11-13',end:'2026-11-13'}]));
  await nearest.getByRole('button',{name:'Adjust dates',exact:true}).click();
  const bounded=page.getByRole('form',{name:'Rejected bounded range',exact:true});
  await bounded.getByRole('button',{name:'Adjust dates',exact:true}).click();
  await bounded.getByRole('button',{name:'Start date',exact:true}).click();
  await expect(bounded.getByRole('button',{name:'Move start one day earlier'})).toBeDisabled();
  await bounded.getByRole('button',{name:/Thursday, October 8, 2026/}).click();
  await bounded.getByRole('button',{name:'Whole range',exact:true}).click();
  await bounded.getByRole('button',{name:'Move range one day later'}).click();
  await expect(bounded.getByLabel('Range requests')).toHaveText(JSON.stringify([{start:'2026-10-08',end:'2026-10-10'},{start:'2026-10-09',end:'2026-10-11'}]));
  await page.getByRole('button',{name:'Choose Popup trip',exact:true}).click();
  const popup=page.getByRole('dialog',{name:'Popup trip',exact:true});
  await popup.getByRole('button',{name:'Adjust dates',exact:true}).click();
  await popup.getByRole('button',{name:'End date',exact:true}).click();
  await popup.getByRole('button',{name:/Wednesday, October 7, 2026/}).click();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await popup.getByRole('button',{name:'End date',exact:true}).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Choose Popup trip',exact:true})).toBeFocused();
  expect(await bounded.evaluate(node=>Object.fromEntries(new FormData(node as HTMLFormElement)))).toEqual({'trip.start':'2026-10-07','trip.end':'2026-10-09'});
});

test('editable table rectangles can be selected with two clicks and cancelled',async({page})=>{
  await page.goto('/fixtures/?id=editors-pagerichtexteditorsection--saved-rich-document&globals=theme:light;density:compact');
  const editor=page.getByRole('textbox',{name:'Saved rich document',exact:true});
  await expect(editor).toBeVisible();
  const cells=editor.locator('table').first().locator('td,th');
  await expect(cells.first()).toBeVisible();
  const count=await cells.count();
  expect(count).toBeGreaterThan(1);
  const action=page.getByRole('button',{name:'Select table cells',exact:true});
  await action.click();await cells.first().click();await cells.last().click();
  await expect(editor.locator('.editor-table-cell-selected')).toHaveCount(count);
  await expect(action).toHaveAttribute('aria-pressed','false');
  await action.click();await cells.first().click();await page.keyboard.press('Escape');
  await expect(action).toHaveAttribute('aria-pressed','false');
  await page.getByRole('button',{name:'Make read-only',exact:true}).click();
  await expect(action).toHaveCount(0);
});


test('resizable shelf widths have bounded inline single-pointer steps in LTR/start and RTL/end',async({page})=>{
  await page.goto('/fixtures/?id=foundations-foundation-catalogue--pointer-panel-widths&globals=theme:light;density:compact');
  for(const side of ['start','end']){
    const panel=page.getByRole('region',{name:`${side} notes`,exact:true});
    const width=()=>panel.evaluate(element=>element.getBoundingClientRect().width);
    await expect(panel).toBeVisible();
    expect(await width()).toBeCloseTo(320,0);
    await panel.getByRole('button',{name:'Wider',exact:true}).click();
    await expect.poll(width).toBeCloseTo(321,0);
    await panel.getByRole('button',{name:'Wider',exact:true}).click();
    await expect.poll(width).toBeCloseTo(322,0);
    await expect(panel.getByRole('button',{name:'Wider',exact:true})).toBeDisabled();
    await panel.getByRole('button',{name:'Narrower',exact:true}).click();
    await expect.poll(width).toBeCloseTo(321,0);
    await expect(panel.getByRole('separator').getByRole('button')).toHaveCount(0);
    await expect(page.getByLabel(`${side} width requests`,{exact:true})).toHaveText('[321,322,321]');
    await panel.getByRole('button',{name:'Close panel',exact:true}).click();
    await page.getByRole('navigation',{name:`${side} width tools`,exact:true}).getByRole('button',{name:`${side} notes`,exact:true}).click();
    await expect.poll(width).toBeCloseTo(321,0);
    await expect(panel.getByRole('textbox',{name:'Panel draft'})).toHaveValue('Retain draft');
  }
});
