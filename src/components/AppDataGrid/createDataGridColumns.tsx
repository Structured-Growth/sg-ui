import type { GridColDef, GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import {
  CopyableTableCell,
  CustomTableCell,
  DateTableCell,
  DateTimeTableCell,
  ImageTableCell,
  JsonTableCell,
  TableCellLink,
  TableCellMenu,
  TextTableCell,
} from "./components/table-cell";
import { TableHeaderSortMenu } from "./components/header/TableHeaderSortMenu";
import type { AppDataGridColumn, AppDataGridSortDirection } from "./types";

const getRawCellValue = <RowModel extends GridValidRowModel>(
  column: AppDataGridColumn<RowModel>,
  params: GridRenderCellParams<RowModel>,
) => {
  if (column.getCellValue) {
    return column.getCellValue(params.row);
  }

  return params.value;
};

export const createDataGridColumns = <RowModel extends GridValidRowModel>(
  columns: AppDataGridColumn<RowModel>[],
  options?: {
    onHeaderSortSelect?: (field: string, direction: AppDataGridSortDirection) => void;
    getHeaderSortDirection?: (field: string) => AppDataGridSortDirection;
  },
): GridColDef<RowModel>[] =>
  columns.map((column) => {
    const canUseHeaderSortMenu = Boolean(options?.onHeaderSortSelect && column.sortable !== false && typeof column.field === "string");
    const baseHeaderRenderer = column.renderHeader;

    if (!column.cellType) {
      return canUseHeaderSortMenu
        ? {
            ...column,
            renderHeader: (params) => (
              <TableHeaderSortMenu
                label={baseHeaderRenderer ? baseHeaderRenderer(params) : params.colDef.headerName ?? params.field}
                sortDirection={options?.getHeaderSortDirection?.(params.field) ?? ""}
                onSortSelect={(direction) => {
                  options?.onHeaderSortSelect?.(params.field, direction);
                }}
              />
            ),
          }
        : column;
    }

    return {
      ...column,
      ...(canUseHeaderSortMenu
        ? {
            renderHeader: (params) => (
              <TableHeaderSortMenu
                label={baseHeaderRenderer ? baseHeaderRenderer(params) : params.colDef.headerName ?? params.field}
                sortDirection={options?.getHeaderSortDirection?.(params.field) ?? ""}
                onSortSelect={(direction) => {
                  options?.onHeaderSortSelect?.(params.field, direction);
                }}
              />
            ),
          }
        : {}),
      renderCell: (params) => {
        const cellValue = getRawCellValue(column, params);

        switch (column.cellType) {
          case "date":
            return <DateTableCell fallbackText={column.fallbackText} value={cellValue} />;
          case "dateTime":
            return <DateTimeTableCell fallbackText={column.fallbackText} value={cellValue} />;
          case "copyable":
            return <CopyableTableCell fallbackText={column.fallbackText} value={cellValue} />;
          case "json":
            return <JsonTableCell fallbackText={column.fallbackText} value={cellValue} />;
          case "image":
            return <ImageTableCell src={column.getImageSrc?.(params.row)} />;
          case "link": {
            const link = column.getLink?.(params.row);
            if (!link) {
              return null;
            }

            return <TableCellLink abbr={link.abbr} fallbackText={column.fallbackText} href={link.href} label={link.label} />;
          }
          case "menu": {
            const actions = column.getMenuActions?.(params.row) ?? [];
            if (actions.length === 0) {
              return null;
            }
            return <TableCellMenu actions={actions} row={params.row} />;
          }
          case "custom":
            return <CustomTableCell>{column.renderCustomCell?.(params.row)}</CustomTableCell>;
          case "text":
          default:
            return <TextTableCell fallbackText={column.fallbackText} value={cellValue} />;
        }
      },
    };
  });
