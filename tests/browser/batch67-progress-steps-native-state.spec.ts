import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

async function fits(host: Locator) {
  expect(await host.evaluate(element => {
    const root = element.getBoundingClientRect();
    const visible = element.querySelectorAll('[data-sgui-part="operation-steps"], [data-sgui-part="inline-progress"], button, [data-sgui-part="status"]');
    return element.scrollWidth <= element.clientWidth + 1 && Array.from(visible).every(child => {
      const box = child.getBoundingClientRect();
      return box.left >= root.left - 1 && box.right <= root.right + 1 && child.scrollWidth <= child.clientWidth + 1;
    });
  })).toBe(true);
}

for (const theme of ['light', 'dark'] as const) {
  for (const density of ['compact', 'comfortable'] as const) {
    test(`mutable progress/ordered steps survive native reflow: ${theme}/${density}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 740 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/iframe.html?id=components-appoperationsteps--native-state-transitions&viewMode=story&globals=a11y.manual:!true');
      const host = page.getByTestId('native-state-host');
      await expect(host).toBeVisible();
      await page.locator('#storybook-root [data-sgui-scope]').evaluateAll((scopes, settings) => {
        scopes.forEach(scope => { scope.setAttribute('data-sgui-theme', settings.theme); scope.setAttribute('data-sgui-density', settings.density); });
      }, { theme, density });
      await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      const list = host.getByRole('list');
      const items = list.getByRole('listitem');
      const region = host.getByRole('status');
      const bar = host.getByRole('progressbar', { name: 'Progress', exact: true });
      await region.evaluate(element => element.setAttribute('data-original-region', 'true'));
      await items.first().evaluate(element => element.setAttribute('data-original-step', 'true'));
      expect(await list.evaluate(element => element.tagName)).toBe('OL');
      await expect(list.locator('button, a, [tabindex], [role="tab"], [aria-live]')).toHaveCount(0);
      await expect(items).toHaveCount(3);
      await expect(list).toHaveCSS('list-style-type', 'none');
      await expect(items.first().locator('[data-variant="body2"]')).toHaveCSS('font-size', '28px');
      await expect(host.getByRole('button', { name: 'Start operation' })).toHaveCSS('min-height', density === 'compact' ? '64px' : '88px');
      expect(await host.locator('[data-sgui-part="operation-steps"]').evaluate(element => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = 'var(--sgui-surface)';
        element.append(probe);
        const matches = getComputedStyle(element).backgroundColor === getComputedStyle(probe).backgroundColor;
        probe.remove();
        return matches;
      })).toBe(true);
      await fits(host);
      let requests = 0;
      const activate = async (name: string, key = 'Enter') => {
        const action = host.getByRole('button', { name, exact: true });
        await action.focus();
        await page.keyboard.press(key);
        requests++;
        await expect(action).toBeFocused();
        expect(await action.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return rect.top >= -1 && rect.bottom <= innerHeight + 1 && Boolean(hit && element.contains(hit));
        }), 'focused host action remains visible after reflow').toBe(true);
        await expect(host.getByTestId('host-callbacks')).toHaveText(`Host requests: ${requests}`);
        await fits(host);
      };
      await activate('Start operation');
      const spinner = list.getByRole('progressbar', { name: 'Prepare the course materials for the learner review session' });
      await expect(spinner).not.toHaveAttribute('aria-valuenow');
      await expect(spinner.locator('svg')).toHaveCSS('animation-name', 'none');
      await expect(items).toHaveText([
        'Prepare the course materials for the learner review session: In progress',
        'Save the reviewed course content and supporting documents: Pending',
        'Publish the course for the next learner cohort: Pending',
      ]);
      await activate('Advance progress', 'Space');
      await expect(bar).toHaveAttribute('aria-valuenow', '25');
      await activate('Advance progress');
      await expect(bar).toHaveAttribute('aria-valuenow', '50');
      await expect(region).toBeEmpty();
      await activate('Show single');
      await expect(items).toHaveCount(1);
      await expect(items.first()).toHaveAttribute('data-original-step', 'true');
      await expect(host.getByText('Step 1 of 1')).toHaveCount(0);
      await activate('Show empty');
      await expect(items).toHaveCount(0);
      await expect(list.getByRole('progressbar')).toHaveCount(0);
      await expect(bar).toHaveAttribute('aria-valuenow', '50');
      await expect(region).toBeEmpty();
      await activate('Show multiple');
      await expect(items).toHaveCount(3);
      await expect(spinner).toBeVisible();
      await activate('Complete operation');
      await expect(region).toHaveText('Course operation completed');
      await expect(bar).toHaveAttribute('aria-valuenow', '100');
      await expect(list.getByRole('progressbar')).toHaveCount(0);
      await expect(items.locator('svg.lucide-check')).toHaveCount(3);
      await activate('Fail operation');
      await expect(region).toHaveText('Course operation failed; review the materials and retry');
      await expect(items.locator('svg.lucide-x')).toHaveCount(3);
      // Compare real computed colors with the current scope's production danger token.
      expect(await items.first().locator('[data-tone="danger"]').evaluate(element => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--sgui-danger)';
        element.append(probe);
        const matches = getComputedStyle(element).color === getComputedStyle(probe).color;
        probe.remove();
        return matches;
      })).toBe(true);
      await expect(region).toHaveAttribute('data-original-region', 'true');
      await expect(region).toHaveAttribute('aria-live', 'polite');
      await expect(region).toHaveAttribute('aria-atomic', 'true');
      expect((await new AxeBuilder({ page }).include('[data-testid="native-state-host"]').analyze()).violations).toEqual([]);
      await activate('Reset operation');
      await expect(region).toBeEmpty();
      await expect(bar).toHaveAttribute('aria-valuenow', '0');
      await expect(items.locator('svg.lucide-circle')).toHaveCount(3);
    });
  }
}
