import type { DataToolbarFilterField } from "./DataToolbar";

export const instructorClassesColumnOptions = [
  { id: "className", label: "Section Name" },
  { id: "siteName", label: "Site" },
  { id: "status", label: "Status" },
  { id: "learnerCount", label: "Learners" },
  { id: "lastLearnerActivityLabel", label: "Last Learner Activity" },
  { id: "actions", label: "Action" },
] as const;

export const instructorClassesSortOptions = [
  { id: "className", label: "Section Name" },
  { id: "siteName", label: "Site" },
  { id: "status", label: "Status" },
  { id: "learnerCount", label: "Learners" },
  { id: "lastLearnerActivityLabel", label: "Last Learner Activity" },
] as const;

export const instructorClassesFilterFields: DataToolbarFilterField[] = [
  { id: "className", label: "Section Name", type: "string" },
  { id: "siteName", label: "Site", type: "string" },
  {
    enumOptions: [
      { id: "active", label: "Active" },
      { id: "draft", label: "Draft" },
      { id: "closed", label: "Closed" },
      { id: "archived", label: "Archived" },
    ],
    id: "status",
    label: "Status",
    type: "enum",
  },
  { id: "learnerCount", label: "Learners", type: "number" },
  { id: "lastLearnerActivityLabel", label: "Last Learner Activity", type: "string" },
];

export const instructorClassLearnersColumnOptions = [
  { id: "name", label: "Learner" },
  { id: "status", label: "Status" },
  { id: "lastActivityLabel", label: "Last Activity" },
  { id: "averageProgressPercent", label: "Progress" },
  { id: "actions", label: "Action" },
] as const;

export const instructorClassLearnersSortOptions = [
  { id: "name", label: "Learner" },
  { id: "status", label: "Status" },
  { id: "lastActivityLabel", label: "Last Activity" },
  { id: "averageProgressPercent", label: "Progress" },
] as const;

export const instructorClassLearnersFilterFields: DataToolbarFilterField[] = [
  { id: "name", label: "Learner", type: "string" },
  {
    enumOptions: [
      { id: "active", label: "Active" },
      { id: "not_started", label: "Not Started" },
      { id: "in_progress", label: "In Progress" },
      { id: "submitted", label: "Submitted" },
      { id: "completed", label: "Completed" },
      { id: "excused", label: "Excused" },
      { id: "inactive", label: "Inactive" },
      { id: "invited", label: "Invited" },
    ],
    id: "status",
    label: "Status",
    type: "enum",
  },
  { id: "lastActivityLabel", label: "Last Activity", type: "string" },
  { id: "averageProgressPercent", label: "Progress", type: "number" },
];
