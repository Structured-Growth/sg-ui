import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../experimental/Provider/Provider";
import { useTranslation } from "../i18n";
import { DataToolbar, type DataToolbarFilterRule, type DataToolbarSortRule } from "./DataToolbar";
import { createAdminCourseGridOptions } from "./AdminDataGridOptions";
import { createInstructorCourseLearnersGridOptions } from "./InstructorDataGridOptions";

const meta = { title: "Data Display/Catalog grid presets", component: DataToolbar } satisfies Meta<typeof DataToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

function PresetToolbar({ learners = false }: { learners?: boolean }) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const preset = learners ? createInstructorCourseLearnersGridOptions(t) : createAdminCourseGridOptions(t);
  const [columns, setColumns] = useState(preset.columnOptions);
  const [sortRules, setSortRules] = useState<DataToolbarSortRule[]>(preset.defaultSortRules);
  const [filterRules, setFilterRules] = useState<DataToolbarFilterRule[]>(preset.defaultFilterRules);
  // Column state belongs to this view; localized labels follow the current host translator.
  const localizedColumns = columns.map(column => ({ ...column, label: preset.columnOptions.find(option => option.id === column.id)?.label ?? column.label }));
  return <Provider><DataToolbar showViewModeToggle={false} onRefresh={() => {}}
    columnOptions={localizedColumns} onColumnOptionsChange={setColumns}
    sortOptions={preset.sortOptions} sortRules={sortRules} onSortRulesChange={setSortRules}
    filterFields={preset.filterFields} filterRules={filterRules} onFilterRulesChange={setFilterRules} />
    <output aria-label="Preset state">{JSON.stringify({ columns: columns.filter(column => column.visible).map(column => column.id), sortRules, filterRules })}</output>
  </Provider>;
}
export const AdminCourses: Story = { render: () => <PresetToolbar /> };
export const InstructorCourseLearners: Story = { render: () => <PresetToolbar learners /> };
