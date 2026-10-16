"use client";
import { forwardRef, useContext, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "../../i18n";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import type { DateFieldProps } from "./DateField.types";
import { DateFieldControl, DateFieldValidationContext } from "./DateFieldControl";
import { formatDateText, parseDateText } from "./parseDateText";
import { isDateOnly } from "../DateRangeSelector/date-contract";
import styles from "../TextField/TextField.module.css";

export const TextDateField = forwardRef<HTMLDivElement, DateFieldProps & { locale: string }>(function TextDateField({
  locale, label, value, defaultValue = null, onValueChange, onValidityChange, min, max, name,
  description, errorMessage, invalid, required, disabled, readOnly, referenceDate,
}, ref) {
  const { t } = useTranslation();
  const validateCandidate = useContext(DateFieldValidationContext);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => root.current!);
  const [internal, setInternal] = useState(defaultValue);
  const selected = value === undefined ? internal : value;
  const [previous, setPrevious] = useState(selected);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  if (previous !== selected) { setPrevious(selected); setDraft(null); setValidationAttempted(false); }
  const reset = useStandaloneFormReset(root, () => {
    if (value === undefined) setInternal(defaultValue);
    setDraft(null); setValidationAttempted(false);
  });
  const text = draft ?? formatDateText(selected, locale);
  const parsed = text.trim() ? parseDateText(text, locale, referenceDate) : null;
  const unavailableReason = parsed ? validateCandidate?.(parsed) : undefined;
  const valid = !unavailableReason && !invalid && (!text.trim() ? !required : Boolean(parsed))
    && (!min || isDateOnly(min)) && (!max || isDateOnly(max))
    && (!parsed || ((!min || parsed >= min) && (!max || parsed <= max)));
  const showError = Boolean(invalid) || (validationAttempted && !valid);
  const message = unavailableReason ?? errorMessage ?? t("common.ui.invalidDate", { defaultMessage: "Enter a valid date." });
  useEffect(() => { input.current?.setCustomValidity(valid || disabled || readOnly ? "" : message); }, [valid, disabled, readOnly, message]);
  useEffect(() => { onValidityChange?.(valid); }, [valid, onValidityChange]);
  function commit() {
    if (reset.current || disabled || readOnly) return;
    setValidationAttempted(true);
    if (!valid) return;
    setDraft(null);
    if (parsed === selected) return;
    if (value === undefined) setInternal(parsed);
    onValueChange?.(parsed);
  }
  return <div ref={root} className={styles.root} data-invalid={showError || undefined} data-disabled={disabled || undefined}>
    <label htmlFor={id} className={styles.label}>{label}</label>
    <DateFieldControl><input id={id} ref={input} className={styles.input} type="text" value={text} disabled={disabled} readOnly={readOnly}
      required={required} aria-invalid={showError || undefined} aria-describedby={[description ? `${id}-description` : null, showError ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
      onChange={event => { setDraft(event.currentTarget.value); setValidationAttempted(false); }} onInvalid={() => setValidationAttempted(true)} onBlur={commit}
      onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); commit(); } }} /></DateFieldControl>
    {description && <div id={`${id}-description`} className={styles.description}>{description}</div>}
    {showError && <div id={`${id}-error`} className={styles.error}>{message}</div>}
    {name && <input type="hidden" name={name} value={selected && !validateCandidate?.(selected) ? selected : ""} disabled={disabled} />}
  </div>;
});
