"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "../../experimental/Button/Button";
import { Dialog } from "../../experimental/Dialog/Dialog";
import { IconButton } from "../../experimental/IconButton/IconButton";
import { Menu } from "../../experimental/Menu/Menu";
import { TextField } from "../../experimental/TextField/TextField";
import { Typography } from "../../experimental/Typography/Typography";
import { AddIcon } from "../../experimental/icons/AddIcon";
import { DragIndicatorIcon } from "../../experimental/icons/DragIndicatorIcon";
import { MoreVertIcon } from "../../experimental/icons/MoreVertIcon";
import { useTranslation } from "../../i18n";
import styles from "./ExperiencePageNavigator.module.css";

export type ExperiencePageNavigatorItem = { key: string; title: string };
export type ExperiencePageNavigatorProps = {
  pages: ExperiencePageNavigatorItem[];
  activePageKey: string | null;
  onSelectPage: (pageKey: string) => void;
  onAddPage: () => void;
  onRemovePage: (pageKey: string) => void;
  onRenamePage: (pageKey: string, title: string) => void;
  onReorderPages: (sourceKey: string, targetKey: string) => void;
  title?: string;
  readOnly?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function ExperiencePageNavigator({ pages, activePageKey, onSelectPage, onAddPage,
  onRemovePage, onRenamePage, onReorderPages, title, readOnly = false, className, style }: ExperiencePageNavigatorProps) {
  const { t } = useTranslation();
  const [editingPageKey, setEditingPageKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const selectionRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingRemoval = useRef<{ removed: string; next: string } | null>(null);
  useEffect(() => {
    const pending = pendingRemoval.current;
    if (pending && !pages.some(page => page.key === pending.removed)) {
      // Menu restoration runs on the next frame; focus a surviving row after it.
      const frame = requestAnimationFrame(() => selectionRefs.current.get(pending.next)?.focus());
      pendingRemoval.current = null;
      return () => cancelAnimationFrame(frame);
    }
  }, [pages]);
  const headingId = useId();
  const formId = useId();
  const editLabel = t("experience.pages.editName", { defaultMessage: "Edit Page Name" });
  const closeRename = () => { setEditingPageKey(null); setEditingTitle(""); };
  const saveRename = () => {
    const existing = pages.find(page => page.key === editingPageKey);
    const nextTitle = editingTitle.trim();
    if (!readOnly && existing && nextTitle && nextTitle !== existing.title) onRenamePage(existing.key, nextTitle);
    closeRename();
  };
  return <section aria-labelledby={headingId} style={style}
    className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="page-navigator">
    <header className={styles.header}>
      <Typography as="h2" variant="body2" id={headingId}>{title ?? t("experience.pages.title", { defaultMessage: "Pages" })}</Typography>
      <Button disabled={readOnly} onPress={onAddPage} density="compact" tone="neutral" variant="outlined" startIcon={<AddIcon />}>
        {t("common.ui.add", { defaultMessage: "Add" })}
      </Button>
    </header>
    <ul className={styles.list} data-sgui-part="page-list">
      {pages.map((page, index) => {
        const actionsLabel = t("experience.pages.actions", { defaultMessage: "Actions for {title}", values: { title: page.title } });
        return <li key={page.key} className={styles.row} data-active={page.key === activePageKey || undefined}
          draggable={!readOnly} onDragStart={event => { if (!readOnly) event.dataTransfer.setData("text/page-key", page.key); }}
          onDragOver={event => { if (!readOnly) event.preventDefault(); }}
          onDrop={event => {
            if (readOnly) return;
            event.preventDefault();
            const sourceKey = event.dataTransfer.getData("text/page-key");
            if (sourceKey !== page.key && pages.some(item => item.key === sourceKey)) onReorderPages(sourceKey, page.key);
          }}>
          <span className={styles.handle} aria-hidden="true"><DragIndicatorIcon /></span>
          <Button variant="text" tone="neutral" className={styles.page} onPress={() => onSelectPage(page.key)}
            ref={node => { if (node) selectionRefs.current.set(page.key, node); else selectionRefs.current.delete(page.key); }}
            aria-current={page.key === activePageKey ? "page" : undefined}>
            <span className={styles.pageText}><Typography as="span" variant="body2">{page.title}</Typography>
              <Typography as="span" variant="caption" tone="muted">{t("experience.pages.position", { defaultMessage: "Page {number}", values: { number: index + 1 } })}
                {page.key === activePageKey && <> • {t("experience.pages.active", { defaultMessage: "Active" })}</>}</Typography></span>
          </Button>
          <Menu label={actionsLabel} density="compact" placement="bottom end"
            trigger={<IconButton label={actionsLabel} disabled={readOnly} density="compact" className={styles.actions}><MoreVertIcon /></IconButton>}
            items={[
              { id: "rename", label: editLabel, disabled: readOnly },
              { id: "remove", label: t("common.ui.remove", { defaultMessage: "Remove" }), disabled: readOnly || pages.length <= 1 },
              { id: "up", label: t("experience.pages.moveUp", { defaultMessage: "Move up" }), disabled: readOnly || index === 0 },
              { id: "down", label: t("experience.pages.moveDown", { defaultMessage: "Move down" }), disabled: readOnly || index === pages.length - 1 },
            ]} onAction={action => {
              if (readOnly) return;
              if (action === "rename") { setEditingPageKey(page.key); setEditingTitle(page.title); }
              if (action === "remove" && pages.length > 1) {
                pendingRemoval.current = { removed: page.key, next: (pages[index + 1] ?? pages[index - 1]).key };
                onRemovePage(page.key);
              }
              const target = pages[action === "up" ? index - 1 : action === "down" ? index + 1 : -1];
              if (target) onReorderPages(page.key, target.key);
            }} />
        </li>;
      })}
    </ul>
    <Dialog open={editingPageKey !== null} title={editLabel} size="sm" onDismiss={closeRename}
      footer={<><Button variant="outlined" tone="neutral" onPress={closeRename}>{t("common.ui.cancel", { defaultMessage: "Cancel" })}</Button>
        <Button type="submit" form={formId} disabled={readOnly}>{t("common.ui.save", { defaultMessage: "Save" })}</Button></>}>
      <form id={formId} onSubmit={event => { event.preventDefault(); saveRename(); }}>
        <TextField autoFocus label={t("experience.pages.name", { defaultMessage: "Page Name" })}
          value={editingTitle} onValueChange={setEditingTitle} readOnly={readOnly} density="compact" />
      </form>
    </Dialog>
  </section>;
}
