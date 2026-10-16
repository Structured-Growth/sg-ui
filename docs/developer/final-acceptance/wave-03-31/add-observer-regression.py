from pathlib import Path
import difflib
r=Path.cwd();o=r/'docs/developer/final-acceptance/wave-03-31';p='packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx'
s=(r/p).read_text();n=s+'''
it("disconnects the selection toolbar measurement observer on unmount", async () => {
  const instances: { targets: Element[]; disconnect: ReturnType<typeof vi.fn> }[] = [];
  class MeasurementObserver {
    targets: Element[] = [];
    disconnect = vi.fn();
    constructor() { instances.push(this); }
    observe(target: Element) { this.targets.push(target); }
    unobserve() {}
  }
  vi.stubGlobal("ResizeObserver", MeasurementObserver);
  let dispose: (() => void) | undefined;
  try {
    const view = mount(); dispose = view.unmount;
    await select();
    const toolbar = screen.getByRole("group", { name: "Selection formatting" });
    const measurement = instances.find(instance => instance.targets.includes(toolbar));
    expect(measurement).toBeDefined();
    view.unmount(); dispose = undefined;
    expect(measurement!.disconnect).toHaveBeenCalledTimes(1);
  } finally { dispose?.(); vi.unstubAllGlobals(); }
});
'''
(o/'proposed-files'/p).parent.mkdir(parents=True,exist_ok=True);(o/'proposed-files'/p).write_text(n)
(o/'observer-cleanup.patch').write_text(''.join(difflib.unified_diff(s.splitlines(True),n.splitlines(True),fromfile='a/'+p,tofile='b/'+p)))
