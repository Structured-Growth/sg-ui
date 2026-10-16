from pathlib import Path
import difflib,json,hashlib
root=Path.cwd();out=root/'docs/developer/final-acceptance/wave-03-09';changes={}
p='packages/ui/src/components/ClassCardFrame/ClassCardFrame.module.css';s=(root/p).read_text();s=s.replace('.root { inline-size:', '.root { container: sgui-class-card / inline-size; inline-size:');s=s.replace('  .footer { padding:', '''  /* The allocated card width, rather than the viewport, chooses slot spacing.
     Only owned slot padding adapts; host slot content keeps its own layout. */
  @container sgui-class-card (inline-size < 20rem) {
    .header, .body { padding: var(--sgui-space3); }
  }
  .footer { padding:''');changes[p]=s
p='docs/developer/react-aria-card-frames.md';s=(root/p).read_text();s=s.replace('`width` still accepts a pixel number. Long card headings wrap within the header.', '''`width` still accepts a pixel number. Long card headings wrap within the header.

The frame owns the named `sgui-class-card` inline-size query boundary. The host
allocates its width through a block, a flex item with `min-inline-size: 0`, or a
`minmax(0, 1fr)` grid track. The frame fills that allocation up to its maximum;
inline-size containment does not derive an intrinsic width from slot content, so
an intrinsically sized/shrink-to-fit host must supply a width. Below 20rem of card
content width, owned header/body padding changes from space4 to space3. Footer
padding and host-provided slot layout remain unchanged. Resizing one card does
not choose the spacing of a sibling. Native slot styles can override this padding.

`CardCollectionWithFooter` keeps its fluid `auto-fill`/`minmax` grid; the collection
allocates tracks and each ClassCardFrame adapts its own slots. Generic Card is a
surface primitive and does not add containment to arbitrary consumer layouts.
Toolbar, navigation-shell and modal query boundaries remain documented in
[toolbar](react-aria-data-toolbar.md), [navigation](react-aria-navigation-container.md)
and [modal](react-aria-modal-container.md) contracts.

Text roles use rem-backed tokens; the card maximum is a compatibility pixel prop,
not a fixed text size. The rem query threshold follows root text enlargement.
Keep mobile layouts shrinkable and allow long labels to wrap. Do not add a
viewport-only font-size clamp: there is no demonstrated benefit over the owned
rem scale, and it can defeat text enlargement. Existing `min(100%, ...)` overlay
widths and the fluid collection grid provide the useful fluid sizing. At short
heights retain independent tab-panel scrolling and the whole-dialog fallback.
Browser zoom must be validated using browser controls; root font-size overrides
and a 320 CSS-pixel viewport are separate reflow checks.''');changes[p]=s
p='apps/docs/content/component-usage/data.json';s=(root/p).read_text();s=s.replace('Use width for the maximum card width and the native styling slots for context-specific layout. Keep headings and action labels meaningful.', 'Use width for the maximum card width and the native styling slots for context-specific layout. Supply a shrinkable block, flex item or grid track: the frame owns the sgui-class-card inline-size container and reduces header/body padding below 20rem of card width. Keep headings and action labels meaningful.');changes[p]=s
p='apps/docs/native-fixtures/scenarios/components/ClassCardFrame/ClassCardFrame.fixture.tsx';s=(root/p).read_text();s+='''
// A-C-08: independent allocated cards in one wide viewport. No ancestor query needed.
function ContainerBoundaryExample() {
  const [narrow, setNarrow] = useState(true);
  return <div style={{ display: "grid", gap: 16 }}>
    <Button onPress={() => setNarrow(value => !value)}>Resize first card host</Button>
    {(["compact", "comfortable"] as const).map(density =>
      <ThemeScope density={density} key={density}>
        <div data-testid={`card-host-${density}`} style={{ inlineSize: density === "compact" && narrow ? 280 : 420, maxInlineSize: "100%" }}>
          <ClassCardFrame
            header={<Typography as="h3" variant="h5">International course plan for leadership and learning materials review</Typography>}
            body={<Typography>خطة الدورة الدولية لتطوير مهارات القيادة والتعاون ومراجعة المواد التعليمية</Typography>}
            footer={<Button>Open {density} course</Button>} />
        </div>
      </ThemeScope>)}
  </div>;
}
export const ContainerBoundary: Story = { render: () => <ContainerBoundaryExample /> };
''';changes[p]=s
changes['packages/ui/tests/browser/card-container-boundary.spec.ts']=(out/'card-container.spec.ts').read_text()
for p,s in changes.items():
 target=out/'proposed-files'/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(s)
patch=''.join(''.join(difflib.unified_diff(((root/p).read_text() if (root/p).exists() else '').splitlines(True),s.splitlines(True),fromfile=('a/'+p if (root/p).exists() else '/dev/null'),tofile='b/'+p)) for p,s in changes.items())
(out/'card-containment.patch').write_text(patch)
(out/'patch-inputs.json').write_text(json.dumps({p:(hashlib.sha256((root/p).read_bytes()).hexdigest() if (root/p).exists() else None) for p in changes},indent=2)+'\n')
