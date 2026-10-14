"use client";
import { forwardRef, type CSSProperties } from "react";
import { Link } from "../Link/Link";
import { Typography } from "../Typography/Typography";
import { useTranslation } from "../../i18n";
import styles from "./Breadcrumbs.module.css";
export interface BreadcrumbItem { id: string; label: string; href?: string; }
export interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
  label?: string;
  className?: string;
  style?: CSSProperties;
}
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({ items, label, className, style }, ref) {
  const { t } = useTranslation();
  return <nav ref={ref} aria-label={label ?? t("common.ui.breadcrumbs", { defaultMessage: "Breadcrumbs" })} className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
    <ol className={styles.list}>{items.map((item, index) => <li key={item.id} className={styles.item}>
      {index > 0 && <span aria-hidden="true" className={styles.separator}>/</span>}
      <Typography as="span" variant="body2">{index < items.length - 1 && item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}</Typography>
    </li>)}</ol>
  </nav>;
});
