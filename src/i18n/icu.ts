export type MessageValues = Record<string, string | number | boolean | Date | null | undefined>;

const ICU_TOKEN_REGEX = /\{\s*([\w.]+)\s*(?:,\s*(number|date|time))?\s*\}/g;

export const formatIcuMessage = (
  message: string,
  locale: string,
  values?: MessageValues,
): string => {
  if (!values) {
    return message;
  }

  return message.replace(ICU_TOKEN_REGEX, (_match, variableName: string, formatType?: string) => {
    const value = values[variableName];
    if (value === null || value === undefined) {
      return "";
    }

    if (formatType === "number" && typeof value === "number") {
      return new Intl.NumberFormat(locale).format(value);
    }

    if ((formatType === "date" || formatType === "time") && (value instanceof Date || typeof value === "string")) {
      const parsed = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return String(value);
      }
      return formatType === "date"
        ? new Intl.DateTimeFormat(locale).format(parsed)
        : new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(parsed);
    }

    return String(value);
  });
};

export const extractIcuVariables = (message: string): string[] => {
  const variables = new Set<string>();
  for (const match of message.matchAll(ICU_TOKEN_REGEX)) {
    const variableName = match[1]!.trim();
    variables.add(variableName);
  }
  return [...variables].sort((a, b) => a.localeCompare(b));
};
