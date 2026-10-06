"use client";

import Link from "../../adapters/Link";
import { useCallback, useMemo } from "react";
import type { GridColumnVisibilityModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import MuiLink from "@mui/material/Link";
import type { LearnerClass } from "../../models";
import { useTranslation } from "../../i18n";
import type { DataGridInteractionMode } from "../DataToolbar";
import { AppDataGrid, createActionMenuColumn } from "../AppDataGrid";
import { formatDueDateLabel } from "../LearnerClassCard";
import type { AppDataGridColumn, AppDataGridSortRule } from "../AppDataGrid/types";

type LearnerClassesDataGridProps = {
  rows: LearnerClass[];
  storageKey: string;
  mode?: DataGridInteractionMode;
  columnVisibilityModel?: GridColumnVisibilityModel;
  sortModel?: GridSortModel;
  paginationMode?: "client" | "server";
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  rowCount?: number;
  sortRules?: AppDataGridSortRule[];
  onSortRulesChange?: (nextRules: AppDataGridSortRule[]) => void;
};

const buildLearnerLaunchHref = (row: LearnerClass): string =>
  `/content-library/activities/${encodeURIComponent(row.nextActivityId?.trim() || row.id)}/launch`;

const buildColumns = (
  tr: (key: string, defaultMessage: string, values?: Record<string, string | number>) => string,
  locale: string,
): AppDataGridColumn<LearnerClass>[] => [
  {
    field: "id",
    headerName: tr("table.columns.classId", "Section ID"),
    headerClassName: "dg-first-col",
    cellClassName: "dg-first-col",
    width: 120,
  },
  {
    field: "courseName",
    headerName: tr("table.columns.name", "Name"),
    cellType: "custom",
    flex: 1,
    minWidth: 230,
    renderCustomCell: (row) => (
      <MuiLink component={Link} href={`/sections/${row.id}/learner/me`} sx={{ color: "primary.main", fontWeight: 500, textDecoration: "none" }}>
        {row.courseName}
      </MuiLink>
    ),
  },
  {
    field: "siteName",
    headerName: tr("table.columns.site", "Site"),
    flex: 1,
    minWidth: 220,
  },
  {
    field: "dueAt",
    headerName: tr("table.columns.due", "Due"),
    flex: 1,
    minWidth: 220,
    valueFormatter: (value) => formatDueDateLabel(String(value), undefined, { locale, t: tr }),
  },
  createActionMenuColumn<LearnerClass>({
    headerName: tr("table.columns.actions", "Actions"),
    getMenuActions: (row) => [
      { id: `details-${row.id}`, href: `/sections/${row.id}/learner/me`, label: tr("table.actions.details", "Details") },
      {
        id: `continue-${row.id}`,
        href: buildLearnerLaunchHref(row),
        label: tr("table.actions.continue", "Continue"),
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ],
    width: 160,
  }),
];

export const learnerClassesColumnOptions = [
  { id: "siteName", label: "Site" },
  { id: "dueAt", label: "Due" },
  { id: "actions", label: "Actions" },
] as const;

export const learnerClassesSortOptions = [
  { id: "id", label: "Section ID" },
  { id: "courseName", label: "Name" },
  { id: "siteName", label: "Site" },
  { id: "dueAt", label: "Due" },
] as const;

export function LearnerClassesDataGrid({
  rows,
  storageKey,
  mode = "client",
  columnVisibilityModel,
  sortModel,
  paginationMode,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions,
  rowCount,
  sortRules,
  onSortRulesChange,
}: LearnerClassesDataGridProps) {
  const { locale, t, useNamespace } = useTranslation();
  useNamespace("sections.learner");
  const tr = useCallback(
    (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
      t(key, { defaultMessage, namespace: "sections.learner", values }),
    [t],
  );
  const columns = useMemo(() => buildColumns(tr, locale), [locale, tr]);

  return (
    <AppDataGrid
      columnVisibilityModel={columnVisibilityModel}
      columns={columns}
      mode={mode}
      paginationMode={paginationMode}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={pageSizeOptions}
      onSortRulesChange={onSortRulesChange}
      rowCount={rowCount}
      rows={rows}
      sortModel={sortModel}
      sortRules={sortRules}
      storageKey={storageKey}
      sx={{
        "& .dg-first-col": {
          pl: 3,
        },
        "& .dg-last-col": {
          pr: 3,
        },
      }}
    />
  );
}
