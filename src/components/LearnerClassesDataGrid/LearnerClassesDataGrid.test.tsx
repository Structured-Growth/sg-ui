// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { SGTranslationProvider, type SGTranslationAdapter } from "../../i18n";
import { formatIcuMessage } from "../../i18n/icu";
import type { LearnerClass } from "../../models";
import { LearnerClassesDataGrid } from "./LearnerClassesDataGrid";

afterEach(cleanup);
const rows: LearnerClass[] = Array.from({ length: 6 }, (_, index) => ({
  id: `c${index + 1}`, courseName: `Course ${index + 1}`, siteName: "Main", instructorName: "Instructor",
  progressPercent: 10, nextActivity: "Read", nextActivityId: index === 0 ? "activity / 1" : undefined,
  dueAt: "invalid-date",
}));

describe("LearnerClassesDataGrid owned behavior", () => {
  it("updates translated headers and locale-sensitive due dates when the host adapter changes", () => {
    const dueAt = "2000-02-02T12:00:00.000Z";
    const course = { ...rows[0]!, dueAt };
    function view(locale: string, heading: string) {
      return <Provider><SGTranslationProvider value={{ locale, useNamespace: () => {},
        t: (key, options) => key === "table.columns.name" ? heading : formatIcuMessage(options.defaultMessage, locale, options.values) }}>
        <LearnerClassesDataGrid rows={[course]} />
      </SGTranslationProvider></Provider>;
    }
    const date = (locale: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(dueAt));
    const { rerender } = render(view("en-US", "Course name"));
    expect(screen.getByText(new RegExp(`Due ${date("en-US")}`))).toBeTruthy();
    rerender(view("de-DE", "Kursname"));
    expect(screen.getByRole("columnheader", { name: /Kursname/ })).toBeTruthy();
    expect(screen.getByText(text => text.startsWith(`Due ${date("de-DE")} at `))).toBeTruthy();
    expect(screen.queryByRole("columnheader", { name: /Course name/ })).toBeNull();
  });

  it("renders translated public cells and real menus with safe launch links", async () => {
    const useNamespace = vi.fn(); const t: SGTranslationAdapter["t"] = vi.fn((key, options) =>
      key === "table.columns.name" ? "Course name" : formatIcuMessage(options.defaultMessage, "en-US", options.values));
    render(<Provider><SGTranslationProvider value={{ locale: "en-US", t, useNamespace }}>
      <LearnerClassesDataGrid rows={rows.slice(0, 1)} />
    </SGTranslationProvider></Provider>);
    expect(useNamespace).toHaveBeenCalledWith("sections.learner");
    expect(screen.getByRole("grid", { name: "Courses" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /Course name/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Course 1" }).getAttribute("href")).toBe("/sections/c1/learner/me");
    expect(screen.getByText("Due date unavailable")).toBeTruthy();
    expect(t).toHaveBeenCalledWith("due.unavailable", expect.objectContaining({ namespace: "sections.learner", defaultMessage: "Due date unavailable" }));
    await userEvent.click(screen.getByRole("button", { name: "Actions for Course 1" }));
    expect(screen.getByRole("menuitem", { name: "Details" }).getAttribute("href")).toBe("/sections/c1/learner/me");
    const launch = screen.getByRole("menuitem", { name: "Continue" });
    expect(launch.getAttribute("href")).toBe("/content-library/activities/activity%20%2F%201/launch");
    expect(launch.getAttribute("target")).toBe("_blank");
    expect(launch.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("keeps server rows visible and requests controlled pagination without changing the host page", async () => {
    const onPaginationModelChange = vi.fn();
    render(<Provider><LearnerClassesDataGrid rows={rows.slice(0, 1)} mode="server"
      label="Assigned courses" getRowLabel={row => `Assigned ${row.courseName}`}
      paginationModel={{ page: 2, pageSize: 50 }} onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[25, 50]} rowCount={300} searchValue="absent"
      sortRules={[{ field: "courseName", direction: "asc" }]} /></Provider>);
    expect(screen.getByRole("grid", { name: "Assigned courses" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Actions for Assigned Course 1" })).toBeTruthy();
    expect(screen.getByText("Course 1")).toBeTruthy();
    expect((screen.getByRole("combobox", { name: "Rows per page" }) as HTMLSelectElement).value).toBe("50");
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 3, pageSize: 50 });
    expect(screen.getByText("Course 1")).toBeTruthy();
  });

  it("processes client pages and requests sort with page zero before the criterion", async () => {
    const events: string[] = []; const onSortRulesChange = vi.fn(() => events.push("sort"));
    const onPaginationModelChange = vi.fn(() => events.push("page"));
    render(<Provider><LearnerClassesDataGrid rows={rows} defaultPaginationModel={{ page: 1, pageSize: 5 }}
      pageSizeOptions={[5, 10]} onPaginationModelChange={onPaginationModelChange} onSortRulesChange={onSortRulesChange} /></Provider>);
    expect(screen.queryByText("Course 1")).toBeNull(); expect(screen.getByText("Course 6")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Sort Name" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Sort Ascending" }));
    expect(events).toEqual(["page", "sort"]);
    expect(onPaginationModelChange).toHaveBeenCalledExactlyOnceWith({ page: 0, pageSize: 5 });
    expect(onSortRulesChange).toHaveBeenCalledExactlyOnceWith([{ field: "courseName", direction: "asc" }]);
    await waitFor(() => expect(screen.getByText("Course 1")).toBeTruthy());
    expect(screen.queryByText("Course 6")).toBeNull();
  });
});
