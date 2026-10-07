/** Presentation policy only; hosts still own asset authorization and content validation. */
export function isAllowedImageSource(value: unknown): value is string {
  if (typeof value !== "string" || !value || /[\u0000-\u0020\u007f\\]/.test(value) || value.startsWith("//")) return false;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(value)?.[1]?.toLowerCase();
  if (scheme === "data") {
    // Encoded image data stays in an img context; HTML and other data types are rejected.
    return /^data:image\/[a-z\d.+-]+(?:;[a-z\d!#$&^_.+-]+=[a-z\d!#$&^_.+%-]+)*(?:;base64)?,.+$/i.test(value);
  }
  if (scheme && !["http", "https", "blob"].includes(scheme)) return false;
  try {
    const parsed = new URL(value, "https://sgui.invalid/");
    if (scheme === "http" || scheme === "https") return /^https?:\/\//i.test(value) && Boolean(parsed.hostname);
    if (scheme === "blob") return Boolean(parsed.pathname);
    return true;
  } catch {
    return false;
  }
}
