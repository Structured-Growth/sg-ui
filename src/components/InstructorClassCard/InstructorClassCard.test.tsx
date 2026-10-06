import { describe, expect, it, vi } from "vitest";
import { InstructorClassCard } from "./InstructorClassCard";

const useNamespace = vi.fn();

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    useNamespace,
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}));

describe("InstructorClassCard", () => {
  const collectText = (node: any, seen = new Set<any>()): string[] => {
    if (node === null || node === undefined) {
      return [];
    }
    if (typeof node === "string" || typeof node === "number") {
      return [String(node)];
    }
    if (typeof node !== "object") {
      return [];
    }
    if (seen.has(node)) {
      return [];
    }
    seen.add(node);

    if (Array.isArray(node)) {
      return node.flatMap((item) => collectText(item, seen));
    }

    return collectText(node.props?.children, seen);
  };
  it("renders active card metadata and action mapping", () => {
    const element = InstructorClassCard({
      className: "Defense",
      siteName: "Hogwarts",
      status: "active",
      learnerCount: 30,
      lastLearnerActivityLabel: "Recent activity",
      actionLabel: "Open Class",
      actionHref: "/sections/1",
    }) as any;

    expect(useNamespace).toHaveBeenCalledWith("sections.instructor");
    expect(element.props.header).toBeTruthy();
    expect(element.props.body).toBeTruthy();
    expect(element.props.footer).toBeTruthy();
  });

  it("renders archived branch without learner activity block", () => {
    const element = InstructorClassCard({
      className: "Archived Defense",
      siteName: "Hogwarts",
      status: "archived",
      learnerCount: 0,
      lastLearnerActivityLabel: "No recent activity",
      actionLabel: "View Class",
      actionHref: "/sections/2",
    }) as any;

    expect(element.props.body).toBeTruthy();
  });

  it("maps alternate and passthrough labels", () => {
    const setup = InstructorClassCard({
      className: "Transfiguration",
      siteName: "Hogwarts",
      status: "draft",
      learnerCount: 2,
      lastLearnerActivityLabel: "No recent activity",
      actionLabel: "Set Up Section",
      actionHref: "/sections/3",
    }) as any;
    expect(setup.props.footer.props.children).toBe("Set Up Section");
    expect(collectText(setup.props.body).join(" ")).toContain("No recent activity");

    const passthrough = InstructorClassCard({
      className: "Potions",
      siteName: "Hogwarts",
      status: "closed",
      learnerCount: 4,
      lastLearnerActivityLabel: "Yesterday 9:00 AM",
      actionLabel: "Continue",
      actionHref: "/sections/4",
    }) as any;
    expect(passthrough.props.footer.props.children).toBe("Continue");
    expect(collectText(passthrough.props.body).join(" ")).toContain("Yesterday 9:00 AM");
  });
});
