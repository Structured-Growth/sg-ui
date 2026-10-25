import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('rating hover is a preview, keyboard selects one answer, and native survey/reset preserves unanswered state',async({page})=>{
 await page.goto('/docs/components/rating');
 const panel=page.getByRole('region',{name:exampleName('Stars · horizontal · comfortable'),exact:true});
 await panel.scrollIntoViewIfNeeded();const choices=panel.locator('[data-sgui-part="rating-choice"]'),radios=panel.getByRole('radio');
 await choices.nth(2).hover();await expect(panel.locator('[data-filled]')).toHaveCount(3);await expect(panel.getByRole('radio',{checked:true})).toHaveCount(0);
 await page.mouse.move(0,0);await expect(panel.locator('[data-filled]')).toHaveCount(0);
 await radios.first().focus();await radios.first().press('ArrowRight');await expect(radios.nth(1)).toBeChecked();await expect(radios.nth(1)).toBeFocused();
 await panel.getByRole('button',{name:'Clear rating'}).click();await expect(panel.getByRole('radio',{checked:true})).toHaveCount(0);await expect(radios.first()).toBeFocused();
 const form=page.getByRole('region',{name:exampleName('Required survey answer and native reset'),exact:true});
 await form.getByRole('button',{name:'Review feedback'}).click();await expect(form.getByRole('radiogroup')).toHaveAttribute('aria-invalid','true');
 await expect(form.getByRole('status')).toHaveCount(0);
 await form.locator('[data-sgui-part="rating-choice"]').nth(3).click();await form.getByRole('button',{name:'Review feedback'}).click();
 await expect(form.getByRole('status')).toHaveText('Feedback draft: 4 / 5.');
 expect(await form.getByRole('radio',{checked:true}).evaluate(node=>new FormData((node as HTMLInputElement).form!).get('rating'))).toBe('4');
 await form.getByRole('button',{name:'Reset feedback'}).click();await expect(form.getByRole('radio',{checked:true})).toHaveCount(0);await expect(form.getByRole('status')).toHaveCount(0);
 const readonly=page.getByRole('region',{name:exampleName('Read-only rating'),exact:true});await readonly.locator('[data-sgui-part="rating-choice"]').first().click();await expect(readonly.getByRole('radio').nth(3)).toBeChecked();
 await expect(page.getByRole('region',{name:exampleName('Disabled rating'),exact:true}).getByRole('radio').first()).toBeDisabled();
});

test('rating supports numbers, labels, repeated/custom icon groups, density, RTL and system focus',async({page},info)=>{
 await page.goto('/docs/components/rating');
 for(const orientation of ['horizontal','vertical'])for(const density of ['compact','comfortable']){
  const panel=page.getByRole('region',{name:exampleName(`Stars · ${orientation} · ${density}`),exact:true});await panel.scrollIntoViewIfNeeded();
  const choices=panel.locator('[data-sgui-part="rating-choice"]');const a=(await choices.first().boundingBox())!,b=(await choices.nth(1).boundingBox())!;
  expect(a.height).toBeGreaterThanOrEqual(density==='compact'?32:44);expect(a.width).toBeGreaterThanOrEqual(density==='compact'?32:44);
  if(orientation==='horizontal'){expect(b.x).toBeGreaterThan(a.x);expect(b.y).toBe(a.y);}else{expect(b.y).toBeGreaterThan(a.y);expect(b.x).toBe(a.x);}
  await panel.getByRole('radio').first().focus();await panel.getByRole('radio').first().press(orientation==='horizontal'?'ArrowRight':'ArrowDown');await expect(panel.getByRole('radio').nth(1)).toBeChecked();
  await expect(choices.nth(1)).toHaveCSS('outline-style','solid');
 }
 for(const title of ['Stars · horizontal · comfortable','Background highlighting','Icons and backgrounds']) {
  const panel=page.getByRole('region',{name:exampleName(title),exact:true});
  const choices=panel.locator('[data-sgui-part="rating-choice"]');
  await choices.nth(2).click();await page.mouse.move(0,0);
  const styles=await choices.evaluateAll(nodes=>nodes.map(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node.querySelector('svg')!).color,fill:getComputedStyle(node.querySelector('svg')!).fill})));
  expect(styles[0]).toEqual(styles[1]);expect(styles[1]).toEqual(styles[2]);
  expect(styles[2]).not.toEqual(styles[3]);
  await expect(panel.getByRole('radio',{checked:true})).toHaveCount(1);
 }
 for(const orientation of ['horizontal','vertical'])for(const density of ['compact','comfortable']) {
  const panel=page.getByRole('region',{name:exampleName(`Staggered pain scale · ${orientation} · ${density}`),exact:true});
  await panel.scrollIntoViewIfNeeded();
  const choices=panel.locator('[data-sgui-part="rating-choice"]');
  const boxes=await panel.locator('[data-sgui-part="rating-option"]').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  expect(boxes[0].width).toBeCloseTo(boxes[1].width,0);
  if(orientation==='horizontal') {
   expect(boxes[1].y).toBeGreaterThan(boxes[0].y);expect(boxes[2].y).toBe(boxes[0].y);
   expect(boxes[1].x).toBeCloseTo((boxes[0].x+boxes[2].x)/2,0);
   const gap=await choices.first().evaluate(node=>parseFloat(getComputedStyle(node.parentElement!.parentElement!).columnGap));
   expect(boxes[1].x-boxes[0].x).toBeCloseTo((boxes[0].width+gap)*.75,0);
  } else {
   expect(boxes[1].x).toBeGreaterThan(boxes[0].x);expect(boxes[2].x).toBe(boxes[0].x);
   expect(boxes[1].y).toBeCloseTo((boxes[0].y+boxes[2].y)/2,0);
   const gap=await choices.first().evaluate(node=>parseFloat(getComputedStyle(node.parentElement!.parentElement!).rowGap));
   expect(boxes[1].y-boxes[0].y).toBeCloseTo((boxes[0].height+gap)*.75,0);
  }
  const annotation=panel.locator('[data-sgui-part="rating-annotation"]').first();
  const iconBox=(await annotation.boundingBox())!,firstBox=(await choices.first().boundingBox())!;
  if(orientation==='horizontal') {
   expect(iconBox.y+iconBox.height).toBeLessThanOrEqual(firstBox.y);
   const gap=boxes[1].y-(firstBox.y+firstBox.height);expect(gap).toBeLessThanOrEqual(8);
  } else {
   expect(iconBox.x).toBeGreaterThanOrEqual(boxes[1].x+boxes[1].width);
   expect(iconBox.y+iconBox.height/2).toBeCloseTo(firstBox.y+firstBox.height/2,0);
  }
  await panel.getByRole('radio').first().focus();await panel.getByRole('radio').first().press(orientation==='horizontal'?'ArrowRight':'ArrowDown');
  await expect(panel.getByRole('radio').nth(1)).toBeChecked();
 }
 const numberedLikert=page.getByRole('region',{name:exampleName('Likert labels above numbered answers'),exact:true});
 const numberedChoices=numberedLikert.locator('[data-sgui-part="rating-choice"]');
 await numberedChoices.nth(3).click();await page.mouse.move(0,0);
 await expect(numberedLikert.getByRole('radio',{name:'Agree',exact:true})).toBeChecked();
 await expect(numberedChoices.nth(3)).toHaveText('4');
 await expect(numberedLikert.locator('[data-filled]')).toHaveCount(1);
 const labelBoxes=await numberedLikert.locator('[data-sgui-part="rating-annotation"]').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {bottom:r.bottom,center:r.x+r.width/2};}));
 const numberBoxes=await numberedChoices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {top:r.top,center:r.x+r.width/2};}));
 for(let index=0;index<5;index++){expect(labelBoxes[index].bottom).toBeLessThanOrEqual(numberBoxes[index].top);expect(labelBoxes[index].center).toBeCloseTo(numberBoxes[index].center,0);}
 const likertLabels=['Strongly disagree','Disagree','Neither agree nor disagree','Agree','Strongly agree'];
 for(const layout of ['inline','staggered'])for(const orientation of ['horizontal','vertical'])for(const density of ['compact','comfortable']) {
  const title=`Likert · ${layout==='staggered'?'staggered · ':''}${orientation} · ${density}`;
  const panel=page.getByRole('region',{name:exampleName(title),exact:true});
  await expect(panel.getByRole('radio')).toHaveCount(5);
  const widths=await panel.locator('[data-sgui-part="rating-choice"]').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().width));
  for(const width of widths)expect(width).toBeCloseTo(widths[0],0);
  for(const label of likertLabels)await expect(panel.getByRole('radio',{name:label,exact:true})).toHaveCount(1);
  await panel.locator('[data-sgui-part="rating-choice"]').nth(3).click();await page.mouse.move(0,0);
  await expect(panel.getByRole('radio',{name:'Agree',exact:true})).toBeChecked();
  await expect(panel.locator('[data-filled]')).toHaveCount(1);
  const backgrounds=await panel.locator('[data-sgui-part="rating-choice"]').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundColor));
  expect(backgrounds[0]).toBe(backgrounds[1]);expect(backgrounds[0]).toBe(backgrounds[4]);expect(backgrounds[3]).not.toBe(backgrounds[0]);
 }
 for(const title of ['Plain stars','Plain hearts','Plain thumbs up from dashes']) {
  const panel=page.getByRole('region',{name:exampleName(title),exact:true});
  const choices=panel.locator('[data-sgui-part="rating-choice"]');
  await choices.nth(2).click();await page.mouse.move(0,0);
  await expect(choices.nth(2)).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await expect(choices.nth(2)).toHaveCSS('border-top-color','rgba(0, 0, 0, 0)');
  const box=(await choices.nth(2).boundingBox())!;expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
  await panel.getByRole('radio').nth(2).focus();await panel.getByRole('radio').nth(2).press('ArrowRight');
  await expect(panel.getByRole('radio').nth(3)).toBeChecked();await expect(choices.nth(3)).toHaveCSS('outline-style','solid');
 }
 const likelihood=page.getByRole('region',{name:exampleName('Seven-point likelihood with evenly spaced labels'),exact:true});
 const likelihoodChoices=likelihood.locator('[data-sgui-part="rating-choice"]');
 await expect(likelihoodChoices).toHaveCount(7);
 const anchors=likelihood.locator('[data-sgui-part="rating-scale-labels"]');
 await expect(anchors).toHaveText('Not at all likelyNeutralExtremely likely');
 const geometry=await likelihoodChoices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height,x:r.x,radius:getComputedStyle(node).borderRadius};}));
 for(const box of geometry){expect(box.width).toBeCloseTo(box.height,0);expect(box.width).toBe(44);expect(box.radius).toBe('50%');}
 for(let index=2;index<7;index++)expect(geometry[index].x-geometry[index-1].x).toBeCloseTo(geometry[1].x-geometry[0].x,0);
 expect(geometry[1].x-geometry[0].x-geometry[0].width).toBeGreaterThanOrEqual(8);
 const labelGeometry=await anchors.locator(':scope > span').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right};}));
 for(let index=1;index<3;index++)expect(labelGeometry[index].left-labelGeometry[index-1].right).toBeGreaterThanOrEqual(12);
 const bandWidth=(await anchors.boundingBox())!.width,hostWidth=(await likelihood.locator('[data-sgui-part="rating"]').boundingBox())!.width;
 expect(bandWidth).toBeLessThan(hostWidth*.85);

 await likelihoodChoices.nth(3).click();await page.mouse.move(0,0);await expect(likelihood.getByRole('radio',{checked:true})).toHaveValue('4');await expect(likelihood.locator('[data-filled]')).toHaveCount(1);
 await expect(likelihood.getByRole('radiogroup')).toHaveAccessibleDescription('Not at all likely Neutral Extremely likely');
 const verticalLikelihood=page.getByRole('region',{name:exampleName('Vertical likelihood with evenly spaced labels'),exact:true});
 await verticalLikelihood.scrollIntoViewIfNeeded();
 const verticalAnchors=await verticalLikelihood.locator('[data-sgui-part="rating-scale-labels"] > span').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,height:r.height};}));
 expect(verticalAnchors[0].x).toBeCloseTo(verticalAnchors[1].x,0);expect(verticalAnchors[1].x).toBeCloseTo(verticalAnchors[2].x,0);
 expect(verticalAnchors[1].y-verticalAnchors[0].y).toBeCloseTo(verticalAnchors[2].y-verticalAnchors[1].y,0);
 const verticalNumbers=verticalLikelihood.locator('[data-sgui-part="rating-choice"]');
 const firstNumber=(await verticalNumbers.first().boundingBox())!,lastNumber=(await verticalNumbers.last().boundingBox())!;
 expect(verticalAnchors[0].x).toBeGreaterThan(firstNumber.x+firstNumber.width);
 expect(verticalAnchors[0].y+verticalAnchors[0].height/2).toBeCloseTo(firstNumber.y+firstNumber.height/2,0);expect(verticalAnchors[2].y+verticalAnchors[2].height/2).toBeCloseTo(lastNumber.y+lastNumber.height/2,0);
 await verticalLikelihood.getByRole('radio').first().focus();await verticalLikelihood.getByRole('radio').first().press('ArrowDown');await expect(verticalLikelihood.getByRole('radio').nth(1)).toBeChecked();
 const staggeredLikelihood=page.getByRole('region',{name:exampleName('Staggered likelihood with evenly spaced labels'),exact:true});
 const staggeredBand=staggeredLikelihood.locator('[data-sgui-part="rating-scale-labels"]');
 const staggeredChoices=staggeredLikelihood.locator('[data-sgui-part="rating-choice"]');
 const bandBox=(await staggeredBand.boundingBox())!;
 const track=await staggeredChoices.first().evaluate(node=>{const r=node.parentElement!.parentElement!.getBoundingClientRect();return {x:r.x,width:r.width};});
 expect(track.x).toBeCloseTo(bandBox.x,0);expect(track.width).toBeCloseTo(bandBox.width,0);
 const staggeredBoxes=await staggeredChoices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,width:r.width,height:r.height};}));
 expect(staggeredBoxes[6].x-staggeredBoxes[0].x).toBeGreaterThan(6*44*.75);
 for(const box of staggeredBoxes){expect(box.width).toBe(44);expect(box.height).toBe(44);}
 const numbered=page.getByRole('region',{name:exampleName('Numbered scale'),exact:true});await numbered.locator('[data-sgui-part="rating-choice"]').nth(6).click();await expect(numbered.getByRole('radio',{checked:true})).toHaveValue('7');
 const labeled=page.getByRole('region',{name:exampleName('Labeled answers'),exact:true});await labeled.locator('[data-sgui-part="rating-choice"]').nth(3).click();await expect(labeled.getByRole('radio',{name:'Satisfied',exact:true})).toBeChecked();
 const thumbs=page.getByRole('region',{name:exampleName('Thumbs up from dashes'),exact:true});
 await expect(thumbs.getByText('-',{exact:true})).toHaveCount(5);
 await thumbs.locator('[data-sgui-part="rating-choice"]').nth(2).hover();
 await expect(thumbs.getByText('👍',{exact:true})).toHaveCount(3);
 await expect(thumbs.getByRole('radio',{checked:true})).toHaveCount(0);
 await page.mouse.move(0,0);await expect(thumbs.getByText('-',{exact:true})).toHaveCount(5);
 await thumbs.locator('[data-sgui-part="rating-choice"]').nth(2).click();await page.mouse.move(0,0);
 await expect(thumbs.getByText('👍',{exact:true})).toHaveCount(3);await expect(thumbs.getByText('-',{exact:true})).toHaveCount(2);
 await expect(thumbs.getByRole('radio',{checked:true})).toHaveValue('3');
 const hearts=page.getByRole('region',{name:exampleName('Repeated heart symbols'),exact:true});await hearts.locator('[data-sgui-part="rating-choice"]').nth(2).click();await page.mouse.move(0,0);await expect(hearts.getByRole('radio',{checked:true})).toHaveValue('3');const heartChoices=hearts.locator('[data-sgui-part="rating-choice"]');
 for(let index=0;index<5;index++)await expect(heartChoices.nth(index).locator('svg')).toHaveAttribute('fill',index<3?'currentColor':'none');
 const heartGeometry=await heartChoices.locator('svg').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height,path:node.querySelector('path')!.getAttribute('d')};}));
 for(const geometry of heartGeometry)expect(geometry).toEqual(heartGeometry[0]);
 const pain=page.getByRole('region',{name:exampleName('Pain scale with distinct icons'),exact:true});
 await pain.locator('[data-sgui-part="rating-choice"]').nth(6).click();await page.mouse.move(0,0);
 await expect(pain.getByRole('radio',{name:'6 — Strong pain',exact:true})).toBeChecked();
 await expect(pain.locator('[data-filled]')).toHaveCount(1);
 await expect(pain.getByText('😣',{exact:true})).toBeVisible();
 await expect(pain.getByRole('radio')).toHaveCount(11);
 const painChoices=pain.locator('[data-sgui-part="rating-choice"]');
 await expect(painChoices.nth(1).locator('[aria-hidden="true"]')).toHaveText('1');
 await painChoices.nth(1).click();await page.mouse.move(0,0);
 await expect(pain.getByRole('radio',{checked:true})).toHaveValue('1');
 const annotation=pain.locator('[data-sgui-part="rating-annotation"]').first();
 expect((await annotation.boundingBox())!.y).toBeLessThan((await painChoices.first().boundingBox())!.y);
 await expect(painChoices.first()).toHaveText('0');


 const faces=page.getByRole('region',{name:exampleName('Different icons for each answer'),exact:true});await faces.locator('[data-sgui-part="rating-choice"]').nth(3).click();await page.mouse.move(0,0);await expect(faces.locator('[data-filled]')).toHaveCount(1);
 const clusters=page.getByRole('region',{name:exampleName('Several icons in each choice'),exact:true});await clusters.scrollIntoViewIfNeeded();const clusterChoices=clusters.locator('[data-sgui-part="rating-choice"]');
 for(let index=0;index<5;index++)await expect(clusterChoices.nth(index).locator('svg')).toHaveCount(index+1);
 const stackedContent=await clusterChoices.first().locator('[data-layout="stacked"]').evaluate(node=>{const icon=node.children[0].getBoundingClientRect(),label=node.children[1].getBoundingClientRect();return icon.bottom<=label.top;});expect(stackedContent).toBe(true);

 await clusterChoices.nth(3).click();await expect(clusters.getByRole('radio',{checked:true})).toHaveCount(1);await expect(clusters.getByRole('radio',{checked:true})).toHaveValue('4');await expect(clusters.getByRole('img')).toHaveCount(0);
 const rtl=page.getByRole('region',{name:exampleName('Arabic locale and RTL'),exact:true});await rtl.scrollIntoViewIfNeeded();const rtlChoices=rtl.locator('[data-sgui-part="rating-choice"]');
 expect((await rtlChoices.first().boundingBox())!.x).toBeGreaterThan((await rtlChoices.nth(1).boundingBox())!.x);await rtl.getByRole('radio').first().focus();await rtl.getByRole('radio').first().press('ArrowLeft');await expect(rtl.getByRole('radio').nth(1)).toBeChecked();
 await page.setViewportSize({width:480,height:900});await clusters.scrollIntoViewIfNeeded();expect(await clusters.locator('[data-sgui-part="rating"]').evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);
 await clusters.screenshot({path:info.outputPath('rating-icon-groups.png')});
 await page.emulateMedia({forcedColors:'active'});await clusters.getByRole('radio').nth(3).focus();await clusters.getByRole('radio').nth(3).press('ArrowLeft');await expect(clusterChoices.nth(2)).toHaveCSS('outline-style','solid');await expect(clusters.getByRole('radio').nth(2)).toBeChecked();
});

test('rating playground/source stays independent, serializes labels safely and compiles custom icon examples',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/docs/components/rating');
 for(const button of await page.getByRole('button',{name:/^Show source:/}).all())await button.click();
 const initial=await page.locator('code[aria-label^="Source:"]').allTextContents();
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const sibling=page.getByRole('region',{name:exampleName('Repeated heart symbols'),exact:true});const before=await sibling.getByRole('code').textContent();
 await playground.getByRole('textbox',{name:'Question label',exact:true}).fill('Edited "<Rating>" {answer}');
 await playground.getByRole('button',{name:/Presentation/}).click();await page.getByRole('option',{name:'hearts',exact:true}).click();
 await playground.getByRole('button',{name:/Scale size/}).click();await page.getByRole('option',{name:'7',exact:true}).click();
 await playground.locator('[data-sgui-part="rating-choice"]').nth(4).click();
 const source=(await playground.getByRole('code').textContent())!;expect(source).toContain('useState<number|null>(5)');expect(source).toContain('icon={<HeartIcon fill="currentColor"/>} emptyIcon={<HeartIcon/>}');expect(source).toContain('max={7}');
 expect(await sibling.getByRole('code').textContent()).toBe(before);
 await playground.getByRole('button',{name:'Copy code: Prop playground',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(source);
 expect(checkSources([...initial,source].map((source,index)=>({slug:`rating-${index}`,source})))).toEqual([]);
});
