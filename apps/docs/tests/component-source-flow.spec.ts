import {test, expect, type Locator} from '@playwright/test';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

/** Exercise docs controls → live public component → current consumer source, rather than repeat native acceptance. */
async function setCheckbox(region:Locator, name:string, checked:boolean) {
  const checkbox=region.getByRole('checkbox',{name,exact:true});
  if(await checkbox.isChecked() !== checked) await checkbox.locator('xpath=ancestor::label[1]').click();
  await expect(checkbox).toBeChecked({checked});
}

test('async playground source and copied code follow selected records, mock pending/failure and retry',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/docs/components/async-multi-select');
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const preview=playground.locator('[data-docs-preview]');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const code=playground.getByLabel('Source: Prop playground',{exact:true});
  await expect(code).toContainText('const [selected, setSelected] = useState<MultiSelectOption[]>([]);');

  await preview.getByRole('listbox',{name:'Course subject',exact:true}).getByRole('option',{name:'Design systems',exact:true}).click();
  await expect(preview.getByRole('button',{name:'Remove Design systems',exact:true})).toBeVisible();
  await expect(code).toContainText('useState<MultiSelectOption[]>([{"id":"design","label":"Design systems"}])');
  await preview.getByRole('searchbox',{name:'Course subject',exact:true}).fill('Research');
  await expect(preview.getByRole('listbox').getByRole('option',{name:'Research',exact:true})).toBeVisible();
  await expect(code).toContainText('const [query, setQuery] = useState("Research");');

  await setCheckbox(playground,'Mock loading',true);
  await expect(preview.getByRole('status').filter({hasText:'Loading options…'})).toBeVisible();
  await expect(code).toContainText('const [loading, setLoading] = useState(true);');
  await setCheckbox(playground,'Mock loading',false);
  await setCheckbox(playground,'Mock request failure',true);
  await expect(preview.getByRole('status').filter({hasText:'Sample request failed.'})).toBeVisible();
  await expect(code).toContainText('const [error, setError] = useState(true);');
  await preview.getByRole('button',{name:'Retry',exact:true}).click();
  await expect(playground.getByRole('checkbox',{name:'Mock request failure',exact:true})).not.toBeChecked();
  await expect(preview.getByRole('button',{name:'Retry',exact:true})).toHaveCount(0);
  await expect(code).toContainText('const [error, setError] = useState(false);');
  await expect(code).toContainText('const [loading, setLoading] = useState(false);');
  await expect(preview.getByRole('status').filter({hasText:'Current value:'})).toHaveText('Current value: Design systems');

  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  await expect(playground.getByText('Copied to clipboard.',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
});

test('date playground source follows datetime shape, hour cycle, density and committed segment edits',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/docs/components/date-field');
  const playground=page.getByRole('region',{name:'Prop playground',exact:true});
  const preview=playground.locator('[data-docs-preview]');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const code=playground.getByLabel('Source: Prop playground',{exact:true});
  await expect(code).toContainText('kind="date"');
  await expect(preview.getByRole('spinbutton',{name:/hour/})).toHaveCount(0);

  await setCheckbox(playground,'Include time segments',true);
  await expect(code).toContainText('kind="datetime"');
  await expect(code).toContainText('useState<string | null>("2026-10-14T09:30:00")');
  await expect(preview.getByRole('spinbutton',{name:/hour/})).toHaveAttribute('aria-valuenow','9');
  await playground.getByRole('button',{name:/Hour cycle/}).click();
  await page.getByRole('option',{name:'12-hour',exact:true}).click();
  await expect(code).toContainText('hourCycle={12}');
  await playground.getByRole('button',{name:/Example density/}).click();
  await page.getByRole('option',{name:'Compact',exact:true}).click();
  await expect(preview).toHaveAttribute('data-sgui-density','compact');
  await expect(code).toContainText('<ThemeScope density="compact">');

  const minute=preview.getByRole('spinbutton',{name:/minute/});
  await minute.focus(); await page.keyboard.press('ArrowUp');
  await expect(preview.getByRole('status')).toHaveText('Committed value: "2026-10-14T09:31:00"');
  await expect(code).toContainText('useState<string | null>("2026-10-14T09:31:00")');
  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
});

test('public production docs omit native fixture routes, manifests and fixture runtime bundles',async({request})=>{
  for(const route of ['/fixtures/','/fixtures/?id=migration-proofs-datefield--standalone-reset','/fixtures/index.json','/fixtures/migration-manifest.json']) {
    const response=await request.get(route);
    expect(response.status(),`${route} must not expose the test host`).toBe(404);
  }
  const nextRoot=new URL('../.next/',import.meta.url);
  for(const manifest of ['build-manifest.json','routes-manifest.json','react-loadable-manifest.json','server/app-paths-manifest.json']) {
    const contents=await readFile(new URL(manifest,nextRoot),'utf8');
    expect(contents,manifest).not.toMatch(/native-fixtures|__SGUI_FIXTURE__|fixtures\/assets|"\/fixtures(?:\/|\")/);
  }
  const staticRoot=new URL('static/',nextRoot);
  const bundles=(await readdir(staticRoot,{recursive:true})).filter(file=>file.endsWith('.js'));
  expect(bundles.length).toBeGreaterThan(0);
  for(const bundle of bundles) {
    const contents=await readFile(join(staticRoot.pathname,bundle),'utf8');
    expect(contents,`public bundle ${bundle}`).not.toMatch(/__SGUI_FIXTURE__|sgui-fixture-root|native-fixtures\/scenarios/);
  }
});
