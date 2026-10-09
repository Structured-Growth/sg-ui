// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { InstructorClassCard, type InstructorClassCardProps } from "./index";
import { SGNavigationProvider } from "../../adapters/navigation";
import { ThemeScope } from "../../theme";

afterEach(cleanup);

const card: InstructorClassCardProps = {
  className: "Course A", siteName: "Institution A", status: "active", learnerCount: 2,
  lastLearnerActivityLabel: "Yesterday", actionLabel: "Host action A", actionHref: "/courses/a",
};

it("preserves complete long host presentation strings in the named card regions", () => {
  const long = {
    className: "Advanced course with a complete host title " + "Learning".repeat(40),
    siteName: "Host institution " + "Campus".repeat(40),
    lastLearnerActivityLabel: "Host activity " + "Yesterday".repeat(40),
    actionLabel: "Host destination " + "Continue".repeat(40),
  };
  render(<ThemeScope><InstructorClassCard {...card} {...long} /></ThemeScope>);
  expect(screen.getByRole("heading", { name: long.className }).textContent).toBe(long.className);
  expect(screen.getByText(long.siteName).textContent).toBe(long.siteName);
  expect(screen.getByText(`Last Learner Activity: ${long.lastLearnerActivityLabel}`).textContent)
    .toBe(`Last Learner Activity: ${long.lastLearnerActivityLabel}`);
  expect(screen.getByRole("link", { name: long.actionLabel }).textContent).toBe(long.actionLabel);
  // Actual wrapping/containment requires the separately owned native layout gate.
});

it("keeps sibling host routes isolated through updates, removal and remount", async () => {
  const firstNavigate = vi.fn();
  const secondNavigate = vi.fn();
  const user = userEvent.setup();
  function Composition({ showFirst = true, secondHref = "/courses/b" }) {
    return <ThemeScope>
      {showFirst && <section aria-label="First card">
        <SGNavigationProvider value={{ pathname: "/", navigate: firstNavigate }}>
          <InstructorClassCard {...card} />
        </SGNavigationProvider>
      </section>}
      <section aria-label="Second card">
        <SGNavigationProvider value={{ pathname: "/", navigate: secondNavigate }}>
          <InstructorClassCard {...card} className="Course B" status="draft" learnerCount={0}
            actionLabel="Host action B" actionHref={secondHref} />
        </SGNavigationProvider>
      </section>
    </ThemeScope>;
  }
  const view = render(<Composition />);
  const first = within(screen.getByRole("region", { name: "First card" }));
  const second = within(screen.getByRole("region", { name: "Second card" }));
  expect(first.getByText("Active")).toBeDefined();
  expect(second.getByText("Draft")).toBeDefined();
  expect(second.getByText("0 Learners")).toBeDefined();
  await user.click(first.getByRole("link", { name: "Host action A" }));
  expect(firstNavigate).toHaveBeenCalledExactlyOnceWith("/courses/a", { replace: undefined });
  expect(secondNavigate).not.toHaveBeenCalled();
  view.rerender(<Composition showFirst={false} secondHref="/courses/b-updated" />);
  expect(screen.queryByRole("region", { name: "First card" })).toBeNull();
  await user.click(screen.getByRole("link", { name: "Host action B" }));
  expect(secondNavigate).toHaveBeenCalledExactlyOnceWith("/courses/b-updated", { replace: undefined });
  view.rerender(<Composition secondHref="/courses/b-updated" />);
  await user.click(screen.getByRole("link", { name: "Host action A" }));
  expect(firstNavigate).toHaveBeenCalledTimes(2);
  expect(firstNavigate).toHaveBeenLastCalledWith("/courses/a", { replace: undefined });
  expect(secondNavigate).toHaveBeenCalledTimes(1);
});
