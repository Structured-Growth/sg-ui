"use client";
import {FieldMessages, type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { ComboBox as AriaComboBox } from "react-aria-components/ComboBox";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { Popover } from "react-aria-components/Popover";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Button } from "../../components/Button/Button";
import { KeyboardArrowDownIcon } from "../icons/KeyboardArrowDownIcon";
import { useFormReset } from "../useFormReset";
import { useTranslation } from "../../i18n";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayScope, useOverlayDirectionRef } from "../../foundation/ThemeScope";
import field from "../TextField/TextField.module.css";
import styles from "./ComboBox.module.css";

export interface ComboBoxOption { id: string; label: string; disabled?: boolean }
export interface ComboBoxProps extends FieldMessagePlacementProps {
  label: string;
  /** Unique, stable string IDs; labels are presentation and are locally filtered.
   * Fetching and result freshness remain host-owned. */
  options: readonly ComboBoxOption[];
  /** Controlled selected ID; null explicitly clears selection. Keep the control mode stable for this mount. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  name?: string;
  placeholder?: string;
  /** Decorative icons inside the input; the separate dropdown action remains available. */
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  className?: string;
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(function ComboBox(
  { label, options, value, defaultValue, onValueChange, name, placeholder, description, descriptionPlacement, errorPlacement,
    required, disabled, readOnly, invalid, errorMessage, autoFocus, className, startIcon, endIcon }, ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const selected = value === undefined ? internalValue : value;
  const selectedLabel = options.find(option => option.id === selected)?.label ?? "";
  const [query, setQuery] = useState(selectedLabel);
  useEffect(() => { setQuery(selectedLabel); }, [selected, selectedLabel]);
  const resetting = useFormReset(root, () => {
    const next = value === undefined ? defaultValue ?? null : value;
    if (value === undefined) setInternalValue(next);
    setQuery(options.find(option => option.id === next)?.label ?? "");
  });
  const { t } = useTranslation();
  const scope = useOverlayScope();
  const { direction } = useLocale();
  const directionRef = useOverlayDirectionRef(direction);
  const control = <Input ref={ref} placeholder={placeholder} className={field.input}
    onChangeCapture={() => {
      // A real edit can follow a canceled reset before its deferred cleanup.
      // Engine reset callbacks do not dispatch input changes, so this new edit
      // ends their suppression window before onInputChange receives the value.
      resetting.current = false;
    }} />;
  const messages={descriptionPlacement,errorPlacement,description:(description && <Text slot="description" className={field.description}>{description}</Text>),error:(<FieldError className={field.error}>{errorMessage}</FieldError>)};
  return <AriaComboBox ref={root} defaultItems={options} selectedKey={selected} inputValue={query}
    onInputChange={next => {
      if (resetting.current) return;
      setQuery(next);
      if (next === "" && selected !== null) {
        if (value === undefined) setInternalValue(null);
        onValueChange?.(null);
      }
    }} allowsEmptyCollection
    onSelectionChange={key => {
      if (resetting.current) return;
      const next = key === null ? null : String(key);
      if (value === undefined) setInternalValue(next);
      setQuery(options.find(option => option.id === (value === undefined ? next : value))?.label ?? "");
      if (next !== selected) onValueChange?.(next);
    }}
    disabledKeys={options.filter(option => option.disabled).map(option => option.id)}
    name={name} formValue="key" isRequired={required} isDisabled={disabled} isReadOnly={readOnly}
    isInvalid={invalid} validationBehavior="native" autoFocus={autoFocus}
    className={[field.root, className].filter(Boolean).join(" ")}>
    <Label className={field.label}>{label}</Label><FieldMessages position="above" {...messages}/>
    <div className={styles.control}>
      {startIcon || endIcon ? <div className={field.decoratedControl} data-sgui-part="field-icon-control">
        {startIcon && <span className={field.adornment} data-sgui-part="field-start-icon" aria-hidden="true">{startIcon}</span>}
        {control}
        {endIcon && <span className={field.adornment} data-sgui-part="field-end-icon" aria-hidden="true">{endIcon}</span>}
      </div> : control}
      <Button variant="outlined" tone="neutral" aria-label={t("common.ui.showOptions", { defaultMessage: "Show options" })}>
        <KeyboardArrowDownIcon size={16} />
      </Button>
    </div>
    <FieldMessages position="below" {...messages}/>
    <Popover {...scope} ref={directionRef} className={styles.popover}>
      <ListBox<ComboBoxOption> className={styles.list} renderEmptyState={() => t("common.ui.noOptions", { defaultMessage: "No options found" })}>
        {option => <ListBoxItem id={option.id} textValue={option.label} className={styles.option}>{option.label}</ListBoxItem>}
      </ListBox>
    </Popover>
  </AriaComboBox>;
});
