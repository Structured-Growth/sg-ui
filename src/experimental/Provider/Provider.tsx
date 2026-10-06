"use client";
import { I18nProvider, useLocale } from "react-aria-components/I18nProvider";
import { ThemeScope, type ThemeScopeProps } from "../../foundation/ThemeScope";
import { useTranslation } from "../../i18n";

export type ProviderProps = Omit<ThemeScopeProps, "dir" | "lang">;
function LocaleScope(props: ProviderProps) {
  const { locale, direction } = useLocale();
  return <ThemeScope {...props} lang={locale} dir={direction} />;
}
/** Uses the existing host translation adapter as the locale authority. */
export function Provider(props: ProviderProps) {
  const { locale } = useTranslation();
  return <I18nProvider locale={locale}><LocaleScope {...props} /></I18nProvider>;
}
