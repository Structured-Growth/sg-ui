import type { SGTranslationAdapter } from "../i18n";
import type { DataToolbarColumnOption, DataToolbarFilterField, DataToolbarFilterRule, DataToolbarSortOption, DataToolbarSortRule } from "./DataToolbar";

export const adminCourseStatuses = Object.freeze([
  Object.freeze({ id: "active", defaultMessage: "Active" }),
  Object.freeze({ id: "planned", defaultMessage: "Planned" }),
  Object.freeze({ id: "archived", defaultMessage: "Archived" }),
] as const);

/** Fresh host-owned defaults. Recreate with the host translator when its locale changes. */
export function createAdminCourseGridOptions(t?: SGTranslationAdapter["t"]) {
  const label = (key: string, defaultMessage: string) =>
    t?.(`common.ui.grid.${key}`, { defaultMessage, namespace: "common.ui" }) ?? defaultMessage;
  const columnOptions: DataToolbarColumnOption[] = [
    { id: "className", label: label("sectionName", "Section Name"), visible: true, locked: true },
    { id: "siteName", label: label("site", "Site"), visible: true },
    { id: "learnerCount", label: label("learners", "Learners"), visible: true },
    { id: "leadInstructor", label: label("leadInstructor", "Lead Instructor"), visible: true },
    { id: "status", label: label("status", "Status"), visible: true },
    { id: "actions", label: label("action", "Action"), visible: true, locked: true },
  ];
  const sortOptions: DataToolbarSortOption[] = columnOptions.filter(option => option.id !== "actions").map(({ id, label }) => ({ id, label }));
  const filterFields: DataToolbarFilterField[] = [
    { id: "className", label: label("sectionName", "Section Name"), type: "string" },
    { id: "siteName", label: label("site", "Site"), type: "string" },
    { id: "learnerCount", label: label("learners", "Learners"), type: "number" },
    { id: "leadInstructor", label: label("leadInstructor", "Lead Instructor"), type: "string" },
    { id: "status", label: label("status", "Status"), type: "enum", enumOptions: adminCourseStatuses.map(status => ({ id: status.id, label: label(`status.${status.id}`, status.defaultMessage) })) },
  ];
  return {
    columnOptions, sortOptions, filterFields,
    defaultSortRules: [] as DataToolbarSortRule[],
    defaultFilterRules: [] as DataToolbarFilterRule[],
  };
}

/** Fresh host-owned defaults. Recreate with the host translator when its locale changes. */
export function createAdminPeopleGridOptions(t?: SGTranslationAdapter["t"]) {
  const label = (key: string, defaultMessage: string) =>
    t?.(`common.ui.grid.${key}`, { defaultMessage, namespace: "common.ui" }) ?? defaultMessage;
  const columnOptions: DataToolbarColumnOption[] = [
    { id: "name", label: label("name", "Name"), visible: true, locked: true },
    { id: "status", label: label("status", "Status"), visible: true },
    { id: "learners", label: label("siteMemberships", "Site Memberships"), visible: true },
    { id: "actions", label: label("action", "Action"), visible: true, locked: true },
  ];
  const sortOptions: DataToolbarSortOption[] = columnOptions.filter(option => option.id === "name").map(({ id, label }) => ({ id, label }));
  const filterFields: DataToolbarFilterField[] = [

  ];
  return {
    columnOptions, sortOptions, filterFields,
    defaultSortRules: [] as DataToolbarSortRule[],
    defaultFilterRules: [] as DataToolbarFilterRule[],
  };
}

const courseDefaults = createAdminCourseGridOptions();
const peopleDefaults = createAdminPeopleGridOptions();
/** English compatibility exports; use the factories for localized, per-view state. */
export const adminClassesColumnOptions = courseDefaults.columnOptions;
export const adminClassesSortOptions = courseDefaults.sortOptions;
export const adminClassesFilterFields = courseDefaults.filterFields;
export const adminPeopleColumnOptions = peopleDefaults.columnOptions;
export const adminPeopleSortOptions = peopleDefaults.sortOptions;
