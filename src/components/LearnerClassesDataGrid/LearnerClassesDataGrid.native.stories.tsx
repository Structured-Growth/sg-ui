import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LearnerClassesDataGrid } from "./LearnerClassesDataGrid";
import { Provider } from "../../experimental/Provider/Provider";
import { Button } from "../../experimental/Button/Button";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
import { formatIcuMessage } from "../../i18n/icu";
import type { LearnerClass } from "../../models";
import type { AppGridPaginationModel } from "../AppDataGrid/types";

const first: LearnerClass = { id: "course /?#% 日本", courseName: "Route laboratory", siteName: "Host site",
  instructorName: "Host instructor", progressPercent: 20, nextActivity: "Review", nextActivityId: "  activity /?#% 日本  ", dueAt: "invalid" };
const second: LearnerClass = { ...first, id: "fallback /?#% 日本", courseName: "Fallback laboratory", nextActivityId: "   " };
const dueAt = "2000-02-02T12:00:00.000Z";

function NativeLearnerCells() {
  const [locale, setLocale] = useState("en-US");
  const [validDate, setValidDate] = useState(false);
  const [routes, setRoutes] = useState<string[]>([]);
  const [pagination, setPagination] = useState<AppGridPaginationModel>({ page: 0, pageSize: 2 });
  const [requests, setRequests] = useState<AppGridPaginationModel[]>([]);
  const [pending, setPending] = useState<AppGridPaginationModel>();
  const rows = pagination.page === 0 ? [first, second] : [{ ...first, id: "accepted", courseName: "Accepted host course" }];
  return <SGTranslationProvider value={{ locale, useNamespace: () => {}, t: (key, options) => {
    const german: Record<string, string> = { "table.columns.name": "Kursname", "table.columns.due": "Fällig",
      "table.actions.details": "Einzelheiten", "table.actions.continue": "Fortsetzen",
      "due.unavailable": "Termin nicht verfügbar", "due.absoluteWithTime": "Fällig {date} um {time}" };
    return formatIcuMessage(locale === "de-DE" ? german[key] ?? options.defaultMessage : options.defaultMessage, locale, options.values);
  } }}><Provider><SGNavigationProvider value={{ pathname: "/host-fixture", navigate: href => setRoutes(previous => [...previous, href]) }}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onPress={() => { setLocale("de-DE"); setValidDate(true); }}>German valid dates</Button>
      <Button onPress={() => { setLocale("de-DE"); setValidDate(false); }}>German unavailable dates</Button>
      <Button onPress={() => { setLocale("en-US"); setValidDate(false); }}>English unavailable dates</Button>
      <Button disabled={!pending} onPress={() => setPending(undefined)}>Reject learner request</Button>
      <Button disabled={!pending} onPress={() => { if (pending) setPagination(pending); setPending(undefined); }}>Accept learner request</Button>
    </div>
    <output aria-label="Learner routes">{routes.length}: {routes.at(-1) ?? "none"}</output>
    <output aria-label="Learner requests">{requests.length}: {requests.at(-1)?.page ?? "none"}</output>
    <output aria-label="Learner accepted page">{pagination.page}</output>
    <div style={{ height: 430 }}><LearnerClassesDataGrid rows={rows.map(row => ({ ...row, dueAt: validDate ? dueAt : row.dueAt }))}
      label="Native learner courses" mode="server" rowCount={6} paginationModel={pagination} pageSizeOptions={[2, 4]}
      onPaginationModelChange={value => { setRequests(previous => [...previous, value]); setPending(value); }} /></div>
  </SGNavigationProvider></Provider></SGTranslationProvider>;
}

const meta = { title: "Classes/LearnerClassesDataGrid/Native cells", component: NativeLearnerCells,
  tags: ["!autodocs"] } satisfies Meta<typeof NativeLearnerCells>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HostTransitions: Story = {};
