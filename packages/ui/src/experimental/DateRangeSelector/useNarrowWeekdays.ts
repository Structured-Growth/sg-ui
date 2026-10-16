import { useMemo } from "react";

/** Native locale abbreviations, including languages whose initials cannot be sliced from short names. */
export function useNarrowWeekdays(locale: string) {
  return useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    return new Map(Array.from({ length: 7 }, (_, day) => {
      const date = new Date(Date.UTC(2026, 9, 4 + day));
      return [short.format(date), narrow.format(date)];
    }));
  }, [locale]);
}
