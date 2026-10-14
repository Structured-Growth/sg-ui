"use client";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Typography } from "../../experimental/Typography/Typography";
import styles from "./DocumentEditorLayout.module.css";

export type DocumentEditorLayoutProps = {
  title: string;
  titleNode?: ReactNode;
  headerRight?: ReactNode;
  menuBar?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** The host content owns scrolling; the layout keeps its chrome outside that region. */
export const DocumentEditorLayout = forwardRef<HTMLDivElement, DocumentEditorLayoutProps>(function DocumentEditorLayout(
  { title, titleNode, headerRight, menuBar, toolbar, children, className, style }, ref,
) {
  return <div ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-part="document-editor-layout">
    <div className={styles.header} data-has-menu={Boolean(menuBar) || undefined} data-sgui-part="document-editor-header">
      <div className={styles.headerRow}>
        <div className={styles.title} data-sgui-part="document-editor-title">
          {titleNode ?? <Typography as="p" variant="subtitle1" className={styles.fallbackTitle}>{title}</Typography>}
        </div>
        {headerRight != null && <div className={styles.actions} data-sgui-part="document-editor-actions">{headerRight}</div>}
      </div>
    </div>
    {menuBar ? <div className={styles.menu} data-sgui-part="document-editor-menu">{menuBar}</div> : null}
    {toolbar ? <div className={styles.toolbar} data-sgui-part="document-editor-toolbar">{toolbar}</div> : null}
    <div className={styles.content} data-sgui-part="document-editor-content">{children}</div>
  </div>;
});
