import { test, expect } from '@playwright/test';

for (const side of ['start', 'end']) {
  test(`motion cancellation preserves rail drafts and focus (${side})`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/fixtures/?id=foundations-foundation-catalogue--motion-cancellation-${side}`);
    const nav = page.getByRole('navigation', { name: 'Motion tools' });
    const notes = nav.getByRole('button', { name: 'Notes', exact: true });
    const tasks = nav.getByRole('button', { name: 'Tasks', exact: true });
    await notes.focus();
    await page.keyboard.press('Enter');
    const draft = page.getByRole('textbox', { name: 'Notes draft' });
    await draft.fill('Retained notes');
    // Host-controlled replacement while focus is inside the departing panel.
    await page.getByRole('button', { name: 'Switch to tasks' }).click();
    await expect(tasks).toBeFocused();
    await expect(draft).toBeHidden();
    const taskDraft = page.getByRole('textbox', { name: 'Tasks draft' });
    await taskDraft.focus();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(taskDraft).toBeFocused();
    const panel = page.getByRole('region', { name: 'Tasks', exact: true });
    expect(await panel.evaluate(el => el.getAnimations().length)).toBe(0);
    expect(await panel.evaluate(el => getComputedStyle(el).animationDuration)).toBe('0s');
    // The end-side selector may retain an animation-name with zero duration;
    // getAnimations and duration prove no running animation in either direction.
    await page.keyboard.press('Escape');
    await expect(tasks).toBeFocused();
    await expect(panel).toBeHidden();
    await notes.click();
    await expect(draft).toHaveValue('Retained notes');
    const host = page.getByRole('button', { name: 'Close from host' });
    await host.click();
    await expect(host).toBeFocused();
    await expect(draft).toBeHidden();
    // Three host requests on successive rendering frames characterize rapid
    // interruption, not native pointer or human device input.
    const observations = await nav.evaluate(async element => {
      const buttons = Array.from(element.querySelectorAll('button'));
      const samples = [];
      for (const name of ['Notes', 'Tasks', 'Tasks']) {
        (buttons.find(button => button.getAttribute('aria-label') === name)!).click();
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        samples.push({ time: performance.now(), expanded: buttons.map(button => [button.getAttribute('aria-label'), button.getAttribute('aria-expanded')]) });
      }
      return samples;
    });
    await expect(page.getByRole('region')).toHaveCount(0);
    const focusedAfterRequests = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    // Observe settlement beyond the owned 120ms motion duration, without a new
    // animation-end callback or arbitrary fixed sleep as a state assertion.
    await page.evaluate(() => new Promise<void>(resolve => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve())), 160)));
    await expect(page.getByRole('region')).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toBe(focusedAfterRequests);
    await notes.click();
    await expect(draft).toHaveValue('Retained notes');
    await draft.focus();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.keyboard.press('Escape');
    await expect(notes).toBeFocused();
    await notes.press('Enter');
    expect(await page.getByRole('region', { name: 'Notes', exact: true }).evaluate(el => getComputedStyle(el).animationDuration)).not.toBe('0s');
    await info.attach('motion-interruption', { body: JSON.stringify({ side, engine: info.project.name, observations, input: 'host DOM click per animation frame' }), contentType: 'application/json' });
  });
}

test('color-data exception preserves system selection and keyboard focus', async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/fixtures/?id=editors-textcolorpickercontrol--default');
  const supported = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
  await info.attach('forced-colors-capability', { body: JSON.stringify({ engine: info.project.name, supported }), contentType: 'application/json' });
  test.skip(!supported, 'Engine did not apply forced-colors emulation; no preference acceptance claimed.');
  await page.getByRole('button', { name: 'Text color', exact: true }).click();
  const primary = page.getByRole('button', { name: 'Primary', exact: true });
  await primary.click();
  await expect(primary).toHaveAttribute('aria-pressed', 'true');
  const muted = page.getByRole('button', { name: 'Muted text', exact: true });
  await muted.focus();
  await page.keyboard.press('Tab');
  await expect(primary).toBeFocused();
  const observation = await primary.evaluate(button => {
    const chip = button.querySelector('[aria-hidden="true"]')!;
    const css = getComputedStyle(button), chipCSS = getComputedStyle(chip);
    const probe = document.createElement('span');
    document.body.append(probe);
    const colors: Record<string, string> = {};
    for (const name of ['Highlight', 'ButtonText']) { probe.style.color = name; colors[name] = getComputedStyle(probe).color; }
    probe.remove();
    return { colors, controlAdjustment: css.forcedColorAdjust, chipAdjustment: chipCSS.forcedColorAdjust,
      outlineColor: css.outlineColor, outlineWidth: parseFloat(css.outlineWidth), outlineOffset: parseFloat(css.outlineOffset),
      borderColor: css.borderColor, borderStyle: css.borderStyle, borderWidth: parseFloat(css.borderWidth), chipBackground: chipCSS.backgroundColor };
  });
  expect(observation.controlAdjustment).toBe('auto');
  expect(observation.chipAdjustment).toBe('none');
  expect(observation.outlineColor).toBe(observation.colors.Highlight);
  expect(observation.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(observation.outlineOffset).toBeGreaterThanOrEqual(0);
  expect(observation.borderStyle).toBe('double');
  expect(observation.borderWidth).toBe(3);
  expect(observation.borderColor).toBe(observation.colors.Highlight);
  // A non-color geometry cue distinguishes selection from keyboard focus.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Primary emphasis', exact: true })).toBeFocused();
  await expect(primary).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Text color', exact: true })).toBeFocused();
  await info.attach('system-swatch-indications', { body: JSON.stringify(observation), contentType: 'application/json' });
});
