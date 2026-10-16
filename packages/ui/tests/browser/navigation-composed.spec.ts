import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const browserErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
});
test.afterEach(async ({ page }, info) => {
  const errors = browserErrors.get(page) ?? [];
  await info.attach('browser-errors', { body: JSON.stringify(errors), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

for (const mode of ['Fallback', 'Custom']) {
  test(`${mode} composed routes have one host owner for pointer and Enter`, async ({ page }, info) => {
    await page.goto('/fixtures/?id=host-adapters-acceptance--routing&globals=a11y.manual:!true');
    const host = page.getByRole('region', { name: `${mode} composed routing`, exact: true });
    const events = host.getByLabel('Composed routing events');
    const pathname = host.getByLabel('Composed pathname');
    const initialURL = page.url();
    const snapshots: unknown[] = [];
    for (const activation of ['pointer', 'Enter']) {
      for (const [name, href, notification] of [
        ['Lesson course', '/composed/lesson', 'select:lesson'],
        ['Course library', '/composed/library', undefined],
        ['Replace menu course', '/composed/menu', 'action:menu'],
      ] as const) {
        await host.getByRole('button', { name: 'Clear composed events' }).click();
        let destination;
        if (name === 'Replace menu course') {
          await host.getByRole('button', { name: 'Route actions', exact: true }).click();
          const menu = page.getByRole('menu', { name: `${mode} route menu`, exact: true });
          await expect(menu.getByRole('menuitem', { name: 'Unavailable course' })).toHaveAttribute('aria-disabled', 'true');
          destination = menu.getByRole('menuitem', { name, exact: true });
        } else destination = host.getByRole('link', { name, exact: true });
        if (activation === 'pointer') await destination.click();
        else { await destination.focus(); await page.keyboard.press('Enter'); }
        await expect(pathname).toHaveText(href);
        const route = `${name === 'Replace menu course' ? 'replace' : 'push'}:${href}`;
        await expect.poll(async () => (await events.innerText()).split('\n').filter(Boolean).sort())
          .toEqual([route, ...(notification ? [notification] : [])].sort());
        if (name === 'Lesson course') await expect(destination).toHaveAttribute('aria-current', 'page');
        await expect(page).toHaveURL(initialURL);
        snapshots.push({ activation, name, pathname: await pathname.innerText(), events: await events.innerText() });
      }
    }
    // Host pathname replacement updates selection without requesting a route or remounting the anchor.
    const direct = host.getByRole('link', { name: 'Direct composed course', exact: true });
    await direct.evaluate(node => node.setAttribute('data-retained-anchor', 'true'));
    await host.getByRole('button', { name: 'Clear composed events' }).click();
    await host.getByRole('button', { name: 'Host replaces pathname' }).click();
    await expect(host.getByRole('link', { name: 'Lesson course', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(events).toBeEmpty();
    await expect(direct).toHaveAttribute('data-retained-anchor', 'true');
    await host.getByRole('button', { name: 'Focus composed link' }).click();
    await expect(direct).toBeFocused();
    await info.attach('composed-route-outcomes', { body: JSON.stringify(snapshots, null, 2), contentType: 'application/json' });
  });

  test(`${mode} consumer cancellation and callback order survive custom delegation`, async ({ page }, info) => {
    await page.goto('/fixtures/?id=host-adapters-acceptance--routing&globals=a11y.manual:!true');
    const host = page.getByRole('region', { name: `${mode} composed routing`, exact: true });
    const events = host.getByLabel('Composed routing events');
    const direct = host.getByRole('link', { name: 'Direct composed course', exact: true });
    const snapshots: string[] = [];
    for (const activation of ['pointer', 'Enter']) {
      await host.getByRole('button', { name: 'Clear composed events' }).click();
      if (activation === 'pointer') await direct.click();
      else { await direct.focus(); await page.keyboard.press('Enter'); }
      await expect(events).toHaveText('consumer:false\nreplace:/composed/direct\nbubble:true');
      snapshots.push(await events.innerText());
      await host.getByRole('button', { name: 'Clear composed events' }).click();
      const cancel = host.getByRole('link', { name: 'Cancel composed course', exact: true });
      if (activation === 'pointer') await cancel.click();
      else { await cancel.focus(); await page.keyboard.press('Enter'); }
      await expect(events).toHaveText('consumer:false\nbubble:true');
      await expect(host.getByLabel('Composed pathname')).toHaveText('/composed/direct');
      snapshots.push(await events.innerText());
    }
    await info.attach('callback-order-outcomes', { body: JSON.stringify(snapshots), contentType: 'application/json' });
  });

  test(`${mode} modifier target download and external activation bypass host routing`, async ({ page, context }, info) => {
    await page.goto('/fixtures/?id=host-adapters-acceptance--routing&globals=a11y.manual:!true');
    const host = page.getByRole('region', { name: `${mode} composed routing`, exact: true });
    const events = host.getByLabel('Composed routing events');
    const popupURLs: string[] = [];
    for (const [label, hash, modifiers] of [
      ['Modified composed course', '#composed-modifier', ['ControlOrMeta']],
      ['Target composed course', '#composed-popup', []],
    ] as const) {
      const pending = context.waitForEvent('page');
      await host.getByRole('link', { name: label, exact: true }).click({ modifiers: [...modifiers] });
      const popup = await pending;
      await popup.waitForLoadState();
      expect(new URL(popup.url()).hash).toBe(hash);
      popupURLs.push(popup.url());
      await popup.close();
      await expect(events).toBeEmpty();
    }
    // Same-origin relative download reaches the custom Link, so its bypass contract is exercised.
    const pendingDownload = page.waitForEvent('download');
    await host.getByRole('link', { name: 'Download composed course', exact: true }).click();
    const download = await pendingDownload;
    const destination = info.outputPath('composed.txt');
    await download.saveAs(destination);
    expect(await readFile(destination, 'utf8')).toBe('SGUI composed host');
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).toBe('composed.txt');
    await expect(events).toBeEmpty();
    await host.getByRole('link', { name: 'False download composed course', exact: true }).click();
    await expect(events).toHaveText('push:#composed-false');
    await host.getByRole('button', { name: 'Clear composed events' }).click();
    await host.getByRole('link', { name: 'External composed course', exact: true }).click();
    await expect(page).toHaveURL(/#composed-external$/);
    await expect(events).toBeEmpty();
    await expect(host.getByLabel('Composed pathname')).toHaveText('#composed-false');
    await info.attach('native-bypass-outcomes', { body: JSON.stringify({ popupURLs, filename: download.suggestedFilename(), bytes: await readFile(destination, 'utf8'), failure: await download.failure() }), contentType: 'application/json' });
  });
}
