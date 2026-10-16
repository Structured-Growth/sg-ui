from pathlib import Path
import difflib,json,hashlib
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-12'; mirrors=out/'proposed-files'
changes={}
p='packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.impl.tsx'
s=(root/p).read_text(); changes[p]=s.replace('aria-pressed={draft === tokens[key]} style={{ backgroundColor: tokens[key] }} onPress={() => commit(tokens[key])} />','aria-pressed={draft === tokens[key]} onPress={() => commit(tokens[key])}>\n          <span aria-hidden="true" className={styles.swatchFill} style={{ backgroundColor: tokens[key] }} />\n        </Button>')
p='packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.module.css';s=(root/p).read_text()
s=s.replace('.swatch { inline-size:', '.swatch { position: relative; inline-size:')
s=s.replace('  .swatch[aria-pressed', '  .swatchFill { position: absolute; inset: 0; border-radius: var(--sgui-button-radius); pointer-events: none; }\n  .swatch[aria-pressed',1)
s=s.replace('  @media (forced-colors: active) { .swatch { forced-color-adjust: none; } .swatch[aria-pressed="true"] { outline-color: Highlight; } }','''  @media (forced-colors: active) {
    /* Preserve the color data only; keep interactive chrome system-painted. */
    .swatchFill { forced-color-adjust: none; }
    .swatch { border-color: ButtonText; }
    .swatch[aria-pressed="true"] { border: 3px double Highlight; outline-color: Highlight; outline-offset: -4px; }
    .swatch[data-focus-visible] { outline: var(--sgui-control-focus-width) solid Highlight; outline-offset: var(--sgui-control-focus-offset); }
  }''');changes[p]=s
p='packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.test.tsx';s=(root/p).read_text();s=s.replace('    expect(onChange).toHaveBeenCalledTimes(1);\n    expect(field.getAttribute', '''    expect(onChange).toHaveBeenCalledTimes(1);
    const swatch = screen.getByRole("button", { name: "Primary", exact: true });
    // Color-data opt-out belongs to a decorative child, never the focusable button.
    expect(swatch.style.backgroundColor).toBe("");
    expect(swatch.querySelector('[aria-hidden="true"]')?.getAttribute("style")).toContain("var(--sgui-action)");
    expect(field.getAttribute''',1);changes[p]=s
p='apps/docs/native-fixtures/scenarios/foundation/FoundationCatalogue.fixture.tsx';s=(root/p).read_text();s=s.replace('const themes =', 'import { IconPanelNavigation } from "@structured-growth/sg-ui/components";\n\nconst themes =',1)
s+='''
// New acceptance host, separate from historical foundation scenarios.
function MotionCancellationExample({ side }: { side: "start" | "end" }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return <ThemeScope>
    <Button onPress={() => setActiveId(null)}>Close from host</Button>
    <IconPanelNavigation aria-label="Motion tools" side={side} activeId={activeId} onActiveIdChange={setActiveId} items={[
      { id: "notes", label: "Notes", icon: <span>N</span>, content: <>
        <label>Notes draft<input defaultValue="Keep notes" /></label>
        <Button onPress={() => setActiveId("tasks")}>Switch to tasks</Button>
      </> },
      { id: "tasks", label: "Tasks", icon: <span>T</span>, content: <label>Tasks draft<input defaultValue="Keep tasks" /></label> },
    ]} />
  </ThemeScope>;
}
export const MotionCancellationStart: Story = { render: () => <MotionCancellationExample side="start" /> };
export const MotionCancellationEnd: Story = { render: () => <MotionCancellationExample side="end" /> };
''';changes[p]=s
p='docs/developer/react-aria-theme.md';s=(root/p).read_text();s+='''

## Motion interruption and system indications

Simple visual effects use compiled CSS and the owned motion duration; no motion
runtime or transition-end callback gates an action, dismissal or focus update.
A live reduced-motion preference cancels running navigation, spinner and progress
animations and button transitions. Pending/indeterminate semantics remain present;
ordinary animation resumes only while the corresponding state still requires it.

SideNavigation forward/Back changes select the latest menu immediately. Focus
belongs to the current menu, without a delayed animation callback. IconPanelNavigation
shows only the accepted active panel: hidden mounted panels retain drafts and stay
out of Tab order. Closing from within a panel returns focus to its trigger; replacing
the panel from within moves focus to the accepted panel's trigger. Closing from an
already focused host control preserves that host focus. These changes do not wait
for animation completion. Collapse hides/unmounts immediately; the host chooses a
replacement focus destination when it removes the focused descendant.

Dialog/Popover use native interaction focus restoration at dismissal. Dialog's
removed-opener repair runs after native restoration and inert cleanup and must
preserve valid host or surviving-overlay focus, including immediate reopen. Tooltip
trigger replacement/unmount invalidates delayed open/close callbacks; a tooltip
never becomes an interactive focus destination.

Forced colors take priority over identity and explicit contrast preferences.
Exceptions belong to actual color data or explicit system-color painting. Color
picker swatches preserve only their decorative chip pixels; their interactive
border, selected double border and outward keyboard focus ring use system colors.
The accessible preset name and aria-pressed state remain independent of the sample.
Hosts own contrast validation for custom token overrides and application content.
Browser media emulation verifies CSS preference handling; actual OS high contrast,
spoken assistive technology and physical devices require separately recorded runs.
''';changes[p]=s
changes['packages/ui/tests/browser/wave03-system-indications.spec.ts']=(out/'browser-checks.spec.ts').read_text()
patch=''
for p,new in changes.items():
 old=(root/p).read_text() if (root/p).exists() else ''; assert new!=old,p
 dest=mirrors/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(new)
 patch+=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p if (root/p).exists() else '/dev/null',tofile='b/'+p))
(out/'system-indications.patch').write_text(patch)
(out/'patch-inputs.json').write_text(json.dumps({p:hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).exists() else None for p in changes},indent=2)+'\n')
