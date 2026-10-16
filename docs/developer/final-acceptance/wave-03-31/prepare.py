from pathlib import Path
import difflib
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-31'
p='packages/ui/src/foundation/scrollbar-activity.ts'
old=(root/p).read_text(); new=old.replace('  return () => { if (--current.users === 0) current.release(); };','  let released = false;\n  return () => {\n    if (released) return;\n    released = true;\n    if (--current.users === 0) current.release();\n  };')
assert new!=old
(out/'proposed-files'/p).write_text(new)
p2='packages/ui/src/foundation/scrollbar-activity.test.ts'
old2=(root/p2).read_text(); new2=old2+'''
it("does not release another scope or a later generation when disposed twice",()=>{
  vi.useFakeTimers();document.body.innerHTML='<div data-sgui-scope></div>';
  const root=document.body.firstElementChild!;
  const first=observeScrollbarActivity(document),second=observeScrollbarActivity(document);
  try {
    first();first();root.dispatchEvent(new Event('scroll'));
    expect(root.hasAttribute('data-sgui-scrolling')).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
  } finally { second(); }
  const next=observeScrollbarActivity(document);
  try {
    first();root.dispatchEvent(new Event('scroll'));
    expect(root.hasAttribute('data-sgui-scrolling')).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
  } finally { next(); }
  expect(root.hasAttribute('data-sgui-scrolling')).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
it("returns to zero pending activity after repeated scope lifetimes",()=>{
  vi.useFakeTimers();document.body.innerHTML='<div data-sgui-scope></div>';
  const root=document.body.firstElementChild!;
  for(let cycle=0;cycle<100;cycle++) {
    const release=observeScrollbarActivity(document);
    root.dispatchEvent(new Event('scroll'));root.dispatchEvent(new Event('scroll'));
    expect(vi.getTimerCount()).toBe(1);
    release();
    expect(vi.getTimerCount()).toBe(0);
    expect(root.hasAttribute('data-sgui-scrolling')).toBe(false);
  }
});
'''
(out/'proposed-files'/p2).write_text(new2)
(out/'scrollbar-disposal.patch').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p,tofile='b/'+p))+''.join(difflib.unified_diff(old2.splitlines(True),new2.splitlines(True),fromfile='a/'+p2,tofile='b/'+p2)))
