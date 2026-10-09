// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AddIcon } from "../../icons/AddIcon";
import type { IconProps } from "../../icons/AddIcon";

afterEach(cleanup);

it("isolates public icon updates and ref cleanup from a surviving sibling", () => {
  const changingRef = createRef<SVGSVGElement>();
  const siblingRef = createRef<SVGSVGElement>();
  const initial: IconProps = { label: "Create", size: 20, color: "red" };
  const sibling: IconProps = { label: "Sibling", size: 32, color: "blue" };
  const { rerender, unmount } = render(<>
    <AddIcon key="changing" ref={changingRef} {...initial} />
    <AddIcon key="sibling" ref={siblingRef} {...sibling} />
  </>);
  const siblingNode = screen.getByRole("img", { name: "Sibling" });

  rerender(<>
    <AddIcon key="changing" ref={changingRef} size="2em" color="green" />
    <AddIcon key="sibling" ref={siblingRef} {...sibling} />
  </>);
  expect(screen.queryByRole("img", { name: "Create" })).toBeNull();
  expect(changingRef.current?.getAttribute("aria-hidden")).toBe("true");
  expect(changingRef.current?.getAttribute("width")).toBe("2em");
  expect(changingRef.current?.getAttribute("stroke")).toBe("green");
  expect(screen.getByRole("img", { name: "Sibling" })).toBe(siblingNode);
  expect(siblingRef.current).toBe(siblingNode);
  expect(siblingNode.getAttribute("width")).toBe("32");
  expect(siblingNode.getAttribute("stroke")).toBe("blue");
  expect(siblingNode.hasAttribute("aria-hidden")).toBe(false);

  rerender(<AddIcon key="sibling" ref={siblingRef} {...sibling} />);
  expect(changingRef.current).toBeNull();
  expect(siblingRef.current).toBe(siblingNode);
  expect(screen.getByRole("img", { name: "Sibling" })).toBe(siblingNode);
  unmount();
  expect(siblingRef.current).toBeNull();
});
