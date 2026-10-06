// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { AppPaginationFooter } from "./CardPaginationFooter";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const defaults = { page: 0, pageSize: 10, pageSizeOptions: [10, 20], totalCount: 15, onPageChange: vi.fn(), onPageSizeChange: vi.fn() };
describe("CardPaginationFooter", () => {
  it("clamps a host page for display and navigation without emitting during render", async () => {
    const change = vi.fn();
    render(<AppPaginationFooter {...defaults} page={99} onPageChange={change} />);
    expect(screen.getByText("11-15 of 15")).toBeTruthy();
    expect(screen.getByText("Page 2 of 2")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    expect(change).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Previous page" }));
    expect(change).toHaveBeenCalledWith(0);
  });
  it("requests page zero before a size change and does not submit a parent form", async () => {
    const calls: string[] = [];
    const submit = vi.fn(event => event.preventDefault());
    render(<form onSubmit={submit}><AppPaginationFooter {...defaults} page={1}
      onPageChange={page => calls.push(`page:${page}`)} onPageSizeChange={size => calls.push(`size:${size}`)} /></form>);
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "20");
    expect(calls).toEqual(["page:0", "size:20"]);
    screen.getByRole("button", { name: "First page" }).focus();
    await user.keyboard("{Enter}");
    expect(calls).toEqual(["page:0", "size:20", "page:0"]);
    expect(submit).not.toHaveBeenCalled();
  });
  it("handles unknown and zero totals with truthful boundaries", async () => {
    const change = vi.fn();
    const { rerender } = render(<AppPaginationFooter {...defaults} totalCount={-1} page={2} hasNextPage onPageChange={change} />);
    expect(screen.getByText("Total unknown")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    expect(change).toHaveBeenCalledWith(3);
    rerender(<AppPaginationFooter {...defaults} totalCount={0} page={8} />);
    expect(screen.getByText("0-0 of 0")).toBeTruthy();
    expect(screen.getByText("No pages")).toBeTruthy();
    expect(screen.getAllByRole("button").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
  });
  it("normalizes invalid numeric state and disables size and page actions", () => {
    render(<AppPaginationFooter {...defaults} page={NaN} pageSize={0} disabled />);
    expect(screen.getByText("1-15 of 15")).toBeTruthy();
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("25");
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    expect(screen.getAllByRole("button").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
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
