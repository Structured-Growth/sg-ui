/** Keep the public saved-document schema independent of internal node replacement types. */
export function serializeEditorDocument<T>(value: T): T {
  if (Array.isArray(value)) return value.map(serializeEditorDocument) as T;
  if (!value || typeof value !== "object") return value;
  const result = { ...value } as Record<string, unknown>;
  if (result.type === "sgui-link") result.type = "link";
  // Only traverse Lexical's document structure, never arbitrary host asset metadata.
  if (result.root) result.root = serializeEditorDocument(result.root);
  if (Array.isArray(result.children)) result.children = result.children.map(serializeEditorDocument);
  return result as T;
}
