// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { InstructorClassCard } from "./InstructorClassCard";
import { formatIcuMessage, SGTranslationProvider, type SGTranslationOptions } from "../../i18n";

afterEach(cleanup);
const args = { className: "Course", siteName: "Campus", status: "active" as const,
  learnerCount: 2, actionLabel: "Open course", actionHref: "/course" };

it("preserves literal placeholder and replacement syntax in host activity values, including fallback SSR", () => {
  const label = "Draft {value} $& $$ $` $' <review>";
  const expected = `Last Learner Activity: ${label}`;
  const view = render(<InstructorClassCard {...args} lastLearnerActivityLabel={label} />);
  expect(screen.getByText(expected).textContent).toBe(expected);
  expect(view.container.querySelector("review")).toBeNull();
  const markup = renderToStaticMarkup(<InstructorClassCard {...args} lastLearnerActivityLabel={label} />);
  const host = document.createElement("div");
  host.innerHTML = markup;
  expect(host.textContent).toContain(expected);
});

it("renders host-formatted translations once without substituting their literal placeholders", () => {
  const label = "Host {value} $&";
  const t = vi.fn((key: string, options: SGTranslationOptions) => {
    if (key === "card.learnersCount") return "Literal {count}: 2 learners";
    if (key === "card.lastLearnerActivity.label") return `Literal {value}: ${options.values?.value}`;
    return formatIcuMessage(options.defaultMessage, "en-US", options.values);
  });
  render(<SGTranslationProvider value={{ locale: "en-US", t, useNamespace: () => {} }}>
    <InstructorClassCard {...args} lastLearnerActivityLabel={label} />
  </SGTranslationProvider>);
  expect(screen.getByText("Literal {count}: 2 learners").textContent).toBe("Literal {count}: 2 learners");
  expect(screen.getByText(`Literal {value}: ${label}`).textContent).toBe(`Literal {value}: ${label}`);
  expect(t).toHaveBeenCalledWith("card.lastLearnerActivity.label", expect.objectContaining({
    namespace: "sections.instructor", values: { value: label },
  }));
});
