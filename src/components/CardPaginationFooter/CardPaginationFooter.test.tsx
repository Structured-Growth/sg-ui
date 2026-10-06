import { describe, expect, it, vi } from "vitest";
import { AppPaginationFooter } from "./CardPaginationFooter";

const useNamespace = vi.fn();

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    useNamespace,
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}));

describe("CardPaginationFooter", () => {
  it("clamps page and wires pagination callbacks", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    const element = AppPaginationFooter({
      page: 99,
      pageSize: 10,
      pageSizeOptions: [10, 20],
      totalCount: 15,
      onPageChange,
      onPageSizeChange,
    }) as any;

    const pagination = element.props.children;
    expect(pagination.props.page).toBe(1);
    pagination.props.onPageChange(null, 0);
    expect(onPageChange).toHaveBeenCalledWith(0);
    pagination.props.onRowsPerPageChange({ target: { value: "20" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
    expect(useNamespace).toHaveBeenCalledWith("common.ui");
  });

  it("renders pagination label helpers", () => {
    const element = AppPaginationFooter({
      page: 0,
      pageSize: 10,
      pageSizeOptions: [10],
      totalCount: 0,
      onPageChange: () => {},
      onPageSizeChange: () => {},
    }) as any;

    const pagination = element.props.children;
    expect(pagination.props.getItemAriaLabel("first")).toBe("Go to first page");
    expect(pagination.props.getItemAriaLabel("last")).toBe("Go to last page");
    expect(pagination.props.getItemAriaLabel("next")).toBe("Go to next page");
    expect(pagination.props.getItemAriaLabel("previous")).toBe("Go to previous page");
    expect(pagination.props.labelDisplayedRows({ from: 1, to: 1, count: 1 })).toBe("1-1 of 1");
    expect(pagination.props.labelRowsPerPage).toBe("Rows per page:");
  });
});
