"use client";
import { forwardRef, type Ref } from "react";
import { I18nProvider, useLocale } from "react-aria-components/I18nProvider";
import { ThemeScope, type ThemeScopeProps } from "../../foundation/ThemeScope";
import { useTranslation } from "../../i18n";

export type ProviderProps = Omit<ThemeScopeProps, "dir" | "lang"> & { dir?: "ltr" | "rtl" };
function LocaleScope({ dir, scopeRef, ...props }: ProviderProps & { scopeRef: Ref<HTMLDivElement> }) {
  const { locale, direction } = useLocale();
  return <ThemeScope {...props} ref={scopeRef} lang={locale} dir={dir ?? direction} />;
}
/** Uses the existing host translation adapter as the locale authority. */
export const Provider = forwardRef<HTMLDivElement, ProviderProps>(function Provider(props, ref) {
  const { locale } = useTranslation();
  return <I18nProvider locale={locale}><LocaleScope {...props} scopeRef={ref} /></I18nProvider>;
});
