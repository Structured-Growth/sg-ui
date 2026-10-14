export const toLabelKey = (prefix: string, label: string): string => {
  const normalized = label
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  return `${prefix}.${normalized || "empty"}`;
};
