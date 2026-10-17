"use client";
import {FieldMessages} from "../TextField/FieldMessages";
import { forwardRef, useState, useRef, useImperativeHandle, useMemo, useContext, useEffect } from "react";
import { parseDate, parseDateTime, toCalendar, GregorianCalendar, createCalendar } from "@internationalized/date";
import { useDateField, useDateSegment } from "react-aria/useDateField";
import { useLocale } from "react-aria/I18nProvider";
import { useFocusRing } from "react-aria/useFocusRing";
import { mergeProps } from "react-aria/mergeProps";
import { useDateFieldState, type DateFieldState, type DateSegment } from "react-stately/useDateFieldState";
import { useTranslation } from "../../i18n";
import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";
import { TextDateField } from "./TextDateField";
import { DateFieldControl, DateFieldValidationContext } from "./DateFieldControl";
import field from "../TextField/TextField.module.css";
import styles from "./DateField.module.css";

import type { DateFieldProps } from "./DateField.types";
export type { DateFieldProps } from "./DateField.types";
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

const SegmentedDateField = forwardRef<HTMLDivElement, DateFieldProps>(function SegmentedDateField({ label, kind = "date", value,
  defaultValue, onValueChange, onValidityChange, min, max, name, description, descriptionPlacement, errorPlacement, errorMessage, invalid, required, disabled, readOnly, hourCycle }, ref) {
  const validateCandidate = useContext(DateFieldValidationContext);
  const [rejectedDraft, setRejectedDraft] = useState<string | undefined>(undefined);
  const [previousValue, setPreviousValue] = useState(value);
  if (previousValue !== value) { setPreviousValue(value); setRejectedDraft(undefined); }
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
    setRejectedDraft(undefined);
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
  // A policy-rejected segment draft stays editable, but never owns the named form value.
  const parsedValue = useMemo(() => safeParse(rejectedDraft ?? currentValue), [rejectedDraft, currentValue, kind]);
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
    validate: (date: NonNullable<ReturnType<typeof safeParse>>) => validateCandidate?.(toCalendar(date, new GregorianCalendar()).toString()) ?? null,
    validationBehavior: "native" as const,
  };
  const state = useDateFieldState({ ...options, locale, createCalendar, value: parsedValue,
    onChange: date => {
      if (resetting.current || silent.current || disabled || readOnly) return;
      const next = date ? toCalendar(date, new GregorianCalendar()).toString() : null;
      if (next && validateCandidate?.(next)) { setRejectedDraft(next); return; }
      setRejectedDraft(undefined);
      if (value === undefined) setInternal(next);
      setInvalidDefault(false); onValueChange?.(next);
      // Refresh a displayed error after an edit request. Validation commits on
      // the next render against the accepted value, including a rejecting host.
      // Waiting for blur can remove the error row during a submit pointer gesture
      // and move the host's button between pointerdown and pointerup.
      if (state.displayValidation.isInvalid) state.commitValidation();
    },
  });
  const valid = !state.realtimeValidation.isInvalid && (!required || Boolean(state.value));
  useEffect(() => { onValidityChange?.(valid); }, [valid, onValidityChange]);
  // The field hook's setValue/resetValidation calls are native reset requests.
  // The owned form transaction is their sole owner, including stale listeners
  // from a former form. Segment edits retain the public engine commands.
  const interactionState: DateFieldState = { ...state,
    setValue: () => {}, resetValidation: () => {},
  };
  const { labelProps, fieldProps, inputProps, descriptionProps, errorMessageProps,
    isInvalid, validationErrors } = useDateField({ ...options, inputRef: input }, interactionState, group);
  const messages={descriptionPlacement,errorPlacement,description:(description && <div {...descriptionProps} className={field.description}>{description}</div>),error:(isInvalid && <div {...errorMessageProps} className={field.error}>{validationMessage ?? validationErrors.join(" ")}</div>)};
  return <div ref={root} className={field.root} data-invalid={isInvalid || undefined}
    data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <span {...labelProps} className={field.label}>{label}</span><FieldMessages position="above" {...messages}/>
    <DateFieldControl><div {...fieldProps} ref={group} className={[field.input, styles.input].join(" ")}
      data-invalid={isInvalid || undefined} data-disabled={disabled || undefined}>
      {state.segments.map((segment, index) => <NativeDateSegment key={index} segment={segment} state={interactionState} />)}
    </div></DateFieldControl>
    <input {...inputProps} ref={input} value={currentValue && safeParse(currentValue) && !validateCandidate?.(currentValue) ? currentValue : ""} />
    <FieldMessages position="below" {...messages}/>
  </div>;
});

export const DateField = forwardRef<HTMLDivElement, DateFieldProps>(function DateField(props, ref) {
  const { locale } = useLocale();
  return props.entryMode === "text" && props.kind !== "datetime"
    ? <TextDateField {...props} locale={locale} ref={ref} /> : <SegmentedDateField {...props} ref={ref} />;
});
