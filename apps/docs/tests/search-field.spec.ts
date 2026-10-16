import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
import {openSiteTool,closeSiteTool} from './site-tools';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

test('standard SearchField: aliases, actions, clear, themes, keyboard and independent source',async({page},info)=>{
 await page.goto('/docs/components/search-field');await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:'Material Design',exact:true}).click();await closeSiteTool(page);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]'),input=preview.getByRole('searchbox',{name:'Find a course',exact:true});
 const sibling=page.getByRole('region',{name:exampleName('Comfortable search'),exact:true});await sibling.getByRole('button',{name:'Show source: Comfortable search',exact:true}).click();const before=(await sibling.getByRole('code').textContent())!;
 await preview.scrollIntoViewIfNeeded();await waitForNativeScrollToSettle(preview);await input.fill('components');
 const results=page.getByRole('region',{name:'Search results',exact:true});await expect(results.getByRole('button',{name:/Design systems/})).toBeVisible();
 await expect(results.locator('..')).toHaveAttribute('data-sgui-theme',/./);await info.attach('search-results',{body:await results.locator('..').screenshot({path:info.outputPath('results.png')}),contentType:'image/png'});
 await input.press('ArrowDown');const first=results.getByRole('button',{name:/Design systems/});await expect(first).toBeFocused();await page.keyboard.press('Escape');await expect(input).toBeFocused();await expect(results).toHaveCount(0);
 await input.fill('design');await input.press('ArrowDown');await page.keyboard.press('Enter');await expect(input).toHaveValue('Design systems');await expect(results).toHaveCount(0);
 await preview.getByRole('button',{name:'Clear search',exact:true}).click();await expect(input).toHaveValue('');await expect(input).toBeFocused();
 await input.fill('unknown');await expect(results.getByRole('status')).toHaveText('No results found.');await page.keyboard.press('Escape');
 const trailing=panel.getByRole('checkbox',{name:'Trailing icon',exact:true});await trailing.focus();await trailing.press('Space');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('endIcon={<SchoolIcon size={16}/>}');expect(checkSources([{slug:'search-playground',source}])).toEqual([]);await expect(sibling.getByRole('code')).toHaveText(before);
 await info.attach('search-field',{body:await preview.screenshot({path:info.outputPath('search.png')}),contentType:'image/png'});
});

test('standard SearchField: remote states, retry, standalone input and site reuse',async({page})=>{
 await page.goto('/docs/components/search-field');const panel=page.getByRole('region',{name:exampleName('Host-filtered results and retry'),exact:true}),input=panel.getByRole('searchbox',{name:'Find a course',exact:true});
 const error=panel.getByRole('checkbox',{name:'Mock error',exact:true});await error.focus();await error.press('Space');await input.fill('design');
 const results=page.getByRole('region',{name:'Search results',exact:true});await expect(results.getByRole('status')).toHaveText('Search failed. Retry to restore local results.');
 await panel.getByRole('button',{name:'Show source: Host-filtered results and retry',exact:true}).click();const source=(await panel.getByRole('code').textContent())!;expect(checkSources([{slug:'search-retry',source}])).toEqual([]);
 await input.click();await results.getByRole('button',{name:'Retry',exact:true}).click();await expect(results.getByRole('button',{name:/Design systems/})).toBeVisible();await page.keyboard.press('Escape');
 const standalone=page.getByRole('region',{name:exampleName('Standalone search and submission'),exact:true});await standalone.getByRole('searchbox',{name:'Search the course library',exact:true}).fill('design');await standalone.getByRole('searchbox').press('Enter');await expect(standalone.getByRole('status')).toHaveText('Search requested for “design”.');await standalone.getByRole('button',{name:'Show source: Standalone search and submission',exact:true}).click();expect(checkSources([{slug:'standalone-search',source:(await standalone.getByRole('code').textContent())!}])).toEqual([]);
 await page.goto('/docs/components');const main=page.getByRole('main');await expect(main.locator('[data-sgui-part="search-field"]')).toHaveCount(1);const indexSearch=main.getByRole('searchbox',{name:'Find a component',exact:true});await indexSearch.fill('Autocomplete');await expect(page.getByRole('region',{name:'Search results',exact:true})).toHaveCount(0);await expect(main.getByRole('status')).toHaveText('1 component pages');
 const nav=page.getByRole('navigation',{name:'Documentation',exact:true});await expect(nav.locator('[data-sgui-part="search-field"]')).toHaveCount(1);const search=nav.getByRole('searchbox',{name:'Find in navigation',exact:true});await search.fill('Autocomplete');await expect(page.getByRole('region',{name:'Component search results',exact:true}).getByRole('link',{name:'ComboBox',exact:true})).toBeVisible();
 await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
