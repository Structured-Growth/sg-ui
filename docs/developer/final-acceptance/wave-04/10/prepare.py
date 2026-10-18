import pathlib,json,hashlib,difflib
root=pathlib.Path.cwd(); out=root/'docs/developer/final-acceptance/wave-04/10'; mirror=out/'proposed-files'; bases={}
def put(path,text):
 p=root/path; before=p.read_text() if p.exists() else ''; bases[path]=hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
 q=mirror/path;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(text)
 return ''.join(difflib.unified_diff(before.splitlines(True),text.splitlines(True),fromfile='a/'+path if p.exists() else '/dev/null',tofile='b/'+path))
patch=''; path='packages/ui/src/experimental/ToggleButton/ToggleButton.module.css'; s=(root/path).read_text();s=s.replace('min-inline-size: var(--sgui-control-height);','min-inline-size: max(var(--sgui-control-height), var(--sgui-control-minimum-target-size));')
s=s.replace('  .button[data-selected][data-hovered]', '''  /* Double geometry exposes selection without color. Preserve the outer box:
     each extra 2px of border replaces 2px of existing padding. */
  .button[data-selected] {
    border-style: double; border-width: 3px; background-clip: padding-box;
    padding-block: max(0px, calc(var(--sgui-space1) - 2px));
    padding-inline: max(0px, calc(var(--sgui-control-padding) - 2px));
  }
  .button[data-selected][data-hovered]'''); patch+=put(path,s)
path='apps/docs/native-fixtures/scenarios/experimental/ToggleButton/ToggleButton.fixture.tsx';s=(root/path).read_text().replace('import { Provider }','import { ThemeScope, Provider }'); s+='''
// Each native scope owns its own uncontrolled toggle and group state.
export const SelectionGeometry: Story = { render: () => <>
  {(["light", "dark"] as const).map(theme => (["compact", "comfortable"] as const).map(density =>
    (["pointer", "touch"] as const).map(interactionMode =>
      <ThemeScope key={`${theme}-${density}-${interactionMode}`} theme={theme} density={density}
        interactionMode={interactionMode} data-testid={`${theme}-${density}-${interactionMode}`}>
        <ToggleButton aria-label="Bold">B</ToggleButton>
        <ToggleButtonGroup label="View" allowEmpty={false} defaultSelectedIds={["grid"]}
          options={[{ id: "grid", label: "Grid" }, { id: "cards", label: "Cards" }]} />
      </ThemeScope>)))}
</> };
'''; patch+=put(path,s)
path='apps/docs/content/component-usage/forms.json';s=(root/path).read_text()
s=s.replace('Choose density locally and use disabled when the command is unavailable.', 'Selected actions use a double border as a non-color cue alongside aria-pressed; keyboard focus remains a separate outward ring. Choose density locally and use disabled when the command is unavailable.')
s=s.replace('Connect selection to host commands or presentation state.', 'Selected options use a double border alongside checked or pressed semantics while preserving their outer size. Connect selection to host commands or presentation state.')
patch+=put(path,s)
path='packages/ui/tests/browser/wave04-toggle-presentation.spec.ts';patch+=put(path,(mirror/path).read_text())
(out/'implementation.patch').write_text(patch);(out/'patch-preconditions.json').write_text(json.dumps(bases,indent=2)+'\n')
