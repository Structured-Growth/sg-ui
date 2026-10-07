"use client";
import { forwardRef, useCallback, useRef, useState, useMemo } from "react";
import { parseTime, toCalendarDateTime, today, getLocalTimeZone } from "@internationalized/date";
import { useTimeField, useDateSegment } from "react-aria/useTimeField";
import { useLocale } from "react-aria/I18nProvider";
import { useFocusRing } from "react-aria/useFocusRing";
import { mergeProps } from "react-aria/mergeProps";
import { useTimeFieldState, type TimeFieldState } from "react-stately/useTimeFieldState";
import type { DateSegment } from "react-stately/useDateFieldState";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import { useTranslation } from "../../i18n";
import field from "../TextField/TextField.module.css";
import styles from "../DateField/DateField.module.css";

export interface TimeFieldProps {
  label: string;
  /** Local clock time HH:mm:ss; this is not an instant. */
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
/** Segments share the clock state; no DOM draft reconstruction is needed. */
function NativeTimeSegment({ segment, state }: { segment: DateSegment; state: TimeFieldState }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  return <span {...mergeProps(segmentProps, focusProps)} ref={ref} className={styles.segment}
    data-type={segment.type} data-placeholder={segment.isPlaceholder || undefined}
    data-focused={isFocused || undefined} data-focus-visible={isFocusVisible || undefined}
    data-disabled={state.isDisabled || undefined} data-readonly={state.isReadOnly || undefined}
    data-invalid={state.isInvalid || undefined}>{segment.text}</span>;
}

export const TimeField = forwardRef<HTMLDivElement, TimeFieldProps>(function TimeField({ label, value, defaultValue,
  onValueChange, min, max, name, description, errorMessage, invalid, required, disabled, readOnly, hourCycle }, ref) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const safeParse = (raw: string | null | undefined) => {
    if (!raw || !/^\d{2}:\d{2}:\d{2}$/.test(raw)) return null;
    try { return parseTime(raw); } catch { return null; }
  };
  const [invalidDefault, setInvalidDefault] = useState(() => Boolean(defaultValue && !safeParse(defaultValue)));
  const root = useRef<HTMLDivElement | null>(null);
  const nativeRef = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === "function") return ref(node);
    if (ref) ref.current = node;
  }, [ref]);
  const group = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue ?? null);
  const silent = useRef(false);
  const resetting = useStandaloneFormReset(root, () => {
    const time = safeParse(value === undefined ? defaultValue : value);
    silent.current = true;
    try {
      // The engine stores clock segments on an internal calendar date. Only the
      // local Time is exposed and serialized, exactly as in useTimeFieldState.
      state.setValue(time ? toCalendarDateTime(state.value ?? today(getLocalTimeZone()), time) : null);
      state.resetValidation();
      if (value === undefined) {
        setInternal(defaultValue ?? null);
        setInvalidDefault(Boolean(defaultValue && !safeParse(defaultValue)));
      }
    } finally { silent.current = false; }
  });
  const currentValue = value === undefined ? internal : value;
  // Stable parsing keeps unrelated host renders from clearing partial segments.
  const parsedValue = useMemo(() => safeParse(currentValue), [currentValue]);
  const invalidInput = value === undefined ? invalidDefault : Boolean(value && !parsedValue);
  const invalidBounds = Boolean((min && !safeParse(min)) || (max && !safeParse(max)));
  const validationMessage = errorMessage ?? ((invalidInput || invalidBounds)
    ? t("common.ui.invalidTime", { defaultMessage: "Enter a valid time." }) : undefined);
  const options = {
    label, description, errorMessage: validationMessage, name,
    minValue: safeParse(min) ?? undefined, maxValue: safeParse(max) ?? undefined,
    granularity: "second" as const, hourCycle,
    isInvalid: invalid || invalidInput || invalidBounds || undefined,
    isRequired: required, isDisabled: disabled, isReadOnly: readOnly,
    validationBehavior: "native" as const,
  };
  const state = useTimeFieldState({ ...options, locale, value: parsedValue,
    onChange: time => {
      if (resetting.current || silent.current) return;
      const next = time?.toString() ?? null;
      if (value === undefined) setInternal(next);
      setInvalidDefault(false); onValueChange?.(next);
    },
  });
  // Only the owned form transaction may reset value/validation. Blocking the
  // field hook's reset setters also preserves incomplete engine segment state
  // when a delegated host handler prevents reset. Segment edit commands remain.
  const interactionState: TimeFieldState = { ...state, setValue: () => {}, resetValidation: () => {} };
  const { labelProps, fieldProps, inputProps, descriptionProps, errorMessageProps,
    isInvalid, validationErrors } = useTimeField({ ...options, inputRef: input }, interactionState, group);
  return <div ref={nativeRef} className={field.root} data-invalid={isInvalid || undefined}
    data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <span {...labelProps} className={field.label}>{label}</span>
    <div {...fieldProps} ref={group} className={[field.input, styles.input].join(" ")}
      data-invalid={isInvalid || undefined} data-disabled={disabled || undefined}>
      {state.segments.map((segment, index) => <NativeTimeSegment key={index} segment={segment} state={interactionState} />)}
    </div>
    <input {...inputProps} ref={input} />
    {description && <div {...descriptionProps} className={field.description}>{description}</div>}
    {isInvalid && <div {...errorMessageProps} className={field.error}>{validationMessage ?? validationErrors.join(" ")}</div>}
  </div>;
});
