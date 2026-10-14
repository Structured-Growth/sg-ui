import type { SGTranslationAdapter } from "../i18n";
import type { DataToolbarColumnOption, DataToolbarFilterField, DataToolbarFilterRule, DataToolbarSortOption, DataToolbarSortRule } from "./DataToolbar";

export const instructorCourseStatuses = Object.freeze([
  Object.freeze({ id: "active", defaultMessage: "Active" }),
  Object.freeze({ id: "draft", defaultMessage: "Draft" }),
  Object.freeze({ id: "closed", defaultMessage: "Closed" }),
  Object.freeze({ id: "archived", defaultMessage: "Archived" }),
] as const);

export const instructorCourseLearnerStatuses = Object.freeze([
  Object.freeze({ id: "active", defaultMessage: "Active" }),
  Object.freeze({ id: "not_started", defaultMessage: "Not Started" }),
  Object.freeze({ id: "in_progress", defaultMessage: "In Progress" }),
  Object.freeze({ id: "submitted", defaultMessage: "Submitted" }),
  Object.freeze({ id: "completed", defaultMessage: "Completed" }),
  Object.freeze({ id: "excused", defaultMessage: "Excused" }),
  Object.freeze({ id: "inactive", defaultMessage: "Inactive" }),
  Object.freeze({ id: "invited", defaultMessage: "Invited" }),
] as const);

/** Fresh host-owned defaults. Recreate with the host translator when its locale changes. */
export function createInstructorCourseGridOptions(t?: SGTranslationAdapter["t"]) {
  const label = (key: string, defaultMessage: string) =>
    t?.(`common.ui.grid.${key}`, { defaultMessage, namespace: "common.ui" }) ?? defaultMessage;
  const columnOptions: DataToolbarColumnOption[] = [
    { id: "className", label: label("sectionName", "Section Name"), visible: true, locked: true },
    { id: "siteName", label: label("site", "Site"), visible: true },
    { id: "status", label: label("status", "Status"), visible: true },
    { id: "learnerCount", label: label("learners", "Learners"), visible: true },
    { id: "lastLearnerActivityLabel", label: label("lastLearnerActivity", "Last Learner Activity"), visible: true },
    { id: "actions", label: label("action", "Action"), visible: true, locked: true },
  ];
  const sortOptions: DataToolbarSortOption[] = columnOptions.filter(option => option.id !== "actions").map(({ id, label }) => ({ id, label }));
  const filterFields: DataToolbarFilterField[] = [
    { id: "className", label: label("sectionName", "Section Name"), type: "string" },
    { id: "siteName", label: label("site", "Site"), type: "string" },
    { id: "status", label: label("status", "Status"), type: "enum", enumOptions: instructorCourseStatuses.map(status => ({ id: status.id, label: label(`status.${status.id}`, status.defaultMessage) })) },
    { id: "learnerCount", label: label("learners", "Learners"), type: "number" },
    { id: "lastLearnerActivityLabel", label: label("lastLearnerActivity", "Last Learner Activity"), type: "string" },
  ];
  return {
    columnOptions, sortOptions, filterFields,
    defaultSortRules: [] as DataToolbarSortRule[],
    defaultFilterRules: [] as DataToolbarFilterRule[],
  };
}

/** Fresh host-owned defaults. Recreate with the host translator when its locale changes. */
export function createInstructorCourseLearnersGridOptions(t?: SGTranslationAdapter["t"]) {
  const label = (key: string, defaultMessage: string) =>
    t?.(`common.ui.grid.${key}`, { defaultMessage, namespace: "common.ui" }) ?? defaultMessage;
  const columnOptions: DataToolbarColumnOption[] = [
    { id: "name", label: label("learner", "Learner"), visible: true, locked: true },
    { id: "status", label: label("status", "Status"), visible: true },
    { id: "lastActivityLabel", label: label("lastActivity", "Last Activity"), visible: true },
    { id: "averageProgressPercent", label: label("progress", "Progress"), visible: true },
    { id: "actions", label: label("action", "Action"), visible: true, locked: true },
  ];
  const sortOptions: DataToolbarSortOption[] = columnOptions.filter(option => option.id !== "actions").map(({ id, label }) => ({ id, label }));
  const filterFields: DataToolbarFilterField[] = [
    { id: "name", label: label("learner", "Learner"), type: "string" },
    { id: "status", label: label("status", "Status"), type: "enum", enumOptions: instructorCourseLearnerStatuses.map(status => ({ id: status.id, label: label(`status.${status.id}`, status.defaultMessage) })) },
    { id: "lastActivityLabel", label: label("lastActivity", "Last Activity"), type: "string" },
    { id: "averageProgressPercent", label: label("progress", "Progress"), type: "number" },
  ];
  return {
    columnOptions, sortOptions, filterFields,
    defaultSortRules: [] as DataToolbarSortRule[],
    defaultFilterRules: [] as DataToolbarFilterRule[],
  };
}

const courseDefaults = createInstructorCourseGridOptions();
const learnerDefaults = createInstructorCourseLearnersGridOptions();
/** English compatibility exports; use the factories for localized, per-view state. */
export const instructorClassesColumnOptions = courseDefaults.columnOptions;
export const instructorClassesSortOptions = courseDefaults.sortOptions;
export const instructorClassesFilterFields = courseDefaults.filterFields;
export const instructorClassLearnersColumnOptions = learnerDefaults.columnOptions;
export const instructorClassLearnersSortOptions = learnerDefaults.sortOptions;
export const instructorClassLearnersFilterFields = learnerDefaults.filterFields;
