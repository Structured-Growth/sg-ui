import {test,expect,type Page,type Locator} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
const day=(host:Locator,n:number,month='October')=>{const m=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(month)+1;return host.getByRole('button',{name:new RegExp(`${month} ${n}, 2026`)}).and(host.locator(`[data-sgui-date="2026-${String(m).padStart(2,'0')}-${String(n).padStart(2,'0')}"]:not([data-outside-month])`)).first();};
async function drag(page:Page,from:Locator,to:Locator,escape=false){const a=(await from.boundingBox())!,b=(await to.boundingBox())!;await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});if(escape)await page.keyboard.press('Escape');await page.mouse.up();}
async function choose(page:Page,panel:Locator,label:string,value:string){await panel.getByRole('button',{name:new RegExp(label)}).click();await page.getByRole('option',{name:value,exact:true}).click();}
async function selectedRange(panel:Locator,start:string,end:string){
 await expect(panel.locator('[data-range-start]:not([data-outside-month])')).toHaveAttribute('data-sgui-date',start);
 await expect(panel.locator('[data-range-end]:not([data-outside-month])')).toHaveAttribute('data-sgui-date',end);
}

test('resize endpoint days, move a two-day trip, cancel a drag and lock the current duration',async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Move or resize a trip'),exact:true});
 const trigger=panel.getByRole('button',{name:'Choose Travel interval',exact:true});await trigger.click();const dialog=page.getByRole('dialog',{name:'Travel interval',exact:true});
 await expect(dialog.getByRole('textbox',{name:'Start date',exact:true})).toHaveCount(0);
 await page.keyboard.down('Shift');await drag(page,day(dialog,7),day(dialog,12));await page.keyboard.up('Shift');await selectedRange(dialog,'2026-10-12','2026-10-13');
 await drag(page,day(dialog,13),day(dialog,16));await selectedRange(dialog,'2026-10-12','2026-10-16');
 await drag(page,day(dialog,14),day(dialog,21),true);await selectedRange(dialog,'2026-10-12','2026-10-16');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.getByRole('textbox',{name:'Travel interval',exact:true})).toHaveValue('10/12/2026 – 10/16/2026');
 const lock=panel.getByRole('checkbox',{name:'Keep trip length',exact:true});await lock.focus();await lock.press('Space');await expect(lock).toBeChecked();await trigger.click();
 await expect(dialog.locator('[data-range-handle]')).toHaveCount(0);await drag(page,day(dialog,16),day(dialog,24));await selectedRange(dialog,'2026-10-20','2026-10-24');
 await info.attach('fixed-range',{body:await dialog.screenshot({path:info.outputPath('fixed-range.png')}),contentType:'image/png'});
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 await panel.getByRole('button',{name:'Show source: Move or resize a trip',exact:true}).click();expect(checkSources([{slug:'trip',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
});

test('independent months, scrolling browser, active endpoints and immediate commit are real configurations',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Independent From and To months'),exact:true});await panel.getByRole('button',{name:'Choose Travel interval',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Travel interval',exact:true});const previous=dialog.getByRole('button',{name:'Previous month',exact:true}),next=dialog.getByRole('button',{name:'Next month',exact:true});
 await previous.first().click();await next.last().click();await expect(dialog.getByRole('heading',{name:/September 2026$/})).toBeVisible();await expect(dialog.getByRole('heading',{name:/December 2026$/})).toBeVisible();
 await day(dialog,5,'September').click();await day(dialog,13,'December').click();await expect(dialog.getByRole('textbox',{name:'Start date',exact:true})).toHaveValue('09/05/2026');await expect(dialog.getByRole('textbox',{name:'End date',exact:true})).toHaveValue('12/13/2026');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 const scrolling=page.getByRole('region',{name:exampleName('Scrolling month browser'),exact:true});await scrolling.getByRole('button',{name:'Choose Travel interval',exact:true}).click();await expect(dialog.getByRole('grid')).toHaveCount(12);await dialog.getByRole('button',{name:'Next months',exact:true}).click();await expect(dialog.getByRole('heading',{name:/October 2027$/})).toBeVisible();await dialog.getByRole('button',{name:'Previous months',exact:true}).click();await day(dialog,31).focus();await day(dialog,31).press('ArrowRight');await expect(day(dialog,1,'November')).toBeFocused();await expect(dialog.getByRole('grid').first()).toHaveAttribute('aria-label',/October 2026/);await page.keyboard.press('Escape');
 const endpoints=page.getByRole('region',{name:exampleName('Selection-aware availability'),exact:true});await endpoints.getByRole('button',{name:'Choose Travel interval',exact:true}).click();
 await dialog.getByRole('button',{name:'Start date',exact:true}).click();await expect(day(dialog,13)).toHaveAttribute('aria-disabled','true');await dialog.getByRole('button',{name:'End date',exact:true}).click();await day(dialog,13).click();await expect(dialog.getByRole('textbox',{name:'End date',exact:true})).toHaveValue('10/13/2026');await page.keyboard.press('Escape');
 const immediate=page.getByRole('region',{name:exampleName('Immediate range selection'),exact:true});await immediate.getByRole('button',{name:'Choose Travel interval',exact:true}).click();await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toHaveCount(0);await day(dialog,20).click();await expect(immediate.getByRole('textbox',{name:'Travel interval',exact:true})).toHaveValue('10/07/2026 – 10/20/2026');
});

test('whole period selection and responsive drawer retain the same draft',async({page},info)=>{
 await page.goto('/docs/components/period-picker');const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 for(const [unit,expected] of [['month','2026-10-01 – 2026-10-31'],['quarter','2026-10-01 – 2026-12-31'],['year','2026-01-01 – 2026-12-31']] as const){
  await choose(page,panel,'Period unit',unit);await panel.locator('[data-docs-preview]').getByRole('button',{name:'Reporting period',exact:true}).click();await page.getByRole('dialog',{name:'Reporting period',exact:true}).getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.locator('[data-docs-preview]').getByRole('button')).toHaveText(expected);
 }
 await choose(page,panel,'Period unit','week');await panel.locator('[data-docs-preview]').getByRole('button',{name:'Reporting period',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Reporting period',exact:true});await day(dialog,7).click();await expect(dialog.locator('[data-selected]:not([data-outside-month])')).toHaveCount(7);
 await page.setViewportSize({width:390,height:900});const overlay=dialog.locator('xpath=ancestor::*[@data-trigger="DialogTrigger"][1]');const box=(await overlay.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);await info.attach('period-drawer',{body:await page.screenshot({path:info.outputPath('period-drawer.png')}),contentType:'image/png'});
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.locator('[data-docs-preview]').getByRole('button')).toHaveText('2026-10-05 – 2026-10-11');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();expect(checkSources([{slug:'period',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
});

test('datetime interval normalizes compact times, increments minutes and guards reversed values',async({page})=>{
 await page.goto('/docs/components/date-time-range-picker');const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});await panel.locator('[data-docs-preview]').getByRole('button',{name:'Meeting interval',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Meeting interval',exact:true});
 const end=dialog.getByRole('textbox',{name:'End time',exact:true});await end.fill('1300');await end.press('Tab');await dialog.getByRole('button',{name:'Choose End time',exact:true}).click();const time=page.getByRole('dialog',{name:'End time',exact:true});await time.getByRole('button',{name:/Minute/}).click();await expect(page.getByRole('option')).toHaveCount(4);await page.getByRole('option',{name:'15',exact:true}).click();await time.getByRole('button',{name:'Apply',exact:true}).click();await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(panel.locator('[data-docs-preview]').getByRole('button')).toContainText('13:15:00');
 await panel.locator('[data-docs-preview]').getByRole('button').click();await dialog.getByRole('textbox',{name:'End time',exact:true}).fill('7a');await dialog.getByRole('textbox',{name:'End time',exact:true}).press('Tab');await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();expect(checkSources([{slug:'datetime-range',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
});

test('comparison selection is atomic and invalid child text blocks outer Apply',async({page})=>{
 await page.goto('/docs/components/date-range-comparison-picker');const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});await panel.locator('[data-docs-preview]').getByRole('button',{name:'Compare reporting periods',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Compare reporting periods',exact:true});
 await choose(page,dialog,'Compare with','Previous year');await expect(dialog.getByRole('textbox',{name:'Comparison period',exact:true})).toHaveValue('10/07/2025 – 10/16/2025');
 const primary=dialog.getByRole('textbox',{name:'Primary period',exact:true});await primary.fill('bad date');await primary.press('Tab');await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();await primary.fill('10/1/26 - 10/5/26');await primary.press('Tab');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('2025-10-01');expect(checkSources([{slug:'comparison',source}])).toEqual([]);
});

test('expanded calendar references compile against the public package',async({page})=>{
 const sources:{slug:string;source:string}[]=[];
 for(const slug of ['date-range-picker','date-range-selector']){
  await page.goto(`/docs/components/${slug}`);
  for(const title of ['Move or resize a trip','Fixed duration from an existing range','Independent From and To months','Scrolling month browser','Active start and end','Immediate range selection','Selection-aware availability']){
   const panel=page.getByRole('region',{name:exampleName(title),exact:true});await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();sources.push({slug:`${slug}-${title}`,source:(await panel.getByRole('code').textContent())!});
  }
 }
 await page.goto('/docs/components/date-range-picker');
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await choose(page,playground,'Range length','fixed');
 const grouped=playground.getByRole('checkbox',{name:'Grouped presets',exact:true});await grouped.focus();await grouped.press('Space');
 await playground.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
 await choose(page,dialog,'Preset category','Date periods / Archived periods');await expect(dialog.getByRole('option',{name:'Last year',exact:true})).toBeDisabled();await page.keyboard.press('Escape');
 await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();sources.push({slug:'configured-range',source:(await playground.getByRole('code').textContent())!});
 for(const slug of ['period-picker','date-time-range-picker','date-range-comparison-picker']){
  await page.goto(`/docs/components/${slug}`);
  for(const title of ['Compact density','Comfortable density',...(slug==='period-picker'?['Whole week','Whole quarter','Whole year']:[])]){
   const panel=page.getByRole('region',{name:exampleName(title),exact:true});await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();sources.push({slug:`${slug}-${title}`,source:(await panel.getByRole('code').textContent())!});
  }
 }
 expect(checkSources(sources)).toEqual([]);
});

test('whole endpoint days resize, interior days move, and length limits push the opposite edge',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
 for(const label of ['Show endpoint fields','Limit to October 2026','Unavailable dates']){const box=panel.getByRole('checkbox',{name:label,exact:true});await box.focus();await box.press('Space');}
 await choose(page,panel,'Range length','bounded');
 await panel.getByRole('textbox',{name:'Minimum length',exact:true}).fill('2');await panel.getByRole('textbox',{name:'Maximum length',exact:true}).fill('3');
 const input=preview.getByRole('textbox',{name:'Course schedule',exact:true});await input.fill('10/7/2026 - 10/9/2026');await input.press('Enter');
 await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 await expect(dialog.locator('[data-range-handle]')).toHaveCount(0);
 await drag(page,day(dialog,9),day(dialog,12));await expect(start).toHaveValue('10/10/2026');await expect(end).toHaveValue('10/12/2026');
 await drag(page,day(dialog,10),day(dialog,8));await expect(start).toHaveValue('10/08/2026');await expect(end).toHaveValue('10/10/2026');
 await drag(page,day(dialog,10),day(dialog,9));await expect(start).toHaveValue('10/08/2026');await expect(end).toHaveValue('10/09/2026');
 await drag(page,day(dialog,9),day(dialog,7));await expect(start).toHaveValue('10/06/2026');await expect(end).toHaveValue('10/07/2026');
 await drag(page,day(dialog,6),day(dialog,1));await expect(start).toHaveValue('10/01/2026');await expect(end).toHaveValue('10/03/2026');
 await drag(page,day(dialog,3),day(dialog,1));await expect(start).toHaveValue('10/01/2026');await expect(end).toHaveValue('10/03/2026');await expect(dialog.getByRole('alert')).toBeVisible();
 await drag(page,day(dialog,3),day(dialog,18));await expect(start).toHaveValue('10/01/2026');await expect(end).toHaveValue('10/03/2026');
 await drag(page,day(dialog,2),page.locator('header').first());await expect(start).toHaveValue('10/01/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(input).toHaveValue('10/01/2026 – 10/03/2026');
});

test('single and two-day ranges use full day targets; move-only and fixed resize-only retain duration',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
 const fields=panel.getByRole('checkbox',{name:'Show endpoint fields',exact:true});await fields.focus();await fields.press('Space');
 const input=preview.getByRole('textbox',{name:'Course schedule',exact:true}),trigger=preview.getByRole('button',{name:'Choose Course schedule',exact:true});
 await input.fill('10/7/2026 - 10/7/2026');await input.press('Enter');await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 await drag(page,day(dialog,7),day(dialog,5));await expect(start).toHaveValue('10/05/2026');await expect(end).toHaveValue('10/07/2026');
 await drag(page,day(dialog,5),day(dialog,6));await expect(start).toHaveValue('10/06/2026');await expect(end).toHaveValue('10/07/2026');
 await drag(page,day(dialog,7),day(dialog,10));await expect(start).toHaveValue('10/06/2026');await expect(end).toHaveValue('10/10/2026');
 await drag(page,day(dialog,8),day(dialog,11));await expect(start).toHaveValue('10/09/2026');await expect(end).toHaveValue('10/13/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await choose(page,panel,'Drag behavior','move');await trigger.click();
 await drag(page,day(dialog,13),day(dialog,15));await expect(start).toHaveValue('10/11/2026');await expect(end).toHaveValue('10/15/2026');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await choose(page,panel,'Drag behavior','resize');await choose(page,panel,'Range length','fixed');
 await panel.getByRole('textbox',{name:'Fixed length',exact:true}).fill('3');
 await input.fill('10/12/2026 - 10/14/2026');await input.press('Enter');await trigger.click();
 await drag(page,day(dialog,14),day(dialog,17));await expect(start).toHaveValue('10/15/2026');await expect(end).toHaveValue('10/17/2026');
 await drag(page,day(dialog,15),day(dialog,12));await expect(start).toHaveValue('10/12/2026');await expect(end).toHaveValue('10/14/2026');
 await drag(page,day(dialog,13),day(dialog,20));await expect(start).toHaveValue('10/12/2026');await expect(end).toHaveValue('10/14/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(input).toHaveValue('10/12/2026 – 10/14/2026');
});
