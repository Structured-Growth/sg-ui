from pathlib import Path
import difflib,json,hashlib,shutil
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-04/04/frozen-preview-successor';prop=out/'proposed-files';guard=prop/'packages/ui/tests/performance/frozen-preview.mjs';s=guard.read_text()
if 'export async function finishReceipt' not in s:s+='''\n// A closed browser is part of a successful run, not an error after a saved pass.\nexport async function finishReceipt(receipt,close) {\n  try {await close();return receipt;}\n  catch(error) {return {...receipt,status:'fail',browserCloseFailure:String(error.stack??error)};}\n}\n'''
guard.write_text(s)
test=prop/'packages/ui/tests/performance/frozen-preview.test.mjs';s=test.read_text().replace('assertUnchanged,verifyPreview}', 'assertUnchanged,verifyPreview,finishReceipt}')
if "test('browser close failure" not in s:s+='''\ntest('browser close failure cannot leave a passing receipt or erase an earlier failure',async()=>{\n  const successful={status:'pass',results:[1]};\n  assert.equal(await finishReceipt(successful,async()=>{}),successful);\n  const close=async()=>{throw new Error('browser process did not settle');};\n  const failed=await finishReceipt(successful,close);assert.equal(failed.status,'fail');assert.match(failed.browserCloseFailure,/did not settle/);assert.deepEqual(failed.results,[1]);\n  const earlier={status:'fail',failure:'native interaction failed',results:[2]};\n  const combined=await finishReceipt(earlier,close);assert.equal(combined.failure,earlier.failure);assert.match(combined.browserCloseFailure,/did not settle/);\n});\n'''
test.write_text(s)
p=prop/'packages/ui/tests/performance/measure-browser.mjs';s=p.read_text().replace('assertUnchanged,verifyPreview}', 'assertUnchanged,verifyPreview,finishReceipt}')
s=s.replace('const browser=await chromium.launch();const results=[],cleanupProbes=[];', 'let browser,receipt,runFailure;const results=[],cleanupProbes=[];')
s=s.replace('try {\n  const context=', 'try {\n  browser=await chromium.launch();\n  const context=')
lines=s.splitlines(True)
for i,line in enumerate(lines):
 if line.startswith('  await writeFile(destination,JSON.stringify({schemaVersion:2,status:'):
  start=line.index('JSON.stringify(')+len('JSON.stringify(');end=line.rindex(',null,2)');lines[i]='  receipt='+line[start:end]+';\n'
s=''.join(lines)
a=s.index('} catch(failure) {');s=s[:a]+'''\n} catch(failure) {\n  runFailure=failure;\n  receipt={schemaVersion:2,status:'fail',renderer,sourceHead,fixtureHashes,frozenOutput,results,cleanupProbes,failure:String(failure.stack??failure),recordedAt:new Date().toISOString(),limits:['Partial run: not a valid latency comparison or acceptance receipt. Preserve exact failing evidence.']};\n}\nreceipt=await finishReceipt(receipt,async()=>{await browser?.close();});\nawait writeFile(destination,JSON.stringify(receipt,null,2)+'\\n',{flag:'wx'});\nif(runFailure)throw runFailure;\nif(receipt.status!=='pass')throw new Error(receipt.browserCloseFailure??'Profiling failed');\n'''
p.write_text(s)
patch=[];base={}
for p in sorted(prop.rglob('*')):
 if p.is_file():
  rel=p.relative_to(prop);before=(root/rel).read_text() if (root/rel).exists() else '';base[str(rel)]=hashlib.sha256(before.encode()).hexdigest() if before else None
  patch.extend(difflib.unified_diff(before.splitlines(True),p.read_text().splitlines(True),fromfile='a/'+str(rel) if before else '/dev/null',tofile='b/'+str(rel)))
if not (out/'frozen-preview-v1.patch').exists():shutil.copyfile(out/'frozen-preview.patch',out/'frozen-preview-v1.patch')
(out/'frozen-preview.patch').write_text(''.join(patch));(out/'peer-review-inputs.json').write_text(json.dumps(base,indent=2)+'\n')
