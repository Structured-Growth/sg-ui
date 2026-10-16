from pathlib import Path
import difflib
own=Path(__file__).resolve().parent;root=own.parents[3]
p='apps/docs/native-fixtures/scenarios/experimental/Popover/Popover.fixture.tsx';old=(root/p).read_text()
new='import { useState } from "react";\nimport { AppDataGridShell } from "@structured-growth/sg-ui/components/AppDataGridShell";\n'+old+'''
function CSSContracts() {
  const [rows, setRows] = useState([{ id: "one", name: "Last course" }]);
  return <Provider theme="light" density="compact" style={{ "--sgui-control-radius": "7px" }}>
    <TextField label="Decorated note" startIcon={<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12" /></svg>} />
    {(["popover", "dialog", "drawer", "auto"] as const).map(presentation => <Popover key={presentation}
      presentation={presentation} size="lg" title={presentation + " contract"}
      trigger={<Button>{"Open " + presentation}</Button>}><TextField label={presentation + " draft"} autoFocus /></Popover>)}
    <AppDataGridShell label="Focus repair courses" rows={rows} columns={[{ field: "name", headerName: "Name" }]}
      getRowLabel={row => row.name} pageSizeOptions={[25]} defaultPaginationModel={{ page: 0, pageSize: 25 }}
      toolbar={{ show: false }} hideFooter view={{ defaultMode: "cards", cards: {
        renderCard: () => <Button onPress={() => setRows([])}>Remove last course</Button>,
      } }} />
  </Provider>;
}
export const CSSContract: Story = { render: () => <CSSContracts /> };
'''
out=own/'proposed-files'/p;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(new)
(own/'native-fixture.patch').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p,tofile='b/'+p)))
