import {test, expect} from './fixtures';
import {checkSources,type SourceSnapshot} from './check-sources';
test('published foundations expose matching source and independent native focus', async ({page}) => {
  await page.goto('/theming');
  const focus = page.locator('#foundation-focus');
  const motion = page.locator('#foundation-motion');
  await expect(page.locator('#foundation-spacing')).toBeVisible();
  const field = focus.getByRole('textbox',{name:'Editable focus target',exact:true});
  await field.fill('Unpublished draft');
  const first = focus.getByRole('button',{name:'First focus target',exact:true});
  await first.focus(); // Seed local traversal only; not a fresh-document entry claim.
  await page.keyboard.press('Tab');
  await expect(field).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(focus.getByRole('button',{name:'Last focus target',exact:true})).toBeFocused();
  await expect(motion.getByRole('progressbar',{name:'Determinate work',exact:true})).toHaveAttribute('aria-valuenow','40');
  const sources:SourceSnapshot[]=[];
  for(const [id,title] of [['spacing','Production spacing scale'],['focus','Keyboard focus traversal'],['motion','Motion and system preferences']]) {
    const panel=page.locator(`#foundation-${id}`);
    await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
    const source=panel.locator(`code[aria-label="Source: ${title}"]`);
    await expect(source).toContainText('@structured-growth/sg-ui');
    await expect(source).not.toContainText('demoTokens');
    sources.push({slug:`foundation-${id}`,source:(await source.textContent())!});
  }
  expect(checkSources(sources)).toEqual([]);
  await expect(field).toHaveValue('Unpublished draft');
});
test('published motion uses production reduced-motion CSS', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/theming');
  const motion=page.locator('#foundation-motion');
  const circular=motion.getByRole('progressbar',{name:'Indeterminate circular work',exact:true}).locator('svg');
  await expect.poll(() => circular.evaluate(node => getComputedStyle(node).animationName)).not.toBe('none');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(() => circular.evaluate(node => getComputedStyle(node).animationName)).toBe('none');
  await expect(motion.getByRole('progressbar',{name:'Determinate work',exact:true})).toHaveAttribute('aria-valuenow','40');
  await expect(motion.getByRole('button',{name:'Pending action',exact:true})).toHaveAttribute('aria-disabled','true');
});
