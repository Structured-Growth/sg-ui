// T-C19-05: source-resolved consumption of the three declared public entry routes.
import { LearnerClassesDataGrid as RootGrid, Provider,
  type LearnerClass, type LearnerClassesDataGridProps as RootProps } from "@structured-growth/sg-ui";
import { LearnerClassesDataGrid as CatalogGrid,
  type LearnerClassesDataGridProps as CatalogProps } from "@structured-growth/sg-ui/components";
import { LearnerClassesDataGrid as GranularGrid,
  type LearnerClassesDataGridProps as GranularProps } from "@structured-growth/sg-ui/components/LearnerClassesDataGrid";

const learner: LearnerClass = {
  id: "course-one", courseName: "Science", instructorName: "Author", siteName: "Campus",
  progressPercent: 40, nextActivity: "Read", dueAt: "2026-10-10",
};

export const granularProps: GranularProps = {
  rows: [learner], label: "Courses", getRowLabel: row => row.courseName,
  showResetView: true,
  onResetView: state => {
    const page: number = state.paginationModel.page;
    const selection: ReadonlySet<string> = state.selectedRowIds;
    void page;
    void selection;
  },
};
export const rootProps: RootProps = granularProps;
export const catalogProps: CatalogProps = rootProps;
export const roundTripProps: GranularProps = catalogProps;

// Each component must accept the public exported props in a consuming JSX context.
export function PublicLearnerGridConsumer() {
  return <Provider>
    <RootGrid {...rootProps} />
    <CatalogGrid {...catalogProps} />
    <GranularGrid {...roundTripProps} />
  </Provider>;
}
