import {openSiteTool,closeSiteTool} from './site-tools';
import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
import {checkSources} from './check-sources';

test('Button page presents the trial flow, numbered anchors and complete prop reference',async({page})=>{
  await page.goto('/docs/components/owned-button');
  const order=await page.locator('h2').allTextContents();
  const required=['Prop playground','Examples','Button: Filled primary action','Button: Native submit and reset','Contains','Used In'];
  await expect(page.getByRole('heading',{name:/^(When to use|How to use)$/})).toHaveCount(0);
  await expect(page.getByRole('navigation',{name:'Component tools navigation'}).getByRole('button')).toHaveCount(2);
  for(let i=1;i<required.length;i++)expect(order.indexOf(required[i]),required[i]).toBeGreaterThan(order.indexOf(required[i-1]));
  const overview=page.getByRole('region',{name:exampleName('Button at a glance')});
  await expect(overview.getByRole('button',{name:'Continue',exact:true})).toBeVisible();
  await expect(overview.locator('svg')).toHaveCount(0);
  await expect(overview).toHaveText('Continue');
  await expect(page.getByRole('heading',{name:exampleName('Button at a glance'),exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Show source: Button at a glance',exact:true})).toHaveCount(0);
  expect(await overview.evaluate(element=>element.parentElement?.closest('section[aria-labelledby]')===null)).toBe(true);
  await openSiteTool(page,'Page documentation');
  const documentation=page.getByRole('region',{name:exampleName('Button documentation'),exact:true});
  expect(await documentation.locator('h3').allTextContents()).toEqual(['Setup','Props','Behavior and accessibility','Host responsibilities']);
  await expect(documentation.getByRole('table',{name:'Button props'})).toBeVisible();
  await expect(documentation.getByRole('link',{name:'Installation',exact:true})).toHaveAttribute('href','/installation');
  await expect(documentation.getByRole('link',{name:'Theming',exact:true})).toHaveAttribute('href','/theming');
  await expect(documentation.getByRole('region',{name:exampleName('Button behavior and accessibility'),exact:true})).toContainText('keeps the button focusable');
  await expect(documentation.getByRole('region',{name:exampleName('Button host responsibilities'),exact:true})).toContainText('does not automatically await');
  const setup=(await documentation.getByLabel('Button setup code',{exact:true}).textContent())!;
  expect(checkSources([{slug:'button-setup',source:setup}])).toEqual([]);
  await expect(page.getByRole('table',{name:'Button props'})).toContainText('startIcon');
  await expect(page.getByRole('table',{name:'Button props'})).toContainText('endIcon');
  await expect(page.getByRole('table',{name:'Button props'})).toContainText('formNoValidate');
  await expect(page.getByRole('region',{name:exampleName('Used In')}).getByRole('link',{name:'AppButton',exact:true})).toHaveAttribute('href','/docs/components/button#composition-AppButton');
  await expect(page.getByRole('region',{name:exampleName('Contains'),exact:true}).getByRole('link',{name:'Icons (optional startIcon / endIcon)',exact:true})).toHaveAttribute('href','/docs/components/icons');
  await expect(page.getByLabel('Button example index')).toHaveCount(0);
  await expect(page.getByText('Use the example number and page URL', {exact:false})).toHaveCount(0);
  await closeSiteTool(page);
  await page.goto('/docs/components/owned-button#example-3-text');
  await expect(page.getByRole('region',{name:exampleName('Button: Text action'),exact:true})).toBeInViewport();
  const sources=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(sources.length).toBe(14);
  expect(checkSources(sources.map((source,i)=>({slug:`button-${i}`,source})))).toEqual([]);
  await page.goto('/docs/components/owned-button');
  await page.screenshot({path:'/tmp/sgui-button-page-overview.png',animations:'disabled'});
});

test('Button playground controls each icon and keeps source/copy current without changing examples',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/docs/components/owned-button');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const preview=playground.locator('[data-docs-preview]');
  const reference=page.getByRole('region',{name:exampleName('Button: Leading icon'),exact:true});
  const before=await reference.locator('code').textContent();
  await expect(preview.locator('svg')).toHaveCount(0);
  for(const [label,option] of [['startIcon','Add icon'],['endIcon','Chevron right icon']]){
    await playground.getByRole('button',{name:new RegExp(label)}).click();
    await page.getByRole('option',{name:option,exact:true}).click();
  }
  await expect(preview.locator('svg')).toHaveCount(2);
  await playground.getByRole('textbox',{name:'children (label)',exact:true}).fill('Create pathway');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const code=playground.getByLabel('Source: Prop playground',{exact:true});
  await expect(code).toContainText('startIcon={<AddIcon />}');await expect(code).toContainText('endIcon={<ChevronRightIcon />}');
  await expect(code).toContainText('Create pathway');
  expect(checkSources([{slug:'button-icons',source:(await code.textContent())!}])).toEqual([]);
  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
  expect(await reference.locator('code').textContent()).toBe(before);
  await playground.getByRole('checkbox',{name:'loading',exact:true}).locator('xpath=ancestor::label[1]').click();
  await expect(preview.getByRole('progressbar')).toBeVisible();
  await expect(preview.locator('svg')).toHaveCount(1);
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  await playground.scrollIntoViewIfNeeded();
  await page.screenshot({path:'/tmp/sgui-button-page-playground.png',animations:'disabled'});
});


test('Button prop table and controls stay within a narrow page',async({page})=>{
  await page.setViewportSize({width:375,height:900});
  await page.goto('/docs/components/owned-button');
  await openSiteTool(page,'Page documentation');
  await expect(page.getByRole('table',{name:'Button props'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('heading',{name:exampleName('Props'),exact:true}).scrollIntoViewIfNeeded();
  await page.screenshot({path:'/tmp/sgui-button-props-mobile.png',animations:'disabled'});
  await closeSiteTool(page);
  await page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
