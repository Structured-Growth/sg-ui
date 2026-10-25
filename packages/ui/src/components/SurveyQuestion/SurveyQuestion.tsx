"use client";
import {forwardRef, useId, type CSSProperties, type ReactNode} from "react";
import {RadioGroup} from "../../experimental/RadioGroup/RadioGroup";
import {Checkbox} from "../../experimental/Checkbox/Checkbox";
import {TextArea} from "../../experimental/TextArea/TextArea";
import {Rating} from "../../experimental/Rating/Rating";
import {Typography} from "../../experimental/Typography/Typography";
import {useTranslation} from "../../i18n";
import styles from "./SurveyQuestion.module.css";
export type SurveyAnswer = string | readonly string[] | number | null;
export interface SurveyQuestionOption { id: string; label: string; disabled?: boolean }
export interface SurveyQuestionProps {
  /** Stable question ID, also used as its native form name unless name is supplied. */
  id: string;
  prompt: string;
  description?: string;
  kind?: "single" | "multiple" | "text" | "rating" | "custom";
  options?: readonly SurveyQuestionOption[];
  value?: SurveyAnswer;
  onValueChange?: (value: SurveyAnswer) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  name?: string;
  /** Optional host-revealed AnswerFeedback, distinct from validation errors. */
  feedback?: ReactNode;
  /** Custom answer controls. Supply their own labels and native validation. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export const SurveyQuestion = forwardRef<HTMLFieldSetElement, SurveyQuestionProps>(function SurveyQuestion({id, prompt, description, kind = "single", options = [], value = null, onValueChange, required, disabled, readOnly, invalid, errorMessage, name, feedback, children, className, style}, ref) {
  const generated = useId();
  const {t} = useTranslation();
  const selected = Array.isArray(value) ? value : [];
  const answerLabel = t("survey.answer", {defaultMessage: "Your answer"});
  return <fieldset ref={ref} id={generated} data-question-id={id} disabled={disabled} style={style}
    className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="survey-question"
    aria-describedby={[description && `${generated}-description`, invalid && errorMessage && `${generated}-error`].filter(Boolean).join(" ") || undefined} aria-invalid={invalid || undefined}>
    <legend className={styles.legend}><Typography as="span" variant="subtitle1">{prompt}{required && <Typography as="span" variant="caption"> {t("survey.required", {defaultMessage: "(required)"})}</Typography>}</Typography></legend>
    {description && <Typography id={`${generated}-description`} tone="muted" variant="body2">{description}</Typography>}
    {kind === "single" && <RadioGroup label={answerLabel} options={options.map(option => ({value: option.id, label: option.label, disabled: option.disabled}))}
      name={name ?? id} value={typeof value === "string" ? value : null} onValueChange={onValueChange} required={required} disabled={disabled} readOnly={readOnly} invalid={invalid} />}
    {kind === "multiple" && <div className={styles.options}>{options.map((option, index) => <Checkbox key={option.id} label={option.label} name={name ?? id} value={option.id}
      checked={selected.includes(option.id)} disabled={disabled || option.disabled} readOnly={readOnly} invalid={invalid}
      required={required && selected.length === 0 && index === options.findIndex(item => !item.disabled)}
      onCheckedChange={checked => onValueChange?.(checked ? [...selected, option.id] : selected.filter(item => item !== option.id))} />)}</div>}
    {kind === "text" && <TextArea label={answerLabel} name={name ?? id} value={typeof value === "string" ? value : ""} onValueChange={onValueChange} required={required} disabled={disabled} readOnly={readOnly} invalid={invalid} />}
    {kind === "rating" && <Rating label={answerLabel} name={name ?? id} value={typeof value === "number" ? value : null} onValueChange={onValueChange} required={required} disabled={disabled} readOnly={readOnly} invalid={invalid} />}
    {kind === "custom" && children}
    {invalid && errorMessage && <Typography id={`${generated}-error`} tone="danger" variant="body2" role="alert">{errorMessage}</Typography>}
    {feedback}
  </fieldset>;
});
