"use client";
import { forwardRef, type CSSProperties } from "react";
import { useTranslation } from "../../i18n";
import { Button } from "../../components/Button/Button";
import { Select } from "../Select/Select";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  /** Zero-based page index, owned by the host. */
  page: number;
  onPageChange: (page: number) => void;
  /** Omit when the server does not report a total. */
  pageCount?: number;
  /** Used only when pageCount is unknown. */
  hasNextPage?: boolean;
  pageSize?: number;
  /** Suggested positive safe integer sizes; invalid values and duplicates are ignored. */
  pageSizeOptions?: readonly number[];
  /** A size change requests page zero and the new size together. */
  onPaginationChange?: (page: number, pageSize: number) => void;
  disabled?: boolean;
  showBoundaryButtons?: boolean;
  /** Host-translated landmark label; useful for multiple paginated views. */
  label?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({ page, onPageChange,
  pageCount, hasNextPage = false, pageSize, pageSizeOptions = [25, 50, 100], onPaginationChange,
  disabled = false, showBoundaryButtons = true, label, className, ...props }, ref) {
  const { t } = useTranslation();
  const previous = !disabled && page > 0;
  const next = !disabled && (pageCount === undefined ? hasNextPage : page + 1 < pageCount);
  const sizes = [...new Set([...pageSizeOptions, ...(pageSize === undefined ? [] : [pageSize])])]
    .filter(size => Number.isSafeInteger(size) && size > 0).sort((a, b) => a - b);
  return <nav {...props} ref={ref} aria-label={label ?? t("common.ui.pagination", { defaultMessage: "Pagination" })}
    className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="pagination">
    <span className={styles.summary}>{pageCount === 0 ? t("common.ui.noPages", { defaultMessage: "No pages" }) :
      pageCount === undefined ? t("common.ui.pageNumber", { defaultMessage: "Page {page}", values: { page: page + 1 } }) :
      t("common.ui.pageOfCount", { defaultMessage: "Page {page} of {count}", values: { page: page + 1, count: pageCount } })}</span>
    {pageSize !== undefined && onPaginationChange && <Select className={styles.size}
      label={t("common.ui.pageSize", { defaultMessage: "Rows per page" })}
      value={String(pageSize)} disabled={disabled} placeholder=""
      options={sizes.map(size => ({ id: String(size), label: String(size) }))}
      onValueChange={value => {
        if (value !== null) onPaginationChange(0, Number(value));
      }} />}
    <div className={styles.actions}>
      {showBoundaryButtons && <Button variant="outlined" tone="neutral" disabled={!previous} onPress={() => onPageChange(0)}>{t("common.ui.firstPage", { defaultMessage: "First page" })}</Button>}
      <Button variant="outlined" tone="neutral" disabled={!previous} onPress={() => onPageChange(page - 1)}>{t("common.ui.previousPage", { defaultMessage: "Previous page" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={!next} onPress={() => onPageChange(page + 1)}>{t("common.ui.nextPage", { defaultMessage: "Next page" })}</Button>
      {showBoundaryButtons && pageCount !== undefined && <Button variant="outlined" tone="neutral" disabled={!next} onPress={() => onPageChange(Math.max(0, pageCount - 1))}>{t("common.ui.lastPage", { defaultMessage: "Last page" })}</Button>}
    </div>
  </nav>;
});
