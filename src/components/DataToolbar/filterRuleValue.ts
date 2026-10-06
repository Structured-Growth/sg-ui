export const FILTER_RULE_MULTI_VALUE_DELIMITER = "|||";

export const serializeFilterRuleValues = (values: string[]) => values.join(FILTER_RULE_MULTI_VALUE_DELIMITER);

export const parseFilterRuleValues = (rawValue: string): string[] => {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.includes(FILTER_RULE_MULTI_VALUE_DELIMITER)) {
    return trimmed
      .split(FILTER_RULE_MULTI_VALUE_DELIMITER)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [trimmed];
};
