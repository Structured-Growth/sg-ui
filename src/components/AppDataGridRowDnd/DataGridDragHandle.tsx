"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Button as AriaButton } from "react-aria-components/Button";
import { DragIndicatorIcon } from "../../experimental/icons";
import styles from "./DataGridDragHandle.module.css";

/** Owned reorder action. The host supplies the translated row-specific name. */
export interface DataGridDragHandleProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "id" | "slot" | "tabIndex" | "onKeyDown"> {
  label: string;
  disabled?: boolean;
  dragging?: boolean;
  onPress?: () => void;
}

export const DataGridDragHandle = forwardRef<HTMLButtonElement, DataGridDragHandleProps>(function DataGridDragHandle(
  { label, disabled, dragging, className, onPress, ...props }, ref,
) {
  return <AriaButton {...props} ref={ref} type="button" aria-label={label} isDisabled={disabled}
    onPress={onPress} className={[styles.handle, className].filter(Boolean).join(" ")}
    data-sgui-part="grid-drag-handle" data-dragging={dragging || undefined}>
    <DragIndicatorIcon aria-hidden="true" />
  </AriaButton>;
});
