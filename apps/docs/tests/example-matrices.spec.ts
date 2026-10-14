import {test, expect} from '@playwright/test';

test('button groups show independent orientation/density/joined examples with live copyable source', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/docs/components/button-group');
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const references: {title:string; code:string}[]=[];
  for(const orientation of ['horizontal','vertical']) for(const density of ['compact','comfortable']) for(const joined of [false,true]) {
    const title=`${orientation==='horizontal'?'Horizontal':'Vertical'} · ${density} · ${joined?'joined':'separate'}`;
    const region=page.getByRole('region',{name:title,exact:true});
    const preview=region.locator('[data-docs-preview]');
    const group=preview.getByRole('group',{name:title,exact:true});
    await expect(preview).toHaveAttribute('data-sgui-density',density);
    await expect(group).toHaveAttribute('data-orientation',orientation);
    if(joined) await expect(group).toHaveAttribute('data-joined');
    else await expect(group).not.toHaveAttribute('data-joined');
    const first=(await group.getByRole('button').nth(0).boundingBox())!;
    const second=(await group.getByRole('button').nth(1).boundingBox())!;
    if(orientation==='horizontal') {expect(second.x).toBeGreaterThan(first.x);expect(Math.abs(second.y-first.y)).toBeLessThan(1);}
    else {expect(second.y).toBeGreaterThan(first.y);expect(Math.abs(second.x-first.x)).toBeLessThan(1);}
    references.push({title,code:(await region.getByLabel(`Source: ${title}`,{exact:true}).textContent())!});
  }
  await playground.getByRole('button',{name:/orientation/}).click();
  await page.getByRole('option',{name:'vertical',exact:true}).click();
  await playground.getByRole('button',{name:/Preview density/}).click();
  await page.getByRole('option',{name:'Compact',exact:true}).click();
  await playground.getByRole('textbox',{name:'label',exact:true}).fill('Playground only');
  const current=playground.locator('[data-docs-preview]');
  await expect(current).toHaveAttribute('data-sgui-density','compact');
  await expect(current.getByRole('group',{name:'Playground only',exact:true})).toHaveAttribute('data-orientation','vertical');
  for(const reference of references) {
    const region=page.getByRole('region',{name:reference.title,exact:true});
    await expect(region.getByLabel(`Source: ${reference.title}`,{exact:true})).toHaveText(reference.code);
    await expect(region.getByRole('status')).toHaveText('No action yet');
  }
  const title='Vertical · compact · joined';
  const reference=page.getByRole('region',{name:title,exact:true});
  await reference.getByRole('button',{name:'Save draft',exact:true}).click();
  await expect(reference.getByRole('status')).toHaveText('Draft saved locally');
  await expect(playground.getByRole('status')).toHaveText('No action yet');
  await expect(page.getByRole('region',{name:'Horizontal · compact · joined',exact:true}).getByRole('status')).toHaveText('No action yet');
  await reference.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
  const code=reference.getByLabel(`Source: ${title}`,{exact:true});
  await expect(code).toContainText('useState("Draft saved locally")');
  await reference.getByRole('button',{name:`Copy code: ${title}`,exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
});
