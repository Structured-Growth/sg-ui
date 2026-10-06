import { describe, expect, it } from "vitest";
import { AppOperationSteps } from "./AppOperationSteps";

describe("AppOperationSteps", () => {
  it("renders title/subtitle and all step status variants", () => {
    const element = AppOperationSteps({
      title: "Publishing",
      subtitle: "Running deployment checks",
      steps: [
        { id: "s1", label: "Queued", status: "pending" },
        { id: "s2", label: "Deploying", status: "in_progress" },
        { id: "s3", label: "Completed", status: "completed" },
      ],
    }) as any;

    const outerStack = element.props.children;
    const [title, subtitle, stepsStack] = outerStack.props.children;
    expect(title.props.children).toBe("Publishing");
    expect(subtitle.props.children).toBe("Running deployment checks");

    const rows = stepsStack.props.children as any[];
    expect(rows).toHaveLength(3);
    const pendingRow = rows[0];
    const inProgressRow = rows[1];
    const completedRow = rows[2];

    expect(pendingRow.props.children[0].props.children).toBe("○");
    expect(pendingRow.props.children[1].props.color).toBe("text.secondary");

    expect(inProgressRow.props.children[0].props.size).toBe(14);
    expect(inProgressRow.props.children[0].props.thickness).toBe(6);
    expect(inProgressRow.props.children[1].props.color).toBe("text.primary");

    expect(completedRow.props.children[0].props.children).toBe("✓");
    expect(completedRow.props.children[0].props.color).toBe("success.main");
  });

  it("omits title and subtitle when not provided", () => {
    const element = AppOperationSteps({
      steps: [{ id: "s1", label: "Only Step", status: "pending" }],
    }) as any;

    const outerStack = element.props.children;
    const [title, subtitle] = outerStack.props.children;
    expect(title).toBeNull();
    expect(subtitle).toBeNull();
  });
});
