// @vitest-environment jsdom
import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import {render, screen} from "@testing-library/react";
import {it, expect} from "vitest";
import {AnswerFeedback} from "./AnswerFeedback";
it("announces host-supplied explanation without relying on color", () => {
  render(<AnswerFeedback title="Try again" tone="negative">Ask for clarification.</AnswerFeedback>);
  expect(screen.getByRole("status").textContent).toContain("Try again"); expect(screen.getByText("Ask for clarification.")).toBeTruthy();
});

afterEach(cleanup);
