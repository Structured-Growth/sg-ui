import {expect,test} from '@playwright/test';

test('independent period choices preserve an edited draft, partial input and controlled active endpoint',async({page},info)=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'||message.type()==='warning')errors.push(message.text());});
  await page.setViewportSize({width:1100,height:900});
  await page.goto('/fixtures/?id=migration-proofs-daterangeselector--independent-period-draft&embed=true&globals=locale:en-US;theme:light;density:compact');
  const form=page.getByRole('form',{name:'Independent period draft form',exact:true});
  const from=form.getByRole('application',{name:/^Period draft dates, Start date, calendar 1,/});
  const to=form.getByRole('application',{name:/^Period draft dates, End date, calendar 2,/});
  const start=form.getByRole('textbox',{name:'Start date',exact:true});
  const end=form.getByRole('textbox',{name:'End date',exact:true});
  const endpoints=form.getByRole('group',{name:'Edit range endpoint',exact:true});
  const draft=form.locator('[data-sgui-part="date-range-draft"]');
  const draftRequests=form.getByLabel('Period draft requests',{exact:true});
  const endpointRequests=form.getByLabel('Period endpoint requests',{exact:true});
  const valueRequests=form.getByLabel('Period value requests',{exact:true});
  const accepted=()=>form.evaluate(node=>Object.fromEntries(new FormData(node as HTMLFormElement)));
  const initial={'period.start':'2026-10-07','period.end':'2026-10-16'};
  await expect(from.getByRole('button',{name:'Choose month, October',exact:true})).toBeVisible();
  await expect(to.getByRole('button',{name:'Choose month, November',exact:true})).toBeVisible();

  // A valid text edit changes the local draft without committing before Apply.
  await start.fill('10/09/2026');await start.press('Enter');
  await expect(draft).toHaveText('2026-10-09 – 2026-10-16');
  expect(await accepted()).toEqual(initial);
  // The unfinished end text must survive chooser mounting/navigation too.
  await end.fill('10/');await endpoints.getByRole('button',{name:'Start date',exact:true}).click();
  await expect(end).toHaveValue('10/');await expect(end).toHaveAttribute('aria-invalid','true');
  await expect(endpoints.getByRole('button',{name:'Start date',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(draftRequests).toHaveText(JSON.stringify([
    {start:'2026-10-07',end:'2026-10-16'}, {start:'2026-10-09',end:'2026-10-16'},
  ]));
  const endpointBefore=await endpointRequests.textContent();
  const draftBefore=await draftRequests.textContent();
  const originalEnd=await end.elementHandle();

  async function unchanged(){
    await expect(start).toHaveValue('10/09/2026');await expect(end).toHaveValue('10/');
    expect(await originalEnd!.evaluate(node=>node.isConnected)).toBe(true);
    await expect(end).toHaveAttribute('aria-invalid','true');
    await expect(draft).toHaveText('2026-10-09 – 2026-10-16');
    await expect(draftRequests).toHaveText(draftBefore!);await expect(endpointRequests).toHaveText(endpointBefore!);
    await expect(valueRequests).toHaveText('[]');expect(await accepted()).toEqual(initial);
    await expect(endpoints.getByRole('button',{name:'Start date',exact:true})).toHaveAttribute('aria-pressed','true');
    await expect(endpoints.getByRole('button',{name:'End date',exact:true})).toHaveAttribute('aria-pressed','false');
    await expect(form.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
    await expect(from.getByRole('button',{name:'Choose month, October',exact:true})).toBeVisible();
    await expect(from.getByRole('button',{name:'Choose year, 2026',exact:true})).toBeVisible();
  }
  await to.getByRole('button',{name:'Choose month, November',exact:true}).click();
  await to.getByRole('group',{name:'Choose month',exact:true}).getByRole('button',{name:'March',exact:true}).click();
  await expect(to.getByRole('button',{name:'Choose month, March',exact:true})).toBeFocused();
  await expect(to.getByRole('button',{name:'Choose year, 2026',exact:true})).toBeVisible();
  await unchanged();
  await to.getByRole('button',{name:'Choose year, 2026',exact:true}).click();
  await to.getByRole('group',{name:'Choose year',exact:true}).getByRole('button',{name:'2027',exact:true}).click();
  await expect(to.getByRole('button',{name:'Choose year, 2027',exact:true})).toBeFocused();
  await expect(to.getByRole('button',{name:'Choose month, March',exact:true})).toBeVisible();
  await unchanged();

  // Correct the existing input and Apply; the original edited start survives.
  await end.fill('10/16/2026');await end.press('Enter');
  await expect(form.getByRole('button',{name:'Apply',exact:true})).toBeEnabled();
  await form.getByRole('button',{name:'Apply',exact:true}).click();
  await expect(valueRequests).toHaveText(JSON.stringify([{start:'2026-10-09',end:'2026-10-16'}]));
  expect(await accepted()).toEqual({'period.start':'2026-10-09','period.end':'2026-10-16'});
  await info.attach('independent-period-draft',{body:await page.screenshot(),contentType:'image/png'});
  expect(errors).toEqual([]);
});
