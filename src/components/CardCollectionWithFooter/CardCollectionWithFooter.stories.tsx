import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppButton } from "../AppButton/AppButton";
import { TextField } from "../../experimental/TextField/TextField";
import { Card } from "../../experimental/Card/Card";
import { Typography } from "../../experimental/Typography/Typography";
import { LearnerClassCard } from "../LearnerClassCard/LearnerClassCard";
import { CardCollectionWithFooter } from "./CardCollectionWithFooter";
const rows = Array.from({ length: 12 }, (_, i) => ({ id: String(i), label: `Course ${i + 1}` }));
const meta = {
  title: "Data Display/CardCollectionWithFooter", component: CardCollectionWithFooter,
  args: { rows, getRowId: row => (row as typeof rows[number]).id, page: 0, pageSize: 4, pageSizeOptions: [4, 8],
    onPageChange: () => {}, onPageSizeChange: () => {},
    renderCard: row => <Card><Typography variant="h6">{(row as typeof rows[number]).label}</Typography></Card> },
  decorators: [Story => <div style={{ height: 420, display: "flex" }}><Story /></div>], tags: ["autodocs"],
} satisfies Meta<typeof CardCollectionWithFooter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = { render: args => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  return <CardCollectionWithFooter {...args} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />;
} };
export const Empty: Story = { args: { rows: [] } };
export const Loading: Story = { args: { loading: true } };
export const LongText: Story = { args: { rows: [{ id: "long", label: "Averylongunbrokencoursename".repeat(8) }] } };

export const CourseCards: Story = { args: { renderCard: row => <LearnerClassCard courseName={(row as typeof rows[number]).label} instructorName="Course author" progressPercent={40} nextActivity="Read the introduction" dueAt="2026-10-10" referenceNow={new Date("2026-10-06T12:00:00Z")} /> } };

/** M-11: one host owns rows and pagination; requests can be deliberately withheld. */
export const NativeCollection: Story = {
  parameters: { docs: { description: { story: "Resize the host and enlarge browser text in both densities. Native Tab between card notes must reveal the complete control; oversized pagination remains reachable through the collection scrollport. Comfortable density also reserves focus space when its control height exceeds the text metrics." } } },
  render: args => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [accept, setAccept] = useState(false);
  const [requests, setRequests] = useState<string[]>([]);
  const [state, setState] = useState<"ready" | "loading" | "empty">("ready");
  const [reversed, setReversed] = useState(false);
  return <div style={{ width: "100%", minWidth: 0 }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <AppButton onPress={() => setAccept(value => !value)}>{accept ? "Reject requests" : "Accept requests"}</AppButton>
      <AppButton onPress={() => setReversed(value => !value)}>Reverse cards</AppButton>
      <AppButton onPress={() => setState("loading")}>Show loading</AppButton>
      <AppButton onPress={() => setState("empty")}>Show empty</AppButton>
      <AppButton onPress={() => setState("ready")}>Show ready</AppButton>
    </div>
    <output aria-label="Pagination requests">{requests.join(" | ") || "None"}</output>
    <output aria-label="Host pagination">{`page:${page},size:${pageSize}`}</output>
    <div data-testid="collection-container" style={{ width: "100%", height: 420, display: "flex" }}>
      <CardCollectionWithFooter {...args} rows={state === "empty" ? [] : reversed ? [...rows].reverse() : rows}
        loading={state === "loading"} page={page} pageSize={pageSize}
        pageSizeOptions={[4, 8]} paginationLabel="Course collection pages"
        onPageChange={next => {
          setRequests(value => [...value, `page:${next}`]);
          if (accept) setPage(next);
        }} onPageSizeChange={next => {
          setRequests(value => [...value, `size:${next}`]);
          if (accept) setPageSize(next);
        }} renderCard={row => <Card style={{ minHeight: 160 }}>
          <Typography variant="h6">{(row as typeof rows[number]).label}</Typography>
          <TextField label={`Note for ${(row as typeof rows[number]).label}`} defaultValue="Host draft" />
        </Card>} />
    </div>
  </div>;
} };
