import {exampleName} from './example-name';
import {test,expect} from './fixtures';
import {checkSources} from './check-sources';

test('Typography accent and subtle tones follow themes with isolated source-backed examples',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.emulateMedia({colorScheme:'light',contrast:'no-preference',forcedColors:'none'});
  await page.goto('/docs/components/typography');
  const tones=page.getByRole('region',{name:exampleName('Text tones and emphasis'),exact:true});
  const preview=tones.locator('[data-docs-preview]');
  const accent=preview.locator('[data-tone="accent"]');
  const primary=preview.locator('[data-tone="primary"]');
  const subtle=preview.locator('[data-tone="subtle"]');
  for(const mode of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme:mode,contrast:'no-preference'});
    await expect(preview).toHaveAttribute('data-sgui-theme',mode);
    const values=await preview.evaluate(element=>{const style=getComputedStyle(element);return {accent:style.getPropertyValue('--sgui-action').trim(),subtle:style.getPropertyValue('--sgui-text-subtle').trim()};});
    const rgb=(hex:string)=>`rgb(${hex.slice(1).match(/../g)!.map(value=>parseInt(value,16)).join(', ')})`;
    await expect(accent).toHaveCSS('color',rgb(values.accent));
    await expect(primary).toHaveCount(0);
    await expect(subtle).toHaveCSS('color',rgb(values.subtle));
    expect(await subtle.evaluate(element=>getComputedStyle(element).color)).not.toBe(await preview.locator('[data-tone="muted"]').evaluate(element=>getComputedStyle(element).color));
  }
  await page.emulateMedia({contrast:'more'});
  await expect(preview).toHaveAttribute('data-demo-contrast','increased');
  await expect.poll(()=>subtle.evaluate(element=>getComputedStyle(element).color)).toBe(await preview.locator('[data-tone="muted"]').evaluate(element=>getComputedStyle(element).color));
  await page.emulateMedia({forcedColors:'active'});
  await expect(preview).toHaveAttribute('data-demo-forced-colors','true');
  expect(await subtle.evaluate(element=>getComputedStyle(element).color)).toBe(await preview.locator('[data-tone="default"]').evaluate(element=>getComputedStyle(element).color));
  await page.emulateMedia({colorScheme:'light',contrast:'no-preference',forcedColors:'none'});
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const snapshots=[];
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  for(const tone of ['accent','subtle']) {
    await playground.getByRole('button',{name:/tone$/}).click();
    await page.getByRole('option',{name:tone,exact:true}).click();
    await expect(playground.locator('[data-docs-preview] [data-tone]')).toHaveAttribute('data-tone',tone);
    const code=playground.getByLabel('Source: Prop playground', {exact:true});
    await expect(code).toContainText(`tone={"${tone}"}`);
    snapshots.push({slug:`typography-${tone}`,source:(await code.textContent())!});
    await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
  }
  await tones.getByRole('button',{name:'Show source: Text tones and emphasis',exact:true}).click();
  snapshots.push({slug:'typography-tone-matrix',source:(await tones.getByLabel('Source: Text tones and emphasis',{exact:true}).textContent())!});
  expect(checkSources(snapshots)).toEqual([]);
  await tones.scrollIntoViewIfNeeded();
  await tones.screenshot({path:'/tmp/sgui-typography-tones.png',animations:'disabled'});
});
