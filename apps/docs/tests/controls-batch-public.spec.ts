import {expect,test,type Locator,type Page} from '@playwright/test';
import {checkSources,type SourceSnapshot} from './check-sources';
import {exampleName} from './example-name';
import {openSiteTool,closeSiteTool} from './site-tools';

async function codeSnapshots(page:Page,slug:string):Promise<SourceSnapshot[]> {
 return (await page.locator('code[aria-label^="Source:"]').allTextContents()).map(source=>({slug,source}));
}
async function setupSnapshot(page:Page,slug:string):Promise<SourceSnapshot> {
 await openSiteTool(page,'Page documentation');
 const documentation=page.getByRole('region',{name:'Component documentation',exact:true});
 expect(await documentation.locator('h3').allTextContents()).toEqual(['Setup','Props','Behavior and accessibility','Host responsibilities']);
 const source=await documentation.locator('code[aria-label^="Setup code:"]').textContent();
 await closeSiteTool(page);expect(source).toBeTruthy();return {slug:slug+'-setup',source:source!};
}
async function copyCurrent(page:Page,playground:Locator) {
 const show=playground.getByRole('button',{name:'Show source: Prop playground',exact:true});
 if(await show.getAttribute('aria-expanded')!=='true')await show.click();
 const code=playground.getByLabel('Source: Prop playground',{exact:true});
 await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
 await expect(playground.getByText('Copied to clipboard.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
}
for(const slug of ['hierarchical-menu','experience-page-navigator'] as const){
 test(`${slug} public route compiles current controlled source/copy and preserves reference independence`,async({page,context})=>{
  test.setTimeout(45000);await context.grantPermissions(['clipboard-read','clipboard-write']);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto('/docs/components/'+slug);
  await expect(page.getByRole('heading',{level:1,name:slug==='hierarchical-menu'?'Hierarchical menu':'ExperiencePageNavigator',exact:true})).toBeVisible();
  const snapshots:SourceSnapshot[]=[await setupSnapshot(page,slug)];
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const preview=playground.locator('[data-docs-preview]');
  const code=playground.getByLabel('Source: Prop playground',{exact:true});
  const codeIndex=await code.evaluate(element=>Array.from(document.querySelectorAll('code[aria-label^="Source:"]')).indexOf(element));
  const initial=await codeSnapshots(page,slug);expect(initial.length).toBeGreaterThanOrEqual(5);snapshots.push(...initial);
  await expect(page.getByRole('region',{name:'Contains',exact:true})).toBeVisible();
  await expect(page.getByRole('region',{name:'Used In',exact:true})).toBeVisible();
  if(slug==='hierarchical-menu'){
   const navigation=preview.getByRole('navigation',{name:'Course navigation',exact:true});
   await navigation.getByRole('button',{name:'Course settings',exact:true}).click();
   await navigation.getByRole('button',{name:'People',exact:true}).click();
   await expect(code).toContainText('useState<string[]>(["settings","people"])');
   const label='Edited "<Course>" {draft}';
   await playground.getByRole('textbox',{name:'label',exact:true}).fill(label);
   await expect(preview.getByRole('navigation',{name:label,exact:true})).toBeVisible();
   await expect(code).toContainText(`label={${JSON.stringify(label)}}`);
  }else{
   const enable=playground.getByRole('checkbox',{name:'Show previous/next',exact:true});
   await enable.locator('xpath=ancestor::label[1]').click();await expect(enable).toBeChecked();
   const navigation=preview.getByRole('navigation',{name:'Page navigation',exact:true});
   await expect(navigation.getByRole('button',{name:'Previous page',exact:true})).toBeDisabled();
   await navigation.getByRole('button',{name:'Next: Practice',exact:true}).click();
   await expect(preview.getByRole('button',{name:'Practice Page 2 • Active',exact:true})).toHaveAttribute('aria-current','page');
   await expect(code).toContainText('useState("practice")');
   await expect(code).toContainText('adjacentNavigation={adjacentNavigation}');
  }
  const changed=await codeSnapshots(page,slug+'-changed');snapshots.push(...changed);
  expect(changed.filter((_,index)=>index!==codeIndex).map(entry=>entry.source)).toEqual(initial.filter((_,index)=>index!==codeIndex).map(entry=>entry.source));
  await copyCurrent(page,playground);
  for(const entry of snapshots.filter(entry=>!entry.slug.endsWith('-setup')))expect(entry.source).not.toMatch(/sguiPreferences|matchMedia|sg-ui\/styles\.css|@\/|next\//);
  const diagnostics=checkSources(snapshots);
  await test.info().attach(slug+'-public-source-snapshots',{body:JSON.stringify({snapshots,diagnostics},null,2),contentType:'application/json'});
  expect(diagnostics).toEqual([]);expect(errors).toEqual([]);
 });
}
