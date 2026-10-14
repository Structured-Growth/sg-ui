"use client";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { AppPaginationFooter } from "../CardPaginationFooter/CardPaginationFooter";
import { normalizeCardPagination } from "../CardPaginationFooter/pagination";
import { Status } from "../../experimental/Status/Status";
import styles from "./CardCollectionWithFooter.module.css";

export type CardCollectionWithFooterProps<TRow> = {
  rows: TRow[];
  getRowId: (row: TRow) => string;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextPageSize: number) => void;
  renderCard: (row: TRow) => ReactNode;
  loading?: boolean;
  emptyContent?: ReactNode;
  loadingContent?: ReactNode;
  paginationLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export function CardCollectionWithFooter<TRow>({ rows, getRowId, page, pageSize, pageSizeOptions,
  onPageChange, onPageSizeChange, renderCard, loading = false, emptyContent, loadingContent,
  paginationLabel, className, style }: CardCollectionWithFooterProps<TRow>) {
  const { t } = useTranslation();
  const normalized = normalizeCardPagination(page, pageSize, rows.length);
  const start = normalized.page * normalized.pageSize;
  const pagedRows = rows.slice(start, start + normalized.pageSize);
  return <div className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="card-collection">
    <div className={styles.grid} aria-busy={loading} data-sgui-part="card-collection-grid">
      {loading ? <Status>{loadingContent ?? t("common.ui.cards.loading", { defaultMessage: "Loading courses" })}</Status>
        : pagedRows.length ? pagedRows.map(row => <div key={getRowId(row)} className={styles.item}>{renderCard(row)}</div>)
        : <Status>{emptyContent ?? t("common.ui.cards.empty", { defaultMessage: "No courses" })}</Status>}
    </div>
    <AppPaginationFooter page={normalized.page} pageSize={normalized.pageSize} pageSizeOptions={pageSizeOptions}
      totalCount={rows.length} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange}
      disabled={loading} label={paginationLabel} />
  </div>;
}
