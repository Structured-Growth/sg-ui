import { expect, test, type Page } from '@playwright/test';
const url='/fixtures/?id=editors-pagerichtexteditorsection--structured-content&globals=a11y.manual:!true';
type Node={type:string;text?:string;children?:Node[];[key:string]:unknown};
type Document={root:Node&{children:Node[]}};
const saved=async(page:Page):Promise<Document>=>JSON.parse((await page.getByLabel('Saved structured JSON',{exact:true}).textContent())!);
const nodes=(node:Node):Node[]=>[node,...(node.children??[]).flatMap(nodes)];
for(const target of ['nested list','code block','merged header'] as const)test(`native ${target} edit preserves saved rich nodes, history and read-only reload`,async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 const editor=page.getByRole('textbox',{name:'Structured content document',exact:true});
 await expect(editor).toBeVisible();
 const content=target==='nested list'?editor.locator('ol ul li'):target==='code block'?editor.locator('code[data-language="javascript"]'):editor.getByRole('columnheader');
 await content.click();
 if(target==='code block')await page.keyboard.press(process.platform==='darwin'?'Meta+ArrowRight':'End');
 else{
  // On macOS End scrolls without placing the caret at the end of this leaf.
  // Observe only; native ArrowRight input establishes the exact insertion point.
  const expected=target==='nested list'?'Nested practice lesson':'Lesson heading';
  const point=()=>content.evaluate(node=>{const selection=window.getSelection();return{text:selection?.anchorNode?.textContent,offset:selection?.anchorOffset,collapsed:selection?.isCollapsed,contained:!!selection?.anchorNode&&node.contains(selection.anchorNode)};});
  await expect.poll(point).toMatchObject({text:expected,collapsed:true,contained:true});
  for(let step=0;step<=expected.length;step++){
   const current=await point();
   if(current.offset===expected.length)break;
   expect(current.offset).toBeLessThan(expected.length);
   await page.keyboard.press('ArrowRight');
  }
  await expect.poll(point).toEqual({text:expected,offset:expected.length,collapsed:true,contained:true});
 }
 const before=await saved(page);let wordBoundary:Document|undefined;
 // Engines may create a history boundary for the leading space in a code node.
 // Keep actual typing and capture that exact intermediate document; full undo
 // must still restore the original bytes within at most these two native groups.
 if(target==='code block'){await page.keyboard.type(' ');await expect.poll(()=>saved(page)).not.toEqual(before);wordBoundary=await saved(page);await page.keyboard.type('revised');}else await page.keyboard.type(' revised');
 const index=target==='nested list'?3:target==='code block'?6:7;
 await expect.poll(async()=>JSON.stringify((await saved(page)).root.children[index])).toContain(' revised');
 const after=await saved(page);
 for(let i=0;i<before.root.children.length;i++)if(i!==index)expect(after.root.children[i]).toEqual(before.root.children[i]);
 if(target==='nested list'){
  const list=after.root.children[3];expect(list).toMatchObject({type:'list',listType:'number',start:3,tag:'ol'});
  expect(nodes(list).find(n=>n.type==='text'&&n.text==='Nested practice lesson revised')).toBeTruthy();
  expect(nodes(list).find(n=>n.type==='list'&&n.listType==='bullet')).toMatchObject({tag:'ul'});
 }else if(target==='code block'){
  expect(after.root.children[6]).toMatchObject({type:'code',language:'javascript'});
  expect(nodes(after.root.children[6]).filter(n=>n.type==='linebreak')).toHaveLength(1);
 }else{
  const cell=after.root.children[7].children![0].children![0];
  expect(cell).toMatchObject({type:'tablecell',colSpan:2,rowSpan:1,headerState:3,width:180,backgroundColor:'#fff59d'});
  expect(nodes(cell).find(n=>n.type==='text')).toMatchObject({text:'Lesson heading revised'});
 }
 const toolbar=page.getByRole('group',{name:'Text formatting',exact:true});
 let undoSteps=1;await toolbar.getByRole('button',{name:'Undo',exact:true}).click();
 if(wordBoundary){await expect.poll(async()=>{const current=JSON.stringify(await saved(page));return current===JSON.stringify(before)||current===JSON.stringify(wordBoundary);}).toBe(true);if(JSON.stringify(await saved(page))===JSON.stringify(wordBoundary)){undoSteps=2;await toolbar.getByRole('button',{name:'Undo',exact:true}).click();}}
 await expect.poll(()=>saved(page)).toEqual(before);
 await toolbar.getByRole('button',{name:'Redo',exact:true}).click();
 if(undoSteps===2){await expect.poll(()=>saved(page)).toEqual(wordBoundary);await toolbar.getByRole('button',{name:'Redo',exact:true}).click();}
 await expect.poll(()=>saved(page)).toEqual(after);
 await page.getByRole('button',{name:'Reload structured document',exact:true}).click();await expect.poll(()=>saved(page)).toEqual(after);
 await page.getByRole('button',{name:'Make read-only',exact:true}).click();await expect(editor).toHaveAttribute('contenteditable','false');
 await expect(content).toContainText(' revised');expect(await saved(page)).toEqual(after);
 expect(errors).toEqual([]);await info.attach(target,{body:JSON.stringify({before,wordBoundary,after,undoSteps}),contentType:'application/json'});
});
