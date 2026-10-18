from pathlib import Path
import difflib,json,hashlib,subprocess
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/02'
fixture='apps/docs/native-fixtures/scenarios/components/PageRichTextEditorSection/PageRichTextEditorSection.fixture.tsx'
spec='packages/ui/tests/browser/editor-image-sources.spec.ts'
changes={}
s=(root/fixture).read_text()
s=s.replace('The first host upload returns an unsupported address. Retry with the same file and description.','The first upload returns an unsupported address, the second malformed metadata, and the third a valid image. Retry with the same file and description.')
old='return { assetId: "uploaded-image", assetVersionId: "upload-v1", src: attempt === 0 ? "javascript:alert(\'unsafe-upload\')" : IMAGE_POLICY_PIXEL };'
new='''// Deliberately model an untyped service response at the public boundary.
          // The first two results must remain retryable without inserting a node.
          if (attempt === 1) return { assetId: { unexpected: true }, assetVersionId: "upload-v1", src: IMAGE_POLICY_PIXEL } as unknown as { assetId: string; assetVersionId: string; src: string };
          return { assetId: "uploaded-image", assetVersionId: "upload-v1", src: attempt === 0 ? "javascript:alert('unsafe-upload')" : IMAGE_POLICY_PIXEL };'''
assert s.count(old)==1;s=s.replace(old,new);changes[fixture]=s
s=(root/spec).read_text();s=s.replace('unsupported host upload remains retryable with the same description:', 'unsupported address and malformed metadata remain retryable with the same description:')
old="""    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog).toHaveCount(0);"""
new="""    const existingImages = await editor.locator('[data-sgui-part="editor-image"] > img').count();
    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog.getByRole('alert')).toHaveText('The uploaded image metadata is not supported. Try again.');
    await expect(dialog.getByText('cover.png', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: 'Image description' })).toHaveValue('Uploaded course cover');
    await expect(editor.locator('[data-sgui-part="editor-image"] > img')).toHaveCount(existingImages);
    expect(await saved(page)).toEqual(before);
    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog).toHaveCount(0);"""
assert s.count(old)==1;s=s.replace(old,new)
s=s.replace("expect(output).not.toContain('unsafe-upload');", "expect(output).not.toContain('unsafe-upload');\n    expect(output).not.toContain('unexpected');\n    expect(output).toContain('\"assetVersionId\":\"upload-v1\"');")
changes[spec]=s
patch='';targets=[]
sha=lambda b:hashlib.sha256(b).hexdigest()
for path,text in changes.items():
 base=(root/path).read_text(); dest=out/'proposed-files'/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text)
 patch+=''.join(difflib.unified_diff(base.splitlines(True),text.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
 targets.append({'path':path,'baseSha256':sha(base.encode()),'proposedSha256':sha(text.encode())})
(out/'metadata-retry.patch').write_text(patch)
(out/'proposal-targets.json').write_text(json.dumps(targets,indent=2)+'\n')
