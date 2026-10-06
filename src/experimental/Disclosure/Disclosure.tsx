"use client";
import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../Button/Button";
import { Collapse } from "../Collapse/Collapse";
import styles from "./Disclosure.module.css";
export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  children: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  unmountOnCollapse?: boolean;
}
export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure({ label, children, expanded: controlled, defaultExpanded = false, onExpandedChange, disabled, unmountOnCollapse, className, ...props }, ref) {
  const [internal, setInternal] = useState(defaultExpanded);
  const expanded = controlled ?? internal;
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const contentFocused = useRef(false);
  useEffect(() => {
    if (!expanded && contentFocused.current) {
      trigger.current?.focus();
      contentFocused.current = false;
    }
  }, [expanded]);
  return <div {...props} ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} data-sgui-part="disclosure">
    <Button ref={trigger} id={`${id}-trigger`} variant="text" tone="neutral" disabled={disabled} aria-expanded={expanded} aria-controls={`${id}-panel`} className={styles.trigger} onPress={() => {
      if (controlled === undefined) setInternal(!expanded);
      onExpandedChange?.(!expanded);
    }}><span aria-hidden="true" className={styles.indicator}>{expanded ? "−" : "+"}</span>{label}</Button>
    <Collapse ref={content} id={`${id}-panel`} expanded={expanded} unmountOnCollapse={unmountOnCollapse} role="region" aria-labelledby={`${id}-trigger`} className={styles.panel}
      onFocusCapture={() => { contentFocused.current = true; }}
      onBlurCapture={(event) => { contentFocused.current = event.currentTarget.contains(event.relatedTarget as Node | null); }}>{children}</Collapse>
  </div>;
});
