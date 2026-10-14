"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { Menu } from "../../experimental/Menu/Menu";
import { Progress } from "../../experimental/Progress/Progress";
import { Status } from "../../experimental/Status/Status";
import { Typography, type TypographyVariant } from "../../experimental/Typography/Typography";
import { ArrowDropDownIcon, ChevronRightIcon, EditIcon, ExpandMoreIcon, SortIcon } from "../../experimental/icons";
import { useTranslation } from "../../i18n";
import styles from "./ownedGridParts.module.css";

interface GridPartStyle {
  className?: string;
  style?: CSSProperties;
}

export interface OwnedGridHeaderSortMenuProps extends GridPartStyle {
  label: string;
  sortDirection?: "asc" | "desc";
  disabled?: boolean;
  onSortSelect: (direction: "asc" | "desc" | undefined) => void;
}

/** Internal header part. The owning grid updates its canonical ordered sort rules. */
export const OwnedGridHeaderSortMenu = forwardRef<HTMLDivElement, OwnedGridHeaderSortMenuProps>(function OwnedGridHeaderSortMenu(
  { label, sortDirection, disabled, onSortSelect, className, style }, ref,
) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const accessibleName = t("common.ui.headerSort.column", { defaultMessage: "Sort {column}", values: { column: label }, namespace: "common.ui" });
  return <div ref={ref} className={[styles.header, className].filter(Boolean).join(" ")} style={style} data-sgui-part="grid-sort-header">
    <Typography as="span" variant="bodyAlt2" noWrap className={styles.headerLabel}>{label}</Typography>
    {sortDirection && <span aria-hidden="true" data-direction={sortDirection} className={styles.sortIndicator}><SortIcon /></span>}
    <Menu label={accessibleName} density="compact" selectionMode="single"
      trigger={<Button aria-label={accessibleName} disabled={disabled} variant="text" tone="neutral" density="compact" className={styles.iconButton}><ArrowDropDownIcon /></Button>}
      items={[
        { id: "asc", label: t("common.ui.headerSort.ascending", { defaultMessage: "Sort Ascending", namespace: "common.ui" }), selected: sortDirection === "asc" },
        { id: "desc", label: t("common.ui.headerSort.descending", { defaultMessage: "Sort Descending", namespace: "common.ui" }), selected: sortDirection === "desc" },
        ...(sortDirection ? [{ id: "clear", label: t("common.ui.headerSort.clear", { defaultMessage: "Clear Sort", namespace: "common.ui" }), separatorBefore: true }] : []),
      ]}
      onAction={id => { if (id === "asc" || id === "desc") onSortSelect(id); else if (id === "clear") onSortSelect(undefined); }} />
  </div>;
});

export interface OwnedGridStatusProps extends GridPartStyle {
  state: "loading" | "refreshing" | "empty" | "noResults" | "error";
  /** A host-translated description; errors and data retrieval remain host-owned. */
  message?: string;
  onRetry?: () => void;
}

/** Render alongside retained rows during refresh, rather than replacing the grid. */
export const OwnedGridStatus = forwardRef<HTMLDivElement, OwnedGridStatusProps>(function OwnedGridStatus(
  { state, message, onRetry, className, style }, ref,
) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const defaults = {
    loading: ["common.ui.grid.loading", "Loading rows"],
    refreshing: ["common.ui.grid.refreshing", "Refreshing rows"],
    empty: ["common.ui.grid.empty", "No rows available"],
    noResults: ["common.ui.grid.noResults", "No results found"],
    error: ["common.ui.grid.error", "Unable to load rows"],
  } as const;
  const [key, defaultMessage] = defaults[state];
  const label = message ?? t(key, { defaultMessage, namespace: "common.ui" });
  const pending = state === "loading" || state === "refreshing";
  return <Status ref={ref} announcement={state === "error" ? "assertive" : "polite"} tone={state === "error" ? "danger" : "neutral"}
    className={[styles.status, className].filter(Boolean).join(" ")} style={style}>
    {pending && <Progress variant="circular" aria-label={label} className={styles.progress} />}
    <span data-sgui-part="grid-status-message">{label}</span>
    {state === "error" && onRetry && <Button variant="outlined" tone="neutral" density="compact" onPress={() => onRetry()}>
      {t("common.ui.grid.retry", { defaultMessage: "Retry", namespace: "common.ui" })}
    </Button>}
  </Status>;
});

export interface OwnedGridRowSubHeaderProps extends GridPartStyle {
  title: string;
  expanded?: boolean;
  onToggle?: () => void;
  trailingContent?: ReactNode;
  titleVariant?: TypographyVariant;
  onTitleDoubleClick?: () => void;
  titleTooltip?: string;
}

/** Internal owned mapping; expansion is a host action, not a grid expansion model. */
export const OwnedGridRowSubHeader = forwardRef<HTMLDivElement, OwnedGridRowSubHeaderProps>(function OwnedGridRowSubHeader(
  { title, expanded = true, onToggle, trailingContent, titleVariant = "body2", onTitleDoubleClick, titleTooltip, className, style }, ref,
) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  return <div ref={ref} className={[styles.subHeader, className].filter(Boolean).join(" ")} style={style} data-sgui-part="grid-row-subheader">
    {onToggle && <Button variant="text" tone="neutral" density="compact" className={styles.iconButton} onPress={() => onToggle()}
      aria-expanded={expanded} aria-label={t(expanded ? "common.ui.grid.collapseSection" : "common.ui.grid.expandSection", {
        defaultMessage: expanded ? "Collapse {section}" : "Expand {section}", values: { section: title }, namespace: "common.ui",
      })}>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</Button>}
    <Typography as="span" variant={titleVariant} onDoubleClick={onTitleDoubleClick ? () => onTitleDoubleClick() : undefined} title={titleTooltip}>{title}</Typography>
    {onTitleDoubleClick && <Button variant="text" tone="neutral" density="compact" className={styles.iconButton} onPress={() => onTitleDoubleClick()}
      aria-label={t("common.ui.grid.editSectionTitle", { defaultMessage: "Edit {section} title", values: { section: title }, namespace: "common.ui" })}><EditIcon /></Button>}
    {trailingContent != null && <div className={styles.trailing} data-sgui-part="grid-row-subheader-actions">{trailingContent}</div>}
  </div>;
});
