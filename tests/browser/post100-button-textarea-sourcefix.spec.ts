import { expect, test, type Page } from '@playwright/test';

// The coordinator executes exactly these two cases in Chromium at composed source bytes.
// Retain browser errors as failures, without requiring a broader acceptance matrix here.
const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), 'browser runtime errors').toEqual([]);
});

// Reset restoration is deferred until delegated host prevention has finished.
// Cross two native task turns before asserting the absence of a late reset/change.
async function settleReset(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 0));
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  });
}

test('ordinary Button calls the owned callback once with zero arguments for click, Enter and Space', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-button--owned-press-arguments&viewMode=story&globals=a11y.manual:!true');
  const button = page.getByRole('button', { name: 'Record owned press', exact: true });
  const calls = page.getByLabel('Press argument counts');
  await expect(calls).toHaveText('[]');
  await button.click();
  await expect(calls).toHaveText('[0]');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(calls).toHaveText('[0,0]');
  await page.keyboard.press('Space');
  await expect(calls).toHaveText('[0,0,0]');
  await settleReset(page);
  await expect(calls).toHaveText('[0,0,0]');
});

test('TextArea reassociation isolates old resets and honors latest defaults, cancellation and controlled host state', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-textarea--form-reassociation&viewMode=story&globals=a11y.manual:!true');
  const draft = page.getByRole('textbox', { name: 'Reassociated draft', exact: true });
  const controlled = page.getByRole('textbox', { name: 'Reassociated controlled summary', exact: true });
  const requests = page.getByLabel('Reassociation change requests');
  await expect(draft).toHaveValue('Original\nsummary');
  await draft.fill('Edited\ndraft');
  await expect(requests).toHaveText('["draft:Edited\\ndraft"]');
  await page.getByRole('button', { name: 'Move fields to current form', exact: true }).click();
  await expect(draft).toHaveAttribute('form', 'textarea-current-owner');
  await expect(controlled).toHaveAttribute('form', 'textarea-current-owner');
  await page.getByRole('button', { name: 'Replace reassociated default', exact: true }).click();
  await expect(draft).toHaveValue('Edited\ndraft');

  const editRequests = await requests.textContent();
  await page.getByRole('button', { name: 'Reset original form', exact: true }).click();
  await settleReset(page);
  await expect(draft).toHaveValue('Edited\ndraft');
  await expect(controlled).toHaveValue('Host-owned summary');
  await expect(requests).toHaveText(editRequests!);

  await page.getByRole('button', { name: 'Reset current form', exact: true }).click();
  await settleReset(page);
  await expect(draft).toHaveValue('Latest\nsummary');
  await expect(controlled).toHaveValue('Host-owned summary');
  await expect(requests).toHaveText(editRequests!);

  await draft.fill('Keep\ncancelled draft');
  await page.getByRole('checkbox', { name: 'Cancel current form reset', exact: true }).check();
  const cancelledRequests = await requests.textContent();
  await page.getByRole('button', { name: 'Reset current form', exact: true }).click();
  await settleReset(page);
  await expect(draft).toHaveValue('Keep\ncancelled draft');
  await expect(requests).toHaveText(cancelledRequests!);

  await controlled.fill('Rejected host draft');
  await expect(controlled).toHaveValue('Host-owned summary');
  await expect(requests).toContainText('controlled:Rejected host draft');
  await page.getByRole('button', { name: 'Replace controlled summary', exact: true }).click();
  await expect(controlled).toHaveValue('Updated host summary');
  await page.getByRole('checkbox', { name: 'Cancel current form reset', exact: true }).uncheck();
  const controlledRequests = await requests.textContent();
  await page.getByRole('button', { name: 'Reset current form', exact: true }).click();
  await settleReset(page);
  await expect(draft).toHaveValue('Latest\nsummary');
  await expect(controlled).toHaveValue('Updated host summary');
  await expect(requests).toHaveText(controlledRequests!);
});
