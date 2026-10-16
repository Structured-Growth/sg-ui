"use client";
import { createContext, useContext, type ReactNode } from "react";
import styles from "../TextField/TextField.module.css";

/** Private picker policy, shared by text and segmented entry without expanding the public field API. */
export const DateFieldValidationContext = createContext<((value: string) => string | undefined) | undefined>(undefined);

/** Private composition slot: the picker action belongs beside the editable control. */
export const DateFieldActionContext = createContext<ReactNode>(null);

export function DateFieldControl({ children }: { children: ReactNode }) {
  const action = useContext(DateFieldActionContext);
  return action ? <div className={styles.controlGroup} data-sgui-part="date-field-control-group">{children}{action}</div> : <>{children}</>;
}
