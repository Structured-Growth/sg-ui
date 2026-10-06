// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Pagination } from "./Pagination";
afterEach(cleanup);
describe("owned pagination", () => {
  it("navigates using zero-based host callbacks while displaying one-based pages", async () => {
    const ref = createRef<HTMLElement>();
    function Controlled() {
      const [page, setPage] = useState(0);
      return <Pagination ref={ref} page={page} pageCount={3} onPageChange={setPage} />;
    }
    render(<Controlled />);
    const user = userEvent.setup();
    expect(ref.current).toBe(screen.getByRole("navigation", { name: "Pagination" }));
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Page 2 of 3")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Last page" }));
    expect(screen.getByText("Page 3 of 3")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "First page" }));
    expect(screen.getByText("Page 1 of 3")).toBeTruthy();
  });
  it("supports unknown totals without inventing a last page", async () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={2} hasNextPage onPageChange={onPageChange} />);
    expect(screen.getByText("Page 3")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByText("Page 3")).toBeTruthy();
    rerender(<Pagination page={2} hasNextPage={false} onPageChange={onPageChange} />);
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("resets to page zero after page size changes and supports nonstandard current sizes", async () => {
    const calls: string[] = [];
    render(<Pagination page={3} pageCount={5} pageSize={10} pageSizeOptions={[25, 50]}
      onPageSizeChange={size => calls.push(`size:${size}`)} onPageChange={page => calls.push(`page:${page}`)} />);
    const select = screen.getByRole("combobox", { name: "Rows per page" }) as HTMLSelectElement;
    expect(select.value).toBe("10");
    await userEvent.setup().selectOptions(select, "25");
    expect(calls).toEqual(["page:0", "size:25"]);
  });
  it("blocks disabled actions and represents zero pages", async () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={1} pageCount={5} disabled onPageChange={onPageChange} />);
    for (const button of screen.getAllByRole("button")) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
      await userEvent.setup().click(button);
    }
    expect(onPageChange).not.toHaveBeenCalled();
    rerender(<Pagination page={0} pageCount={0} onPageChange={onPageChange} />);
    expect(screen.getByText("No pages")).toBeTruthy();
    expect(screen.getAllByRole("button").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
  });
  it("allows keyboard activation without submitting an enclosing form", async () => {
    const onPageChange = vi.fn();
    const onSubmit = vi.fn(event => event.preventDefault());
    const user = userEvent.setup();
    render(<form onSubmit={onSubmit}><Pagination page={0} pageCount={3} onPageChange={onPageChange} /></form>);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next page" }));
    await user.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledOnce();
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
