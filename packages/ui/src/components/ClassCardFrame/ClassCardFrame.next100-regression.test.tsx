// @vitest-environment jsdom
import { cleanup, render, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../../theme";
import { ClassCardFrame, type ClassCardFrameProps } from "./index";

afterEach(cleanup);

it("isolates sibling frame slots and host styles through replacement and unmount", () => {
  const first: ClassCardFrameProps = {
    header: "First header", body: "First body", footer: "First footer", width: 500,
    headerStyle: { padding: 7 }, bodyClassName: "first-body", footerClassName: "first-footer",
  };
  const second: ClassCardFrameProps = {
    header: "Second header", body: "Second body", footer: "Second footer", width: 360,
    headerClassName: "second-header", bodyStyle: { padding: 12 }, footerStyle: { padding: 9 },
  };
  const composition = (props: ClassCardFrameProps | null) => <Provider>
    {props && <ClassCardFrame key="first" {...props} />}
    <ClassCardFrame key="second" {...second} />
  </Provider>;
  const { container, rerender, unmount } = render(composition(first));
  const [firstFrame, secondFrame] = within(container).getAllByRole("article");
  expect(firstFrame.getAttribute("data-variant")).toBe("outlined");
  expect(firstFrame.getAttribute("data-tone")).toBe("default");
  expect(within(firstFrame).getByText("First header").style.padding).toBe("7px");
  expect(within(firstFrame).getByText("First body").classList.contains("first-body")).toBe(true);
  expect(within(firstFrame).getByText("First footer").classList.contains("first-footer")).toBe(true);
  expect(within(secondFrame).getByText("Second header").classList.contains("second-header")).toBe(true);
  expect(within(secondFrame).getByText("Second body").style.padding).toBe("12px");
  expect(within(secondFrame).getByText("Second footer").style.padding).toBe("9px");

  rerender(composition({ header: "Replacement", body: "New body" }));
  expect(within(container).getAllByRole("article")).toEqual([firstFrame, secondFrame]);
  expect(firstFrame.style.maxInlineSize).toBe("420px");
  expect(within(firstFrame).queryByText("First footer")).toBeNull();
  expect(within(firstFrame).getByText("Replacement").style.padding).toBe("");
  expect(within(firstFrame).getByText("New body").classList.contains("first-body")).toBe(false);
  expect(secondFrame.style.maxInlineSize).toBe("360px");
  expect(within(secondFrame).getByText("Second footer").style.padding).toBe("9px");

  rerender(composition(null));
  expect(within(container).getByRole("article")).toBe(secondFrame);
  expect(within(secondFrame).getByText("Second body").style.padding).toBe("12px");
  unmount();
  expect(container.childElementCount).toBe(0);
});
