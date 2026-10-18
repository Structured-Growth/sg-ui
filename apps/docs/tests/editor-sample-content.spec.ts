import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const [slug,title,label] of [
 ['page-rich-text-editor-section','PageRichTextEditorSection','Example rich document'],
 ['floating-text-selection-toolbar','FloatingTextSelectionToolbar','Selection demonstration'],
] as const)test(`${title} starts with two sample paragraphs and no reset action`,async({page})=>{
 await page.goto(`/docs/components/${slug}`);
 const overview=page.getByRole('region',{name:`${title} at a glance`,exact:true});
 const initial=overview.getByRole('textbox',{name:label,exact:true});
 await expect(initial.locator('p')).toHaveCount(2);
 expect((await initial.locator('p').allTextContents()).map(text=>text.split('.').filter(sentence=>sentence.trim()).length)).toEqual([2,2]);
 await expect(initial).toContainText('Lorem ipsum dolor sit amet');
 await expect(initial.locator('p').nth(1)).toContainText('Ut enim ad minim veniam');
 await expect(page.getByRole('button',{name:/Replace host document|Reset text/i})).toHaveCount(0);
 const editors=page.getByRole('textbox',{name:label,exact:true});
 for(const editor of await editors.all())await expect(editor.locator('p')).toHaveCount(2);
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const editor=playground.getByRole('textbox',{name:label,exact:true});
 await editor.click();await editor.press('ControlOrMeta+End');await editor.press('End');await editor.pressSequentially(' Local edit.');
 await expect(editor).toContainText('Local edit.');await expect(initial).not.toContainText('Local edit.');
 if(slug==='page-rich-text-editor-section')expect(await editor.evaluate(element=>getComputedStyle(element).outlineStyle)).toBe('none');
 const sources:{slug:string;source:string}[]=[];
 for(const panel of await page.locator('[data-docs-example]').all()){
  await panel.getByRole('button',{name:/^Show source:/}).click();
  const source=(await panel.locator('code[aria-label^="Source:"]').textContent())!;
  expect(source).not.toContain('Replace host document');expect(source).not.toContain('setRevision');
  sources.push({slug,source});
 }
 expect(await playground.locator('code[aria-label^="Source:"]').textContent()).toContain('Local edit.');
 expect(checkSources(sources)).toEqual([]);
 if(slug==='page-rich-text-editor-section'){
  const upload=page.getByRole('region',{name:exampleName('Host image upload and retry'),exact:true});
  await expect(upload.getByRole('textbox',{name:'Host image upload document',exact:true}).locator('p')).toHaveCount(2);
  await expect(page.getByRole('textbox',{name:'Saved course guide',exact:true}).first()).toContainText('Design a meaningful learning activity');
 }
});
