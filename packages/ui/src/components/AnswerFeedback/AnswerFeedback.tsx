import {forwardRef, type CSSProperties, type ReactNode} from "react";
import {Surface} from "../../experimental/Surface/Surface";
import {Typography} from "../../experimental/Typography/Typography";
import styles from "./AnswerFeedback.module.css";
export interface AnswerFeedbackProps {
  title: string;
  children?: ReactNode;
  tone?: "neutral" | "positive" | "negative";
  className?: string;
  style?: CSSProperties;
}
/** The host decides when to reveal feedback and supplies its meaning in text. */
export const AnswerFeedback = forwardRef<HTMLElement, AnswerFeedbackProps>(function AnswerFeedback({title, children, tone = "neutral", className, style}, ref) {
  return <Surface ref={ref} role="status" variant="outlined" padding={3} style={style}
    className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="answer-feedback" data-tone={tone}>
    <Typography variant="subtitle2" tone={tone === "negative" ? "danger" : "default"}>{title}</Typography>
    {children && <div>{children}</div>}
  </Surface>;
});
