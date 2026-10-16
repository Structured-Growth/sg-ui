from pathlib import Path
import difflib,json
root=Path(__file__).resolve().parents[4]
out=Path(__file__).resolve().parent
proposed=out/'proposed-files'
patches=[]
def change(path,text):
 old=(root/path).read_text() if (root/path).exists() else ''
 target=proposed/path; target.parent.mkdir(parents=True,exist_ok=True); target.write_text(text)
 patches.extend(difflib.unified_diff(old.splitlines(True),text.splitlines(True),fromfile='a/'+path if old else '/dev/null',tofile='b/'+path))
guidance='Use a filled primary Button for the one dominant confirmation or completion action in a form/dialog, such as Save or Confirm. Use outlined or text neutral actions for adjacent alternatives and ordinary toolbar commands. SplitAction keeps its neutral outlined group, shared divider and text primary command; it does not gain filled emphasis merely because its primary callback performs persistence. Keep action prominence separate from semantic text tones.'
p='docs/developer/react-aria-layout-actions.md'; text=(root/p).read_text(); anchor='Library-owned default menu labels use translation keys.\n'; assert anchor in text; change(p,text.replace(anchor,anchor+'\n'+guidance+'\n'))
p='apps/docs/content/component-usage/presentation.json'; text=(root/p).read_text(); d=json.loads(text); before=json.dumps(d['button']['how'][-1],ensure_ascii=False); assert before in text
change(p,text.replace(before,before+',\n      '+json.dumps(guidance,ensure_ascii=False),1))
p='docs/developer/react-aria-theme.md'; text=(root/p).read_text(); change(p,text+'\n\n## Foundation geometry and motion scales\n\nSee [the scale contract](react-aria-foundation-scales.md) for spacing, density,\nradius, border, icon, elevation and motion decisions, including intentionally\nlocal indicator constants. See [state applicability](react-aria-state-applicability.md)\nfor public parts, non-color indicators and outstanding visual-state evidence.\n')
p='packages/ui/src/components/Button/Button.module.css'; text=(root/p).read_text(); old='  .root[data-tone="neutral"][data-hovered], .root[data-variant="outlined"][data-pressed],'; new='  .root[data-tone="neutral"][data-hovered], .root[data-tone="neutral"][data-pressed],\n  .root[data-variant="outlined"][data-pressed],'; assert old in text; change(p,text.replace(old,new))
# New authored documents are prepared separately before rerunning this script.
for path in ['docs/developer/react-aria-foundation-scales.md','docs/developer/react-aria-state-applicability.md','apps/docs/tests/button-neutral-pressed.spec.ts']:
 if (proposed/path).exists(): change(path,(proposed/path).read_text())
(out/'implementation.patch').write_text(''.join(patches))
print('Prepared',len(patches),'diff lines; shared implementation unchanged')
