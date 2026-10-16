import {test,expect} from '@playwright/test';
const host='/fixtures/?id=migration-proofs-primitive-acceptance--';
test('responsive container, nested surfaces, wrapping and native Tab order',async({page})=>{
  await page.goto(host+'layout&globals=a11y.manual:!true');
  const row=page.getByTestId('responsive');
  for(const width of [900,540]){
    await page.setViewportSize({width,height:760});
    await expect.poll(()=>row.evaluate(e=>getComputedStyle(e).flexDirection)).toBe(width>608?'row':'column');
    const bounds=await row.evaluate(e=>Array.from(e.children,n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
    if(width>608){expect(Math.abs(bounds[0].y-bounds[1].y)).toBeLessThan(1);expect(bounds[1].x).toBeGreaterThan(bounds[0].x+bounds[0].w);}
    else {expect(bounds[1].y).toBeGreaterThan(bounds[0].y+bounds[0].h);}
    await test.info().attach('geometry-'+width,{body:JSON.stringify(bounds),contentType:'application/json'});
  }
  const wrap=await page.getByTestId('wrap-item').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));expect(wrap[2]).toBeGreaterThan(wrap[0]);
  const light=await page.getByTestId('light-surface').evaluate(e=>getComputedStyle(e).backgroundColor);
  const dark=await page.getByTestId('dark-surface').evaluate(e=>getComputedStyle(e).backgroundColor); expect(light).not.toBe(dark);
  await expect(page.getByRole('separator')).toHaveCount(2);
  await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'First action'})).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'Second action'})).toBeFocused();
  await page.addStyleTag({content:'html{font-size:200%}'}); // enlarged text, not browser zoom
  await page.emulateMedia({forcedColors:'active'});
  for(const name of ['First action','Second action'])await expect(page.getByRole('button',{name})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await test.info().attach('enlarged-forced-colors',{body:await page.screenshot(),contentType:'image/png'});
});
test('grouped text associations, required validation, canceled multiline reset and replaced owner',async({page})=>{
  await page.goto(host+'grouped-fields&globals=a11y.manual:!true');
  const group=page.getByRole('group',{name:'Contact details'}); await expect(group).toHaveAccessibleDescription('Both names are required.');
  for(const name of ['Given name','Family name']){
    const field=page.getByRole('textbox',{name,exact:true}); await expect(field).toHaveAccessibleDescription('Both names are required.');
    await field.fill('');
  }
  const summary=page.getByRole('textbox',{name:'Contact summary',exact:true});await summary.fill('');
  await page.getByRole('button',{name:'Validate contact'}).click();
  for(const name of ['Given name','Family name','Contact summary'])await expect(page.getByRole('textbox',{name,exact:true})).toHaveAttribute('aria-invalid','true');
  const requests=await page.getByLabel('Field requests').textContent();
  await page.getByRole('button',{name:'Reset contact'}).click();await expect(summary).toHaveAttribute('aria-invalid','true');await expect(summary).toHaveValue('');
  await page.getByLabel('Cancel reset',{exact:true}).uncheck();await page.getByRole('button',{name:'Reset contact'}).click();await expect(summary).toHaveValue('Initial summary');
  await expect(summary).not.toHaveAttribute('aria-invalid','true');await expect(page.getByLabel('Field requests')).toHaveText(requests!);
  await summary.fill('Draft');const latestRequests=await page.getByLabel('Field requests').textContent();
  await page.getByRole('button',{name:'Replace form'}).click();await expect(summary).toHaveValue('Draft');
  await page.getByRole('button',{name:'Reset contact'}).click();await expect(summary).toHaveValue('Latest summary');
  await expect(page.getByLabel('Field requests')).toHaveText(latestRequests!);
  expect(await page.getByRole('form',{name:'Grouped contact'}).evaluate(f=>Object.fromEntries(new FormData(f as HTMLFormElement)))).toEqual({given:'Alex',family:'Learner',summary:'Latest summary',host:'Host summary'});
});
test('empty and disabled required choices are host-gated; delegated reset restores latest default silently',async({page})=>{
  await page.goto(host+'required-choices&globals=a11y.manual:!true');const form=page.getByRole('form',{name:'Required choices'});
  const valid=()=>form.evaluate(f=>(f as HTMLFormElement).checkValidity());const data=()=>form.evaluate(f=>Object.fromEntries(new FormData(f as HTMLFormElement)));
  expect(await valid()).toBe(true);expect(await data()).toEqual({});
  await page.getByRole('button',{name:'Disable all choices'}).click();expect(await valid()).toBe(true);expect(await data()).toEqual({});
  await page.getByRole('button',{name:'Before choices'}).click();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'After choices'})).toBeFocused();
  await page.getByRole('button',{name:'Enable choices'}).click();await expect(page.getByRole('radio',{name:'Self',exact:true})).not.toBeChecked();expect(await valid()).toBe(false);
  await page.getByRole('button',{name:'Before choices'}).click();await page.keyboard.press('Tab');await expect(page.getByRole('radio',{name:'Self',exact:true})).toBeFocused();await expect(page.getByLabel('Radio requests')).toHaveText('[]');
  await page.getByRole('radio',{name:'Live',exact:true}).check();const requests=await page.getByLabel('Radio requests').textContent();
  await page.getByRole('button',{name:'Replace radio default'}).click();await page.getByRole('button',{name:'Reset choices'}).click();await expect(page.getByRole('radio',{name:'Live',exact:true})).toBeChecked();
  await page.getByLabel('Cancel radio reset').uncheck();await page.getByRole('button',{name:'Reset choices'}).click();await expect(page.getByRole('radio',{name:'Review',exact:true})).toBeChecked();
  expect(await data()).toEqual({delivery:'review'});await expect(page.getByLabel('Radio requests')).toHaveText(requests!);
});
test('controlled tab requests preserve host authority at both densities and orientations',async({page})=>{
  await page.goto(host+'controlled-tabs&globals=a11y.manual:!true');
  for(const density of ['compact','comfortable'])for(const orientation of ['horizontal','vertical'])for(const activation of ['automatic','manual']){
    const region=page.getByRole('region',{name:`${density} ${orientation} ${activation}`,exact:true});
    const first=region.getByRole('tab',{name:'First',exact:true}),last=region.getByRole('tab',{name:'Last',exact:true});
    await first.focus();await page.keyboard.press(orientation==='horizontal'?'ArrowRight':'ArrowDown');await expect(last).toBeFocused();
    if(activation==='manual')await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-selected','true');await expect(region.getByLabel('Tab requests')).toHaveText('["last"]');
    await region.getByLabel('Accept tab requests').check();await first.focus();await page.keyboard.press(orientation==='horizontal'?'ArrowRight':'ArrowDown');
    if(activation==='manual')await page.keyboard.press('Enter');await expect(last).toHaveAttribute('aria-selected','true');
    await expect(region.getByRole('tabpanel')).toHaveText('Last content');
    await page.setViewportSize({width:520,height:850});await expect(last).toHaveAttribute('aria-selected','true');
    const style=await last.evaluate(e=>({width:getComputedStyle(e).outlineWidth,style:getComputedStyle(e).outlineStyle}));
    expect(style.style).not.toBe('none');expect(parseFloat(style.width)).toBeGreaterThan(0);
  }
});
