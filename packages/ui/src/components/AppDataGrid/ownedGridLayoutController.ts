"use client";

import { useCallback, useState } from "react";
import { normalizeOwnedGridLayout, type OwnedGridPresentationColumn } from "./ownedGridColumns";

export type OwnedGridLayoutControllerOptions<Row> = {
  columns: readonly OwnedGridPresentationColumn<Row>[];
  columnVisibilityModel?: Readonly<Record<string, boolean>>;
  defaultColumnVisibilityModel?: Readonly<Record<string, boolean>>;
  onColumnVisibilityModelChange?: (value: Record<string, boolean>) => void;
  columnOrder?: readonly string[];
  defaultColumnOrder?: readonly string[];
  onColumnOrderChange?: (value: string[]) => void;
  columnWidths?: Readonly<Record<string, number>>;
  defaultColumnWidths?: Readonly<Record<string, number>>;
  onColumnWidthsChange?: (value: Record<string, number>) => void;
};

/** Each layout concern independently owns local state unless its value is supplied. */
export function useOwnedGridLayoutController<Row>(options: OwnedGridLayoutControllerOptions<Row>) {
  const { columns, columnVisibilityModel, columnOrder, columnWidths,
    onColumnVisibilityModelChange, onColumnOrderChange, onColumnWidthsChange } = options;
  const [localVisibility, setLocalVisibility] = useState(() => normalizeOwnedGridLayout(columns, {
    visibility: options.defaultColumnVisibilityModel,
  }).visibility);
  const [localOrder, setLocalOrder] = useState(() => normalizeOwnedGridLayout(columns, {
    order: options.defaultColumnOrder,
  }).order);
  const [localWidths, setLocalWidths] = useState(() => normalizeOwnedGridLayout(columns, {
    widths: options.defaultColumnWidths,
  }).widths);
  const layout = normalizeOwnedGridLayout(columns, {
    visibility: columnVisibilityModel ?? localVisibility,
    order: columnOrder ?? localOrder,
    widths: columnWidths ?? localWidths,
  });

  const setVisibility = useCallback((value: Readonly<Record<string, boolean>>) => {
    const next = normalizeOwnedGridLayout(columns, { visibility: value }).visibility;
    if (columnVisibilityModel === undefined) setLocalVisibility(next);
    onColumnVisibilityModelChange?.({ ...next });
  }, [columns, columnVisibilityModel, onColumnVisibilityModelChange]);
  const setOrder = useCallback((value: readonly string[]) => {
    const next = normalizeOwnedGridLayout(columns, { order: value }).order;
    if (columnOrder === undefined) setLocalOrder(next);
    onColumnOrderChange?.([...next]);
  }, [columns, columnOrder, onColumnOrderChange]);
  const setWidths = useCallback((value: Readonly<Record<string, number>>) => {
    const next = normalizeOwnedGridLayout(columns, { widths: value }).widths;
    if (columnWidths === undefined) setLocalWidths(next);
    onColumnWidthsChange?.({ ...next });
  }, [columns, columnWidths, onColumnWidthsChange]);

  return { layout, setVisibility, setOrder, setWidths };
}
