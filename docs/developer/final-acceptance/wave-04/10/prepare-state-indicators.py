from pathlib import Path
import difflib,json,hashlib
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-04/10';mirror=out/'proposed-files';changes={};patch=''
def put(path,s):
 global patch
 before=(root/path).read_text() if (root/path).exists() else '';changes[path]=hashlib.sha256((root/path).read_bytes()).hexdigest() if (root/path).exists() else None;p=mirror/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s);patch+=''.join(difflib.unified_diff(before.splitlines(True),s.splitlines(True),fromfile='a/'+path if (root/path).exists() else '/dev/null',tofile='b/'+path))
p='packages/ui/src/experimental/Navigation/Navigation.module.css';s=(root/p).read_text().replace('.item { box-sizing:', '.item { border-inline-start: 3px solid transparent; box-sizing:').replace('.item[aria-current="page"] { color: var(--sgui-navigation-action-text); }', '.item[aria-current="page"] { color: var(--sgui-navigation-action-text); border-inline-start-color: var(--sgui-navigation-action-text); border-inline-start-style: double; }').replace('outline: 1px solid Highlight; outline-offset: -1px;', 'border-inline-start-color: Highlight;');put(p,s)
p='packages/ui/src/experimental/List/List.module.css';s=(root/p).read_text().replace('.action { inline-size:', '.action { border-inline-start: 3px solid transparent; inline-size:').replace('background: var(--sgui-list-subtle-surface); }','background: var(--sgui-list-subtle-surface); border-inline-start-color: currentColor; border-inline-start-style: double; }').replace('outline: 1px solid Highlight; outline-offset: -1px;','border-inline-start-color: Highlight;');put(p,s)
p='packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.module.css';s=(root/p).read_text();anchor='  /* Only ranges join across columns; independent Calendar dates keep their boxes. */';assert anchor in s;s=s.replace(anchor,'''  /* A persistent inset ring identifies selected independent dates without color.
     It does not change day allocation or share the keyboard focus outline. */
  .grid:not(.rangeGrid) .cell[data-selected]::after {
    content: ""; position: absolute; inset: 3px; border: 1px solid currentColor;
    border-radius: inherit; pointer-events: none;
  }
'''+anchor);put(p,s)
p='packages/ui/tests/browser/wave04-state-indicators.spec.ts';put(p,(mirror/p).read_text())
(out/'state-indicators.patch').write_text(patch);(out/'state-indicators-preconditions.json').write_text(json.dumps(changes,indent=2)+'\n')
