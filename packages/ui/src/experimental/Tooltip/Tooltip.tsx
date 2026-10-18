"use client";
import { forwardRef, useContext, useEffect, useRef, useState, type Ref, type CSSProperties, type ReactElement } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger, TooltipContext, TooltipTriggerStateContext } from "react-aria-components/Tooltip";
import { useFocusVisible } from "react-aria/useFocusVisible";
import { useOverlayScope } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../../components/Button/Button";
import styles from "./Tooltip.module.css";
export interface TooltipProps {
  /** Change the trigger key when replacing its action identity. */
  trigger: ReactElement<ButtonProps>;
  /** Plain supplementary text. Interactive content belongs in Popover. */
  content: string;
  placement?: "top" | "bottom" | "start" | "end" | "top start" | "top end" | "bottom start" | "bottom end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  return <TooltipLifetime key={props.trigger.key} {...props} tooltipRef={ref} />;
});

function TooltipLifetime(
  { trigger, content, placement = "top", open, defaultOpen, onOpenChange, delay = 700, closeDelay = 100,
    disabled, className, style, tooltipRef }: TooltipProps & { tooltipRef: Ref<HTMLDivElement> },
) {
  const scope = useOverlayScope();
  const [focusOnly, setFocusOnly] = useState(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  // Pending engine callbacks must not reach the host after this trigger is detached.
  // Controlled open remains host-owned after a keyed replacement.
  return <TooltipTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={value => {
    if (active.current) onOpenChange?.(value);
  }}
    delay={delay} closeDelay={closeDelay} isDisabled={disabled} trigger={focusOnly ? "focus" : undefined}>
    {trigger}<TooltipFocusPriority onChange={setFocusOnly}/><AriaTooltip {...scope} ref={tooltipRef} placement={placement} offset={8}
      className={[styles.root,className].filter(Boolean).join(" ")} style={{...scope.style,...style}}
      data-sgui-part="tooltip">{content}</AriaTooltip>
  </TooltipTrigger>;
}

/** A keyboard description keeps its focus lifetime when layout moves the pointer away. */
function TooltipFocusPriority({ onChange }: { onChange: (focused: boolean) => void }) {
  const state = useContext(TooltipTriggerStateContext);
  const context = useContext(TooltipContext);
  const trigger = context && "triggerRef" in context ? context.triggerRef : null;
  const { isFocusVisible } = useFocusVisible();
  useEffect(() => {
    const node = trigger?.current;
    const update = () => onChange(Boolean(state?.isOpen && isFocusVisible && node && node.ownerDocument.activeElement === node));
    update();
    if (!node || !state?.isOpen) return;
    // Focus may arrive after a hover has already opened the same description.
    node.addEventListener("focus", update);
    node.addEventListener("blur", update);
    return () => {
      node.removeEventListener("focus", update);
      node.removeEventListener("blur", update);
    };
  }, [state?.isOpen, isFocusVisible, trigger, onChange]);
  return null;
}
