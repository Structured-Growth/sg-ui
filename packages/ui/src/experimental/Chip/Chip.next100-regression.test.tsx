// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Chip, type ChipProps } from "../../primitives";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

it("keeps public Chip instances independent across host updates and unmount", () => {
  const first = createRef<HTMLSpanElement>();
  const second = createRef<HTMLSpanElement>();
  const updated: ChipProps = {
    children: "Featured", tone: "primary", variant: "outlined", density: "compact",
    id: "featured-status", className: "host-status", style: { marginInlineStart: 8 },
    "aria-label": "Featured course status",
  };
  const view = render(<ThemeScope>
    <Chip ref={first}>Draft</Chip><Chip ref={second}>Reference</Chip>
  </ThemeScope>);
  const firstNode = first.current;
  const secondNode = second.current;
  view.rerender(<ThemeScope>
    <Chip ref={first} {...updated} /><Chip ref={second}>Reference</Chip>
  </ThemeScope>);
  expect(first.current).toBe(firstNode);
  expect(first.current).toBe(screen.getByText("Featured"));
  expect(first.current?.id).toBe("featured-status");
  expect(first.current?.classList.contains("host-status")).toBe(true);
  expect(first.current?.style.marginInlineStart).toBe("8px");
  expect(first.current?.getAttribute("aria-label")).toBe("Featured course status");
  expect(first.current?.getAttribute("data-variant")).toBe("outlined");
  expect(first.current?.getAttribute("data-sgui-density")).toBe("compact");
  expect(second.current).toBe(secondNode);
  expect(second.current).toBe(screen.getByText("Reference"));
  expect(second.current?.getAttribute("data-tone")).toBe("neutral");
  expect(second.current?.getAttribute("data-variant")).toBe("filled");
  expect(second.current?.getAttribute("data-sgui-density")).toBeNull();
  view.rerender(<ThemeScope><Chip ref={second}>Reference</Chip></ThemeScope>);
  expect(first.current).toBeNull();
  expect(second.current).toBe(screen.getByText("Reference"));
  view.unmount();
  expect(second.current).toBeNull();
});
