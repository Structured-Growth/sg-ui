"use client";

import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ComboBox as AriaComboBox, ComboBoxStateContext } from "react-aria-components/ComboBox";
import { Select as AriaSelect, SelectValue, SelectStateContext } from "react-aria-components/Select";
import { Autocomplete } from "react-aria-components/Autocomplete";
import { SearchField as AriaSearchField } from "react-aria-components/SearchField";
import { Button as AriaButton, ButtonContext } from "react-aria-components/Button";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { FieldError } from "react-aria-components/FieldError";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { useLocale } from "react-aria-components/I18nProvider";
import { Button } from "../../components/Button/Button";
import { CloseIcon } from "../../icons/CloseIcon";
import { SearchIcon } from "../../icons/SearchIcon";
import { KeyboardArrowDownIcon } from "../icons/KeyboardArrowDownIcon";
import { useOverlayDirectionRef, useOverlayScope } from "../../foundation/ThemeScope";
import { useTranslation } from "../../i18n";
import { FramePositionedPopover } from "../Select/FramePositionedPopover";
import { FieldMessages, type FieldMessagePlacementProps } from "../TextField/FieldMessages";
import { useFormReset } from "../useFormReset";
import { searchOptions, type SearchableSelectOption, type SearchableSelectFilter } from "./option-search";
import field from "../TextField/TextField.module.css";
import attached from "../TextField/AttachedField.module.css";
import list from "../ComboBox/ComboBox.module.css";
import styles from "./SearchableSelect.module.css";

export type { SearchableSelectOption, SearchableSelectFilter } from "./option-search";

/** Resolve the active interaction context inside its owner, then settle edits
 * before closing so controlled query reconciliation cannot reopen the popup. */
function ClearSelectionAction({label,visible,disabled,onClear,onFocus}:{label:string;visible:boolean;disabled?:boolean;onClear:()=>void;onFocus:()=>void}) {
  const comboBox = useContext(ComboBoxStateContext);
  const select = useContext(SelectStateContext);
  const current = useRef({ comboBox, select });
  const action = useRef<HTMLButtonElement>(null);
  const cancel = useRef<(() => void) | null>(null);
  current.current = { comboBox, select };
  useEffect(() => () => cancel.current?.(), []);
  // Remain mounted when the button disappears, so closing uses the accepted
  // post-clear selection context rather than restoring a stale selected label.
  if (!visible) return null;
  return <ButtonContext.Provider value={null}>
    <Button ref={action} className={styles.clear} variant="text" tone="neutral" disabled={disabled} aria-label={label}
      onPress={() => {
        const view = action.current?.ownerDocument.defaultView;
        cancel.current?.();
        flushSync(() => { onClear(); onFocus(); });
        // Controlled query effects can enqueue opening during the clear commit.
        // Close after that native press task, using the latest selection owner.
        if (view) {
          const timer = view.setTimeout(() => { cancel.current = null; current.current.comboBox?.close(); current.current.select?.close(); }, 0);
          cancel.current = () => view.clearTimeout(timer);
        }
      }}>
      <CloseIcon size={16}/>
    </Button>
  </ButtonContext.Provider>;
}

/** Popup Escape dismisses the picker rather than only clearing the search field. */
function DropdownSearchField({label,placeholder,onDismiss}:{label:string;placeholder?:string;onDismiss:()=>void}) {
  const select = useContext(SelectStateContext);
  return <AriaSearchField aria-label={label} autoFocus className={styles.search}>
    <SearchIcon size={16} aria-hidden="true"/>
    <Input className={[field.input, styles.searchInput].join(" ")} placeholder={placeholder} onKeyDownCapture={event => {
      if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      select?.close();
      onDismiss();
    }}/>
  </AriaSearchField>;
}

export interface SearchableSelectProps extends FieldMessagePlacementProps {
  label: string;
  /** Unique stable IDs. Supply aliases explicitly, e.g. keywords: ["TX"]. */
  options: readonly SearchableSelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Input combines editable text with a dropdown action. Dropdown keeps search inside the popup. */
  searchPlacement?: "input" | "dropdown";
  /** Contains ignores case/diacritics; fuzzy additionally tolerates bounded word typos. */
  filter?: SearchableSelectFilter;
  /** User search edits, separate from selected IDs. Use filter="none" for host-filtered results. */
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  searchLabel?: string;
  description?: string;
  clearable?: boolean;
  loading?: boolean;
  /** Search failures belong in the results flow, distinct from form validation. */
  searchErrorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  startIcon?: ReactNode;
}

/** Selected records and draft search are separate. Only explicit selection commits an ID. */
export const SearchableSelect = forwardRef<HTMLDivElement, SearchableSelectProps>(function SearchableSelect({
  label, options, value, defaultValue, onValueChange, searchPlacement = "input", filter = "contains", onSearchChange,
  placeholder, searchPlaceholder, searchLabel, description, descriptionPlacement, errorPlacement,
  clearable = false, loading = false, searchErrorMessage, onRetry, emptyMessage,
  disabled, readOnly, required, invalid, errorMessage, name, className, style, startIcon,
}, ref) {
  const { t } = useTranslation();
  const { locale, direction } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const scope = useOverlayScope();
  const directionRef = useOverlayDirectionRef(direction);
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const selected = value === undefined ? internalValue : value;
  const selectedLabel = options.find(option => option.id === selected)?.label ?? "";
  const [query, setQuery] = useState(searchPlacement === "input" ? selectedLabel : "");
  const [previous, setPrevious] = useState({ selected, selectedLabel, searchPlacement });
  const [browseAll, setBrowseAll] = useState(false);
  // Reconcile before the interaction engine renders; an effect can reopen a committed popup.
  if (previous.selected !== selected || previous.selectedLabel !== selectedLabel || previous.searchPlacement !== searchPlacement) {
    setPrevious({ selected, selectedLabel, searchPlacement });
    setQuery(searchPlacement === "input" ? selectedLabel : "");
  }
  const resetting = useFormReset(root, () => {
    const next = value === undefined ? defaultValue ?? null : value;
    if (value === undefined) setInternalValue(next);
    setQuery(searchPlacement === "input" ? options.find(option => option.id === next)?.label ?? "" : "");
    const nativeSelect = root.current?.querySelector("select");
    if (nativeSelect) nativeSelect.value = next ?? "";
  });
  const blocked = disabled || readOnly;
  const unavailable = loading || Boolean(searchErrorMessage);
  const searchTerm = searchPlacement === "input" && (browseAll || query === selectedLabel) ? "" : query;
  const matches = searchOptions(options, searchTerm, filter, locale);
  const matchedIds = new Set(matches.map(option => option.id));
  // Keep every record in Select's collection for native forms and selected-label resolution.
  // Autocomplete filters the visible collection by stable ID, including duplicate labels.
  const orderedOptions = [...matches, ...options.filter(option => !matchedIds.has(option.id))];
  const changeSearch = (next: string) => {
    if (blocked || resetting.current) return;
    setQuery(next);
    setBrowseAll(false);
    onSearchChange?.(next);
  };
  const changeSelection = (next: string | null) => {
    if (blocked || resetting.current || (next !== null && (unavailable || options.find(option => option.id === next)?.disabled))) return;
    if (value === undefined) setInternalValue(next);
    const accepted = value === undefined ? next : value;
    setQuery(searchPlacement === "input" ? options.find(option => option.id === accepted)?.label ?? "" : "");
    if (next !== selected) onValueChange?.(next);
  };
  const clear = clearable && <ClearSelectionAction disabled={blocked} visible={selected !== null}
    label={t("common.ui.clearSelection", { defaultMessage: "Clear {label}", values: { label } })}
    onClear={() => { changeSelection(null); onSearchChange?.(""); }}
    onFocus={() => (searchPlacement === "input" ? input.current : trigger.current)?.focus()}/>;
  const messages = {
    descriptionPlacement, errorPlacement,
    description: description && <Text slot="description" className={field.description}>{description}</Text>,
    error: <FieldError className={field.error}>{errorMessage}</FieldError>,
  };
  const resultList = <ListBox<SearchableSelectOption> items={searchPlacement === "dropdown" ? orderedOptions : unavailable ? [] : matches}
    className={[list.list, styles.results].join(" ")}
    disabledKeys={options.filter(option => option.disabled || unavailable).map(option => option.id)}
    renderEmptyState={unavailable ? undefined : () => emptyMessage ?? t("common.ui.noOptions", { defaultMessage: "No options found" })}>
    {option => <ListBoxItem id={option.id} textValue={option.label} isDisabled={option.disabled || unavailable} className={[list.option, styles.option].join(" ")}>
      {({ isSelected }) => <>
        <span className={styles.optionContent}><Text slot="label">{option.label}</Text>
          {option.description && <Text slot="description" className={styles.optionDescription}>{option.description}</Text>}
        </span><span aria-hidden="true" className={styles.check}>{isSelected ? "✓" : ""}</span>
      </>}
    </ListBoxItem>}
  </ListBox>;
  const popup = <FramePositionedPopover {...scope} ref={directionRef} className={[list.popover, styles.popover].join(" ")}>
    {searchPlacement === "dropdown" ? <Autocomplete<SearchableSelectOption> inputValue={query} onInputChange={changeSearch}
      filter={(_text, _query, node) => !unavailable && matchedIds.has(String(node.key))}>
      <DropdownSearchField label={searchLabel ?? t("common.ui.searchOptions", { defaultMessage: "Search {label}", values: { label } })}
        placeholder={searchPlaceholder} onDismiss={() => trigger.current?.focus()}/>
      {resultList}
    </Autocomplete> : resultList}
    {unavailable && <div role="status" className={[styles.status, searchErrorMessage ? styles.error : undefined].filter(Boolean).join(" ")}>
      {loading ? t("common.ui.loadingOptions", { defaultMessage: "Loading options…" }) : searchErrorMessage}
      {!loading && searchErrorMessage && onRetry && <ButtonContext.Provider value={null}>
        <Button variant="text" tone="neutral" onPress={onRetry}>{t("common.ui.retry", { defaultMessage: "Retry" })}</Button>
      </ButtonContext.Provider>}
    </div>}
  </FramePositionedPopover>;
  const rootClass = [field.root, styles.root, className].filter(Boolean).join(" ");
  const placeholderText = placeholder ?? t("common.ui.selectOption", { defaultMessage: "Select an option" });
  if (searchPlacement === "dropdown") return <AriaSelect ref={root} className={rootClass} style={style}
    selectedKey={selected} onSelectionChange={key => changeSelection(key === null ? null : String(key))}
    disabledKeys={options.filter(option => option.disabled || unavailable).map(option => option.id)}
    onOpenChange={() => setQuery("")} isDisabled={disabled} isRequired={required} isInvalid={invalid}
    name={name} validationBehavior="native" placeholder={placeholderText}>
    <Label className={field.label}>{label}</Label><FieldMessages position="above" {...messages}/>
    <div className={styles.control}>
      <AriaButton ref={trigger} type="button" className={[field.input, styles.trigger].join(" ")}
        isDisabled={readOnly} aria-readonly={readOnly || undefined}>
        {startIcon && <span aria-hidden="true" className={field.adornment}>{startIcon}</span>}
        <SelectValue className={styles.value}>{({ selectedText, isPlaceholder }) => isPlaceholder ? placeholderText : selectedText}</SelectValue>
        <KeyboardArrowDownIcon size={16}/>
      </AriaButton>{clear}
    </div>
    <FieldMessages position="below" {...messages}/>{popup}
  </AriaSelect>;
  return <AriaComboBox ref={root} className={rootClass} style={style} items={unavailable ? [] : matches}
    inputValue={query} selectedKey={selected} allowsEmptyCollection
    onInputChange={changeSearch} onSelectionChange={key => changeSelection(key === null ? null : String(key))}
    onOpenChange={(open, action) => {
      if (open && action === "manual") setBrowseAll(true);
      if (!open) { setBrowseAll(false); setQuery(selectedLabel); }
    }} disabledKeys={options.filter(option => option.disabled).map(option => option.id)}
    name={name} formValue="key" isRequired={required} isDisabled={disabled} isReadOnly={readOnly}
    isInvalid={invalid} validationBehavior="native">
    <Label className={field.label}>{label}</Label><FieldMessages position="above" {...messages}/>
    <div className={attached.frame} data-sgui-part="searchable-select-control" data-invalid={invalid || undefined} data-readonly={readOnly || undefined}>
      {startIcon && <span aria-hidden="true" className={[field.adornment, attached.adornment].join(" ")}>{startIcon}</span>}
      <Input ref={input} placeholder={placeholderText} className={[field.input, attached.input].join(" ")}
        onChangeCapture={() => { resetting.current = false; }}/>
      {clear}<Button variant="text" tone="neutral" className={attached.action}
        aria-label={t("common.ui.showOptions", { defaultMessage: "Show options" })}><KeyboardArrowDownIcon size={16}/></Button>
    </div>
    <FieldMessages position="below" {...messages}/>{popup}
  </AriaComboBox>;
});
