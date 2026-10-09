// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Provider } from "../Provider/Provider";
import { Status, type StatusProps } from "./Status";

afterEach(cleanup);

it("keeps public status props and refs independent through updates and removal", () => {
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const firstProps = {
    id: "save-result",
    className: "host-status",
    style: { marginTop: 12 },
    tone: "danger",
    announcement: "assertive",
    children: <strong>Save failed</strong>,
  } satisfies StatusProps;
  const { rerender, unmount } = render(
    <Provider>
      <Status key="first" {...firstProps} ref={firstRef} />
      <Status key="second" ref={secondRef}>Other course ready</Status>
    </Provider>,
  );
  const first = screen.getByRole("alert");
  const second = screen.getByText("Other course ready");
  expect(firstRef.current).toBe(first);
  expect(first.id).toBe("save-result");
  expect(first.classList.contains("host-status")).toBe(true);
  expect(first.style.marginTop).toBe("12px");
  expect(first.getAttribute("data-tone")).toBe("danger");
  expect(first.querySelector("strong")?.textContent).toBe("Save failed");
  expect(secondRef.current).toBe(second);
  expect(second.getAttribute("data-tone")).toBe("neutral");
  expect(second.getAttribute("aria-live")).toBe("off");
  expect(second.hasAttribute("role")).toBe(false);
  expect(second.hasAttribute("aria-atomic")).toBe(false);

  rerender(
    <Provider>
      <Status key="first" ref={firstRef}>Save recovered</Status>
      <Status key="second" ref={secondRef}>Other course ready</Status>
    </Provider>,
  );
  expect(firstRef.current).toBe(first);
  expect(first.textContent).toBe("Save recovered");
  expect(first.getAttribute("data-tone")).toBe("neutral");
  expect(first.getAttribute("aria-live")).toBe("off");
  expect(first.hasAttribute("role")).toBe(false);
  expect(first.hasAttribute("aria-atomic")).toBe(false);
  expect(first.hasAttribute("id")).toBe(false);
  expect(first.classList.contains("host-status")).toBe(false);
  expect(first.style.marginTop).toBe("");
  expect(secondRef.current).toBe(second);
  expect(second.textContent).toBe("Other course ready");

  rerender(<Provider><Status key="second" ref={secondRef}>Other course ready</Status></Provider>);
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(second);
  expect(second.getAttribute("aria-live")).toBe("off");
  unmount();
  expect(secondRef.current).toBeNull();
});
