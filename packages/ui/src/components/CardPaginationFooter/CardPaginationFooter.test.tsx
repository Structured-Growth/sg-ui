// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { AppPaginationFooter } from "./CardPaginationFooter";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const defaults = { page: 0, pageSize: 10, pageSizeOptions: [10, 20], totalCount: 15, onPaginationModelChange: vi.fn() };
describe("CardPaginationFooter", () => {
  it("clamps a host page for display and navigation without emitting during render", async () => {
    const change = vi.fn();
    render(<AppPaginationFooter {...defaults} page={99} onPaginationModelChange={change} />);
    expect(screen.getByText("11-15 of 15")).toBeTruthy();
    expect(screen.getByText("Page 2 of 2")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    expect(change).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Previous page" }));
    expect(change).toHaveBeenCalledWith({ page: 0, pageSize: 10 });
  });
  it("requests page zero and the new size atomically and does not submit a parent form", async () => {
    const calls: Array<{page: number; pageSize: number}> = [];
    const submit = vi.fn(event => event.preventDefault());
    render(<form onSubmit={submit}><AppPaginationFooter {...defaults} page={1}
      onPaginationModelChange={model => calls.push(model)}  /></form>);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Rows per page/ })); await user.click(screen.getByRole("option", { name: "20", exact: true }));
    expect(calls).toEqual([{page:0,pageSize:20}]);
    screen.getByRole("button", { name: "First page" }).focus();
    await user.keyboard("{Enter}");
    expect(calls).toEqual([{page:0,pageSize:20},{page:0,pageSize:10}]);
    expect(submit).not.toHaveBeenCalled();
  });
  it("handles unknown and zero totals with truthful boundaries", async () => {
    const change = vi.fn();
    const { rerender } = render(<AppPaginationFooter {...defaults} totalCount={-1} page={2} hasNextPage onPaginationModelChange={change} />);
    expect(screen.getByText("Total unknown")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    expect(change).toHaveBeenCalledWith({ page: 3, pageSize: 10 });
    rerender(<AppPaginationFooter {...defaults} totalCount={0} page={8} />);
    expect(screen.getByText("0-0 of 0")).toBeTruthy();
    expect(screen.getByText("No pages")).toBeTruthy();
    expect(screen.getAllByRole("button").filter(button => button.getAttribute("aria-haspopup") !== "listbox").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
  });
  it("emits atomic page and size requests once while preserving controlled host values", async () => {
    const atomic = vi.fn();
    render(<AppPaginationFooter {...defaults} totalCount={100} page={3} pageSizeOptions={[10, 250]}
        onPaginationModelChange={atomic} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Rows per page/ })); await user.click(screen.getByRole("option", { name: "250", exact: true }));
    expect(atomic).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 250 });
    expect(screen.getByText("31-40 of 100")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(atomic).toHaveBeenLastCalledWith({ page: 4, pageSize: 10 });
    expect(atomic).toHaveBeenCalledTimes(2);
  });
  it("normalizes invalid numeric state and disables size and page actions", () => {
    render(<AppPaginationFooter {...defaults} page={NaN} pageSize={0} disabled />);
    expect(screen.getByText("1-15 of 15")).toBeTruthy();
    expect((screen.getByRole("button", { name: /Rows per page/ })).textContent).toContain("25");
    expect((screen.getByRole("button", { name: /Rows per page/ }) as HTMLSelectElement).disabled).toBe(true);
    expect(screen.getAllByRole("button").filter(button => button.getAttribute("aria-haspopup") !== "listbox").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
  });
  it("forwards range variables and namespace to the host translation adapter", () => {
    const translate = vi.fn((key: string, options: any) => key === "common.ui.pagination.displayedRows"
      ? `${options.values.from} to ${options.values.to} / ${options.values.count}` : options.defaultMessage);
    render(<SGTranslationProvider value={{ t: translate, locale: "en-US", useNamespace: () => {} }}><AppPaginationFooter {...defaults} /></SGTranslationProvider>);
    expect(screen.getByText("1 to 10 / 15")).toBeTruthy();
    expect(translate).toHaveBeenCalledWith("common.ui.pagination.displayedRows", expect.objectContaining({ namespace: "common.ui", values: { from: 1, to: 10, count: 15 } }));
  });
  it("renders stable server markup", () => {
    expect(renderToString(<AppPaginationFooter {...defaults} />)).toContain("1-10 of 15");
  });
});
