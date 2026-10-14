// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Avatar, type AvatarProps } from "./Avatar";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("preserves public native props and owned sizes across image states in a scoped composition", () => {
  const ref = createRef<HTMLSpanElement>();
  const props: AvatarProps = {
    alt: "Course instructor", src: "/instructor.png", fallback: <span>CI</span>,
    id: "instructor-avatar", className: "host-avatar", style: { marginInlineStart: "8px" },
    shape: "square", size: "small",
  };
  const view = render(<Provider><Avatar {...props} ref={ref} /></Provider>);
  const root = screen.getByRole("img", { name: props.alt });
  for (const size of ["small", "medium", "large"] as const) {
    view.rerender(<Provider><Avatar {...props} size={size} src={`/${size}.png`} ref={ref} /></Provider>);
    expect(ref.current).toBe(root);
    expect(root.id).toBe(props.id);
    expect(root.classList.contains("host-avatar")).toBe(true);
    expect(root.style.marginInlineStart).toBe("8px");
    expect(root.getAttribute("data-size")).toBe(size);
    expect(root.getAttribute("data-shape")).toBe("square");
    const image = root.querySelector("img")!;
    expect(image.getAttribute("src")).toBe(`/${size}.png`);
    fireEvent.load(image);
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-size")).toBe(size);
    fireEvent.error(image);
    expect(ref.current).toBe(root);
    expect(root.getAttribute("data-size")).toBe(size);
  }
  view.unmount();
  expect(ref.current).toBeNull();
});

it("isolates image state and resets a remounted instance without disturbing its sibling", () => {
  function Pair({ showFirst = true }: { showFirst?: boolean }) {
    return <Provider>
      {showFirst && <Avatar alt="First instructor" src="/shared.png" fallback="First" />}
      <Avatar alt="Second instructor" src="/shared.png" fallback="Second" />
    </Provider>;
  }
  const view = render(<Pair />);
  const first = screen.getByRole("img", { name: "First instructor" });
  const second = screen.getByRole("img", { name: "Second instructor" });
  const secondImage = second.querySelector("img")!;
  fireEvent.load(secondImage);
  fireEvent.error(first.querySelector("img")!);
  expect(first.querySelector("img")).toBeNull();
  expect(within(first).getByText("First")).toBeTruthy();
  expect(secondImage.hasAttribute("data-loaded")).toBe(true);
  view.rerender(<Pair showFirst={false} />);
  expect(screen.queryByRole("img", { name: "First instructor" })).toBeNull();
  expect(second.querySelector("img")).toBe(secondImage);
  view.rerender(<Pair />);
  const remounted = screen.getByRole("img", { name: "First instructor" });
  expect(remounted).not.toBe(first);
  expect(remounted.querySelector("img")?.hasAttribute("data-loaded")).toBe(false);
  expect(second.querySelector("img")).toBe(secondImage);
  expect(secondImage.hasAttribute("data-loaded")).toBe(true);
});
