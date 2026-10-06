"use client";
import type { ReactElement, ReactNode } from "react";
import { DialogTrigger, Dialog } from "react-aria-components/Dialog";
import { Popover as AriaPopover } from "react-aria-components/Popover";
import { Heading } from "react-aria-components/Heading";
import { useOverlayScope } from "../../foundation/ThemeScope";
import type { ButtonProps } from "../Button/Button";
import styles from "./Popover.module.css";

export interface PopoverProps {
  trigger: ReactElement<ButtonProps>;
  title: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
  size?: "md" | "lg";
}

export function Popover({ trigger, title, children, open, defaultOpen, onOpenChange, placement = "bottom start", size = "md" }: PopoverProps) {
  const scope = useOverlayScope();
  return <DialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}<AriaPopover {...scope} placement={placement} data-size={size} className={styles.root}>
      <Dialog className={styles.dialog}><Heading slot="title" className={styles.title}>{title}</Heading>{children}</Dialog>
    </AriaPopover>
  </DialogTrigger>;
}
