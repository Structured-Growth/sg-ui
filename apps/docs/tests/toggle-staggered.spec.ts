import {test,expect} from './fixtures';
import {exampleName} from './example-name';

test('staggered toggles share widths, alternate rows and retain ordered keyboard selection',async({page})=>{
  await page.goto('/docs/components/toggle-button-group');
  for(const orientation of ['horizontal','vertical']) for(const density of ['compact','comfortable']){
    const panel=page.getByRole('region',{name:exampleName(`Staggered ${orientation} · ${density} · equal widths`),exact:true});
    await panel.scrollIntoViewIfNeeded();
    const group=panel.getByRole('radiogroup',{name:'Number',exact:true});
    const buttons=group.getByRole('radio');
    for(const direction of ['ltr','rtl']){
      await group.evaluate((node,direction)=>node.setAttribute('dir',direction),direction);
      const boxes=await buttons.evaluateAll(nodes=>nodes.map(node=>{const box=node.getBoundingClientRect();return {x:box.x,y:box.y,width:box.width,height:box.height};}));
      expect(boxes).toHaveLength(6);
      for(let i=0;i<boxes.length;i++){
        expect(boxes[i].width).toBeCloseTo(boxes[0].width,0);
        if(orientation==='horizontal') expect(boxes[i].y).toBeCloseTo(boxes[i%2].y,0);
        else {expect(boxes[i].x).toBeCloseTo(boxes[i%2].x,0);expect(boxes[i].height).toBeCloseTo(boxes[0].height,0);}
      }
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
      const gap=await group.evaluate((node,orientation)=>parseFloat(orientation==='horizontal'?getComputedStyle(node).columnGap:getComputedStyle(node).rowGap),orientation);
      if(orientation==='horizontal')expect(Math.abs(boxes[1].x-boxes[0].x)).toBeCloseTo((boxes[0].width+gap)*.75,0);
      else expect(boxes[1].y-boxes[0].y).toBeCloseTo((boxes[0].height+gap)*.75,0);
      const bounds=(await group.boundingBox())!;
      if(orientation==='horizontal')expect(bounds.width).toBeLessThan(6*boxes[0].width+5*gap);
      else expect(bounds.height).toBeLessThan(6*boxes[0].height+5*gap);
      if(direction==='ltr'){await buttons.nth(0).focus();await page.keyboard.press(orientation==='horizontal'?'ArrowRight':'ArrowDown');
      await expect(buttons.nth(1)).toBeFocused();await page.keyboard.press('Space');
      await expect(buttons.nth(1)).toHaveAttribute('aria-checked','true');}
    }
    await page.setViewportSize({width:480,height:900});
    await panel.scrollIntoViewIfNeeded();
    const fits=await group.evaluate(node=>node.scrollWidth<=node.clientWidth+1);
    expect(fits).toBe(true);
    await page.setViewportSize({width:1280,height:900});
  }
});
