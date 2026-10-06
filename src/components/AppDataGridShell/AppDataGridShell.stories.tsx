import Link from "../../adapters/Link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppDataGridShell } from "./AppDataGridShell";
import type {
  AppDataGridColumn,
  AppDataGridRowDragReorderParams,
  AppGridPaginationModel,
  AppGridSortModel,
} from "../AppDataGrid";
import { createActionMenuColumn, RowSubHeader } from "../AppDataGrid";
import type { DataToolbarFilterField, DataToolbarFilterRule, DataToolbarSortRule } from "../DataToolbar";

type DemoRow = {
  id: string;
  name: string;
  status: "active" | "pending" | "archived";
  email: string;
};

type SectionedShellRow = {
  id: string;
  rowType: "module" | "activity";
  moduleId: string;
  name: string;
  description: string;
  status: "active" | "pending" | "archived" | null;
  randomField: string | null;
};

const baseRows: DemoRow[] = [
  { id: "row-1", name: "Hermione Granger", status: "active", email: "hermione@hogwarts.edu" },
  { id: "row-2", name: "Draco Malfoy", status: "pending", email: "draco@hogwarts.edu" },
  { id: "row-3", name: "Luna Lovegood", status: "archived", email: "luna@hogwarts.edu" },
  { id: "row-4", name: "Neville Longbottom", status: "active", email: "neville@hogwarts.edu" },
  { id: "row-5", name: "Ginny Weasley", status: "active", email: "ginny@hogwarts.edu" },
  { id: "row-6", name: "Cho Chang", status: "pending", email: "cho@hogwarts.edu" },
  { id: "row-7", name: "Cedric Diggory", status: "archived", email: "cedric@hogwarts.edu" },
  { id: "row-8", name: "Seamus Finnigan", status: "active", email: "seamus@hogwarts.edu" },
  { id: "row-9", name: "Parvati Patil", status: "pending", email: "parvati@hogwarts.edu" },
];

const statusLabel: Record<DemoRow["status"], string> = {
  active: "Active",
  archived: "Archived",
  pending: "Pending",
};

const statusColor: Record<DemoRow["status"], "success" | "warning" | "default"> = {
  active: "success",
  archived: "default",
  pending: "warning",
};

const baseColumnOptions = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "email", label: "Email" },
  { id: "actions", label: "Actions" },
] as const;

const columns: AppDataGridColumn<DemoRow>[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 220 },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    cellType: "custom",
    renderCustomCell: (row) => <Chip color={statusColor[row.status]} label={statusLabel[row.status]} size="small" />,
  },
  { field: "email", headerName: "Email", minWidth: 240, flex: 1 },
  createActionMenuColumn<DemoRow>({
    headerName: "Actions",
    width: 120,
    getMenuActions: (row) => [
      { id: `open-${row.id}`, label: "Open", href: `/admin/people/${row.id}` },
      { id: `deactivate-${row.id}`, label: "Deactivate", onClick: () => undefined },
    ],
  }),
];

const reorderRows = (rows: DemoRow[], params: AppDataGridRowDragReorderParams<DemoRow>): DemoRow[] => {
  const sourceIndex = rows.findIndex((row) => row.id === params.sourceRowId);
  const targetIndex = rows.findIndex((row) => row.id === params.targetRowId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return rows;
  }

  const nextRows = [...rows];
  const [moved] = nextRows.splice(sourceIndex, 1);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = params.position === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  nextRows.splice(insertIndex, 0, moved);
  return nextRows;
};

const sectionedRowsSeed: SectionedShellRow[] = [
  { id: "module-1", rowType: "module", moduleId: "module-1", name: "Module 1: Flight Principles", description: "Core aerodynamic concepts.", status: null, randomField: null },
  { id: "module-1-activity-1", rowType: "activity", moduleId: "module-1", name: "Activity: Lift and Drag", description: "Identify lift/drag in examples.", status: "active", randomField: "12 min" },
  { id: "module-1-activity-2", rowType: "activity", moduleId: "module-1", name: "Activity: Stable Flight", description: "Practice stable flight decisions.", status: "pending", randomField: "Simulation" },
  { id: "module-2", rowType: "module", moduleId: "module-2", name: "Module 2: Safety and Operations", description: "Checklist and incident response.", status: null, randomField: null },
  { id: "module-2-activity-1", rowType: "activity", moduleId: "module-2", name: "Activity: Pre-Flight Checklist", description: "Run pre-flight checklist.", status: "active", randomField: "8 min" },
  { id: "module-2-activity-2", rowType: "activity", moduleId: "module-2", name: "Activity: Incident Scenarios", description: "Respond to incident scenarios.", status: "archived", randomField: "Case study" },
];

const sectionedFilterFields: DataToolbarFilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "enum",
    enumOptions: [
      { id: "active", label: "Active" },
      { id: "pending", label: "Pending" },
      { id: "archived", label: "Archived" },
    ],
  },
];

const parseFilterRuleValues = (value: string): string[] =>
  value.split(",").map((item) => item.trim()).filter((item) => item.length > 0);

const getVisibleSectionRows = (
  rows: SectionedShellRow[],
  collapsedModuleIds: Set<string>,
): SectionedShellRow[] => rows.filter((row) => row.rowType === "module" || !collapsedModuleIds.has(row.moduleId));

const reorderSectionRows = (
  rows: SectionedShellRow[],
  params: AppDataGridRowDragReorderParams<SectionedShellRow>,
): SectionedShellRow[] => {
  const sourceIndex = rows.findIndex((row) => row.id === params.sourceRowId);
  const targetIndex = rows.findIndex((row) => row.id === params.targetRowId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return rows;
  }

  const nextRows = [...rows];
  const [moved] = nextRows.splice(sourceIndex, 1);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = params.position === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  nextRows.splice(insertIndex, 0, moved);
  return nextRows;
};

const meta = {
  title: "Data Display/AppDataGridShell",
  component: AppDataGridShell<DemoRow>,
  decorators: [
    (Story) => (
      <Box sx={{ height: 520 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    columns,
    rows: baseRows,
    storageKey: "storybook-app-datagrid-shell",
    toolbar: {
      baseColumnOptions,
      showFilterButton: false,
      showSearchButton: false,
      showSortButton: false,
    },
  },
} satisfies Meta<typeof AppDataGridShell<DemoRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ListOnlyNoCheckboxes: Story = {
  args: {
    mode: "server"
  }
};

function SortHookedUpPreview() {
  const [sortRules, setSortRules] = useState<DataToolbarSortRule[]>([{ field: "name", direction: "asc" }]);

  const sortedRows = useMemo(() => {
    const resolvedSort = sortRules[0];
    if (!resolvedSort?.field || (resolvedSort.direction !== "asc" && resolvedSort.direction !== "desc")) {
      return baseRows;
    }

    const direction = resolvedSort.direction === "desc" ? -1 : 1;
    return [...baseRows].sort((left, right) => {
      if (resolvedSort.field === "status") {
        return left.status.localeCompare(right.status) * direction;
      }
      return left.name.localeCompare(right.name) * direction;
    });
  }, [sortRules]);

  const sortModel = useMemo<AppGridSortModel>(
    () =>
      sortRules.reduce<AppGridSortModel>((accumulator, rule) => {
        if (!rule.field || (rule.direction !== "asc" && rule.direction !== "desc")) {
          return accumulator;
        }
        return [...accumulator, { field: rule.field, sort: rule.direction }];
      }, []),
    [sortRules],
  );

  return (
    <AppDataGridShell
      columns={columns}
      onSortRulesChange={setSortRules}
      rows={sortedRows}
      sortModel={sortModel}
      sortRules={sortRules}
      storageKey="storybook-app-datagrid-shell-sort-hooked"
      toolbar={{
        baseColumnOptions,
        onSortRulesChange: setSortRules,
        showFilterButton: false,
        showSearchButton: false,
        showSortButton: true,
        sortOptions: [
          { id: "name", label: "Name" },
          { id: "status", label: "Status" },
        ],
        sortRules,
      }}
    />
  );
}

export const SortHookedUp: Story = {
  render: () => <SortHookedUpPreview />,
};

function ListWithSelectionPreview() {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set(["row-1"]));

  return (
    <AppDataGridShell
      columns={columns}
      rows={baseRows}
      selection={{
        selectedRowIds,
        onSelectedRowIdsChange: setSelectedRowIds,
      }}
      storageKey="storybook-app-datagrid-shell-selection"
      toolbar={{
        baseColumnOptions,
        leftContentWhenSelected: selectedRowIds.size > 0 ? (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="text.secondary" variant="body2">{selectedRowIds.size} selected</Typography>
            <Button onClick={() => setSelectedRowIds(new Set())} size="small" variant="outlined">Clear</Button>
          </Stack>
        ) : undefined,
        showSelectedCount: false,
        showFilterButton: false,
        showSearchButton: false,
        showSortButton: false,
      }}
    />
  );
}

export const ListWithCheckboxes: Story = {
  render: () => <ListWithSelectionPreview />,
};

function ListWithDragDropPreview() {
  const [rows, setRows] = useState<DemoRow[]>(baseRows);

  return (
    <AppDataGridShell
      columns={columns}
      rowDrag={{
        onReorder: (params) => {
          setRows((currentRows) => reorderRows(currentRows, params));
        },
      }}
      rows={rows}
      storageKey="storybook-app-datagrid-shell-row-drag"
      toolbar={{
        baseColumnOptions,
        showFilterButton: false,
        showSearchButton: false,
        showSortButton: false,
      }}
    />
  );
}

export const ListWithRowDragDrop: Story = {
  render: () => <ListWithDragDropPreview />,
};

export const CardsAndListModes: Story = {
  args: {
    storageKey: "storybook-app-datagrid-shell-cards-list",
    view: {
      cards: {
        renderCard: (row) => (
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={1}>
              <Typography variant="h6">{row.name}</Typography>
              <Typography color="text.secondary" variant="body2">{row.email}</Typography>
              <Chip color={statusColor[row.status]} label={statusLabel[row.status]} size="small" sx={{ width: "fit-content" }} />
              <Button component={Link} href={`/admin/people/${row.id}`} size="small" variant="outlined">Open</Button>
            </Stack>
          </Paper>
        ),
      },
      defaultMode: "cards",
    },
  },
};

const simulatePeopleDatabaseQuery = async ({
  page,
  pageSize,
  search,
  sortRules,
}: {
  page: number;
  pageSize: number;
  search: string;
  sortRules: DataToolbarSortRule[];
}): Promise<{ rows: DemoRow[]; total: number }> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredRows = normalizedSearch
    ? baseRows.filter((row) => row.name.toLowerCase().includes(normalizedSearch) || row.email.toLowerCase().includes(normalizedSearch))
    : baseRows;

  const resolvedSort = sortRules[0];
  const sortedRows = [...filteredRows].sort((left, right) => {
    if (!resolvedSort?.field || resolvedSort.direction !== "desc" && resolvedSort.direction !== "asc") {
      return 0;
    }

    const direction = resolvedSort.direction === "desc" ? -1 : 1;
    if (resolvedSort.field === "status") {
      return left.status.localeCompare(right.status) * direction;
    }
    return left.name.localeCompare(right.name) * direction;
  });

  const start = page * pageSize;
  const paginatedRows = sortedRows.slice(start, start + pageSize);
  return { rows: paginatedRows, total: sortedRows.length };
};

function ServerSearchAndDatabaseLoadingPreview() {
  const [rows, setRows] = useState<DemoRow[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [sortRules, setSortRules] = useState<DataToolbarSortRule[]>([{ field: "name", direction: "asc" }]);
  const [paginationModel, setPaginationModel] = useState<AppGridPaginationModel>({ page: 0, pageSize: 5 });

  const sortModel = useMemo<AppGridSortModel>(() => sortRules.reduce<AppGridSortModel>((accumulator, rule) => {
    if (!rule.field || (rule.direction !== "asc" && rule.direction !== "desc")) {
      return accumulator;
    }

    return [...accumulator, { field: rule.field, sort: rule.direction }];
  }, []), [sortRules]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 250);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchValue]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void simulatePeopleDatabaseQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      search: debouncedSearchValue,
      sortRules,
    })
      .then((result) => {
        if (cancelled) {
          return;
        }
        setRows(result.rows);
        setRowCount(result.total);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchValue, paginationModel.page, paginationModel.pageSize, sortRules]);

  return (
    <AppDataGridShell
      columns={columns}
      loading={loading}
      mode="server"
      onPaginationModelChange={setPaginationModel}
      onSortRulesChange={(nextRules) => {
        setSortRules(nextRules);
        setPaginationModel((current) => ({ ...current, page: 0 }));
      }}
      paginationMode="server"
      paginationModel={paginationModel}
      rowCount={rowCount}
      rows={rows}
      sortModel={sortModel}
      sortRules={sortRules}
      storageKey="storybook-app-datagrid-shell-server-search"
      toolbar={{
        baseColumnOptions,
        onSearchValueChange: (nextValue) => {
          setSearchValue(nextValue);
          setPaginationModel((current) => ({ ...current, page: 0 }));
        },
        onSortRulesChange: (nextRules) => {
          setSortRules(nextRules);
          setPaginationModel((current) => ({ ...current, page: 0 }));
        },
        searchValue,
        showFilterButton: false,
        showSortButton: true,
        sortOptions: [
          { id: "name", label: "Name" },
          { id: "status", label: "Status" },
        ],
        sortRules,
      }}
    />
  );
}

export const ServerSearchAndDatabaseLoading: Story = {
  render: () => <ServerSearchAndDatabaseLoadingPreview />,
};

function SectionedDropdownAllOptionsEnabledPreview() {
  const [rows, setRows] = useState<SectionedShellRow[]>(sectionedRowsSeed);
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(new Set());
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set(["module-1-activity-1"]));
  const [searchValue, setSearchValue] = useState("");
  const [filterRules, setFilterRules] = useState<DataToolbarFilterRule[]>([]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const normalizedStatuses = new Set(
      filterRules
        .filter((rule) => rule.field === "status" && rule.operator === "is")
        .flatMap((rule) => parseFilterRuleValues(rule.value).map((value) => value.toLowerCase())),
    );

    return rows.filter((row) => {
      const matchesSearch = normalizedSearch.length === 0
        || row.name.toLowerCase().includes(normalizedSearch)
        || row.description.toLowerCase().includes(normalizedSearch);
      if (!matchesSearch) {
        return false;
      }

      if (row.rowType === "module" || normalizedStatuses.size === 0) {
        return true;
      }

      return row.status ? normalizedStatuses.has(row.status) : false;
    });
  }, [filterRules, rows, searchValue]);

  const visibleRows = useMemo(
    () => getVisibleSectionRows(filteredRows, collapsedModuleIds),
    [collapsedModuleIds, filteredRows],
  );

  const sectionedColumns = useMemo<AppDataGridColumn<SectionedShellRow>[]>(() => [
    {
      field: "name",
      headerName: "Name",
      minWidth: 340,
      flex: 1,
      cellType: "custom",
      renderCustomCell: (row) => (
        row.rowType === "module" ? (
          <RowSubHeader
            expanded={!collapsedModuleIds.has(row.moduleId)}
            onToggle={() => {
              setCollapsedModuleIds((current) => {
                const next = new Set(current);
                if (next.has(row.moduleId)) {
                  next.delete(row.moduleId);
                } else {
                  next.add(row.moduleId);
                }
                return next;
              });
            }}
            title={row.name}
            titleVariant="h6"
          />
        ) : (
          <Box sx={{ pl: 5 }}>{row.name}</Box>
        )
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 280,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      cellType: "custom",
      renderCustomCell: (row) =>
        row.rowType === "module" || !row.status
          ? null
          : <Chip color={statusColor[row.status]} label={statusLabel[row.status]} size="small" />,
    },
    {
      field: "randomField",
      headerName: "Random Field",
      width: 150,
      cellType: "custom",
      renderCustomCell: (row) => (row.rowType === "module" ? null : row.randomField),
    },
    createActionMenuColumn<SectionedShellRow>({
      headerName: "Actions",
      width: 120,
      getMenuActions: (row) => [
        {
          id: `open-${row.id}`,
          label: row.rowType === "module" ? "Open module" : "Open activity",
          href: row.rowType === "module"
            ? `/content-library/modules/${row.moduleId}`
            : `/content-library/activities/${row.id}`,
        },
      ],
    }),
  ], [collapsedModuleIds]);

  return (
    <AppDataGridShell
      columns={sectionedColumns}
      getRowClassName={(params) => (params.row.rowType === "module" ? "app-grid-row-subheader" : "")}
      rowDrag={{
        getRowLabel: (row) => row.name,
        isRowDraggable: (row) => row.rowType === "activity",
        onReorder: (params) => {
          setRows((currentRows) => reorderSectionRows(currentRows, params));
        },
      }}
      rows={visibleRows}
      selection={{
        onSelectedRowIdsChange: setSelectedRowIds,
        selectedRowIds,
      }}
      storageKey="storybook-app-datagrid-shell-sectioned-all-options"
      sx={{
        "& .selection-header, & .selection-cell": {
          justifyContent: "flex-start",
          pl: 0.75,
          pr: 0,
        },
      }}
      toolbar={{
        baseColumnOptions: [
          { id: "name", label: "Name" },
          { id: "description", label: "Description" },
          { id: "status", label: "Status" },
          { id: "randomField", label: "Random Field" },
          { id: "actions", label: "Actions" },
        ],
        filterFields: sectionedFilterFields,
        filterRules,
        leftContentWhenSelected: selectedRowIds.size > 0 ? (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="text.secondary" variant="body2">{selectedRowIds.size} selected</Typography>
            <Button onClick={() => setSelectedRowIds(new Set())} size="small" variant="outlined">Clear</Button>
          </Stack>
        ) : undefined,
        showSelectedCount: false,
        onFilterRulesChange: setFilterRules,
        onRefresh: () => {
          setRows(sectionedRowsSeed);
          setCollapsedModuleIds(new Set());
          setSelectedRowIds(new Set());
          setSearchValue("");
          setFilterRules([]);
        },
        onSearchValueChange: setSearchValue,
        searchValue,
        showColumnsButton: true,
        showFilterButton: true,
        showSearchButton: true,
        showSortButton: false,
      }}
    />
  );
}

export const CollapsableSubheaders: Story = {
  render: () => <SectionedDropdownAllOptionsEnabledPreview />,
};
