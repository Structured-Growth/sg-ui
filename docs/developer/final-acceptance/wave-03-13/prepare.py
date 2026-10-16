from pathlib import Path
import difflib,json,hashlib
root=Path(__file__).resolve().parents[4]; own=root/'docs/developer/final-acceptance/wave-03-13'; changes={}
def change(path,fn):
 old=(root/path).read_text();new=fn(old);assert old!=new,path
 out=own/'proposed-files'/path;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(new);changes[path]=(old,new)
p='packages/ui/src/experimental/TextField/TextField.module.css'
def field(s):
 start=s.index('  .decoratedControl > .input[data-focus-visible]');end=s.index('  .root[data-invalid] .decoratedControl',start)
 block=s[start:end];return s[:start]+'  /* Keep the input ring unless the decorated wrapper can replace it. */\n  @supports selector(:has(*)) {\n'+''.join('  '+line+'\n' for line in block.splitlines())+'  }\n'+s[end:]
change(p,field)
p='packages/ui/src/components/AppDataGridShell/AppDataGridShell.module.css'
change(p,lambda s:s.replace('min-inline-size: 0; outline: none;','min-inline-size: 0;').replace('  .content >', '  /* Empty-page/card repair can focus this wrapper without a remaining row. */\n  .content:focus { outline: var(--sgui-control-focus-width) solid var(--sgui-control-focus-color); outline-offset: calc(-1 * var(--sgui-control-focus-width)); }\n  .content >',1))
p='packages/ui/src/experimental/Popover/Popover.module.css'
def popover(s):
 s=s.replace('inline-size:100%!important;max-inline-size:100%!important;', 'inline-size:100%;max-inline-size:100%;')
 s=s.replace('  .root[data-presentation="dialog"]', '  /* Position/inset override engine inline placement; block caps override its inline maxHeight.\n     Width caps have no inline competitor and use ordinary source order. */\n  .root[data-presentation="dialog"]',1)
 s=s.replace('max-block-size:calc(100dvh - 2rem)!important;', 'max-block-size:calc(100vh - 2rem)!important;max-block-size:calc(100dvh - 2rem)!important;')
 s=s.replace('max-block-size:90dvh!important;', 'max-block-size:90vh!important;max-block-size:90dvh!important;')
 return s
change(p,popover)
p='packages/ui/src/experimental/Dialog/Dialog.module.css'
change(p,lambda s:s.replace('@supports not (height: 100dvh) { .modal { max-block-size: calc(100vh - 2rem); } }','@supports not (height: 100dvh) {\n    .modal { max-block-size: calc(100vh - 2rem); }\n    .modal[data-size="xl"] { block-size: 92vh; }\n    .modal[data-size="full"] { block-size: 100vh; max-block-size: 100vh; }\n  }'))
patch=''.join(''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/'+p,tofile='b/'+p)) for p,(a,b) in changes.items());(own/'scoped-css-corrections.patch').write_text(patch)
# Native nesting is a separate opt-in support-policy proposal, not part of baseline fixes.
p='packages/ui/src/experimental/TextField/TextField.module.css';old=changes[p][1]
a='  .adornment { display: inline-flex; align-items: center; justify-content: center; flex: none; inline-size: var(--sgui-space4); block-size: var(--sgui-space4); pointer-events: none; }\n  .adornment > svg { inline-size: 100%; block-size: 100%; }'
b='  .adornment {\n    display: inline-flex; align-items: center; justify-content: center; flex: none; inline-size: var(--sgui-space4); block-size: var(--sgui-space4); pointer-events: none;\n    & > svg { inline-size: 100%; block-size: 100%; }\n  }'
assert a in old
(own/'optional-native-nesting.patch').write_text(''.join(difflib.unified_diff(old.splitlines(True),old.replace(a,b).splitlines(True),fromfile='a/'+p,tofile='b/'+p)))
(own/'candidate-input-hashes.json').write_text(json.dumps({p:{'sourceSha256':hashlib.sha256(a.encode()).hexdigest(),'candidateSha256':hashlib.sha256(b.encode()).hexdigest()} for p,(a,b) in changes.items()},indent=2)+'\n')
