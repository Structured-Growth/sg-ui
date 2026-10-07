"use client";

import { Button } from "../../../experimental/Button/Button";
import { Checkbox } from "../../../experimental/Checkbox/Checkbox";
import { Menu } from "../../../experimental/Menu/Menu";
import { ArrowDropDownIcon } from "../../../experimental/icons/ArrowDropDownIcon";
import { useTranslation } from "../../../i18n";
import styles from "./DataToolbarSelectionMenu.module.css";

export type DataToolbarSelectionOption = {
  id: string;
  label: string;
};

export type DataToolbarSelectionState = "none" | "some" | "all";

type DataToolbarSelectionMenuProps = {
  options: DataToolbarSelectionOption[];
  selectionState: DataToolbarSelectionState;
  onToggleSelection: () => void;
  onSelectOption: (optionId: string) => void;
};

export function DataToolbarSelectionMenu({ options, selectionState, onToggleSelection, onSelectOption }: DataToolbarSelectionMenuProps) {
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const selectLabel = t("common.ui.toolbar.selectRows", { defaultMessage: "Select rows", namespace: "common.ui" });
  const optionsLabel = t("common.ui.toolbar.selectionOptions", { defaultMessage: "Selection options", namespace: "common.ui" });
  return <div className={styles.root} data-sgui-density="compact">
    <span className={styles.checkbox}><Checkbox label={selectLabel} checked={selectionState === "all"} mixed={selectionState === "some"} onCheckedChange={() => onToggleSelection()} /></span>
    <Menu label={optionsLabel} density="compact" items={options} onAction={onSelectOption}
      trigger={<Button variant="text" tone="neutral" density="compact" aria-label={optionsLabel} className={styles.trigger}><ArrowDropDownIcon /></Button>} />
  </div>;
}
