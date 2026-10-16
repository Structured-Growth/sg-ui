import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const slug of ['calendar','date-picker','date-range-selector','date-range-picker'])test(`${slug}: optional title keeps accessible naming and navigation shares month row`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const popup=slug==='date-picker'||slug==='date-range-picker';
 const open=async()=>{if(popup)await panel.getByRole('button',{name:'Choose Course schedule',exact:true}).click();};
 const host=popup?page.getByRole('dialog',{name:'Course schedule',exact:true}):panel.locator('[data-docs-preview]');
 await open();
 await expect(host.getByRole('heading',{name:'Course schedule',exact:true})).toHaveCount(0);
 const previous=host.getByRole('button',{name:'Previous month',exact:true}),next=host.getByRole('button',{name:'Next month',exact:true});
 const heading=host.locator('header').getByText('October 2026',{exact:true});
 for(const button of [previous,next]){
  const a=(await button.boundingBox())!,b=(await heading.boundingBox())!;
  expect(Math.abs(a.y+a.height/2-b.y-b.height/2)).toBeLessThan(1);
 }
 await next.click();await expect(host.locator('header').getByText('November 2026',{exact:true})).toBeVisible();
 await previous.click();await expect(heading).toBeVisible();
 if(popup)await page.keyboard.press('Escape');
 const toggle=panel.getByRole('checkbox',{name:'Show title',exact:true});await toggle.focus();await toggle.press('Space');
 await open();await expect(host.getByRole('heading',{name:'Course schedule',exact:true})).toHaveCount(1);
 await info.attach('title-and-month-row',{body:await host.screenshot({path:info.outputPath('heading.png')}),contentType:'image/png'});
 if(popup)await page.keyboard.press('Escape');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('showTitle={true}');expect(checkSources([{slug,source}])).toEqual([]);
});

test('Popover can hide its heading and retain its dialog name',async({page})=>{
 await page.goto('/docs/components/popover');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const toggle=panel.getByRole('checkbox',{name:'Show title',exact:true});await toggle.focus();await toggle.press('Space');
 await panel.getByRole('button',{name:'Show details',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Course details',exact:true});
 await expect(dialog).toBeVisible();await expect(dialog.getByRole('heading',{name:'Course details',exact:true})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('showTitle={false}');expect(checkSources([{slug:'popover',source}])).toEqual([]);
});
