import { describe, expect, it, vi } from "vitest";
import { createDataGridColumns } from "./createDataGridColumns";

vi.mock("./components/table-cell", () => ({
  CopyableTableCell: ({ value }: { value: unknown }) => ({ kind: "copyable", value }),
  CustomTableCell: ({ children }: { children: unknown }) => ({ kind: "custom", children }),
  DateTableCell: ({ value }: { value: unknown }) => ({ kind: "date", value }),
  DateTimeTableCell: ({ value }: { value: unknown }) => ({ kind: "dateTime", value }),
  ImageTableCell: ({ src }: { src?: string }) => ({ kind: "image", src }),
  JsonTableCell: ({ value }: { value: unknown }) => ({ kind: "json", value }),
  TableCellLink: ({ href }: { href: string }) => ({ kind: "link", href }),
  TableCellMenu: ({ actions }: { actions: unknown[] }) => ({ kind: "menu", actions }),
  TextTableCell: ({ value }: { value: unknown }) => ({ kind: "text", value }),
}));

vi.mock("./components/header/TableHeaderSortMenu", () => ({
  TableHeaderSortMenu: ({ label, sortDirection }: { label: unknown; sortDirection: unknown }) => ({
    kind: "header",
    label,
    sortDirection,
  }),
}));

type Row = {
  id: string;
  name: string;
  href?: string;
};

describe("createDataGridColumns", () => {
  it("adds header sort menu and cell renderers for supported cell types", () => {
    const onHeaderSortSelect = vi.fn();
    const columns = createDataGridColumns<Row>([
      { field: "name", headerName: "Name", sortable: true, cellType: "text" },
      {
        field: "link",
        headerName: "Link",
        cellType: "link",
        getLink: (row) => ({ href: row.href ?? "/", label: row.name }),
      },
      {
        field: "actions",
        headerName: "Actions",
        cellType: "menu",
        getMenuActions: () => [{ id: "x", label: "X", onClick: vi.fn() }],
      },
      {
        field: "custom",
        headerName: "Custom",
        cellType: "custom",
        renderCustomCell: (row) => row.name,
      },
      { field: "raw", headerName: "Raw" },
    ], {
      onHeaderSortSelect,
      getHeaderSortDirection: () => "asc",
    });

    expect(columns).toHaveLength(5);

    const header = columns[0]?.renderHeader?.({
      field: "name",
      colDef: { headerName: "Name" },
    } as any);
    expect(header).toBeTruthy();

    const linkCell = columns[1]?.renderCell?.({ row: { id: "1", name: "N", href: "/x" }, value: null } as any);
    expect(linkCell).toBeTruthy();

    const menuCell = columns[2]?.renderCell?.({ row: { id: "1", name: "N" }, value: null } as any);
    expect(menuCell).toBeTruthy();

    const customCell = columns[3]?.renderCell?.({ row: { id: "1", name: "N" }, value: null } as any);
    expect(customCell).toBeTruthy();

    const rawCell = columns[4]?.renderCell?.({ row: { id: "1", name: "N" }, value: "x" } as any);
    expect(rawCell).toBeUndefined();
  });

  it("returns null when link cell has no link", () => {
    const columns = createDataGridColumns<Row>([
      {
        field: "link",
        headerName: "Link",
        cellType: "link",
        getLink: () => null,
      },
    ]);

    const cell = columns[0]?.renderCell?.({ row: { id: "1", name: "N" }, value: null } as any);
    expect(cell).toBeNull();
  });

  it("covers remaining cell types and header sort callbacks", () => {
    const onHeaderSortSelect = vi.fn();
    const columns = createDataGridColumns<Row>(
      [
        { field: "date", headerName: "Date", cellType: "date", fallbackText: "-" },
        { field: "dateTime", headerName: "DateTime", cellType: "dateTime", fallbackText: "-" },
        { field: "copy", headerName: "Copy", cellType: "copyable", getCellValue: (row) => row.name },
        { field: "json", headerName: "JSON", cellType: "json", fallbackText: "-" },
        { field: "image", headerName: "Image", cellType: "image", getImageSrc: (row) => row.href },
        { field: "plainSortableOff", headerName: "Plain", sortable: false },
      ],
      {
        onHeaderSortSelect,
        getHeaderSortDirection: () => "desc",
      },
    );

    const dateCell = columns[0]?.renderCell?.({ row: { id: "1", name: "N" }, value: "2026-01-01" } as any) as any;
    expect(dateCell.props.value).toBe("2026-01-01");
    const dateTimeCell = columns[1]?.renderCell?.({ row: { id: "1", name: "N" }, value: "2026-01-01T00:00:00Z" } as any) as any;
    expect(dateTimeCell.props.value).toBe("2026-01-01T00:00:00Z");
    const copyCell = columns[2]?.renderCell?.({ row: { id: "1", name: "Neville" }, value: "ignored" } as any) as any;
    expect(copyCell.props.value).toBe("Neville");
    const jsonCell = columns[3]?.renderCell?.({ row: { id: "1", name: "N" }, value: { a: 1 } } as any) as any;
    expect(jsonCell.props.value).toEqual({ a: 1 });
    const imageCell = columns[4]?.renderCell?.({ row: { id: "1", name: "N", href: "/image.png" }, value: null } as any) as any;
    expect(imageCell.props.src).toBe("/image.png");

    expect(columns[5]?.renderHeader).toBeUndefined();

    const sortableHeader = columns[0]?.renderHeader?.({
      field: "date",
      colDef: { headerName: "Date" },
    } as any) as any;
    sortableHeader.props.onSortSelect("asc");
    expect(onHeaderSortSelect).toHaveBeenCalledWith("date", "asc");
  });

  it("renders header sort menu for plain sortable columns and defaults text cell rendering", () => {
    const onHeaderSortSelect = vi.fn();
    const columns = createDataGridColumns<Row>(
      [
        { field: "plain", headerName: "Plain" },
        { field: "text", headerName: "Text", cellType: "text" },
      ],
      {
        onHeaderSortSelect,
        getHeaderSortDirection: () => "asc",
      },
    );

    const plainHeader = columns[0]?.renderHeader?.({
      field: "plain",
      colDef: { headerName: "Plain" },
    } as any) as any;
    plainHeader.props.onSortSelect("desc");
    expect(onHeaderSortSelect).toHaveBeenCalledWith("plain", "desc");

    const textCell = columns[1]?.renderCell?.({
      row: { id: "1", name: "Any" },
      value: "Text Cell Value",
    } as any) as any;
    expect(textCell.type.name).toBe("TextTableCell");
    expect(textCell.props.value).toBe("Text Cell Value");
  });

  it("falls back header label/sort direction and defaults menu actions", () => {
    const columns = createDataGridColumns<Row>(
      [
        { field: "plain" },
        { field: "menu", cellType: "menu" },
      ],
      {
        onHeaderSortSelect: vi.fn(),
      },
    );

    const plainHeader = columns[0]?.renderHeader?.({
      field: "plain",
      colDef: {},
    } as any) as any;
    expect(plainHeader.props.label).toBe("plain");
    expect(plainHeader.props.sortDirection).toBe("");

    const menuHeader = columns[1]?.renderHeader?.({
      field: "menu",
      colDef: {},
    } as any) as any;
    expect(menuHeader.props.label).toBe("menu");
    expect(menuHeader.props.sortDirection).toBe("");

    const menuCell = columns[1]?.renderCell?.({
      row: { id: "1", name: "Any" },
      value: null,
    } as any) as any;
    expect(menuCell).toBeNull();
  });

  it("uses custom renderHeader labels for sortable plain and typed columns", () => {
    const columns = createDataGridColumns<Row>(
      [
        {
          field: "plain",
          renderHeader: () => "Plain Custom Header",
        },
        {
          field: "menu",
          cellType: "menu",
          renderHeader: () => "Menu Custom Header",
          getMenuActions: () => [],
        },
      ],
      {
        onHeaderSortSelect: vi.fn(),
        getHeaderSortDirection: () => "asc",
      },
    );

    const plainHeader = columns[0]?.renderHeader?.({ field: "plain", colDef: {} } as any) as any;
    expect(plainHeader.props.label).toBe("Plain Custom Header");

    const menuHeader = columns[1]?.renderHeader?.({ field: "menu", colDef: {} } as any) as any;
    expect(menuHeader.props.label).toBe("Menu Custom Header");
  });
});
