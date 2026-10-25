"use client";
import {Children, forwardRef, isValidElement, useEffect, useId, useRef, useState, useImperativeHandle, type CSSProperties, type ReactElement, type ReactNode} from "react";
import {Button} from "../Button/Button";
import type {SurveyQuestionProps} from "../SurveyQuestion/SurveyQuestion";
import {Typography} from "../../experimental/Typography/Typography";
import {Progress} from "../../experimental/Progress/Progress";
import {useTranslation} from "../../i18n";
import styles from "./Survey.module.css";
export interface SurveyProps {
  title: string;
  description?: string;
  children: ReactElement<SurveyQuestionProps> | readonly ReactElement<SurveyQuestionProps>[];
  mode?: "all" | "one";
  allowBack?: boolean;
  currentQuestionId?: string;
  defaultQuestionId?: string;
  onQuestionChange?: (id: string) => void;
  /** Validate all questions before invoking. Answers and persistence remain host-owned. */
  onSubmit: () => void;
  submitting?: boolean;
  disabled?: boolean;
  showProgress?: boolean;
  submitLabel?: string;
  errorMessage?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export const Survey = forwardRef<HTMLFormElement, SurveyProps>(function Survey({title, description, children, mode = "one", allowBack = true, currentQuestionId, defaultQuestionId, onQuestionChange, onSubmit, submitting, disabled, showProgress = true, submitLabel, errorMessage, className, style}, ref) {
  const {t} = useTranslation();
  const headingId = useId();
  const root = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const questions = Children.toArray(children).filter(isValidElement<SurveyQuestionProps>);
  const [internalId, setInternalId] = useState(defaultQuestionId);
  const requested = currentQuestionId ?? internalId;
  const index = Math.max(0, questions.findIndex(question => question.props.id === requested));
  const activeId = questions[index]?.props.id;
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    if (pendingFocus.current === activeId) {
      root.current?.querySelector<HTMLElement>(`[data-question-index="${index}"] [data-survey-focus]`)?.focus();
      pendingFocus.current = null;
    }
  }, [activeId, index]);
  const change = (next: number) => {
    const id = questions[next]?.props.id;
    if (!id || disabled || submitting) return;
    pendingFocus.current = id;
    if (currentQuestionId === undefined) setInternalId(id);
    onQuestionChange?.(id);
  };
  const validate = (questionIndex: number) => {
    const panel = root.current?.querySelector(`[data-question-index="${questionIndex}"]`);
    const invalid = Array.from(panel?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select") ?? [])
      .find(input => !input.matches(":disabled") && !input.checkValidity());
    // Host-invalid custom controls may have no native constraint.
    if (invalid || questions[questionIndex]?.props.invalid) {
      if (mode === "one" && index !== questionIndex) change(questionIndex);
      requestAnimationFrame(() => { invalid?.reportValidity(); invalid?.focus(); });
      return false;
    }
    return true;
  };
  return <form ref={root} aria-labelledby={headingId} noValidate style={style} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="survey" aria-busy={submitting || undefined}
    onSubmit={event => {
      event.preventDefault();
      if (disabled || submitting || !questions.length) return;
      if (mode === "one" && index < questions.length - 1) {
        if (validate(index)) change(index + 1);
        return;
      }
      for (let next = 0; next < questions.length; next++) if (!validate(next)) return;
      onSubmit();
    }}>
    <Typography id={headingId} as="h2" variant="h5">{title}</Typography>
    {description && <Typography tone="muted">{description}</Typography>}
    {showProgress && mode === "one" && questions.length > 0 && <Progress label={t("survey.position", {defaultMessage: "Question {current} of {total}", values: {current: index + 1, total: questions.length}})} value={index + 1} maxValue={questions.length} />}
    <fieldset className={styles.questions} disabled={disabled || submitting}>
      {questions.map((question, next) => <div key={question.props.id} data-question-index={next} hidden={mode === "one" && next !== index}>
        <div tabIndex={-1} data-survey-focus="">{question}</div>
      </div>)}
    </fieldset>
    {errorMessage && <Typography role="alert" tone="danger">{errorMessage}</Typography>}
    <div className={styles.actions}>
      {mode === "one" && allowBack && <Button variant="outlined" tone="neutral" disabled={disabled || submitting || index === 0} onPress={() => change(index - 1)}>{t("survey.back", {defaultMessage: "Back"})}</Button>}
      {mode === "one" && index < questions.length - 1 ? <Button disabled={disabled || submitting} onPress={() => { if (validate(index)) change(index + 1); }}>{t("survey.next", {defaultMessage: "Next"})}</Button>
        : <Button type="submit" disabled={disabled || !questions.length} loading={submitting}>{submitLabel ?? t("survey.submit", {defaultMessage: "Submit"})}</Button>}
    </div>
  </form>;
});
