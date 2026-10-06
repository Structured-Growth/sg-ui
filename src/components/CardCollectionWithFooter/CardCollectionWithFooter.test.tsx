import { describe, expect, it, vi } from "vitest";
import { CardCollectionWithFooter } from "./CardCollectionWithFooter";

vi.mock("../CardPaginationFooter", () => ({
  AppPaginationFooter: (props: unknown) => ({ type: "AppPaginationFooter", props }),
}));

describe("CardCollectionWithFooter", () => {
  it("renders only paged rows and wires footer props", () => {
    const rows = [
      { id: "1", label: "One" },
      { id: "2", label: "Two" },
      { id: "3", label: "Three" },
    ];
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    const renderCard = vi.fn((row: { label: string }) => `Card:${row.label}`);

    const element = CardCollectionWithFooter({
      rows,
      getRowId: (row) => row.id,
      page: 1,
      pageSize: 2,
      pageSizeOptions: [2, 4],
      onPageChange,
      onPageSizeChange,
      renderCard,
    }) as any;

    const [cardsGrid, footer] = element.props.children as any[];
    expect(cardsGrid.props.children).toHaveLength(1);
    expect(cardsGrid.props.children[0].props.children).toBe("Card:Three");
    expect(renderCard).toHaveBeenCalledTimes(1);
    expect(renderCard).toHaveBeenCalledWith({ id: "3", label: "Three" });

    expect(footer.type.name).toBe("AppPaginationFooter");
    expect(footer.props.page).toBe(1);
    expect(footer.props.pageSize).toBe(2);
    expect(footer.props.pageSizeOptions).toEqual([2, 4]);
    expect(footer.props.totalCount).toBe(3);
    expect(footer.props.onPageChange).toBe(onPageChange);
    expect(footer.props.onPageSizeChange).toBe(onPageSizeChange);
  });

  it("renders empty page when start index exceeds length", () => {
    const element = CardCollectionWithFooter({
      rows: [{ id: "1", label: "One" }],
      getRowId: (row) => row.id,
      page: 3,
      pageSize: 2,
      pageSizeOptions: [2],
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
      renderCard: (row) => row.label,
    }) as any;

    const [cardsGrid] = element.props.children as any[];
    expect(cardsGrid.props.children).toEqual([]);
  });
});
