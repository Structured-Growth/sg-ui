"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import type { GridValidRowModel } from "@mui/x-data-grid";
import { DataToolbar, type ClassesViewMode, type DataGridInteractionMode, type DataToolbarColumnOption, type DataToolbarProps } from "../DataToolbar";
import { buildDataToolbarColumnOptions } from "../DataToolbar";
import { CardCollectionWithFooter } from "../CardCollectionWithFooter";
import { AppDataGrid, type AppDataGridColumn, type AppDataGridProps } from "../AppDataGrid";
import { APP_PAGE_SIZE_OPTIONS, usePersistentPaginationModel } from "../../hooks/usePersistentPaginationModel";
import { usePersistentState } from "../../hooks/usePersistentState";
import { Box, Stack, Typography } from "../primitives";
import type { AppGridColumnVisibilityModel, AppGridPaginationModel } from "../AppDataGrid";
import type { AppDataGridSelectionConfig } from "../AppDataGrid";

type AppDataGridShellBaseColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
};

export type AppDataGridShellToolbarConfig = Omit<
  DataToolbarProps,
  "mode" | "viewMode" | "onViewModeChange" | "columnOptions" | "onColumnOptionsChange"
> & {
  show?: boolean;
  showSelectedCount?: boolean;
  baseColumnOptions?: readonly AppDataGridShellBaseColumnOption[];
  columnOptions?: DataToolbarColumnOption[];
  onColumnOptionsChange?: (nextOptions: DataToolbarColumnOption[]) => void;
  columnVisibilityModel?: AppGridColumnVisibilityModel;
  onColumnVisibilityModelChange?: (nextModel: AppGridColumnVisibilityModel) => void;
};

export type AppDataGridShellCardsConfig<RowModel extends GridValidRowModel> = {
  renderCard: (row: RowModel) => ReactNode;
  getRowId?: (row: RowModel) => string;
  pageSizeOptions?: number[];
  paginationModel?: AppGridPaginationModel;
  onPaginationModelChange?: (nextModel: AppGridPaginationModel) => void;
};

export type AppDataGridShellViewConfig<RowModel extends GridValidRowModel> = {
  enabled?: boolean;
  mode?: ClassesViewMode;
  defaultMode?: ClassesViewMode;
  onModeChange?: (nextMode: ClassesViewMode) => void;
  cards?: AppDataGridShellCardsConfig<RowModel>;
};

export type AppDataGridShellProps<RowModel extends GridValidRowModel> = Omit<
  AppDataGridProps<RowModel>,
  "rows" | "columns" | "storageKey" | "mode" | "columnVisibilityModel" | "selection" | "checkboxSelection"
> & {
  rows: RowModel[];
  columns: AppDataGridColumn<RowModel>[];
  storageKey: string;
  mode?: DataGridInteractionMode;
  selection?: AppDataGridSelectionConfig<RowModel> | boolean;
  toolbar?: AppDataGridShellToolbarConfig;
  view?: AppDataGridShellViewConfig<RowModel>;
};

export function AppDataGridShell<RowModel extends GridValidRowModel>({
  rows,
  columns,
  storageKey,
  mode = "client",
  toolbar,
  view,
  selection: shellSelection,
  ...gridProps
}: AppDataGridShellProps<RowModel>) {
  const [persistedViewMode, setPersistedViewMode] = usePersistentState<ClassesViewMode>(
    `page:${storageKey}:viewMode`,
    view?.defaultMode ?? "list",
  );
  const [persistedColumnVisibilityModel, setPersistedColumnVisibilityModel] = usePersistentState<AppGridColumnVisibilityModel>(
    `page:${storageKey}:columnVisibilityModel`,
    {},
  );
  const [persistedCardsPaginationModel, setPersistedCardsPaginationModel] = usePersistentPaginationModel(
    `page:${storageKey}:cardsPaginationModel`,
    { page: 0, pageSize: APP_PAGE_SIZE_OPTIONS[0] },
  );

  const cardsConfig = view?.cards;
  const canToggleViewMode = (view?.enabled ?? true) && Boolean(cardsConfig);
  const resolvedViewMode = view?.mode ?? persistedViewMode;
  const resolvedColumnVisibilityModel = toolbar?.columnVisibilityModel ?? persistedColumnVisibilityModel;
  const resolvedCardsPaginationModel = cardsConfig?.paginationModel ?? persistedCardsPaginationModel;
  const resolvedCardsPageSizeOptions = cardsConfig?.pageSizeOptions ?? [...APP_PAGE_SIZE_OPTIONS];
  const baseColumnOptions = toolbar?.baseColumnOptions;
  const sanitizedColumnVisibilityModel = useMemo<AppGridColumnVisibilityModel>(() => {
    if (!baseColumnOptions) {
      return resolvedColumnVisibilityModel;
    }

    const allowedById = new Map(baseColumnOptions.map((option) => [option.id, option]));
    const sanitized = Object.entries(resolvedColumnVisibilityModel).reduce<AppGridColumnVisibilityModel>((accumulator, [id, visible]) => {
      if (allowedById.has(id)) {
        accumulator[id] = visible;
      }
      return accumulator;
    }, {});

    for (const option of baseColumnOptions) {
      if (option.locked) {
        sanitized[option.id] = true;
      }
    }

    if (allowedById.has("actions")) {
      sanitized.actions = true;
    }

    return sanitized;
  }, [baseColumnOptions, resolvedColumnVisibilityModel]);

  const computedColumnOptions = useMemo<DataToolbarColumnOption[] | undefined>(() => {
    if (!baseColumnOptions) {
      return undefined;
    }

    return buildDataToolbarColumnOptions({
      baseOptions: baseColumnOptions,
      columnVisibilityModel: sanitizedColumnVisibilityModel,
      rows,
    });
  }, [baseColumnOptions, rows, sanitizedColumnVisibilityModel]);

  const resolvedToolbarColumnOptions = toolbar?.columnOptions ?? computedColumnOptions;

  const handleViewModeChange = (nextMode: ClassesViewMode) => {
    if (!view?.mode) {
      setPersistedViewMode(nextMode);
    }
    view?.onModeChange?.(nextMode);
  };

  const handleColumnVisibilityModelChange = (nextModel: AppGridColumnVisibilityModel) => {
    if (!toolbar?.columnVisibilityModel) {
      setPersistedColumnVisibilityModel(nextModel);
    }
    toolbar?.onColumnVisibilityModelChange?.(nextModel);
  };

  const handleColumnOptionsChange = (nextOptions: DataToolbarColumnOption[]) => {
    toolbar?.onColumnOptionsChange?.(nextOptions);

    const nextModel = nextOptions.reduce<AppGridColumnVisibilityModel>((accumulator, option) => {
      accumulator[option.id] = option.visible;
      return accumulator;
    }, {});
    handleColumnVisibilityModelChange(nextModel);
  };

  const handleCardsPaginationChange = (nextModel: AppGridPaginationModel) => {
    if (!cardsConfig?.paginationModel) {
      setPersistedCardsPaginationModel(nextModel);
    }
    cardsConfig?.onPaginationModelChange?.(nextModel);
  };

  const resolvedGetCardRowId = cardsConfig?.getRowId ?? ((row: RowModel) => String((row as { id?: string }).id ?? ""));
  const resolvedSelection = shellSelection;
  const selectedCount = resolvedSelection && typeof resolvedSelection === "object"
    ? (resolvedSelection.selectedRowIds?.size ?? 0)
    : 0;
  const shouldShowSelectedCount = toolbar?.showSelectedCount !== false && selectedCount > 0;
  const resolvedLeftContentWhenSelected = shouldShowSelectedCount
    ? (
      <Stack alignItems="center" direction="row" spacing={1}>
        <Typography color="text.secondary" variant="body2">
          {selectedCount} selected
        </Typography>
        {toolbar?.leftContentWhenSelected}
      </Stack>
    )
    : toolbar?.leftContentWhenSelected;

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", height: "100%", minHeight: 0, minWidth: 0 }}>
      {toolbar?.show === false ? null : (
        <DataToolbar
          {...toolbar}
          columnOptions={resolvedToolbarColumnOptions}
          leftContentWhenSelected={resolvedLeftContentWhenSelected}
          mode={mode}
          onColumnOptionsChange={resolvedToolbarColumnOptions ? handleColumnOptionsChange : undefined}
          onViewModeChange={canToggleViewMode ? handleViewModeChange : undefined}
          showViewModeToggle={canToggleViewMode}
          viewMode={canToggleViewMode ? resolvedViewMode : undefined}
        />
      )}

      <Box sx={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0 }}>
        {canToggleViewMode && resolvedViewMode === "cards" && cardsConfig ? (
          <CardCollectionWithFooter
            getRowId={resolvedGetCardRowId}
            onPageChange={(nextPage) => {
              handleCardsPaginationChange({ ...resolvedCardsPaginationModel, page: nextPage });
            }}
            onPageSizeChange={(nextPageSize) => {
              handleCardsPaginationChange({ page: 0, pageSize: nextPageSize });
            }}
            page={resolvedCardsPaginationModel.page}
            pageSize={resolvedCardsPaginationModel.pageSize}
            pageSizeOptions={resolvedCardsPageSizeOptions}
            renderCard={cardsConfig.renderCard}
            rows={rows}
          />
        ) : (
          <AppDataGrid
            {...gridProps}
            columnVisibilityModel={sanitizedColumnVisibilityModel}
            columns={columns}
            mode={mode}
            rows={rows}
            selection={resolvedSelection}
            storageKey={storageKey}
          />
        )}
      </Box>
    </Box>
  );
}
