"""Read-only tracked Markdown link/anchor audit. Writes this owner's receipt only."""
import pathlib, subprocess, re, urllib.parse, hashlib, json, collections
ROOT=pathlib.Path(__file__).resolve().parents[5]
OUT=pathlib.Path(__file__).resolve().parent

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def unfence(s):
    return re.sub(r'(?m)^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*(?:\n|$)', lambda m:'\n'*m[0].count('\n'),s)
def anchors(s):
    seen=collections.Counter(); result=set()
    for h in re.findall(r'(?m)^#{1,6}\s+(.+?)\s*#*$',unfence(s)):
        h=re.sub(r'<[^>]*>','',h)
        h=re.sub(r'[`*_~]','',h).lower()
        h=re.sub(r'[^\w\- ]','',h).replace(' ','-')
        n=seen[h]; seen[h]+=1; result.add(h+(f'-{n}' if n else ''))
    result.update(re.findall(r'\b(?:id|name)=[\"\x27]([^\"\x27]+)',s))
    return result
files=[ROOT/p for p in subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0') if p.endswith('.md')]
records=[];undefined=[];hashes={}; cache={}
for p in files:
    if not p.exists(): continue
    name=str(p.relative_to(ROOT)); hashes[name]=sha(p); s=re.sub(r'`+[^`\n]*`+', '', unfence(p.read_text()))
    refs={m[1].lower():m[2].strip('<>') for m in re.finditer(r'(?m)^\s*\[([^\]]+)\]:\s*(<[^>]+>|\S+)',s)}
    targets=[('inline',m[1].strip('<>'),s.count('\n',0,m.start())+1) for m in re.finditer(r'\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',s)]
    targets += [('html',m[1],s.count('\n',0,m.start())+1) for m in re.finditer(r'\b(?:href|src)=[\"\x27]([^\"\x27]+)',s)]
    targets += [('definition',t,0) for t in refs.values()]
    for m in re.finditer(r'\[([^\]]+)\]\[([^\]]*)\]',s):
        ref=(m[2] or m[1]).lower()
        if ref not in refs:undefined.append({'source':name,'reference':ref})
    for kind,t,line in targets:
        try:u=urllib.parse.urlsplit(t)
        except ValueError:continue
        if u.scheme or t.startswith('//'):continue
        if t.startswith('/'):
            records.append({'source':name,'line':line,'kind':kind,'target':t,'status':'absolute-route-unchecked'});continue
        dest=(p.parent/urllib.parse.unquote(u.path)).resolve() if u.path else p
        status='present' if dest.exists() else 'missing-file'
        if status=='present' and u.fragment and dest.suffix=='.md':
            if dest not in cache:cache[dest]=anchors(dest.read_text())
            if urllib.parse.unquote(u.fragment) not in cache[dest]:status='missing-anchor'
        records.append({'source':name,'line':line,'kind':kind,'target':t,'status':status,
          'evidenceOrHistoricalCandidate':('/final-acceptance/' in name or '/parallel-' in name or '/migration-baseline/' in name)})
result={'scope':'All git-tracked Markdown, inline links, explicit reference definitions/usages and HTML href/src outside fenced blocks. Heading/explicit-ID fragments for Markdown. No external URLs, shortcuts, inline-code paths, command execution or MDX/TSX certification.',
 'parserLimits':'Bounded Markdown parser; heading slug approximates GitHub. Findings require source review; missing-anchor is not automatically a broken link. Absolute website routes explicitly unchecked.',
 'documents':len(hashes),'links':len(records),'statuses':dict(collections.Counter(x['status'] for x in records)),
 'undefinedReferences':undefined,'records':records,'sourceSha256':hashes}
(OUT/'doc-links.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ['documents','links','statuses','undefinedReferences']},indent=2))
print(json.dumps([r for r in records if r['status'] in ['missing-file','missing-anchor'] and not r['evidenceOrHistoricalCandidate']],indent=2))
