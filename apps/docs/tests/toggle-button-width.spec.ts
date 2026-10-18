import {expect,test} from './fixtures';
import {checkSources} from './check-sources';

for(const viewport of [{width:1280,hasTouch:false},{width:1280,hasTouch:true},{width:375,hasTouch:false}])test(`toggle groups default to widest-option widths and offer content sizing at ${viewport.width}px (touch=${viewport.hasTouch})`,async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,viewport:{width:viewport.width,height:1000},hasTouch:viewport.hasTouch});
  const page=await context.newPage();
  await page.goto('/docs/components/toggle-button-group');
  for(const orientation of ['Horizontal','Vertical'])for(const density of ['compact','comfortable']) {
    const title=`${orientation} · ${density}`;
    const panel=page.getByRole('region',{name:`ToggleButtonGroup: ${title}`,exact:true});
    const contentPanel=page.getByRole('region',{name:`ToggleButtonGroup: ${title} · fit content`,exact:true});
    const group=panel.locator('[data-sgui-part="toggle-button-group"]');
    await expect(group).toHaveAttribute('data-button-width','equal');
    const widths=await group.locator('button').evaluateAll(buttons=>buttons.map(button=>button.getBoundingClientRect().width));
    expect(Math.max(...widths)-Math.min(...widths)).toBeLessThanOrEqual(0.5);
    const contentWidths=await contentPanel.locator('[data-sgui-part="toggle-button-group"] button').evaluateAll(buttons=>buttons.map(button=>button.getBoundingClientRect().width));
    expect(Math.max(...contentWidths)-Math.min(...contentWidths)).toBeGreaterThan(5);
    if(viewport.width===1280) {
      const intrinsic=await group.evaluate(element=>{
        const previous=element.style.maxInlineSize;
        element.style.maxInlineSize='none';
        const width=element.querySelector('button')!.getBoundingClientRect().width;
        element.style.maxInlineSize=previous;
        return width;
      });
      expect(Math.abs(intrinsic-Math.max(...contentWidths))).toBeLessThanOrEqual(0.5);
    }
  }
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const group=playground.locator('[data-docs-preview] [data-sgui-part="toggle-button-group"]');
  await expect(group).toHaveAttribute('data-button-width','equal');
  const sibling=page.getByRole('region',{name:'ToggleButtonGroup: Horizontal · compact',exact:true});
  const siblingSource=await sibling.locator('code').textContent();
  await playground.getByRole('button',{name:/Button width/}).click();
  await page.getByRole('option',{name:'Fit content',exact:true}).click();
  await expect(group).toHaveAttribute('data-button-width','content');
  await expect(playground.locator('code')).toContainText('buttonWidth="content"');
  await group.getByRole('button',{name:'Research',exact:true}).click();
  await expect(group.getByRole('button',{name:'Research',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(sibling.locator('code')).toHaveText(siblingSource!);
  const sources=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(checkSources(sources.map((source,index)=>({slug:`toggle-width-${index}`,source})))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/sgui-toggle-width-${viewport.width}-${viewport.hasTouch}.png`});
  await context.close();
});
