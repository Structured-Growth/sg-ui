from pathlib import Path
import json,hashlib,re,subprocess,sys
O=Path(__file__).resolve().parent;R=O.parents[4]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def require(condition,message):
 if not condition:raise AssertionError(message)
e=json.loads((O/'evidence.json').read_text());result=json.loads((O/'results.json').read_text());assignment=json.loads((O/'assignment.json').read_text())
require([x['id'] for x in result['entries']]==assignment['ids'],'exact assignment ownership')
require([x['originalObligation'] for x in result['entries']]==assignment['obligations'],'original obligations preserved')
require(all(x['recommendation']=='complete' and not x['remainingConcreteSuccessors'] for x in result['entries']),'closure recommendations')
for receipt in e['receiptComparisons']:
 require(sha(R/receipt['receipt'])==receipt['sha256'],'accepted receipt changed: '+receipt['receipt'])
 for row in receipt['sourceComparisons']:
  if row['path'] in [e['concurrentFixtureChange']['path'],'apps/docs/native-fixtures/registry.json']:continue
  require(sha(R/row['path'])==row['expected'],'accepted input changed: '+row['path'])
for path in e['sourceClosurePaths']:
 require(sha(R/path)==e['inputSha256'][path],'traversed source changed: '+path)
f=e['concurrentFixtureChange'];marker='// HB-20: real Lexical composition, with host-owned long content and translations.'
current=(R/f['path']).read_text();region=current[current.index(marker):]
require(hashlib.sha256(region.encode()).hexdigest()==f['acceptedLocalizedPresentationRegionSha256'],'accepted localized presentation changed')
# Both full fixture imports and accepted localized scenario are unchanged by the scoped delta.
committed=subprocess.check_output(['git','show',e['baseline']+':'+f['path']],cwd=R,text=True)
require(re.findall(r'^import .*$',current,re.M)==re.findall(r'^import .*$',committed,re.M),'fixture imports changed')
registry='apps/docs/native-fixtures/registry.json'
oldRegistry=json.loads(subprocess.check_output(['git','show',e['baseline']+':'+registry],cwd=R,text=True))['entries']
newRegistry=json.loads((R/registry).read_text())['entries']
require(all(newRegistry.get(k)==v for k,v in oldRegistry.items()),'existing fixture registry entry changed')
for target in json.loads((O/'proposal-targets.json').read_text()):
 base=R/target['path'];proposed=O/'proposed-files'/target['path']
 require(sha(proposed)==target['proposedSha256'],'proposal changed: '+target['path'])
 require((sha(base) if base.exists() else None) in [target['baseSha256'],target['proposedSha256']],'proposal target base changed: '+target['path'])
 # Resolve documentation links at their final repository destination, honoring proposal overlays.
 for ref in re.findall(r'\]\(([^)]+)\)',proposed.read_text()):
  path=ref.split('#',1)[0]
  if not path or re.match(r'\w+://',path):continue
  resolved=(base.parent/path).resolve()
  overlay=O/'proposed-files'/resolved.relative_to(R)
  require(resolved.exists() or overlay.exists(),'missing documentation link '+ref)
checks=[('editor-chrome-presentation/browser.log','9 passed'),('rich-editor-presentation/selection-regressions.log','18 passed'),('rich-editor-presentation/units.log','239 passed'),('rich-editor-presentation/tabs-regressions.log','33 passed')]
for path,text in checks:
 require(text in (R/'docs/developer/final-acceptance'/path).read_text(),'missing retained outcome: '+path)
followup=(R/'docs/developer/final-acceptance/wave-03-followup/native-final.log').read_text()
for engine in ['chromium','firefox','webkit']:
 for case in ['Escape from floating formatting returns to ordinary editing without a sticky selection','read-only invalidation removes floating actions and re-enabling preserves plain typing']:
  require(any('✓' in line and '['+engine+']' in line and case in line for line in followup.splitlines()),'missing named accepted case '+engine+' '+case)
patch=subprocess.run(['git','apply','--check',str(O/'documentation.patch')],cwd=R,text=True,capture_output=True)
if patch.returncode:
 reverse=subprocess.run(['git','apply','--reverse','--check',str(O/'documentation.patch')],cwd=R,text=True,capture_output=True)
 require(reverse.returncode==0,'patch neither applicable nor already integrated: '+patch.stderr)
patchState='applicable; not applied by this verifier' if patch.returncode==0 else 'already integrated by another writer; reverse check passes'
print(json.dumps({'status':'pass','assignmentEntries':4,'sourceClosureHashesChecked':len(e['sourceClosurePaths']),'acceptedReceiptInputRows':sum(len(x['sourceComparisons']) for x in e['receiptComparisons']),'concurrentFixture':'full-file drift retained; accepted localized region/imports unchanged','documentationTargets':2,'patchApplicability':patchState,'registryDrift':'only additive entries; accepted entries preserved','retainedRuntimeLogs':'expected bounded outcomes and six named ordinary-editing engine passes found','newBehaviorEvidence':False},indent=2))
