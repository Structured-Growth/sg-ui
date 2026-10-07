"use client";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type CSSProperties } from "react";
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
  const root = useRef<HTMLLabelElement>(null);
  const resetting = useRef(false);
  useImperativeHandle(ref, () => root.current!, []);
  const [selected, setSelected] = useState(defaultChecked ?? false);
  useEffect(() => {
    const form = root.current?.querySelector("input")?.form;
    if (!form) return;
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      resetting.current = true;
      // A task waits for native and React delegated host handlers; browsers can
      // checkpoint microtasks between native event listeners.
      const timer = setTimeout(() => {
        pending.delete(timer);
        resetting.current = pending.size > 0;
        if (!event.defaultPrevented && checked === undefined) setSelected(defaultChecked ?? false);
      }, 0);
      pending.add(timer);
    };
    form.addEventListener("reset", reset, true);
    return () => {
      form.removeEventListener("reset", reset, true);
      pending.forEach(clearTimeout);
      resetting.current = false;
    };
  }, [checked, defaultChecked]);
  return <AriaSwitch ref={root} aria-labelledby={id} aria-describedby={description ? id + "-description" : undefined} isSelected={checked ?? selected} onChange={next => {
    // Label presses can reach React Aria even when an ancestor fieldset disables
    // the input. Native :disabled also respects the first-legend exception.
    if (resetting.current || root.current?.querySelector("input")?.matches(":disabled")) return;
    if (checked === undefined) setSelected(next);
    onCheckedChange?.(next);
  }}
    isDisabled={disabled} isReadOnly={readOnly} name={name} value={value} className={[styles.root, className].filter(Boolean).join(" ")} style={style}>
    <span aria-hidden="true" className={styles.track}><span className={styles.thumb} /></span>
    <span><span id={id}>{label}</span>{description && <span id={id + "-description"} className={styles.description}>{description}</span>}</span>
  </AriaSwitch>;
});
