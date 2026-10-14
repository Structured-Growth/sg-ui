"use client";
import { forwardRef, useState, useRef, useImperativeHandle, useMemo } from "react";
import { parseDate, parseDateTime, toCalendar, GregorianCalendar, createCalendar } from "@internationalized/date";
import { useDateField, useDateSegment } from "react-aria/useDateField";
import { useLocale } from "react-aria/I18nProvider";
import { useFocusRing } from "react-aria/useFocusRing";
import { mergeProps } from "react-aria/mergeProps";
import { useDateFieldState, type DateFieldState, type DateSegment } from "react-stately/useDateFieldState";
import { useTranslation } from "../../i18n";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import field from "../TextField/TextField.module.css";
import styles from "./DateField.module.css";

export interface DateFieldProps {
  label: string;
  /** date: YYYY-MM-DD; datetime: YYYY-MM-DDTHH:mm:ss without timezone. */
  kind?: "date" | "datetime";
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  min?: string;
  max?: string;
  name?: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hourCycle?: 12 | 24;
}
/** Internal native segment; field and segment hooks share the same interaction state. */
function NativeDateSegment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  return <span {...mergeProps(segmentProps, focusProps)} ref={ref} className={styles.segment}
    data-type={segment.type} data-placeholder={segment.isPlaceholder || undefined}
    data-focused={isFocused || undefined} data-focus-visible={isFocusVisible || undefined}
    data-disabled={state.isDisabled || undefined} data-readonly={state.isReadOnly || undefined}
    data-invalid={state.isInvalid || undefined}>{segment.text}</span>;
}

export const DateField = forwardRef<HTMLDivElement, DateFieldProps>(function DateField({ label, kind = "date", value,
  defaultValue, onValueChange, min, max, name, description, errorMessage, invalid, required, disabled, readOnly, hourCycle }, ref) {
  const parse = kind === "date" ? parseDate : parseDateTime;
  const { t } = useTranslation();
  const { locale } = useLocale();
  const safeParse = (raw: string | null | undefined) => {
    if (!raw || !(kind === "date" ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).test(raw)) return null;
    try { return parse(raw); } catch { return null; }
  };
  const [invalidDefault, setInvalidDefault] = useState(() => Boolean(defaultValue && !safeParse(defaultValue)));
  const root = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => root.current!);
  const [internal, setInternal] = useState(defaultValue ?? null);
  const silent = useRef(false);
  const resetting = useStandaloneFormReset(root, () => {
    // Calling the public engine setter also clears an incomplete display when
    // the complete owned value is already null. Keep reset separate from edits.
    silent.current = true;
    try {
      state.setValue(safeParse(value === undefined ? defaultValue : value));
      state.resetValidation();
      if (value === undefined) {
        setInternal(defaultValue ?? null);
        setInvalidDefault(Boolean(defaultValue && !safeParse(defaultValue)));
      }
    } finally { silent.current = false; }
  });
  const currentValue = value === undefined ? internal : value;
  // The state hook compares date object identity while updating its display.
  // Keep parsing stable across its own renders, as the component wrapper did.
  const parsedValue = useMemo(() => safeParse(currentValue), [currentValue, kind]);
  const invalidInput = value === undefined ? invalidDefault : Boolean(value && !parsedValue);
  const invalidBounds = Boolean((min && !safeParse(min)) || (max && !safeParse(max)));
  const validationMessage = errorMessage ?? ((invalidInput || invalidBounds)
    ? t("common.ui.invalidDate", { defaultMessage: "Enter a valid date." }) : undefined);
  const options = {
    label, description, errorMessage: validationMessage, name,
    minValue: safeParse(min) ?? undefined, maxValue: safeParse(max) ?? undefined,
    granularity: kind === "date" ? "day" as const : "second" as const, hourCycle,
    isInvalid: invalid || invalidInput || invalidBounds || undefined,
    isRequired: required, isDisabled: disabled, isReadOnly: readOnly,
    validationBehavior: "native" as const,
  };
  const state = useDateFieldState({ ...options, locale, createCalendar, value: parsedValue,
    onChange: date => {
      if (resetting.current || silent.current) return;
      const next = date ? toCalendar(date, new GregorianCalendar()).toString() : null;
      if (value === undefined) setInternal(next);
      setInvalidDefault(false); onValueChange?.(next);
      // Refresh a displayed error after an edit request. Validation commits on
      // the next render against the accepted value, including a rejecting host.
      // Waiting for blur can remove the error row during a submit pointer gesture
      // and move the host's button between pointerdown and pointerup.
      if (state.displayValidation.isInvalid) state.commitValidation();
    },
  });
  // The field hook's setValue/resetValidation calls are native reset requests.
  // The owned form transaction is their sole owner, including stale listeners
  // from a former form. Segment edits retain the public engine commands.
  const interactionState: DateFieldState = { ...state,
    setValue: () => {}, resetValidation: () => {},
  };
  const { labelProps, fieldProps, inputProps, descriptionProps, errorMessageProps,
    isInvalid, validationErrors } = useDateField({ ...options, inputRef: input }, interactionState, group);
  return <div ref={root} className={field.root} data-invalid={isInvalid || undefined}
    data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <span {...labelProps} className={field.label}>{label}</span>
    <div {...fieldProps} ref={group} className={[field.input, styles.input].join(" ")}
      data-invalid={isInvalid || undefined} data-disabled={disabled || undefined}>
      {state.segments.map((segment, index) => <NativeDateSegment key={index} segment={segment} state={interactionState} />)}
    </div>
    <input {...inputProps} ref={input} />
    {description && <div {...descriptionProps} className={field.description}>{description}</div>}
    {isInvalid && <div {...errorMessageProps} className={field.error}>{validationMessage ?? validationErrors.join(" ")}</div>}
  </div>;
});
