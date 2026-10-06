import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataGrid } from "./AppDataGrid";

const {
  setEphemeralPaginationModel,
  setPersistedPaginationModel,
  onSortRulesChange,
  createDataGridColumns,
  normalizePaginationModel,
  cleanupDragPreview,
  getDropPosition,
  resolveRowFromEvent,
  setDragPreview,
} = vi.hoisted(() => ({
  setEphemeralPaginationModel: vi.fn(),
  setPersistedPaginationModel: vi.fn(),
  onSortRulesChange: vi.fn(),
  createDataGridColumns: vi.fn((columns) => columns),
  normalizePaginationModel: vi.fn((model) => model),
  cleanupDragPreview: vi.fn(),
  getDropPosition: vi.fn(() => "after"),
  resolveRowFromEvent: vi.fn(),
  setDragPreview: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useCallback: <T,>(fn: T) => fn,
    useMemo: <T,>(factory: () => T) => factory(),
    useRef: <T,>(initial: T) => ({ current: initial }),
    useState: <T,>(initial: T) => [initial, setEphemeralPaginationModel] as const,
  };
});

vi.mock("../../hooks/usePersistentPaginationModel", () => ({
  APP_PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  normalizePaginationModel,
  usePersistentPaginationModel: () => [
    { page: 1, pageSize: 25 },
    setPersistedPaginationModel,
  ],
}));

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
    useNamespace: () => undefined,
  }),
}));

vi.mock("../../i18n/labelKey", () => ({
  toLabelKey: (_prefix: string, label: string) => label,
}));

vi.mock("../DataToolbar", () => ({
  DataToolbarSelectionMenu: (props: unknown) => ({ type: "DataToolbarSelectionMenu", props }),
}));

vi.mock("../AppDataGridRowDnd", () => ({
  DataGridDragHandle: (props: unknown) => ({ type: "DataGridDragHandle", props }),
  useDataGridRowDnd: () => ({
    cleanupDragPreview,
    getDropPosition,
    resolveRowFromEvent,
    setDragPreview,
  }),
}));

vi.mock("./createDataGridColumns", () => ({
  createDataGridColumns: (...args: unknown[]) => createDataGridColumns(...args),
}));

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: (props: unknown) => ({ type: "MuiDataGrid", props }),
}));

vi.mock("./components/TableLoaderOverlay", () => ({
  TableLoaderOverlay: () => null,
}));

vi.mock("./components/TableNoResults", () => ({
  TableNoResults: () => null,
}));

vi.mock("../CardPaginationFooter", () => ({
  AppPaginationFooter: (props: unknown) => ({ type: "AppPaginationFooter", props }),
}));

describe("AppDataGrid", () => {
  beforeEach(() => {
    setEphemeralPaginationModel.mockClear();
    setPersistedPaginationModel.mockClear();
    onSortRulesChange.mockClear();
    createDataGridColumns.mockClear();
    normalizePaginationModel.mockClear();
    cleanupDragPreview.mockClear();
    getDropPosition.mockClear();
    resolveRowFromEvent.mockClear();
    setDragPreview.mockClear();
  });

  it("omits the selection control column when selection is false", () => {
    AppDataGrid({ columns: [{ field: "name", headerName: "Name" }], rows: [{ id: "one", name: "Example" }], selection: false });
    const columns = createDataGridColumns.mock.calls[0][0];
    expect(columns.some((column: { field: string }) => column.field === "__select__")).toBe(false);
    expect(columns[0].field).toBe("name");
  });

  it("builds inferred hidden columns, clamps sort, and wires footer callbacks", () => {
    const rows = [{ id: "1", name: "Hermione", customStatus: "active" }] as any[];
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      storageKey: "sections.grid",
      pageSizeOptions: [10, 500],
      sortModel: [{ field: "name", sort: "asc" }, { field: "customStatus", sort: "desc" }] as any,
      sortRules: [{ field: "name", direction: "asc" }],
      onSortRulesChange,
    }) as any;

    const rootChildren = element.props.children as any[];
    const muiGrid = rootChildren[0].props.children;
    const footer = rootChildren[1];

    expect(muiGrid.type.name).toBe("DataGrid");
    expect(muiGrid.props.pageSizeOptions).toEqual([10]);
    expect(muiGrid.props.disableColumnSorting).toBe(true);
    expect(muiGrid.props.sortModel).toEqual([{ field: "name", sort: "asc" }]);
    expect(muiGrid.props.columnVisibilityModel).toEqual({ id: false, customStatus: false });

    // Header sort callback from createDataGridColumns integration.
    const options = createDataGridColumns.mock.calls[0][1];
    expect(options.getHeaderSortDirection("name")).toBe("asc");
    expect(options.getHeaderSortDirection("unknownField")).toBe("");
    options.onHeaderSortSelect("customStatus", "desc");
    expect(onSortRulesChange).toHaveBeenCalledWith([
      { field: "customStatus", direction: "desc" },
      { field: "name", direction: "asc" },
    ]);
    options.onHeaderSortSelect("name", "");
    expect(onSortRulesChange).toHaveBeenCalledWith([]);

    // Footer handlers route through pagination change callback.
    footer.props.onPageChange(4);
    expect(setPersistedPaginationModel).toHaveBeenCalledWith({ page: 4, pageSize: 25 });
    footer.props.onPageSizeChange(50);
    expect(setPersistedPaginationModel).toHaveBeenCalledWith({ page: 0, pageSize: 50 });
  });

  it("uses controlled pagination and can hide footer", () => {
    const externalOnPaginationModelChange = vi.fn();
    const element = AppDataGrid({
      columns: [{ field: "id", headerName: "ID", minWidth: 120 }] as any,
      rows: [{ id: "1" }] as any,
      paginationModel: { page: 3, pageSize: 25 },
      onPaginationModelChange: externalOnPaginationModelChange,
      hideFooter: true,
    }) as any;

    const rootChildren = element.props.children as any[];
    const muiGrid = rootChildren[0].props.children;
    expect(rootChildren[1]).toBeNull();

    muiGrid.props.onPaginationModelChange({ page: 2, pageSize: 10 }, { reason: "test" });
    expect(setEphemeralPaginationModel).not.toHaveBeenCalled();
    expect(externalOnPaginationModelChange).toHaveBeenCalledWith(
      { page: 2, pageSize: 10 },
      { reason: "test" },
    );
  });

  it("clamps onSortModelChange and preserves columns with empty header names", () => {
    const onSortModelChange = vi.fn();
    const element = AppDataGrid({
      columns: [
        { field: "id", headerName: "", minWidth: 120 },
        { field: "name", headerName: "Name", minWidth: 120 },
      ] as any,
      rows: [{ id: "1", name: "Harry" }] as any,
      onSortModelChange,
      onPaginationModelChange: vi.fn(),
    }) as any;

    const createColumnsArgs = createDataGridColumns.mock.calls[0];
    expect(createColumnsArgs[1].getHeaderSortDirection).toBeUndefined();
    const localizedColumns = createColumnsArgs[0] as Array<{ field: string; headerName?: string }>;
    expect(localizedColumns.find((column) => column.field === "id")?.headerName).toBe("");

    const muiGrid = (element.props.children as any[])[0].props.children;
    muiGrid.props.onSortModelChange(
      [{ field: "name", sort: "desc" }, { field: "id", sort: "asc" }],
      { reason: "sort" },
    );
    expect(onSortModelChange).toHaveBeenCalledWith(
      [{ field: "name", sort: "desc" }],
      { reason: "sort" },
    );
  });

  it("falls back page size options, handles missing rows, and honors provided visibility values", () => {
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rowCount: 123,
      pageSizeOptions: [{ value: 500, label: "Huge" }] as any,
      columnVisibilityModel: { id: true },
      sortModel: [{ field: "name", sort: "asc" }] as any,
      sortRules: [
        { field: "name", direction: "asc" },
        { field: "legacy", direction: "sideways" as any },
      ],
      onSortRulesChange,
      sx: [{ border: 0 }] as any,
    }) as any;

    const rootChildren = element.props.children as any[];
    const muiGrid = rootChildren[0].props.children;
    const footer = rootChildren[1];

    expect(muiGrid.props.pageSizeOptions).toEqual([10, 25, 50, 100]);
    expect(muiGrid.props.sortModel).toEqual([{ field: "name", sort: "asc" }]);
    expect(muiGrid.props.columnVisibilityModel).toEqual({ id: true });
    expect(Array.isArray(muiGrid.props.sx)).toBe(true);
    expect(muiGrid.props.sx).toHaveLength(2);
    expect(footer.props.pageSizeOptions).toEqual([10, 25, 50, 100]);
    expect(footer.props.totalCount).toBe(123);

    const options = createDataGridColumns.mock.calls[0][1];
    options.onHeaderSortSelect("name", "");
    expect(onSortRulesChange).toHaveBeenCalledWith([]);
  });

  it("maps object page size options, defaults total count to zero, and keeps provided inferred visibility", () => {
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione", customStatus: "active", extraValue: "x" }] as any,
      pageSizeOptions: [{ value: 25, label: "Twenty Five" }] as any,
      columnVisibilityModel: { customStatus: true },
    }) as any;

    const rootChildren = element.props.children as any[];
    const muiGrid = rootChildren[0].props.children;
    const footer = rootChildren[1];

    expect(muiGrid.props.pageSizeOptions).toEqual([{ value: 25, label: "Twenty Five" }]);
    expect(footer.props.pageSizeOptions).toEqual([25]);
    expect(muiGrid.props.columnVisibilityModel).toEqual({ customStatus: true, id: false, extraValue: false });

    const noRowsElement = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
    }) as any;
    const noRowsFooter = (noRowsElement.props.children as any[])[1];
    expect(noRowsFooter.props.totalCount).toBe(0);
  });

  it("ignores rows that resolve to empty row ids in internal id map", () => {
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ name: "No Id Row" }] as any,
      rowDrag: { onReorder: vi.fn() },
    }) as any;
    const muiGrid = (element.props.children as any[])[0].props.children;
    expect(muiGrid.props.rows).toEqual([{ name: "No Id Row" }]);
  });

  it("pins locked columns to edges and forces them visible", () => {
    const element = AppDataGrid({
      columns: [
        { field: "title", headerName: "Name", pinned: "left", locked: true },
        { field: "description", headerName: "Description" },
        { field: "actions", headerName: "Action", pinned: "right", locked: true },
      ] as any,
      rows: [{ id: "1", title: "Row", description: "Desc" }] as any,
      columnVisibilityModel: { title: false, actions: false, description: false },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<{ field: string }>;
    expect(localizedColumns.map((column) => column.field).slice(0, 3)).toEqual(["title", "description", "actions"]);

    const muiGrid = (element.props.children as any[])[0].props.children;
    expect(muiGrid.props.columnVisibilityModel).toEqual({
      title: true,
      actions: true,
      description: false,
      id: false,
    });
  });

  it("injects selection column and wires header/cell handlers", () => {
    const onSelectedRowIdsChange = vi.fn();
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any,
      selection: {
        selectedRowIds: new Set(["1"]),
        onSelectedRowIdsChange,
        selectAllLabel: "Everything",
        selectNoneLabel: "Nothing",
      },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    expect(localizedColumns[0].field).toBe("__select__");
    const selectionHeader = localizedColumns[0].renderHeader();
    const selectionHeaderMenu = selectionHeader.props.children;
    expect(selectionHeaderMenu.props.selectionState).toBe("some");
    expect(selectionHeaderMenu.props.options).toEqual([
      { id: "all", label: "Everything" },
      { id: "none", label: "Nothing" },
    ]);
    selectionHeaderMenu.props.onSelectOption("all");
    selectionHeaderMenu.props.onSelectOption("none");
    selectionHeaderMenu.props.onToggleSelection();
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(new Set(["1", "2"]));
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(new Set());

    const selectionCell = localizedColumns[0].renderCustomCell({ id: "2", name: "Harry" });
    const selectionCellChildren = selectionCell.props.children;
    const selectionCheckbox = Array.isArray(selectionCellChildren)
      ? selectionCellChildren.find((child) => child?.props?.onChange)
      : selectionCellChildren;
    selectionCheckbox.props.onChange({ target: { checked: true } });
    selectionCheckbox.props.onChange({ target: { checked: false } });
    expect(onSelectedRowIdsChange).toHaveBeenCalled();
  });

  it("toggles all-selected state back to none from the header menu", () => {
    const onSelectedRowIdsChange = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      selection: {
        selectedRowIds: new Set(["1", "2"]),
        onSelectedRowIdsChange,
      },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const selectionHeader = localizedColumns[0].renderHeader();
    const menu = selectionHeader.props.children;
    menu.props.onToggleSelection();
    menu.props.onSelectOption("custom");
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(new Set());
  });

  it("injects drag handle column and emits reorder callback on drop", () => {
    const onReorder = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    const targetRowElement = {
      getBoundingClientRect: () => ({ height: 10, top: 0 }),
    } as any;

    resolveRowFromEvent.mockReturnValue({
      row: rows[1],
      rowElement: targetRowElement,
    });

    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    expect(localizedColumns[0].field).toBe("__drag__");

    const dragCell = localizedColumns[0].renderCustomCell(rows[0]);
    dragCell.props.children.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
    });
    expect(setDragPreview).toHaveBeenCalled();

    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    rootProps.onDragOverCapture({ defaultPrevented: false, preventDefault: vi.fn() });
    expect(resolveRowFromEvent).toHaveBeenCalled();

    const preventDefault = vi.fn();
    rootProps.onDropCapture({ defaultPrevented: false, preventDefault, target: {} });
    expect(preventDefault).toHaveBeenCalled();
    expect(getDropPosition).toHaveBeenCalled();
    expect(onReorder).toHaveBeenCalledWith({
      sourceRow: rows[0],
      sourceRowId: "1",
      targetRow: rows[1],
      targetRowId: "2",
      position: "after",
    });
    expect(cleanupDragPreview).toHaveBeenCalled();
  });

  it("does not abort internal row drag logic when drop is already defaultPrevented without a consumer onDrop", () => {
    const onReorder = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    const targetRowElement = {
      getBoundingClientRect: () => ({ height: 10, top: 0 }),
    } as any;

    resolveRowFromEvent.mockReturnValue({
      row: rows[1],
      rowElement: targetRowElement,
    });

    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
    const dragCell = dragColumn.renderCustomCell(rows[0]);
    const dragHandle = dragCell.props.children;
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
    });

    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    const overPreventDefault = vi.fn();
    rootProps.onDragOverCapture({ defaultPrevented: true, preventDefault: overPreventDefault, dataTransfer: {} });
    expect(resolveRowFromEvent).toHaveBeenCalled();
    expect(overPreventDefault).toHaveBeenCalled();

    const dropPreventDefault = vi.fn();
    rootProps.onDropCapture({ defaultPrevented: true, preventDefault: dropPreventDefault, target: {} });
    expect(dropPreventDefault).toHaveBeenCalled();
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("uses one shared control column when selection and row drag are both enabled", () => {
    const onSelectedRowIdsChange = vi.fn();
    const onReorder = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    const targetRowElement = {
      getBoundingClientRect: () => ({ height: 10, top: 0 }),
    } as any;

    resolveRowFromEvent.mockReturnValue({
      row: rows[1],
      rowElement: targetRowElement,
    });

    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      selection: {
        selectedRowIds: new Set(["1"]),
        onSelectedRowIdsChange,
      },
      rowDrag: {
        onReorder,
      },
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    expect(localizedColumns[0].field).toBe("__select__");
    expect(localizedColumns.some((column) => column.field === "__drag__")).toBe(false);

    const combinedCell = localizedColumns[0].renderCustomCell(rows[0]);
    const cellChildren = combinedCell.props.children as any[];
    expect(Array.isArray(cellChildren)).toBe(true);
    expect(cellChildren).toHaveLength(2);

    const dragHandleSlot = cellChildren[0];
    const dragHandle = dragHandleSlot.props.children;
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
    });
    expect(setDragPreview).toHaveBeenCalled();

    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    const preventDefault = vi.fn();
    rootProps.onDropCapture({ defaultPrevented: false, preventDefault, target: {} });
    expect(onReorder).toHaveBeenCalled();
  });

  it("supports boolean selection mode and no-op callbacks when selection change handler is missing", () => {
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any,
      selection: true,
    }) as any;

    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const selectionHeader = localizedColumns[0].renderHeader();
    const selectionHeaderMenu = selectionHeader.props.children;
    selectionHeaderMenu.props.onToggleSelection();

    const noHandlerElement = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }] as any,
      selection: {
        selectedRowIds: new Set(["1"]),
      },
    }) as any;
    const noHandlerColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const noHandlerHeader = noHandlerColumns[0].renderHeader();
    const noHandlerMenu = noHandlerHeader.props.children;
    noHandlerMenu.props.onSelectOption("all");
    noHandlerMenu.props.onToggleSelection();

    const selectionCell = noHandlerColumns[0].renderCustomCell({ id: "1", name: "Hermione" });
    const checkbox = (Array.isArray(selectionCell.props.children)
      ? selectionCell.props.children.find((child: any) => child?.props?.onChange)
      : selectionCell.props.children);
    checkbox.props.onChange({ target: { checked: false } });
  });

  it("handles drag configuration branches and drag-over/drop guard paths", () => {
    const onReorder = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    resolveRowFromEvent.mockReturnValue({
      row: rows[1],
      rowElement: { getBoundingClientRect: () => ({ top: 0, height: 10 }) } as any,
    });

	    const element = AppDataGrid({
	      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
	      rows,
	      rowDrag: {
	        onReorder,
	        isRowDraggable: (row: any) => row.id !== "2",
	      },
	      slotProps: {
	        root: {
	          onDragOverCapture: (event: any) => {
	            if (event.markPrevented) {
	              event.defaultPrevented = true;
	            }
	          },
	        },
	      },
	    }) as any;
	    const muiGrid = (element.props.children as any[])[0].props.children;
	    const rootProps = muiGrid.props.slotProps.root;
	    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
	    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
	    const dragCellOne = dragColumn.renderCustomCell(rows[0]);
	    const dragHandle = dragCellOne.props.children;

	    dragHandle.props.onDragStart({ dataTransfer: null });
	    expect(setDragPreview).not.toHaveBeenCalled();

    // non-draggable second row returns null handle
    const dragCellTwo = dragColumn.renderCustomCell(rows[1]);
    expect(dragCellTwo.props.children).toBeNull();

    const dataTransfer = { setData: vi.fn(), effectAllowed: "", dropEffect: "" };
	    dragHandle.props.onDragStart({ dataTransfer });

	    // onDragOver exits because defaultPrevented
	    rootProps.onDragOverCapture({ defaultPrevented: false, markPrevented: true, preventDefault: vi.fn(), dataTransfer });
	    // onDragOver path while dragging and with resolved target.
	    rootProps.onDragOverCapture({ defaultPrevented: false, preventDefault: vi.fn(), dataTransfer });

	    const dropPreventDefault = vi.fn();
	    // drop valid source+target and reorders
	    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: dropPreventDefault, target: {}, clientY: 9 });
	    expect(onReorder).toHaveBeenCalledTimes(1);
	    // drop exits because no active drag id
	    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: dropPreventDefault, target: {} });

	    dragHandle.props.onDragEnd();
	    expect(cleanupDragPreview).toHaveBeenCalled();
	  });

  it("covers drop guard branches for missing and same-target rows", () => {
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    resolveRowFromEvent.mockReturnValue({
      row: rows[0],
      rowElement: { getBoundingClientRect: () => ({ top: 0, height: 10 }) } as any,
    });
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder: vi.fn() },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
    const dragCell = dragColumn.renderCustomCell(rows[0]);
    const dragHandle = dragCell.props.children;
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
	    });

	    const muiGrid = (element.props.children as any[])[0].props.children;
	    const rootProps = muiGrid.props.slotProps.root;
	    const cleanupCallsBefore = cleanupDragPreview.mock.calls.length;
	    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: vi.fn(), target: {} });
	    expect(cleanupDragPreview.mock.calls.length).toBeGreaterThan(cleanupCallsBefore);
	  });

  it("covers drag over/drop same-target and missing target cleanup branches", () => {
    const onReorder = vi.fn();
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    resolveRowFromEvent.mockReturnValue({
      row: rows[0],
      rowElement: { getBoundingClientRect: () => ({ top: 0, height: 10 }) } as any,
    });
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
    const dragCell = dragColumn.renderCustomCell(rows[0]);
    const dragHandle = dragCell.props.children;
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
	    });

	    const muiGrid = (element.props.children as any[])[0].props.children;
	    const rootProps = muiGrid.props.slotProps.root;
	    rootProps.onDragOverCapture({ defaultPrevented: false, preventDefault: vi.fn(), dataTransfer: {} });
	    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: vi.fn(), target: {} });
	    expect(onReorder).not.toHaveBeenCalled();
	    expect(cleanupDragPreview).toHaveBeenCalled();

	    resolveRowFromEvent.mockReturnValue(null);
	    dragHandle.props.onDragStart({
	      dataTransfer: {
	        effectAllowed: "",
	        setData: vi.fn(),
	      },
	    });
	    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: vi.fn(), target: {} });
	    expect(cleanupDragPreview).toHaveBeenCalled();
	  });

  it("exits drag-over when no target row resolves", () => {
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    resolveRowFromEvent.mockReturnValue(null);
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder: vi.fn() },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
    const dragCell = dragColumn.renderCustomCell(rows[0]);
    const dragHandle = dragCell.props.children;
    const preventDefault = vi.fn();
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
    });
    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    rootProps.onDragOverCapture({ defaultPrevented: false, preventDefault, dataTransfer: {} });
    expect(resolveRowFromEvent).toHaveBeenCalled();
  });

  it("handles grid drag leave branches", () => {
    const rows = [{ id: "1", name: "Hermione" }, { id: "2", name: "Harry" }] as any;
    const targetRowElement = {
      getBoundingClientRect: () => ({ height: 10, top: 0 }),
    } as any;
    resolveRowFromEvent.mockReturnValue({
      row: rows[1],
      rowElement: targetRowElement,
    });

    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      rowDrag: { onReorder: vi.fn() },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumn = localizedColumns.find((column) => column.field === "__drag__");
    const dragCell = dragColumn.renderCustomCell(rows[0]);
    const dragHandle = dragCell.props.children;
    dragHandle.props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData: vi.fn(),
      },
    });

    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    const NodeCtor = class {};
    vi.stubGlobal("Node", NodeCtor as any);
    const relatedTarget = new (NodeCtor as any)();
    rootProps.onDragLeaveCapture({
      relatedTarget,
      currentTarget: { contains: (candidate: unknown) => candidate === relatedTarget },
    });
    expect(cleanupDragPreview).toHaveBeenCalledTimes(0);

	    rootProps.onDragLeaveCapture({
	      relatedTarget: null,
	      clientX: -1,
	      clientY: -1,
	      currentTarget: { contains: () => false, getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0 }) },
	    });
	    expect(cleanupDragPreview).toHaveBeenCalledTimes(0);

	    rootProps.onDragLeaveCapture({
	      relatedTarget: null,
	      clientX: -1,
	      clientY: -1,
	      currentTarget: { contains: () => false, getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0 }) },
	    });
	    expect(cleanupDragPreview).toHaveBeenCalledTimes(0);

    const noRowDragElement = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      slotProps: { root: { onDragLeaveCapture: vi.fn() } },
    }) as any;
    const noRowDragGrid = (noRowDragElement.props.children as any[])[0].props.children;
    noRowDragGrid.props.slotProps.root.onDragLeaveCapture({
      relatedTarget: null,
      currentTarget: { contains: () => false },
    });
  });

  it("covers drag-over/drop early exits without rowDrag", () => {
    const element = AppDataGrid({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }] as any,
      slotProps: {
        root: {
          onDragOverCapture: vi.fn(),
          onDropCapture: vi.fn(),
        },
      },
    }) as any;
    const muiGrid = (element.props.children as any[])[0].props.children;
    const rootProps = muiGrid.props.slotProps.root;
    rootProps.onDragOverCapture({ defaultPrevented: false, preventDefault: vi.fn() });
    rootProps.onDropCapture({ defaultPrevented: false, preventDefault: vi.fn() });
    rootProps.onDropCapture({ defaultPrevented: true, preventDefault: vi.fn() });
  });

  it("does not inject duplicate control columns when control fields already exist", () => {
    const element = AppDataGrid({
      columns: [
        { field: "__select__", headerName: "", cellType: "custom", renderCustomCell: () => null } as any,
        { field: "__drag__", headerName: "", cellType: "custom", renderCustomCell: () => null } as any,
        { field: "name", headerName: "Name", minWidth: 120 } as any,
      ],
      rows: [{ id: "1", name: "Hermione" }] as any,
      selection: {
        selectedRowIds: new Set(["1"]),
        onSelectedRowIdsChange: vi.fn(),
      },
      rowDrag: {
        onReorder: vi.fn(),
      },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const selectColumns = localizedColumns.filter((column) => column.field === "__select__");
    const dragColumns = localizedColumns.filter((column) => column.field === "__drag__");
    expect(selectColumns).toHaveLength(1);
    expect(dragColumns).toHaveLength(1);
    expect(element).toBeTruthy();
  });

  it("does not inject duplicate drag column when row drag is enabled and drag field already exists", () => {
    AppDataGrid({
      columns: [
        { field: "__drag__", headerName: "", cellType: "custom", renderCustomCell: () => null } as any,
        { field: "name", headerName: "Name", minWidth: 120 } as any,
      ],
      rows: [{ id: "1", name: "Hermione" }] as any,
      rowDrag: {
        onReorder: vi.fn(),
      },
    }) as any;
    const localizedColumns = createDataGridColumns.mock.calls[createDataGridColumns.mock.calls.length - 1]?.[0] as Array<any>;
    const dragColumns = localizedColumns.filter((column) => column.field === "__drag__");
    expect(dragColumns).toHaveLength(1);
  });
});
