import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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
