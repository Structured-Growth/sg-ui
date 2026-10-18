"""Join resolved old primitive hooks to actual current public prop boundaries."""
from pathlib import Path
import hashlib,json
here=Path(__file__).resolve().parent
oldpath=here/'historical-resolved-props.json';newpath=here/'resolved-public-inventory/public-contracts.json'
old=json.loads(oldpath.read_text());new=json.loads(newpath.read_text());assert not old['unresolved'] and not old['diagnostics']
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
current={a['name']:c for c in new['contracts'].values() for a in c['aliases']}
renames={'AppDataGridShellInheritedProps':['AppDataGridShellProps'],'AppButtonProps':['ButtonProps'],'FormControlLabelProps':['CheckboxProps','SwitchProps','RadioGroupProps'],'MuiLinkProps':['LinkProps'],'MenuItemProps':['MenuItem']}
system_keys={p['name'] for p in old['contracts']['HistoricalSystemProps']['properties']}
visual_keys={'color','variant','size','align','fullWidth','elevation','square','raised','disableElevation','disableGutters','disablePadding','dense','padding','gutterBottom','noWrap','paragraph','variantMapping','orientation','direction','spacing','useFlexGap','component'}
rows=[]
for name,contract in old['contracts'].items():
 if name in ['SelectChangeEvent','HistoricalSystemProps']:continue
 targets=renames.get(name,[name]);assert all(t in current for t in targets),(name,targets)
 options={t:{p['name']:p for p in current[t]['properties']} for t in targets}
 # Public aliases may resolve a component callable rather than a prop-record; use its parameter.
 for t in targets:
  if current[t]['parameters']:options[t].update({p['name']:p for ps in current[t]['parameters'] for parameter in ps for p in parameter['properties']})
 for prop in contract['properties']:
  key=prop['name']
  if key not in {'sx','style','className','classes','slotProps','slots','components','componentsProps'}|system_keys|visual_keys and not key.endswith(('Props','Component','Sx','ClassName','Variant','Color','Tone')):continue
  available={t:sorted(p for p in options[t] if p in ['className','style'] or p.endswith(('ClassName','Style','Slot','Icon')) or p.startswith('render')) for t in targets}
  if key in system_keys or key in visual_keys or key.endswith(('Variant','Color','Tone')):
   classification='removed-or-redefined-system-presentation-prop';instruction='Compare the exact current signature/domain first; same spelling is not old responsive/theme behavior. Prefer the current owned variant/tone/density/layout prop when declared; otherwise use declared class/style with owned tokens or compose a public layout boundary. Old spacing numbers/theme strings/responsive arrays are not native CSS values. Never pass native color as a substitute for a removed theme color API.'
   if key in ['fontSize','fontWeight','fontFamily','lineHeight','fontStyle','letterSpacing','typography']:instruction='Use owned Typography variants/typography tokens or shared component styles. The old system typography object/responsive/theme mapping is removed; do not set local font properties to reproduce it.'
   elif key=='component':instruction='Use the current declared as prop where supported for an intrinsic element; arbitrary upstream component polymorphism is removed. Preserve the actual native ref target and semantics.'
  elif key in ['paperSx','headerSx','bodySx','footerSx']:
   classification='explicit-owned-part-conversion';part=key[:-2];replacement=['className','style'] if key=='paperSx' else [part+'ClassName',part+'Style'];assert all(p in options[targets[0]] for p in replacement),(name,key,replacement);instruction='Convert the upstream SxProps value to native CSS using '+', '.join(replacement)+'. No theme callbacks/arrays/shorthands; preserve the matching surface/body/header/footer ownership.'
  elif key in ['style','className'] and any(key in ps for ps in options.values()):classification='owned-same-name-signature-review';instruction='Use the actual current declared native prop only on the listed target. Exact type/target comparison retained; same spelling does not promise the historical DOM or polymorphism.'
  elif key=='sx':classification='removed-upstream-style-language';instruction='No theme callbacks, responsive-object grammar or array merge. Convert to owned token scope and only the native class/style or explicit part props actually listed for this current boundary.'
  elif key in ['style','className']:classification='removed-root-escape-hatch';instruction='This current boundary exposes no matching generic root prop. Compose supported public components/use owned token scopes; do not pass invented style/class props.'
  else:classification='removed-upstream-slot-topology';instruction='Do not forward or rename old engine part/element props. Use only explicit current hooks listed here with their documented targets, or compose supported public components. Arbitrary upstream DOM selectors are not retained.'
  rows.append({'oldContract':name,'oldProp':key,'oldType':prop['type'],'oldOrigin':prop['origin'],'oldDeprecated':prop.get('deprecated',[]),'currentContracts':targets,'currentSameNamedProps':{t:ps[key]['type'] for t,ps in options.items() if key in ps},'currentDeclaredHooks':available,'classification':classification,'migrationInstruction':instruction})
result={'baseline':'21adebd61bedfc6a1ed395fe664ff4be83896821','historicalResolvedSha256':sha(oldpath),'currentResolvedSha256':sha(newpath),'primitivePropContracts':28,'wrapperContracts':8,'stylingAndSlotRows':len(rows),'resolvedSystemPropertyKeys':sorted(system_keys),'rows':rows,'limits':['Exact resolved primitive inherited style/slot/element-prop hook join. Wrapper-specific paperSx/headerSx/bodySx/footerSx mappings remain in prior accepted styling-mappings.json.','Native same-named props require target/signature review; no polymorphic compatibility promise.','Other public wrapper inherited fields/defaults, runtime behavior and release marking remain separate. No broad compatibility closure inferred.']}
(here/'historical-styling-mappings.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'primitivePropContracts':result['primitivePropContracts'],'stylingAndSlotRows':len(rows),'resolvedSystemPropertyKeys':sorted(system_keys)}))
