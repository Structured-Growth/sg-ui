import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { SplitAction } from "../../experimental/SplitAction/SplitAction";
import {
  DataToolbar,
  type DataToolbarFilterRule,
  type DataToolbarSortRule,
} from "./DataToolbar";

const meta = {
  title: "Data Display/DataToolbar",
  component: DataToolbar,
  tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
} satisfies Meta<typeof DataToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function TableOnlyPreview() {
  const [options, setOptions] = useState([
    { id: "id", label: "ID", visible: true },
    { id: "organization", label: "Organization Title", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "createdAt", label: "Created at", visible: true },
    { id: "onboarding", label: "Onboarding completed", visible: false },
  ]);
  const [sortRules, setSortRules] = useState<DataToolbarSortRule[]>([{ field: "id", direction: "asc" }]);
  const [filterRules, setFilterRules] = useState<DataToolbarFilterRule[]>([
    { field: "id", operator: "equals", value: "73" },
    { field: "status", operator: "is", value: "active" },
  ]);
  const sortOptions = [
    { id: "id", label: "ID" },
    { id: "organization", label: "Organization Title" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created at" },
  ];
  const filterFields = [
    { id: "id", label: "ID", type: "number" as const },
    { id: "organization", label: "Organization Title", type: "string" as const },
    {
      id: "status",
      label: "Status",
      type: "enum" as const,
      enumOptions: [
        { id: "active", label: "active" },
        { id: "inactive", label: "inactive" },
        { id: "archived", label: "archived" },
      ],
    },
    { id: "createdAt", label: "Created at", type: "date" as const },
  ];

  return (
    <div>
      <DataToolbar
        leftContent={<SplitAction label="New course" items={[{id:"import",label:"Import courses"}]} onPress={() => {}} onAction={() => {}} />}
        onRefresh={() => {}}
        columnOptions={options}
        onColumnOptionsChange={setOptions}
        onFilterRulesChange={setFilterRules}
        onSortRulesChange={setSortRules}
        showViewModeToggle={false}
        filterFields={filterFields}
        filterRules={filterRules}
        sortOptions={sortOptions}
        sortRules={sortRules}
      />
    </div>
  );
}

export const ConfiguredToolbar: Story = {
  render: () => <TableOnlyPreview />,
};

export const SelectedCards: Story = { args: { selectedCount: 3, leftContentWhenSelected: "Selected course actions", viewMode: "cards", onViewModeChange: () => {}, onRefresh: () => {} } };
export const DarkToolbar: Story = { render: () => <Provider theme="dark"><TableOnlyPreview /></Provider> };
