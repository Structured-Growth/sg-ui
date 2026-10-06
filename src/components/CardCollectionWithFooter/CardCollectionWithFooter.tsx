import type { ReactNode } from "react";
import { AppPaginationFooter } from "../CardPaginationFooter";
import { Box } from "../primitives";

type CardCollectionWithFooterProps<TRow> = {
  rows: TRow[];
  getRowId: (row: TRow) => string;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
  renderCard: (row: TRow) => ReactNode;
};

export function CardCollectionWithFooter<TRow>({
  rows,
  getRowId,
  page,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  renderCard,
}: CardCollectionWithFooterProps<TRow>) {
  const totalCount = rows.length;
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedRows = rows.slice(startIndex, endIndex);

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 0 }}>
      <Box
        sx={{
          display: "grid",
          flex: 1,
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fill, minmax(360px, 1fr))" },
          minHeight: 0,
          overflow: "auto",
          p: 2,
        }}
      >
        {pagedRows.map((row) => (
          <Box key={getRowId(row)}>{renderCard(row)}</Box>
        ))}
      </Box>

      <AppPaginationFooter
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        totalCount={totalCount}
      />
    </Box>
  );
}
