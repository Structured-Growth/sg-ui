import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('slider keyboard edits preserve range bounds, exact entry and native form reset',async({page})=>{
  await page.goto('/docs/components/slider');
  const range=page.getByRole('region',{name:exampleName('Range · horizontal · comfortable'),exact:true});
  const low=range.getByRole('slider',{name:/Minimum/}),high=range.getByRole('slider',{name:/Maximum/});
  await range.scrollIntoViewIfNeeded();await low.focus();await low.press('End');
  await expect(low).toHaveValue('75');await expect(high).toHaveAttribute('min','75');
  await low.press('Tab');await expect(high).toBeFocused();await high.press('Home');await expect(high).toHaveValue('75');
  const cents=page.getByRole('region',{name:exampleName('Dollars and cents'),exact:true});
  await cents.scrollIntoViewIfNeeded();await expect(cents.getByRole('slider')).toHaveValue('12.5');
  await expect(cents.getByRole('slider')).toHaveAttribute('aria-valuetext','$12.50');
  await cents.getByRole('slider').focus();await cents.getByRole('slider').press('ArrowRight');
  await expect(cents.getByRole('slider')).toHaveValue('12.51');await expect(cents.getByRole('slider')).toHaveAttribute('aria-valuetext','$12.51');
  const fractionalPercent=page.getByRole('region',{name:exampleName('Percentage with two decimal places'),exact:true});
  await expect(fractionalPercent.getByRole('slider')).toHaveValue('0.255');await expect(fractionalPercent.getByRole('slider')).toHaveAttribute('aria-valuetext','25.50%');
  const pointsPercent=page.getByRole('region',{name:exampleName('Percentage on a 0–100 scale'),exact:true});
  await expect(pointsPercent.getByRole('slider')).toHaveValue('25.5');await expect(pointsPercent.getByRole('slider')).toHaveAttribute('aria-valuetext','25.50%');
  const ticks=page.getByRole('region',{name:exampleName('Tick marks without snapping'),exact:true});
  await ticks.scrollIntoViewIfNeeded();await expect(ticks.locator('[data-sgui-part="slider-tick"]')).toHaveCount(11);
  await ticks.getByRole('slider').focus();await ticks.getByRole('slider').press('ArrowRight');await expect(ticks.getByRole('slider')).toHaveValue('24');
  const snapped=page.getByRole('region',{name:exampleName('Snap to tick increments'),exact:true});
  await snapped.scrollIntoViewIfNeeded();await snapped.getByRole('slider').focus();await snapped.getByRole('slider').press('ArrowRight');await expect(snapped.getByRole('slider')).toHaveValue('30');
  const track=snapped.getByRole('slider').locator('xpath=../../..'),trackBox=(await track.boundingBox())!;
  await page.mouse.click(trackBox.x+trackBox.width*.56,trackBox.y+trackBox.height/2);await expect(snapped.getByRole('slider')).toHaveValue('60');
  const scalar=page.getByRole('region',{name:exampleName('Single · horizontal · comfortable'),exact:true});
  await expect(scalar.getByRole('slider')).toHaveValue('40');
  const survey=page.getByRole('region',{name:exampleName('Stepped survey scale'),exact:true});
  await survey.scrollIntoViewIfNeeded();await survey.getByRole('slider').focus();await survey.getByRole('slider').press('ArrowRight');
  await expect(survey.getByRole('slider')).toHaveValue('4');
  const exact=page.getByRole('region',{name:exampleName('Slider with precise text entry'),exact:true});
  await exact.getByRole('textbox').fill('82.6');await exact.getByRole('textbox').press('Tab');
  await expect(exact.getByRole('slider')).toHaveValue('83');
  const form=page.getByRole('region',{name:exampleName('Native form and reset'),exact:true});
  await form.scrollIntoViewIfNeeded();await form.getByRole('slider',{name:/Minimum budget/}).focus();
  await form.getByRole('slider',{name:/Minimum budget/}).press('ArrowRight');
  await form.getByRole('button',{name:'Review budget'}).click();await expect(form.getByText('Draft budget: 210–700',{exact:true})).toBeVisible();
  await form.getByRole('button',{name:'Reset',exact:true}).click();await expect(form.getByRole('slider',{name:/Minimum budget/})).toHaveValue('200');
  await expect(page.getByRole('region',{name:exampleName('Disabled slider'),exact:true}).getByRole('slider')).toBeDisabled();
});

test('slider pointer geometry supports both orientations, densities and RTL with visible focus',async({page},info)=>{
  await page.goto('/docs/components/slider');
  for(const orientation of ['horizontal','vertical']) for(const density of ['compact','comfortable']){
    const panel=page.getByRole('region',{name:exampleName(`Single · ${orientation} · ${density}`),exact:true});
    await panel.scrollIntoViewIfNeeded();
    const input=panel.getByRole('slider');
    const thumb=input.locator('xpath=../..');
    const track=thumb.locator('..');
    const bounds=(await track.boundingBox())!;
    if(orientation==='vertical'){
      const minimum=(await panel.getByText('0',{exact:true}).boundingBox())!,maximum=(await panel.getByText('100',{exact:true}).boundingBox())!;
      expect(Math.abs(minimum.y+minimum.height/2-(bounds.y+bounds.height))).toBeLessThan(18);
      expect(Math.abs(maximum.y+maximum.height/2-bounds.y)).toBeLessThan(18);
    }
    if(orientation==='horizontal')await page.mouse.click(bounds.x+bounds.width*.7,bounds.y+bounds.height/2);
    else await page.mouse.click(bounds.x+bounds.width/2,bounds.y+bounds.height*.3);
    await expect(input).toHaveValue(/^(69|70|71)$/);
    const fill=(await panel.locator('[data-sgui-part="slider-fill"]').boundingBox())!;
    expect(orientation==='horizontal'?fill.height:fill.width).toBe(4);
    expect(orientation==='horizontal'?fill.y+fill.height/2:fill.x+fill.width/2).toBeCloseTo(orientation==='horizontal'?bounds.y+bounds.height/2:bounds.x+bounds.width/2,0);
    const hit=(await thumb.boundingBox())!;
    expect(hit.width).toBeGreaterThanOrEqual(density==='compact'?32:44);expect(hit.height).toBeGreaterThanOrEqual(density==='compact'?32:44);
    await input.press('ArrowUp');
    expect(await thumb.evaluate(node=>getComputedStyle(node,'::before').outlineStyle)).toBe('solid');
    const start=await input.inputValue();const center=(await thumb.boundingBox())!;
    await page.mouse.move(center.x+center.width/2,center.y+center.height/2);await page.mouse.down();
    await page.mouse.move(orientation==='horizontal'?bounds.x+bounds.width*.4:bounds.x+bounds.width/2,orientation==='horizontal'?bounds.y+bounds.height/2:bounds.y+bounds.height*.6,{steps:5});await page.mouse.up();
    expect(Number(await input.inputValue())).toBeLessThan(Number(start));
    await panel.screenshot({path:info.outputPath(`slider-${orientation}-${density}.png`)});

  }
  const verticalTicks=page.getByRole('region',{name:exampleName('Vertical tick lines'),exact:true});await verticalTicks.scrollIntoViewIfNeeded();
  const tickLines=verticalTicks.locator('[data-sgui-part="slider-tick"]');await expect(tickLines).toHaveCount(6);
  const verticalTrack=(await verticalTicks.getByRole('slider').first().locator('xpath=../../..').boundingBox())!;
  for(const tick of await tickLines.all()){const rect=(await tick.boundingBox())!;expect(rect.x+rect.width/2).toBeCloseTo(verticalTrack.x+verticalTrack.width/2,0);expect(rect.height).toBe(1);}
  const rtl=page.getByRole('region',{name:exampleName('Arabic locale and RTL'),exact:true});
  await rtl.scrollIntoViewIfNeeded();const rtlInput=rtl.getByRole('slider');
  const rtlTrack=rtlInput.locator('xpath=../../..');const rtlBounds=(await rtlTrack.boundingBox())!;
  await page.mouse.click(rtlBounds.x+rtlBounds.width*.2,rtlBounds.y+rtlBounds.height/2);
  await expect(rtlInput).toHaveValue(/^(79|80|81)$/);
  await rtlInput.press('ArrowLeft');await expect(rtlInput).toHaveValue(/^(80|81|82)$/);
  for(const mode of ['before','after','between','none']){
    const panel=page.getByRole('region',{name:exampleName(`Fill · ${mode}`),exact:true});await panel.scrollIntoViewIfNeeded();
    await expect(panel.getByRole('slider')).toHaveCount(3);
    const fill=panel.locator('[data-sgui-part="slider-fill"]');
    if(mode==='none'){await expect(fill).toHaveCount(0);continue;}
    const track=panel.getByRole('slider').first().locator('xpath=../../..');
    const bounds=(await track.boundingBox())!,paint=(await fill.boundingBox())!;
    const start=mode==='before'?0:mode==='after'?.8:.2,end=mode==='before'?.2:mode==='after'?1:.8;
    expect(paint.x-bounds.x).toBeCloseTo(bounds.width*start,0);expect(paint.width).toBeCloseTo(bounds.width*(end-start),0);
  }
  await page.setViewportSize({width:480,height:900});
  const survey=page.getByRole('region',{name:exampleName('Stepped survey scale'),exact:true});await survey.scrollIntoViewIfNeeded();
  const fits=await survey.locator('[data-sgui-part="slider"]').evaluate(node=>node.scrollWidth<=node.clientWidth+1);expect(fits).toBe(true);
  await survey.screenshot({path:info.outputPath('slider-survey.png')});
  const tickPanel=page.getByRole('region',{name:exampleName('Tick marks without snapping'),exact:true});await tickPanel.scrollIntoViewIfNeeded();await tickPanel.screenshot({path:info.outputPath('slider-increment-ticks.png')});
});

test('slider sources follow independent playground edits and compile against public exports',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/docs/components/slider');
  for(const button of await page.getByRole('button',{name:/^Show source:/}).all())await button.click();
  const initial=await page.locator('code[aria-label^="Source:"]').allTextContents();
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const sibling=page.getByRole('region',{name:exampleName('Single · vertical · compact'),exact:true});
  const siblingSource=await sibling.getByRole('code').textContent();
  await playground.getByRole('textbox',{name:'Label',exact:true}).fill('Edited "<Score>" {draft}');
  await playground.getByRole('button',{name:/Handles/}).click();await page.getByRole('option',{name:'3',exact:true}).click();
  await expect(playground.getByRole('slider')).toHaveCount(3);
  await playground.getByRole('button',{name:/Orientation/}).click();await page.getByRole('option',{name:'vertical',exact:true}).click();
  await playground.getByRole('slider').first().focus();await playground.getByRole('slider').first().press('ArrowUp');
  await playground.getByRole('button',{name:/Scale/}).click();await page.getByRole('option',{name:'price',exact:true}).click();
  const maximum=playground.getByRole('textbox',{name:'Upper bound',exact:true});await maximum.fill('10');await maximum.press('Tab');
  await playground.getByRole('button',{name:'USD Currency',exact:true}).click();await page.getByRole('option',{name:'EUR',exact:true}).click();
  await expect(playground.getByRole('slider').first()).toHaveAttribute('max','5');
  const minimum=playground.getByRole('textbox',{name:'Lower bound',exact:true});await minimum.fill('11');await minimum.press('Tab');
  await expect(minimum).toHaveAttribute('aria-invalid','true');await expect(playground.getByRole('slider').first()).toHaveAttribute('min','0');
  await minimum.fill('0');await minimum.press('Tab');
  const increment=playground.getByRole('textbox',{name:'Step size',exact:true});await increment.fill('5.5');await increment.press('Tab');
  expect(await playground.getByRole('slider').evaluateAll(nodes=>nodes.map(node=>(node as HTMLInputElement).value))).toEqual(['0','5.5','5.5']);
  await increment.fill('0.01');await increment.press('Tab');
  const tickIncrement=playground.getByRole('textbox',{name:'Tick increment',exact:true});await tickIncrement.fill('2');await tickIncrement.press('Tab');
  await playground.getByText('Show ticks',{exact:true}).click();await playground.getByText('Snap to increments',{exact:true}).click();
  await expect(playground.locator('[data-sgui-part="slider-tick"]')).toHaveCount(6);await expect(playground.getByRole('slider').first()).toHaveAttribute('step','2');
  const source=(await playground.getByRole('code').textContent())!;
  expect(source).toContain('orientation="vertical"');expect(source).toContain('max={10} step={0.01}');expect(source).toContain('minimumFractionDigits');expect(source).toContain('EUR');expect(source).toContain('increment={2} showTicks={true} snapToIncrements={true}');expect(source).toContain('useState<number|number[]>(');
  expect(await sibling.getByRole('code').textContent()).toBe(siblingSource);
  await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(source);
  expect(checkSources([...initial,source].map((source,index)=>({slug:`slider-${index}`,source})))).toEqual([]);
});
