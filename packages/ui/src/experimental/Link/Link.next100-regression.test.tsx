// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Link, type LinkProps } from "./Link";
import { SGNavigationProvider } from "../../adapters/navigation";

afterEach(cleanup);

it("preserves the owned Link native fallback, download attributes and ref without a host provider", () => {
  const ref = createRef<HTMLAnchorElement>();
  const props: LinkProps = {
    href: "#download", replace: true, download: "course.txt", target: "course-window",
    rel: "author", className: "host-link", style: { marginInlineStart: 4 },
    "aria-label": "Course download",
  };
  const { unmount } = render(<Link {...props} ref={ref}>Download</Link>);
  const anchor = screen.getByRole("link", { name: "Course download" });
  expect(ref.current).toBe(anchor);
  for (const [key, value] of Object.entries({ href: "#download", download: "course.txt", target: "course-window", rel: "author" })) {
    expect(anchor.getAttribute(key)).toBe(value);
  }
  expect(anchor.classList.contains("host-link")).toBe(true);
  expect(anchor.style.marginInlineStart).toBe("4px");
  expect(anchor.hasAttribute("replace")).toBe(false);
  expect(fireEvent.click(anchor)).toBe(true);
  unmount();
  expect(ref.current).toBeNull();
});

it("isolates sibling Link hosts and uses the current callback after rerender and remount", () => {
  const first = vi.fn();
  const next = vi.fn();
  const second = vi.fn();
  const ref = createRef<HTMLAnchorElement>();
  function Composition({ navigate, showFirst = true }: { navigate: typeof first; showFirst?: boolean }) {
    return <>
      {showFirst && <SGNavigationProvider value={{ pathname: "/", navigate }}>
        <Link ref={ref} href="#first" replace>First course</Link>
      </SGNavigationProvider>}
      <SGNavigationProvider value={{ pathname: "/", navigate: second }}>
        <Link href="#second">Second course</Link>
      </SGNavigationProvider>
    </>;
  }
  const { rerender, unmount } = render(<Composition navigate={first} />);
  fireEvent.click(screen.getByRole("link", { name: "First course" }));
  expect(first).toHaveBeenCalledExactlyOnceWith("#first", { replace: true });
  expect(second).not.toHaveBeenCalled();
  first.mockClear();
  rerender(<Composition navigate={next} />);
  fireEvent.click(screen.getByRole("link", { name: "First course" }));
  expect(next).toHaveBeenCalledExactlyOnceWith("#first", { replace: true });
  expect(first).not.toHaveBeenCalled();
  rerender(<Composition navigate={next} showFirst={false} />);
  expect(ref.current).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Second course" }));
  expect(second).toHaveBeenCalledExactlyOnceWith("#second", { replace: undefined });
  expect(next).toHaveBeenCalledTimes(1);
  rerender(<Composition navigate={first} />);
  expect(ref.current).toBe(screen.getByRole("link", { name: "First course" }));
  fireEvent.click(ref.current!);
  expect(first).toHaveBeenCalledExactlyOnceWith("#first", { replace: true });
  unmount();
  expect(ref.current).toBeNull();
});
