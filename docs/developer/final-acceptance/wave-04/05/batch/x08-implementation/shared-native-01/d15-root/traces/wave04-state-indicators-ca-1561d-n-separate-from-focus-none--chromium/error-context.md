# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wave04-state-indicators.spec.ts >> calendar keeps selection separate from focus (none)
- Location: tests/browser/wave04-state-indicators.spec.ts:12:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('[data-focus-visible][data-focused]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" locator('[data-focus-visible][data-focused]') with timeout 5000ms
  - waiting for locator('[data-focus-visible][data-focused]')

```

```yaml
- application "Speech calendar, February 2024":
  - heading "Speech calendar, February 2024" [level=2]
  - banner:
    - button "Previous month": ‹
    - button "Next month": ›
  - grid "Speech calendar, February 2024":
    - rowgroup:
      - row "Thursday, February 1, 2024 Friday, February 2, 2024 Saturday, February 3, 2024":
        - gridcell [disabled]
        - gridcell [disabled]
        - gridcell [disabled]
        - gridcell [disabled]
        - gridcell "Thursday, February 1, 2024":
          - button "Thursday, February 1, 2024": "1"
        - gridcell "Friday, February 2, 2024":
          - button "Friday, February 2, 2024": "2"
        - gridcell "Saturday, February 3, 2024":
          - button "Saturday, February 3, 2024": "3"
      - row "Sunday, February 4, 2024 Monday, February 5, 2024 Tuesday, February 6, 2024 Wednesday, February 7, 2024 Thursday, February 8, 2024 Friday, February 9, 2024 Saturday, February 10, 2024":
        - gridcell "Sunday, February 4, 2024":
          - button "Sunday, February 4, 2024": "4"
        - gridcell "Monday, February 5, 2024":
          - button "Monday, February 5, 2024": "5"
        - gridcell "Tuesday, February 6, 2024":
          - button "Tuesday, February 6, 2024": "6"
        - gridcell "Wednesday, February 7, 2024":
          - button "Wednesday, February 7, 2024": "7"
        - gridcell "Thursday, February 8, 2024":
          - button "Thursday, February 8, 2024": "8"
        - gridcell "Friday, February 9, 2024":
          - button "Friday, February 9, 2024": "9"
        - gridcell "Saturday, February 10, 2024":
          - button "Saturday, February 10, 2024": "10"
      - row "Sunday, February 11, 2024 Monday, February 12, 2024 Tuesday, February 13, 2024 Wednesday, February 14, 2024 selected Thursday, February 15, 2024 Friday, February 16, 2024 Saturday, February 17, 2024":
        - gridcell "Sunday, February 11, 2024":
          - button "Sunday, February 11, 2024": "11"
        - gridcell "Monday, February 12, 2024":
          - button "Monday, February 12, 2024": "12"
        - gridcell "Tuesday, February 13, 2024":
          - button "Tuesday, February 13, 2024": "13"
        - gridcell "Wednesday, February 14, 2024 selected" [selected]:
          - button "Wednesday, February 14, 2024 selected": "14"
        - gridcell "Thursday, February 15, 2024" [disabled]:
          - button "Thursday, February 15, 2024" [disabled]: 15 Static capacity closed
        - gridcell "Friday, February 16, 2024" [disabled]:
          - button "Friday, February 16, 2024" [disabled]: 16 Callback capacity closed
        - gridcell "Saturday, February 17, 2024":
          - button "Saturday, February 17, 2024": "17"
      - row "Sunday, February 18, 2024 Monday, February 19, 2024 Tuesday, February 20, 2024 Wednesday, February 21, 2024 Thursday, February 22, 2024 Friday, February 23, 2024 Saturday, February 24, 2024":
        - gridcell "Sunday, February 18, 2024":
          - button "Sunday, February 18, 2024": "18"
        - gridcell "Monday, February 19, 2024":
          - button "Monday, February 19, 2024": "19"
        - gridcell "Tuesday, February 20, 2024":
          - button "Tuesday, February 20, 2024": "20"
        - gridcell "Wednesday, February 21, 2024":
          - button "Wednesday, February 21, 2024": "21"
        - gridcell "Thursday, February 22, 2024":
          - button "Thursday, February 22, 2024": "22"
        - gridcell "Friday, February 23, 2024":
          - button "Friday, February 23, 2024": "23"
        - gridcell "Saturday, February 24, 2024":
          - button "Saturday, February 24, 2024": "24"
      - row "Sunday, February 25, 2024 Monday, February 26, 2024 Tuesday, February 27, 2024 Wednesday, February 28, 2024 Thursday, February 29, 2024":
        - gridcell "Sunday, February 25, 2024":
          - button "Sunday, February 25, 2024": "25"
        - gridcell "Monday, February 26, 2024":
          - button "Monday, February 26, 2024": "26"
        - gridcell "Tuesday, February 27, 2024":
          - button "Tuesday, February 27, 2024": "27"
        - gridcell "Wednesday, February 28, 2024":
          - button "Wednesday, February 28, 2024": "28"
        - gridcell "Thursday, February 29, 2024":
          - button "Thursday, February 29, 2024": "29"
        - gridcell [disabled]
        - gridcell [disabled]
  - group: Unavailable dates
  - button "Next"
```

# Test source

```ts
  1  | import { expect, test, type Locator } from '@playwright/test';
  2  | 
  3  | async function border(element: Locator) {
  4  |   return element.evaluate(node => {
  5  |     const css = getComputedStyle(node), box = node.getBoundingClientRect();
  6  |     return { width: box.width, height: box.height, startWidth: parseFloat(css.borderInlineStartWidth),
  7  |       startStyle: css.borderInlineStartStyle, startColor: css.borderInlineStartColor, endColor: css.borderInlineEndColor,
  8  |       outlineWidth: parseFloat(css.outlineWidth), outlineOffset: parseFloat(css.outlineOffset), outlineStyle: css.outlineStyle };
  9  |   });
  10 | }
  11 | for (const forcedColors of ['none', 'active'] as const) for (const kind of ['navigation', 'list', 'calendar'] as const) {
  12 |   test(`${kind} keeps selection separate from focus (${forcedColors})`, async ({ page }, info) => {
  13 |     await page.emulateMedia({ forcedColors });
  14 |     const errors: string[] = [];
  15 |     page.on('pageerror', error => errors.push(error.message));
  16 |     const snapshots: unknown[] = [];
  17 |     // Two representative combinations; not the historical full Cartesian proposal.
  18 |     for (const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const) {
  19 |       const id = kind === 'navigation' ? 'migration-proofs-navigation--host-routing-and-expansion' : kind === 'list' ? 'migration-proofs-list--selected-actions' : 'migration-proofs-calendar--speech-semantics';
  20 |       await page.goto(`/fixtures/?id=${id}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
  21 |       const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
  22 |       test.skip(forcedColors === 'active' && !active, 'Engine cannot emulate forced colors; no normal-color substitution.');
  23 |       if (kind === 'calendar') {
  24 |         const selected = page.getByRole('gridcell', { selected: true });
  25 |         await expect(selected).toHaveCount(1);
  26 |         const before = await selected.boundingBox();
  27 |         await selected.focus();
  28 |         await page.keyboard.press('ArrowRight');
  29 |         const focused = page.locator('[data-focus-visible][data-focused]');
  30 |         await expect(selected).not.toBeFocused();
> 31 |         await expect(focused).toBeFocused();
     |                               ^ Error: expect(locator).toBeFocused() failed
  32 |         const ring = await selected.evaluate(node => {
  33 |           const css = getComputedStyle(node, '::after');
  34 |           return { content: css.content, width: parseFloat(css.borderTopWidth), style: css.borderTopStyle, color: css.borderTopColor, inset: css.insetInlineStart, pointerEvents: css.pointerEvents };
  35 |         });
  36 |         expect(ring.content).toBe('""'); expect(ring.width).toBe(1); expect(ring.style).toBe('solid');
  37 |         expect(ring.inset).toBe('3px'); expect(ring.pointerEvents).toBe('none');
  38 |         const after = await selected.boundingBox();
  39 |         expect(after!.width).toBe(before!.width); expect(after!.height).toBe(before!.height);
  40 |         expect((await border(focused)).outlineWidth).toBeGreaterThanOrEqual(2);
  41 |         snapshots.push({ theme, density, direction, ring, before, after });
  42 |       } else {
  43 |         const first = kind === 'navigation' ? page.getByRole('link', { name: 'Algebra', exact: true }) : page.getByRole('button', { name: /Algebra/ });
  44 |         const second = kind === 'navigation' ? page.getByRole('link', { name: 'Geometry', exact: true }) : page.getByRole('button', { name: /Geometry/ });
  45 |         const before = await border(second);
  46 |         await second.focus();
  47 |         await page.keyboard.press(kind === 'navigation' ? 'Enter' : 'Space');
  48 |         await expect(second).toHaveAttribute(kind === 'navigation' ? 'aria-current' : 'aria-pressed', kind === 'navigation' ? 'page' : 'true');
  49 |         if (kind === 'navigation') await expect(first).not.toHaveAttribute('aria-current', 'page');
  50 |         else await expect(first).toHaveAttribute('aria-pressed', 'false');
  51 |         const after = await border(second);
  52 |         expect(after.startWidth).toBe(3);
  53 |         expect(before.startStyle).toBe('solid');
  54 |         expect(after.startStyle).toBe('double');
  55 |         expect(after.startColor).not.toBe('rgba(0, 0, 0, 0)');
  56 |         expect(after.outlineStyle).toBe('solid'); expect(after.outlineWidth).toBeGreaterThanOrEqual(2);
  57 |         expect(after.outlineOffset).toBeGreaterThanOrEqual(0);
  58 |         expect(Math.abs(after.width - before.width)).toBeLessThan(0.1);
  59 |         expect(Math.abs(after.height - before.height)).toBeLessThan(0.1);
  60 |         await first.focus();
  61 |         await expect(first).toBeFocused();
  62 |         await expect(second).not.toBeFocused();
  63 |         expect((await border(second)).startWidth).toBe(3);
  64 |         snapshots.push({ theme, density, direction, before, after });
  65 |       }
  66 |       await info.attach(`${theme}-${density}-${direction}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  67 |     }
  68 |     expect(errors).toEqual([]);
  69 |     await info.attach('state-geometry', { body: JSON.stringify({ kind, forcedColors, snapshots }), contentType: 'application/json' });
  70 |   });
  71 | }
  72 | 
```