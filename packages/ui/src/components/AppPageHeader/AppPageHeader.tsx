"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "../../experimental/Link/Link";
import { Menu } from "../../experimental/Menu/Menu";
import { IconButton } from "../../experimental/IconButton/IconButton";
import { Typography } from "../../experimental/Typography/Typography";
import { MoreHorizIcon } from "../../experimental/icons/MoreHorizIcon";
import { MoreVertIcon } from "../../experimental/icons/MoreVertIcon";
import { useTranslation } from "../../i18n";
import styles from "./AppPageHeader.module.css";
export type AppPageHeaderBreadcrumb = { label: string; href?: string; };
export type AppPageHeaderMetaItem = { id?: string; icon?: ReactNode; label: string; };
export type AppPageHeaderMenuItem = { id?: string; label: string; href?: string; onClick?: () => void; disabled?: boolean; danger?: boolean; };
export type AppPageHeaderProps = {
  title: string;
  breadcrumbs?: readonly AppPageHeaderBreadcrumb[];
  description?: string;
  metaItems?: readonly AppPageHeaderMetaItem[];
  moreMenuItems?: readonly AppPageHeaderMenuItem[];
  actionButtons?: ReactNode;
  /** Existing headers are subpages. Primary headers use the main surface. */
  hierarchy?: "primary" | "subpage";
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  style?: CSSProperties;
};
export const AppPageHeader = forwardRef<HTMLElement, AppPageHeaderProps>(function AppPageHeader(
  { title, breadcrumbs = [], description, metaItems = [], moreMenuItems = [], actionButtons, hierarchy = "subpage", headingLevel = 1, className, style }, ref,
) {
  const { t } = useTranslation();
  const pathLabel = t("common.ui.showPath", { defaultMessage: "Show path" });
  const actionsLabel = t("common.ui.moreActions", { defaultMessage: "More actions" });
  const collapsed = breadcrumbs.length > 3;
  const visible = collapsed ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 2], breadcrumbs[breadcrumbs.length - 1]] : breadcrumbs;
  const hidden = collapsed ? breadcrumbs.slice(1, -2) : [];
  return <header ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-hierarchy={hierarchy} data-sgui-part="page-header">
    {breadcrumbs.length > 0 && <nav aria-label={t("common.ui.breadcrumbs", { defaultMessage: "Breadcrumbs" })}>
      <ol className={styles.breadcrumbs}>{visible.map((crumb, index) => <li className={styles.crumb} key={`${index}-${crumb.label}`}>
        {index > 0 && <span aria-hidden="true">›</span>}
        {collapsed && index === 1 && <><Menu density="compact" label={pathLabel} trigger={<IconButton label={pathLabel} density="compact"><MoreHorizIcon /></IconButton>}
          items={hidden.map((item, i) => ({ id: String(i), label: item.label, href: item.href }))} /><span aria-hidden="true">›</span></>}
        {crumb.href && index < visible.length - 1 ? <Link href={crumb.href} tone="inherit" underline="none">{crumb.label}</Link> :
          <span aria-current={index === visible.length - 1 ? "page" : undefined}>{crumb.label}</span>}
      </li>)}</ol>
    </nav>}
    <div className={styles.row}>
      <div className={styles.text}><Typography as={`h${headingLevel}`} variant="h1">{title}</Typography>
        {description && <Typography variant="h5" className={styles.description}>{description}</Typography>}</div>
      {metaItems.length > 0 && <div className={styles.metadata} data-sgui-part="page-header-metadata">{metaItems.map((item, i) =>
        <div className={styles.metaItem} key={item.id ?? `${i}-${item.label}`}>
          {item.icon && <span aria-hidden="true" className={styles.icon}>{item.icon}</span>}<Typography variant="body2">{item.label}</Typography>
        </div>)}</div>}
      {actionButtons ? <div className={styles.actions} data-sgui-part="page-header-actions">{actionButtons}</div> : moreMenuItems.length > 0 &&
        <div className={styles.actions}><Menu density="compact" label={actionsLabel} placement="bottom end"
          trigger={<IconButton label={actionsLabel} density="compact"><MoreVertIcon /></IconButton>}
          items={moreMenuItems.map((item, i) => ({ id: String(i), label: item.label, href: item.href, disabled: item.disabled, tone: item.danger ? "danger" : "default" }))}
          onAction={id => moreMenuItems[Number(id)]?.onClick?.()} /></div>}
    </div>
  </header>;
});
