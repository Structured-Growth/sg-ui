from pathlib import Path
import hashlib,json,difflib
root=Path(__file__).resolve().parents[5];out=Path(__file__).resolve().parent
fixture='apps/docs/native-fixtures/scenarios/experimental/DateRangeSelector/DateRangeSelector.fixture.tsx'
spec='packages/ui/tests/browser/calendar-period-draft-isolation.spec.ts'
old=(root/fixture).read_text()
new=old.replace('import { useState } from "react";', 'import { useCallback, useState } from "react";').replace('import { DateRangeSelector } from "@structured-growth/sg-ui/experimental";', 'import { DateRangeSelector, type DateRange } from "@structured-growth/sg-ui/experimental";')
assert new!=old
new+='''
// Adds only the missing typed-draft/controlled-endpoint navigation edge to the
// accepted independent From/To configuration. Diagnostics are private-host only.
function IndependentPeriodDraftHost() {
  const [value, setValue] = useState<DateRange | null>({start:"2026-10-07",end:"2026-10-16"});
  const [activeEndpoint, setActiveEndpoint] = useState<"start" | "end">("end");
  const [draftRequests, setDraftRequests] = useState<(DateRange | null)[]>([]);
  const [endpointRequests, setEndpointRequests] = useState<("start" | "end")[]>([]);
  const [valueRequests, setValueRequests] = useState<(DateRange | null)[]>([]);
  const recordDraft = useCallback((next: DateRange | null) => setDraftRequests(current => [...current, next]), []);
  const recordEndpoint = useCallback((next: "start" | "end") => {
    setActiveEndpoint(next); setEndpointRequests(current => [...current, next]);
  }, []);
  const recordValue = useCallback((next: DateRange | null) => {
    setValue(next); setValueRequests(current => [...current, next]);
  }, []);
  return <form aria-label="Independent period draft form">
    <DateRangeSelector label="Period draft dates" name="period" entryMode="text" showFields
      months={2} navigation="period" calendarNavigation="independent" calendarEndpoints={["start","end"]}
      rangeClickBehavior="active-endpoint" activeEndpoint={activeEndpoint} onActiveEndpointChange={recordEndpoint}
      defaultFocusedDate="2026-10-07" min="2026-01-01" max="2027-12-31" presets={[]}
      getDateUnavailableReason={(date,context) => context.endpoint === "start" && date.startsWith("2027") ? "No arrivals in 2027." : undefined}
      value={value} onValueChange={recordValue} onDraftChange={recordDraft}/>
    <output aria-label="Period draft requests">{JSON.stringify(draftRequests)}</output>
    <output aria-label="Period endpoint requests">{JSON.stringify(endpointRequests)}</output>
    <output aria-label="Period value requests">{JSON.stringify(valueRequests)}</output>
  </form>;
}
export const IndependentPeriodDraft: Story = { render: (_args,{globals}) =>
  <Provider theme={globals.theme} density="compact" interactionMode="pointer"><IndependentPeriodDraftHost/></Provider>
};
'''
test='''import {expect,test} from '@playwright/test';

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
'''
contents={fixture:new,spec:test};patch=[];h=lambda text:hashlib.sha256(text.encode()).hexdigest()
for path,content in contents.items():
 p=out/'proposed-files'/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
 before=(root/path).read_text() if (root/path).exists() else ''
 patch.extend(difflib.unified_diff(before.splitlines(True),content.splitlines(True),fromfile='a/'+path if before else '/dev/null',tofile='b/'+path))
(out/'period-draft-isolation.patch').write_text(''.join(patch))
(out/'period-draft-inputs.json').write_text(json.dumps({'files':{p:{'beforeSha256':h((root/p).read_text()) if (root/p).exists() else None,'proposedSha256':h(c)} for p,c in contents.items()},'newCaseCount':1,'config':'compact/light/en-US; one case per supported desktop engine, no matrix expansion','status':'proposed-only; runtime unexecuted','reuse':'Accepted apps/docs/tests/shared-calendar-pickers.spec.ts and year-scroll.spec.ts already prove view isolation/selection/size/keyboard focus. New edge adds edited draft plus invalid child text and controlled active endpoint; no repeated accepted matrix.'},indent=2)+'\n')
print(json.dumps({'files':list(contents),'newNativeCases':1}))
