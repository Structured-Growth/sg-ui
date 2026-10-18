import {test,expect,type Page,type Locator} from './fixtures';
import {exampleName} from './example-name';
const date=(host:Locator,iso:string)=>host.locator(`[data-sgui-date="${iso}"][role="button"]:not([data-outside-month])`).first();
async function drag(page:Page,from:Locator,to:Locator,unrelatedCancel=false){const a=(await from.boundingBox())!,b=(await to.boundingBox())!;await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});if(unrelatedCancel)await page.evaluate(()=>document.dispatchEvent(new PointerEvent('pointercancel',{pointerId:999999,pointerType:'touch',bubbles:true})));await page.mouse.up();}

test('independent calendars resize across months, ignore unrelated cancellation, focus the endpoint, and cancel on window blur',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Independent From and To months'),exact:true}),input=panel.getByRole('textbox',{name:'Travel interval',exact:true});
 await input.fill('10/28/2026 - 10/30/2026');await input.press('Enter');await panel.getByRole('button',{name:'Choose Travel interval',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Travel interval',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 await drag(page,date(dialog,'2026-10-30'),date(dialog,'2026-11-03'),true);
 await expect(start).toHaveValue('10/28/2026');await expect(end).toHaveValue('11/03/2026');await expect(date(dialog,'2026-11-03')).toBeFocused();
 await drag(page,date(dialog,'2026-10-29'),date(dialog,'2026-11-02'));
 await expect(start).toHaveValue('11/01/2026');await expect(end).toHaveValue('11/07/2026');await expect(date(dialog,'2026-11-02')).toBeFocused();
 const a=(await date(dialog,'2026-11-07').boundingBox())!,b=(await date(dialog,'2026-11-10').boundingBox())!;
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:6});
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();
 await expect(start).toHaveValue('11/01/2026');await expect(end).toHaveValue('11/07/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(input).toHaveValue('11/01/2026 – 11/07/2026');
});

test('drag endpoint restrictions use the actual boundary, independent of the active click endpoint',async({page})=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Selection-aware availability'),exact:true});await panel.getByRole('button',{name:'Choose Travel interval',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Travel interval',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 await dialog.getByRole('button',{name:'Start date',exact:true}).click();
 await expect(date(dialog,'2026-10-13')).toHaveAttribute('aria-disabled','true');
 expect(await date(dialog,'2026-10-13').evaluate(e=>getComputedStyle(e).touchAction)).toBe('none');
 await drag(page,date(dialog,'2026-10-16'),date(dialog,'2026-10-13'));await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/13/2026');
 await expect(date(dialog,'2026-10-13').locator('..')).toHaveAttribute('aria-selected','true');
 expect(await date(dialog,'2026-10-13').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe(await date(dialog,'2026-10-12').evaluate(e=>getComputedStyle(e).backgroundColor));
 await expect(date(dialog,'2026-10-13')).toHaveAttribute('aria-label',/October 13, 2026 selected$/);
 await expect(date(dialog,'2026-10-13')).not.toHaveAttribute('aria-invalid','true');
 await drag(page,date(dialog,'2026-10-13'),date(dialog,'2026-10-14'));await expect(end).toHaveValue('10/14/2026');
 await drag(page,date(dialog,'2026-10-07'),date(dialog,'2026-10-13'));await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/14/2026');await expect(dialog.getByRole('alert')).toBeVisible();
 await drag(page,date(dialog,'2026-10-10'),date(dialog,'2026-10-11'));await expect(start).toHaveValue('10/08/2026');await expect(end).toHaveValue('10/15/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.getByRole('textbox',{name:'Travel interval',exact:true})).toHaveValue('10/08/2026 – 10/15/2026');
});

test.describe('native touch range gestures',()=>{
 test.use({hasTouch:true,viewport:{width:390,height:900}});
 test('endpoint resizing, interior movement, pointer cancellation and the next tap remain independent',async({page})=>{
  await page.goto('/docs/components/date-range-picker');
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
  const fields=panel.getByRole('checkbox',{name:'Show endpoint fields',exact:true});await fields.focus();await fields.press('Space');
  const input=preview.getByRole('textbox',{name:'Course schedule',exact:true});await input.fill('10/7/2026 - 10/9/2026');await input.press('Enter');await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).tap();
  const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
  const cdp=await page.context().newCDPSession(page);
  async function touch(from:string,to:string,cancel=false){
   const a=(await date(dialog,from).boundingBox())!,b=(await date(dialog,to).boundingBox())!;
   const point=(x:number,y:number)=>({x,y,id:1,radiusX:2,radiusY:2,force:1});
   const x=a.x+a.width/2,y=a.y+a.height/2,dx=b.x+b.width/2-x,dy=b.y+b.height/2-y;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(x,y)]});
   for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(x+dx*i/8,y+dy*i/8)]});
   await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});
  }
  try{
   await touch('2026-10-09','2026-10-12');await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/12/2026');
   await touch('2026-10-07','2026-10-05');await expect(start).toHaveValue('10/05/2026');await expect(end).toHaveValue('10/12/2026');
   await touch('2026-10-08','2026-10-10');await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/14/2026');
   await touch('2026-10-14','2026-10-17',true);await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/14/2026');
   await date(dialog,'2026-10-20').tap();await expect(end).toHaveValue('10/20/2026');
   await dialog.getByRole('button',{name:'Apply',exact:true}).tap();await expect(input).toHaveValue('10/07/2026 – 10/20/2026');
  }finally{await cdp.detach();}
 });
});
