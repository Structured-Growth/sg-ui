import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppOperationSteps } from "./AppOperationSteps";
import { Provider } from "../../experimental/Provider/Provider";

const meta = {
  title: "Components/AppOperationSteps",
  component: AppOperationSteps,
  decorators: [(Story) => <Provider><Story /></Provider>],
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

export const SingleOperation: Story = { args: { steps: [{ id: "save", label: "Saving draft", status: "in_progress" }] } };
export const Completed: Story = { args: { title: "Course published", steps: [{ id: "publish", label: "Publish course", status: "completed" }] } };
