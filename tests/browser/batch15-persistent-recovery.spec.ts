import { expect, test, type Page } from "@playwright/test";
const url = "/iframe.html?id=hooks-persistent-state--quota-recovery&viewMode=story&globals=a11y.manual:!true";
async function open(page: Page) {
  await page.goto(url);
  for (const kind of ["local", "session"]) await expect(page.getByLabel(`${kind} harness ready`)).toHaveText("ready");
}

test("injected quota recovery retires fallback for simultaneous local/session peers without redundant writes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await open(page);
  const value = (name: string) => page.getByLabel(`${name} value`);
  for (const kind of ["local", "session"]) {
    await page.getByRole("button", { name: `Save ${kind} primary 3`, exact: true }).click();
    await expect(page.getByLabel(`${kind} saved bytes`)).toHaveText("3");
    const before = await page.getByLabel(`${kind} successful writes`).textContent();
    await page.getByRole("button", { name: `Inject ${kind} quota failure`, exact: true }).click();
    await page.getByRole("button", { name: `Save ${kind} primary 5`, exact: true }).click();
    await expect(value(`${kind} primary`)).toHaveText("5");
    await expect(value(`${kind} peer`)).toHaveText("5");
    await expect(page.getByLabel(`${kind} failed writes`)).toHaveText("1");
    await expect(page.getByLabel(`${kind} saved bytes`)).toHaveText("3");
    const other = kind === "local" ? "session" : "local";
    await expect(value(`${other} primary`)).toHaveText(kind === "local" ? "3" : "4");
    await page.getByRole("button", { name: `Recover ${kind} writes`, exact: true }).click();
    await page.getByRole("button", { name: `Save ${kind} primary 3`, exact: true }).click();
    await expect(value(`${kind} primary`)).toHaveText("3");
    await expect(value(`${kind} peer`)).toHaveText("3");
    await expect(page.getByLabel(`${kind} successful writes`)).toHaveText(before!);
    await page.getByRole("button", { name: `Increment ${kind} peer`, exact: true }).click();
    await expect(value(`${kind} primary`)).toHaveText("4");
    await expect(page.getByLabel(`${kind} saved bytes`)).toHaveText("4");
    await page.getByRole("button", { name: `Unmount ${kind} peer`, exact: true }).click();
    await expect(value(`${kind} peer`)).toHaveCount(0);
    await page.getByRole("button", { name: `Remount ${kind} peer`, exact: true }).click();
    await expect(value(`${kind} peer`)).toHaveText("4");
    await expect(value(`${kind} distinct key`)).toHaveText("9");
    await expect(value(`${kind} memory primary`)).toHaveText("11");
    await expect(value(`${kind} memory peer`)).toHaveText("11");
    await page.getByRole("button", { name: `Increment ${kind} memory primary`, exact: true }).click();
    await expect(value(`${kind} memory primary`)).toHaveText("12");
    await expect(value(`${kind} memory peer`)).toHaveText("11");
  }
  expect(errors).toEqual([]);
});

test("a genuine second-page local storage event retires fallback without changing first-page session state", async ({ page, context }) => {
  await open(page);
  await page.getByRole("button", { name: "Save local primary 3", exact: true }).click();
  await page.getByRole("button", { name: "Save session primary 3", exact: true }).click();
  const second = await context.newPage();
  try {
    await open(second);
    await page.getByRole("button", { name: "Inject local quota failure", exact: true }).click();
    await page.getByRole("button", { name: "Save local primary 5", exact: true }).click();
    await expect(page.getByLabel("local peer value")).toHaveText("5");
    await expect(second.getByLabel("local peer value")).toHaveText("3");
    await second.getByRole("button", { name: "Increment local peer", exact: true }).click();
    await expect(page.getByLabel("local primary value")).toHaveText("4");
    await expect(page.getByLabel("local peer value")).toHaveText("4");
    await expect(page.getByLabel("local saved bytes")).toHaveText("4");
    await second.getByRole("button", { name: "Save session primary 5", exact: true }).click();
    await expect(second.getByLabel("session peer value")).toHaveText("5");
    await expect(page.getByLabel("session primary value")).toHaveText("3");
    await expect(page.getByLabel("session peer value")).toHaveText("3");
    await expect(page.getByLabel("local distinct key value")).toHaveText("9");
    await expect(page.getByLabel("local memory primary value")).toHaveText("11");
  } finally { await second.close(); }
});
