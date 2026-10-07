"use client";

import { useCallback, useMemo } from "react";
import type { LearnerClass } from "../../models";
import { useTranslation } from "../../i18n";
import { AppDataGrid, createActionMenuColumn } from "../AppDataGrid";
import { formatDueDateLabel } from "../LearnerClassCard";
import type { AppDataGridColumn } from "../AppDataGrid/types";

export type LearnerClassesDataGridProps = Omit<import("../AppDataGrid").AppDataGridProps<LearnerClass>, "columns" | "label" | "getRowLabel"> & {
  label?: string;
  getRowLabel?: (row: LearnerClass) => string;
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
    width: 120,
  },
  {
    field: "courseName",
    headerName: tr("table.columns.name", "Name"),
    cellType: "link",
    flex: 1,
    minWidth: 230,
    getLink: row => ({ href: `/sections/${row.id}/learner/me` }),
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
    formatValue: (value) => formatDueDateLabel(String(value), undefined, { locale, t: tr }),
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

export function LearnerClassesDataGrid({ label, getRowLabel = row => row.courseName, ...props }: LearnerClassesDataGridProps) {
  const { locale, t, useNamespace } = useTranslation();
  useNamespace("sections.learner");
  const tr = useCallback(
    (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
      t(key, { defaultMessage, namespace: "sections.learner", values }),
    [t],
  );
  const columns = useMemo(() => buildColumns(tr, locale), [locale, tr]);
  return <AppDataGrid {...props} columns={columns} getRowLabel={getRowLabel}
    label={label ?? tr("table.label", "Courses")} />;
}
