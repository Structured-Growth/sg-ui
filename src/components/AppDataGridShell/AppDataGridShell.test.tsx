import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  setPersistedState,
  setPersistedCardsPaginationModel,
  buildDataToolbarColumnOptions,
} = vi.hoisted(() => ({
  setPersistedState: vi.fn(),
  setPersistedCardsPaginationModel: vi.fn(),
  buildDataToolbarColumnOptions: vi.fn(() => [
    { id: "name", label: "Name", visible: true },
    { id: "status", label: "Status", visible: true },
  ]),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useMemo: <T,>(factory: () => T) => factory(),
  };
});

const persistentStateControl = vi.hoisted(() => ({
  viewMode: "list",
  columnVisibilityModel: { name: true, status: false, hidden: false } as Record<string, boolean>,
}));

vi.mock("../../hooks/usePersistentState", () => ({
  usePersistentState: (key: string) =>
    key.includes("viewMode")
      ? [persistentStateControl.viewMode, setPersistedState]
      : [persistentStateControl.columnVisibilityModel, setPersistedState],
}));

vi.mock("../../hooks/usePersistentPaginationModel", () => ({
  APP_PAGE_SIZE_OPTIONS: [25, 50, 100],
  usePersistentPaginationModel: () => [{ page: 0, pageSize: 25 }, setPersistedCardsPaginationModel],
}));

vi.mock("../DataToolbar", () => ({
  DataToolbar: (props: unknown) => ({ type: "DataToolbar", props }),
  buildDataToolbarColumnOptions: (...args: unknown[]) => buildDataToolbarColumnOptions(...args),
}));

vi.mock("../CardCollectionWithFooter", () => ({
  CardCollectionWithFooter: (props: unknown) => ({ type: "CardCollectionWithFooter", props }),
}));

vi.mock("../AppDataGrid", () => ({
  AppDataGrid: (props: unknown) => ({ type: "AppDataGrid", props }),
}));

describe("AppDataGridShell", () => {
  beforeEach(() => {
    setPersistedState.mockClear();
    setPersistedCardsPaginationModel.mockClear();
    buildDataToolbarColumnOptions.mockClear();
    persistentStateControl.viewMode = "list";
    persistentStateControl.columnVisibilityModel = { name: true, status: false, hidden: false };
  });

  it("renders toolbar + grid in list mode with computed column options", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");
    const rows = [{ id: "1", name: "Hermione", status: "active" }] as any;

    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      storageKey: "demo-grid",
      toolbar: {
        baseColumnOptions: [
          { id: "name", label: "Name" },
          { id: "status", label: "Status" },
        ],
        showSearchButton: false,
      },
    }) as any;

    const [toolbar, content] = element.props.children as any[];
    expect(toolbar.type.name).toBe("DataToolbar");
    expect(toolbar.props.columnOptions).toEqual([
      { id: "name", label: "Name", visible: true },
      { id: "status", label: "Status", visible: true },
    ]);
    expect(buildDataToolbarColumnOptions).toHaveBeenCalled();

    const grid = content.props.children;
    expect(grid.type.name).toBe("AppDataGrid");
    expect(grid.props.columnVisibilityModel).toEqual({ name: true, status: false });
  });

  it("renders cards mode when enabled and mode is cards", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");
    const rows = [{ id: "1", name: "Hermione", status: "active" }] as any;

    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows,
      storageKey: "demo-grid",
      view: {
        mode: "cards",
        cards: {
          renderCard: (row: any) => row.name,
        },
      },
      toolbar: {
        showSearchButton: false,
      },
    }) as any;

    const [, content] = element.props.children as any[];
    const cards = content.props.children;
    expect(cards.type.name).toBe("CardCollectionWithFooter");
    expect(cards.props.rows).toBe(rows);
    expect(cards.props.page).toBe(0);
    expect(cards.props.pageSize).toBe(25);

    cards.props.onPageChange(3);
    expect(setPersistedCardsPaginationModel).toHaveBeenCalledWith({ page: 3, pageSize: 25 });
    cards.props.onPageSizeChange(50);
    expect(setPersistedCardsPaginationModel).toHaveBeenCalledWith({ page: 0, pageSize: 50 });
  });

  it("hides toolbar when explicitly disabled", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");

    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }] as any,
      storageKey: "demo-grid",
      toolbar: {
        show: false,
      },
    }) as any;

    const [toolbar] = element.props.children as any[];
    expect(toolbar).toBeNull();
  });

  it("wires toolbar callbacks for mode and columns and shows selected count", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");
    const onModeChange = vi.fn();
    const onColumnOptionsChange = vi.fn();
    const onColumnVisibilityModelChange = vi.fn();

    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione", status: "active" }] as any,
      storageKey: "demo-grid",
      selection: {
        selectedRowIds: new Set(["1"]),
      } as any,
      toolbar: {
        baseColumnOptions: [
          { id: "name", label: "Name", locked: true },
          { id: "status", label: "Status" },
          { id: "actions", label: "Actions", locked: true },
        ],
        leftContentWhenSelected: "Bulk",
        onColumnOptionsChange,
        onColumnVisibilityModelChange,
      },
      view: {
        enabled: true,
        cards: {
          renderCard: (row: any) => row.name,
        },
        onModeChange,
      },
    }) as any;

    const [toolbar] = element.props.children as any[];
    expect(toolbar.type.name).toBe("DataToolbar");
    expect(toolbar.props.showViewModeToggle).toBe(true);
    toolbar.props.onViewModeChange("cards");
    expect(setPersistedState).toHaveBeenCalledWith("cards");
    expect(onModeChange).toHaveBeenCalledWith("cards");

    const selectedNode = toolbar.props.leftContentWhenSelected;
    expect(selectedNode.props.children[0].props.children).toEqual([1, " selected"]);
    expect(JSON.stringify(selectedNode)).toContain("Bulk");

    toolbar.props.onColumnOptionsChange([
      { id: "name", visible: true },
      { id: "status", visible: true },
      { id: "actions", visible: false },
    ]);
    expect(onColumnOptionsChange).toHaveBeenCalled();
    expect(onColumnVisibilityModelChange).toHaveBeenCalledWith({
      actions: false,
      name: true,
      status: true,
    });
    expect(setPersistedState).toHaveBeenCalledWith({
      actions: false,
      name: true,
      status: true,
    });
    expect(toolbar.props.columnOptions).toEqual([
      { id: "name", label: "Name", visible: true },
      { id: "status", label: "Status", visible: true },
    ]);
  });

  it("skips persistence when externally controlled and defaults card row id", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");
    const onModeChange = vi.fn();
    const onColumnVisibilityModelChange = vi.fn();
    const onPaginationModelChange = vi.fn();

    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "r-1", name: "Hermione", status: "active" }] as any,
      storageKey: "demo-grid",
      toolbar: {
        baseColumnOptions: [{ id: "name", label: "Name" }],
        columnVisibilityModel: { name: true },
        onColumnVisibilityModelChange,
      },
      view: {
        mode: "cards",
        cards: {
          renderCard: (row: any) => row.name,
          paginationModel: { page: 2, pageSize: 50 },
          onPaginationModelChange,
        },
        onModeChange,
      },
    }) as any;

    const [toolbar, content] = element.props.children as any[];
    expect(toolbar.props.viewMode).toBe("cards");
    toolbar.props.onViewModeChange("list");
    expect(setPersistedState).not.toHaveBeenCalledWith("list");
    expect(onModeChange).toHaveBeenCalledWith("list");

    toolbar.props.onColumnOptionsChange([{ id: "name", visible: false }]);
    expect(setPersistedState).not.toHaveBeenCalledWith({ name: false });
    expect(onColumnVisibilityModelChange).toHaveBeenCalledWith({ name: false });

    const cards = content.props.children;
    expect(cards.props.page).toBe(2);
    expect(cards.props.pageSize).toBe(50);
    cards.props.onPageChange(5);
    expect(onPaginationModelChange).toHaveBeenCalledWith({ page: 5, pageSize: 50 });
    cards.props.onPageSizeChange(100);
    expect(onPaginationModelChange).toHaveBeenCalledWith({ page: 0, pageSize: 100 });
    expect(cards.props.getRowId({ id: "abc" })).toBe("abc");
    expect(cards.props.getRowId({})).toBe("");
  });

  it("handles selection object without selected ids", async () => {
    const { AppDataGridShell } = await import("./AppDataGridShell");
    const element = AppDataGridShell({
      columns: [{ field: "name", headerName: "Name", minWidth: 120 }] as any,
      rows: [{ id: "1", name: "Hermione" }] as any,
      storageKey: "demo-grid",
      selection: {} as any,
      toolbar: {
        showSelectedCount: true,
      },
    }) as any;

    const [toolbar] = element.props.children as any[];
    expect(toolbar.props.leftContentWhenSelected).toBeUndefined();
  });
});
