import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { DataToolbarSelectionMenu } from "./components/DataToolbarSelectionMenu";
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

/** Host fixture: requests are observable; the host deliberately rejects view changes. */
export function NativeCompositionPreview({ rtl = false }: { rtl?: boolean }) {
  const [count, setCount] = useState(2);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [options, setOptions] = useState([
    { id: "course", label: "Course", visible: true, locked: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true, locked: true },
  ]);
  const record = (event: string) => setEvents(previous => [...previous, event]);
  const selection = <DataToolbarSelectionMenu
    options={[{ id: "page", label: "Select current page" }, { id: "none", label: "Clear selection" }]}
    selectionState={count === 0 ? "none" : count === 5 ? "all" : "some"}
    onToggleSelection={() => { record("toggle"); setCount(count === 5 ? 0 : 5); }}
    onSelectOption={id => { record(`selection:${id}`); setCount(id === "page" ? 5 : 0); }} />;
  return <Provider dir={rtl ? "rtl" : "ltr"}>
    <form aria-label="Toolbar host" onSubmit={event => { event.preventDefault(); record("submit"); }}>
      <DataToolbar aria-label="Native course toolbar" selectedCount={count}
        leftContent={selection} leftContentWhenSelected={count > 0 ? selection : undefined}
        showRefreshButton={false} showSortButton={false} showFilterButton={false}
        searchValue={search} onSearchValueChange={value => { record(`search:${value}`); setSearch(value); }}
        viewMode="cards" onViewModeChange={value => record(`view:${value}`)}
        columnOptions={options} onColumnOptionsChange={next => {
          record(`columns:${next.filter(option => option.visible).map(option => option.id).join(",")}`);
          setOptions(next);
        }} />
      <output aria-label="Host callbacks">{JSON.stringify(events)}</output>
      <output aria-label="Host search">{JSON.stringify(search)}</output>
      <output aria-label="Visible host columns">{options.filter(option => option.visible).map(option => option.id).join(",")}</output>
    </form>
  </Provider>;
}

export const NativeComposition: Story = { render: () => <NativeCompositionPreview /> };
export const NativeCompositionRtl: Story = { render: () => <NativeCompositionPreview rtl /> };
