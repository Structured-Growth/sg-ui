"use client";

import { forwardRef } from "react";
import { Button, type ButtonProps } from "../../experimental/Button/Button";

/** SGUI-owned action contract. Use Link for host-routed navigation. */
export interface AppButtonProps extends ButtonProps {}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton(props, ref) {
  return <Button {...props} ref={ref} />;
});
