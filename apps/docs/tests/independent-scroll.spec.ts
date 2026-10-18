import {exampleName} from './example-name';
import {checkSources} from './check-sources';
import {test,expect} from './fixtures';

for(const width of [1280,375])test(`docs sidebar and content scroll independently at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/docs/components/app-shell');
  const sidebar=page.getByRole('navigation',{name:'Documentation',exact:true});
  const main=page.locator('main#main-content');
  const read=()=>page.evaluate(()=>({sidebar:document.querySelector('nav[aria-label="Documentation"]')!.scrollTop,main:document.getElementById('main-content')!.scrollTop,document:document.scrollingElement!.scrollTop}));
  await expect.poll(()=>sidebar.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
  await expect.poll(()=>main.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
  await sidebar.hover();await page.mouse.wheel(0,320);
  await expect.poll(async()=>(await read()).sidebar).toBeGreaterThan(0);
  const afterSidebar=await read();
  expect(afterSidebar.main).toBe(0);expect(afterSidebar.document).toBe(0);
  const bounds=(await main.boundingBox())!;
  await page.mouse.move(bounds.x+bounds.width-20,bounds.y+Math.min(100,bounds.height/2));await page.mouse.wheel(0,420);
  await expect.poll(async()=>(await read()).main).toBeGreaterThan(0);
  expect((await read()).sidebar).toBe(afterSidebar.sidebar);expect((await read()).document).toBe(0);
  await sidebar.getByRole('link',{name:'Installation',exact:true}).click();
  await expect(page).toHaveURL(/\/installation$/);
  await expect.poll(async()=>(await read()).main).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('AppShell course navigation and lessons preserve separate scroll positions',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/docs/components/app-shell');
  const example=page.getByRole('region',{name:exampleName('Independent navigation and content scrolling'),exact:true});
  await example.scrollIntoViewIfNeeded();
  const menu=example.locator('[data-sgui-part="side-navigation-scroll"]');
  const lessons=example.getByRole('main',{name:'Independently scrolling lessons',exact:true});
  await expect(menu).toHaveCSS('scrollbar-width','thin');
  await expect(lessons).toHaveCSS('scrollbar-width','thin');
  const outside=await page.locator('main#main-content').evaluate(element=>element.scrollTop);
  await menu.hover();await page.mouse.wheel(0,480);
  await expect.poll(()=>menu.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
  expect(await lessons.evaluate(element=>element.scrollTop)).toBe(0);
  const menuTop=await menu.evaluate(element=>element.scrollTop);
  await lessons.hover();await page.mouse.wheel(0,440);
  await expect.poll(()=>lessons.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
  expect(await menu.evaluate(element=>element.scrollTop)).toBe(menuTop);
  expect(await page.locator('main#main-content').evaluate(element=>element.scrollTop)).toBe(outside);
  await example.screenshot({path:'/tmp/sgui-independent-scroll.png',animations:'disabled'});
});


for(const width of [1280,375])test(`theming helpers stay inside the viewport shell at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/theming');
  const dimensions=()=>page.evaluate(()=>({viewport:document.documentElement.clientHeight,document:document.documentElement.scrollHeight,body:document.body.scrollHeight,top:document.scrollingElement!.scrollTop}));
  await expect.poll(async()=>{const value=await dimensions();return value.document-value.viewport;}).toBeLessThanOrEqual(1);
  const main=page.locator('main#main-content');
  await page.getByRole('checkbox',{name:'Use neutral colors for scoped primary buttons',exact:true}).locator('xpath=ancestor::label[1]').click();
  await expect.poll(()=>main.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
  const value=await dimensions();
  expect(value.document).toBeLessThanOrEqual(value.viewport+1);expect(value.body).toBeLessThanOrEqual(value.viewport+1);expect(value.top).toBe(0);
  await expect(page.locator('body > [data-sgui-scope] > footer')).toHaveCount(0);
  const navigation=page.getByRole('navigation',{name:'Documentation'});
  const github=navigation.getByRole('link',{name:'View on GitHub',exact:true});
  await github.scrollIntoViewIfNeeded();
  await expect(github).toHaveAttribute('href','https://github.com/Structured-Growth/sg-ui');
  await expect(navigation.getByText('Public source. Commercial license required.',{exact:true})).toBeVisible();
  const header=page.locator('body > [data-sgui-scope] > header');
  const before=(await header.boundingBox())!;
  await header.hover();await page.mouse.wheel(0,600);
  expect((await dimensions()).top).toBe(0);
  expect((await header.boundingBox())!.y).toBe(before.y);
  await main.evaluate(element=>element.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`/tmp/sgui-viewport-shell-${width}.png`,animations:'disabled'});
});

test('sidebar thumb appears on hover and keyboard focus without shifting navigation',async({page})=>{
  await page.setViewportSize({width:1280,height:800});
  await page.goto('/theming');
  const sidebar=page.getByRole('navigation',{name:'Documentation',exact:true});
  const overview=sidebar.getByRole('link',{name:'Overview',exact:true});
  const main=page.locator('main#main-content');
  await main.hover();
  await expect(main).toHaveCSS('scrollbar-width','thin');
  await expect(main).toHaveCSS('scrollbar-gutter','stable');
  const idle=await sidebar.evaluate(element=>({color:getComputedStyle(element).scrollbarColor,width:element.getBoundingClientRect().width,gutter:getComputedStyle(element).scrollbarGutter}));
  expect(idle.width).toBe(272);expect(idle.gutter).toBe('stable');
  expect(idle.color).toBe('rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)');
  await expect.poll(()=>main.evaluate(element=>getComputedStyle(element).scrollbarColor)).not.toBe(idle.color);
  const before=await overview.boundingBox();
  await sidebar.hover();
  await expect.poll(()=>main.evaluate(element=>getComputedStyle(element).scrollbarColor)).toBe(idle.color);
  await expect.poll(()=>sidebar.evaluate(element=>getComputedStyle(element).scrollbarColor)).not.toBe(idle.color);
  expect(await overview.boundingBox()).toEqual(before);
  await page.locator('main#main-content').hover();
  await overview.focus();
  await expect(overview).toBeFocused();
  await expect.poll(()=>sidebar.evaluate(element=>getComputedStyle(element).scrollbarColor)).not.toBe(idle.color);
  expect(await overview.boundingBox()).toEqual(before);
  await overview.blur();
  await expect.poll(()=>sidebar.evaluate(element=>getComputedStyle(element).scrollbarColor)).toBe(idle.color);
  await page.screenshot({path:'/tmp/sgui-narrow-sidebar.png',animations:'disabled'});
  await page.emulateMedia({forcedColors:'active'});
  await expect.poll(()=>sidebar.evaluate(element=>getComputedStyle(element).scrollbarColor)).toBe('auto');
  await expect(main).toHaveCSS('scrollbar-color','auto');
});


test('wide-page content scrollbar reaches the shell right edge while reading width stays bounded',async({page})=>{
  await page.setViewportSize({width:1920,height:1000});
  await page.goto('/docs/components/processing-grid');
  const main=page.locator('main#main-content');
  const header=page.locator('body > [data-sgui-scope] > header');
  const rightEdge=async()=>{const pane=(await main.boundingBox())!;const rail=(await page.getByRole('complementary',{name:'Component tools'}).boundingBox())!;return Math.abs(pane.x+pane.width-rail.x);};
  await expect.poll(rightEdge).toBeLessThanOrEqual(1);
  const content=main.locator(':scope > div');
  expect((await content.boundingBox())!.width).toBe(1152);
  await expect(content).toHaveCSS('padding-left','32px');
  expect((await main.boundingBox())!.width).toBeGreaterThan(1152);
  await expect.poll(()=>main.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
  await page.getByRole('region',{name:exampleName('Course data grid'),exact:true}).scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.scrollingElement!.scrollTop)).toBe(0);
  await main.hover();
  await page.screenshot({path:'/tmp/sgui-right-edge-scrollbar.png',animations:'disabled'});
  await page.setViewportSize({width:1536,height:1000});
  await expect.poll(rightEdge).toBeLessThanOrEqual(1);
  expect((await content.boundingBox())!.width).toBe(1152);
});

test('AppShell mirrors an optional right column with independent scroll and collapse',async({page})=>{
  await page.setViewportSize({width:1600,height:1000});
  await page.goto('/docs/components/app-shell');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  await expect(playground.locator('[data-sgui-part="right-navigation"]')).toHaveCount(0);
  await playground.getByRole('checkbox',{name:'Show right navigation'}).locator('xpath=ancestor::label[1]').click();
  await expect(playground.getByRole('checkbox',{name:'Show right navigation'})).toBeChecked();
  await expect(playground.getByRole('navigation',{name:'Example page navigation'})).toBeVisible();
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  await expect(playground.locator('code[aria-label="Source: Prop playground"]')).toContainText('rightNavigation=');
  const example=page.getByRole('region',{name:exampleName('Three independently scrolling columns'),exact:true});
  await example.scrollIntoViewIfNeeded();
  const shell=example.locator('[data-sgui-part="app-shell"]');
  const main=example.getByRole('main');
  const left=example.getByRole('navigation',{name:'Independently scrolling courses'});
  const right=example.getByRole('navigation',{name:'Independently scrolling outline'});
  const leftScroll=left.locator('[data-sgui-part="side-navigation-scroll"]');
  const rightScroll=right.locator('[data-sgui-part="side-navigation-scroll"]');
  const read=async()=>Promise.all([leftScroll,main,rightScroll].map(pane=>pane.evaluate(element=>element.scrollTop)));
  const bounds=await Promise.all([left,main,right].map(pane=>pane.boundingBox()));
  expect(bounds[0]!.x+bounds[0]!.width).toBeLessThanOrEqual(bounds[1]!.x+1);
  expect(bounds[1]!.x+bounds[1]!.width).toBeLessThanOrEqual(bounds[2]!.x+1);
  await expect(right).toHaveCSS('border-left-width','1px');
  await expect(right).toHaveCSS('border-right-width','0px');
  for(const [index,pane] of [leftScroll,main,rightScroll].entries()){
    const before=await read();
    await pane.hover();await page.mouse.wheel(0,160);
    await expect.poll(async()=>(await read())[index]).toBeGreaterThan(before[index]);
    const after=await read();
    for(let sibling=0;sibling<3;sibling++)if(sibling!==index)expect(after[sibling]).toBe(before[sibling]);
  }
  await right.getByRole('button',{name:'Collapse navigation',exact:true}).click();
  await expect(right).toHaveAttribute('data-collapsed','true');
  await expect(left).not.toHaveAttribute('data-collapsed','true');
  await right.getByRole('button',{name:'Expand navigation',exact:true}).click();
  const mainNode=await main.elementHandle();
  await shell.evaluate(element=>{(element as HTMLElement).style.width='360px';});
  await expect.poll(async()=>{
    const boxes=await Promise.all([left,main,right].map(pane=>pane.boundingBox()));
    return boxes[0]!.y+boxes[0]!.height<=boxes[1]!.y+1&&boxes[1]!.y+boxes[1]!.height<=boxes[2]!.y+1;
  }).toBe(true);
  expect(await main.evaluate((element,original)=>element===original,mainNode)).toBe(true);
  expect(await shell.evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
  expect((await main.boundingBox())!.height).toBeGreaterThan(100);
  const snippets=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(checkSources(snippets.map(source=>({slug:'app-shell',source})))).toEqual([]);
  await example.screenshot({path:'/tmp/sgui-app-shell-right-column.png',animations:'disabled'});
});
