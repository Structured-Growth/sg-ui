/** Runtime shape guard, independent of source authorization and image-byte validation. */
export function isImagePayload(value: unknown): value is {
  src: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  assetId?: string | null;
  assetVersionId?: string | null;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  if (typeof payload.src !== "string") return false;
  for (const key of ["altText", "assetId", "assetVersionId"]) {
    if (payload[key] != null && typeof payload[key] !== "string") return false;
  }
  for (const key of ["width", "height"]) {
    if (payload[key] != null && (typeof payload[key] !== "number" || !Number.isFinite(payload[key]))) return false;
  }
  return true;
}
