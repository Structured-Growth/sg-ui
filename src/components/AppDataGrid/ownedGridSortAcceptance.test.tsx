// @vitest-environment jsdom
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { SortAcceptanceExample } from "./ownedGridSortAcceptance.stories";

afterEach(cleanup);
const accepted = () => JSON.parse(screen.getByLabelText("Accepted sorting").textContent!);
const requests = () => JSON.parse(screen.getByLabelText("Sort requests").textContent!);
const names = () => Array.from(screen.getByRole("grid").querySelectorAll('tbody [data-grid-field="name"]'), node => node.textContent);
const rules = [{ field: "score", direction: "asc" }, { field: "group", direction: "asc" }];
function mount(accept = true) { render(<Provider><SortAcceptanceExample accept={accept} /></Provider>); }
async function header(user: ReturnType<typeof userEvent.setup>, field: string, action: string) {
  await user.click(screen.getByRole("button", { name: `Sort ${field}`, exact: true }));
  await user.click(screen.getByRole(action === "Clear Sort" ? "menuitem" : "menuitemradio", { name: action }));
}
async function toolbar(user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(screen.getByRole("group", { name: "Data toolbar" })).getByRole("button", { name: /^Sort/ }));
}

it("promotes a secondary header sort, exposes directions and toolbar priority, and processes one page-zero snapshot", async () => {
  const user = userEvent.setup(); mount();
  expect(names()).toEqual(["Gamma", "Alpha"]);
  await header(user, "Group", "Sort Descending");
  const next = [{ field: "group", direction: "desc" }, rules[0]];
  expect(accepted()).toEqual(next);
  expect(requests()).toEqual([{ paginationModel: { page: 0, pageSize: 2 }, sortRules: next }]);
  expect(names()).toEqual(["Delta", "Alpha"]);
  const group = screen.getByRole("button", { name: "Sort Group" }).closest('[role="columnheader"]')!;
  expect(group.getAttribute("aria-sort")).toBe("descending");
  expect(group.querySelector('[data-direction="desc"]')).toBeTruthy();
  await toolbar(user);
  expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Group");
  expect(screen.getByRole("button", { name: /Order 1/ }).textContent).toContain("Descending");
  expect(screen.getByRole("button", { name: /Column 2/ }).textContent).toContain("Score");
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(requests()).toHaveLength(1);
});

it.each(["Score", "Group"])("clears only the %s rule and preserves the survivor's direction and processing", async field => {
  const user = userEvent.setup(); mount();
  await header(user, field, "Clear Sort");
  const next = rules.filter(rule => rule.field !== field.toLowerCase());
  expect(accepted()).toEqual(next);
  expect(requests()).toEqual([{ paginationModel: { page: 0, pageSize: 2 }, sortRules: next }]);
  expect(names()).toEqual(field === "Score" ? ["Beta", "Gamma"] : ["Beta", "Delta"]);
  expect(screen.getByRole("button", { name: `Sort ${field}` }).closest('[role="columnheader"]')!.querySelector('[data-direction]')).toBeNull();
});

it("clears all rules through toolbar Reset/Apply and omits non-sortable choices", async () => {
  const user = userEvent.setup(); mount();
  expect(screen.queryByRole("button", { name: "Sort Course" })).toBeNull();
  await toolbar(user);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(requests()).toEqual([]);
  await user.click(screen.getByRole("button", { name: /Column 1/ }));
  expect(screen.queryByRole("option", { name: "Course" })).toBeNull();
  expect(screen.getAllByRole("option").map(option => option.textContent)).toEqual(["Score", "Group"]);
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(accepted()).toEqual([]);
  expect(requests()).toEqual([{ paginationModel: { page: 0, pageSize: 2 }, sortRules: [] }]);
  expect(names()).toEqual(["Alpha", "Beta"]);
});

it("keeps controlled rules, indicators, priority and rows until the host accepts a request", async () => {
  const user = userEvent.setup(); mount(false);
  await header(user, "Group", "Sort Descending");
  expect(requests()).toHaveLength(1);
  expect(accepted()).toEqual(rules);
  expect(names()).toEqual(["Gamma", "Alpha"]);
  // React Aria exposes aria-sort on the primary column; secondary direction is in the owned indicator/menu.
  expect(screen.getByRole("button", { name: "Sort Group" }).closest('[role="columnheader"]')!.querySelector('[data-direction="asc"]')).toBeTruthy();
  await toolbar(user);
  expect(screen.getByRole("button", { name: /Column 1/ }).textContent).toContain("Score");
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(requests()).toHaveLength(1);
});

it("applies toolbar keyboard priority as one coherent controlled snapshot with tie-breaking row order", async () => {
  const user = userEvent.setup(); mount(); await toolbar(user);
  screen.getByRole("button", { name: "Move sort rule up 2" }).focus();
  await user.keyboard("{Enter}");
  expect(accepted()).toEqual(rules); expect(requests()).toEqual([]);
  screen.getByRole("button", { name: "Apply" }).focus(); await user.keyboard("{Enter}");
  const next = [rules[1], rules[0]];
  expect(accepted()).toEqual(next);
  expect(requests()).toEqual([{ paginationModel: { page: 0, pageSize: 2 }, sortRules: next }]);
  expect(names()).toEqual(["Beta", "Gamma"]);
});

it.each(["{Enter}", "{Alt>}{ArrowDown}{/Alt}"])("opens the nested header menu with %s and activates descending without a draft transaction", async opener => {
  const user = userEvent.setup(); mount();
  act(() => (screen.getByRole("button", { name: "Sort Group" }).closest('[role="columnheader"]') as HTMLElement).focus());
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Sort Group" }));
  await user.keyboard(opener);
  expect(screen.getByRole("menuitemradio", { name: "Sort Ascending" }).getAttribute("aria-checked")).toBe("true");
  expect(requests()).toEqual([]);
  await user.keyboard("{ArrowDown}{Enter}");
  expect(accepted()).toEqual([{ field: "group", direction: "desc" }, rules[0]]);
  expect(requests()).toHaveLength(1);
});
