import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const slug of ['text-field','text-area']){
 for(const density of ['compact','comfortable'])for(const placement of ['above','below'])test(`${slug}: aligned ${placement} messages at ${density} density`,async({page},info)=>{
  await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
  const title=`Messages ${placement} input — ${density}`;
  const panel=page.getByRole('region',{name:exampleName(title),exact:true}),preview=panel.locator('[data-docs-preview]');
  const fields=preview.getByRole('textbox');await expect(fields).toHaveCount(3);
  const positions=await fields.evaluateAll(elements=>elements.map(element=>element.getBoundingClientRect().top));
  expect(Math.max(...positions)-Math.min(...positions)).toBeLessThan(1);
  const input=preview.getByRole('textbox',{name:'Reference code',exact:true});
  await expect(input).toHaveAttribute('aria-invalid','true');
  const associations=await input.evaluate(element=>(element.getAttribute('aria-describedby')??'').split(' ').map(id=>document.getElementById(id)?.textContent).join(' '));
  expect(associations).toContain('A code for this course.');expect(associations).toContain('Use a unique reference code.');
  const order=await input.evaluate(element=>{
   const ids=(element.getAttribute('aria-describedby')??'').split(' ');
   return ids.filter(Boolean).map(id=>Boolean(document.getElementById(id)!.compareDocumentPosition(element)&Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(order.every(before=>before===(placement==='above'))).toBe(true);
  await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
  const source=(await panel.getByRole('code').textContent())!;
  expect(source).toContain(`descriptionPlacement="${placement}"`);expect(source).toContain(`errorPlacement="${placement}"`);
  expect(checkSources([{slug,source}])).toEqual([]);
  await info.attach('aligned-fields',{body:await preview.screenshot(),contentType:'image/png'});
  await page.setViewportSize({width:375,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
 test(`${slug}: playground independently changes description/error placement and source`,async({page})=>{
  await page.goto(`/docs/components/${slug}`);
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
  const field=preview.getByRole('textbox',{name:'Course subject',exact:true});
  await expect(field).toHaveValue('Design systems');
  const invalid=panel.getByRole('checkbox',{name:'Invalid',exact:true});await invalid.focus();await invalid.press('Space');
  await panel.getByRole('button',{name:/Description placement/}).click();await page.getByRole('option',{name:'Below input',exact:true}).click();
  await panel.getByRole('button',{name:/Error placement/}).click();await page.getByRole('option',{name:'Above input',exact:true}).click();
  const inputBox=(await field.boundingBox())!,descriptionBox=(await preview.getByText('Host-supplied course information.',{exact:true}).boundingBox())!,errorBox=(await preview.getByText('Please review this value.',{exact:true}).boundingBox())!;
  expect(descriptionBox.y).toBeGreaterThan(inputBox.y);expect(errorBox.y).toBeLessThan(inputBox.y);
  await expect(field).toHaveValue('Design systems');
  await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const source=(await panel.getByRole('code').textContent())!;
  expect(source).toContain('descriptionPlacement="below"');expect(source).toContain('errorPlacement="above"');
  expect(checkSources([{slug,source}])).toEqual([]);
 });
}

for(const slug of ['select','combo-box','checkbox','radio-group','switch','async-multi-select','date-field','time-field','date-picker','date-range-picker','search-field'])test(`${slug}: shared placement contract updates the field and its source`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
 await panel.getByRole('textbox',{name:'Description',exact:true}).fill('Placement guidance');
 const control=slug==='select'?preview.getByRole('button').first():slug==='combo-box'?preview.getByRole('combobox'):slug==='radio-group'?preview.getByRole('radio').first().locator('xpath=ancestor::label[1]'):slug==='checkbox'||slug==='switch'?preview.locator('[data-sgui-part="choice-control"]'):slug==='date-field'?preview.getByRole('spinbutton').first():slug==='search-field'||slug==='async-multi-select'?preview.getByRole('searchbox'):preview.getByRole('textbox').first();
 const initial=(await preview.getByText(/^Placement guidance/).boundingBox())!,initialControl=(await control.boundingBox())!;
 expect(initial.y).toBeLessThan(initialControl.y);
 await panel.getByRole('button',{name:/Description placement/}).click();await page.getByRole('option',{name:'Below input',exact:true}).click();
 expect((await preview.getByText(/^Placement guidance/).boundingBox())!.y).toBeGreaterThan((await control.boundingBox())!.y);
 const hasValidation=!['switch','async-multi-select','search-field'].includes(slug);
 if(hasValidation){
  const invalid=panel.getByRole('checkbox',{name:'Invalid',exact:true});await invalid.focus();await invalid.press('Space');
  await panel.getByRole('button',{name:/Error placement/}).click();await page.getByRole('option',{name:'Above input',exact:true}).click();
  const error=preview.getByText(slug.includes('date')||slug==='time-field'?'Please review this schedule.':'Please review this value.',{exact:true});
  expect((await error.boundingBox())!.y).toBeLessThan((await control.boundingBox())!.y);
 }
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain('descriptionPlacement="below"');if(hasValidation)expect(source).toContain('errorPlacement="above"');
 expect(checkSources([{slug,source}])).toEqual([]);
});

for(const slug of ['processing-grid','app-data-grid'])test(`${slug}: grid selection indicators remain visible with the shared choice-control structure`,async({page})=>{
 await page.goto(`/docs/components/${slug}`);
 const grid=slug==='processing-grid'?page.getByRole('region',{name:exampleName('Course data grid'),exact:true}).getByRole('grid',{name:'Courses',exact:true}):page.getByRole('region',{name:'AppDataGrid at a glance',exact:true}).getByRole('grid');
 const checkbox=grid.getByRole('checkbox').first(),control=checkbox.locator('xpath=ancestor::label[1]').locator('[data-sgui-part="choice-control"]');
 await expect(control).toBeVisible();expect((await control.boundingBox())!.width).toBeGreaterThan(15);
 await control.click();await expect(checkbox).toBeChecked();
});
