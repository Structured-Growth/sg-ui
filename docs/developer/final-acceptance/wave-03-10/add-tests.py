from pathlib import Path
out=Path('docs/developer/final-acceptance/wave-03-10');base=out/'proposed-files'
def write(p,s):
 f=base/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(s)
write('packages/ui/src/experimental/DataGrid/GridColumnWidthControl.test.tsx','''// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridColumnWidthControl } from "./GridColumnWidthControl";
afterEach(cleanup);
it("requests exact and single-pointer step widths, preserving rejecting host authority on reopen", async () => {
  const user = userEvent.setup(); const request = vi.fn(); let width = 180;
  render(<GridColumnWidthControl label="Course" width={() => width} minWidth={120} maxWidth={300} onWidthChange={request} />);
  const open = () => user.click(screen.getByRole("button", { name: "Width of Course" }));
  await open();
  await user.click(screen.getByRole("button", { name: "Wider by 1 pixel" }));
  expect(request).toHaveBeenLastCalledWith(181);
  await open();
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("180");
  await user.clear(screen.getByRole("textbox")); await user.type(screen.getByRole("textbox"), "237.5");
  await user.click(screen.getByRole("button", { name: "Apply", exact: true }));
  expect(request).toHaveBeenLastCalledWith(237.5);
  width = 237.5;
  await open();
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("237.5");
  await user.keyboard("{Escape}");
  expect(request).toHaveBeenCalledTimes(2);
});
it("rejects blank, nonfinite and out-of-bounds drafts; disables fixed and boundary operations", async () => {
  const user = userEvent.setup(); const request = vi.fn();
  render(<><GridColumnWidthControl label="Course" width={() => 120} minWidth={120} maxWidth={300} onWidthChange={request} />
    <GridColumnWidthControl label="Actions" width={() => 96} minWidth={96} maxWidth={96} onWidthChange={request} /></>);
  expect((screen.getByRole("button", { name: "Width of Actions" }) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole("button", { name: "Width of Course" }));
  expect((screen.getByRole("button", { name: "Narrower by 1 pixel" }) as HTMLButtonElement).disabled).toBe(true);
  for (const value of ["", "119", "301", "Infinity", "garbage"]) {
    await user.clear(screen.getByRole("textbox")); if (value) await user.type(screen.getByRole("textbox"), value);
    expect((screen.getByRole("button", { name: "Apply", exact: true }) as HTMLButtonElement).disabled).toBe(true);
  }
  await user.keyboard("{Escape}"); expect(request).not.toHaveBeenCalled();
});
''')
p='apps/docs/native-fixtures/scenarios/experimental/TagGroup/TagGroup.fixture.tsx';s=Path(p).read_text();s+='''
// Coarse-pointer emulation and explicit-touch geometry share production tokens.
// Each scope owns its own interaction state; this private fixture has no docs source panel.
function TargetSizingScope({ density, interactionMode }: { density: "compact" | "comfortable"; interactionMode: "auto" | "touch" }) {
  const [tags, setTags] = useState(items);
  return <ThemeScope density={density} interactionMode={interactionMode} data-testid={`${density}-${interactionMode}`}>
    <TagGroup label="Touch topics" items={tags} onRemove={ids => setTags(current => current.filter(item => !ids.includes(item.id)))} />
  </ThemeScope>;
}
export const TargetSizing: Story = { render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
  {(["compact", "comfortable"] as const).flatMap(density => (["auto", "touch"] as const).map(interactionMode =>
    <TargetSizingScope key={`${density}-${interactionMode}`} density={density} interactionMode={interactionMode} />))}
</div> };
''';write(p,s)
write('packages/ui/tests/browser/acceptance-touch-targets.spec.ts','''import { expect, test } from '@playwright/test';

// Engine touch emulation only. No physical-device, speech or real zoom claim.
test('auto coarse-pointer and explicit touch preserve tag action width, spacing, activation and focus', async ({ browser, baseURL }, info) => {
  test.skip(info.project.name === 'firefox', 'Firefox Playwright does not implement hasTouch contexts');
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/fixtures/?id=migration-proofs-taggroup--target-sizing&embed=true&globals=a11y.manual:!true');
    const media = await page.evaluate(() => ({ coarse: matchMedia('(any-pointer: coarse)').matches, touch: navigator.maxTouchPoints }));
    expect(media.coarse).toBe(true); expect(media.touch).toBeGreaterThan(0);
    const measurements: unknown[] = [];
    for (const density of ['compact', 'comfortable']) for (const mode of ['auto', 'touch']) {
      const scope = page.getByTestId(`${density}-${mode}`);
      const remove = scope.getByRole('button', { name: 'Remove React', exact: true });
      await remove.scrollIntoViewIfNeeded();
      const geometry = await remove.evaluate(element => {
        const a = element.getBoundingClientRect();
        const siblings = [...element.closest('[data-sgui-part="tag-group"]')!.querySelectorAll('[data-sgui-part="tag-remove"]')];
        return { width: a.width, height: a.height, hit: element.contains(document.elementFromPoint(a.x + a.width / 2, a.y + a.height / 2)),
          overlaps: siblings.filter(other => other !== element).some(other => { const b = other.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }) };
      });
      measurements.push({ density, mode, ...geometry });
      expect(geometry.width).toBeGreaterThanOrEqual(44); expect(geometry.height).toBeGreaterThanOrEqual(44);
      expect(geometry.hit).toBe(true); expect(geometry.overlaps).toBe(false);
      await remove.tap();
      await expect(remove).toHaveCount(0);
      const design = scope.getByRole('button', { name: 'Remove Design', exact: true });
      // Native Tab reaches the nested remove action and paints its focus indicator.
      await design.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
      await expect(design).toBeFocused();
      const focus = await design.evaluate(element => { const css = getComputedStyle(element); return { width: css.outlineWidth, style: css.outlineStyle }; });
      expect(parseFloat(focus.width)).toBeGreaterThan(0); expect(focus.style).not.toBe('none');
    }
    expect(errors).toEqual([]);
    await info.attach('emulated-coarse-targets', { body: JSON.stringify({ media, measurements }), contentType: 'application/json' });
  } finally { await context.close(); }
});
''')
