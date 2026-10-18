"""Structural completeness only. Never certifies observations or manufactures acceptance."""
import json,sys
from pathlib import Path
p=Path(sys.argv[1]);d=json.loads(p.read_text());errors=[]
for key in ['operator','observedAt','browserVersion','osVersion','candidateCommit','sourceManifestSha256','fixtureOutputSha256','hostOrigin']:
 if not d.get(key):errors.append('Missing '+key)
if d.get('entryMethod')!='browser-profile-ui':errors.append('Must record actual browser-profile-ui selection; scripted fill is not autofill')
if d.get('syntheticProfile') is not True:errors.append('Receipt must use synthetic profile data')
if {c.get('policy') for c in d.get('cases',[])}!={'uncontrolled','accepting','rejecting'} or len(d.get('cases',[]))!=3:errors.append('Exactly three host policies required')
required=['offeredSelection','displayAndCallbacks','submitButtonFormData','enterSubmission','acceptedReset','canceledReset','reassociatedFormA','reassociatedFormB','disabledOmitted','readOnlyRetained']
for case in d.get('cases',[]):
 if case.get('status') not in ['observed-pass','observed-fail','unsupported']:errors.append(str(case.get('policy'))+': pending observation')
 for key in required:
  if not case.get('observations',{}).get(key):errors.append(str(case.get('policy'))+': missing '+key)
if d.get('status')!='observed':errors.append('Top-level status must be observed')
print(json.dumps({'structurallyComplete':not errors,'errors':errors,'acceptance':'Human review of actual observations still required; failures and unsupported paths remain open.'},indent=2))
sys.exit(1 if errors else 0)
