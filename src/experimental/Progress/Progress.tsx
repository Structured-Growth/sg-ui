"use client";

import { forwardRef, type CSSProperties } from "react";
import { ProgressBar } from "react-aria-components/ProgressBar";
import styles from "./Progress.module.css";

interface ProgressOptions {
  id?: string;
  className?: string;
  style?: CSSProperties;
  variant?: "linear" | "circular";
  /** Omit value for loading without a known amount of work. */
  value?: number;
  minValue?: number;
  maxValue?: number;
  /** Host-translated description, for example “3 of 10 files”. */
  valueText?: string;
}
export type ProgressProps = ProgressOptions & (
  { label: string; "aria-label"?: string; "aria-labelledby"?: string } |
  { label?: never; "aria-label": string; "aria-labelledby"?: string } |
  { label?: never; "aria-label"?: never; "aria-labelledby": string }
);

/** Value changes are available through progress semantics, without a live region. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { label, value, minValue = 0, maxValue = 100, valueText, variant = "linear", className, ...props }, ref,
) {
  const minimum = Number.isFinite(minValue) ? minValue : 0;
  const maximum = Number.isFinite(maxValue) && maxValue > minimum ? maxValue : minimum + 100;
  const indeterminate = value === undefined || !Number.isFinite(value);
  const current = indeterminate ? undefined : Math.min(maximum, Math.max(minimum, value!));
  const percentage = current === undefined ? 0 : (current - minimum) / (maximum - minimum) * 100;
  return <ProgressBar {...props} ref={ref} aria-label={props["aria-label"] ?? label}
    value={current} minValue={minimum} maxValue={maximum} valueLabel={valueText}
    isIndeterminate={indeterminate} className={[styles.root, className].filter(Boolean).join(" ")}
    data-variant={variant} data-indeterminate={indeterminate || undefined} data-sgui-part="progress">
    {label && <span className={styles.label}>{label}</span>}
    {variant === "circular" ? <svg className={styles.circular} viewBox="0 0 32 32" aria-hidden="true">
      <circle className={styles.circleTrack} cx="16" cy="16" r="13" />
      <circle className={styles.circleFill} cx="16" cy="16" r="13" pathLength="100"
        strokeDasharray={`${indeterminate ? 25 : percentage} 100`} />
    </svg> : <span className={styles.track} aria-hidden="true">
      <span className={styles.fill} style={{ inlineSize: indeterminate ? undefined : `${percentage}%` }} />
    </span>}
  </ProgressBar>;
});
