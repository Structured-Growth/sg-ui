import {expect, test, type CDPSession, type Locator} from '@playwright/test';
const host = '/fixtures/?id=migration-proofs-form-participation--';
const expectedAddress = {fullName: 'Alex Example', email: 'alex@example.test', address: '123 Test Street', city: 'Chicago', postcode: '60601'};
const address = {fields: [
  {name: 'NAME_FULL', value: expectedAddress.fullName}, {name: 'EMAIL_ADDRESS', value: expectedAddress.email},
  {name: 'ADDRESS_HOME_STREET_ADDRESS', value: expectedAddress.address}, {name: 'ADDRESS_HOME_CITY', value: expectedAddress.city},
  {name: 'ADDRESS_HOME_STATE', value: 'IL'}, {name: 'ADDRESS_HOME_ZIP', value: expectedAddress.postcode},
  {name: 'ADDRESS_HOME_COUNTRY', value: 'US'},
]};
async function output<T>(region: Locator, name: string): Promise<T> {
  return JSON.parse((await region.getByRole('status', {name, exact: true}).textContent())!);
}
async function values(region: Locator, owner: string) {
  return region.getByRole('form', {name: `Native autofill form ${owner}`, exact: true})
    .evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement)));
}
async function nativeAutofill(session: CDPSession, input: Locator) {
  const id = await input.getAttribute('id'); expect(id).toBeTruthy();
  const {root} = await session.send('DOM.getDocument');
  const {nodeId} = await session.send('DOM.querySelector', {nodeId: root.nodeId, selector: `[id=${JSON.stringify(id)}]`});
  expect(nodeId).toBeGreaterThan(0);
  const {node} = await session.send('DOM.describeNode', {nodeId});
  const filled: unknown[] = [];
  const record = (event: unknown) => filled.push(event);
  session.on('Autofill.addressFormFilled', record);
  try {
    await input.focus();
    // Browser autofill pipeline, never DOM assignment, locator.fill or synthetic input dispatch.
    // This tests CDP address autofill; it does not claim saved-profile popup selection.
    await session.send('Autofill.trigger', {fieldId: node.backendNodeId, address});
    await expect.poll(() => filled.length, {message: 'native Autofill.addressFormFilled event'}).toBeGreaterThan(0);
    await test.info().attach('native-address-autofill-events', {body: JSON.stringify(filled, null, 2), contentType: 'application/json'});
  } finally {session.off('Autofill.addressFormFilled', record);}
}

async function attachFinalObservation(region: Locator) {
  await test.info().attach('autofill-final-observation', {body: JSON.stringify({
    requests: await output(region,'Native autofill requests'),
    inputEvents: await output(region,'Native autofill events'),
    formA: await values(region,'a'), formB: await values(region,'b'),
    fields: await region.locator('input:not([type="checkbox"]),textarea').evaluateAll(nodes => nodes.map(element => {
      const input=element as HTMLInputElement|HTMLTextAreaElement;
      return {id:input.id,name:input.name,value:input.value,defaultValue:input.defaultValue,form:input.form?.id,autoComplete:input.autocomplete,disabled:input.disabled,readOnly:input.readOnly};
    })),
  },null,2),contentType:'application/json'});
}
test('native CDP baseline dispatches React changes on unmanaged native inputs',async({page,context,browserName})=>{
  test.skip(browserName!=='chromium','CDP Autofill is Chromium-only');
  await page.goto(host+'native-baseline&globals=a11y.manual:!true');
  const region=page.getByRole('region',{name:'uncontrolled native autofill baseline',exact:true});
  const session=await context.newCDPSession(page);await session.send('Autofill.enable');
  try {
    await nativeAutofill(session,region.getByRole('textbox',{name:'Email address',exact:true}));
    await expect.poll(()=>values(region,'a')).toEqual({...expectedAddress,readOnly:'REFERENCE-42'});
    const requests=await output<{name:string;value:string}[]>(region,'Native autofill requests');
    for(const [name,value] of Object.entries(expectedAddress))expect(requests).toContainEqual({name,value});
  } finally {await attachFinalObservation(region);await session.send('Autofill.disable');await session.detach();}
});

for (const policy of ['uncontrolled', 'accepting', 'rejecting'] as const) {
  test(`native CDP contact autofill preserves ${policy} host and form ownership`, async ({page, context, browserName}) => {
    test.skip(browserName !== 'chromium', 'CDP Autofill is a Chromium-only protocol; no Firefox/WebKit autofill claim');
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(host + 'native-autofill&globals=a11y.manual:!true');
    const region = page.getByRole('region', {name: `${policy} native autofill`, exact: true});
    const other = page.getByRole('region', {name: `${policy === 'uncontrolled' ? 'accepting' : 'uncontrolled'} native autofill`, exact: true});
    const session = await context.newCDPSession(page);
    await test.info().attach('autofill-browser-provenance', {body: JSON.stringify({
      version: await session.send('Browser.getVersion'),
      channel: process.env.SGUI_AUTOFILL_CHANNEL ?? 'chromium',
      headed: process.env.SGUI_AUTOFILL_HEADED === '1',
      method: 'CDP native address autofill; no saved-profile UI or scripted-fill claim',
    }, null, 2), contentType: 'application/json'});
    // Missing Autofill on a browser build is an explicit capability failure.
    // The dedicated config launches installed full Chromium, not headless-shell.
    await session.send('Autofill.enable');
    await session.send('Autofill.setAddresses', {addresses: [address]});
    try {
      await nativeAutofill(session, region.getByRole('textbox', {name: 'Email address', exact: true}));
      const expected = {...Object.fromEntries(Object.keys(expectedAddress).map(key => [key, policy === 'rejecting' ? '' : expectedAddress[key as keyof typeof expectedAddress]])), readOnly: 'REFERENCE-42'};
      await expect.poll(() => values(region, 'a')).toEqual(expected);
      expect(await values(region, 'b')).toEqual({});
      expect(await output(other, 'Native autofill requests')).toEqual([]);
      const requests = await output<{name: string; value: string}[]>(region, 'Native autofill requests');
      for (const [name, value] of Object.entries(expectedAddress)) expect(requests).toContainEqual({name, value});
      const events = await output<{trusted: boolean; name: string}[]>(region, 'Native autofill events');
      expect(events.filter(event => event.trusted).length).toBeGreaterThan(0);
      expect(events.some(event => event.name === 'disabled' || event.name === 'readOnly')).toBe(false);
      await region.getByRole('button', {name: 'Submit native autofill a', exact: true}).click();
      await expect.poll(() => output(region, 'Native autofill submissions')).toEqual([{owner: 'a', values: expected}]);
      // External native input uses its associated form's default submit action.
      await region.getByRole('textbox', {name: 'Email address', exact: true}).press('Enter');
      await expect.poll(() => output(region, 'Native autofill submissions')).toEqual([{owner: 'a', values: expected}, {owner: 'a', values: expected}]);
      await region.getByText('Cancel native autofill reset', {exact: true}).click();
      const beforeResetRequests = await output(region, 'Native autofill requests');
      await region.getByRole('button', {name: 'Reset native autofill a', exact: true}).click();
      await expect.poll(() => values(region, 'a')).toEqual(expected);
      expect(await output(region, 'Native autofill requests')).toEqual(beforeResetRequests);
      await region.getByText('Cancel native autofill reset', {exact: true}).click();
      await region.getByRole('button', {name: 'Reset native autofill a', exact: true}).click();
      const resetExpected = policy === 'uncontrolled' ? {...Object.fromEntries(Object.keys(expectedAddress).map(key => [key, ''])), readOnly: 'REFERENCE-42'} : expected;
      await expect.poll(() => values(region, 'a')).toEqual(resetExpected);
      expect(await output(region, 'Native autofill requests')).toEqual(beforeResetRequests);
      await region.getByRole('button', {name: 'Move native autofill owner', exact: true}).click();
      expect(await values(region, 'a')).toEqual({});
      await expect.poll(() => values(region, 'b')).toEqual(resetExpected);
      await nativeAutofill(session, region.getByRole('textbox', {name: 'Email address', exact: true}));
      await expect.poll(() => values(region, 'b')).toEqual(expected);
      await region.getByRole('button', {name: 'Reset native autofill a', exact: true}).click();
      await expect.poll(() => values(region, 'b')).toEqual(expected);
      await region.getByRole('button', {name: 'Submit native autofill b', exact: true}).click();
      const submissions = await output<{owner: string; values: object}[]>(region, 'Native autofill submissions');
      expect(submissions.at(-1)).toEqual({owner: 'b', values: expected});
      expect(await output(other, 'Native autofill requests')).toEqual([]);
      expect(errors).toEqual([]);
    } finally {await attachFinalObservation(region); await session.send('Autofill.disable'); await session.detach();}
  });
}
async function assertReferences(region: Locator) {
  const failures = await region.evaluate(element => [...element.querySelectorAll('[aria-describedby], [aria-labelledby]')].flatMap(node =>
    ['aria-describedby', 'aria-labelledby'].flatMap(attribute => (node.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)
      .filter(id => !document.getElementById(id)).map(id => ({attribute, id})))));
  expect(failures).toEqual([]);
}
test('independent fieldset names, help/errors and external multiline reset retain unique associations', async ({page}) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(host + 'grouped-isolation&globals=a11y.manual:!true');
  const first = page.getByRole('region', {name: 'First grouped instance', exact: true});
  const second = page.getByRole('region', {name: 'Second grouped instance', exact: true});
  const siblingBefore = await second.innerHTML();
  for (const [region, name] of [[first, 'First'], [second, 'Second']] as const) {
    const group = region.getByRole('group', {name: `${name} contact details`, exact: true});
    await expect(group).toHaveAccessibleDescription(`${name} contact fields are required.`);
    for (const label of ['Given name', 'Family name']) await expect(region.getByRole('textbox', {name: label, exact: true})).toHaveAccessibleDescription(`${name} contact fields are required.`);
    await assertReferences(region);
  }
  const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  const summary = first.getByRole('textbox', {name: 'External summary', exact: true});
  for (const label of ['Given name', 'Family name', 'External summary']) await first.getByRole('textbox', {name: label, exact: true}).fill('');
  await first.getByRole('button', {name: 'Validate grouped fields', exact: true}).click();
  for (const [label, error] of [['Given name', 'Enter given name.'], ['Family name', 'Enter family name.'], ['External summary', 'Enter summary.']]) {
    const field = first.getByRole('textbox', {name: label, exact: true});
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription(new RegExp(error.replace('.', '\\.')));
  }
  await assertReferences(first);
  await first.getByRole('button', {name: 'Replace grouped default', exact: true}).click();
  const requests = await output(first, 'Grouped field requests');
  await first.getByRole('button', {name: 'Reset grouped fields', exact: true}).click();
  await expect(summary).toHaveValue(''); await expect(summary).toHaveAttribute('aria-invalid', 'true');
  expect(await output(first, 'Grouped field requests')).toEqual(requests);
  await first.getByText('Prevent grouped reset', {exact: true}).click();
  await first.getByRole('button', {name: 'Reset grouped fields', exact: true}).click();
  await expect(summary).toHaveValue('Revised summary');
  await expect(summary).not.toHaveAttribute('aria-invalid', 'true');
  await assertReferences(first);
  expect(await output(first, 'Grouped field requests')).toEqual(requests);
  expect(await second.innerHTML()).toBe(siblingBefore);
  expect(errors).toEqual([]);
});
