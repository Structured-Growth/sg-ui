import { expect, test, type Browser, type Page, type Locator, type TestInfo } from '@playwright/test';
async function box(target: Locator, min = 44) { await target.scrollIntoViewIfNeeded(); const value = await target.evaluate(node => { const r = node.getBoundingClientRect(), hit = node.ownerDocument.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height, centerHit: !!hit && node.contains(hit) }; }); expect(value.width).toBeGreaterThanOrEqual(min); expect(value.height).toBeGreaterThanOrEqual(min); expect(value.centerHit).toBe(true); return value; }
async function disjoint(targets: Locator[]) { const boxes = []; for (const target of targets)
    boxes.push(await box(target)); for (let a = 0; a < boxes.length; a++)
    for (let b = a + 1; b < boxes.length; b++) {
        const x = boxes[a], y = boxes[b];
        expect(x.x < y.x + y.width && x.x + x.width > y.x && x.y < y.y + y.height && x.y + x.height > y.y).toBe(false);
    } return boxes; }
async function edgeTap(page: Page, label: Locator) { await label.scrollIntoViewIfNeeded(); const r = (await label.boundingBox())!; const x = r.x + r.width - 3, y = r.y + r.height / 2; expect(await label.evaluate((n, p) => n.contains(n.ownerDocument.elementFromPoint(p.x, p.y)), { x, y })).toBe(true); await page.touchscreen.tap(x, y); }
async function pointerSpacing(scope: Locator, label: Locator) {
    await label.scrollIntoViewIfNeeded();
    const observation = await label.evaluate((node, scopeId) => {
        const scope = node.closest(`[data-testid="${scopeId}"]`)!;
        const rect = (element: Element) => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        const target = rect(node), cx = target.x + target.width / 2, cy = target.y + target.height / 2;
        const candidates = [...new Set([...scope.querySelectorAll('button,a[href],input,select,textarea,[data-resizable-direction]')].map(element => element.closest('label') ?? element.closest('[data-resizable-direction]') ?? element))];
        const neighbors = candidates.filter(element => element !== node && !node.contains(element) && !element.contains(node) && !element.closest('[hidden],[aria-hidden="true"]') && !element.matches(':disabled,[aria-disabled="true"]')).map(element => {
            const bounds = rect(element), css = getComputedStyle(element);
            const dx = Math.max(bounds.x - cx, 0, cx - bounds.x - bounds.width), dy = Math.max(bounds.y - cy, 0, cy - bounds.y - bounds.height);
            const centerDistance = Math.hypot(bounds.x + bounds.width / 2 - cx, bounds.y + bounds.height / 2 - cy);
            return { label: element.getAttribute('aria-label') ?? element.textContent?.trim(), bounds, visible: bounds.width > 0 && bounds.height > 0 && css.visibility !== 'hidden' && css.display !== 'none', circleToTargetClearance: Math.hypot(dx,dy) - 12, undersized: bounds.width < 24 || bounds.height < 24, centeredCircleClearance: centerDistance - 24 };
        }).filter(other => other.visible);
        return { target, diameter: 24, neighbors, minimumCircleToTargetClearance: Math.min(...neighbors.map(n => n.circleToTargetClearance)), minimumUndersizedCircleClearance: Math.min(...neighbors.filter(n => n.undersized).map(n => n.centeredCircleClearance)) };
    }, await scope.getAttribute('data-testid'));
    await test.info().attach('fine-pointer-spacing', {body:JSON.stringify(observation,null,2),contentType:'application/json'});
    expect(observation.target.width).toBe(22);
    expect(observation.target.height).toBeGreaterThanOrEqual(24);
    expect(observation.neighbors.length).toBeGreaterThan(0);
    expect(observation.minimumCircleToTargetClearance).toBeGreaterThanOrEqual(0);
    expect(observation.minimumUndersizedCircleClearance).toBeGreaterThanOrEqual(0);
    return observation;
}
async function run(browser: Browser, baseURL: string | undefined, id: string, info: TestInfo, body: (page: Page, scope: Locator, mode: string, rows: unknown[]) => Promise<void>, pointer?: (page: Page, scope: Locator, rows: unknown[]) => Promise<void>) {
    const rows: unknown[] = [];
    const fine = await browser.newContext({ baseURL, viewport: { width: 1100, height: 1000 } });
    try {
        const p = await fine.newPage();
        await p.goto(`/fixtures/?id=acceptance-target-sizes--${id}&embed=true`);
        expect(await p.evaluate(() => matchMedia('(any-pointer: coarse)').matches)).toBe(false);
        if (pointer)
            await pointer(p, p.getByTestId('target-pointer'), rows);
    }
    finally {
        await fine.close();
    }
    const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 1100, height: 1000 } });
    try {
        const page = await context.newPage();
        await page.goto(`/fixtures/?id=acceptance-target-sizes--${id}&embed=true`);
        expect(await page.evaluate(() => matchMedia('(any-pointer: coarse)').matches)).toBe(true);
        await page.evaluate(() => { (window as Window & {
            targetTouches?: boolean[];
        }).targetTouches = []; document.addEventListener('touchstart', e => (window as unknown as Window & {
            targetTouches: boolean[];
        }).targetTouches.push(e.isTrusted && e.touches.length === 1), true); });
        for (const mode of ['auto', 'touch']) {
            const scope = page.getByTestId(`target-${mode}`);
            await expect(scope).toHaveAttribute('data-sgui-interaction', mode);
            await expect(scope).toHaveAttribute('data-sgui-density', mode === 'auto' ? 'compact' : 'comfortable');
            const floor = await scope.evaluate(n => { const p = document.createElement('i'); p.style.width = 'var(--sgui-control-minimum-target-size)'; p.style.display = 'block'; n.append(p); const width = p.getBoundingClientRect().width; p.remove(); return width; });
            expect(floor).toBe(44);
            await body(page, scope, mode, rows);
            await info.attach(`${id}-${mode}`, { body: await scope.screenshot(), contentType: 'image/png' });
        }
        const touches = await page.evaluate(() => (window as unknown as Window & {
            targetTouches: boolean[];
        }).targetTouches);
        expect(touches.length).toBeGreaterThan(0);
        expect(touches.every(Boolean)).toBe(true);
        await info.attach('target-observations', { body: JSON.stringify({ rows, touches, coarse: true }, null, 2), contentType: 'application/json' });
    }
    finally {
        await context.close();
    }
}
test('color targets keep pointer sizing and enlarge actual touch controls', async ({ browser, baseURL }, info) => { await run(browser, baseURL, 'color-targets', info, async (page, scope, mode, rows) => { await scope.getByRole('button', { name: 'Text color', exact: true }).tap(); const dialog = page.getByRole('dialog', { name: 'Text color', exact: true }), swatches = dialog.getByRole('button').filter({ has: page.locator('[aria-hidden="true"]') }); const primary = dialog.getByRole('button', { name: 'Primary', exact: true }), peer = dialog.getByRole('button', { name: 'Primary emphasis', exact: true }); rows.push({ mode, swatches: await disjoint(await swatches.all()), native: await box(dialog.locator('input[type="color"]')) }); await edgeTap(page, peer); await expect(peer).toHaveAttribute('aria-pressed', 'true'); await expect(primary).toHaveAttribute('aria-pressed', 'false'); for (const name of ['Clear', 'Reset'])
    await box(dialog.getByRole('button', { name, exact: true })); await page.keyboard.press('Escape'); }, async (page, scope, rows) => { await scope.getByRole('button', { name: 'Text color', exact: true }).click(); const dialog = page.getByRole('dialog', { name: 'Text color', exact: true }); const r = (await dialog.getByRole('button', { name: 'Primary', exact: true }).boundingBox())!, native = (await dialog.locator('input[type="color"]').boundingBox())!; expect(r.width).toBe(28); expect(r.height).toBe(28); expect(native.height).toBe(40); rows.push({ pointerPreset: r, pointerNative: native }); }); });
test('hidden and short labels expose active touch hit regions', async ({ browser, baseURL }, info) => { await run(browser, baseURL, 'label-targets', info, async (page, scope, mode, rows) => { const bulk = scope.getByTestId('bulk'), check = bulk.getByRole('checkbox'), label = check.locator('xpath=ancestor::label[1]'), trigger = bulk.getByRole('button', { name: 'Selection options' }); rows.push({ mode, bulk: await disjoint([label, trigger]) }); await edgeTap(page, label); await expect(check).toBeChecked(); await trigger.tap(); await box(page.getByRole('menuitem', { name: 'Clear selection' })); await page.getByRole('menuitem', { name: 'Clear selection' }).tap(); await expect(check).not.toBeChecked(); const short = scope.getByTestId('short-check').getByRole('checkbox'), shortLabel = short.locator('xpath=ancestor::label[1]'); await box(shortLabel); await edgeTap(page, shortLabel); await expect(short).toBeChecked(); const radios = scope.getByRole('radio'), a = radios.nth(0).locator('xpath=ancestor::label[1]'), b = radios.nth(1).locator('xpath=ancestor::label[1]'); rows.push({ radios: await disjoint([a, b]) }); await edgeTap(page, b); await expect(radios.nth(1)).toBeChecked(); const command = scope.getByRole('button', { name: 'Go', exact: true }); await box(command); await edgeTap(page, command); await expect(scope.getByRole('status').filter({ hasText: 'Command complete' })).toBeVisible(); const grid = scope.getByTestId('grid-catalog'); const header = grid.getByRole('columnheader').first().getByRole('checkbox'), headerLabel = header.locator('xpath=ancestor::label[1]'); const selectionHeader=grid.getByRole('columnheader').first(),selectionMenu=selectionHeader.getByRole('button',{name:'Selection actions',exact:true});
 const selectionTargets=await disjoint([headerLabel,selectionMenu]);
 const headerBounds=(await selectionHeader.boundingBox())!;
 for(const target of [headerLabel,selectionMenu]){const b=(await target.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(headerBounds.x);expect(b.x+b.width).toBeLessThanOrEqual(headerBounds.x+headerBounds.width);}
 const nameHeader=grid.getByRole('columnheader').nth(1),nameControls=await nameHeader.getByRole('button').all();
 await disjoint([headerLabel,selectionMenu,...nameControls]);
 const selectionGroup=(await headerLabel.locator('xpath=..').boundingBox())!;expect(selectionGroup.x+selectionGroup.width).toBeLessThanOrEqual(headerBounds.x+headerBounds.width);
 rows.push({gridHeader:await box(headerLabel),selectionTargets,selectionHeader:headerBounds,selectionGroup}); await edgeTap(page, headerLabel); await expect(header).toBeChecked(); await edgeTap(page,selectionMenu);await expect(page.getByRole('menuitem',{name:'Select page',exact:true})).toBeVisible();await page.keyboard.press('Escape'); const row = grid.getByRole('row').filter({ hasText: 'Course' }).getByRole('checkbox'), rowLabel = row.locator('xpath=ancestor::label[1]'); await box(rowLabel); await edgeTap(page, rowLabel); await expect(row).not.toBeChecked(); const glyph = await shortLabel.locator('[aria-hidden="true"]').boundingBox(); expect(glyph!.width).toBe(22); expect(glyph!.height).toBe(22); }, async (_page, scope, rows) => {
    const bulk = scope.getByTestId('bulk').getByRole('checkbox').locator('xpath=ancestor::label[1]');
    const grid = scope.getByTestId('grid-catalog');
    const header = grid.getByRole('columnheader').first().getByRole('checkbox').locator('xpath=ancestor::label[1]');
    const row = grid.getByRole('row').filter({hasText:'Course'}).getByRole('checkbox').locator('xpath=ancestor::label[1]');
    for (const [name,label] of [['bulk',bulk],['grid-header',header],['grid-row',row]] as const) rows.push({finePointerHiddenLabel:name,spacingException:await pointerSpacing(scope,label)});
}); });
test('calendar quarter and inline range retain shared targets and prose exception', async ({ browser, baseURL }, info) => { await run(browser, baseURL, 'date-targets', info, async (page, scope, mode, rows) => { const calendar = scope.getByTestId('calendar'), day = calendar.getByRole('button', { name: /October 8, 2026/ }); const next = calendar.getByRole('button', { name: /October 9, 2026/ }); rows.push({ mode, days: await disjoint([day, next]) }); await day.tap(); await expect(day).toHaveAttribute('data-selected'); const form = scope.getByRole('form', { name: 'Quarter target form' }), q2 = form.getByRole('button', { name: 'Quarter 2' }), q3 = form.getByRole('button', { name: 'Quarter 3' }); await disjoint([q2, q3]); await q2.tap(); await expect(q2).toHaveAttribute('aria-pressed', 'true'); await form.getByRole('button', { name: 'Apply', exact: true }).tap(); expect(await form.evaluate(n => Object.fromEntries(new FormData(n as HTMLFormElement)))).toEqual({ 'quarter.start': '2026-04-01', 'quarter.end': '2026-06-30' }); const range = scope.getByTestId('range'), start = range.getByRole('button', { name: 'Start date', exact: true }), end = range.getByRole('button', { name: 'End date', exact: true }); await disjoint([start, end]); await start.tap(); await expect(start).toHaveAttribute('aria-pressed', 'true'); await range.getByRole('button', { name: 'Adjust dates', exact: true }).tap(); const operations = range.getByRole('group', { name: 'Adjust dates', exact: true }); await disjoint(await operations.getByRole('button').all()); await operations.getByRole('button', { name: 'Start date', exact: true }).tap(); const prose = scope.getByTestId('prose'), link = prose.getByRole('link', { name: 'note' }); rows.push({ inline: await link.evaluate(n => ({ display: getComputedStyle(n).display, height: n.getBoundingClientRect().height, context: n.parentElement!.textContent, exception: 'sentence-inline' })) }); await link.tap(); await expect(page).toHaveURL(/#target-note$/); }); });
test('grid resize handles remain available and shelf actions meet touch geometry', async ({ browser, baseURL }, info) => { await run(browser, baseURL, 'resize-targets', info, async (page, scope, mode, rows) => { for (const kind of ['proof', 'catalog']) {
    const grid = scope.getByTestId(`grid-${kind}`);
    await expect(grid.getByRole('button', { name: /^Width of / })).toHaveCount(0);
    const handle = grid.getByRole('slider', { name: /^Resize Score\b/ });
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
    rows.push({ mode, kind, resizeHandle: await handle.boundingBox() });
} const shelf = scope.getByTestId('shelf'), separator = shelf.getByRole('separator', { name: 'Resize Notes panel' }); rows.push({ shelfHandle: await box(separator) }); const narrow = shelf.getByRole('button', { name: 'Narrower', exact: true }), wide = shelf.getByRole('button', { name: 'Wider', exact: true }); await disjoint([narrow, wide]); const before = Number(await separator.getAttribute('aria-valuenow')); await narrow.tap(); await expect(separator).toHaveAttribute('aria-valuenow', String(before - 1)); await wide.tap(); await expect(separator).toHaveAttribute('aria-valuenow', String(before)); }); });
