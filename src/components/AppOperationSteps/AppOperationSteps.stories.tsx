import { AppOperationStepsNativeStateFixture } from "./AppOperationStepsNativeState.stories.fixture";
import { useState } from "react";
import { AppButton } from "../AppButton/AppButton";
import { AppInlineProgress } from "../AppInlineProgress/AppInlineProgress";
import { Stack } from "../../experimental/Stack/Stack";
import { Status } from "../../experimental/Status/Status";
import type { AppOperationStepStatus } from "./AppOperationSteps";
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

export const AllStates: Story = {
  args: { title: "Publishing course", steps: [
    { id: "queued", label: "Queued", status: "pending" },
    { id: "upload", label: "Uploading", status: "in_progress" },
    { id: "saved", label: "Saved", status: "completed" },
    { id: "failed", label: "Upload failed", status: "error" },
  ] },
};

function HostTransitions() {
  const [status, setStatus] = useState<AppOperationStepStatus>("pending");
  // The host owns milestones and announcements; percentage ticks remain quiet.
  const message = status === "completed" ? "Draft saved" : status === "error" ? "Draft save failed" : "";
  return <Stack gap={2}>
    <AppOperationSteps title="Saving draft" steps={[{ id: "save", label: "Save draft", status }]} />
    <AppInlineProgress value={status === "completed" ? 100 : status === "in_progress" ? 50 : 0} />
    <Status announcement="polite" tone={status === "error" ? "danger" : "neutral"}>{message}</Status>
    <Stack direction="row" gap={2}>
      <AppButton onPress={() => setStatus("in_progress")}>Start</AppButton>
      <AppButton onPress={() => setStatus("completed")}>Complete</AppButton>
      <AppButton onPress={() => setStatus("error")}>Fail</AppButton>
      <AppButton onPress={() => setStatus("pending")}>Reset</AppButton>
    </Stack>
  </Stack>;
}
export const Transitions: Story = { args: { steps: [] }, render: () => <HostTransitions /> };

/** Mutable collection, quiet percentage ticks and persistent host milestone region. */
export const NativeStateTransitions: Story = {
  args: { steps: [] },
  render: () => <AppOperationStepsNativeStateFixture />,
};
