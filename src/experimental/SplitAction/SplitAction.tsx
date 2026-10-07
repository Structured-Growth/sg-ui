"use client";
import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { Menu, type MenuItem } from "../Menu/Menu";
import { KeyboardArrowDownIcon } from "../icons/KeyboardArrowDownIcon";
import { useTranslation } from "../../i18n";
export interface SplitActionProps {
  label: string;
  menuLabel?: string;
  items: readonly MenuItem[];
  onPress: () => void;
  onAction: (id: string) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
export function SplitAction({ label, menuLabel, items, onPress, onAction, disabled, loading, className }: SplitActionProps) {
  const { t } = useTranslation();
  const blocked = Boolean(disabled || loading);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (blocked) setMenuOpen(false);
  }, [blocked]);
  const actionsLabel = menuLabel ?? t("common.ui.moreActions", { defaultMessage: "More actions" });
  return <ButtonGroup joined label={label} className={className}>
    <Button variant="text" tone="neutral" onPress={onPress} disabled={disabled} loading={loading}>{label}</Button>
    <Menu label={actionsLabel} items={items} open={menuOpen && !blocked} onOpenChange={open => setMenuOpen(open && !blocked)} onAction={id => { if (!blocked) onAction(id); }} trigger={<IconButton label={actionsLabel} disabled={blocked}><KeyboardArrowDownIcon /></IconButton>} />
  </ButtonGroup>;
}
