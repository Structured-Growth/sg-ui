"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { formatIcuMessage, type MessageValues } from "./icu";
export { formatIcuMessage, extractIcuVariables, validateIcuVariables, type MessageValues } from "./icu";
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
  const adapter = useMemo<SGTranslationAdapter>(() => ({
    locale: value.locale,
    useNamespace: namespace => value.useNamespace(namespace),
    t: (key, options) => {
      try {
        const translated = value.t(key, options);
        if (typeof translated === "string" && translated !== key && !/^\[\[missing_translation(?:[^\]]*)\]\]$/.test(translated)) return translated;
      } catch {
        // The host diagnoses its lookup failure before returning/throwing.
        // Do not retry, fetch catalogs, log values or change the host locale.
      }
      return defaultAdapter.t(key, options);
    },
  }), [value]);
  return <TranslationContext.Provider value={adapter}>{children}</TranslationContext.Provider>;
}
export const useTranslation = () => useContext(TranslationContext);
