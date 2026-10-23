import type { Meta, StoryObj } from "../../types";
import { Button } from "@structured-growth/sg-ui/components";
import { AppPaginationFooter } from "@structured-growth/sg-ui/components";
import { usePersistentPaginationModel } from "@structured-growth/sg-ui/hooks";

function PaginationExample({ storage }: { storage?: "session" }) {
  const [model, setModel] = usePersistentPaginationModel("sgui-story-pagination", { page: 0, pageSize: 10 }, {
    storage, pageSizeOptions: [10, 75, 250], version: 1,
  });
  return <div>
    <AppPaginationFooter page={model.page} pageSize={model.pageSize} totalCount={1000}
      pageSizeOptions={[10, 75, 250]}
      onPaginationModelChange={setModel} />
    <Button variant="text" onPress={() => setModel({ page: 0, pageSize: 10 })}>Reset pagination</Button>
  </div>;
}
const meta = { title: "Hooks/Pagination state", component: PaginationExample } satisfies Meta<typeof PaginationExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const MemoryOnly: Story = {};
export const SessionPersistence: Story = { args: { storage: "session" } };
