import json, hashlib, pathlib, datetime, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[4]
OUT=pathlib.Path(__file__).resolve().parent
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
load=lambda p: json.loads((ROOT/p).read_text())
coord=load('docs/developer/final-acceptance/coordinator-integration/evidence.json')
comparisons={}
for group in ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes']:
 rows=[]
 for p,h in coord[group].items():
  f=ROOT/p; actual=sha(f) if f.is_file() else None
  rows.append({'path':p,'expected':h,'actual':actual,'equal':actual==h})
 comparisons[group]={'counts':{'equal':sum(x['equal'] for x in rows),'changed':sum(x['actual'] is not None and not x['equal'] for x in rows),'missing':sum(x['actual'] is None for x in rows)},'files':rows}
assignment=load('docs/developer/final-acceptance/wave-03-29/assignment.json')
prior={}
for v in assignment['priorEvidence'].values():
 for k in ['report','results']:
  p=v[k]; prior[p]={'expected':v[k+'Sha256'],'actual':sha(ROOT/p),'equal':sha(ROOT/p)==v[k+'Sha256']}
old=load('docs/developer/final-acceptance/wave-02-01/evidence.json')
missing={p:{'exists':(ROOT/p).exists(),'pngCount':len(list((ROOT/p).rglob('*.png')))} for p in old['artifactAvailability']}
# Inventory available artifacts without inventing associations from filenames.
artifacts=[]
for p in sorted((ROOT/'packages/ui/artifacts').rglob('*.png')):
 artifacts.append({'path':str(p.relative_to(ROOT)),'sha256':sha(p),'bytes':p.stat().st_size,'review':'pending','familyAttribution':'unverified; calendar artifact root is not B07 family coverage'})
registry=load('apps/docs/native-fixtures/registry.json')['entries']
manual=load('docs/developer/final-acceptance/wave-02-10/manual-review-matrix.json')
for row in manual['categories']:
 entry=registry[row['candidateFixtureId']]; path='apps/docs/native-fixtures/'+entry['module'][2:]
 row['registryPresent']=True;row['fixtureSource']=path;row['currentSourceSha256']=sha(ROOT/path);row['matchesPriorSource']=row['currentSourceSha256']==row['fixtureSourceSha256'];row['urlPath']='/fixtures/?id='+row['candidateFixtureId']+'&embed=true';row['status']='unrun'
evidence={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'runtime':subprocess.check_output(['node','--version'],text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True,cwd=ROOT).strip(),'priorReports':prior,'coordinatorComparisons':comparisons,'historicalArtifactAvailability':missing,'availablePngs':artifacts,'manualCategories':manual['categories'],'limits':['Sequential read of dirty shared checkout, not an atomic source snapshot.','No browser, speech, image review or physical touch execution.','Only port3000 user host observed; no isolated validation host admitted.']}
evidence['coordinatorManifestSha256']=sha(ROOT/'docs/developer/final-acceptance/coordinator-integration/evidence.json')
evidence['coordinatorReceiptComparisons']={}
for name,expected in coord['receiptHashes'].items():
 f=ROOT/'docs/developer/final-acceptance/coordinator-integration'/name
 actual=sha(f) if f.is_file() else None
 evidence['coordinatorReceiptComparisons'][name]={'expected':expected,'actual':actual,'equal':actual==expected}
(OUT/'input-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
print(json.dumps({'runtime':evidence['runtime'],'coordinatorComparisons':{k:v['counts'] for k,v in comparisons.items()},'priorReportsAllMatch':all(v['equal'] for v in prior.values()),'historicalRootsPresent':sum(x['exists'] for x in missing.values()),'historicalRootsChecked':len(missing),'availablePngs':len(artifacts),'manualFixturePriorMatches':{r['category']:r['matchesPriorSource'] for r in manual['categories']}},indent=2))
