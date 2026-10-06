import type { DataToolbarFilterField } from "./DataToolbar";

export const adminClassesColumnOptions = [
  { id: "className", label: "Section Name" },
  { id: "siteName", label: "Site" },
  { id: "learnerCount", label: "Learners" },
  { id: "leadInstructor", label: "Lead Instructor" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Action" },
] as const;

export const adminClassesSortOptions = [
  { id: "className", label: "Section Name" },
  { id: "siteName", label: "Site" },
  { id: "learnerCount", label: "Learners" },
  { id: "leadInstructor", label: "Lead Instructor" },
  { id: "status", label: "Status" },
] as const;

export const adminClassesFilterFields: DataToolbarFilterField[] = [
  { id: "className", label: "Section Name", type: "string" },
  { id: "siteName", label: "Site", type: "string" },
  { id: "learnerCount", label: "Learners", type: "number" },
  { id: "leadInstructor", label: "Lead Instructor", type: "string" },
  {
    id: "status",
    label: "Status",
    type: "enum",
    enumOptions: [
      { id: "active", label: "Active" },
      { id: "planned", label: "Planned" },
      { id: "archived", label: "Archived" },
    ],
  },
];

export const adminPeopleColumnOptions = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "learners", label: "Site Memberships" },
  { id: "actions", label: "Action" },
] as const;

export const adminPeopleSortOptions = [
  { id: "name", label: "Name" },
] as const;
