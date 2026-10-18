import {test, expect} from '@playwright/test';
import {resolve} from 'node:path';
import {validateVisualExecution} from '../../scripts/visual-baseline-review.mjs';
import {attachVisualFontEnvironment} from './visual-font-environment';
import {assertVisualGridGeometry} from './visual-grid-geometry';

// Eight deliberately bounded configurations; each captures the five named families.
// Screenshots are candidates until an operator reviews and approves baseline images.
const configurations = [
  ['light','compact',360,'en-US','ltr',true],
  ['light','compact',1280,'en-US','ltr',false],
  ['light','comfortable',360,'ar','rtl',true],
  ['light','comfortable',1280,'en-US','ltr',false],
  ['dark','compact',360,'ar','rtl',true],
  ['dark','compact',1280,'en-US','ltr',false],
  ['dark','comfortable',360,'en-US','ltr',true],
  ['dark','comfortable',1280,'ar','rtl',true],
] as const;
for (const [theme,density,width,locale,direction,longLabels] of configurations) {
  const key = `${theme}-${density}-${width}-${locale}-${direction}-${longLabels?'long':'short'}`;
  test(`review matrix ${key}`, async ({page}, info) => {
    // Required at the actual test entry, including custom/CI configs.
    const reviewErrors = validateVisualExecution({
      mode: process.env.SGUI_VISUAL_MODE ?? 'compare', updateSnapshots: info.config.updateSnapshots,
      snapshotPaths: ['focused-action','controls','grids','navigation','editor','overlay'].map(family => info.snapshotPath(`${key}-${family}.png`)),
      outputDirectory: process.env.SGUI_VISUAL_OUTPUT ?? '', baselineRoot: process.env.SGUI_VISUAL_BASELINES,
      receiptPath: process.env.SGUI_VISUAL_REVIEW, repositoryRoot: resolve(import.meta.dirname, '../../../..'), argv: process.argv,
    });
    expect(reviewErrors, 'Deliberate screenshot review is mandatory for every visual test entry').toEqual([]);
    const warnings: string[] = [];
    page.on('pageerror', error => warnings.push(error.message));
    page.on('console', message => {if(['error','warning'].includes(message.type())) warnings.push(message.text());});
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce', colorScheme:theme});
    const query = new URLSearchParams({id:'foundations-visual-acceptance--matrix',embed:'true',
      globals:`theme:${theme};density:${density};locale:${locale};direction:${direction}`, args:`longLabels:${longLabels}`});
    await page.goto(`/fixtures/?${query}`);
    await expect.poll(() => page.evaluate(() => (window as Window & {__SGUI_FIXTURE__?: {status:string}}).__SGUI_FIXTURE__?.status)).toBe('success');
    await page.evaluate(() => document.fonts.ready);
    // Keep focused controls inside the screenshot area and enter with a real key.
    const controls = page.getByRole('region', {name:'Visual controls',exact:true});
    await controls.scrollIntoViewIfNeeded();
    const save = controls.getByRole('button', {name: /Save course/});
    await page.keyboard.press(process.platform === 'darwin' && info.project.name === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(save).toBeFocused();
    await expect(save).toHaveScreenshot(`${key}-focused-action.png`, {animations:'disabled',caret:'hide',maxDiffPixels:0});
    for (const family of ['controls','grids','navigation','editor']) {
      const region = page.getByRole('region', {name:`Visual ${family}`,exact:true});
      await expect(region).toBeVisible();
      if (family === 'grids') await assertVisualGridGeometry(region, width, info);
      await expect(region).toHaveScreenshot(`${key}-${family}.png`, {animations:'disabled',caret:'hide',maxDiffPixels:0});
    }
    await page.getByRole('button',{name:'Open visual dialog',exact:true}).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot(`${key}-overlay.png`, {animations:'disabled',caret:'hide',maxDiffPixels:0});
    await attachVisualFontEnvironment(page, info);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button',{name:'Open visual dialog',exact:true})).toBeFocused();
    await info.attach('visual-scope', {body: JSON.stringify({key, engine:info.project.name, theme,density,width,locale,direction,longLabels,
      reducedMotion:'emulated reduce',physicalDevice:false, actualBrowserZoom:false, spokenAT:false,warnings}),contentType:'application/json'});
    expect(warnings).toEqual([]);
  });
}
