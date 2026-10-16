"""Bounded replay of wave-02-13 inline local-path parser; no command/type suites."""
import pathlib, json, re, hashlib, urllib.parse, datetime, subprocess
root = pathlib.Path.cwd()
out = root/'docs/developer/final-acceptance/fix-12'
wave_path = root/'docs/developer/final-acceptance/wave-02-13/evidence.json'
wave = json.loads(wave_path.read_text())
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def audit():
    links=[]; inputs=[]
    for name in wave['markdown_scan']['paths']:
        p=root/name
        inputs.append({'path':name,'sha256':sha(p)})
        fence=False
        for n,line in enumerate(p.read_text().splitlines(),1):
            if line.lstrip().startswith(('```','~~~')):
                fence=not fence
                continue
            if fence: continue
            for m in re.finditer(r'\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',line):
                target=m.group(1).strip('<>'); parsed=urllib.parse.urlsplit(target)
                if parsed.scheme or target.startswith(('#','//')): continue
                path=urllib.parse.unquote(parsed.path)
                if not path: continue
                resolved=(p.parent/path).resolve()
                links.append({'source':name,'line':n,'target':target,'resolved':str(resolved),'exists':resolved.exists()})
    return {'documents':len(inputs),'local_inline_links':len(links),'inputs':inputs,'missing':[x for x in links if not x['exists']]}
before=audit()
(out/'before.json').write_text(json.dumps(before,indent=2)+'\n')
p=root/'docs/github-setup.md'; old='../release.config.mjs'; new='../packages/ui/release.config.mjs'
text=p.read_text(); needle=f'[release.config.mjs]({old})'
assert text.count(needle)==1
assert not (p.parent/old).exists()
assert (p.parent/new).is_file()
old_hash=sha(p); target_hash=sha(p.parent/new)
p.write_text(text.replace(needle,f'[release.config.mjs]({new})'))
after=audit()
(out/'after.json').write_text(json.dumps(after,indent=2)+'\n')
remaining=[]
for finding in after['missing']:
    name=finding['source']
    if '/parallel-' in name:
        reason='Excluded parallel report; retain historical receipt link. Coordinator provenance disposition required.'
    elif name.endswith('react-aria-progress.md'):
        reason='Excluded central progress file; historical retired story receipt. Coordinator provenance disposition required.'
    elif name.endswith(('react-aria-inventory-contract-reconciliation.md','react-aria-migration-inventory-acceptance.md','react-aria-release-gate-audit.md')):
        reason='Dated acceptance snapshot with exact baseline; preserve historical source/story/config link. Coordinator provenance disposition required.'
    else:
        reason='Unclassified; no edit authorized without provenance review.'
    remaining.append({**finding,'disposition':reason})
assert all(x['disposition']!='Unclassified; no edit authorized without provenance review.' for x in remaining)
original=wave['markdown_scan']['missing']
key=lambda x:(x['source'],x['line'],x['target'])
comparison={'wave_missing':len(original),'before_missing':len(before['missing']),'wave_findings_still_missing_before':len(set(map(key,original)) & set(map(key,before['missing']))),'added_missing_before':[x for x in before['missing'] if key(x) not in set(map(key,original))]}
data={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'wave_evidence':{'path':str(wave_path.relative_to(root)),'sha256':sha(wave_path)},'comparison':comparison,'mapping':[{'source':str(p.relative_to(root)),'line_before':next(n for n,l in enumerate(text.splitlines(),1) if needle in l),'old_target':old,'new_target':new,'old_resolved':str((p.parent/old).resolve()),'old_exists':False,'new_resolved':str((p.parent/new).resolve()),'new_exists':True,'target_sha256':target_hash,'source_before_sha256':old_hash,'source_after_sha256':sha(p)}],'before_counts':{k:before[k] for k in ('documents','local_inline_links')},'after_counts':{k:after[k] for k in ('documents','local_inline_links')},'remaining_missing':remaining,'limits':'Same wave corpus and inline parser, filesystem path existence only. No anchors/reference-style/HTML links, inline code paths, public example types, commands, remote URLs, CI, manual/device/AT/legal or release execution certified.'}
(out/'link-mapping.json').write_text(json.dumps(data,indent=2)+'\n')
print(json.dumps({'before':len(before['missing']),'after':len(after['missing']),'comparison':comparison,'mapping':data['mapping']},indent=2))
