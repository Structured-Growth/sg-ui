// Compile against the source entry points or emitted package export routes.
import type { AppDataGridProps, AppDataGridShellProps, AppDataGridViewState as RootViewState } from "@structured-growth/sg-ui";
import type { AppDataGridViewState as ComponentsViewState } from "@structured-growth/sg-ui/components";
import type { AppDataGridViewState as GranularViewState } from "@structured-growth/sg-ui/components/AppDataGrid";

type Row = { id: string; title: string };
type Assert<T extends true> = T;
type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type GridResetState = Parameters<NonNullable<AppDataGridProps<Row>["onResetView"]>>[0];
type ShellResetState = Parameters<NonNullable<AppDataGridShellProps<Row>["onResetView"]>>[0];

export type RouteAssertions = [
  Assert<Same<RootViewState, ComponentsViewState>>,
  Assert<Same<RootViewState, GranularViewState>>,
  Assert<Same<RootViewState, GridResetState>>,
  Assert<Same<RootViewState, ShellResetState>>,
];

// A host can accept one complete callback snapshot through any public route.
export const snapshot: RootViewState = {
  paginationModel: { page: 0, pageSize: 25 },
  sortRules: [{ field: "title", direction: "asc" }],
  filterRules: [],
  searchValue: "course",
  selectedRowIds: new Set<string>(),
  columnVisibilityModel: { title: true },
  columnOrder: ["title"],
  columnWidths: { title: 240 },
  viewMode: "cards",
};

export function acceptRoot(state: RootViewState): void { void state; }
export function acceptComponents(state: ComponentsViewState): void { acceptRoot(state); }
export function acceptGranular(state: GranularViewState): void { acceptComponents(state); }

export const gridCallbacks = { onResetView: acceptGranular } satisfies Pick<AppDataGridProps<Row>, "onResetView">;
export const shellCallbacks = { onResetView: acceptComponents } satisfies Pick<AppDataGridShellProps<Row>, "onResetView">;
gridCallbacks.onResetView(snapshot);
shellCallbacks.onResetView(snapshot);

// Layout fields and the owned optional view-mode union remain enforced.
// @ts-expect-error A complete snapshot requires column widths.
export const incomplete: RootViewState = { paginationModel: snapshot.paginationModel, sortRules: [], filterRules: [], searchValue: "", selectedRowIds: new Set(), columnVisibilityModel: {}, columnOrder: [] };
// @ts-expect-error Only the declared list/cards modes are supported.
export const invalidView: ComponentsViewState = { ...snapshot, viewMode: "board" };
