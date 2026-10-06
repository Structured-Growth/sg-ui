import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppOperationSteps } from "./AppOperationSteps";

const meta = {
  title: "Components/AppOperationSteps",
  component: AppOperationSteps,
} satisfies Meta<typeof AppOperationSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Preparing editor",
    subtitle: "Please wait while we create your draft session.",
    steps: [
      { id: "create", label: "Creating draft version", status: "completed" },
      { id: "copy", label: "Copying previous content", status: "in_progress" },
      { id: "load", label: "Loading editor", status: "pending" },
    ],
  },
};
