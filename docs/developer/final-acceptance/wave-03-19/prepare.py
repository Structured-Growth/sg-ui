from pathlib import Path
import difflib
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-19'
changes={}
base='apps/docs/native-fixtures/scenarios/experimental'
changes[f'{base}/Select/Select.fixture.tsx']='''

/** Private acceptance host: ID serialization and controlled authority, no persistence. */
export const NativeContracts: Story = { render: () => { const [request, setRequest] = useState<string | null>(null); return <form aria-label="Status contract">
 <button type="button">Before status</button>
 <Select label="Identity status" name="identity" description="Choose a stable status ID" defaultValue="01" options={[
  { id: "01", label: "Same" }, { id: "blocked", label: "Unavailable", disabled: true },
  { id: "1", label: "Same" }, { id: "z", label: "Zulu" },
 ]} />
 <Select label="Host status" name="host" value={null} onValueChange={setRequest} options={[{ id: "01", label: "Same" }, { id: "1", label: "Same" }]} />
 <button type="reset">Reset status</button>
 <output aria-label="Status request">{request}</output>
</form>; } };
'''
changes[f'{base}/ComboBox/ComboBox.fixture.tsx']='''

/** Private acceptance host: local filtering, duplicate labels and native reset. */
export const NativeContracts: Story = { render: () => { const [request, setRequest] = useState<string | null>(null); return <form aria-label="Category contract">
 <button type="button">Before category</button>
 <ComboBox label="Identity category" name="identity" description="Search stable category IDs" defaultValue="01" options={[
  { id: "01", label: "Same" }, { id: "blocked", label: "Unavailable", disabled: true },
  { id: "1", label: "Same" }, { id: "z", label: "Zulu" },
 ]} />
 <ComboBox label="Host category" name="host" value={null} onValueChange={setRequest} options={[{ id: "z", label: "Zulu" }]} />
 <button type="reset">Reset category</button>
 <output aria-label="Category request">{request}</output>
</form>; } };
'''
changes[f'{base}/Menu/Menu.fixture.tsx']='''

function NativeContractsExample() {
 const [requests, setRequests] = useState<string[]>([]);
 return <>
  <Button>Before commands</Button>
  <Menu label="Contract commands" trigger={<Button>Contract actions</Button>} items={[
   { id: "blocked-first", label: "Unavailable first", disabled: true },
   { id: "first", label: "First enabled" },
   { id: "middle", label: "Unavailable middle", disabled: true },
   { id: "last", label: "Last enabled" },
   { id: "blocked-last", label: "Unavailable last", disabled: true },
  ]} onAction={id => setRequests(previous => [...previous, id])} />
  <Button>After commands</Button>
  <output aria-label="Command requests">{requests.join(",")}</output>
 </>;
}
export const NativeContracts: Story = { render: () => <NativeContractsExample /> };
'''
patch=[]
for name,addition in changes.items():
 old=(root/name).read_text();new=old+addition
 if '/Menu/' in name:new='import { useState } from "react";\n'+new
 target=out/'proposed-files'/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(new)
 patch.extend(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+name,tofile='b/'+name))
(out/'selector-contract-fixtures.patch').write_text(''.join(patch))
