import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('learner due matrix uses the fixed host clock and retains missing-date fallback',async({page})=>{
 await page.goto('/docs/components/learner-card');
 const panel=page.getByRole('region',{name:exampleName('Due dates and course content'),exact:true});
 await expect(panel.getByText('Due date unavailable',{exact:true})).toBeVisible();
 await expect(panel.getByText(/Due today in/)).toBeVisible();
 await expect(panel.getByText(/Due tomorrow at/)).toBeVisible();
 await panel.getByRole('button',{name:'Continue',exact:true}).first().click();
 await expect(panel.getByRole('status').filter({hasText:'Continue requested for'})).toBeVisible();
 await panel.getByRole('button',{name:'Show source: Due dates and course content',exact:true}).click();
 expect(checkSources([{slug:'due-matrix',source:await panel.getByLabel('Source: Due dates and course content',{exact:true}).innerText()}])).toEqual([]);
});

test('saved rich documents render public JSON in independent editable and read-only panels',async({page})=>{
 await page.goto('/docs/components/page-rich-text-editor-section');
 const editable=page.getByRole('region',{name:exampleName('Saved rich document — editable'),exact:true});
 const readonly=page.getByRole('region',{name:exampleName('Saved rich document — read only'),exact:true});
 for(const panel of [editable,readonly]) {
  await expect(panel.getByRole('heading',{name:'Design a meaningful learning activity',exact:true})).toBeVisible();
  await expect(panel.getByRole('link',{name:'Read the course planning guide',exact:true})).toHaveAttribute('rel',/noopener/);
  await expect(panel.getByRole('table')).toContainText('15 minutes');
  const image=panel.getByRole('img',{name:'Learning sequence: learn, practice, reflect',exact:true});
  await expect.poll(()=>image.evaluate(node=>(node as HTMLImageElement).naturalWidth)).toBe(640);
 }
 const editor=editable.getByRole('textbox',{name:'Saved course guide',exact:true});
 await editor.focus();await page.keyboard.press('ControlOrMeta+End');await page.keyboard.type(' Local edit.');
 await expect(editor).toContainText('Local edit.');
 await expect(readonly.getByRole('textbox',{name:'Saved course guide',exact:true})).toHaveAttribute('contenteditable','false');
 await expect(readonly).not.toContainText('Local edit.');
 for(const [panel,title] of [[editable,'Saved rich document — editable'],[readonly,'Saved rich document — read only']] as const){
  await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
  expect(checkSources([{slug:title,source:await panel.getByLabel(`Source: ${title}`,{exact:true}).innerText()}])).toEqual([]);
 }
});

test('host image adapter preserves a rejected upload for retry and inserts a durable asset',async({page})=>{
 await page.goto('/docs/components/page-rich-text-editor-section');
 const panel=page.getByRole('region',{name:exampleName('Host image upload and retry'),exact:true});
 const editor=panel.getByRole('textbox',{name:'Host image upload document',exact:true});
 await editor.click();
 await panel.getByRole('button',{name:'Insert',exact:true}).click();
 await page.getByRole('menuitem',{name:'Image',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Insert Image',exact:true});
 await dialog.locator('input[type="file"]').setInputFiles({name:'diagram.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==','base64')});
 await dialog.getByRole('textbox',{name:'Image description',exact:true}).fill('Learning diagram');
 await dialog.getByRole('button',{name:'Insert',exact:true}).click();
 await expect(dialog.getByText('Sample upload failed. Retry with the same file.',{exact:true})).toBeVisible();
 await dialog.getByRole('button',{name:'Insert',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 const image=editor.getByRole('img');
 await expect(image).toHaveAttribute('src','/course-guide.svg');
 await expect.poll(()=>image.evaluate(node=>(node as HTMLImageElement).naturalWidth)).toBe(640);
 await panel.getByRole('button',{name:'Show source: Host image upload and retry',exact:true}).click();
 expect(checkSources([{slug:'host-upload',source:await panel.getByLabel('Source: Host image upload and retry',{exact:true}).innerText()}])).toEqual([]);
});
