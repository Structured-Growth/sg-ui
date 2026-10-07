"use client";
import { forwardRef } from "react";
import { Select as AriaSelect, SelectValue } from "react-aria-components/Select";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { Popover } from "react-aria-components/Popover";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Button } from "../Button/Button";
import { KeyboardArrowDownIcon } from "../icons/KeyboardArrowDownIcon";
import { useTranslation } from "../../i18n";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayScope, useOverlayDirectionRef } from "../../foundation/ThemeScope";
import field from "../TextField/TextField.module.css";
import list from "../ComboBox/ComboBox.module.css";
import styles from "./Select.module.css";
export interface SelectOption { id: string; label: string; disabled?: boolean; }
export interface SelectProps {
  label: string;
  /** Host-supplied options with unique, stable string IDs. Labels are presentation, not identity. */
  options: readonly SelectOption[];
  /** Controlled selected ID; null explicitly clears selection. Keep the control mode stable for this mount. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  name?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  className?: string;
}
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({ label, options, value, defaultValue, onValueChange, name, placeholder, description, required, disabled, readOnly, invalid, errorMessage, className }, ref) {
  const { t } = useTranslation(); const scope = useOverlayScope();
  const { direction } = useLocale();
  const directionRef = useOverlayDirectionRef(direction);
  return <AriaSelect selectedKey={value} defaultSelectedKey={defaultValue} onSelectionChange={key => onValueChange?.(key === null ? null : String(key))}
    disabledKeys={options.filter(option => option.disabled).map(option => option.id)}
    name={name} isRequired={required} isDisabled={disabled} isInvalid={invalid} validationBehavior="native"
    placeholder={placeholder ?? t("common.ui.selectOption", { defaultMessage: "Select an option" })}
    className={[field.root, className].filter(Boolean).join(" ")}>
    <Label className={field.label}>{label}</Label>
    <Button ref={ref} variant="outlined" tone="neutral" disabled={readOnly} aria-readonly={readOnly || undefined} className={styles.trigger}>
      <SelectValue className={styles.value} /><KeyboardArrowDownIcon />
    </Button>
    {(description || options.length === 0) && <Text slot="description" className={field.description}>
      {description}{description && options.length === 0 && " "}
      {options.length === 0 && t("common.ui.noOptions", { defaultMessage: "No options found" })}
    </Text>}
    <FieldError className={field.error}>{errorMessage}</FieldError>
    <Popover {...scope} ref={directionRef} className={list.popover}>
      <ListBox items={options} disabledKeys={options.filter(option => option.disabled).map(option => option.id)} className={list.list}
        renderEmptyState={() => t("common.ui.noOptions", { defaultMessage: "No options found" })}>
        {option => <ListBoxItem id={option.id} textValue={option.label} isDisabled={option.disabled} className={list.option}>{option.label}</ListBoxItem>}
      </ListBox>
    </Popover>
  </AriaSelect>;
});
