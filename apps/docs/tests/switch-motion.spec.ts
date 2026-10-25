import {test,expect} from './fixtures';
import {exampleName} from './example-name';

test('switch thumb animates both ways with track colors at both densities and directions',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/docs/components/switch');
  // Track travel must follow its actual dimensions, including enlarged root text.
  await page.evaluate(()=>{document.documentElement.style.fontSize='20px';});
  for(const density of ['Compact density','Comfortable density']) {
    const panel=page.getByRole('region',{name:exampleName(density),exact:true});
    const control=panel.getByRole('switch',{name:'Email reminders',exact:true});
    await panel.scrollIntoViewIfNeeded();
    for(const direction of ['ltr','rtl']) {
      await control.evaluate((element,direction)=>{element.closest('[data-docs-preview]')!.setAttribute('dir',direction);},direction);
      const off=await control.evaluate(element=>{
        const track=element.closest('label')!.querySelector('[data-sgui-part="choice-control"]')!.firstElementChild!;
        return track.firstElementChild!.getBoundingClientRect().x;
      });
      await panel.getByText('Email reminders',{exact:true}).click();await expect(control).toBeChecked();
      const motion=await control.evaluate(element=>{
        const track=element.closest('label')!.querySelector('[data-sgui-part="choice-control"]')!.firstElementChild!;
        const thumb=track.firstElementChild!;
        const animations=track.getAnimations({subtree:true});
        const transform=animations.find(animation=>animation instanceof CSSTransition&&animation.transitionProperty==='transform');
        const colors=animations.filter(animation=>animation instanceof CSSTransition&&animation.transitionProperty==='background-color').length;
        if(!transform)return {animated:false,colors,middle:0,end:0,inside:false};
        animations.forEach(animation=>animation.pause());
        transform.currentTime=Number(transform.effect!.getTiming().duration)/2;
        const middle=thumb.getBoundingClientRect().x;
        animations.forEach(animation=>animation.finish());
        const end=thumb.getBoundingClientRect(),bounds=track.getBoundingClientRect();
        return {animated:true,colors,middle,end:end.x,inside:end.left>bounds.left&&end.right<bounds.right};
      });
      expect(motion.animated).toBe(true);expect(motion.colors).toBe(2);expect(motion.inside).toBe(true);
      expect(motion.middle).toBeGreaterThan(Math.min(off,motion.end));expect(motion.middle).toBeLessThan(Math.max(off,motion.end));
      expect(direction==='ltr'?motion.end>off:motion.end<off).toBe(true);
      await control.press('Space');await expect(control).not.toBeChecked();
      const reverse=await control.evaluate(element=>{
        const track=element.closest('label')!.querySelector('[data-sgui-part="choice-control"]')!.firstElementChild!;
        const animations=track.getAnimations({subtree:true});
        const animated=animations.some(animation=>animation instanceof CSSTransition&&animation.transitionProperty==='transform');
        animations.forEach(animation=>animation.finish());
        return {animated,x:track.firstElementChild!.getBoundingClientRect().x};
      });
      expect(reverse.animated).toBe(true);expect(reverse.x).toBeCloseTo(off,1);
    }
  }
});

test('reduced motion switches immediately without thumb or color transitions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/docs/components/switch');
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const control=panel.getByRole('switch',{name:'Email reminders',exact:true});
  const before=await control.evaluate(element=>element.closest('label')!.querySelector('[data-sgui-part="choice-control"]')!.firstElementChild!.firstElementChild!.getBoundingClientRect().x);
  await panel.getByText('Email reminders',{exact:true}).click();await expect(control).toBeChecked();
  const after=await control.evaluate(element=>{
    const track=element.closest('label')!.querySelector('[data-sgui-part="choice-control"]')!.firstElementChild!;
    return {x:track.firstElementChild!.getBoundingClientRect().x,animations:track.getAnimations({subtree:true}).length,
      duration:getComputedStyle(track.firstElementChild!).transitionDuration};
  });
  expect(after.x).toBeGreaterThan(before);expect(after.animations).toBe(0);expect(after.duration).toBe('0s');
});
