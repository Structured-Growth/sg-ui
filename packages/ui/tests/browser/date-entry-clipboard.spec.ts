import {test,expect,type Page,type Locator} from '@playwright/test';
// Run through the existing leased native harness after the proposed fixture is
// integrated, registered and frozen. No clipboard permissions or synthetic events.
type NativeCase={kind:"date"|"time"|"range";initial:Record<string,string>;valid:readonly (readonly [string,Record<string,string>])[];invalid:readonly string[]};
const cases:NativeCase[]=[
 {kind:'date',initial:{entry:'2026-10-14'},valid:[['20261016',{entry:'2026-10-16'}],['Oct 17, 2026',{entry:'2026-10-17'}]],invalid:['10/','2/30/2026','10/13/2026','11/01/2026']},
 {kind:'time',initial:{entry:'09:30:00'},valid:[['315p',{entry:'15:15:00'}],['08:15:30',{entry:'08:15:30'}]],invalid:['8:','25:00']},
 {kind:'range',initial:{'entry.start':'2026-10-12','entry.end':'2026-10-14'},valid:[['2026-10-16 to 2026-10-18',{'entry.start':'2026-10-16','entry.end':'2026-10-18'}],['10/19/2026 – 10/20/2026',{'entry.start':'2026-10-19','entry.end':'2026-10-20'}]],invalid:['10/19/2026 -','10/20/2026 - 10/19/2026']},
];
async function paste(page:Page,target:Locator,text:string){
 const source=page.getByRole('textbox',{name:'Clipboard text',exact:true});
 await source.fill(text);await source.press('ControlOrMeta+A');await source.press('ControlOrMeta+C');
 await target.click();await target.press('ControlOrMeta+A');await target.press('ControlOrMeta+V');
}
for(const c of cases)test(`${c.kind}: trusted text paste, native submit and reset preserve the accepted transaction`,async({page,browser},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`/fixtures/?id=migration-proofs-datepicker-native-transactions--${c.kind}-text-paste&globals=locale:en-US;theme:light`);
 const form=page.getByRole('form',{name:'Clipboard transaction form'}),input=form.getByRole('textbox',{name:'Entry',exact:true});
 const accepted=()=>form.evaluate(node=>Object.fromEntries(new FormData(node as HTMLFormElement)));
 const requests=page.getByLabel('Clipboard requests',{exact:true}),submitted=page.getByLabel('Clipboard submitted',{exact:true});
 await form.evaluate(node=>{
  const records:{trusted:boolean;plain:string}[]=[];
  (window as unknown as {entryPasteEvents:typeof records}).entryPasteEvents=records;
  node.addEventListener('paste',event=>{const paste=event as ClipboardEvent;records.push({trusted:paste.isTrusted,plain:paste.clipboardData?.getData('text/plain')??''});},true);
 });
 let expected:Record<string,string>={...c.initial};const requested:Record<string,string>[]=[];
 try{
  for(const [index,[text,next]] of c.valid.entries()){
   await paste(page,input,text);
   // Draft insertion cannot authorize the booking or submit implicitly.
   expect(await accepted()).toEqual(expected);await expect(requests).toHaveText(JSON.stringify(requested.map(item=>c.kind==='range'?{start:item['entry.start'],end:item['entry.end']}:item.entry)));
   if(index===0)await input.press('Enter');else await form.getByRole('button',{name:'Leave entry',exact:true}).click();
   expected={...next};requested.push(expected);
   expect(await accepted()).toEqual(expected);
   await expect(submitted).toHaveText(index===0?'Not submitted':JSON.stringify(requested[0]));
   await form.getByRole('button',{name:'Submit entry',exact:true}).click();await expect(submitted).toHaveText(JSON.stringify(expected));
  }
  for(const text of c.invalid){
   await paste(page,input,text);await form.getByRole('button',{name:'Leave entry',exact:true}).click();
   await expect(input).toHaveValue(text);await expect(input).toHaveAttribute('aria-invalid','true');
   expect(await input.evaluate(node=>(node as HTMLInputElement).validity.valid)).toBe(false);expect(await accepted()).toEqual(expected);
   await form.getByRole('button',{name:'Submit entry',exact:true}).click();await expect(submitted).toHaveText(JSON.stringify(expected));
  }
  await expect(requests).toHaveText(JSON.stringify(requested.map(item=>c.kind==='range'?{start:item['entry.start'],end:item['entry.end']}:item.entry)));
  await form.getByRole('button',{name:'Reset entry',exact:true}).click();await expect(input).toHaveValue(c.invalid.at(-1)!);expect(await accepted()).toEqual(expected);
  await page.getByRole('checkbox',{name:'Prevent entry reset',exact:true}).uncheck();await form.getByRole('button',{name:'Reset entry',exact:true}).click();
  await expect.poll(accepted).toEqual(c.initial);expect(await input.evaluate(node=>(node as HTMLInputElement).validity.valid)).toBe(true);
  await expect(requests).toHaveText(JSON.stringify(requested.map(item=>c.kind==='range'?{start:item['entry.start'],end:item['entry.end']}:item.entry)));
  const events=await page.evaluate(()=>(window as unknown as {entryPasteEvents:{trusted:boolean;plain:string}[]}).entryPasteEvents);
  expect(events).toEqual([...c.valid.map(([text])=>text),...c.invalid].map(plain=>({trusted:true,plain})));
  expect(errors).toEqual([]);
 }finally{
  await info.attach('trusted-text-paste-receipt',{contentType:'application/json',body:JSON.stringify({engine:info.project.name,browserVersion:browser.version(),kind:c.kind,events:await page.evaluate(()=>(window as unknown as {entryPasteEvents:unknown[]}).entryPasteEvents),accepted:await accepted(),requests:await requests.textContent(),submitted:await submitted.textContent(),errors})});
 }
});

test('preset descriptions remain available during keyboard draft selection and Cancel',async({page})=>{
 await page.goto('/fixtures/?id=migration-proofs-daterangeselector--availability&globals=locale:en-US;theme:light');
 const early=page.getByRole('option',{name:'Early February',exact:true}),blocked=page.getByRole('option',{name:'February reporting period',exact:true});
 await expect(early).toHaveAccessibleDescription('First two weeks, before capacity closes.');
 await expect(blocked).toHaveAccessibleDescription('Includes the unavailable capacity date.');
 await expect(blocked).toHaveAttribute('aria-disabled','true');
 await early.focus();await early.press('Enter');await expect(early).toHaveAttribute('aria-selected','true');
 await expect(page.getByLabel('Committed booking dates')).toHaveText('No committed dates');
 await expect(early).toHaveAccessibleName('Early February');
 await expect(early).toHaveAccessibleDescription('First two weeks, before capacity closes.');
 await page.getByRole('button',{name:'Cancel',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(early).not.toHaveAttribute('aria-selected','true');
 await expect(early).toHaveAccessibleDescription('First two weeks, before capacity closes.');
 await expect(page.getByLabel('Committed booking dates')).toHaveText('No committed dates');
});
