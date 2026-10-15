import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
import {checkSources} from './check-sources';

test('mixed navigation combines branch behaviors and keeps examples and copyable host state independent',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{Reflect.set(window,'copiedSource',text);}}}));
  await page.goto('/docs/components/side-navigation');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const nav=playground.getByRole('navigation',{name:'Example workspace navigation',exact:true});
  const compact=page.getByRole('region',{name:exampleName('Mixed expansion, drilldown and destinations — compact'),exact:true});
  const comfortable=page.getByRole('region',{name:exampleName('Mixed expansion, drilldown and destinations — comfortable'),exact:true});
  const referenceSources=await page.locator('code[aria-label^="Source:"]').allTextContents();
  // The menu meets the preview's inner border; its separators span the menu.
  for(const owner of [playground,compact,comfortable]) {
    const geometry=await owner.locator('[data-docs-preview]').first().evaluate(preview=>{
      const nav=preview.querySelector('nav')!;
      const root=nav.getBoundingClientRect();
      const frame=preview.getBoundingClientRect();
      const content=nav.querySelector('[data-sgui-part="side-navigation-scroll"]')!;
      const footer=content.lastElementChild!;
      const header=content.parentElement!;
      const lines=[footer,header].map(element=>{
        const bounds=element.getBoundingClientRect();
        return {left:bounds.left-root.left,right:root.right-bounds.right};
      });
      return {left:root.left-frame.left,top:root.top-frame.top,lines};
    });
    expect(geometry.left).toBeCloseTo(1,0);expect(geometry.top).toBeCloseTo(1,0);
    for(const line of geometry.lines){expect(line.left).toBeCloseTo(0,0);expect(line.right).toBeCloseTo(1,0);}
  }

  await expect(playground.getByRole('button',{name:/Configuration/})).toHaveCount(0);
  await expect(nav.getByRole('link',{name:'Overview',exact:true})).toHaveAttribute('aria-current','page');
  await expect(nav.getByRole('button',{name:'Practice',exact:true})).toBeVisible();
  await expect(nav.getByRole('button',{name:'Practice',exact:true})).toHaveCSS('font-weight','400');
  const overviewRow=(await nav.getByRole('link',{name:'Overview',exact:true}).boundingBox())!;
  const practiceRow=(await nav.getByRole('button',{name:'Practice',exact:true}).boundingBox())!;
  expect(practiceRow.height).toBe(overviewRow.height);
  await expect(nav.getByRole('button',{name:'Practice',exact:true})).toHaveCSS('font-size','12px');
  const heights=[];
  for(const owner of [compact,comfortable]) {
    const row=owner.getByRole('link',{name:'Overview',exact:true});
    heights.push((await row.boundingBox())!.height);
    expect((await row.locator('svg').boundingBox())!.width).toBe(16);
  }
  expect(heights).toEqual([32,36]);
  await expect(nav.getByRole('link',{name:'Overview',exact:true}).locator('svg')).toHaveAttribute('aria-hidden','true');
  await nav.getByRole('button',{name:'Course tools',exact:true}).click();
  await expect(nav.getByRole('button',{name:'Practice',exact:true})).toHaveCount(0);
  await nav.getByRole('button',{name:'Course tools',exact:true}).click();
  await nav.getByRole('button',{name:'Course settings',exact:true}).click();
  await expect(nav.getByRole('button',{name:'Announcements',exact:true})).toBeVisible();
  await nav.getByRole('button',{name:'Notifications',exact:true}).click();
  await expect(nav.getByRole('button',{name:'Announcements',exact:true})).toHaveCount(0);
  await nav.getByRole('button',{name:'Advanced settings',exact:true}).click();
  await nav.getByRole('button',{name:'Completion rules',exact:true}).click();
  await expect(playground.locator('code')).toContainText('useState("completion")');
  await nav.getByRole('button',{name:'Advanced settings',exact:true}).click();
  await nav.getByRole('button',{name:'Course settings',exact:true}).click();
  await expect(nav.getByRole('button',{name:'Practice',exact:true})).toBeVisible();
  await nav.getByRole('button',{name:'Organization',exact:true}).click();
  await nav.getByRole('link',{name:'People',exact:true}).click();
  await expect(page).toHaveURL(/\/docs\/components\/side-navigation$/);
  await expect(nav.getByRole('link',{name:'People',exact:true})).toHaveAttribute('aria-current','page');
  await expect(playground.locator('code')).toContainText('useState("/workspace/people")');
  await nav.getByRole('button',{name:'Organization',exact:true}).click();
  await nav.getByRole('button',{name:'Contact support',exact:true}).click();
  await expect(playground.locator('code')).toContainText('useState("support")');
  for(const reference of [compact,comfortable]) {
    await expect(reference.locator('code')).toContainText('useState("overview")');
    await expect(reference.getByRole('button',{name:'Course settings',exact:true})).toBeVisible();
    await expect(reference.getByRole('button',{name:'Organization',exact:true})).toBeVisible();
  }
  expect((await page.locator('code[aria-label^="Source:"]').allTextContents()).slice(1)).toEqual(referenceSources.slice(1));
  await playground.getByRole('textbox',{name:'Content / label',exact:true}).fill('Menu "owner" <team>');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const source=await playground.locator('code[aria-label="Source: Prop playground"]').textContent();
  expect(source).toContain('/workspace/people');expect(source).toContain('useState("support")');
  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  expect(await page.evaluate(()=>Reflect.get(window,'copiedSource'))).toBe(source);
  const sources=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(checkSources(sources.map((source,index)=>({slug:`side-navigation-${index}`,source})))).toEqual([]);
  await playground.locator('[data-docs-preview]').first().screenshot({path:'/tmp/sgui-mixed-side-navigation.png',animations:'disabled'});
});
