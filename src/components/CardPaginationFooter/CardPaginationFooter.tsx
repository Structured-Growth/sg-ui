"use client";

import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import { useTranslation } from "../../i18n";

type AppPaginationFooterProps = {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalCount: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
};

export function AppPaginationFooter({
  page,
  pageSize,
  pageSizeOptions,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: AppPaginationFooterProps) {
  const maxPage = totalCount === 0 ? 0 : Math.max(Math.ceil(totalCount / pageSize) - 1, 0);
  const clampedPage = Math.min(page, maxPage);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });

  return (
    <Box
      sx={{
        bgcolor: "action.hover",
        borderTop: 1,
        borderColor: "divider",
        minHeight: 53,
      }}
    >
      <TablePagination
        component="div"
        count={totalCount}
        onPageChange={(_, nextPage) => {
          onPageChange(nextPage);
        }}
        onRowsPerPageChange={(event) => {
          onPageSizeChange(Number(event.target.value));
        }}
        getItemAriaLabel={(type) => {
          if (type === "first") {
            return tr("common.ui.pagination.firstPage", "Go to first page");
          }
          if (type === "last") {
            return tr("common.ui.pagination.lastPage", "Go to last page");
          }
          if (type === "next") {
            return tr("common.ui.pagination.nextPage", "Go to next page");
          }
          return tr("common.ui.pagination.previousPage", "Go to previous page");
        }}
        labelDisplayedRows={({ from, to, count }) =>
          tr("common.ui.pagination.displayedRows", "{from}-{to} of {count}")
            .replace("{from}", String(from))
            .replace("{to}", String(to))
            .replace("{count}", String(count))
        }
        labelRowsPerPage={tr("common.ui.pagination.rowsPerPage", "Rows per page:")}
        page={clampedPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={pageSizeOptions}
        showFirstButton
        showLastButton
        sx={{
          "& .MuiTablePagination-toolbar": {
            minHeight: 53,
            px: 2,
          },
        }}
      />
    </Box>
  );
}
