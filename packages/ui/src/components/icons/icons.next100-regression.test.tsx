// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as icons from "../../icons";
import { AddIcon, type IconProps } from "../../icons/AddIcon";

afterEach(cleanup);

it("isolates native icon props and refs through host updates and unmount", () => {
  const firstRef = createRef<SVGSVGElement>();
  const secondRef = createRef<SVGSVGElement>();
  const props: IconProps = { size: "2em", color: "rebeccapurple", label: "First", style: { opacity: 0.4 } };
  const { rerender, unmount } = render(<><AddIcon {...props} ref={firstRef} /><AddIcon label="Second" ref={secondRef} /></>);
  const first = screen.getByRole("img", { name: "First" });
  const second = screen.getByRole("img", { name: "Second" });
  expect(firstRef.current).toBe(first);
  expect(secondRef.current).toBe(second);
  expect(first.getAttribute("width")).toBe("2em");
  expect(first.getAttribute("height")).toBe("2em");
  expect(first.getAttribute("stroke")).toBe("rebeccapurple");
  expect(first.style.opacity).toBe("0.4");
  expect(second.getAttribute("width")).toBe("1em");
  expect(second.getAttribute("stroke")).toBe("currentColor");
  rerender(<><AddIcon size={30} color="tomato" ref={firstRef} /><AddIcon label="Second" ref={secondRef} /></>);
  expect(firstRef.current).toBe(first);
  expect(first.getAttribute("stroke")).toBe("tomato");
  expect(first.getAttribute("width")).toBe("30");
  expect(first.getAttribute("aria-hidden")).toBe("true");
  expect(first.hasAttribute("aria-label")).toBe(false);
  expect(first.style.opacity).toBe("");
  expect(screen.getAllByRole("img")).toEqual([second]);
  expect(secondRef.current).toBe(second);
  expect(second.getAttribute("stroke")).toBe("currentColor");
  unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
});

it("resolves every individual public icon module to its catalog export on repeated imports", async () => {
  const names = Object.keys(icons).filter(name => /^[A-Z].*Icon$/.test(name)).sort();
  for (const name of names) {
    const first = await import(`../../icons/${name}.tsx`);
    const second = await import(`../../icons/${name}.tsx`);
    expect(first[name]).toBe(icons[name as keyof typeof icons]);
    expect(second[name]).toBe(first[name]);
  }
});
