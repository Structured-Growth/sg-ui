import {test,expect} from '@playwright/test';
import {checkSources, type SourceSnapshot} from './check-sources';
import {writeFileSync} from 'node:fs';
import catalog from '../content/catalog.json' with {type:'json'};
import composition from '../content/component-composition.json' with {type:'json'};


test('all public component catalog routes render playgrounds and compilable current source',async({page})=>{
 test.setTimeout(120000);
 const sources:SourceSnapshot[]=[];const errors:string[]=[];let slug='';
 page.on('pageerror',error=>errors.push(`${slug}: ${error.message}`));
 page.on('console',message=>{if(message.type()==='error')errors.push(`${slug}: ${message.text()}`);});
 for(const entry of catalog) await test.step(entry.slug,async()=>{
  slug=entry.slug;await page.goto(`/docs/components/${slug}`);
  const title=slug==='button'?'Buttons':slug==='dialog'?'Dialogs':entry.title;
  await expect(page.getByRole('heading',{level:1,name:title,exact:true})).toBeVisible();
  const usage=page.getByRole('region',{name:'Component usage',exact:true});
  await expect(usage.getByRole('heading',{name:'When to use',exact:true})).toBeVisible();
  await expect(usage.getByRole('heading',{name:'How to use',exact:true})).toBeVisible();
  await expect(usage.getByRole('heading',{name:'Contains',exact:true})).toBeVisible();
  const groups=(composition as Record<string,{name:string;children:{name:string;slug:string}[]}[]>)[slug];
  const shared=groups.every(group=>JSON.stringify(group.children)===JSON.stringify(groups[0]?.children));
  for(const group of shared ? groups.slice(0,1) : groups) {
    const section=usage.getByRole('region',{name:`${group.name} composition`,exact:true});
    const included=section.getByRole('list',{name:'Included components',exact:true});
    if(group.children.length) {
      await expect(included.getByRole('link')).toHaveCount(group.children.length);
      for(const child of group.children)await expect(included.getByRole('link',{name:child.name,exact:true})).toHaveAttribute('href',`/docs/components/${child.slug}${child.slug===slug ? '#composition-'+child.name : ''}`);
    } else await expect(included).toHaveCount(0);
  }

  expect(await usage.getByRole('list',{name:'Usage instructions',exact:true}).getByRole('listitem').count(),slug).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole('heading',{name:'Prop playground',exact:true})).toBeVisible();
  await expect(page.locator('[data-docs-preview]').first()).toBeVisible();
  const snippets=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(snippets.length,slug).toBeGreaterThanOrEqual(2);
  for(const snippet of snippets) {
    expect(snippet,`${slug}: copyable component code excludes demo theme setup`).not.toMatch(/const palettes|sguiPreferences|sguiThemeTokens|useMediaPreference|useSyncExternalStore|Selected identity:|matchMedia|sg-ui\/styles\.css/);
  }
  sources.push(...snippets.map(source=>({slug,source})));
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const textbox=playground.getByRole('textbox').first();const checkbox=playground.getByRole('checkbox').first();
  if(await textbox.isVisible() && await textbox.isEditable()) {
   await textbox.fill('Edited "<Course>" {draft}');
  } else if(await checkbox.isVisible()) {
   const checked=await checkbox.isChecked();
   await checkbox.locator('xpath=ancestor::label[1]').click({timeout:5000});
   await expect(checkbox).toBeChecked({checked:!checked});
  }
  const afterPlayground=await page.locator('code[aria-label^="Source:"]').allTextContents();
  expect(afterPlayground.slice(1),`${slug}: playground controls must not change reference examples`).toEqual(snippets.slice(1));
  if(slug==='learner-grid'){const server=page.getByRole('region',{name:'Unknown server total',exact:true});await server.getByRole('button',{name:'Next page',exact:true}).click();await expect(server.getByText('Course 6',{exact:true})).toBeVisible();}
  const changed=await page.locator('code[aria-label^="Source:"]').allTextContents();
  sources.push(...changed.map(source=>({slug:slug+'-changed',source})));
 });
 writeFileSync('/tmp/sgui-catalog-sources.json',JSON.stringify(sources,null,2));
 const diagnostics=checkSources(sources);
 writeFileSync('/tmp/sgui-catalog-diagnostics.json',JSON.stringify({errors,diagnostics},null,2));
 expect(errors).toEqual([]);expect(diagnostics).toEqual([]);
 console.log(`${catalog.length} routes, ${sources.length/2} examples and ${sources.length} initial/changed source snapshots verified`);
});

test('catalog search, component navigation and wide previews remain usable on narrow screens',async({page})=>{
 await page.goto('/docs/components');
 await page.getByRole('textbox',{name:'Find a component',exact:true}).fill('Autocomplete');
 await expect(page.getByRole('status')).toHaveText('1 component pages');
 await page.getByRole('main').getByRole('link',{name:'ComboBox',exact:true}).click();
 await expect(page.getByRole('heading',{level:1,name:'ComboBox'})).toBeVisible();
 const navigation=page.getByRole('navigation',{name:'Documentation'});
 await navigation.getByRole('textbox',{name:'Find in navigation'}).fill('DataToolbar');
 await navigation.getByRole('link',{name:'DataToolbar',exact:true}).click();
 await expect(page.getByRole('heading',{level:1,name:'DataToolbar',exact:true})).toBeVisible();
 await page.setViewportSize({width:375,height:812});
 for(const slug of ['button-group','tabs','radio-group','toggle-button-group','data-grid-shell','calendar','page-rich-text-editor-section']) {
  await page.goto(`/docs/components/${slug}`);
  await expect(page.getByRole('heading',{name:'Prop playground',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),slug).toBe(true);
  await page.screenshot({path:`/tmp/sgui-docs-${slug}-mobile.png`,fullPage:true});
 }
});
