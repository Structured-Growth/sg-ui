// T-C19-05: source-resolved consumption of the three declared public entry routes.
import { AppDataGridShell as RootGrid, Provider,
  type LearnerCourse, type AppDataGridShellProps as RootProps } from "@structured-growth/sg-ui";
import { AppDataGridShell as CatalogGrid,
  type AppDataGridShellProps as CatalogProps } from "@structured-growth/sg-ui/components";
import { AppDataGridShell as GranularGrid,
  type AppDataGridShellProps as GranularProps } from "@structured-growth/sg-ui/components/AppDataGridShell";

const learner: LearnerCourse = {
  id: "course-one", courseName: "Science", instructorName: "Author", siteName: "Campus",
  progressPercent: 40, nextActivity: "Read", dueAt: "2026-10-10",
};

export const granularProps: GranularProps<LearnerCourse> = {
  rows: [learner], columns: [{ field: "courseName", headerName: "Course", flex: 1 }], label: "Courses", getRowLabel: row => row.courseName,
  showResetView: true,
  onResetView: state => {
    const page: number = state.paginationModel.page;
    const selection: ReadonlySet<string> = state.selectedRowIds;
    void page;
    void selection;
  },
};
export const rootProps: RootProps<LearnerCourse> = granularProps;
export const catalogProps: CatalogProps<LearnerCourse> = rootProps;
export const roundTripProps: GranularProps<LearnerCourse> = catalogProps;

// Each component must accept the public exported props in a consuming JSX context.
export function PublicLearnerGridConsumer() {
  return <Provider>
    <RootGrid {...rootProps} />
    <CatalogGrid {...catalogProps} />
    <GranularGrid {...roundTripProps} />
  </Provider>;
}
