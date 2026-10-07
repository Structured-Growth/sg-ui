import { expect, test, type Page } from '@playwright/test';

const story = '/iframe.html?id=data-display-appdatagridshell-server-response-races--deferred-responses&viewMode=story&globals=a11y.manual:!true';
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (message.type() === 'error') messages.push(message.text()); });
  await page.goto(story);
  await expect(page.getByRole('grid', { name: 'First courses', exact: true })).toBeVisible();
});
test.afterEach(async ({ page }) => { expect(errors.get(page), 'browser runtime errors').toEqual([]); });
const view = (page: Page, name: string) => page.getByRole('region', { name: `${name} view`, exact: true });

for (const outcome of ['success', 'error']) {
  test(`native page/search requests discard obsolete ${outcome} and preserve independent pending state and focus`, async ({ page }) => {
    const first = view(page, 'First'), second = view(page, 'Second');
    const trace = page.getByRole('status', { name: 'Request lifecycle' });
    await first.getByRole('button', { name: 'Next page', exact: true }).focus();
    await page.keyboard.press('Enter');
    await first.getByRole('button', { name: 'Search', exact: true }).focus();
    await page.keyboard.press('Enter');
    const search = first.getByRole('searchbox', { name: 'Search', exact: true });
    await expect(search).toBeFocused();
    await page.keyboard.type('x');
    await expect(trace).toHaveText('First:1:callback:page\nFirst:1:callback:state\nFirst:1:dispatch:1:page=1:search=\nFirst:1:callback:page\nFirst:1:callback:search\nFirst:1:callback:state\nFirst:1:dispatch:2:page=0:search=x');
    await expect(page.getByRole('button', { name: 'Resolve 1', exact: true })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Resolve 2', exact: true })).toBeEnabled();
    await second.getByRole('button', { name: 'Next page', exact: true }).focus();
    await page.keyboard.press('Enter');
    await second.getByRole('button', { name: 'Search', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(second.getByRole('searchbox', { name: 'Search', exact: true })).toBeFocused();
    await page.keyboard.type('y');
    await expect(page.getByRole('button', { name: /^Resolve / })).toHaveCount(4);
    const secondState = second.getByRole('status', { name: 'Second host state' });
    const other = await secondState.textContent();
    await search.focus();
    await page.keyboard.press('Alt+2');
    const firstState = first.getByRole('status', { name: 'First host state' });
    const accepted = '{"epoch":1,"page":0,"search":"x","status":"ready","error":null,"rows":["First response 2"]}';
    await expect(firstState).toHaveText(accepted);
    await expect(first.getByRole('checkbox', { name: 'Select First response 2', exact: true })).toBeVisible();
    await expect(search).toBeFocused();
    await page.keyboard.press(outcome === 'success' ? 'Alt+1' : 'Alt+e');
    await expect(trace).toContainText(`First:1:settle:1:${outcome}\nFirst:1:discard:1:${outcome}`);
    await expect(firstState).toHaveText(accepted);
    await expect(first.getByRole('grid', { name: 'First courses', exact: true })).not.toHaveAttribute('aria-busy', 'true');
    await expect(first.getByRole('alert')).toHaveCount(0);
    await expect(search).toHaveValue('x');
    await expect(search).toBeFocused();
    await expect(secondState).toHaveText(other!);
    await expect(second.getByRole('grid', { name: 'Second courses', exact: true })).toHaveAttribute('aria-busy', 'true');
    await second.getByRole('button', { name: 'Replace Second host' }).focus();
    await page.keyboard.press('Alt+2');
    await expect(second.getByRole('checkbox', { name: 'Select Second response 4', exact: true })).toBeVisible();
    const secondAccepted = await secondState.textContent();
    await page.keyboard.press('Alt+e');
    await expect(trace).toContainText('Second:1:settle:3:error\nSecond:1:discard:3:error');
    await expect(secondState).toHaveText(secondAccepted!);
    await expect(second.getByRole('button', { name: 'Replace Second host' })).toBeFocused();
    await expect(firstState).toHaveText(accepted);
  });
}
for (const action of ['Replace', 'Unmount']) {
  for (const outcome of ['success', 'error']) {
    test(`obsolete ${outcome} after host ${action.toLowerCase()} causes only settlement/discard`, async ({ page }) => {
      const first = view(page, 'First'), second = view(page, 'Second');
      const trace = page.getByRole('status', { name: 'Request lifecycle' });
      await first.getByRole('button', { name: 'Next page', exact: true }).focus();
      await page.keyboard.press('Enter');
      const actionButton = first.getByRole('button', { name: `${action} First host` });
      await actionButton.focus();
      await page.keyboard.press('Enter');
      await expect(trace).toContainText('First:1:disposed');
      const disposed = await trace.textContent();
      await page.keyboard.press(outcome === 'success' ? 'Alt+1' : 'Alt+e');
      await expect(trace).toHaveText(`${disposed}\nFirst:1:settle:1:${outcome}\nFirst:1:discard:1:${outcome}`);
      await expect(actionButton).toBeFocused();
      if (action === 'Replace') {
        await expect(first.getByRole('status', { name: 'First host state' })).toHaveText('{"epoch":2,"page":0,"search":"","status":"ready","error":null,"rows":["First initial course"]}');
        await expect(first.getByRole('checkbox', { name: 'Select First initial course', exact: true })).toBeVisible();
      } else await expect(first.getByRole('grid')).toHaveCount(0);
      await expect(second.getByRole('status', { name: 'Second host state' })).toHaveText('{"epoch":1,"page":0,"search":"","status":"ready","error":null,"rows":["Second initial course"]}');
      await expect(page.getByRole('button', { name: /^Resolve / })).toHaveCount(1);
    });
  }
}

test('obsolete completions preserve newer pending and current error with native search focus', async ({ page }) => {
  const first = view(page, 'First');
  const trace = page.getByRole('status', { name: 'Request lifecycle' });
  const state = first.getByRole('status', { name: 'First host state' });
  await first.getByRole('button', { name: 'Next page', exact: true }).focus();
  await page.keyboard.press('Enter');
  await first.getByRole('button', { name: 'Search', exact: true }).focus();
  await page.keyboard.press('Enter');
  const search = first.getByRole('searchbox', { name: 'Search', exact: true });
  await expect(search).toBeFocused();
  await page.keyboard.type('x');
  const pending = await state.textContent();
  await page.keyboard.press('Alt+e');
  await expect(trace).toContainText('First:1:settle:1:error\nFirst:1:discard:1:error');
  await expect(state).toHaveText(pending!);
  await expect(first.getByRole('grid', { name: 'First courses', exact: true })).toHaveAttribute('aria-busy', 'true');
  await expect(search).toBeFocused();
  await page.keyboard.type('y');
  // Reject the current request via its visible transport control. Return to
  // native search focus before settling the older response with the host key.
  await page.getByRole('button', { name: 'Reject 3', exact: true }).click();
  await expect(first.getByRole('alert')).toContainText('Request 3 failed');
  const failed = await state.textContent();
  await search.focus();
  await page.keyboard.press('Alt+1');
  await expect(trace).toContainText('First:1:settle:2:success\nFirst:1:discard:2:success');
  await expect(state).toHaveText(failed!);
  await expect(first.getByRole('alert')).toContainText('Request 3 failed');
  await expect(first.getByRole('checkbox', { name: 'Select First initial course', exact: true })).toBeVisible();
  await expect(search).toHaveValue('xy');
  await expect(search).toBeFocused();
});
