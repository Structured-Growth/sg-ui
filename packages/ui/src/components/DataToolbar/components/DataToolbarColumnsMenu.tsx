"use client";

import { useMemo, useState } from "react";
import { Button } from "../../../experimental/Button/Button";
import { Checkbox } from "../../../experimental/Checkbox/Checkbox";
import { Popover } from "../../../experimental/Popover/Popover";
import { TextField } from "../../../experimental/TextField/TextField";
import { ExpandLessIcon } from "../../../experimental/icons/ExpandLessIcon";
import { ExpandMoreIcon } from "../../../experimental/icons/ExpandMoreIcon";
import { ViewColumnIcon } from "../../../experimental/icons/ViewColumnIcon";
import { useTranslation } from "../../../i18n";
import styles from "./DataToolbarColumnsMenu.module.css";

export type DataToolbarColumnOption = {
  id: string;
  label: string;
  locked?: boolean;
  visible: boolean;
};

type DataToolbarColumnsMenuProps = {
  options: DataToolbarColumnOption[];
  onChange: (nextOptions: DataToolbarColumnOption[]) => void;
};

export function DataToolbarColumnsMenu({ options, onChange }: DataToolbarColumnsMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });
  const columnsLabel = tr("common.ui.toolbar.columns", "Columns");
  const searchLabel = tr("common.ui.toolbar.search", "Search");
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return normalizedQuery ? options.filter(option => option.label.toLowerCase().includes(normalizedQuery)) : options;
  }, [options, query]);

  const moveColumn = (id: string, offset: -1 | 1) => {
    const index = options.findIndex(option => option.id === id);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= options.length) return;
    const next = [...options];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };
  const moveLabel = (label: string, direction: "up" | "down") => t(`common.ui.columns.move.${direction}`, {
    defaultMessage: direction === "up" ? "Move {column} up" : "Move {column} down",
    namespace: "common.ui", values: { column: label },
  });

  return <Popover title={columnsLabel} open={open} onOpenChange={next => {
    setOpen(next);
    if (!next) setQuery("");
  }} trigger={<Button variant="outlined" tone="neutral" density="compact" startIcon={<ViewColumnIcon />}>{columnsLabel}</Button>}>
    <div className={styles.body} data-sgui-density="compact">
      <TextField type="search" aria-label={searchLabel} placeholder={searchLabel} value={query} onValueChange={setQuery} density="compact" />
      <div className={styles.options}>
        {filteredOptions.map(option => {
          const index = options.findIndex(item => item.id === option.id);
          return <div key={option.id} className={styles.option}>
            <div className={styles.visibility}><Checkbox label={option.label} checked={option.visible} disabled={option.locked}
              onCheckedChange={visible => onChange(options.map(item => item.id === option.id ? { ...item, visible: item.locked ? true : visible } : item))} /></div>
            <div className={styles.moves}>
              <Button variant="text" tone="neutral" density="compact" aria-label={moveLabel(option.label, "up")}
                disabled={index === 0} onPress={() => moveColumn(option.id, -1)}><ExpandLessIcon /></Button>
              <Button variant="text" tone="neutral" density="compact" aria-label={moveLabel(option.label, "down")}
                disabled={index === options.length - 1} onPress={() => moveColumn(option.id, 1)}><ExpandMoreIcon /></Button>
            </div>
          </div>;
        })}
        {filteredOptions.length === 0 && <p className={styles.empty}>{tr("common.ui.columns.noMatching", "No matching columns")}</p>}
      </div>
      <Button variant="outlined" tone="neutral" density="compact" className={styles.reset}
        onPress={() => onChange(options.map(option => ({ ...option, visible: true })))}>{tr("common.ui.common.reset", "Reset")}</Button>
    </div>
  </Popover>;
}
