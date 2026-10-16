from pathlib import Path
import difflib
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-26'; mirrors=own/'proposed-files'
changes={}
def change(path,old,new):
 s=changes.get(path,(root/path).read_text()); assert old in s,path; changes[path]=s.replace(old,new,1)
base='packages/ui/src/components/PageRichTextEditorSection/'
changes[base+'lexical/imagePayloadPolicy.ts']='''/** Runtime shape guard, independent of source authorization and image-byte validation. */
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
'''
change(base+'lexical/ImageNode.tsx','import { isAllowedImageSource } from "./imageSourcePolicy";','import { isAllowedImageSource } from "./imageSourcePolicy";\nimport { isImagePayload } from "./imagePayloadPolicy";')
change(base+'lexical/ImageNode.tsx','export function $createImageNode(payload: ImagePayload) {','export function $createImageNode(payload: ImagePayload) {\n  // Serialized JSON and host callbacks cross runtime boundaries despite TS declarations.\n  if (!isImagePayload(payload)) throw new TypeError("Invalid editor image payload");')
change(base+'PageRichTextEditorSection.impl.tsx','import { isAllowedImageSource } from "./lexical/imageSourcePolicy";','import { isAllowedImageSource } from "./lexical/imageSourcePolicy";\nimport { isImagePayload } from "./lexical/imagePayloadPolicy";')
change(base+'PageRichTextEditorSection.impl.tsx','            if (!isAllowedImageSource(uploaded.src)) {','            if (!isImagePayload(uploaded)) {\n              throw new Error(t("editor.imageMetadataRejected", { defaultMessage: "The uploaded image metadata is not supported. Try again." }));\n            }\n            if (!isAllowedImageSource(uploaded.src)) {')
change(base+'lexical/ImageNode.test.tsx','describe("ImageNode in a real Lexical editor", () => {','''describe("ImageNode in a real Lexical editor", () => {
  it("rejects malformed saved image metadata before node creation", () => {
    const editor = makeEditor();
    editor.update(() => {
      for (const invalid of [{ src: {} }, { src: "/cover.png", altText: {} },
        { src: "/cover.png", assetId: [] }, { src: "/cover.png", width: Infinity },
        { src: "/cover.png", height: "600" }]) {
        expect(() => ImageNode.importJSON({ type: "image", version: 1, ...invalid } as unknown as SerializedImageNode))
          .toThrow("Invalid editor image payload");
      }
      expect($getRoot().getChildrenSize()).toBe(0);
      const valid = { type: "image", version: 1, src: "/cover.png", altText: '<script>alert("x")</script>',
        assetId: 'asset<>&"', assetVersionId: "v1", width: 800, height: 600 } as const;
      const image = ImageNode.importJSON(valid);
      expect(image.exportJSON()).toEqual(valid);
      const markup = renderToStaticMarkup(image.decorate(editor));
      expect(markup).not.toContain("<script>");
      expect(markup).toContain("&lt;script&gt;");
    }, { discrete: true });
  });
''')
# Extend existing rejected-address/retry assertion rather than duplicate its whole workflow.
change(base+'PageRichTextEditorSection.dialogs.test.tsx','  it("rejects an unsupported host image address without insertion and retains the file and description for retry", async () => {','''  it.each([
    { result: { assetId: "bad", assetVersionId: "v1", src: "javascript:alert(1)" },
      error: "The uploaded image address is not supported. Try again." },
    { result: { assetId: { unexpected: true }, assetVersionId: "v1", src: "/cover.png" },
      error: "The uploaded image metadata is not supported. Try again." },
  ])("rejects an unsupported host image result and retains the file and description for retry: $error", async ({ result, error }) => {''')
change(base+'PageRichTextEditorSection.dialogs.test.tsx','vi.fn().mockResolvedValueOnce({ assetId: "bad", assetVersionId: "v1", src: "javascript:alert(1)" })','vi.fn().mockResolvedValueOnce(result)')
change(base+'PageRichTextEditorSection.dialogs.test.tsx','expect(screen.getByRole("alert").textContent).toBe("The uploaded image address is not supported. Try again.")','expect(screen.getByRole("alert").textContent).toBe(error)')
path='docs/developer/react-aria-editor-section.md'
change(path,'## Host upload lifetime (E-06 partial)','''## Runtime image metadata (E-06/E-07 partial)

The image factory checks runtime field shapes for saved imports and insertion commands.
`src` must be a string; optional description and asset IDs must be strings or null;
optional dimensions must be finite numbers or null. Missing/null optional values keep
the existing empty-description/null-metadata defaults. Valid values are preserved,
including decorative empty alt text. This check does not authorize assets, validate
image bytes, impose dimension/size bounds or migrate unsupported document versions.
Malformed saved image fields throw an internal TypeError before node creation; this
is not atomic document validation or a user-facing recovery API. Hosts must validate
untrusted whole documents before passing them to the editor and retain the original
when parsing fails. The section currently supplies a silent Lexical error handler;
this patch does not certify whole-document failure/recovery behavior.

Malformed current upload metadata leaves the file/description available for retry
and reports a translated error before insertion. Stale results are ignored before
metadata validation. No host-created URL or asset is released by this check.

React escapes image attributes; serialized JSON remains data, not sanitized HTML.
Downstream renderers must independently enforce context-specific URL/style policy.
Author CSS, node/version policy, byte/dimension restrictions, host CSP, remote image
redirects, transport abort and stale-asset deletion remain explicit host decisions.

## Host upload lifetime (E-06 partial)''')
patch=[]
for path,s in changes.items():
 p=mirrors/path; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(s)
 old=(root/path).read_text() if (root/path).exists() else ''
 patch.extend(difflib.unified_diff(old.splitlines(True),s.splitlines(True),fromfile='a/'+path if old else '/dev/null',tofile='b/'+path))
(own/'image-runtime-shapes.patch').write_text(''.join(patch))
print('Prepared',len(changes),'files; no production files changed')
