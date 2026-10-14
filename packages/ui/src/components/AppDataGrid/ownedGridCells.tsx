"use client";

import { forwardRef, useEffect, useRef, useState, type ReactElement, type Ref } from "react";
import { useTranslation } from "../../i18n";
import { Link } from "../../experimental/Link/Link";
import { IconButton } from "../../experimental/IconButton/IconButton";
import { Menu } from "../../experimental/Menu/Menu";
import { ContentCopyIcon } from "../../experimental/icons/ContentCopyIcon";
import { MoreVertIcon } from "../../experimental/icons/MoreVertIcon";
import type { OwnedGridMenuAction, OwnedGridPresentationColumn } from "./ownedGridColumns";
import styles from "./ownedGridCells.module.css";

export interface OwnedGridDateFormatContext {
  locale: string;
  timeZone?: string;
  dateOnly: boolean;
  cellType: "date" | "dateTime";
}
export interface OwnedGridCellProps<Row> {
  row: Row;
  column: OwnedGridPresentationColumn<Row>;
  /** Raw accessor value; sorting and filtering must never use display formatting. */
  value: unknown;
  locale?: string;
  timeZone?: string;
  formatDate?: (date: Date, context: OwnedGridDateFormatContext) => string;
  rowLabel?: string;
  /** Ellipsize text by default; false preserves line breaks and wraps long values. */
  truncate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ownedGridText(value: unknown, fallbackText = "—"): string {
  if (value === null || value === undefined || value === "") return fallbackText;
  try { return String(value); } catch { return fallbackText; }
}

/** Unsupported/cyclic data falls back without exposing unescaped HTML. */
export function ownedGridJson(value: unknown, fallbackText = "—"): string {
  if (value === null || value === undefined) return fallbackText;
  try { return JSON.stringify(value) ?? fallbackText; } catch { return fallbackText; }
}

export function formatOwnedGridDate(value: unknown, context: Omit<OwnedGridDateFormatContext, "dateOnly">,
  fallbackText = "—", formatter?: OwnedGridCellProps<unknown>["formatDate"]): string {
  let date: Date;
  let dateOnly = false;
  if (value instanceof Date) date = new Date(value.getTime());
  else if (typeof value === "number" && Number.isFinite(value)) date = new Date(value);
  else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return fallbackText;
    dateOnly = true;
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) {
    date = new Date(value);
    // Date.parse rolls invalid calendar days forward; reject them as display inputs.
    const day = value.slice(0, 10);
    const calendar = new Date(`${day}T00:00:00.000Z`);
    if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== day) return fallbackText;
  } else return fallbackText;
  if (!Number.isFinite(date.getTime())) return fallbackText;
  const timeZone = dateOnly ? "UTC" : context.timeZone;
  try {
    if (formatter) return formatter(date, { ...context, timeZone, dateOnly });
    return new Intl.DateTimeFormat(context.locale, { year: "numeric", month: "short", day: "numeric",
      ...(context.cellType === "dateTime" && !dateOnly ? { hour: "numeric", minute: "2-digit" } : {}), timeZone }).format(date);
  } catch { return fallbackText; }
}

function CopyCell({ text, unavailable, textClassName }: { text: string; unavailable: boolean; textClassName: string }) {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [pending, setPending] = useState(false);
  const generation = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearFeedbackTimer = () => {
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = undefined;
  };
  useEffect(() => {
    generation.current += 1;
    clearFeedbackTimer();
    setFeedback(null);
    setPending(false);
    return () => { generation.current += 1; clearFeedbackTimer(); };
  }, [text, unavailable]);
  const copy = async () => {
    const current = ++generation.current;
    clearFeedbackTimer();
    const announce = (result: "success" | "error") => {
      if (generation.current !== current) return;
      setFeedback(result);
      feedbackTimer.current = setTimeout(() => {
        if (generation.current === current) setFeedback(null);
        feedbackTimer.current = undefined;
      }, 3000);
    };
    setFeedback(null);
    setPending(true);
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      announce("success");
    } catch {
      announce("error");
    } finally { if (generation.current === current) setPending(false); }
  };
  return <><span className={textClassName} title={text}>{text}</span>
    <IconButton label={t("common.ui.common.copy", { defaultMessage: "Copy" })} density="compact"
      disabled={unavailable} loading={pending} onPress={() => { void copy(); }}><ContentCopyIcon /></IconButton>
    <span className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
      {feedback === "success" ? t("common.ui.grid.copySuccess", { defaultMessage: "Copied" }) :
        feedback === "error" ? t("common.ui.grid.copyError", { defaultMessage: "Unable to copy" }) : ""}
    </span></>;
}

function ImageCell({ src, alt, fallbackText }: { src?: string | null; alt: string; fallbackText: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  return src && src !== failedSource ? <img key={src} src={src} alt={alt} className={styles.image}
    onError={() => setFailedSource(src)} /> : <span className={styles.fallback}>{fallbackText}</span>;
}

function MenuCell<Row>({ row, actions, rowLabel }: { row: Row; actions: readonly OwnedGridMenuAction<Row>[]; rowLabel?: string }) {
  const { t } = useTranslation();
  const label = rowLabel ? t("common.ui.grid.namedRowActions", { defaultMessage: "Actions for {row}", values: { row: rowLabel } }) :
    t("common.ui.grid.rowActions", { defaultMessage: "Row actions" });
  return <Menu label={label} density="compact" placement="bottom end"
    trigger={<IconButton label={label} density="compact" disabled={actions.length === 0}><MoreVertIcon /></IconButton>}
    items={actions.map(action => ({ id: action.id, label: action.label, href: action.href,
      target: action.target, rel: action.rel, disabled: action.disabled || action.pending || (!action.href && !action.onPress) }))}
    onAction={id => {
      const action = actions.find(item => item.id === id);
      if (action && !action.disabled && !action.pending) action.onPress?.(row);
    }} />;
}

function Cell<Row>({ row, column, value, locale, timeZone, formatDate, rowLabel, truncate = column.truncate ?? true, className, style }: OwnedGridCellProps<Row>, ref: Ref<HTMLDivElement>) {
  const translation = useTranslation();
  const fallback = column.fallbackText ?? "—";
  const type = column.cellType ?? "text";
  const textClassName = truncate ? styles.text : styles.wrappedText;
  const text = column.formatValue ? ownedGridText(column.formatValue(value, row), fallback) : type === "json" ? ownedGridJson(value, fallback) :
    type === "date" || type === "dateTime" ? formatOwnedGridDate(value, { locale: locale ?? translation.locale, timeZone, cellType: type }, fallback, formatDate) : ownedGridText(value, fallback);
  let content;
  if (type === "custom") content = column.renderCustomCell?.(row) ?? fallback;
  else if (type === "image") content = <ImageCell src={column.getImageSrc?.(row)} alt={rowLabel ?? ""} fallbackText={fallback} />;
  else if (type === "menu") content = <MenuCell row={row} rowLabel={rowLabel} actions={column.getMenuActions?.(row) ?? []} />;
  else if (type === "copyable") content = <CopyCell text={text} textClassName={textClassName} unavailable={value === null || value === undefined || value === ""} />;
  else if (type === "link") {
    const link = column.getLink?.(row);
    content = link?.href ? <Link href={link.href} target={link.target} rel={link.rel} underline="none" className={textClassName} title={link.abbr ?? link.label ?? text}>
      {link.label ?? text}</Link> : <span className={textClassName} title={text}>{text}</span>;
  } else content = <span className={textClassName} title={text}>{text}</span>;
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style}
    data-sgui-part="grid-cell-content" data-cell-type={type} data-truncate={truncate}>{content}</div>;
}

/** Internal presentation proof; no retired engine params enter this boundary. */
export const OwnedGridCell = forwardRef(Cell) as <Row>(props: OwnedGridCellProps<Row> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
