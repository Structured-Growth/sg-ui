/** Shared dialog, saved-document, pasted-link and activation URL policy. */
export const DEFAULT_LINK_PROTOCOLS = ["http", "https", "mailto", "tel"] as const;
export type LinkProtocol = typeof DEFAULT_LINK_PROTOCOLS[number];

export function normalizeLinkUrl(value: string, protocols: readonly LinkProtocol[] = DEFAULT_LINK_PROTOCOLS,
  allowRelative = true): string | null {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value) || value.startsWith("//")) return null;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(value)?.[1]?.toLowerCase();
  if (scheme && (!DEFAULT_LINK_PROTOCOLS.some(protocol => protocol === scheme) || !protocols.some(protocol => protocol === scheme))) return null;
  const www = value.startsWith("www.");
  if ((!scheme && !www && !allowRelative) || (www && !protocols.includes("https"))) return null;
  const normalized = www ? `https://${value}` : value;
  try {
    const parsed = new URL(normalized, "https://sgui.invalid/");
    if (scheme === "http" || scheme === "https") {
      if (!/^https?:\/\//i.test(value) || !parsed.hostname) return null;
    } else if (scheme === "mailto" || scheme === "tel") {
      if (!parsed.pathname) return null;
    }
    return normalized;
  } catch {
    return null;
  }
}
