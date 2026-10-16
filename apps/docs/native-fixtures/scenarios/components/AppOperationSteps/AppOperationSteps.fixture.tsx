import { AppOperationStepsNativeStateFixture } from "./AppOperationStepsNativeState.fixture.fixture";
import { useState } from "react";
import { Button } from "@structured-growth/sg-ui/components";
import { AppInlineProgress } from "@structured-growth/sg-ui/components";
import { Stack } from "@structured-growth/sg-ui/experimental";
import { Status } from "@structured-growth/sg-ui/experimental";
import type { AppOperationStepStatus } from "@structured-growth/sg-ui/components";
import type { Meta, StoryObj } from "../../../types";
import { AppOperationSteps } from "@structured-growth/sg-ui/components";
import { Provider } from "@structured-growth/sg-ui/theme";
import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";

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

/** A bounded locale host for the missing V-04/V-05 progress/status evidence. */
export const LocalizedPresentation: Story = { args: { steps: [] }, render: (_args, { globals }) => {
  const rtl = globals.locale.startsWith('ar');
  const labels = rtl
    ? ['تجهيز مواد الدورة للمراجعة من قبل المدرسين ومسؤولي البرامج', 'نسخ محتوى الدروس والأنشطة إلى المسودة الجديدة', 'حفظ المستندات الداعمة قبل النشر', 'نشر الدورة للمتعلمين في المجموعة التالية']
    : ['Prepare the course materials for instructors and program administrators', 'Copy the lesson content and activities into the new draft', 'Save the supporting documents before publishing', 'Publish the course for learners in the next cohort'];
  const messages: Record<string,string> = {
    'common.ui.progress': 'التقدم', 'common.ui.operation.completed': 'اكتمل',
    'common.ui.operation.inProgress': 'قيد التنفيذ', 'common.ui.operation.pending': 'في الانتظار',
    'common.ui.operation.error': 'خطأ',
  };
  return <SGTranslationProvider value={{ locale: globals.locale, useNamespace: () => {},
    t: (key, options) => rtl && messages[key] ? messages[key] : formatIcuMessage(options.defaultMessage, globals.locale, options.values) }}>
    <Provider theme={globals.theme} density={globals.density} dir={rtl ? 'rtl' : 'ltr'} data-testid="localized-progress"
      style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <Stack gap={3}>
        <AppOperationSteps title={rtl ? 'إعداد الدورة التدريبية للمراجعة والنشر' : 'Prepare the course for review and publication'}
          subtitle={rtl ? 'راجع كل مرحلة قبل متابعة عملية نشر الدورة التدريبية.' : 'Review every milestone before continuing the course publication.'}
          steps={labels.map((label, index) => ({ id: String(index), label, status: (['completed', 'in_progress', 'pending', 'error'] as const)[index] }))} />
        <AppInlineProgress value={73} />
        <Status announcement="polite">{rtl ? 'تم حفظ مسودة الدورة والمستندات الداعمة للمراجعة قبل النشر.' : 'The course draft and supporting documents were saved for review before publication.'}</Status>
      </Stack>
    </Provider>
  </SGTranslationProvider>;
} };

function HostTransitions() {
  const [status, setStatus] = useState<AppOperationStepStatus>("pending");
  // The host owns milestones and announcements; percentage ticks remain quiet.
  const message = status === "completed" ? "Draft saved" : status === "error" ? "Draft save failed" : "";
  return <Stack gap={2}>
    <AppOperationSteps title="Saving draft" steps={[{ id: "save", label: "Save draft", status }]} />
    <AppInlineProgress value={status === "completed" ? 100 : status === "in_progress" ? 50 : 0} />
    <Status announcement="polite" tone={status === "error" ? "danger" : "neutral"}>{message}</Status>
    <Stack direction="row" gap={2}>
      <Button onPress={() => setStatus("in_progress")}>Start</Button>
      <Button onPress={() => setStatus("completed")}>Complete</Button>
      <Button onPress={() => setStatus("error")}>Fail</Button>
      <Button onPress={() => setStatus("pending")}>Reset</Button>
    </Stack>
  </Stack>;
}
export const Transitions: Story = { args: { steps: [] }, render: () => <HostTransitions /> };

/** Mutable collection, quiet percentage ticks and persistent host milestone region. */
export const NativeStateTransitions: Story = {
  args: { steps: [] },
  render: () => <AppOperationStepsNativeStateFixture />,
};
