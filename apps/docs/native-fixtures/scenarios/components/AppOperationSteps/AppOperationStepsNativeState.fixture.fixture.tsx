import { useState } from "react";
import { Button } from "@structured-growth/sg-ui/components";
import { AppInlineProgress } from "@structured-growth/sg-ui/components";
import { Stack } from "@structured-growth/sg-ui/experimental";
import { Status } from "@structured-growth/sg-ui/experimental";
import { Typography } from "@structured-growth/sg-ui/experimental";
import { AppOperationSteps, type AppOperationStepStatus } from "@structured-growth/sg-ui/components";

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
      <Button onPress={() => request("in_progress")}>Start operation</Button>
      <Button onPress={() => { setCalls(count => count + 1); setValue(current => Math.min(100, current + 25)); }}>Advance progress</Button>
      <Button onPress={() => request("completed")}>Complete operation</Button>
      <Button onPress={() => request("error")}>Fail operation</Button>
      <Button onPress={() => request("pending")}>Reset operation</Button>
      <Button onPress={() => { setCalls(count => count + 1); setShape("empty"); }}>Show empty</Button>
      <Button onPress={() => { setCalls(count => count + 1); setShape("single"); }}>Show single</Button>
      <Button onPress={() => { setCalls(count => count + 1); setShape("multiple"); }}>Show multiple</Button>
    </Stack>
  </Stack>;
}
