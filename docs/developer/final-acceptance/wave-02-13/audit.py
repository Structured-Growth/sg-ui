import pathlib,json,re,hashlib,datetime,subprocess,urllib.parse
root=pathlib.Path.cwd(); owned=root/'docs/developer/final-acceptance/wave-02-13'
fa=json.loads((root/'docs/developer/final-acceptance/2026-10-16-source-inventory.json').read_text())
active=['AGENTS.md','README.md','docs/agent-guidance-migration.md','docs/migration.md','docs/github-setup.md','docs/commercial-licensing.md','docs/troubleshooting/validation.md','docs/troubleshooting/firefox-profile-launch.md','docs/developer/component-architecture.md','docs/developer/react-aria-component-recipe.md','docs/developer/react-aria-adoption-checklist.md','docs/developer/react-aria-theme.md','docs/developer/react-aria-primitives.md','docs/developer/react-aria-calendar-contracts.md','docs/developer/react-aria-modal-shells.md','docs/developer/react-aria-dependency-upgrades.md','docs/developer/react-aria-license-inventory.md','docs/developer/react-aria-server-components.md','docs/developer/react-aria-runtime-ci.md','docs/developer/docs-website.md','docs/developer/docs-fixture-migration.md','docs/extraction-manifest.json','apps/docs/native-fixtures/migration-manifest.json','apps/docs/native-fixtures/registry.json','apps/docs/native-fixtures/host.tsx','apps/docs/native-fixtures/README.md','apps/docs/components/Example.tsx','apps/docs/components/DemoSettings.tsx','apps/docs/components/DemoThemePanel.tsx','package.json','packages/ui/package.json','apps/docs/package.json','.github/workflows/ci.yml','.github/workflows/ai-code.yml','.github/workflows/release.yml','.github/ISSUE_TEMPLATE/ui-change.yml','.github/pull_request_template.md','packages/ui/scripts/check-foundations.mjs','packages/ui/scripts/check-component-css.mjs','packages/ui/scripts/react-stately-boundaries.test.mjs','packages/ui/scripts/check-package.mjs','packages/ui/scripts/test-foundation-consumer.mjs','packages/ui/scripts/test-next-consumer.mjs','release.config.mjs','LICENSE','THIRD_PARTY_NOTICES.md']
inputs=[]
for name in active:
 p=root/name
 if not p.exists():continue
 h=hashlib.sha256(p.read_bytes()).hexdigest(); old=fa['inputHashes'].get(name)
 inputs.append(dict(path=name,sha256=h,fa02=old,matches_fa02=h==old))
links=[]; missing=[]; scanned=[]
for p in [root/'README.md',root/'AGENTS.md']+sorted((root/'docs').rglob('*.md')):
 if 'final-acceptance' in p.parts: continue
 scanned.append(str(p.relative_to(root))); fence=False
 for n,line in enumerate(p.read_text().splitlines(),1):
  if line.lstrip().startswith(('```','~~~')):fence=not fence;continue
  if fence:continue
  for m in re.finditer(r'\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',line):
   target=m.group(1).strip('<>'); parsed=urllib.parse.urlsplit(target)
   if parsed.scheme or target.startswith(('#','//')):continue
   path=urllib.parse.unquote(parsed.path)
   if not path:continue
   resolved=(p.parent/path).resolve(); exists=resolved.exists()
   rec=dict(source=str(p.relative_to(root)),line=n,target=target,exists=exists)
   links.append(rec)
   if not exists:missing.append(rec)
manifest=json.loads((root/'apps/docs/native-fixtures/migration-manifest.json').read_text())
mods=manifest['modules']; targets=[dict(original=m['original'],fixture=m['fixture'],exists=(root/m['fixture']).exists()) for m in mods]
stale=[]
for name in active:
 p=root/name
 if p.suffix not in ['.md','.yml'] or not p.exists():continue
 for n,line in enumerate(p.read_text().splitlines(),1):
  if re.search(r'build-storybook|sgui-storybook|colocat.{0,12}stories|Keep stories updated|`codex/dev`|static Storybook server',line):
   stale.append(dict(path=name,line=n,text=line))
d={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'inputs':inputs,'markdown_scan':{'documents':len(scanned),'paths':scanned,'local_inline_links':len(links),'missing':missing,'limits':'Path-existence only, outside fenced blocks; reference-style/HTML links, anchors, inline code paths and remote destinations not certified. Historical records may intentionally name retired destinations.'},'fixture_mapping':{'entries':len(targets),'missing':[x for x in targets if not x['exists']]},'stale_active_candidates':stale}
(owned/'evidence.json').write_text(json.dumps(d,indent=2)+'\n')
print(json.dumps({'inputs':len(inputs),'fa02_deltas':[x['path'] for x in inputs if not x['matches_fa02']],'documents':len(scanned),'links':len(links),'missing':len(missing),'missing_active':[x for x in missing if x['source'] in active],'fixture_targets':len(targets),'fixture_missing':len(d['fixture_mapping']['missing']),'stale_candidates':len(stale)},indent=2))
