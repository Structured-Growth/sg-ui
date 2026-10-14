"use client";
import { forwardRef } from "react";
import { Progress, type ProgressProps } from "../../experimental/Progress/Progress";
type FixedVariant<T> = T extends unknown ? Omit<T, "variant"> : never;
export type CircularProgressProps = FixedVariant<ProgressProps>;
export type LinearProgressProps = FixedVariant<ProgressProps>;
export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(function CircularProgress(props, ref) {
  return <Progress {...props} ref={ref} variant="circular" />;
});
export const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(function LinearProgress(props, ref) {
  return <Progress {...props} ref={ref} variant="linear" />;
});
