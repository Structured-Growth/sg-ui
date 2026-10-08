// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Box, type BoxProps } from "../../components/primitives";

afterEach(cleanup);

it("isolates public Box props and refs through host updates, removal and remount", () => {
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const firstProps: BoxProps = { as: "section", padding: 4, container: true, "aria-label": "First" };
  function Composition({ showFirst = true, updated = false }) {
    return <>
      {showFirst && <Box {...firstProps} ref={firstRef} className={updated ? "updated" : "original"}
        style={updated ? { padding: "12px", maxWidth: "30rem" } : { maxWidth: "60rem" }}>First content</Box>}
      <Box as="aside" aria-label="Second" padding={1} ref={secondRef}>Second content</Box>
    </>;
  }
  const view = render(<Composition />);
  const first = screen.getByRole("region", { name: "First" });
  const second = screen.getByRole("complementary", { name: "Second" });
  expect(firstRef.current).toBe(first);
  expect(secondRef.current).toBe(second);
  expect(first.style.padding).toBe("var(--sgui-space4)");
  expect(first.hasAttribute("data-container")).toBe(true);
  expect(second.style.padding).toBe("var(--sgui-space1)");
  expect(second.hasAttribute("data-container")).toBe(false);

  view.rerender(<Composition updated />);
  expect(firstRef.current).toBe(first);
  expect(first.style.padding).toBe("12px");
  expect(first.style.maxWidth).toBe("30rem");
  expect(first.classList.contains("updated")).toBe(true);
  expect(first.classList.contains("original")).toBe(false);
  expect(secondRef.current).toBe(second);
  expect(second.style.padding).toBe("var(--sgui-space1)");

  view.rerender(<Composition showFirst={false} />);
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(second);
  expect(screen.queryByRole("region", { name: "First" })).toBeNull();
  view.rerender(<Composition />);
  expect(firstRef.current).not.toBe(first);
  expect(firstRef.current?.style.padding).toBe("var(--sgui-space4)");
  expect(firstRef.current?.classList.contains("original")).toBe(true);
  expect(secondRef.current).toBe(second);
  view.unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
});
