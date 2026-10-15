import {openSiteTool,closeSiteTool} from './site-tools';
import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
import {checkSources, type SourceSnapshot} from './check-sources';
import {writeFileSync} from 'node:fs';
import catalog from '../content/catalog.json' with {type:'json'};
import composition from '../content/component-composition.json' with {type:'json'};


test('all public component catalog routes render documented examples and compilable current source',async({page})=>{
 test.setTimeout(120000);
 const sources:SourceSnapshot[]=[];const errors:string[]=[];let slug='';
 page.on('pageerror',error=>errors.push(`${slug}: ${error.message}`));
 page.on('console',message=>{if(message.type()==='error')errors.push(`${slug}: ${message.text()}`);});
 for(const entry of catalog) await test.step(entry.slug,async()=>{
  slug=entry.slug;await page.goto(`/docs/components/${slug}`);
  await expect(page.getByRole('heading',{level:1,name:entry.title,exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:/^(When to use|How to use)$/})).toHaveCount(0);
  const tools=page.getByRole('navigation',{name:'Component tools navigation',exact:true});
  await expect(tools.getByRole('button')).toHaveCount(2);
  await expect(tools.locator('[aria-expanded="true"]')).toHaveCount(0);
  await openSiteTool(page,'Page documentation');
  const documentation=page.getByRole('region',{name:slug==='owned-button'?'Button documentation':'Component documentation',exact:true});
  expect(await documentation.locator('h3').allTextContents()).toEqual(['Setup','Props','Behavior and accessibility','Host responsibilities']);
  expect(await documentation.getByRole('table').count()).toBeGreaterThan(0);
  const setup=await documentation.locator('code[aria-label^="Setup code:"], code[aria-label="Button setup code"]').textContent();
  sources.push({slug:slug+'-setup',source:setup!});
  await closeSiteTool(page);
  const overview=page.getByRole('region',{name:`${entry.title} at a glance`,exact:true});
  await expect(overview).toBeVisible();
  expect(await overview.evaluate(element=>element.closest('[data-docs-example]')===null)).toBe(true);
  await expect(overview.locator('code[aria-label^="Source:"]')).toHaveCount(0);
  const contains=page.getByRole('region',{name:'Contains',exact:true});
  const usedIn=page.getByRole('region',{name:'Used In',exact:true});
  await expect(contains).toBeVisible();await expect(usedIn).toBeVisible();
  if(slug==='owned-button')await expect(contains.getByRole('link')).toHaveCount(1);
  else {
    const groups=(composition as Record<string,{name:string;children:{name:string;slug:string}[]}[]>)[slug];
    const shared=groups.every(group=>JSON.stringify(group.children)===JSON.stringify(groups[0]?.children));
    for(const group of shared ? groups.slice(0,1) : groups) {
      const section=contains.getByRole('region',{name:`${group.name} composition`,exact:true});
      await expect(section.getByRole('link')).toHaveCount(group.children.length);
      for(const child of group.children)await expect(section.getByRole('link',{name:child.name,exact:true})).toHaveAttribute('href',`/docs/components/${child.slug}${child.slug===slug?'#composition-'+child.name:''}`);
    }
  }
  const order=await page.locator('h2').allTextContents();
  expect(order.indexOf('Contains')).toBeGreaterThan(order.indexOf('Prop playground'));
  expect(order.indexOf('Used In')).toBeGreaterThan(order.indexOf('Contains'));
  await openSiteTool(page,'Demo settings');
  await expect(page.getByRole('complementary',{name:'Component tools'}).getByRole('region',{name:'Demo settings',exact:true})).toBeVisible();
  await expect(page.locator('main#main-content').getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
  await expect(page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
  await closeSiteTool(page);
  const exampleTitle=('exampleTitle' in entry ? entry.exampleTitle : undefined) ?? 'Prop playground';
  await expect(page.getByRole('heading',{name:exampleName(exampleTitle),exact:true})).toBeVisible();
  await expect(page.locator('[data-docs-preview]').first()).toBeVisible();
  await expect(page.locator('[data-docs-preview]').getByText(/^(?:Selected:|Current value:|Selected subject:|Selected topic:|Selected actions:|Committed value:|Current panel:|Local destination:|Local action requests:|Indent level:|Selected color:|Preview route:|Serialized document:|\d+ presses$)/)).toHaveCount(0);
  const snippets=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(snippets.length,slug).toBeGreaterThanOrEqual('exampleTitle' in entry ? 1 : 2);
  for(const snippet of snippets) {
    expect(snippet,`${slug}: copyable component code excludes demo theme setup`).not.toMatch(/const palettes|sguiPreferences|sguiThemeTokens|useMediaPreference|useSyncExternalStore|Selected identity:|matchMedia|sg-ui\/styles\.css/);
  }
  sources.push(...snippets.map(source=>({slug,source})));
  const playground=page.getByRole('region',{name:exampleName(exampleTitle),exact:true});
  const playgroundIndex=await playground.locator('code[aria-label^="Source:"]').evaluate(element=>Array.from(document.querySelectorAll('code[aria-label^="Source:"]')).indexOf(element));
  expect(playgroundIndex).toBeGreaterThanOrEqual(0);
  const textbox=playground.getByRole('textbox').first();const checkbox=playground.getByRole('checkbox').first();
  if(await textbox.isVisible() && await textbox.isEditable()) {
   await textbox.fill('Edited "<Course>" {draft}');
  } else if(await checkbox.isVisible()) {
   const checked=await checkbox.isChecked();
   await checkbox.locator('xpath=ancestor::label[1]').click({timeout:5000});
   await expect(checkbox).toBeChecked({checked:!checked});
  }
  const afterPlayground=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(afterPlayground.filter((_,index)=>index!==playgroundIndex),`${slug}: playground controls must not change reference examples`).toEqual(snippets.filter((_,index)=>index!==playgroundIndex));
  if(slug==='learner-grid'){const server=page.getByRole('region',{name:exampleName('Unknown server total'),exact:true});await server.getByRole('button',{name:'Next page',exact:true}).click();await expect(server.getByText('Course 6',{exact:true})).toBeVisible();}
  const changed=await page.locator('code[aria-label^="Source:"]').allTextContents();
  sources.push(...changed.map(source=>({slug:slug+'-changed',source})));
 });
 writeFileSync('/tmp/sgui-catalog-sources.json',JSON.stringify(sources,null,2));
 const diagnostics=checkSources(sources);
 writeFileSync('/tmp/sgui-catalog-diagnostics.json',JSON.stringify({errors,diagnostics},null,2));
 expect(errors).toEqual([]);expect(diagnostics).toEqual([]);
 console.log(`${catalog.length} routes; ${sources.length} public setup and initial/changed example source snapshots verified`);
});

test('catalog search, component navigation and wide previews remain usable on narrow screens',async({page})=>{
 await page.goto('/docs/components');
 await page.getByRole('textbox',{name:'Find a component',exact:true}).fill('Autocomplete');
 await expect(page.getByRole('status')).toHaveText('1 component pages');
 await page.getByRole('main').getByRole('link',{name:'ComboBox',exact:true}).click();
 await expect(page.getByRole('heading',{level:1,name:exampleName('ComboBox')})).toBeVisible();
 const navigation=page.getByRole('navigation',{name:'Documentation'});
 await navigation.getByRole('textbox',{name:'Find in navigation'}).fill('DataToolbar');
 await navigation.getByRole('link',{name:'DataToolbar',exact:true}).click();
 await expect(page.getByRole('heading',{level:1,name:exampleName('DataToolbar'),exact:true})).toBeVisible();
 await page.setViewportSize({width:375,height:812});
 for(const slug of ['button-group','tabs','radio-group','toggle-button-group','data-grid-shell','calendar','page-rich-text-editor-section']) {
  await page.goto(`/docs/components/${slug}`);
  await expect(page.locator('main#main-content').getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
  await expect(page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:exampleName('Prop playground'),exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),slug).toBe(true);
  await page.screenshot({path:`/tmp/sgui-docs-${slug}-mobile.png`,fullPage:true});
 }
});
