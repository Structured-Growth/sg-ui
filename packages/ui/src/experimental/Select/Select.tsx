"use client";
import {FieldMessages, type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import { forwardRef, useRef, useState, type ReactNode } from "react";
import { useFormReset } from "../useFormReset";
import { Select as AriaSelect, SelectValue } from "react-aria-components/Select";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { FramePositionedPopover } from "./FramePositionedPopover";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Button as AriaButton } from "react-aria-components/Button";
import { KeyboardArrowDownIcon } from "../icons/KeyboardArrowDownIcon";
import { useTranslation } from "../../i18n";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayScope, useOverlayDirectionRef } from "../../foundation/ThemeScope";
import field from "../TextField/TextField.module.css";
import list from "../ComboBox/ComboBox.module.css";
import styles from "./Select.module.css";
export interface SelectOption { id: string; label: string; disabled?: boolean; }
export interface SelectProps extends FieldMessagePlacementProps {
  label: string;
  /** Host-supplied options with unique, stable string IDs. Labels are presentation, not identity. */
  options: readonly SelectOption[];
  /** Controlled selected ID; null explicitly clears selection. Keep the control mode stable for this mount. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  name?: string;
  placeholder?: string;
  /** Decorative logical start/end icons; the dropdown chevron remains visible. */
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  className?: string;
}
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({ label, options, value, defaultValue, onValueChange, name, placeholder, description, descriptionPlacement, errorPlacement, required, disabled, readOnly, invalid, errorMessage, className, startIcon, endIcon }, ref) {
  const { t } = useTranslation(); const scope = useOverlayScope();
  const { direction } = useLocale();
  const directionRef = useOverlayDirectionRef(direction);
  const root = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const selected = value === undefined ? internalValue : value;
  const resetting = useFormReset(root, () => {
    const next = value === undefined ? defaultValue ?? null : value;
    if (value === undefined) setInternalValue(next);
    // The browser resets the native select after reset-event listeners finish.
    // Reconcile its wire value in the deferred owned reset task, including when
    // a controlled host keeps the same value and React has no state update.
    const select = root.current?.querySelector("select");
    if (select) select.value = next ?? "";
  });
  const placeholderText = placeholder ?? t("common.ui.selectOption", { defaultMessage: "Select an option" });
  const messages={descriptionPlacement,errorPlacement,description:((description || options.length === 0) && <Text slot="description" className={field.description}>
      {description}{description && options.length === 0 && " "}
      {options.length === 0 && t("common.ui.noOptions", { defaultMessage: "No options found" })}
    </Text>),error:(<FieldError className={field.error}>{errorMessage}</FieldError>)};
  return <AriaSelect ref={root} selectedKey={selected} onSelectionChange={key => {
    if (resetting.current) return;
    const next = key === null ? null : String(key);
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }}
    disabledKeys={options.filter(option => option.disabled).map(option => option.id)}
    name={name} isRequired={required} isDisabled={disabled} isInvalid={invalid} validationBehavior="native"
    placeholder={placeholderText}
    className={[field.root, styles.root, className].filter(Boolean).join(" ")}>
    <Label className={field.label}>{label}</Label><FieldMessages position="above" {...messages}/>
    <AriaButton type="button" ref={ref} isDisabled={readOnly} aria-readonly={readOnly || undefined} className={[field.input, styles.trigger].join(" ")} data-start-icon={startIcon ? true : undefined}>
      {startIcon && <span className={field.adornment} data-sgui-part="field-start-icon" aria-hidden="true">{startIcon}</span>}
      <span aria-hidden="true" className={styles.sizer}>
        <span data-label={placeholderText} />
        {options.map(option => <span key={option.id} data-label={option.label} />)}
      </span>
      <SelectValue className={styles.value} />
      <span className={styles.trailing} aria-hidden="true">{endIcon && <span className={field.adornment} data-sgui-part="field-end-icon">{endIcon}</span>}<KeyboardArrowDownIcon className={styles.chevron} /></span>
    </AriaButton>
    <FieldMessages position="below" {...messages}/>
    <FramePositionedPopover {...scope} ref={directionRef} className={list.popover}>
      <ListBox items={options} disabledKeys={options.filter(option => option.disabled).map(option => option.id)} className={list.list}
        renderEmptyState={() => t("common.ui.noOptions", { defaultMessage: "No options found" })}>
        {option => <ListBoxItem id={option.id} textValue={option.label} isDisabled={option.disabled} className={list.option}>{option.label}</ListBoxItem>}
      </ListBox>
    </FramePositionedPopover>
  </AriaSelect>;
});
