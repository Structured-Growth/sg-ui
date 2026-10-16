import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])test(`editor typing does not highlight its bounds: ${theme}`,async({page})=>{
 await page.goto(`/fixtures/?id=editors-pagerichtexteditorsection-paragraph-transactions--paragraph-command-history&globals=theme:${theme};a11y.manual:!true`);
 const editor=page.getByRole('textbox',{name:'Paragraph transaction document',exact:true});
 const outline=()=>editor.evaluate(element=>getComputedStyle(element).outlineStyle);
 await editor.locator('p').first().locator('strong').click();await expect(editor).toBeFocused();
 expect(await outline()).toBe('none');
 await editor.press('End');await editor.pressSequentially(' Typed without a box.');
 await editor.press('Enter');await editor.pressSequentially('Another paragraph.');
 await expect(editor).toContainText('Typed without a box.');
 await expect(editor).not.toHaveAttribute('data-focus-visible');expect(await outline()).toBe('none');
 // The adjacent scroll region and document retain their keyboard navigation cues.
 await editor.press('Shift+Tab');
 const viewport=page.getByRole('region',{name:'Document scroll region',exact:true});
 await expect(viewport).toBeFocused();
 expect(await viewport.evaluate(element=>getComputedStyle(element).outlineStyle)).toBe('solid');
 await page.keyboard.press('Tab');await expect(editor).toBeFocused();
 await expect(editor).toHaveAttribute('data-focus-visible','true');expect(await outline()).toBe('solid');
 await editor.locator('p').first().click();await expect(editor).toBeFocused();
 await expect(editor).not.toHaveAttribute('data-focus-visible');expect(await outline()).toBe('none');
});
