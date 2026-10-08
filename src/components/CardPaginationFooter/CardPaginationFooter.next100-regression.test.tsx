// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { AppPaginationFooter as RootFooter } from "../../index";
import { AppPaginationFooter as CatalogFooter } from "..";
import { AppPaginationFooter, type AppPaginationFooterProps } from ".";
import { Provider } from "../../theme";

afterEach(cleanup);

describe("CardPaginationFooter next100 public composition", () => {
  it("preserves the AppPaginationFooter export and native styling through public entry points", () => {
    expect(RootFooter).toBe(AppPaginationFooter);
    expect(CatalogFooter).toBe(AppPaginationFooter);
    const props: AppPaginationFooterProps = {
      page: 0, pageSize: 10, pageSizeOptions: [10, 20], totalCount: 30,
      onPageChange: vi.fn(), onPageSizeChange: vi.fn(), label: "Course pages",
      className: "host-footer", style: { marginTop: 12 },
    };
    const { container } = render(<Provider><RootFooter {...props} /></Provider>);
    expect(screen.getByRole("navigation", { name: "Course pages" })).toBeTruthy();
    const footer = container.querySelector("footer")!;
    expect(footer.classList.contains("host-footer")).toBe(true);
    expect(footer.style.marginTop).toBe("12px");
    expect(props.onPageChange).not.toHaveBeenCalled();
    expect(props.onPageSizeChange).not.toHaveBeenCalled();
  });

  it("isolates controlled instances, guards both boundaries and remounts from host values", async () => {
    const leftRequest = vi.fn();
    const rightRequest = vi.fn();
    function Host({ label, request }: { label: string; request: (model: { page: number; pageSize: number }) => void }) {
      const [model, setModel] = useState({ page: 0, pageSize: 10 });
      return <AppPaginationFooter {...model} label={label} pageSizeOptions={[10, 20]} totalCount={30}
        onPageChange={() => { throw new Error("atomic callback must supersede page callback"); }}
        onPageSizeChange={() => { throw new Error("atomic callback must supersede size callback"); }}
        onPaginationModelChange={next => { request(next); setModel(next); }} />;
    }
    const tree = (left: boolean) => <Provider>{left && <Host label="Left pages" request={leftRequest} />}
      <Host label="Right pages" request={rightRequest} /></Provider>;
    const { rerender } = render(tree(true));
    const user = userEvent.setup();
    const left = within(screen.getByRole("navigation", { name: "Left pages" }));
    for (const name of ["First page", "Previous page"]) {
      const button = left.getByRole("button", { name }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      await user.click(button);
    }
    expect(leftRequest).not.toHaveBeenCalled();
    await user.click(left.getByRole("button", { name: "Last page" }));
    expect(leftRequest).toHaveBeenCalledExactlyOnceWith({ page: 2, pageSize: 10 });
    expect(left.getByText("Page 3 of 3")).toBeTruthy();
    for (const name of ["Next page", "Last page"]) {
      const button = left.getByRole("button", { name }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      await user.click(button);
    }
    expect(leftRequest).toHaveBeenCalledTimes(1);
    await user.selectOptions(left.getByRole("combobox"), "20");
    expect(leftRequest).toHaveBeenLastCalledWith({ page: 0, pageSize: 20 });
    expect(leftRequest).toHaveBeenCalledTimes(2);
    expect(left.getByText("Page 1 of 2")).toBeTruthy();
    const right = within(screen.getByRole("navigation", { name: "Right pages" }));
    expect(right.getByText("Page 1 of 3")).toBeTruthy();
    expect((right.getByRole("combobox") as HTMLSelectElement).value).toBe("10");
    expect(rightRequest).not.toHaveBeenCalled();
    rerender(tree(false));
    rerender(tree(true));
    const remounted = within(screen.getByRole("navigation", { name: "Left pages" }));
    expect(remounted.getByText("Page 1 of 3")).toBeTruthy();
    expect((remounted.getByRole("combobox") as HTMLSelectElement).value).toBe("10");
    expect(leftRequest).toHaveBeenCalledTimes(2);
    expect(rightRequest).not.toHaveBeenCalled();
  });
});
