"use client";
import { createContext, useContext, type ReactNode } from "react";
import { formatIcuMessage, type MessageValues } from "./icu";
export type SGTranslationOptions = { defaultMessage: string; namespace?: string; values?: MessageValues };
export type SGTranslationAdapter = {
  locale: string;
  t: (key: string, options: SGTranslationOptions) => string;
  useNamespace: (namespace: string) => void;
};
const defaultAdapter: SGTranslationAdapter = {
  locale: "en-US",
  t: (_key, options) => formatIcuMessage(options.defaultMessage, "en-US", options.values),
  useNamespace: () => {},
};
const TranslationContext = createContext(defaultAdapter);
export function SGTranslationProvider({ value, children }: { value: SGTranslationAdapter; children: ReactNode }) {
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}
export const useTranslation = () => useContext(TranslationContext);
