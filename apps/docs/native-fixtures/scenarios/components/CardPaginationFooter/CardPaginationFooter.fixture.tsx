import type { Meta, StoryObj } from "../../../types";
import { useState } from "react";
import { Box } from "@structured-growth/sg-ui/experimental";
import { AppPaginationFooter } from "@structured-growth/sg-ui/components";

const meta = {
  title: "Data Display/CardPaginationFooter",
  component: AppPaginationFooter,
  args: {
    page: 0,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100],
    totalCount: 0,
    onPageChange: () => undefined,
    onPageSizeChange: () => undefined,
  },
  decorators: [
    (Story) => (
      <Box style={{ maxWidth: 900 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof AppPaginationFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePreview() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  return (
    <AppPaginationFooter
      onPageChange={setPage}
      onPaginationModelChange={(model) => {
        setPage(model.page);
        setPageSize(model.pageSize);
      }}
      onPageSizeChange={(nextSize) => {
        setPage(0);
        setPageSize(nextSize);
      }}
      page={page}
      pageSize={pageSize}
      pageSizeOptions={[25, 50, 100]}
      totalCount={243}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractivePreview />,
};

export const UnknownTotal: Story = { args: { page: 2, totalCount: undefined, hasNextPage: true } };
export const Disabled: Story = { args: { totalCount: 243, disabled: true } };
