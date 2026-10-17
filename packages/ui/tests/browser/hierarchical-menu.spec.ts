import { expect, test, type Locator } from "@playwright/test";
const host = "/fixtures/?id=migration-proofs-hierarchicalmenu--";
async function settleMotion(panel: Locator) {
  await panel.evaluate(async node => {
    await Promise.all(node.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
  });
}
test.beforeEach(async ({ page }) => { page.on("pageerror", error => { throw error; }); });
test("three levels and mixed inline Back restore focus without changing the independent panel", async ({ page }, info) => {
  await page.goto(host + "independent");
  const first = page.getByRole("navigation", { name: "First navigation" });
  const second = page.getByRole("navigation", { name: "Second navigation" });
  await settleMotion(first);
  await info.attach("hierarchy-both-densities-root", { body: await page.screenshot(), contentType: "image/png" });
  await first.getByRole("button", { name: "Course settings", exact: true }).focus();
  await page.keyboard.press("Enter"); await expect(first.getByRole("button", { name: "People", exact: true })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(first.getByRole("button", { name: "Invite learner", exact: true })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.getByRole("status", { name: "Local action result" })).toHaveText("Invitation draft opened locally");
  await page.setViewportSize({ width: 360, height: 640 });
  await first.getByRole("button", { name: "Learner 15", exact: true }).focus();
  await settleMotion(first);
  const back = first.getByRole("button", { name: "Back to People" });
  const backLabel = back.locator('[data-sgui-part="hierarchical-back-label"]');
  await expect(backLabel).toHaveText("People");
  const geometry = await back.evaluate(button => {
    const label = button.querySelector<HTMLElement>('[data-sgui-part="hierarchical-back-label"]')!;
    const range = document.createRange(); range.selectNodeContents(label);
    const text = Array.from(range.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0);
    const bounds = button.getBoundingClientRect(); const box = label.getBoundingClientRect();
    return { lines: new Set(text.map(rect => Math.round(rect.top))).size,
      labelWidth: box.width, labelHeight: box.height,
      textInside: text.every(rect => rect.left >= bounds.left && rect.right <= bounds.right && rect.top >= bounds.top && rect.bottom <= bounds.bottom),
      labelInside: box.left >= bounds.left && box.right <= bounds.right && box.top >= bounds.top && box.bottom <= bounds.bottom,
      clips: label.scrollWidth > label.clientWidth + 1,
      writingMode: getComputedStyle(label).writingMode };
  });
  expect(geometry.lines).toBe(1);
  expect(geometry.writingMode).toBe("horizontal-tb");
  expect(geometry.labelWidth).toBeGreaterThan(geometry.labelHeight);
  expect(geometry.textInside).toBe(true); expect(geometry.labelInside).toBe(true); expect(geometry.clips).toBe(false);
  await info.attach("hierarchy-back-label-geometry", { body: JSON.stringify(geometry), contentType: "application/json" });
  await info.attach("hierarchy-deep-narrow-scrolled", { body: await page.screenshot(), contentType: "image/png" });
  await expect(back).toBeInViewport(); await back.click(); await expect(first.getByRole("button", { name: "People", exact: true })).toBeFocused();
  await first.getByRole("button", { name: "Back to Course settings" }).click();
  await expect(first.getByRole("button", { name: "Course settings", exact: true })).toBeFocused();
  await expect(first.getByRole("button", { name: "Root reports", exact: true })).toBeVisible();
  await first.getByRole("button", { name: "Resources", exact: true }).click();
  await first.getByRole("button", { name: "Reports", exact: true }).click();
  await expect(first.getByRole("button", { name: "Export report", exact: true })).toBeFocused();
  await first.getByRole("button", { name: "Back to Reports" }).click();
  await expect(first.getByRole("button", { name: "Reports", exact: true })).toBeFocused();
  await expect(first.getByRole("button", { name: "Resources" })).toHaveAttribute("aria-expanded", "true");
  await expect(second.getByRole("button", { name: "Resources" })).toHaveAttribute("aria-expanded", "false");
  await expect(second.getByRole("button", { name: "Course settings", exact: true })).toBeVisible();
  await settleMotion(first);
  await info.attach("hierarchy-inline-back-focus", { body: await page.screenshot(), contentType: "image/png" });
});
test("rejected path requests leave selection intact and removed ancestors reconcile safely", async ({ page }) => {
  await page.goto(host + "controlled");
  const nav = page.getByRole("navigation", { name: "Controlled navigation" });
  await nav.getByRole("button", { name: "Course settings", exact: true }).click();
  await expect(nav.getByRole("button", { name: "Back to Course settings" })).toHaveCount(0);
  await page.getByText("Accept path requests", { exact: true }).click();
  await nav.getByRole("button", { name: "Course settings", exact: true }).click();
  await expect(nav.getByRole("button", { name: "People", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Remove settings" }).click();
  await expect(nav.getByRole("button", { name: "Back to Course settings" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Remove settings" })).toBeFocused();
});
test("command Escape unwinds child levels before dismissing the popup and reopening at root", async ({ page }) => {
  await page.goto(host + "commands&globals=direction:rtl;locale:ar-EG");
  const opener = page.getByRole("button", { name: "Open course commands" });
  await opener.click();
  await page.getByRole("menuitem", { name: "Course settings", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "People", exact: true })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.getByRole("menuitem", { name: "Invite learner", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("menuitem", { name: "People", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByRole("menuitem", { name: "Course settings", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(opener).toBeFocused();
  await opener.click(); await expect(page.getByRole("menuitem", { name: "Back to Course settings" })).toHaveCount(0);
});
