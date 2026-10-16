import { useState } from "react";
import { AppDataGridShell } from "@structured-growth/sg-ui/components/AppDataGridShell";
import type { Meta, StoryObj } from "../../../types";
import { Popover } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { Button } from "@structured-growth/sg-ui/experimental";
import { TextField } from "@structured-growth/sg-ui/experimental";
const meta = { title: "Migration proofs/Popover", component: Popover, tags: ["autodocs"],
  decorators: [(Story) => <Provider theme="dark"><Story /></Provider>],
  args: { trigger: <Button variant="outlined" tone="neutral">Edit note</Button>, title: "Course note", children: <TextField label="Note" /> },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

// Keep a draft open, then scroll this ancestor with a trackpad or the scrollbar.
export const ScrollHost: Story = {
  render: args => <div style={{ blockSize: 320, overflow: "auto", border: "1px solid var(--sgui-border)" }}>
    <div style={{ paddingBlockStart: 140, paddingInline: 24, blockSize: 760 }}>
      <Popover {...args}><TextField label="Note" autoFocus defaultValue="Unsaved course note" /></Popover>
    </div>
  </div>,
};

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
