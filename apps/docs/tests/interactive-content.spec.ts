import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('survey navigation validates, retains answers and keeps sibling examples independent',async({page})=>{
 await page.goto('/docs/components/survey');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const sibling=page.getByRole('region',{name:exampleName('All questions together'),exact:true});
 await panel.getByRole('button',{name:'Next',exact:true}).click();
 await expect(panel.getByRole('group',{name:/How would/})).toBeVisible();
 await panel.getByText('Phone call',{exact:true}).click();
 await panel.getByRole('button',{name:'Next',exact:true}).click();
 await expect(panel.getByRole('group',{name:'What would make this helpful?',exact:true})).toBeVisible();
 await expect(panel.locator('[data-survey-focus]:visible')).toBeFocused();
 await panel.getByRole('textbox',{name:'Your answer',exact:true}).fill('Short conversations');
 await panel.getByRole('button',{name:'Back',exact:true}).click();
 await expect(panel.getByRole('radio',{name:'Phone call',exact:true})).toBeChecked();
 await expect(sibling.getByRole('radio',{name:'Phone call',exact:true})).not.toBeChecked();
 await panel.getByRole('button',{name:'Next',exact:true}).click();
 await panel.getByRole('button',{name:'Submit',exact:true}).click();
 await expect(panel.getByRole('status')).toContainText('Response prepared');
 await panel.screenshot({path:'/tmp/sgui-survey.png'});
 const forward=page.getByRole('region',{name:exampleName('Forward-only questions'),exact:true});
 await expect(forward.getByRole('button',{name:'Back',exact:true})).toHaveCount(0);
});

test('conversation sends local replies, preserves failed drafts and retries independently',async({page})=>{
 await page.goto('/docs/components/text-conversation');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const failed=page.getByRole('region',{name:exampleName('Failed delivery and retry'),exact:true});
 await panel.getByRole('textbox',{name:'Message',exact:true}).fill('Can we reschedule?');
 await panel.getByRole('button',{name:'Send',exact:true}).click();
 await expect(panel.getByRole('log')).toContainText('Can we reschedule?');
 await expect(panel.getByRole('textbox',{name:'Message',exact:true})).toHaveValue('');
 await expect(failed.getByRole('log')).not.toContainText('Can we reschedule?');
 await failed.getByRole('textbox',{name:'Message',exact:true}).fill('Please help');
 await failed.getByRole('button',{name:'Send',exact:true}).click();
 await expect(failed.getByRole('alert')).toContainText('could not be sent');
 await expect(failed.getByRole('textbox',{name:'Message',exact:true})).toHaveValue('Please help');
 await failed.getByText('Simulate delivery failure',{exact:true}).click();
 await failed.getByRole('button',{name:'Send',exact:true}).click();
 await expect(failed.getByRole('log')).toContainText('Please help');
 await expect(failed.getByRole('alert')).toHaveCount(0);
 await panel.screenshot({path:'/tmp/sgui-conversation.png'});
});

test('video rejects forward seeking, completes observed playback and leaves sibling playback unchanged',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/docs/components/video-player');
 const panel=page.getByRole('region',{name:exampleName('Replay watched sections'),exact:true});
 const video=panel.locator('video');await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
 expect(await video.evaluate(node=>(node as HTMLVideoElement).duration)).toBeCloseTo(30,0);
 await video.evaluate(node=>{(node as HTMLVideoElement).currentTime=24;});
 await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeLessThan(0.2);
 await video.evaluate(node=>(node as HTMLVideoElement).play());
 await expect(panel.getByRole('status').filter({hasText:'Viewing requirement met'})).toBeVisible({timeout:40000});
 const sibling=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('video');
 expect(await sibling.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBe(0);
 await sibling.evaluate(node=>(node as HTMLVideoElement).play());
 await expect(page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).getByRole('status').filter({hasText:'Viewing requirement met'})).toBeVisible({timeout:40000});
 await video.evaluate(node=>{(node as HTMLVideoElement).currentTime=2;});await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(2);
 await panel.getByRole('button',{name:'Transcript',exact:true}).click();await expect(panel.getByRole('region',{name:'Transcript',exact:true})).toBeVisible();
 await panel.screenshot({path:'/tmp/sgui-video.png'});
});

test('new catalog pages expose compiling source and reflect edited labels and answers',async({page})=>{
 const sources:{slug:string;source:string}[]=[];
 for(const slug of ['survey','survey-question','answer-feedback','text-conversation','video-player']){
  await page.goto('/docs/components/'+slug);
  for(const button of await page.getByRole('button',{name:/^Show source:/}).all())await button.click();
  for(const source of await page.locator('code[aria-label^="Source:"]').all())sources.push({slug,source:(await source.textContent())!});
 }
 await page.goto('/docs/components/survey-question');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('textbox',{name:'Prompt',exact:true}).fill('Edited "<Question>" {draft}');
 await panel.getByText('Email',{exact:true}).click();
 await panel.getByRole('button',{name:/^Show source:/}).click();
 const edited=(await panel.locator('code').textContent())!;expect(edited).toContain('useState<SurveyAnswer>("email")');
 sources.push({slug:'edited-question',source:edited});expect(checkSources(sources)).toEqual([]);
});


test('top-level Surveys navigation loads the site and opens its own category',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 const response=await page.goto('/');expect(response?.status()).toBe(200);
 const navigation=page.getByRole('navigation',{name:'Documentation',exact:true});
 await navigation.getByRole('button',{name:'Surveys',exact:true}).click();
 await expect(navigation.getByRole('link',{name:'Survey',exact:true})).toBeVisible();
 await expect(navigation.getByRole('link',{name:'SurveyQuestion',exact:true})).toBeVisible();
 await expect(navigation.getByRole('link',{name:'AnswerFeedback',exact:true})).toBeVisible();
 await navigation.getByRole('link',{name:'Survey',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Survey',level:1,exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});


test('seeking-disabled video rejects native timeline dragging while paused and playing',async({page})=>{
 await page.goto('/docs/components/video-player');
 const panel=page.getByRole('region',{name:exampleName('Seeking disabled'),exact:true});
 const video=panel.locator('video');
 await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
 await video.evaluate(node=>{
  node.setAttribute('data-native-seeks','0');
  node.addEventListener('seeking',()=>node.setAttribute('data-native-seeks',String(Number(node.getAttribute('data-native-seeks'))+1)));
 });
 async function scrub(){
  await video.scrollIntoViewIfNeeded();await video.hover();const box=(await video.boundingBox())!;
  // Chromium's native timeline sits above the bottom edge of the video.
  await page.mouse.move(box.x+box.width*0.15,box.y+box.height-20);
  await page.mouse.down();await page.mouse.move(box.x+box.width*0.85,box.y+box.height-20,{steps:20});await page.mouse.up();
 }
 await scrub();
 await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).seeking)).toBe(false);
 expect(Number(await video.getAttribute('data-native-seeks'))).toBeGreaterThan(0);
 expect(await video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeLessThan(0.2);
 await video.evaluate(node=>(node as HTMLVideoElement).play());
 await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeGreaterThan(0.6);
 await scrub();await video.evaluate(node=>(node as HTMLVideoElement).pause());
 await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).seeking)).toBe(false);
 expect(await video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeLessThan(2.5);
 await expect(panel.getByRole('status').filter({hasText:'Seeking is limited'})).toBeVisible();
 await expect(panel.getByRole('status').filter({hasText:'Viewing requirement met'})).toHaveCount(0);
 const free=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('video');
 await free.evaluate(node=>{(node as HTMLVideoElement).currentTime=4;});
 await expect.poll(()=>free.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeGreaterThan(3.8);
});
