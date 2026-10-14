const DAY_MS = 24 * 60 * 60 * 1000;

type DueDateLabelTranslator = (key: string, defaultMessage: string, values?: Record<string, string | number>) => string;

type FormatDueDateLabelOptions = {
  locale?: string;
  t?: DueDateLabelTranslator;
};

const resolveLocale = (locale: string) => {
  try {
    const canonical = Intl.getCanonicalLocales(locale)[0];
    return canonical && Intl.DateTimeFormat.supportedLocalesOf(canonical).length ? canonical : "en-US";
  } catch {
    return "en-US";
  }
};

const formatDate = (value: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(value);

const formatTime = (value: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const calendarDayDiff = (from: Date, to: Date) => {
  const fromDay = startOfDay(from).getTime();
  const toDay = startOfDay(to).getTime();
  return Math.round((toDay - fromDay) / DAY_MS);
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const interpolate = (message: string, values?: Record<string, string | number>) => {
  if (!values) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
};

export const formatDueDateLabelTestUtils = {
  interpolate,
};

export const formatDueDateLabel = (
  dueAtInput: unknown,
  nowInput: unknown = new Date(),
  options: FormatDueDateLabelOptions = {},
) => {
  const locale = resolveLocale(options.locale ?? "en-US");
  const t = (key: string, defaultMessage: string, values?: Record<string, string | number>) =>
    options.t ? options.t(key, defaultMessage, values) : interpolate(defaultMessage, values);

  const dueAt = toDate(dueAtInput);
  const now = toDate(nowInput) ?? new Date();

  if (!dueAt) {
    return t("due.unavailable", "Due date unavailable");
  }

  const diffMs = dueAt.getTime() - now.getTime();

  if (diffMs <= 0) {
    return t("due.absoluteWithTime", "Due {date} at {time}", {
      date: formatDate(dueAt, locale),
      time: formatTime(dueAt, locale),
    });
  }

  const diffMinutes = Math.ceil(diffMs / (60 * 1000));
  const diffHours = Math.ceil(diffMs / (60 * 60 * 1000));
  const diffDays = Math.ceil(diffMs / DAY_MS);
  const dayDiff = calendarDayDiff(now, dueAt);

  if (dayDiff === 0) {
    if (diffMinutes < 60) {
      if (diffMinutes === 1) {
        return t("due.todayInMinute", "Due today in 1 minute");
      }

      return t("due.todayInMinutes", "Due today in {count} minutes", { count: diffMinutes });
    }

    if (diffHours === 1) {
      return t("due.todayInHour", "Due today in 1 hour");
    }

    return t("due.todayInHours", "Due today in {count} hours", { count: diffHours });
  }

  if (dayDiff === 1) {
    return t("due.tomorrowAtTime", "Due tomorrow at {time}", { time: formatTime(dueAt, locale) });
  }

  if (diffMs < 2 * DAY_MS) {
    return t("due.absoluteWithTime", "Due {date} at {time}", {
      date: formatDate(dueAt, locale),
      time: formatTime(dueAt, locale),
    });
  }

  if (diffDays > 21) {
    const diffWeeks = Math.ceil(diffDays / 7);
    return t("due.absoluteInWeeks", "Due {date} ({count} weeks)", {
      date: formatDate(dueAt, locale),
      count: diffWeeks,
    });
  }

  return t("due.absoluteInDays", "Due {date} ({count} days)", {
    date: formatDate(dueAt, locale),
    count: diffDays,
  });
};
