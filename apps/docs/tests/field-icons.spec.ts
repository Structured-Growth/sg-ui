import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources,type SourceSnapshot} from './check-sources';
import {openSiteTool,closeSiteTool} from './site-tools';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

for(const slug of ['text-field','select','combo-box','async-multi-select'])test(`${slug}: placeholders, logical icons, native interactions and isolated sources`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:'Material Design',exact:true}).click();
 await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:slug.includes('combo')||slug.includes('async')?'Dark':'Light',exact:true}).click();await closeSiteTool(page);
 const sources:SourceSnapshot[]=[];
 const role=slug==='select'?'button':slug==='combo-box'?'combobox':'searchbox';
 for(const density of ['compact','comfortable'])for(const [position,title] of [['none','Placeholder only'],['start','Icon at the start'],['end','Icon at the end'],['both','Icons at both ends']]){
  const name=`${title} — ${density}`,panel=page.getByRole('region',{name:exampleName(name),exact:true}),preview=panel.locator('[data-docs-preview]'),input=preview.getByRole(role).first();
  await preview.scrollIntoViewIfNeeded();
  if(slug==='select')await expect(input).toContainText('Choose a course subject');else await expect(input).toHaveAttribute('placeholder','Search course subjects');
  const start=preview.locator('[data-sgui-part="field-start-icon"]'),end=preview.locator('[data-sgui-part="field-end-icon"]');
  await expect(start).toHaveCount(position==='start'||position==='both'?1:0);await expect(end).toHaveCount(position==='end'||position==='both'?1:0);
  const frame=slug==='select'||position==='none'?input:preview.locator('[data-sgui-part="field-icon-control"]');
  await expect(frame).toHaveCSS('border-top-left-radius','24px');expect((await frame.boundingBox())!.height).toBe(density==='compact'?32:44);
  for(const icon of [start,end])if(await icon.count()){
   expect(await icon.evaluate(element=>!!element.closest('[aria-hidden="true"]'))).toBe(true);
   const a=(await icon.boundingBox())!,b=(await frame.boundingBox())!;expect(Math.abs(a.y+a.height/2-b.y-b.height/2)).toBeLessThan(1);
  }
  if(position==='both'){
   const a=(await start.boundingBox())!,b=(await end.boundingBox())!;expect(a.x).toBeLessThan(b.x);
   await preview.evaluate(element=>element.setAttribute('dir','rtl'));expect((await start.boundingBox())!.x).toBeGreaterThan((await end.boundingBox())!.x);await preview.evaluate(element=>element.removeAttribute('dir'));
   await input.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
   if(slug!=='select')await expect(frame).toHaveCSS('outline-style','solid');
   await info.attach(`${slug}-${density}`,{body:await preview.screenshot({path:info.outputPath(`${density}.png`)}),contentType:'image/png'});
  }
  await panel.getByRole('button',{name:`Show source: ${name}`,exact:true}).click();sources.push({slug:`${slug}-${density}-${position}`,source:(await panel.getByRole('code').textContent())!});
 }
 expect(checkSources(sources)).toEqual([]);
 const both=page.getByRole('region',{name:exampleName('Icons at both ends — compact'),exact:true}),before=sources.find(source=>source.slug===`${slug}-compact-both`)!.source;
 const preview=both.locator('[data-docs-preview]'),input=preview.getByRole(role).first();
 await preview.scrollIntoViewIfNeeded();await waitForNativeScrollToSettle(preview);
 if(slug==='select'){
  await input.click();await page.getByRole('option',{name:'User research',exact:true}).click();await expect(input).toContainText('User research');await expect(input).toBeFocused();
 }else if(slug==='combo-box'){
  await input.click();await input.pressSequentially('User');await expect(page.getByRole('option',{name:'User research',exact:true})).toBeVisible();await input.press('ArrowDown');await input.press('Enter');await expect(input).toHaveValue('User research');
 }else if(slug==='async-multi-select'){
  await input.fill('research');await preview.getByRole('option',{name:'User research',exact:true}).click();await expect(preview.getByRole('button',{name:'Remove User research',exact:true})).toBeVisible();
 }else {await input.fill('Design');await expect(input).toHaveValue('Design');}
 await expect(both.getByRole('code')).not.toHaveText(before);
 const untouched=page.getByRole('region',{name:exampleName('Icons at both ends — comfortable'),exact:true});await expect(untouched.getByRole('code')).toHaveText(sources.find(source=>source.slug===`${slug}-comfortable-both`)!.source);
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await playground.getByRole('button',{name:/Field icons/}).click();await page.getByRole('option',{name:'Both ends',exact:true}).click();await playground.getByRole('textbox',{name:'Placeholder text',exact:true}).fill('Choose or enter a subject');await playground.getByRole('button',{name:'Empty example field',exact:true}).click();
 const main=playground.locator('[data-docs-preview]');await expect(main.locator('[data-sgui-part="field-start-icon"]')).toHaveCount(1);await expect(main.locator('[data-sgui-part="field-end-icon"]')).toHaveCount(1);
 if(slug==='select')await expect(main.getByRole('button').first()).toContainText('Choose or enter a subject');else await expect(main.getByRole(slug==='text-field'?'textbox':role).first()).toHaveAttribute('placeholder','Choose or enter a subject');
 await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const source=(await playground.getByRole('code').textContent())!;expect(source).toContain('startIcon={<SearchIcon size={16}/>}');expect(source).toContain('endIcon={<SchoolIcon size={16}/>}');expect(checkSources([{slug:`${slug}-playground`,source}])).toEqual([]);
 await page.emulateMedia({forcedColors:'active'});const frame=main.locator('[data-sgui-part="field-icon-control"]');if(await frame.count())await expect(frame).toHaveCSS('border-style','solid');
 await page.setViewportSize({width:375,height:900});await main.scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
