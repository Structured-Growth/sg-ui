"use client";
import { forwardRef, useId, type CSSProperties } from "react";
import { Switch as AriaSwitch } from "react-aria-components/Switch";
import styles from "./Switch.module.css";
export interface SwitchProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  value?: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
}
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch({ label, checked, defaultChecked, onCheckedChange, disabled, readOnly, name, value, description, className, style }, ref) {
  const id = useId();
  return <AriaSwitch ref={ref} aria-labelledby={id} aria-describedby={description ? id + "-description" : undefined} isSelected={checked} defaultSelected={defaultChecked} onChange={onCheckedChange}
    isDisabled={disabled} isReadOnly={readOnly} name={name} value={value} className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
    <span aria-hidden="true" className={styles.track}><span className={styles.thumb} /></span>
    <span><span id={id}>{label}</span>{description && <span id={id + "-description"} className={styles.description}>{description}</span>}</span>
  </AriaSwitch>;
});
