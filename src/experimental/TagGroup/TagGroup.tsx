"use client";
import { forwardRef, useId, type CSSProperties, type ReactNode } from "react";
import { TagGroup as AriaTagGroup, TagList, Tag } from "react-aria-components/TagGroup";
import { Button } from "react-aria-components/Button";
import { Label } from "react-aria-components/Label";
import { useTranslation } from "../../i18n";
import type { Density } from "../../foundation/ThemeScope";
import { CloseIcon } from "../icons/CloseIcon";
import styles from "./TagGroup.module.css";

export interface TagItem {
  id: string;
  label: string;
  disabled?: boolean;
  /** Host-translated override for the remove action's accessible name. */
  removeLabel?: string;
}
export interface TagGroupProps {
  label: string;
  items: readonly TagItem[];
  /** Host removes these IDs from items. React Aria moves focus to the adjacent tag. */
  onRemove?: (ids: string[]) => void;
  disabled?: boolean;
  tone?: "neutral" | "primary";
  density?: Density;
  emptyContent?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

function RemoveButton({ label }: { label: string }) {
  const id = useId();
  return <Button id={id} slot="remove" className={styles.remove} data-sgui-part="tag-remove"
    aria-label={label} aria-labelledby={id}><CloseIcon /></Button>;
}

export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(function TagGroup(
  { label, items, onRemove, disabled, tone = "neutral", density, emptyContent, className, ...props }, ref,
) {
  const { t } = useTranslation();
  return <AriaTagGroup {...props} ref={ref}
    disabledKeys={disabled ? items.map(item => item.id) : items.filter(item => item.disabled).map(item => item.id)}
    onRemove={onRemove ? keys => onRemove(Array.from(keys, String)) : undefined}
    data-sgui-part="tag-group" data-sgui-density={density}
    className={[styles.root, className].filter(Boolean).join(" ")}>
    <Label className={styles.label}>{label}</Label>
    <TagList items={items} dependencies={[Boolean(onRemove)]} className={styles.list}
      renderEmptyState={() => emptyContent ?? t("common.ui.noTags", { defaultMessage: "No tags" })}>
      {item => <Tag id={item.id} textValue={item.label} isDisabled={disabled || item.disabled}
        className={styles.tag} data-tone={tone} data-sgui-part="tag">
        <span>{item.label}</span>
        {onRemove && <RemoveButton label={item.removeLabel ?? t("common.ui.removeTag", {
            defaultMessage: "Remove {label}", values: { label: item.label },
          })} />}
      </Tag>}
    </TagList>
  </AriaTagGroup>;
});
