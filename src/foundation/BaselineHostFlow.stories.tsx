import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../theme";
import { AppButton } from "../components/AppButton";
import { AppPageTabs } from "../components/AppPageTabs";
import { AppModal } from "../components/AppModal";
import { ClassCardFrame } from "../components/ClassCardFrame";
import { PageRichTextEditorSection } from "../components/PageRichTextEditorSection";
import { Stack, TextField, Typography } from "../experimental";

/** BASE-002: a host fixture, with local state in place of routing and persistence. */
export function BaselineHostFlow() {
  const [section, setSection] = useState("overview");
  const [open, setOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [submitted, setSubmitted] = useState(0);
  const [openedCourse, setOpenedCourse] = useState("");
  const [document, setDocument] = useState<unknown>(null);
  const [navigation, setNavigation] = useState("");

  function navigate(next: string) {
    setSection(next);
    setNavigation(next);
  }

  return <Provider>
    <Stack gap={4}>
      <Typography as="h1" variant="h4">Course workspace</Typography>
      <AppPageTabs value={section} onChange={navigate} label="Workspace sections" items={[
        { id: "overview", label: "Overview", content: <Typography>Choose Courses to create a course and edit its introduction.</Typography> },
        { id: "courses", label: "Courses", content: <Stack gap={4}>
          <AppButton onPress={() => { setDraftTitle(""); setOpen(true); }}>Create course</AppButton>
          {courseTitle ? <ClassCardFrame
            header={<Typography as="h2" variant="h5">{courseTitle}</Typography>}
            body={<Typography>Host-owned course draft</Typography>}
            footer={<AppButton onPress={() => { setOpenedCourse(courseTitle); navigate("editor"); }}>Edit introduction</AppButton>} /> :
            <Typography>No courses yet</Typography>}
        </Stack> },
        { id: "editor", label: "Introduction", disabled: !openedCourse, content: <Stack gap={4}>
          <Typography as="h2" variant="h5">{openedCourse} introduction</Typography>
          <PageRichTextEditorSection editorKey="baseline-course-introduction" lexicalValue={null}
            onLexicalChange={setDocument} aria-label="Course introduction" style={{ height: 320 }} />
        </Stack> },
      ]} />
      <output aria-label="Host navigation">{navigation || "No navigation yet"}</output>
      <output aria-label="Host course submissions">{submitted}</output>
      <output aria-label="Host opened course">{openedCourse || "No course opened"}</output>
      <pre aria-label="Host saved introduction">{JSON.stringify(document)}</pre>
    </Stack>
    <AppModal open={open} title="Create course" onClose={() => setOpen(false)}
      footerContent={<AppButton type="submit" form="baseline-create-course">Save course</AppButton>}>
      <form id="baseline-create-course" onSubmit={event => {
        event.preventDefault();
        const title = draftTitle.trim();
        if (!title) return;
        setCourseTitle(title);
        setSubmitted(count => count + 1);
        setOpen(false);
      }}>
        <TextField label="Course title" name="title" required autoFocus value={draftTitle} onValueChange={setDraftTitle} />
      </form>
    </AppModal>
  </Provider>;
}

const meta = {
  title: "Foundations/Baseline Host Flow",
  component: BaselineHostFlow,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BaselineHostFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
