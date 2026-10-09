// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Surface, type SurfaceProps } from "./Surface";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("keeps public native styling and variant updates local to each Surface lifetime", () => {
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const onClick = vi.fn();
  const hostProps = {
    as: "section",
    "aria-label": "Course details",
    className: "host-surface",
    style: { padding: "13px", marginTop: "7px" },
    padding: 4,
    onClick,
  } satisfies SurfaceProps;
  const composition = (variant?: SurfaceProps["variant"], tone?: SurfaceProps["tone"]) => (
    <Provider>
      <Surface {...hostProps} ref={firstRef} variant={variant} tone={tone}>Details</Surface>
      <Surface as="aside" aria-label="Summary" ref={secondRef} tone="subtle" variant="raised">Summary</Surface>
    </Provider>
  );
  const view = render(composition());
  const first = screen.getByRole("region", { name: "Course details" });
  const second = screen.getByRole("complementary", { name: "Summary" });
  expect(firstRef.current).toBe(first);
  expect(secondRef.current).toBe(second);
  expect(first.classList.contains("host-surface")).toBe(true);
  expect(first.style.padding).toBe("13px");
  expect(first.style.marginTop).toBe("7px");
  expect(first.dataset.tone).toBe("default");
  expect(first.dataset.variant).toBe("flat");
  fireEvent.click(first);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick.mock.calls[0][0].target).toBe(first);
  for (const variant of ["outlined", "raised"] as const) {
    view.rerender(composition(variant, "subtle"));
    expect(firstRef.current).toBe(first);
    expect(first.dataset.variant).toBe(variant);
    expect(first.dataset.tone).toBe("subtle");
    expect(first.hasAttribute("variant")).toBe(false);
    expect(first.hasAttribute("tone")).toBe(false);
    expect(secondRef.current).toBe(second);
    expect(second.dataset.variant).toBe("raised");
    expect(second.dataset.tone).toBe("subtle");
  }
  view.rerender(composition());
  expect(first.dataset.variant).toBe("flat");
  expect(first.dataset.tone).toBe("default");
  view.unmount();
  expect(firstRef.current).toBe(null);
  expect(secondRef.current).toBe(null);
});
