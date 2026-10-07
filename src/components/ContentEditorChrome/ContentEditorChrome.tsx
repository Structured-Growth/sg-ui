"use client";
import { forwardRef, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "../../experimental/Button/Button";
import { useTranslation } from "../../i18n";
import { EditableTitleField } from "../EditableTitleField";
import styles from "./ContentEditorChrome.module.css";

export type ContentEditorChromeMenuItem = {
  id: string;
  label: string;
  /** One pointer/keyboard activation. Replaces onClick(event): use anchor instead of event.currentTarget. */
  onPress?: (anchor: HTMLButtonElement) => void;
  disabled?: boolean;
  loading?: boolean;
  "aria-haspopup"?: "menu" | "dialog";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

export type ContentEditorChromeProps = {
  icon: ReactNode;
  title: string;
  onTitleSave: (nextTitle: string) => Promise<void> | void;
  menuItems: readonly ContentEditorChromeMenuItem[];
  rightSlot?: ReactNode;
  titleReadOnly?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

function ChromeAction({ item }: { item: ContentEditorChromeMenuItem }) {
  const anchor = useRef<HTMLButtonElement>(null);
  return <Button ref={anchor} className={styles.action} variant="text" tone="neutral" density="compact"
    disabled={item.disabled || !item.onPress} loading={item.loading}
    aria-haspopup={item["aria-haspopup"]} aria-expanded={item["aria-expanded"]} aria-controls={item["aria-controls"]}
    onPress={() => { if (anchor.current) item.onPress?.(anchor.current); }}>{item.label}</Button>;
}

export const ContentEditorChrome = forwardRef<HTMLDivElement, ContentEditorChromeProps>(function ContentEditorChrome({
  icon, title, onTitleSave, menuItems, rightSlot, titleReadOnly = false, className, ...props
}, ref) {
  const { t } = useTranslation();
  return <div {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="content-editor-chrome">
    {icon != null && <div className={styles.icon} aria-hidden="true" data-sgui-part="editor-icon">{icon}</div>}
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.title} data-sgui-part="editor-title"><EditableTitleField minWidth={0} onSave={onTitleSave} title={title} variant="h4" readOnly={titleReadOnly} /></div>
        {rightSlot != null && <div className={styles.right} data-sgui-part="editor-status">{rightSlot}</div>}
      </div>
      {menuItems.length > 0 && <div className={styles.actions} role="group" aria-label={t("common.ui.documentActions", { defaultMessage: "Document actions" })} data-sgui-part="editor-actions">
        {menuItems.map(item => <ChromeAction key={item.id} item={item} />)}
      </div>}
    </div>
  </div>;
});
