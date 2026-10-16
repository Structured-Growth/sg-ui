import {test,expect} from '@playwright/test';
// Headless Chromium otherwise disables native scrollbar painting and hit testing.
test.use({launchOptions:{ignoreDefaultArgs:['--hide-scrollbars']}});

for(const name of ['main','sidebar'])test(`native ${name} scrollbar supports one continuous press and drag after wheel scrolling`,async({page})=>{
  await page.setViewportSize({width:1280,height:650});
  await page.goto('/docs/components/button');
  const pane=name==='main'?page.getByRole('main'):page.getByRole('navigation',{name:'Documentation',exact:true});
  const bounds=(await pane.boundingBox())!;
  await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
  await page.mouse.wheel(0,60);
  await expect.poll(()=>pane.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
  const thumb=await pane.evaluate(element=>{
    const rect=element.getBoundingClientRect();
    const border=Number.parseFloat(getComputedStyle(element).borderRightWidth)||0;
    const gutter=(element as HTMLElement).offsetWidth-element.clientWidth-element.clientLeft-border;
    const height=Math.max(18,element.clientHeight*element.clientHeight/element.scrollHeight);
    return {x:rect.right-border-gutter/2,y:rect.top+element.clientTop+element.scrollTop/element.scrollHeight*element.clientHeight+height/2,gutter,scroll:element.scrollTop};
  });
  expect(thumb.gutter).toBeGreaterThan(0);
  await page.mouse.move(thumb.x,thumb.y);
  await page.mouse.down();
  // Holding a stationary thumb must survive the quiet scrollbar's idle timeout.
  await page.waitForTimeout(1200);
  await page.mouse.move(thumb.x,thumb.y+35,{steps:8});
  await expect.poll(()=>pane.evaluate(element=>element.scrollTop)).toBeGreaterThan(thumb.scroll+5);
  const first=await pane.evaluate(element=>element.scrollTop);
  await page.mouse.move(thumb.x,thumb.y+60,{steps:8});
  await expect.poll(()=>pane.evaluate(element=>element.scrollTop)).toBeGreaterThan(first);
  await page.mouse.up();
});
