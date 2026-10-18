"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode, type FocusEvent } from "react";
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
  const revealFrame = useRef<number | null>(null);
  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
  }, []);
  const revealFocusedControl = (event: FocusEvent<HTMLDivElement>) => {
    const port = event.currentTarget, control = event.target;
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
    // Native WebKit scrolling can reveal only the input caret. Preserve focus
    // and reveal the entire control inside this collection's own scrollport.
    revealFrame.current = requestAnimationFrame(() => {
      revealFrame.current = null;
      if (!port.isConnected || port.ownerDocument.activeElement !== control) return;
      const box = port.getBoundingClientRect(), rect = control.getBoundingClientRect();
      if (!port.clientHeight || !rect.height) return;
      const css = getComputedStyle(control);
      const outline = css.outlineStyle === "none" ? 0
        : Math.max(0, (parseFloat(css.outlineWidth) || 0) + (parseFloat(css.outlineOffset) || 0));
      const top = box.top + port.clientTop, bottom = top + port.clientHeight;
      const delta = rect.top - outline < top ? rect.top - outline - top
        : rect.bottom + outline > bottom ? rect.bottom + outline - bottom : 0;
      if (delta) port.scrollTop = Math.max(0, Math.min(port.scrollHeight - port.clientHeight, port.scrollTop + delta));
    });
  };
  const { t } = useTranslation();
  const normalized = normalizeCardPagination(page, pageSize, rows.length);
  const start = normalized.page * normalized.pageSize;
  const pagedRows = rows.slice(start, start + normalized.pageSize);
  return <div className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="card-collection">
    <div className={styles.grid} aria-busy={loading} data-sgui-part="card-collection-grid" onFocusCapture={revealFocusedControl}>
      {loading ? <Status>{loadingContent ?? t("common.ui.cards.loading", { defaultMessage: "Loading courses" })}</Status>
        : pagedRows.length ? pagedRows.map(row => <div key={getRowId(row)} className={styles.item}>{renderCard(row)}</div>)
        : <Status>{emptyContent ?? t("common.ui.cards.empty", { defaultMessage: "No courses" })}</Status>}
    </div>
    <AppPaginationFooter page={normalized.page} pageSize={normalized.pageSize} pageSizeOptions={pageSizeOptions}
      totalCount={rows.length} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange}
      disabled={loading} label={paginationLabel} />
  </div>;
}
