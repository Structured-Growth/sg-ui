import { expect, test, type Locator } from '@playwright/test';

async function expectUsableFocusedAction(action: Locator) {
  await expect(action).toBeFocused();
  // Only observe native keyboard scrolling; never reveal the control synthetically.
  await expect.poll(() => action.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const card = element.closest('[data-sgui-part="class-card-frame"]')!.getBoundingClientRect();
    const css = getComputedStyle(element);
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    return {
      nonempty: bounds.width > 0 && bounds.height > 0,
      wholeViewport: bounds.left >= 0 && bounds.top >= 0 && bounds.right <= window.innerWidth && bounds.bottom <= window.innerHeight,
      wholeCard: bounds.left >= card.left && bounds.top >= card.top && bounds.right <= card.right && bounds.bottom <= card.bottom,
      centerHit: hit !== null && (hit === element || element.contains(hit)),
      focusVisible: element.matches(':focus-visible'),
      outline: css.outlineStyle === 'solid' && parseFloat(css.outlineWidth) > 0,
    };
  })).toEqual({ nonempty: true, wholeViewport: true, wholeCard: true, centerHit: true, focusVisible: true, outline: true });
}

test.use({ timezoneId: 'America/Chicago', locale: 'de-DE', viewport: { width: 390, height: 1200 } });
for (const [theme, density, textSize] of [['light', 'comfortable', 16], ['dark', 'compact', 32]] as const) {
  test(`${theme}/${density}/${textSize}px instructor host model retains native focus and one route request`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(new Date('2026-01-02T18:00:00Z'));
    await page.goto(`/iframe.html?id=components-instructorclasscard--native-presentation&viewMode=story&globals=theme:${theme};density:${density};a11y.manual:!true`);
    const heading = page.getByRole('heading', { name: 'Advanced Defense and Practical Collaboration Across Multiple Learning Environments' });
    await expect(heading).toBeVisible();
    await page.evaluate(size => { document.documentElement.style.fontSize = `${size}px`; }, textSize);
    const card = page.locator('[data-sgui-part="class-card-frame"]');
    const action = card.getByRole('link');
    const identity = await action.elementHandle();
    // Predecessor focus is setup; the following real Tab is card keyboard entry.
    await page.getByRole('button', { name: 'Next host activity' }).focus();
    const tabKey = process.platform === 'darwin' && test.info().project.name === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.keyboard.press(tabKey);
    await expectUsableFocusedAction(action);
    await expect(card.getByRole('img')).toHaveCount(0);
    await expect(card.locator('[data-sgui-part="avatar"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(card.getByText('HE', { exact: true })).toBeVisible();
    await expect(card.locator('img')).toHaveCount(0);
    // Instructor text, rather than duplicating the separately owned frame width matrix.
    const textReflow = await card.locator('h3, p').evaluateAll(elements => elements.map(element => {
      const css = getComputedStyle(element);
      return { fits: element.scrollWidth <= element.clientWidth + 1, clipped: css.textOverflow === 'ellipsis' };
    }));
    expect(textReflow.length).toBeGreaterThan(2);
    expect(textReflow.every(text => text.fits && !text.clipped)).toBe(true);
    expect(await heading.evaluate(element => element.getBoundingClientRect().height > parseFloat(getComputedStyle(element).lineHeight))).toBe(true);
    const requests: string[] = [];
    for (const [status, label] of [['active', 'Open Section'], ['draft', 'Set Up Section'], ['closed', 'Host custom action'], ['archived', 'View Section']]) {
      await expect(card.getByText(status[0].toUpperCase() + status.slice(1), { exact: true })).toBeVisible();
      await expect(action).toHaveAccessibleName(label);
      await expect(action).toHaveAttribute('href', `/host/course/${status}`);
      await expectUsableFocusedAction(action);
      expect(await action.evaluate((node, previous) => node === previous, identity)).toBe(true);
      await expect(card.locator('svg[aria-hidden="true"]')).toHaveCount(status === 'archived' ? 0 : 2);
      await expect(card.getByText('0 Learners', { exact: true })).toHaveCount(status === 'archived' ? 0 : 1);
      await page.keyboard.press('Enter');
      requests.push(`/host/course/${status}`);
      await expect(page.getByLabel('Host navigation requests')).toHaveText(requests.join(', '));
      await expectUsableFocusedAction(action);
      if (status !== 'archived') {
        // Update host props without moving focus into the fixture control.
        await page.getByRole('button', { name: 'Next host status' }).evaluate((button: HTMLButtonElement) => button.click());
      }
    }
    expect(errors).toEqual([]);
  });
}

test('native Intl host date and host missing/invalid fallbacks remain complete text', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-01-02T18:00:00Z'));
  await page.goto('/iframe.html?id=components-instructorclasscard--native-presentation&viewMode=story&globals=a11y.manual:!true');
  const card = page.locator('[data-sgui-part="class-card-frame"]');
  const date = await page.evaluate(() => new Intl.DateTimeFormat('de-DE', {
    timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date('2026-01-01T15:05:00Z')));
  expect(date).toMatch(/^01\.01\.2026, 0?9:05$/);
  await expect(card.getByText(`Last Learner Activity: ${date}`, { exact: true })).toBeVisible();
  const action = card.getByRole('link');
  // This case proves retention after host activity updates, not keyboard entry.
  await action.focus();
  for (const label of ['No recent activity', 'Date unavailable', date]) {
    await page.getByRole('button', { name: 'Next host activity' }).evaluate((button: HTMLButtonElement) => button.click());
    await expect(card.getByText(`Last Learner Activity: ${label}`, { exact: true })).toBeVisible();
    await expect(action).toBeFocused();
  }
});
