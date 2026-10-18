from pathlib import Path
import difflib,hashlib,json
root=Path(__file__).resolve().parents[5];out=Path(__file__).resolve().parent
path='apps/docs/native-fixtures/scenarios/experimental/Calendar/Calendar.fixture.tsx'
old=(root/path).read_text()
needle='  renderDayContent: () => <span>DECORATION_SENTINEL</span>,'
assert old.count(needle)==1,'Reconcile changed coordinator fixture before preparing replacement.'
replacement='''  // Keep the full text in the DOM so a broken library aria-hidden boundary
  // still fails the speech assertion. Clip only the fixture's decorative slot.
  renderDayContent: () => <span data-testid="calendar-speech-decoration" style={{
    display: "block", inlineSize: "100%", maxInlineSize: "100%",
    overflow: "hidden", whiteSpace: "nowrap", textOverflow: "clip",
  }}>DECORATION_SENTINEL</span>,'''
new=old.replace(needle,replacement)
p=out/'proposed-files'/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(new)
(out/'marker-clip.patch').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+path,tofile='b/'+path)))
h=lambda s:hashlib.sha256(s.encode()).hexdigest()
(out/'marker-clip-inputs.json').write_text(json.dumps({'target':path,'beforeSha256':h(old),'proposedSha256':h(new),'proposal':'proposed-files/'+path,'scope':'Fixture-only native inline layout; no library source, API, ARIA boundary or speech assertion change.','state':'Unexecuted proposed-only. Current fixture/build frozen while coordinator XCTest runs.','checksForCoordinator':[
 'After running Xcode settles, apply marker-clip.patch against beforeSha256 and rebuild private native fixtures under coordinator serial admission.',
 'Open migration-proofs-calendar--speech-semantics and capture the complete calendar. Date labels, both availability reasons and full native day targets must remain usable.',
 'Each [data-testid="calendar-speech-decoration"] has full textContent DECORATION_SENTINEL, overflow-x hidden, white-space nowrap, and a bounding width within its parent decorative slot/day cell. No new aria-hidden attribute is added to the fixture child.',
 'Existing actual speech assertions remain unchanged: sentinel absent from utterances; complete date and static/callback reason content present. Record changed fixture digest and original failed geometry screenshot separately.'
 ]},indent=2)+'\n')
print(json.dumps({'file':path,'patch':'marker-clip.patch','beforeSha256':h(old),'proposedSha256':h(new)}))
