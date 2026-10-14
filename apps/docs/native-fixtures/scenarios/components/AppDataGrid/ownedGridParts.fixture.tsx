import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Provider } from "@structured-growth/sg-ui/theme";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from "@structured-growth/sg-ui/experimental";
import { OwnedGridHeaderSortMenu, OwnedGridRowSubHeader, OwnedGridStatus } from "@sgui-test-internals/components/AppDataGrid/ownedGridParts";

function PartsExample() {
  const [direction, setDirection] = useState<"asc" | "desc">();
  const [expanded, setExpanded] = useState(true);
  const [status, setStatus] = useState<"refreshing" | "error">("refreshing");
  const [edited, setEdited] = useState(false);
  return <>
    <p>Internal owned grid parts. Sorting requests the canonical direction; rows remain mounted while refresh or error is announced.</p>
    <Table><TableCaption>Course grid parts</TableCaption><TableHead><TableRow>
      <TableHeaderCell aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}>
        <OwnedGridHeaderSortMenu label="Course" sortDirection={direction} onSortSelect={setDirection} />
      </TableHeaderCell><TableHeaderCell>Actions</TableHeaderCell>
    </TableRow></TableHead><TableBody>
      <TableRow><TableCell colSpan={2}><OwnedGridRowSubHeader title={edited ? "Updated section" : "First section"} expanded={expanded}
        onToggle={() => setExpanded(value => !value)} onTitleDoubleClick={() => setEdited(true)} trailingContent={<Button density="compact">Add course</Button>} /></TableCell></TableRow>
      {expanded && <TableRow><TableCell>Accessible learning</TableCell><TableCell><Button density="compact">Course actions</Button></TableCell></TableRow>}
    </TableBody></Table>
    <OwnedGridStatus state={status} onRetry={() => setStatus("refreshing")} />
    <Button variant="outlined" tone="neutral" onPress={() => setStatus("error")}>Simulate host error</Button>
  </>;
}

const meta = { title: "Migration proofs/Catalog grid parts", decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = { render: () => <PartsExample /> };
export const EmptyStates: Story = { render: () => <><OwnedGridStatus state="loading" /><OwnedGridStatus state="empty" /><OwnedGridStatus state="noResults" /><OwnedGridStatus state="error" /></> };
