import {test,expect,type Locator} from './fixtures';
import {exampleName} from './example-name';

async function aligned(preview:Locator){
 const group=preview.locator('[data-sgui-part="date-field-control-group"]');
 const control=group.locator(':scope > :first-child');
 const button=group.getByRole('button');
 const a=(await control.boundingBox())!,b=(await button.boundingBox())!;
 expect(Math.abs(a.y-b.y)).toBeLessThan(.6);
 expect(Math.abs(a.height-b.height)).toBeLessThan(.6);
 expect(Math.abs(a.x+a.width-b.x)).toBeLessThan(.6);
 expect(await button.locator('svg').getAttribute('aria-hidden')).toBe('true');
}

for(const density of ['Compact','Comfortable'])for(const mode of ['Date segments','Flexible text'])test(`joined date input: ${density}, ${mode}`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/docs/components/date-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const preview=panel.locator('[data-docs-preview]');
 await expect(panel.getByRole('button',{name:/Date entry/})).toContainText('Flexible text');
 await expect(preview.getByRole('textbox',{name:'Course schedule',exact:true})).toBeVisible();
 await panel.getByRole('button',{name:/Example density/}).click();
 await page.getByRole('option',{name:density,exact:true}).click();
 await panel.getByRole('button',{name:/Date entry/}).click();
 await page.getByRole('option',{name:mode,exact:true}).click();
 await aligned(preview);
 expect((await preview.locator('[data-sgui-part="date-field-control-group"] button').boundingBox())!.height).toBe(density==='Compact'?32:44);
 const trigger=preview.getByRole('button',{name:'Choose Course schedule',exact:true});
 await trigger.click();await expect(page.getByRole('dialog',{name:'Course schedule',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
 await panel.getByRole('textbox',{name:'Example label',exact:true}).fill('Choose the course publication date for this learning plan');
 await panel.getByRole('textbox',{name:'Description',exact:true}).fill('Help text can wrap below the entire joined control without moving its action.');
 const invalid=panel.getByRole('checkbox',{name:'Invalid',exact:true});
 await invalid.focus();await invalid.press('Space');await expect(invalid).toBeChecked();
 await page.setViewportSize({width:375,height:900});
 await aligned(preview);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await preview.scrollIntoViewIfNeeded();
 await info.attach('joined-date-field',{body:await preview.screenshot({path:info.outputPath('joined-date-field.png')}),contentType:'image/png'});
});
