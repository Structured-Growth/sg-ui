import { describe, expect, it, vi } from "vitest";
import { LearnerClassCard } from "./LearnerClassCard";

const useNamespace = vi.fn();
const mocks = vi.hoisted(() => ({
  formatDueDateLabel: vi.fn(() => "Due tomorrow"),
}));

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    locale: "en-US",
    useNamespace,
    t: (_key: string, { defaultMessage, values }: { defaultMessage: string; values?: Record<string, string | number> }) => {
      if (!values) {
        return defaultMessage;
      }
      return Object.entries(values).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), defaultMessage);
    },
  }),
}));

vi.mock("./formatDueDateLabel", () => ({
  formatDueDateLabel: mocks.formatDueDateLabel,
}));

describe("LearnerClassCard", () => {
  it("maps props into class-card sections and uses translation namespace", () => {
    const onContinue = vi.fn();
    const element = LearnerClassCard({
      courseName: "Potions",
      instructorName: "Snape",
      progressPercent: 65,
      nextActivity: "Lab",
      dueAt: "2026-03-01T00:00:00.000Z",
      detailsHref: "/sections/1/learner/me",
      continueHref: "/sections/1",
      onContinue,
    }) as any;

    expect(useNamespace).toHaveBeenCalledWith("sections.learner");
    expect(mocks.formatDueDateLabel).toHaveBeenCalled();
    expect(element.props.header).toBeTruthy();
    expect(element.props.body).toBeTruthy();
    expect(element.props.footer).toBeTruthy();
    const [detailsButton] = element.props.footer.props.children as any[];
    expect(detailsButton.props.href).toBe("/sections/1/learner/me");
  });

  it("uses button components when continueHref is not provided", () => {
    const onContinue = vi.fn();
    const element = LearnerClassCard({
      courseName: "Transfiguration",
      instructorName: "McGonagall",
      progressPercent: 10,
      nextActivity: "Reading",
      dueAt: "2026-03-05T00:00:00.000Z",
      onContinue,
    }) as any;

    const footer = element.props.footer;
    const [detailsButton, continueButton] = footer.props.children as any[];
    expect(detailsButton.props.component).toBe("button");
    expect(continueButton.props.component).toBe("button");
    continueButton.props.onClick?.();
    expect(onContinue).toHaveBeenCalled();
  });
});
