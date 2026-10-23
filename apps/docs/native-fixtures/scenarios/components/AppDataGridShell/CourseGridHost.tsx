"use client";

import { useCallback, useMemo } from "react";
import type { LearnerCourse } from "@structured-growth/sg-ui";
import { useTranslation } from "@structured-growth/sg-ui/i18n";
import { createActionMenuColumn } from "@structured-growth/sg-ui/components";
import { AppDataGridShell } from "@structured-growth/sg-ui/components";
import { formatDueDateLabel } from "@structured-growth/sg-ui/components/LearnerCourseCard";
import type { AppDataGridColumn } from "@structured-growth/sg-ui/components";

export type CourseGridHostProps = Omit<import("@structured-growth/sg-ui/components").AppDataGridShellProps<LearnerCourse>, "columns" | "label" | "getRowLabel"> & {
  label?: string;
  getRowLabel?: (row: LearnerCourse) => string;
};

const buildLearnerLaunchHref = (row: LearnerCourse): string =>
  `/content-library/activities/${encodeURIComponent(row.nextActivityId?.trim() || row.id)}/launch`;
const buildLearnerDetailsHref = (row: LearnerCourse): string =>
  `/sections/${encodeURIComponent(row.id)}/learner/me`;

const buildColumns = (
  tr: (key: string, defaultMessage: string, values?: Record<string, string | number>) => string,
  locale: string,
): AppDataGridColumn<LearnerCourse>[] => [
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
    getLink: row => ({ href: buildLearnerDetailsHref(row) }),
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
  createActionMenuColumn<LearnerCourse>({
    headerName: tr("table.columns.actions", "Actions"),
    getMenuActions: (row) => [
      { id: `details-${row.id}`, href: buildLearnerDetailsHref(row), label: tr("table.actions.details", "Details") },
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

export function CourseGridHost({ label, getRowLabel = row => row.courseName, ...props }: CourseGridHostProps) {
  const { locale, t, useNamespace } = useTranslation();
  useNamespace("sections.learner");
  const tr = useCallback(
    (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
      t(key, { defaultMessage, namespace: "sections.learner", values }),
    [t],
  );
  const columns = useMemo(() => buildColumns(tr, locale), [locale, tr]);
  return <AppDataGridShell toolbar={{ show: false }} {...props} columns={columns} getRowLabel={getRowLabel}
    label={label ?? tr("table.label", "Courses")} />;
}
