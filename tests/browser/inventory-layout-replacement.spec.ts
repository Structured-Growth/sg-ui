import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`M-21 same host survives chrome replacement: ${theme}, ${enlarged ? '200% text' : 'narrow'}`, async ({ page }, info) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      await page.setViewportSize({ width: enlarged ? 640 : 320, height: 1200 });
      await page.goto(`/iframe.html?id=layout-documenteditorlayout--slot-replacement&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      const fixture = page.getByTestId('replacement-fixture');
      const root = page.locator('[data-sgui-part="document-editor-layout"]');
      const wrapper = page.locator('[data-sgui-part="document-editor-content"]');
      const host = page.getByRole('region', { name: 'Host document scroll' });
      const action = page.getByRole('button', { name: 'Document action 12', exact: true });
      await expect(host).toBeVisible();
      await action.focus();
      await expect(action).toBeFocused();
      // Use a trusted wheel to place focused content near the top of its host viewport.
      // This avoids a fixture scroll mutation or refocusing after each replacement.
      const delta = await action.evaluate(node => {
        const host = node.closest('[role="region"]')!;
        return node.getBoundingClientRect().top - host.getBoundingClientRect().top - 40;
      });
      const initialScroll = await host.evaluate(node => node.scrollTop);
      await host.hover();
      await page.mouse.wheel(0, delta);
      await expect.poll(() => host.evaluate(node => node.scrollTop)).toBeCloseTo(initialScroll + delta, 0);
      const originalRoot = await root.elementHandle();
      const originalHost = await host.elementHandle();
      const originalWrapper = await wrapper.elementHandle();
      const originalAction = await action.elementHandle();
      const scrollTop = await host.evaluate(node => node.scrollTop);
      const rootAttachments = await root.getAttribute('data-ref-attachments');
      const hostAttachments = await host.getAttribute('data-ref-attachments');
      expect(scrollTop).toBeGreaterThan(0);
      const measurements: unknown[] = [];
      for (const [key, state] of [['2', 'draft'], ['3', 'review'], ['1', 'absent'], ['2', 'draft']]) {
        await page.keyboard.press(`Alt+${key}`);
        await expect(fixture).toHaveAttribute('data-chrome', state);
        await expect(page.locator('[data-sgui-part="document-editor-menu"]')).toHaveCount(state === 'absent' ? 0 : 1);
        await expect(page.locator('[data-sgui-part="document-editor-toolbar"]')).toHaveCount(state === 'absent' ? 0 : 1);
        await expect(page.locator('[data-sgui-part="document-editor-actions"]')).toHaveCount(state === 'absent' ? 0 : 1);
        if (state !== 'absent') {
          await expect(page.getByRole('button', { name: state === 'draft' ? 'Save draft' : 'Publish review', exact: true })).toBeVisible();
          await expect(page.getByRole('button', { name: state === 'draft' ? 'Format draft' : 'Review changes', exact: true })).toBeVisible();
          await expect(page.locator('[data-sgui-part="document-editor-menu"]')).toHaveText(state === 'draft' ? 'File · Edit' : 'Review · Comments');
        }
        expect(await root.evaluate((node, original) => node === original, originalRoot)).toBe(true);
        expect(await host.evaluate((node, original) => node === original, originalHost)).toBe(true);
        expect(await wrapper.evaluate((node, original) => node === original, originalWrapper)).toBe(true);
        expect(await action.evaluate((node, original) => node === original, originalAction)).toBe(true);
        await expect(root).toHaveAttribute('data-ref-attachments', rootAttachments!);
        await expect(host).toHaveAttribute('data-ref-attachments', hostAttachments!);
        await expect(action).toBeFocused();
        expect(await host.evaluate(node => node.scrollTop)).toBeCloseTo(scrollTop, 0);
        const geometry = await action.evaluate(node => {
          const host = node.closest('[role="region"]')!;
          const root = node.closest('[data-sgui-part="document-editor-layout"]')!;
          const wrapper = host.parentElement!;
          const a = node.getBoundingClientRect(), h = host.getBoundingClientRect(), r = root.getBoundingClientRect();
          return { action: { top: a.top, bottom: a.bottom, left: a.left, right: a.right },
            host: { top: h.top, bottom: h.bottom, left: h.left, right: h.right },
            rootBottom: r.bottom, rootScroll: root.scrollTop, wrapperScroll: wrapper.scrollTop,
            documentScroll: window.scrollY, overflow: getComputedStyle(host).overflowY,
            rootOverflow: getComputedStyle(root).overflowY, wrapperOverflow: getComputedStyle(wrapper).overflowY,
            horizontalOverflow: host.scrollWidth - host.clientWidth };
        });
        expect(geometry.action.top).toBeGreaterThanOrEqual(geometry.host.top);
        expect(geometry.action.bottom).toBeLessThanOrEqual(geometry.host.bottom);
        expect(geometry.action.left).toBeGreaterThanOrEqual(geometry.host.left);
        expect(geometry.action.right).toBeLessThanOrEqual(geometry.host.right);
        expect(geometry.host.bottom).toBeLessThanOrEqual(geometry.rootBottom);
        expect(geometry.rootScroll).toBe(0);
        expect(geometry.wrapperScroll).toBe(0);
        expect(geometry.documentScroll).toBe(0);
        expect(geometry.overflow).toBe('auto');
        expect(geometry.rootOverflow).toBe('visible');
        expect(geometry.wrapperOverflow).toBe('visible');
        expect(geometry.horizontalOverflow).toBeLessThanOrEqual(1);
        measurements.push({ state, scrollTop, geometry });
      }
      // The same retained host still owns ordinary keyboard traversal and wheel scrolling.
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Document action 13', exact: true })).toBeFocused();
      const headerTop = await page.locator('[data-sgui-part="document-editor-header"]').evaluate(node => node.getBoundingClientRect().top);
      const beforeWheel = await host.evaluate(node => node.scrollTop);
      await host.hover();
      await page.mouse.wheel(0, 120);
      await expect.poll(() => host.evaluate(node => node.scrollTop)).toBeGreaterThan(beforeWheel);
      expect(await page.locator('[data-sgui-part="document-editor-header"]').evaluate(node => node.getBoundingClientRect().top)).toBe(headerTop);
      expect(diagnostics).toEqual([]);
      await info.attach('layout-replacement-geometry', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
    });
  }
}
