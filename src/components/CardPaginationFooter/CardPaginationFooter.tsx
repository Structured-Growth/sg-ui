"use client";
import type { CSSProperties } from "react";
import { useTranslation } from "../../i18n";
import { Pagination } from "../../experimental/Pagination/Pagination";
import { normalizeCardPagination } from "./pagination";
import styles from "./CardPaginationFooter.module.css";

export type AppPaginationFooterProps = {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  /** Omit, pass null or -1 for a server total that is not known. */
  totalCount?: number | null;
  onPageChange: (nextPage: number) => void;
  /** Requests page zero before notifying the host of the new size. */
  onPageSizeChange: (nextPageSize: number) => void;
  /** Requests each page/size transition once; supersedes the separate legacy callbacks when supplied. */
  onPaginationModelChange?: (model: { page: number; pageSize: number }) => void;
  hasNextPage?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export function AppPaginationFooter({ page, pageSize, pageSizeOptions, totalCount, onPageChange,
  onPageSizeChange, onPaginationModelChange, hasNextPage, disabled, label, className, style }: AppPaginationFooterProps) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const normalized = normalizeCardPagination(page, pageSize, totalCount);
  const from = normalized.count === 0 ? 0 : normalized.page * normalized.pageSize + 1;
  const to = Math.min((normalized.page + 1) * normalized.pageSize, normalized.count ?? 0);
  return <footer className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="card-pagination-footer">
    <span className={styles.count}>{normalized.count === undefined
      ? t("common.ui.pagination.unknownTotal", { defaultMessage: "Total unknown", namespace: "common.ui" })
      : t("common.ui.pagination.displayedRows", { defaultMessage: "{from}-{to} of {count}", namespace: "common.ui",
        values: { from, to, count: normalized.count } })}</span>
    <Pagination page={normalized.page} pageSize={normalized.pageSize} pageCount={normalized.pageCount}
      pageSizeOptions={pageSizeOptions} onPageChange={nextPage => {
        if (onPaginationModelChange) onPaginationModelChange({ page: nextPage, pageSize: normalized.pageSize });
        else onPageChange(nextPage);
      }} onPageSizeChange={onPageSizeChange}
      onPaginationChange={onPaginationModelChange ? (nextPage, nextSize) => onPaginationModelChange({ page: nextPage, pageSize: nextSize }) : undefined}
      hasNextPage={hasNextPage} disabled={disabled} label={label} />
  </footer>;
}
