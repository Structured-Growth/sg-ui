import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('searchable select aliases, typos, popup search and native forms preserve independent panels',async({page})=>{
  await page.goto('/docs/components/searchable-select');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const sibling=page.getByRole('region',{name:exampleName('Type in the field — compact'),exact:true});
  const input=playground.getByRole('combobox',{name:'Delivery state',exact:true});
  await input.fill('TX');
  await expect(page.getByRole('option',{name:'Texas',exact:true})).toBeVisible();
  await expect(page.getByRole('option',{name:'California',exact:true})).toHaveCount(0);
  await input.press('ArrowDown');await input.press('Enter');
  await expect(input).toHaveValue('Texas');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(sibling.getByRole('combobox')).toHaveValue('');
  await playground.getByRole('button',{name:'Clear Delivery state',exact:true}).click();
  await expect(input).toHaveValue('');
  await expect(page.getByRole('listbox')).toHaveCount(0);

  const fuzzy=page.getByRole('region',{name:exampleName('Forgiving spelling'),exact:true});
  await fuzzy.getByRole('combobox').click();
  await fuzzy.getByRole('combobox').pressSequentially('Txeas');
  await expect(page.getByRole('option',{name:'Texas',exact:true})).toBeVisible();
  await fuzzy.getByRole('combobox').press('ArrowDown');await fuzzy.getByRole('combobox').press('Enter');
  await expect(fuzzy.getByRole('combobox')).toHaveValue('Texas');

  const dropdown=page.getByRole('region',{name:exampleName('Search above the options — compact'),exact:true});
  const trigger=dropdown.getByRole('button',{name:/Choose a state State/});
  await trigger.click();
  const search=page.getByRole('searchbox',{name:'Search State',exact:true});
  await expect(search).toBeFocused();await search.fill('CA');
  await expect(page.getByRole('option',{name:'California',exact:true})).toBeVisible();
  await search.press('Escape');await expect(trigger).toBeFocused();
  await trigger.click();await expect(search).toHaveValue('');
  await search.fill('TX');await search.press('ArrowDown');await search.press('Enter');
  await expect(dropdown.getByRole('button',{name:'Texas State',exact:true})).toBeFocused();
  await expect(input).toHaveValue('');

  const form=page.getByRole('region',{name:exampleName('Native address form'),exact:true});
  await form.getByRole('button',{name:'Texas Delivery state',exact:true}).click();
  await page.getByRole('searchbox',{name:'Search Delivery state',exact:true}).fill('CA');
  await page.getByRole('option',{name:'California',exact:true}).click();
  await form.getByRole('button',{name:'Use address',exact:true}).click();
  await expect(form.getByRole('status')).toHaveText('Address ready for ca.');
  await form.getByRole('button',{name:'Reset address',exact:true}).click();
  await expect(form.getByRole('button',{name:'Texas Delivery state',exact:true})).toBeVisible();
});

test('searchable select source follows controls and selection while fixed examples stay independent',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/docs/components/searchable-select');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  for(const toggle of await page.getByRole('button',{name:/^Show source:/}).all())await toggle.click();
  const initial=await page.locator('code[aria-label^="Source:"]').allTextContents();
  const sibling=page.getByRole('region',{name:exampleName('Search above the options — comfortable'),exact:true});
  const siblingSource=await sibling.getByRole('code').textContent();
  await playground.getByRole('button',{name:/Search location/}).click();
  await page.getByRole('option',{name:'dropdown',exact:true}).click();
  await playground.getByRole('button',{name:/Matching/}).click();
  await page.getByRole('option',{name:'fuzzy',exact:true}).click();
  await playground.getByRole('button',{name:/Type a name or abbreviation Delivery state/}).click();
  const search=page.getByRole('searchbox',{name:'Search Delivery state',exact:true});
  await search.fill('TX');await search.press('ArrowDown');await search.press('Enter');
  const source=await playground.getByRole('code').textContent();
  expect(source).toContain('searchPlacement="dropdown" filter="fuzzy"');
  expect(source).toContain('useState<string|null>("tx")');
  expect(await sibling.getByRole('code').textContent()).toBe(siblingSource);
  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  await expect(playground.getByText('Copied to clipboard.',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(source);
  expect(checkSources([...initial,source!].map((source,index)=>({slug:`searchable-select-${index}`,source})))).toEqual([]);
});

test('searchable select keeps popup search above scrolling results within a narrow viewport',async({page},testInfo)=>{
  await page.setViewportSize({width:760,height:800});
  await page.goto('/docs/components/searchable-select');
  const panel=page.getByRole('region',{name:exampleName('Search above the options — comfortable'),exact:true});
  await panel.getByRole('button',{name:/Choose a state State/}).click();
  const search=page.getByRole('searchbox',{name:'Search State',exact:true});
  const list=page.getByRole('listbox');
  const before=await search.boundingBox();
  await list.evaluate(element=>{element.scrollTop=element.scrollHeight;});
  expect(await search.boundingBox()).toEqual(before);
  const option=page.getByRole('option',{name:'Unavailable region',exact:true});
  await expect(option).toHaveAttribute('aria-disabled','true');
  const bounds=await list.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(760);
  await page.screenshot({path:testInfo.outputPath('searchable-select-dropdown.png')});
  await search.press('Escape');
});
