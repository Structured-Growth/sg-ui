import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('native reset restores both ownership modes',async({page})=>{
  await page.goto('/docs/components/text-field');
  const panel=page.getByRole('region',{name:exampleName('Native form reset'),exact:true});
  const name=panel.getByRole('textbox',{name:'Learner name',exact:true});
  const email=panel.getByRole('textbox',{name:'Contact email',exact:true});
  await name.fill('Taylor');await email.fill('taylor@example.com');
  await panel.getByRole('button',{name:'Prepare registration',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'Registration prepared'})).toHaveText('Registration prepared for Taylor (taylor@example.com). Host owns persistence.');
  await panel.getByRole('button',{name:'Reset registration',exact:true}).click();
  await expect(name).toHaveValue('Alex Learner');await expect(email).toHaveValue('alex@example.com');
  await name.fill('');
  await panel.getByRole('button',{name:'Prepare registration',exact:true}).click();
  expect(await name.evaluate(node=>(node as HTMLInputElement).validity.valueMissing)).toBe(true);
  await expect(panel.locator('[data-docs-preview]').getByRole('status').filter({hasText:'Registration prepared for'})).toHaveCount(0);
  await panel.getByRole('button',{name:'Show source: Native form reset',exact:true}).click();
  expect(checkSources([{slug:'native-reset',source:await panel.getByLabel('Source: Native form reset',{exact:true}).innerText()}])).toEqual([]);
});

test('host timezone conversion rejects ambiguity and supports deliberate resolution',async({page})=>{
  await page.goto('/docs/components/date-field');
  const panel=page.getByRole('region',{name:exampleName('Local datetime and host timezone'),exact:true});
  await panel.getByRole('button',{name:'Resolve session instant',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'ambiguous'})).toHaveText('This local time is ambiguous or unavailable. Choose another time or an explicit resolution.');
  await panel.getByRole('button',{name:'Clock change policy',exact:false}).click();
  await page.getByRole('option',{name:'Earlier instant',exact:true}).click();
  await panel.getByRole('button',{name:'Resolve session instant',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'2026-11-01'})).toHaveText('2026-11-01T06:30:00.000Z');
  await panel.getByRole('button',{name:'Show source: Local datetime and host timezone',exact:true}).click();
  expect(checkSources([{slug:'timezone-instant',source:await panel.getByLabel('Source: Local datetime and host timezone',{exact:true}).innerText()}])).toEqual([]);
});

test('async search retains selection and rejects superseded results through failure and retry',async({page})=>{
  await page.goto('/docs/components/async-multi-select');
  const panel=page.getByRole('region',{name:exampleName('Host-owned asynchronous search'),exact:true});
  const input=panel.getByRole('searchbox',{name:'Search course topics',exact:true});
  await panel.getByRole('option',{name:'Design systems',exact:true}).click();
  await input.fill('fail');
  await expect(panel.getByRole('status').filter({hasText:'Sample request failed'})).toBeVisible();
  await expect(panel.getByRole('button',{name:'Remove Design systems',exact:true})).toBeVisible();
  await panel.getByRole('button',{name:'Retry',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'No options found'})).toBeVisible();
  await input.fill('research');await input.fill('engineering');
  await expect(panel.getByRole('option',{name:'Engineering',exact:true})).toBeVisible();
  await expect(panel.getByRole('option',{name:'Research',exact:true})).toHaveCount(0);
  await expect(panel.getByRole('button',{name:'Remove Design systems',exact:true})).toBeVisible();
  await panel.getByRole('button',{name:'Show source: Host-owned asynchronous search',exact:true}).click();
  expect(checkSources([{slug:'async-host',source:await panel.getByLabel('Source: Host-owned asynchronous search',{exact:true}).innerText()}])).toEqual([]);
});

test('locale scopes format the same civil range independently',async({page})=>{
  await page.goto('/docs/components/date-range-selector');
  for(const [locale,dir] of [['de-DE','ltr'],['ar-EG','rtl']]) {
    const panel=page.getByRole('region',{name:exampleName(`${locale} civil calendar`),exact:true});
    const scope=panel.locator(`[data-sgui-scope][lang="${locale}"]`).first();
    await expect(scope).toHaveAttribute('dir',dir);
    await expect(panel.locator('input[name="reporting.start"]')).toHaveValue('2026-10-12');
    await expect(panel.locator('input[name="reporting.end"]')).toHaveValue('2026-10-16');
    await panel.getByRole('button',{name:`Show source: ${locale} civil calendar`,exact:true}).click();
    expect(checkSources([{slug:locale,source:await panel.getByLabel(`Source: ${locale} civil calendar`,{exact:true}).innerText()}])).toEqual([]);
  }
});

test('long authentication form scrolls to fields, action and footer',async({page})=>{
  await page.goto('/docs/components/auth-shell');
  const panel=page.getByRole('region',{name:exampleName('Long host registration form'),exact:true});
  const scroller=panel.getByRole('region',{name:'Scrollable account form',exact:true});
  expect(await scroller.evaluate(node=>node.scrollHeight>node.clientHeight)).toBe(true);
  for(const label of ['Full name','Work email','Organization','Role','Team','City','Country'])await panel.getByRole('textbox',{name:label,exact:true}).fill(label==='Work email'?'alex@example.com':'Sample');
  await panel.getByRole('checkbox',{name:'I have reviewed the workspace terms',exact:true}).locator('xpath=ancestor::label').click();
  await panel.getByRole('button',{name:'Review account details',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'Registration details validated'})).toBeVisible();
  await panel.getByRole('link',{name:'Account help and privacy information',exact:true}).focus();
  await expect.poll(()=>scroller.evaluate(node=>node.scrollTop)).toBeGreaterThan(0);
  await panel.getByRole('button',{name:'Show source: Long host registration form',exact:true}).click();
  expect(checkSources([{slug:'long-auth',source:await panel.getByLabel('Source: Long host registration form',{exact:true}).innerText()}])).toEqual([]);
});

test('page header supplies primary actions and condensed ancestors',async({page})=>{
  await page.goto('/docs/components/page-header');
  const panel=page.getByRole('region',{name:exampleName('Primary actions and deep breadcrumbs'),exact:true});
  await panel.getByRole('button',{name:'Publish course',exact:true}).click();
  await expect(panel.getByRole('status').filter({hasText:'Publication requested'})).toBeVisible();
  await panel.getByRole('button',{name:'Show path',exact:true}).click();
  await expect(page.getByRole('menuitem',{name:'Professional development',exact:true})).toBeVisible();
  await expect(page.getByRole('menuitem',{name:'Instructor learning paths',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel.locator('[aria-current="page"]')).toHaveText('Course details');
  await panel.getByRole('button',{name:'Show source: Primary actions and deep breadcrumbs',exact:true}).click();
  expect(checkSources([{slug:'deep-header',source:await panel.getByLabel('Source: Primary actions and deep breadcrumbs',{exact:true}).innerText()}])).toEqual([]);
});
