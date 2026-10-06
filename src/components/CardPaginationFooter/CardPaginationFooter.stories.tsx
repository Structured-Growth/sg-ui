import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import { AppPaginationFooter } from "./CardPaginationFooter";

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
      <Box sx={{ width: 900 }}>
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
