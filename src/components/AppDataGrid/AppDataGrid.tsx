"use client";

import { useCallback, useMemo, useRef, useState, type DragEvent as ReactDragEvent } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  DataGrid as MuiDataGrid,
  type DataGridProps as MuiDataGridProps,
  type GridPaginationModel,
  type GridSortModel,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import {
  APP_PAGE_SIZE_OPTIONS,
  normalizePaginationModel,
  usePersistentPaginationModel,
} from "../../hooks/usePersistentPaginationModel";
import { useTranslation } from "../../i18n";
import { toLabelKey } from "../../i18n/labelKey";
import { baseGridSx } from "./components/baseGridSx";
import { TableLoaderOverlay } from "./components/TableLoaderOverlay";
import { TableNoResults } from "./components/TableNoResults";
import { createDataGridColumns } from "./createDataGridColumns";
import { DataToolbarSelectionMenu, type DataGridInteractionMode } from "../DataToolbar";
import { DataGridDragHandle, useDataGridRowDnd } from "../AppDataGridRowDnd";
import type {
  AppDataGridColumn,
  AppDataGridRowDragConfig,
  AppDataGridSelectionConfig,
  AppDataGridSelectionState,
  AppDataGridSortRule,
} from "./types";
import { AppPaginationFooter } from "../CardPaginationFooter";

export type AppDataGridProps<RowModel extends GridValidRowModel> = Omit<
  MuiDataGridProps<RowModel>,
  "columns" | "pageSizeOptions" | "checkboxSelection"
> & {
  columns: AppDataGridColumn<RowModel>[];
  mode?: DataGridInteractionMode;
  storageKey?: string;
  sortRules?: AppDataGridSortRule[];
  onSortRulesChange?: (nextRules: AppDataGridSortRule[]) => void;
  selection?: AppDataGridSelectionConfig<RowModel> | boolean;
  rowDrag?: AppDataGridRowDragConfig<RowModel>;
  defaultPaginationModel?: GridPaginationModel;
  pageSizeOptions?: ReadonlyArray<number | { value: number; label: string }>;
  sx?: SxProps<Theme>;
};

const fallbackPaginationModel: GridPaginationModel = {
  page: 0,
  pageSize: 25,
};

export function AppDataGrid<RowModel extends GridValidRowModel>({
  columns,
  mode = "client",
  storageKey,
  sortRules,
  onSortRulesChange,
  selection,
  rowDrag,
  defaultPaginationModel = fallbackPaginationModel,
  pageSizeOptions = [...APP_PAGE_SIZE_OPTIONS],
  sx,
  columnVisibilityModel: providedColumnVisibilityModel,
  paginationModel: controlledPaginationModel,
  onPaginationModelChange: externalOnPaginationModelChange,
  hideFooter: hideFooterProp,
  ...props
}: AppDataGridProps<RowModel>) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const trLabel = useCallback(
    (label: string) => t(toLabelKey("common.ui.label", label), { defaultMessage: label, namespace: "common.ui" }),
    [t],
  );
  const [ephemeralPaginationModel, setEphemeralPaginationModel] = useState(defaultPaginationModel);
  const [persistedPaginationModel, setPersistedPaginationModel] = usePersistentPaginationModel(
    storageKey ? `datagrid:${storageKey}:paginationModel` : "datagrid:temporary:paginationModel",
    defaultPaginationModel,
  );
  const maxPageSize = APP_PAGE_SIZE_OPTIONS[APP_PAGE_SIZE_OPTIONS.length - 1];
  const resolvedPageSizeOptions = pageSizeOptions.filter((option) =>
    (typeof option === "number" ? option : option.value) <= maxPageSize,
  );
  const finalPageSizeOptions = resolvedPageSizeOptions.length > 0 ? resolvedPageSizeOptions : [...APP_PAGE_SIZE_OPTIONS];
  const numericPageSizeOptions = finalPageSizeOptions.map((option) => (typeof option === "number" ? option : option.value));

  const isPaginationControlled = controlledPaginationModel !== undefined;
  const internalPaginationModel = storageKey ? persistedPaginationModel : normalizePaginationModel(ephemeralPaginationModel);
  const paginationModel = isPaginationControlled
    ? normalizePaginationModel(controlledPaginationModel)
    : internalPaginationModel;
  const setInternalPaginationModel = storageKey ? setPersistedPaginationModel : setEphemeralPaginationModel;
  const onPaginationModelChange: NonNullable<MuiDataGridProps<RowModel>["onPaginationModelChange"]> = (model, details) => {
    const normalizedModel = normalizePaginationModel(model);
    if (!isPaginationControlled) {
      setInternalPaginationModel(normalizedModel);
    }
    externalOnPaginationModelChange?.(normalizedModel, details);
  };
  const totalRowCount = props.rowCount ?? props.rows?.length ?? 0;
  const clampSortModel = (model: GridSortModel): GridSortModel => {
    return model.length > 1 ? [model[0]] : model;
  };
  const sortModel = props.sortModel ? clampSortModel(props.sortModel) : props.sortModel;
  const onSortModelChange = props.onSortModelChange
    ? (model: GridSortModel, details: Parameters<NonNullable<typeof props.onSortModelChange>>[1]) =>
        props.onSortModelChange?.(clampSortModel(model), details)
    : undefined;
  const rows = useMemo(() => (props.rows ?? []) as RowModel[], [props.rows]);
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<Set<string>>(new Set());
  const resolvedSelection = useMemo<AppDataGridSelectionConfig<RowModel> | undefined>(() => {
    if (selection === true) {
      return {
        onSelectedRowIdsChange: setInternalSelectedRowIds,
        selectedRowIds: internalSelectedRowIds,
      };
    }
    return selection === false ? undefined : selection;
  }, [internalSelectedRowIds, selection]);
  const getRowId = useCallback(
    (row: RowModel) => resolvedSelection?.getRowId?.(row) ?? rowDrag?.getRowId?.(row) ?? String((row as { id?: string }).id ?? ""),
    [resolvedSelection, rowDrag],
  );
  const rowIds = useMemo(
    () =>
      rows
        .map((row) => getRowId(row))
        .filter((rowId) => rowId.length > 0),
    [getRowId, rows],
  );
  const rowsById = useMemo(() => {
    const map = new Map<string, RowModel>();
    for (const row of rows) {
      const rowId = getRowId(row);
      if (rowId) {
        map.set(rowId, row);
      }
    }
    return map;
  }, [getRowId, rows]);

  const { cleanupDragPreview, getDropPosition, resolveRowFromEvent, setDragPreview } = useDataGridRowDnd<RowModel>({
    rowsById,
  });
  const draggingRowIdRef = useRef<string | null>(null);
  const dropIndicatorRef = useRef<{ rowElement: unknown; position: "before" | "after" } | null>(null);

  const clearDropIndicator = useCallback(() => {
    const current = dropIndicatorRef.current;
    if (!current) {
      return;
    }
    const { rowElement } = current;
    const classList = (rowElement as { classList?: { remove?: (...tokens: string[]) => void } }).classList;
    classList?.remove?.("app-grid-drop-before", "app-grid-drop-after");
    dropIndicatorRef.current = null;
  }, []);

  const cleanupRowDragState = useCallback(() => {
    draggingRowIdRef.current = null;
    cleanupDragPreview();
    clearDropIndicator();
  }, [cleanupDragPreview, clearDropIndicator]);

  const renderRowDragHandle = useCallback((row: RowModel) => {
    const rowId = getRowId(row);
    const draggable = rowId.length > 0 && (rowDrag?.isRowDraggable?.(row) ?? true);
    if (!draggable) {
      return null;
    }

    return (
      <DataGridDragHandle
        className="app-grid-drag-handle"
        onDragEnd={() => {
          cleanupRowDragState();
        }}
        onDragStart={(event) => {
          if (!event.dataTransfer) {
            return;
          }
          draggingRowIdRef.current = rowId;
          event.dataTransfer.setData("text/plain", rowId);
          event.dataTransfer.effectAllowed = "move";
          const dragLabel = rowDrag?.getRowLabel?.(row) ?? rowId;
          setDragPreview(event, dragLabel);
        }}
      />
    );
  }, [cleanupRowDragState, getRowId, rowDrag, setDragPreview]);

  const resolvedSelectedRowIds = useMemo(() => resolvedSelection?.selectedRowIds ?? new Set<string>(), [resolvedSelection?.selectedRowIds]);
  const selectedCount = rowIds.filter((rowId) => resolvedSelectedRowIds.has(rowId)).length;
  const selectionState: AppDataGridSelectionState = rowIds.length === 0 || selectedCount === 0
    ? "none"
    : selectedCount === rowIds.length
      ? "all"
      : "some";
  const selectionColumn = useMemo<AppDataGridColumn<RowModel> | null>(() => {
    if (!resolvedSelection) {
      return null;
    }

    const includeDragHandle = Boolean(rowDrag);
    const dragHandleSlotWidth = rowDrag?.handleColumnWidth ?? 44;
    const checkboxSlotWidth = 52;
    const columnWidth = includeDragHandle ? dragHandleSlotWidth + checkboxSlotWidth : 72;

    return {
      field: "__select__",
      filterable: false,
      headerName: "",
      headerClassName: "selection-header",
      cellClassName: "selection-cell",
      maxWidth: columnWidth,
      minWidth: columnWidth,
      resizable: false,
      sortable: false,
      width: columnWidth,
      cellType: "custom",
      renderHeader: () => (
        <Box sx={{ alignItems: "center", display: "flex", height: "100%", justifyContent: "flex-start", minHeight: 0, width: "100%" }}>
          <DataToolbarSelectionMenu
            onSelectOption={(optionId) => {
              if (!resolvedSelection.onSelectedRowIdsChange) {
                return;
              }

              if (optionId === "all") {
                resolvedSelection.onSelectedRowIdsChange(new Set(rowIds));
                return;
              }

              if (optionId === "none") {
                resolvedSelection.onSelectedRowIdsChange(new Set());
              }
            }}
            onToggleSelection={() => {
              if (!resolvedSelection.onSelectedRowIdsChange) {
                return;
              }

              if (selectionState === "all") {
                resolvedSelection.onSelectedRowIdsChange(new Set());
                return;
              }

              resolvedSelection.onSelectedRowIdsChange(new Set(rowIds));
            }}
            options={[
              { id: "all", label: resolvedSelection.selectAllLabel ?? trLabel("All") },
              { id: "none", label: resolvedSelection.selectNoneLabel ?? trLabel("None") },
            ]}
            selectionState={selectionState}
          />
        </Box>
      ),
      renderCustomCell: (row) => {
        const rowId = resolvedSelection.getRowId?.(row) ?? getRowId(row);
        const dragHandleCell = includeDragHandle
          ? (
            <Box
              aria-hidden
              sx={{
                alignItems: "center",
                display: "inline-flex",
                justifyContent: "center",
                width: dragHandleSlotWidth,
              }}
            >
              {renderRowDragHandle(row)}
            </Box>
          )
          : null;
        return (
          <Box sx={{ alignItems: "center", display: "flex", gap: 0.5, height: "100%", justifyContent: "flex-start", minHeight: 0, width: "100%" }}>
            {dragHandleCell}
            <Checkbox
              checked={resolvedSelectedRowIds.has(rowId)}
              onChange={(event) => {
                if (!resolvedSelection.onSelectedRowIdsChange) {
                  return;
                }

                const nextIds = new Set(resolvedSelectedRowIds);
                if (event.target.checked) {
                  nextIds.add(rowId);
                } else {
                  nextIds.delete(rowId);
                }
                resolvedSelection.onSelectedRowIdsChange(nextIds);
              }}
              size="small"
            />
          </Box>
        );
      },
    } satisfies AppDataGridColumn<RowModel>;
  }, [getRowId, renderRowDragHandle, resolvedSelectedRowIds, resolvedSelection, rowDrag, rowIds, selectionState, trLabel]);

  const rowDragColumn = useMemo<AppDataGridColumn<RowModel> | null>(() => {
    if (!rowDrag || resolvedSelection) {
      return null;
    }

    const handleWidth = rowDrag.handleColumnWidth ?? 44;
    return {
      field: "__drag__",
      headerName: "",
      filterable: false,
      headerClassName: "row-drag-header",
      cellClassName: "row-drag-cell",
      minWidth: handleWidth,
      maxWidth: handleWidth,
      width: handleWidth,
      resizable: false,
      sortable: false,
      cellType: "custom",
      renderCustomCell: (row) => {
        return (
          <Box sx={{ alignItems: "center", display: "flex", height: "100%", justifyContent: "center", minHeight: 0, width: "100%" }}>
            {renderRowDragHandle(row)}
          </Box>
        );
      },
    } satisfies AppDataGridColumn<RowModel>;
  }, [renderRowDragHandle, resolvedSelection, rowDrag]);

  const columnsWithControls = useMemo<AppDataGridColumn<RowModel>[]>(() => {
    let nextColumns = columns;
    if (selectionColumn) {
      const hasSelectionColumn = nextColumns.some((column) => String(column.field) === "__select__");
      if (!hasSelectionColumn) {
        nextColumns = [selectionColumn, ...nextColumns];
      }
    }

    if (rowDragColumn) {
      const hasRowDragColumn = nextColumns.some((column) => String(column.field) === "__drag__");
      if (!hasRowDragColumn) {
        nextColumns = [rowDragColumn, ...nextColumns];
      }
    }

    return nextColumns;
  }, [columns, rowDragColumn, selectionColumn]);

  const handleGridDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>, honorDefaultPrevented: boolean) => {
    if (honorDefaultPrevented && event.defaultPrevented) {
      return;
    }
    if (!rowDrag || !draggingRowIdRef.current) {
      return;
    }

    // Keep drop enabled while a row drag is active so browsers reliably fire drop.
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    const resolvedTarget = resolveRowFromEvent(event);
    if (!resolvedTarget) {
      clearDropIndicator();
      return;
    }

    const sourceRowId = draggingRowIdRef.current;
    const targetRowId = getRowId(resolvedTarget.row);
    if (!sourceRowId || !targetRowId || sourceRowId === targetRowId) {
      clearDropIndicator();
      return;
    }

    const position = getDropPosition(event, resolvedTarget.rowElement);
    const classList = (resolvedTarget.rowElement as { classList?: { add?: (...tokens: string[]) => void; remove?: (...tokens: string[]) => void } }).classList;
    if (classList?.add && classList?.remove) {
      const existing = dropIndicatorRef.current;
      if (existing?.rowElement !== resolvedTarget.rowElement || existing.position !== position) {
        clearDropIndicator();
        classList.remove("app-grid-drop-before", "app-grid-drop-after");
        classList.add(position === "before" ? "app-grid-drop-before" : "app-grid-drop-after");
        dropIndicatorRef.current = { position, rowElement: resolvedTarget.rowElement };
      }
    }

    event.preventDefault();
  }, [clearDropIndicator, getDropPosition, getRowId, resolveRowFromEvent, rowDrag]);

  const handleGridDrop = useCallback((event: ReactDragEvent<HTMLDivElement>, honorDefaultPrevented: boolean) => {
    if (honorDefaultPrevented && event.defaultPrevented) {
      return;
    }
    if (!rowDrag || !draggingRowIdRef.current) {
      return;
    }

    const sourceRowId = draggingRowIdRef.current;
    const sourceRow = rowsById.get(sourceRowId);
    const resolvedTarget = resolveRowFromEvent(event);
    if (!sourceRow || !resolvedTarget) {
      cleanupRowDragState();
      return;
    }

    const targetRowId = getRowId(resolvedTarget.row);
    if (!targetRowId || sourceRowId === targetRowId) {
      cleanupRowDragState();
      return;
    }

    event.preventDefault();
    clearDropIndicator();
    rowDrag.onReorder({
      sourceRow,
      sourceRowId,
      targetRow: resolvedTarget.row,
      targetRowId,
      position: getDropPosition(event, resolvedTarget.rowElement),
    });
    cleanupRowDragState();
  }, [cleanupRowDragState, clearDropIndicator, getDropPosition, getRowId, resolveRowFromEvent, rowDrag, rowsById]);

  const handleGridDragLeave = useCallback((_event: ReactDragEvent<HTMLDivElement>) => {
    // Rely on drop / dragend to clear drag state. Drag-leave events can fire while
    // moving between grid children and are unreliable for cleanup.
  }, []);

  const resolvedSlotProps = useMemo<MuiDataGridProps<RowModel>["slotProps"]>(() => {
    const existingSlotProps = props.slotProps ?? {};
    const existingRootProps = existingSlotProps.root ?? {};

    const hasConsumerDragOver = typeof existingRootProps.onDragOverCapture === "function";
    const hasConsumerDrop = typeof existingRootProps.onDropCapture === "function";
    const hasConsumerDragLeave = typeof existingRootProps.onDragLeaveCapture === "function";

    return {
      ...existingSlotProps,
      root: {
        ...existingRootProps,
        onDragLeaveCapture: (event) => {
          if (hasConsumerDragLeave) {
            existingRootProps.onDragLeaveCapture?.(event);
          }
          handleGridDragLeave(event);
        },
        onDragOverCapture: (event) => {
          if (hasConsumerDragOver) {
            existingRootProps.onDragOverCapture?.(event);
          }
          handleGridDragOver(event, hasConsumerDragOver);
        },
        onDropCapture: (event) => {
          if (hasConsumerDrop) {
            existingRootProps.onDropCapture?.(event);
          }
          handleGridDrop(event, hasConsumerDrop);
        },
      },
    };
  }, [handleGridDragLeave, handleGridDragOver, handleGridDrop, props.slotProps]);

  const columnsWithSelection = useMemo<AppDataGridColumn<RowModel>[]>(() => {
    const controlColumns = columnsWithControls.filter((column) => String(column.field).startsWith("__"));
    const dataColumns = columnsWithControls.filter((column) => !String(column.field).startsWith("__"));
    const leftPinned = dataColumns.filter((column) => column.pinned === "left");
    const centerColumns = dataColumns.filter((column) => column.pinned !== "left" && column.pinned !== "right");
    const rightPinned = dataColumns.filter((column) => column.pinned === "right");
    return [...controlColumns, ...leftPinned, ...centerColumns, ...rightPinned];
  }, [columnsWithControls]);
  const alwaysVisibleFieldIds = useMemo(
    () =>
      columnsWithSelection
        .filter((column) => column.locked || column.pinned === "left" || column.pinned === "right")
        .map((column) => String(column.field)),
    [columnsWithSelection],
  );
  const inferredHiddenColumns = useMemo<AppDataGridColumn<RowModel>[]>(() => {
    const existingFieldIds = new Set(columnsWithSelection.map((column) => String(column.field)));
    const inferredFieldIds: string[] = [];

    for (const row of rows) {
      for (const fieldId of Object.keys(row as Record<string, unknown>)) {
        if (existingFieldIds.has(fieldId) || inferredFieldIds.includes(fieldId)) {
          continue;
        }
        inferredFieldIds.push(fieldId);
      }
    }

    return inferredFieldIds.map((fieldId) => ({
      field: fieldId,
      headerName: fieldId
        .replace(/_/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, (first) => first.toUpperCase()),
      minWidth: 160,
      flex: 1,
    }));
  }, [columnsWithSelection, rows]);

  const normalizedColumnVisibilityModel = useMemo(() => {
    const hasProvidedModel = Boolean(providedColumnVisibilityModel);
    const requiresMerge = inferredHiddenColumns.length > 0 || alwaysVisibleFieldIds.length > 0 || hasProvidedModel;
    if (!requiresMerge) {
      return providedColumnVisibilityModel;
    }

    const mergedModel = { ...(providedColumnVisibilityModel ?? {}) } as Record<string, boolean>;

    for (const column of inferredHiddenColumns) {
      const fieldId = String(column.field);
      if (mergedModel[fieldId] === undefined) {
        mergedModel[fieldId] = false;
      }
    }
    for (const fieldId of alwaysVisibleFieldIds) {
      mergedModel[fieldId] = true;
    }

    return mergedModel;
  }, [alwaysVisibleFieldIds, inferredHiddenColumns, providedColumnVisibilityModel]);

  const localizedColumns = useMemo<AppDataGridColumn<RowModel>[]>(
    () =>
      [...columnsWithSelection, ...inferredHiddenColumns].map((column) => {
        if (typeof column.headerName !== "string" || column.headerName.length === 0) {
          return column;
        }

        return {
          ...column,
          headerName: trLabel(column.headerName),
        };
      }),
    [columnsWithSelection, inferredHiddenColumns, trLabel],
  );

  const resolvedColumns = createDataGridColumns(localizedColumns, {
    getHeaderSortDirection: sortRules
      ? (field) => sortRules.find((rule) => rule.field === field)?.direction ?? ""
      : undefined,
    onHeaderSortSelect:
      sortRules && onSortRulesChange
        ? (field, direction) => {
            const existingValidRules = sortRules.filter(
              (rule) => rule.field !== field && (rule.direction === "asc" || rule.direction === "desc"),
            );
            const nextRules =
              direction === ""
                ? existingValidRules
                : [{ direction, field }, ...existingValidRules];
            onSortRulesChange(nextRules);
          }
        : undefined,
  });

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", height: "100%", minHeight: 0, minWidth: 0 }}>
      <Box sx={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }}>
        <MuiDataGrid
          {...props}
          checkboxSelection={false}
          columnVisibilityModel={normalizedColumnVisibilityModel}
          columns={resolvedColumns}
          disableColumnSorting
          disableColumnMenu
          disableRowSelectionOnClick
          filterMode={mode}
          hideFooter
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={finalPageSizeOptions}
          pagination
          paginationModel={paginationModel}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          sortingMode={mode}
          slots={{
            loadingOverlay: TableLoaderOverlay,
            noRowsOverlay: TableNoResults,
            ...props.slots,
          }}
          slotProps={resolvedSlotProps}
          sx={[baseGridSx, ...(Array.isArray(sx) ? sx : [sx])]}
        />
      </Box>
      {!hideFooterProp ? (
        <AppPaginationFooter
          onPageChange={(nextPage) => {
            onPaginationModelChange({ ...paginationModel, page: nextPage }, {} as never);
          }}
          onPageSizeChange={(nextPageSize) => {
            onPaginationModelChange({ page: 0, pageSize: nextPageSize }, {} as never);
          }}
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          pageSizeOptions={numericPageSizeOptions}
          totalCount={totalRowCount}
        />
      ) : null}
    </Box>
  );
}
