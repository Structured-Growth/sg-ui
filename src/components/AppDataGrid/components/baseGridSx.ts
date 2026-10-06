import type { SxProps, Theme } from "@mui/material/styles";

export const baseGridSx: SxProps<Theme> = {
  border: 0,
  borderRadius: 0,
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  "& .MuiDataGrid-main": {
    borderRadius: 0,
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  },
  "& .MuiDataGrid-virtualScroller": {
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    minHeight: "100%",
  },
  "& .MuiDataGrid-columnHeader": {
    bgcolor: "background.paper",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    width: "100%",
  },
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    width: "100%",
  },
  "& .MuiDataGrid-cell": {
    alignItems: "center",
    display: "flex",
  },
  "& .MuiDataGrid-cell.selection-cell:focus, & .MuiDataGrid-cell.selection-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-cell.row-drag-cell:focus, & .MuiDataGrid-cell.row-drag-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-row.app-grid-drop-before .MuiDataGrid-cell": {
    borderTop: (theme) => `2px solid ${theme.palette.primary.main}`,
  },
  "& .MuiDataGrid-row.app-grid-drop-after .MuiDataGrid-cell": {
    borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
  },
  "& .app-grid-row-subheader": {
    backgroundColor: "action.selected",
  },
  "& .app-grid-row-subheader:hover": {
    backgroundColor: "action.selected",
  },
  "& .MuiDataGrid-sortIcon": {
    display: "none",
  },
  "& .MuiDataGrid-iconButtonContainer": {
    display: "none",
  },
  "& .MuiDataGrid-menuIcon": {
    display: "none",
  },
  "& .app-grid-sort-trigger": {
    opacity: 0,
    pointerEvents: "none",
    visibility: "hidden",
  },
  "& .MuiDataGrid-columnHeader:hover .app-grid-sort-trigger": {
    opacity: 1,
    pointerEvents: "auto",
    visibility: "visible",
  },
  "& .app-grid-sortable-header:hover .app-grid-sort-trigger": {
    opacity: 1,
    pointerEvents: "auto",
    visibility: "visible",
  },
  "& .app-grid-sortable-header-open .app-grid-sort-trigger": {
    opacity: 1,
    pointerEvents: "auto",
    visibility: "visible",
  },
  "& .MuiDataGrid-footerContainer": {
    bgcolor: "action.hover",
    borderTop: 1,
    borderColor: "divider",
  },
};
