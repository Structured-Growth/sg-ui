import { useState } from "react";
import { AppButton } from "../AppButton/AppButton";
import { AppInlineProgress } from "../AppInlineProgress/AppInlineProgress";
import { Stack } from "../../experimental/Stack/Stack";
import { Status } from "../../experimental/Status/Status";
import { Typography } from "../../experimental/Typography/Typography";
import { AppOperationSteps, type AppOperationStepStatus } from "./AppOperationSteps";

/** Story/test host: collection shape, work state and milestones belong to the host. */
export function AppOperationStepsNativeStateFixture() {
  const [shape, setShape] = useState<"empty" | "single" | "multiple">("multiple");
  const [status, setStatus] = useState<AppOperationStepStatus>("pending");
  const [value, setValue] = useState(0);
  const [calls, setCalls] = useState(0);
  const labels = ["Prepare the course materials for the learner review session", "Save the reviewed course content and supporting documents", "Publish the course for the next learner cohort"];
  const steps = (shape === "empty" ? [] : labels.slice(0, shape === "single" ? 1 : 3)).map((label, index) => ({
    id: String(index), label, status: status === "in_progress" && index !== 0 ? "pending" as const : status,
  }));
  const request = (next: AppOperationStepStatus) => {
    setCalls(count => count + 1);
    setStatus(next);
    setValue(next === "completed" ? 100 : 0);
  };
  const message = status === "completed" ? "Course operation completed" : status === "error" ? "Course operation failed; review the materials and retry" : "";
  return <Stack gap={3} data-testid="native-state-host">
    <AppOperationSteps title="Course publication preparation" subtitle="The host can replace the collection while work and milestone messages change." steps={steps} />
    <AppInlineProgress value={value} barWidth="50%" />
    <Status announcement="polite" tone={status === "error" ? "danger" : "neutral"}>{message}</Status>
    <Typography as="p" variant="body2" data-testid="host-callbacks">Host requests: {calls}</Typography>
    <Stack direction="row" wrap gap={2}>
      <AppButton onPress={() => request("in_progress")}>Start operation</AppButton>
      <AppButton onPress={() => { setCalls(count => count + 1); setValue(current => Math.min(100, current + 25)); }}>Advance progress</AppButton>
      <AppButton onPress={() => request("completed")}>Complete operation</AppButton>
      <AppButton onPress={() => request("error")}>Fail operation</AppButton>
      <AppButton onPress={() => request("pending")}>Reset operation</AppButton>
      <AppButton onPress={() => { setCalls(count => count + 1); setShape("empty"); }}>Show empty</AppButton>
      <AppButton onPress={() => { setCalls(count => count + 1); setShape("single"); }}>Show single</AppButton>
      <AppButton onPress={() => { setCalls(count => count + 1); setShape("multiple"); }}>Show multiple</AppButton>
    </Stack>
  </Stack>;
}
