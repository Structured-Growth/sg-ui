import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { AppDataGrid } from "./AppDataGrid";
import { createActionMenuColumn } from "./createActionMenuColumn";
import { RowSubHeader } from "./components/RowSubHeader";
import type { AppDataGridColumn, AppDataGridRowDragReorderParams, AppDataGridSortRule } from "./types";

type DemoRow = {
  id: string;
  name: string;
  status: "active" | "pending" | "archived";
  email: string;
  enrolledAt: string;
  dueAt: string;
  payload: Record<string, string>;
  avatar: string | null;
};

type SectionedRow = {
  id: string;
  rowType: "module" | "activity";
  moduleId: string;
  title: string;
  description: string;
  status: "ready" | "draft" | "archived" | null;
  randomField: string | null;
};

const baseTime = new Date("2026-02-13T15:00:00Z");

const demoRows: DemoRow[] = [
  {
    id: "row-1",
    name: "Hermione Granger",
    status: "active",
    email: "hermione@hogwarts.edu",
    enrolledAt: new Date(baseTime.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    dueAt: new Date(baseTime.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    payload: { role: "learner", house: "Gryffindor" },
    avatar: null,
  },
  {
    id: "row-2",
    name: "Draco Malfoy",
    status: "pending",
    email: "draco@hogwarts.edu",
    enrolledAt: new Date(baseTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    dueAt: new Date(baseTime.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    payload: { role: "learner", house: "Slytherin" },
    avatar: null,
  },
  {
    id: "row-3",
    name: "Luna Lovegood",
    status: "archived",
    email: "luna@hogwarts.edu",
    enrolledAt: new Date(baseTime.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    dueAt: new Date(baseTime.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    payload: { role: "learner", house: "Ravenclaw" },
    avatar: null,
  },
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

const defaultColumns: AppDataGridColumn<DemoRow>[] = [
  { field: "id", headerName: "ID", width: 120 },
  { field: "name", headerName: "Name", flex: 1, minWidth: 220 },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    cellType: "custom",
    renderCustomCell: (row) => <Chip color={statusColor[row.status]} label={statusLabel[row.status]} size="small" />,
  },
  createActionMenuColumn<DemoRow>({
    headerName: "Actions",
    width: 120,
    getMenuActions: (row) => [
      { id: `open-${row.id}`, label: "Open", href: `/sections/learner/${row.id}` },
      { id: `archive-${row.id}`, label: "Archive", onClick: () => undefined },
    ],
  }),
];

const structuredColumns: AppDataGridColumn<DemoRow>[] = [
  {
    field: "avatar",
    headerName: "Avatar (image)",
    width: 90,
    cellType: "image",
    getImageSrc: (row) => row.avatar,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Learner (link)",
    flex: 1,
    minWidth: 220,
    cellType: "link",
    getLink: (row) => ({
      href: `/sections/learner/${row.id}`,
      label: row.name,
      abbr: row.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2),
    }),
  },
  {
    field: "email",
    headerName: "Email (copyable)",
    minWidth: 220,
    flex: 1,
    cellType: "copyable",
  },
  {
    field: "enrolledAt",
    headerName: "Enrolled (date)",
    width: 170,
    cellType: "date",
  },
  {
    field: "dueAt",
    headerName: "Due (dateTime)",
    width: 220,
    cellType: "dateTime",
  },
  {
    field: "payload",
    headerName: "Metadata (json)",
    flex: 1,
    minWidth: 220,
    cellType: "json",
  },
  {
    field: "row-menu",
    headerName: "Actions (menu)",
    width: 70,
    sortable: false,
    filterable: false,
    cellType: "menu",
    getMenuActions: (row) => [
      { id: "open", href: `/sections/learner/${row.id}`, label: "Open profile" },
      { id: "archive", label: "Archive", onClick: () => undefined },
    ],
  },
];

const allColumnTypesColumns: AppDataGridColumn<DemoRow>[] = [
  {
    field: "id",
    headerName: "Text",
    cellType: "text",
    width: 120,
  },
  {
    field: "name",
    headerName: "Custom",
    cellType: "custom",
    minWidth: 180,
    renderCustomCell: (row) => (
      <Chip color={statusColor[row.status]} label={row.name} size="small" />
    ),
  },
  {
    field: "avatar",
    headerName: "Image",
    cellType: "image",
    width: 90,
    getImageSrc: (row) => row.avatar,
  },
  {
    field: "email",
    headerName: "Copyable",
    cellType: "copyable",
    minWidth: 220,
    flex: 1,
  },
  {
    field: "name-link",
    headerName: "Link",
    cellType: "link",
    minWidth: 180,
    getLink: (row) => ({ href: `/sections/learner/${row.id}`, label: row.name }),
  },
  {
    field: "enrolledAt",
    headerName: "Date",
    cellType: "date",
    width: 160,
  },
  {
    field: "dueAt",
    headerName: "DateTime",
    cellType: "dateTime",
    width: 220,
  },
  {
    field: "payload",
    headerName: "JSON",
    cellType: "json",
    minWidth: 220,
    flex: 1,
  },
  createActionMenuColumn<DemoRow>({
    headerName: "Menu",
    getMenuActions: (row) => [
      { id: `open-${row.id}`, label: "Open profile", href: `/sections/learner/${row.id}` },
      { id: `archive-${row.id}`, label: "Archive", onClick: () => undefined },
    ],
    width: 110,
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

const sectionedRowsSeed: SectionedRow[] = [
  {
    id: "module-1",
    rowType: "module",
    moduleId: "module-1",
    title: "Module 1: Flight Principles",
    description: "Core aerodynamic concepts and control surfaces.",
    status: null,
    randomField: null,
  },
  {
    id: "module-1-activity-1",
    rowType: "activity",
    moduleId: "module-1",
    title: "Activity: Lift and Drag",
    description: "Identify lift and drag forces in examples.",
    status: "ready",
    randomField: "12 min",
  },
  {
    id: "module-1-activity-2",
    rowType: "activity",
    moduleId: "module-1",
    title: "Activity: Stable Flight",
    description: "Practice stable flight decisions in simulation.",
    status: "draft",
    randomField: "Simulation",
  },
  {
    id: "module-2",
    rowType: "module",
    moduleId: "module-2",
    title: "Module 2: Safety and Operations",
    description: "Checklist, hazards, and emergency readiness.",
    status: null,
    randomField: null,
  },
  {
    id: "module-2-activity-1",
    rowType: "activity",
    moduleId: "module-2",
    title: "Activity: Pre-Flight Checklist",
    description: "Run the complete pre-flight checklist.",
    status: "ready",
    randomField: "8 min",
  },
  {
    id: "module-2-activity-2",
    rowType: "activity",
    moduleId: "module-2",
    title: "Activity: Incident Scenarios",
    description: "Respond to simulated in-flight incidents.",
    status: "archived",
    randomField: "Case study",
  },
];

const reorderSectionRows = (rows: SectionedRow[], params: AppDataGridRowDragReorderParams<SectionedRow>): SectionedRow[] => {
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

const getVisibleSectionRows = (rows: SectionedRow[], collapsedModuleIds: Set<string>): SectionedRow[] =>
  rows.filter((row) => row.rowType === "module" || !collapsedModuleIds.has(row.moduleId));

const meta = {
  title: "Data Display/AppDataGrid",
  component: AppDataGrid<DemoRow>,
  args: {
    columns: defaultColumns,
    rows: demoRows,
    storageKey: "storybook-app-datagrid",
  },
  decorators: [
    (Story) => (
      <Box sx={{ height: 460 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof AppDataGrid<DemoRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ListOnly: Story = {};

function HeaderSortHookedUpPreview() {
  const [sortRules, setSortRules] = useState<AppDataGridSortRule[]>([{ field: "name", direction: "asc" }]);

  const sortModel = sortRules.reduce<Array<{ field: string; sort: "asc" | "desc" }>>((accumulator, rule) => {
    if (!rule.field || (rule.direction !== "asc" && rule.direction !== "desc")) {
      return accumulator;
    }
    return [...accumulator, { field: rule.field, sort: rule.direction }];
  }, []);

  const sortedRows = useMemo(() => {
    const resolvedSort = sortRules[0];
    if (!resolvedSort?.field || (resolvedSort.direction !== "asc" && resolvedSort.direction !== "desc")) {
      return demoRows;
    }

    const direction = resolvedSort.direction === "desc" ? -1 : 1;
    return [...demoRows].sort((left, right) => {
      if (resolvedSort.field === "status") {
        return left.status.localeCompare(right.status) * direction;
      }
      if (resolvedSort.field === "id") {
        return left.id.localeCompare(right.id) * direction;
      }
      return left.name.localeCompare(right.name) * direction;
    });
  }, [sortRules]);

  return (
    <AppDataGrid
      columns={defaultColumns}
      onSortRulesChange={setSortRules}
      rows={sortedRows}
      sortModel={sortModel}
      sortRules={sortRules}
      storageKey="storybook-app-datagrid-header-sort-hooked"
    />
  );
}

export const HeaderSortHookedUp: Story = {
  render: () => <HeaderSortHookedUpPreview />,
};

export const StructuredCellTypes: Story = {
  args: {
    columns: structuredColumns,
    storageKey: "storybook-app-datagrid-cell-types",
  },
};

export const AllColumnTypes: Story = {
  args: {
    columns: allColumnTypesColumns,
    storageKey: "storybook-app-datagrid-all-column-types",
  },
};

function BuiltInCheckboxSelectionPreview() {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set(["row-1"]));

  return (
    <AppDataGrid
      columns={defaultColumns}
      rows={demoRows}
      selection={{
        selectedRowIds,
        onSelectedRowIdsChange: setSelectedRowIds,
      }}
      storageKey="storybook-app-datagrid-selection"
      sx={{
        "& .selection-header, & .selection-cell": {
          justifyContent: "flex-start",
          pl: 0.75,
          pr: 0,
        },
      }}
    />
  );
}

export const BuiltInCheckboxSelection: Story = {
  render: () => <BuiltInCheckboxSelectionPreview />,
};

function BuiltInRowDragPreview() {
  const [rows, setRows] = useState<DemoRow[]>(demoRows);

  return (
    <AppDataGrid
      columns={defaultColumns}
      rows={rows}
      rowDrag={{
        onReorder: (params) => {
          setRows((currentRows) => reorderRows(currentRows, params));
        },
        getRowLabel: (row) => row.name,
      }}
      storageKey="storybook-app-datagrid-row-drag"
    />
  );
}

export const BuiltInRowDragHandle: Story = {
  render: () => <BuiltInRowDragPreview />,
};

function BuiltInCheckboxAndRowDragPreview() {
  const [rows, setRows] = useState<DemoRow[]>(demoRows);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set(["row-1"]));

  return (
    <AppDataGrid
      columns={defaultColumns}
      rows={rows}
      rowDrag={{
        onReorder: (params) => {
          setRows((currentRows) => reorderRows(currentRows, params));
        },
        getRowLabel: (row) => row.name,
      }}
      selection={{
        selectedRowIds,
        onSelectedRowIdsChange: setSelectedRowIds,
      }}
      storageKey="storybook-app-datagrid-selection-row-drag"
      sx={{
        "& .selection-header, & .selection-cell": {
          justifyContent: "flex-start",
          pl: 0.75,
          pr: 0,
        },
      }}
    />
  );
}

export const BuiltInCheckboxAndRowDragHandle: Story = {
  render: () => <BuiltInCheckboxAndRowDragPreview />,
};

function SectionedDropdownRowsPreview() {
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(new Set());

  const columns = useMemo<AppDataGridColumn<SectionedRow>[]>(() => [
    {
      field: "title",
      headerName: "Module / Activity",
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
            title={row.title}
            titleVariant="h6"
          />
        ) : (
          <Box sx={{ pl: 5 }}>{row.title}</Box>
        )
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 260,
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
          : <Chip color={row.status === "ready" ? "success" : row.status === "draft" ? "warning" : "default"} label={row.status} size="small" />,
    },
    {
      field: "randomField",
      headerName: "Random Field",
      width: 150,
      cellType: "custom",
      renderCustomCell: (row) => (row.rowType === "module" ? null : row.randomField),
    },
    createActionMenuColumn<SectionedRow>({
      headerName: "Actions",
      width: 120,
      getMenuActions: (row) =>
        row.rowType === "module"
          ? [{ id: `open-module-${row.id}`, label: "Open module", href: `/content-library/modules/${row.moduleId}` }]
          : [{ id: `open-activity-${row.id}`, label: "Open activity", href: `/content-library/activities/${row.id}` }],
    }),
  ], [collapsedModuleIds]);

  return (
    <AppDataGrid
      columns={columns}
      getRowClassName={(params) => (params.row.rowType === "module" ? "app-grid-row-subheader" : "")}
      hideFooter
      rows={getVisibleSectionRows(sectionedRowsSeed, collapsedModuleIds)}
      storageKey="storybook-app-datagrid-sectioned-rows"
    />
  );
}

export const SectionedDropdownRows: Story = {
  render: () => <SectionedDropdownRowsPreview />,
};

function SectionedDropdownRowsWithCheckboxAndDragPreview() {
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<SectionedRow[]>(sectionedRowsSeed);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const visibleRows = useMemo(
    () => getVisibleSectionRows(rows, collapsedModuleIds),
    [rows, collapsedModuleIds],
  );

  const columns = useMemo<AppDataGridColumn<SectionedRow>[]>(() => [
    {
      field: "title",
      headerName: "Module / Activity",
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
            title={row.title}
            titleVariant="h6"
          />
        ) : (
          <Box sx={{ pl: 5 }}>{row.title}</Box>
        )
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 260,
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
          : <Chip color={row.status === "ready" ? "success" : row.status === "draft" ? "warning" : "default"} label={row.status} size="small" />,
    },
    {
      field: "randomField",
      headerName: "Random Field",
      width: 150,
      cellType: "custom",
      renderCustomCell: (row) => (row.rowType === "module" ? null : row.randomField),
    },
    createActionMenuColumn<SectionedRow>({
      headerName: "Actions",
      width: 120,
      getMenuActions: (row) =>
        row.rowType === "module"
          ? [{ id: `open-module-${row.id}`, label: "Open module", href: `/content-library/modules/${row.moduleId}` }]
          : [{ id: `open-activity-${row.id}`, label: "Open activity", href: `/content-library/activities/${row.id}` }],
    }),
  ], [collapsedModuleIds]);

  return (
    <AppDataGrid
      columns={columns}
      getRowClassName={(params) => (params.row.rowType === "module" ? "app-grid-row-subheader" : "")}
      hideFooter
      rowDrag={{
        getRowLabel: (row) => row.title,
        isRowDraggable: (row) => row.rowType === "activity",
        onReorder: (params) => {
          setRows((current) => reorderSectionRows(current, params));
        },
      }}
      rows={visibleRows}
      selection={{
        onSelectedRowIdsChange: setSelectedRowIds,
        selectedRowIds,
      }}
      storageKey="storybook-app-datagrid-sectioned-rows-checkbox-drag"
      sx={{
        "& .selection-header, & .selection-cell": {
          justifyContent: "flex-start",
          pl: 0.75,
          pr: 0,
        },
      }}
    />
  );
}

export const SectionedDropdownRowsWithCheckboxAndDrag: Story = {
  render: () => <SectionedDropdownRowsWithCheckboxAndDragPreview />,
};
