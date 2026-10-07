"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { TextField } from "../TextField/TextField";
import { Button } from "../Button/Button";
import { useTranslation } from "../../i18n";
import { useFormReset } from "../useFormReset";
import styles from "./AsyncMultiSelect.module.css";

export interface MultiSelectOption { id: string; label: string; disabled?: boolean }
export interface AsyncMultiSelectProps {
  label: string;
  /** Options require unique, stable string IDs; labels never determine selection identity.
   * Results for the current query. Fetching, cancellation and stale-response rejection belong to the host. */
  options: readonly MultiSelectOption[];
  /** Selected records persist independently of the current search results. */
  value?: readonly MultiSelectOption[];
  defaultValue?: readonly MultiSelectOption[];
  onValueChange?: (value: MultiSelectOption[]) => void;
  query: string;
  onQueryChange: (query: string) => void;
  loading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  description?: string;
}

export function AsyncMultiSelect({ label, options, value, defaultValue = [], onValueChange,
  query, onQueryChange, loading, errorMessage, onRetry, disabled, readOnly, name, description }: AsyncMultiSelectProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState<readonly MultiSelectOption[]>(defaultValue);
  const selected = value ?? internal;
  const input = useRef<HTMLInputElement>(null);
  const statusId = useId();
  const list = useRef<HTMLDivElement>(null);
  // The pinned ListBox filters aria-busy. Bridge only this owned state onto its
  // native element without replacing the interaction ref or remounting the list.
  useEffect(() => {
    if (loading) list.current?.setAttribute("aria-busy", "true");
    else list.current?.removeAttribute("aria-busy");
  }, [loading]);
  const resetting = useFormReset(input, () => { if (value === undefined) setInternal(defaultValue); });
  function change(next: MultiSelectOption[]) {
    if (disabled || readOnly) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }
  return <div className={styles.root} data-disabled={disabled || undefined}>
    <TextField ref={input} label={label} type="search" value={query} onValueChange={next => { if (!resetting.current) onQueryChange(next); }}
      disabled={disabled} readOnly={readOnly} description={description} aria-describedby={statusId} />
    <div className={styles.tokens} aria-label={t("common.ui.selectedOptions", { defaultMessage: "Selected options" })}>
      {selected.map(option => <Button key={option.id} variant="outlined" tone="neutral" disabled={disabled || readOnly}
        aria-label={t("common.ui.removeOption", { defaultMessage: "Remove {label}", values: { label: option.label } })}
        onPress={() => { change(selected.filter(item => item.id !== option.id)); input.current?.focus(); }}>
        {option.label}<span aria-hidden="true"> ×</span>
      </Button>)}
    </div>
    <div id={statusId} role="status" className={styles.status}>
      {loading ? t("common.ui.loadingOptions", { defaultMessage: "Loading options…" }) : errorMessage ??
        (options.length === 0 ? t("common.ui.noOptions", { defaultMessage: "No options found" }) :
          t("common.ui.optionCount", { defaultMessage: "{count} options available", values: { count: options.length } }))}
    </div>
    {errorMessage && onRetry && <Button variant="outlined" tone="neutral" disabled={disabled} onPress={onRetry}>
      {t("common.ui.retry", { defaultMessage: "Retry" })}</Button>}
    <ListBox<MultiSelectOption> ref={list} aria-label={label} aria-busy={loading || undefined} items={options}
      selectionMode="multiple" selectionBehavior="toggle" selectedKeys={selected.map(option => option.id)}
      disabledKeys={options.filter(option => disabled || readOnly || option.disabled || loading || errorMessage).map(option => option.id)}
      onSelectionChange={keys => {
        if (keys === "all") return;
        // Results may omit selected IDs. Keep those records when the user selects another result.
        const records = new Map([...selected, ...options].map(option => [option.id, option]));
        change([...keys].map(key => records.get(String(key))).filter((option): option is MultiSelectOption => !!option));
      }} className={styles.list}>
      {option => <ListBoxItem id={option.id} textValue={option.label} className={styles.option}>
        {({ isSelected }) => <><span aria-hidden="true">{isSelected ? "✓" : "○"}</span>{option.label}</>}
      </ListBoxItem>}
    </ListBox>
    {name && selected.map(option => <input key={option.id} type="hidden" name={name} value={option.id} disabled={disabled} />)}
  </div>;
}
