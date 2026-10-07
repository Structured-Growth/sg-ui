"use client";
import { forwardRef, type CSSProperties, type ReactElement } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components/Tooltip";
import { useOverlayScope } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../Button/Button";
import styles from "./Tooltip.module.css";
export interface TooltipProps {
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
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { trigger, content, placement = "top", open, defaultOpen, onOpenChange, delay = 700, closeDelay = 100,
    disabled, className, style }, ref,
) {
  const scope = useOverlayScope();
  return <TooltipTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}
    delay={delay} closeDelay={closeDelay} isDisabled={disabled}>
    {trigger}<AriaTooltip {...scope} ref={ref} placement={placement} offset={8}
      className={[styles.root,className].filter(Boolean).join(" ")} style={{...scope.style,...style}}
      data-sgui-part="tooltip">{content}</AriaTooltip>
  </TooltipTrigger>;
});
