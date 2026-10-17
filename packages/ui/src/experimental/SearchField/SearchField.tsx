"use client";
import {FieldMessages,type FieldMessagePlacementProps} from "../TextField/FieldMessages";
import { forwardRef, useId, useImperativeHandle, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Popover } from "react-aria-components/Popover";
import { useLocale } from "react-aria-components/I18nProvider";
import { useOverlayDirectionRef, useOverlayScope, type Density } from "../../foundation/ThemeScope";
import { TextField } from "../TextField/TextField";
import { Button } from "../../components/Button/Button";
import { Link } from "../Link/Link";
import { Typography } from "../Typography/Typography";
import { SearchIcon } from "../../icons/SearchIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import { useTranslation } from "../../i18n";
import field from "../TextField/TextField.module.css";
import styles from "./SearchField.module.css";

export interface SearchFieldItem {
  id: string;
  label: string;
  description?: string;
  /** Additional searchable terms, such as public aliases. */
  keywords?: readonly string[];
  /** Native links use the host's SGUI navigation adapter, including modified clicks. */
  href?: string;
}
interface SearchOptions extends Pick<FieldMessagePlacementProps,"descriptionPlacement"> {
  items?: readonly SearchFieldItem[];
  /** Disable the dropdown when a host renders its search results elsewhere. */
  showResults?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (query: string) => void;
  onResultSelect?: (item: SearchFieldItem) => void;
  /** Enter in the input requests host-owned full-search behavior when provided. */
  onSearch?: (query: string) => void;
  /** Contains searches label/keywords locally; none accepts host-filtered remote results. */
  filter?: "contains" | "none";
  placeholder?: string;
  description?: string;
  resultsLabel?: string;
  emptyMessage?: string;
  resultCountLabel?: (count: number) => string;
  loading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  showClearButton?: boolean;
  name?: string;
  density?: Density;
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
export type SearchFieldProps = SearchOptions & ({ label: string; "aria-label"?: string } | { label?: never; "aria-label": string });
/** Search input and nonmodal results. The host owns data, remote request freshness and routing. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField({
  items = [], showResults = true, value, defaultValue = "", onValueChange, onResultSelect, onSearch, filter = "contains", label,
  "aria-label": ariaLabel, placeholder, description, descriptionPlacement="above", resultsLabel, emptyMessage, resultCountLabel,
  loading, errorMessage, onRetry, disabled, readOnly, showClearButton = true, name, density, className,
  startIcon = <SearchIcon size={16}/>, endIcon,
}, ref) {
  const { t } = useTranslation(), { locale, direction } = useLocale();
  const scope = useOverlayScope(), directionRef = useOverlayDirectionRef(direction);
  const root = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), results = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => input.current!);
  const id = useId(), resultsId = `${id}-results`;
  const [internal, setInternal] = useState(defaultValue), [expanded, setExpanded] = useState(false);
  const query = value === undefined ? internal : value;
  const term = query.trim().toLocaleLowerCase(locale);
  const matches = filter === "none" ? items : items.filter(item => [item.label, ...(item.keywords ?? [])].some(text => text.toLocaleLowerCase(locale).includes(term)));
  const open = showResults && expanded && Boolean(term) && !disabled && !readOnly;
  const resetting = useStandaloneFormReset(root, () => { if (value === undefined) setInternal(defaultValue); setExpanded(false); });
  function change(next: string) {
    if (disabled || readOnly || resetting.current) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next); setExpanded(Boolean(next.trim()));
  }
  function choose(item: SearchFieldItem) { onResultSelect?.(item); input.current?.focus(); setExpanded(false); }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); input.current?.focus(); setExpanded(false); return; }
    if (event.key === "Enter" && event.target === input.current && onSearch) { event.preventDefault(); onSearch(query); setExpanded(false); return; }
    if (!showResults || !term || disabled || readOnly || loading || errorMessage) return;
    const actions = Array.from(results.current?.querySelectorAll<HTMLElement>('[data-search-result]') ?? []);
    const index = actions.indexOf(event.target as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      // Materialize the results before moving focus, so rapid ArrowDown/Enter
      // activates a result instead of racing a deferred animation frame.
      if (!open) flushSync(() => setExpanded(true));
      const next = results.current?.querySelectorAll<HTMLElement>('[data-search-result]');
      next?.[Math.min(index + 1, next.length - 1)]?.focus();
    } else if (event.key === "ArrowUp" && open) {
      event.preventDefault(); (index <= 0 ? input.current : actions[index - 1])?.focus();
    } else if ((event.key === "Home" || event.key === "End") && index >= 0) {
      event.preventDefault(); actions[event.key === "Home" ? 0 : actions.length - 1]?.focus();
    }
  }
  const count = resultCountLabel?.(matches.length) ?? t("common.ui.searchResultCount", { defaultMessage: "{count, plural, one {# result} other {# results}}", values: { count: matches.length } });
  return <div ref={root} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-density={density} data-sgui-part="search-field"
    onKeyDownCapture={keyDown} onBlurCapture={event => {
      const target = event.relatedTarget as Node | null;
      if (!event.currentTarget.contains(target) && !results.current?.contains(target)) setExpanded(false);
    }}>
    {label && <label htmlFor={id} className={field.label}>{label}</label>}
    <FieldMessages position="above" descriptionPlacement={descriptionPlacement} description={description&&<div className={field.description} id={`${id}-description`}>{description}</div>}/>
    <div className={styles.control}>
      <TextField ref={input} id={id} aria-label={ariaLabel ?? label!} name={name} type="search" className={styles.input}
        value={query} onValueChange={change} placeholder={placeholder ?? t("common.ui.searchPlaceholder", { defaultMessage: "Search…" })}
        startIcon={startIcon} endIcon={endIcon} disabled={disabled} readOnly={readOnly} density={density}
        onFocus={() => setExpanded(true)} aria-describedby={description ? `${id}-description` : undefined}/>
      {showClearButton && query && <Button variant="text" tone="neutral" disabled={disabled || readOnly}
        aria-label={t("common.ui.clearSearch", { defaultMessage: "Clear search" })} onPress={() => { change(""); input.current?.focus(); }}><CloseIcon size={16}/></Button>}
    </div>
    <FieldMessages position="below" descriptionPlacement={descriptionPlacement} description={description&&<div className={field.description} id={`${id}-description`}>{description}</div>}/>
    <Popover {...scope} data-sgui-density={density ?? scope["data-sgui-density"]} ref={directionRef} triggerRef={root} isOpen={open} onOpenChange={setExpanded} isNonModal placement="bottom start"
      shouldCloseOnInteractOutside={element => !root.current?.contains(element)} className={styles.popover}>
      <div ref={results} id={resultsId} role="region" aria-label={resultsLabel ?? t("common.ui.searchResults", { defaultMessage: "Search results" })} className={styles.results} data-sgui-part="search-results">
        <Typography variant="caption" tone="muted" role="status">{loading ? t("common.ui.searchLoading", { defaultMessage: "Searching…" }) : errorMessage || (matches.length ? count : emptyMessage ?? t("common.ui.searchEmpty", { defaultMessage: "No results found." }))}</Typography>
        {errorMessage && onRetry && <Button variant="outlined" tone="neutral" onPress={() => { onRetry(); input.current?.focus(); }}>{t("common.ui.retry", { defaultMessage: "Retry" })}</Button>}
        {!loading && !errorMessage && matches.map(item => {
          const content = <span className={styles.content}><Typography as="span" variant="caption">{item.label}</Typography>{item.description && <Typography as="span" variant="caption" tone="muted">{item.description}</Typography>}</span>;
          return item.href ? <Link key={item.id} href={item.href} aria-label={item.label} underline="none" tone="inherit" className={styles.result} data-search-result="" onClick={event => {
            if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) choose(item);
          }}>{content}</Link> : <Button key={item.id} variant="text" tone="neutral" className={styles.result} data-search-result="" onPress={() => choose(item)}>{content}</Button>;
        })}
      </div>
    </Popover>
  </div>;
});
