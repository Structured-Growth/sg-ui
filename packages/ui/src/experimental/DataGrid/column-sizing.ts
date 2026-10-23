/** Internal sizing policy shared by the generic DataGrid and catalog compositions. */
export type GridSizingColumn = { id: string; width?: number; minWidth?: number; maxWidth?: number; flex?: number; utility?: boolean };
const finitePositive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

/** A leading divider needs resizable data on both sides; utility columns are outside this list. */
export function canResizeLeadingColumn(columns: readonly { minWidth?: number; maxWidth?: number }[], index: number): boolean {
  if (index <= 0 || index >= columns.length) return false;
  return [columns[index - 1]!, columns[index]!].every(column => column.minWidth === undefined || column.minWidth !== column.maxWidth);
}

const canFill = (column: GridSizingColumn) => !column.utility && (column.minWidth === undefined || column.minWidth !== column.maxWidth);
const fillCandidates = (columns: readonly GridSizingColumn[]) => {
  const eligible = columns.filter(canFill).reverse();
  const uncapped = eligible.filter(column => column.maxWidth === undefined);
  return uncapped.length ? uncapped : eligible;
};

export function getGridFillColumn(columns: readonly GridSizingColumn[], widths: Readonly<Record<string, number>>): string | undefined {
  const candidates = fillCandidates(columns);
  if (candidates.some(column => !finitePositive(widths[column.id]) && column.width === undefined && column.flex !== undefined)) return undefined;
  return (candidates.find(column => !finitePositive(widths[column.id])) ?? candidates[0])?.id;
}

export function retainGridFillColumn(columns: readonly GridSizingColumn[], widths: Readonly<Record<string, number>>, resizedField: string): Record<string, number> {
  const next = { ...widths };
  const candidates = fillCandidates(columns);
  if (!candidates.some(column => !finitePositive(next[column.id]))) {
    const remaining = candidates.filter(column => column.id !== resizedField);
    const fill = remaining.find(column => column.flex !== undefined) ?? remaining[0] ?? candidates[0];
    if (fill) delete next[fill.id];
  }
  return next;
}

export function measureGridColumnWidths(definitions: readonly GridSizingColumn[], availableWidth: number, overrides: Readonly<Record<string, number>> = {}): Record<string, number> {
  const widths: Record<string, number> = {};
  const flexible: GridSizingColumn[] = definitions.filter(column => !finitePositive(overrides[column.id]) && column.width === undefined && column.flex !== undefined);
  if (availableWidth > 0) {
    const fill = getGridFillColumn(definitions, overrides);
    const column = definitions.find(column => column.id === fill);
    if (column && !flexible.includes(column)) flexible.push(column);
  }
  const clamp = (column: GridSizingColumn, width: number) => Math.min(column.maxWidth ?? Infinity, Math.max(column.minWidth ?? 80, width));
  let remaining = Math.max(0, Number.isFinite(availableWidth) ? availableWidth : 0);
  for (const column of definitions) {
    const override = overrides[column.id];
    if (!flexible.includes(column)) {
      widths[column.id] = clamp(column, finitePositive(override) ? override : column.width ?? 160);
      remaining -= widths[column.id]!;
    }
  }
  if (flexible.length) {
    // Find the weighted allocation after bounds, including mixed min/max cases.
    const budget = Math.max(0, remaining);
    let low = 0;
    let high = Math.max(1, ...flexible.map(column => budget / (column.flex ?? 1)));
    for (let iteration = 0; iteration < 80; iteration++) {
      const weightUnit = (low + high) / 2;
      const total = flexible.reduce((sum, column) => sum + clamp(column, weightUnit * (column.flex ?? 1)), 0);
      if (total > budget) high = weightUnit;
      else low = weightUnit;
    }
    for (const column of flexible) widths[column.id] = clamp(column, Math.round(((low + high) / 2) * (column.flex ?? 1) * 1000000) / 1000000);
  }
  return widths;
}
