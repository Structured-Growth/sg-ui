import { beforeEach, describe, expect, it, vi } from "vitest";

const useNamespace = vi.fn();
const formatDueDateLabel = vi.fn(() => "Due soon");

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useCallback: <T,>(fn: T) => fn,
    useMemo: <T,>(fn: () => T) => fn(),
  };
});

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
    useNamespace,
  }),
}));

vi.mock("../LearnerClassCard", () => ({
  formatDueDateLabel,
}));

vi.mock("../AppDataGrid", () => ({
  AppDataGrid: (props: unknown) => ({ type: "AppDataGrid", props }),
  createActionMenuColumn: (options: any) => ({
    cellClassName: "dg-last-col",
    cellType: "menu",
    field: "actions",
    filterable: false,
    headerClassName: "dg-last-col",
    sortable: false,
    width: 110,
    ...options,
  }),
}));

describe("LearnerClassesDataGrid", () => {
  beforeEach(() => {
    useNamespace.mockClear();
    formatDueDateLabel.mockClear();
  });

  it("builds translated columns and delegates due-date formatting", async () => {
    const { LearnerClassesDataGrid } = await import("./LearnerClassesDataGrid");
    const rows = [{ id: "c1", courseName: "Course", siteName: "Main", dueAt: "2026-02-02T00:00:00.000Z" }] as any;

    const element = LearnerClassesDataGrid({
      rows,
      storageKey: "learner.classes",
    }) as any;
    const columns = element.props.columns as any[];

    expect(useNamespace).toHaveBeenCalledWith("sections.learner");

    const nameColumn = columns.find((column) => column.field === "courseName");
    expect(nameColumn.cellType).toBe("link");
    expect(nameColumn.getLink(rows[0]).href).toBe("/sections/c1/learner/me");
    expect(element.props.getRowLabel(rows[0])).toBe("Course");

    const dueColumn = columns.find((column) => column.field === "dueAt");
    expect(dueColumn.formatValue(rows[0].dueAt)).toBe("Due soon");
    expect(formatDueDateLabel).toHaveBeenCalledWith(
      rows[0].dueAt,
      undefined,
      expect.objectContaining({ locale: "en-US" }),
    );

    const actionsColumn = columns.find((column) => column.field === "actions");
    const actions = actionsColumn.getMenuActions(rows[0]);
    expect(actions.map((item: any) => item.label)).toEqual(["Details", "Continue"]);
    expect(actions[1]?.href).toBe("/content-library/activities/c1/launch");
  }, 20000);

  it("forwards optional grid props", async () => {
    const { LearnerClassesDataGrid } = await import("./LearnerClassesDataGrid");
    const onPaginationModelChange = vi.fn();
    const onSortRulesChange = vi.fn();

    const element = LearnerClassesDataGrid({
      rows: [],
      storageKey: "learner.table",
      mode: "server",
      paginationModel: { page: 2, pageSize: 50 },
      onPaginationModelChange,
      pageSizeOptions: [25, 50],
      rowCount: 300,
      sortRules: [{ field: "courseName", direction: "asc" }],
      onSortRulesChange,
    }) as any;

    expect(element.props.mode).toBe("server");
    expect(element.props.paginationModel).toEqual({ page: 2, pageSize: 50 });
    expect(element.props.rowCount).toBe(300);
    expect(element.props.storageKey).toBe("learner.table");
  });
});
