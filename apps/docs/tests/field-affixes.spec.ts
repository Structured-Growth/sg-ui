import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('fixed currency affixes preserve editing, native validation/data/reset and sibling state',async({page})=>{
 await page.goto('/docs/components/text-field');
 const form=page.getByRole('region',{name:exampleName('Whole-dollar native form'),exact:true});
 const input=form.getByRole('textbox',{name:'Amount in whole US dollars',exact:true});
 await input.fill('25.5');await form.getByRole('button',{name:'Review amount'}).click();
 await expect(input).toHaveAttribute('aria-invalid','true');await expect(form.getByRole('status')).toHaveCount(0);
 await input.fill('125');await input.press('Tab');await expect(input).not.toHaveAttribute('aria-invalid','true');
 await form.getByRole('button',{name:'Review amount'}).click();
 await expect(form.getByRole('status')).toHaveText('Draft amount: USD 125.00');
 expect(await input.evaluate(node=>new FormData((node as HTMLInputElement).form!).get('amount'))).toBe('125');
 const sibling=page.getByRole('region',{name:exampleName('Whole dollars · inline · compact'),exact:true});
 await expect(sibling.getByRole('textbox')).toHaveValue('25');
 await form.getByRole('button',{name:'Reset amount'}).click();await expect(input).toHaveValue('25');
 await expect(form.getByRole('status')).toHaveCount(0);
 const readonly=page.getByRole('region',{name:exampleName('Read-only amount'),exact:true});
 await readonly.scrollIntoViewIfNeeded();const readonlyInput=readonly.getByRole('textbox');
 await readonlyInput.focus();await readonlyInput.press('End');await readonlyInput.press('9');await expect(readonlyInput).toHaveValue('25');
 const disabled=page.getByRole('region',{name:exampleName('Disabled amount'),exact:true});await expect(disabled.getByRole('textbox')).toBeDisabled();
});

test('affixes share the field frame without covering text across density, appearance and RTL',async({page},info)=>{
 await page.goto('/docs/components/text-field');
 for(const appearance of ['inline','subtle'])for(const density of ['compact','comfortable']){
  const panel=page.getByRole('region',{name:exampleName(`Whole dollars · ${appearance} · ${density}`),exact:true});await panel.scrollIntoViewIfNeeded();
  const input=panel.getByRole('textbox'),frame=panel.locator('[data-affixes]'),prefix=panel.locator('[data-sgui-part="field-prefix"]'),suffix=panel.locator('[data-sgui-part="field-suffix"]');
  const a=(await prefix.boundingBox())!,b=(await input.boundingBox())!,c=(await suffix.boundingBox())!,box=(await frame.boundingBox())!;
  expect(a.x+a.width).toBeLessThanOrEqual(b.x);expect(b.x+b.width).toBeLessThanOrEqual(c.x);
  expect(box.height).toBe(density==='compact'?32:44);
  expect(c.width).toBeGreaterThan(16);await expect(prefix).toHaveAttribute('aria-hidden','true');await expect(suffix).toHaveAttribute('aria-hidden','true');
  if(appearance==='subtle'){await expect(prefix).toHaveCSS('border-inline-end-width','1px');await expect(suffix).toHaveCSS('border-inline-start-width','1px');}
  await page.mouse.click(a.x+a.width/2,a.y+a.height/2);await expect(input).toBeFocused();
  await input.press('ArrowLeft');await expect(frame).toHaveCSS('outline-style','solid');
  await input.fill('123456789012345678901234567890');await expect(suffix).toHaveText('.00');await expect(prefix).toHaveText('$');
 }
 const rtl=page.getByRole('region',{name:exampleName('Affixes in right-to-left layout'),exact:true});await rtl.scrollIntoViewIfNeeded();
 const start=(await rtl.locator('[data-sgui-part="field-prefix"]').boundingBox())!,end=(await rtl.locator('[data-sgui-part="field-suffix"]').boundingBox())!;expect(start.x).toBeGreaterThan(end.x);
 const icons=page.getByRole('region',{name:exampleName('Icons with text affixes'),exact:true});await icons.scrollIntoViewIfNeeded();
 await expect(icons.getByRole('img')).toHaveCount(0);await expect(icons.getByRole('textbox')).toHaveAccessibleName('Course code in the public catalog');
 await page.setViewportSize({width:480,height:900});
 const domain=page.getByRole('region',{name:exampleName('Fixed URL parts'),exact:true});await domain.scrollIntoViewIfNeeded();
 const fits=await domain.locator('[data-affixes]').evaluate(node=>node.scrollWidth<=node.clientWidth+1);expect(fits).toBe(true);
 await domain.screenshot({path:info.outputPath('fixed-url-parts.png')});
 await page.emulateMedia({forcedColors:'active'});await domain.getByRole('textbox').focus();await domain.getByRole('textbox').press('ArrowLeft');
 await expect(domain.locator('[data-affixes]')).toHaveCSS('outline-style','solid');await expect(domain.locator('[data-affixes]')).toHaveCSS('border-top-style','solid');
});

test('text-field affix controls update only their preview/source and copied code compiles',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/docs/components/text-field');
 for(const toggle of await page.getByRole('button',{name:/^Show source:/}).all())await toggle.click();
 const initial=await page.locator('code[aria-label^="Source:"]').allTextContents();
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const sibling=page.getByRole('region',{name:exampleName('Whole dollars · inline · compact'),exact:true});const before=await sibling.getByRole('code').textContent();
 await playground.getByRole('textbox',{name:'Prefix',exact:true}).fill('$ "<USD>" {fixed}');
 await playground.getByRole('textbox',{name:'Suffix',exact:true}).fill('.00');
 await playground.getByRole('button',{name:/Affix appearance/}).click();await page.getByRole('option',{name:'Shaded segments',exact:true}).click();
 const preview=playground.locator('[data-docs-preview]');await preview.getByRole('textbox').fill('125');
 await expect(preview.locator('[data-sgui-part="field-prefix"]')).toHaveText('$ "<USD>" {fixed}');
 const code=(await playground.getByRole('code').textContent())!;expect(code).toContain('affixAppearance="subtle"');expect(code).toContain('suffix={".00"}');
 expect(await sibling.getByRole('code').textContent()).toBe(before);
 await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(code);
 expect(checkSources([...initial,code].map((source,index)=>({slug:`affix-${index}`,source})))).toEqual([]);
});
