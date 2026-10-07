import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDataGrid } from "./AppDataGrid";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";

type Course = { id: string; name: string };
type Replacement = "dataset" | "identity" | null;
const initialRows = (prefix: string): Course[] => Array.from({ length: 5 }, (_, index) => ({
  id: `course-${index + 1}`, name: `${prefix} Course ${index + 1}`,
}));
const sourceRows = initialRows("Source");
const otherRows = initialRows("Other");
const originalIdentity = (row: Course) => row.id;
// Deliberately equal ID values with a different function identity.
const replacementIdentity = (row: Course) => row.id;
const columns = [{ field: "name", headerName: "Course", flex: 1, minWidth: 240 }];

/** Host replacement is driven by entering the strip during an actual native drag.
 * No timer, synthetic drag dispatch or focus repair is supplied by this fixture.
 * Both grids deliberately share row IDs to exercise collection isolation.
 */
export function PointerReorderInvalidationFixture() {
  const [rows, setRows] = useState(sourceRows);
  const [replacement, armReplacement] = useState<Replacement>(null);
  const [identityChanged, setIdentityChanged] = useState(false);
  const [revision, setRevision] = useState(0);
  const [sourceRequests, setSourceRequests] = useState(0);
  const [otherRequests, setOtherRequests] = useState(0);
  const [lastReplacement, setLastReplacement] = useState("none");
  return <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", gap: 8 }}>
      <Button onPress={() => armReplacement("dataset")}>Arm dataset replacement</Button>
      <Button onPress={() => armReplacement("identity")}>Arm identity replacement</Button>
    </div>
    <div role="region" aria-label="Host replacement strip" style={{ minHeight: 48, padding: 8 }}
      onDragEnter={() => {
        if (!replacement) return;
        if (replacement === "dataset") setRows(current => current.map(row => ({ ...row })));
        else setIdentityChanged(current => !current);
        setLastReplacement(replacement);
        setRevision(current => current + 1);
        armReplacement(null);
      }}>
      Enter this strip while dragging to apply the armed host replacement.
    </div>
    <p role="status" aria-label="Replacement state">Revision {revision}; last {lastReplacement}; armed {replacement ?? "none"}</p>
    <p role="status" aria-label="Source requests">Source requests: {sourceRequests}</p>
    <p role="status" aria-label="Other requests">Other requests: {otherRequests}</p>
    <div role="region" aria-label="Source grid" style={{ height: 480 }}>
      <AppDataGrid rows={rows} columns={columns} label="Source courses" getRowLabel={row => row.name}
        getRowId={identityChanged ? replacementIdentity : originalIdentity}
        defaultPaginationModel={{ page: 0, pageSize: 10 }} pageSizeOptions={[10]}
        rowDrag={{ onReorder: () => setSourceRequests(current => current + 1) }} />
    </div>
    <div role="region" aria-label="Other grid" style={{ height: 480 }}>
      <AppDataGrid rows={otherRows} columns={columns} label="Other courses" getRowLabel={row => row.name}
        getRowId={originalIdentity} defaultPaginationModel={{ page: 0, pageSize: 10 }} pageSizeOptions={[10]}
        rowDrag={{ onReorder: () => setOtherRequests(current => current + 1) }} />
    </div>
  </div>;
}

const meta = {
  title: "Data/AppDataGrid/Pointer invalidation",
  component: PointerReorderInvalidationFixture,
  decorators: [Story => <Provider><Story /></Provider>],
} satisfies Meta<typeof PointerReorderInvalidationFixture>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HostReplacementAndCrossGrid: Story = {};
