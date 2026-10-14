// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Provider, Stack, type StackProps } from "../../primitives";

afterEach(cleanup);

it("updates alignment, justification and wrapping while preserving logical host spacing", () => {
  const props: StackProps = {
    as: "nav", "aria-label": "Course actions", direction: "row", align: "baseline",
    justify: "around", gap: 0, wrap: true, responsive: true, dir: "rtl",
    style: { marginInlineStart: "12px", paddingInlineEnd: "8px" },
  };
  const { rerender } = render(<Provider><Stack {...props}>Actions</Stack></Provider>);
  const stack = screen.getByRole("navigation", { name: "Course actions" });
  expect(stack.dataset.align).toBe("baseline");
  expect(stack.dataset.justify).toBe("around");
  expect(stack.dataset.wrap).toBe("true");
  expect(stack.style.gap).toBe("0px");
  expect(stack.dir).toBe("rtl");
  expect(stack.style.marginInlineStart).toBe("12px");
  expect(stack.style.paddingInlineEnd).toBe("8px");

  rerender(<Provider><Stack {...props} direction="column" align="end" justify="evenly"
    gap={3} wrap={false} responsive={false}>Actions</Stack></Provider>);
  expect(screen.getByRole("navigation", { name: "Course actions" })).toBe(stack);
  expect(stack.dataset.direction).toBe("column");
  expect(stack.dataset.align).toBe("end");
  expect(stack.dataset.justify).toBe("evenly");
  expect(stack.hasAttribute("data-wrap")).toBe(false);
  expect(stack.hasAttribute("data-responsive")).toBe(false);
  expect(stack.style.gap).toBe("var(--sgui-space3)");
  expect(stack.style.marginInlineStart).toBe("12px");
  expect(stack.style.paddingInlineEnd).toBe("8px");
});

it("isolates sibling layout overrides and clears only the removed public ref", () => {
  const first = createRef<HTMLElement>();
  const second = createRef<HTMLElement>();
  const View = ({ showFirst }: { showFirst: boolean }) => <Provider>
    {showFirst && <Stack key="first" ref={first} aria-label="First" role="group"
      direction="row" gap={4} wrap className="host-actions" style={{ gap: "9px" }}>First</Stack>}
    <Stack key="second" ref={second} aria-label="Second" role="group">Second</Stack>
  </Provider>;
  const { rerender, unmount } = render(<View showFirst />);
  const retained = screen.getByRole("group", { name: "Second" });
  expect(first.current).toBe(screen.getByRole("group", { name: "First" }));
  expect(first.current!.classList.contains("host-actions")).toBe(true);
  expect(first.current!.style.gap).toBe("9px");
  expect(second.current).toBe(retained);
  expect(retained.dataset.direction).toBe("column");
  expect(retained.dataset.align).toBe("stretch");
  expect(retained.dataset.justify).toBe("start");
  expect(retained.style.gap).toBe("var(--sgui-space2)");
  expect(retained.hasAttribute("data-wrap")).toBe(false);
  expect(retained.classList.contains("host-actions")).toBe(false);
  rerender(<View showFirst={false} />);
  expect(first.current).toBeNull();
  expect(second.current).toBe(retained);
  expect(retained.style.gap).toBe("var(--sgui-space2)");
  unmount();
  expect(second.current).toBeNull();
});
