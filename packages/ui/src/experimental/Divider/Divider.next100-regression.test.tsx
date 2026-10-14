// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Divider, type DividerProps } from "./Divider";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("keeps public Divider instances independent through orientation changes and remounts", () => {
  const semanticRef = createRef<HTMLElement>();
  const decorativeRef = createRef<HTMLElement>();
  const hostProps = {
    "aria-label": "Course sections",
    className: "host-divider",
    style: { marginBlock: 8 },
  } satisfies DividerProps;
  const composition = (orientation?: DividerProps["orientation"], showSemantic = true) => (
    <Provider>
      <section aria-label="Course layout">
        {showSemantic && <Divider key="semantic" {...hostProps} orientation={orientation} ref={semanticRef} />}
        <Divider key="decorative" decorative orientation="vertical" ref={decorativeRef} data-testid="decoration" />
      </section>
    </Provider>
  );
  const { rerender, unmount } = render(composition());
  const semantic = screen.getByRole("separator", { name: "Course sections" });
  const decoration = screen.getByTestId("decoration");
  expect(semanticRef.current).toBe(semantic);
  expect(semantic.tagName).toBe("HR");
  expect(semantic.getAttribute("aria-orientation")).toBe("horizontal");
  expect(semantic.getAttribute("data-orientation")).toBe("horizontal");
  expect(semantic.classList.contains("host-divider")).toBe(true);
  expect(semantic.style.marginBlock).toBe("8px");
  expect(decorativeRef.current).toBe(decoration);

  rerender(composition("vertical"));
  expect(semanticRef.current).toBe(semantic);
  expect(semantic.getAttribute("aria-orientation")).toBe("vertical");
  expect(semantic.getAttribute("data-orientation")).toBe("vertical");
  expect(decorativeRef.current).toBe(decoration);
  expect(decoration.getAttribute("role")).toBe("presentation");
  expect(decoration.getAttribute("aria-orientation")).toBeNull();

  rerender(composition(undefined, false));
  expect(semanticRef.current).toBeNull();
  expect(screen.queryByRole("separator")).toBeNull();
  expect(decorativeRef.current).toBe(decoration);
  rerender(composition());
  expect(semanticRef.current).not.toBe(semantic);
  expect(screen.getByRole("separator", { name: "Course sections" }).getAttribute("aria-orientation")).toBe("horizontal");
  expect(decorativeRef.current).toBe(decoration);
  unmount();
  expect(semanticRef.current).toBeNull();
  expect(decorativeRef.current).toBeNull();
});
