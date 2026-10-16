import { expect, test, type Locator } from "@playwright/test";
const fixture = "/fixtures/?id=migration-proofs-button--activation-notifications";
test.beforeEach(async ({ page }) => {
  page.on("pageerror", error => { throw error; });
});
async function activate(button: Locator, method: "pointer" | "Enter" | "Space") {
  if (method === "pointer") await button.click();
  else { await button.focus(); await button.press(method); }
}
test("owned ordinary/composed callbacks notify exactly once per pointer, Enter and Space", async ({ page }) => {
  await page.goto(fixture);
  const events: string[] = [];
  const output = page.getByLabel("Activation notifications");
  let selected = false;
  for (const method of ["pointer", "Enter", "Space"] as const) {
    await activate(page.getByRole("button", { name: "Ordinary action", exact: true }), method);
    events.push("action:0"); await expect(output).toHaveText(JSON.stringify(events));
    await activate(page.getByRole("button", { name: "Reorder action", exact: true }), method);
    events.push("reorder:0"); await expect(output).toHaveText(JSON.stringify(events));
    await activate(page.getByRole("button", { name: "Anchor action", exact: true }), method);
    events.push("anchor:BUTTON:Anchor action"); await expect(output).toHaveText(JSON.stringify(events));
    await activate(page.getByRole("button", { name: "Toggle action", exact: true }), method);
    selected = !selected;
    // Selection and activation are distinct notifications; their relative order is not public API.
    const actual = JSON.parse((await output.textContent())!);
    expect(actual.slice(0, events.length)).toEqual(events);
    expect(actual.slice(events.length).sort()).toEqual([`selection:${selected}`, "toggle press:0"].sort());
    events.push(...actual.slice(events.length));
    await expect(page.getByRole("button", { name: "Toggle action", exact: true })).toHaveAttribute("aria-pressed", String(selected));
  }
  await page.waitForTimeout(50);
  await expect(output).toHaveText(JSON.stringify(events));
});
test("submit/reset press precedes one native form event for pointer, Enter and Space", async ({ page }) => {
  await page.goto(fixture); const events: string[] = [];
  for (const method of ["pointer", "Enter", "Space"] as const) {
    for (const type of ["submit", "reset"] as const) {
      await activate(page.getByRole("button", { name: type === "submit" ? "Submit action" : "Reset action", exact: true }), method);
      events.push(`${type} press:0`, type);
      await expect(page.getByLabel("Activation notifications")).toHaveText(JSON.stringify(events));
    }
  }
  await page.waitForTimeout(50);
  await expect(page.getByLabel("Activation notifications")).toHaveText(JSON.stringify(events));
});
test("emulated touch invokes one ordinary, anchor, toggle and native-form activation", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true });
  try {
    const page = await context.newPage(); const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message)); await page.goto(fixture);
    const events: string[] = [];
    for (const [label, expected] of [
      ["Ordinary action", ["action:0"]], ["Reorder action", ["reorder:0"]], ["Anchor action", ["anchor:BUTTON:Anchor action"]],
      ["Submit action", ["submit press:0", "submit"]], ["Reset action", ["reset press:0", "reset"]],
    ] as const) {
      await page.getByRole("button", { name: label, exact: true }).tap(); events.push(...expected);
      await expect(page.getByLabel("Activation notifications")).toHaveText(JSON.stringify(events));
    }
    await page.getByRole("button", { name: "Toggle action", exact: true }).tap();
    const actual = JSON.parse((await page.getByLabel("Activation notifications").textContent())!);
    expect(actual.slice(0, events.length)).toEqual(events);
    expect(actual.slice(events.length).sort()).toEqual(["selection:true", "toggle press:0"].sort());
    await page.waitForTimeout(50);
    await expect(page.getByLabel("Activation notifications")).toHaveText(JSON.stringify(actual));
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});
