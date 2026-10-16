import pathlib,json,re,hashlib,urllib.parse,datetime,subprocess,collections
root=pathlib.Path.cwd();out=root/'docs/developer/final-acceptance/wave-03-34'
patch=json.loads((out/'patch-inputs.json').read_text());proposed={r['path']:(out/'proposed-files'/r['path']).read_text() for r in patch['files']}
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-13/evidence.json').read_text())
def read(p): return proposed.get(str(p.relative_to(root)),p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def unfence(s):return re.sub(r'(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[^\n]*(?=\n|$)',lambda m:'\n'*m[0].count('\n'),s)
def slug(s):
 s=re.sub(r'<[^>]*>','',s);s=re.sub(r'[`*_~]','',s);s=re.sub(r'[^\w\- ]','',s.lower());return s.replace(' ','-')
def anchors(s):
 counts=collections.Counter(); result=set()
 for h in re.findall(r'^#{1,6}\s+(.+?)\s*#*$',unfence(s),re.M):
  key=slug(h);n=counts[key];counts[key]+=1;result.add(key+(f'-{n}' if n else ''))
 result.update(re.findall(r'\b(?:id|name)=[\"\x27]([^\"\x27]+)',s));return result
records=[];commands=[];paths=[];issues=[]
active=list(proposed)+['README.md','docs/developer/react-aria-adoption-checklist.md','docs/developer/react-aria-dependency-upgrades.md']
for name in dict.fromkeys(active):
 p=root/name;s=read(p);clean=unfence(s)
 refs={m[1].lower():m[2].strip('<>') for m in re.finditer(r'^\s*\[([^\]]+)\]:\s*(<[^>]+>|\S+)',clean,re.M)}
 targets=[('inline',m[1].strip('<>')) for m in re.finditer(r'\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',clean)]
 targets += [('html',m[1]) for m in re.finditer(r'\b(?:href|src)=[\"\x27]([^\"\x27]+)',clean)]
 for m in re.finditer(r'\[([^\]]+)\]\[([^\]]*)\]',clean):
  ref=(m[2] or m[1]).lower()
  if ref not in refs:issues.append({'source':name,'undefinedReference':ref})
  else:targets.append(('reference',refs[ref]))
 for kind,target in targets:
  u=urllib.parse.urlsplit(target)
  if u.scheme or target.startswith('//'):continue
  targetpath=(p.parent/urllib.parse.unquote(u.path)).resolve() if u.path else p
  # GitHub issue form URLs are external; absolute website routes need route checks, not FS joins.
  if target.startswith('/'):
   records.append({'source':name,'kind':kind,'target':target,'status':'website-route-unchecked'});continue
  exists=targetpath.exists();anchor=None
  if exists and u.fragment and targetpath.suffix=='.md':anchor=urllib.parse.unquote(u.fragment) in anchors(read(targetpath))
  rec={'source':name,'kind':kind,'target':target,'exists':exists,'anchorExists':anchor};records.append(rec)
  if not exists or anchor is False:issues.append(rec)
 # Source-backed script-name checks, not command execution. Manifest cwd explicit for direct scripts.
 for m in re.finditer(r'`(pnpm (?:--filter [\w@/.-]+ )?[\w:.-]+(?: [^`\n]*)?)`',s):
  cmd=m[1];parts=cmd.split();filtername=parts[2] if len(parts)>2 and parts[1]=='--filter' else None;task=parts[3] if filtername else parts[1]
  if task == 'run':task=parts[2]
  if task in ['install','exec','pack','dlx','-r','why']:continue
  package={'@structured-growth/sg-ui':'packages/ui/package.json','@structured-growth/docs':'apps/docs/package.json'}.get(filtername,'package.json')
  ok=task in json.loads((root/package).read_text())['scripts'];commands.append({'source':name,'command':cmd,'manifest':package,'script':task,'exists':ok})
  # Historical receipts in runtime guide are explicitly retained, not current runner instructions.
  if not ok and name!='docs/developer/react-aria-runtime-ci.md':issues.append(commands[-1])
 for m in re.finditer(r'node (scripts/[\w./-]+\.mjs)',s):
  candidate=root/'packages/ui'/m[1];paths.append({'source':name,'path':'packages/ui/'+m[1],'exists':candidate.exists(),'scope':'direct library commands interpreted from packages/ui'})
  if not candidate.exists():issues.append(paths[-1])
# Reconcile the original link audit without rewriting any evidence records.
oldmissing=[]
for old in prior['markdown_scan']['missing']:
 target=(root/old['source']).parent/old['target'].split('#')[0]
 current_exists=target.exists()
 category='fixed-current-guide' if old['source']=='docs/github-setup.md' else 'historical-or-excluded'
 oldmissing.append({**old,'currentOriginalTargetExists':current_exists,'disposition':category,'reason':('Maintained guide now links packages/ui/release.config.mjs; old destination remains absent.' if category=='fixed-current-guide' else 'Dated acceptance/progress/extraction receipt; preserves original file/host identity. Excluded from maintained-guide repair, not relabeled a current pass.')})
# Scan all inline local links as prior parser did, keep full findings to catch new active regressions.
fresh=[];scan_count=0;link_count=0
for p in [root/'README.md',root/'AGENTS.md']+sorted((root/'docs').rglob('*.md')):
 if 'final-acceptance' in p.parts:continue
 scan_count+=1
 for m in re.finditer(r'\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',unfence(p.read_text())):
  t=m[1].strip('<>');u=urllib.parse.urlsplit(t)
  if u.scheme or t.startswith(('#','//')):continue
  link_count+=1
  if not (p.parent/urllib.parse.unquote(u.path)).exists():fresh.append({'source':str(p.relative_to(root)),'target':t})
inputs=set(active+['AGENTS.md','package.json','packages/ui/package.json','apps/docs/package.json','.github/workflows/ci.yml','.github/workflows/ai-code.yml','docs/migration.md','packages/ui/src/components/Button/Button.tsx','packages/ui/src/components/AppDataGrid/types.ts','packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/theme/index.ts','packages/ui/src/components/index.ts','apps/docs/tests/check-sources.ts','apps/docs/tests/catalog.spec.ts','docs/developer/final-acceptance/coordinator-integration/evidence.json'])
oldhashes={x['path']:x['sha256'] for x in prior['inputs']}
hashes=[{'path':p,'sha256':sha(root/p),'priorSha256':oldhashes.get(p),'matchesPrior':sha(root/p)==oldhashes.get(p)} for p in sorted(inputs)]
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'runtime':subprocess.check_output(['python3','--version'],text=True).strip(),'activeGuideScope':active,'proposedLocalLinks':records,'scriptCommands':commands,'directScriptPaths':paths,'issues':issues,'original119Dispositions':oldmissing,'freshInlineScan':{'documents':scan_count,'links':link_count,'missing':fresh},'inputHashes':hashes,'priorReportHashes':{p:sha(root/p) for p in ['docs/developer/final-acceptance/wave-02-13/report.md','docs/developer/final-acceptance/wave-02-13/results.json']},'limits':['Bounded heading-slug implementation; no external URL requests, command execution, legal/owner approval, browser or AT result.','Inline code source paths are checked only for explicit direct node scripts; broad reference-style/HTML/anchor checks cover named maintained guides only.','Historical/excluded missing targets remain visible. No whole repository doc integrity or fresh dist claim.']}
(out/'audit-result.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'activeGuides':len(active),'links':len(records),'commands':len(commands),'directScripts':len(paths),'issues':issues,'freshInlineScan':{'documents':scan_count,'links':link_count,'missing':len(fresh)},'priorDispositions':dict(collections.Counter(x['disposition'] for x in oldmissing))},indent=2))

raise SystemExit(1 if issues else 0)
