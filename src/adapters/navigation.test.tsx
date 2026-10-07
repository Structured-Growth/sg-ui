// @vitest-environment jsdom
import { createRef, forwardRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Link from "./Link";
import { SGNavigationProvider, usePathname, useRouter, type SGLinkProps } from "./navigation";

afterEach(cleanup);
describe("navigation ownership", () => {
  it("leaves unprovided anchor activation native and strips replace", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link href="#native" replace ref={ref} aria-label="Native course" data-host="course" />);
    const anchor = screen.getByRole("link");
    expect(ref.current).toBe(anchor);
    expect(anchor.getAttribute("data-host")).toBe("course");
    expect(anchor.hasAttribute("replace")).toBe(false);
    expect(fireEvent.click(anchor)).toBe(true);
  });
  it.each(["https://example.com/course", "//example.com/course", "mailto:host@example.com", "tel:+15550100", "data:text/plain,course"])("bypasses host router and custom Link for %s", href => {
    const navigate = vi.fn();
    const custom = vi.fn(() => <span>Unexpected router</span>);
    render(<SGNavigationProvider value={{ pathname: "/", navigate, Link: custom }}><Link href={href}>External</Link></SGNavigationProvider>);
    let intercepted: boolean | undefined;
    const observe = (event: MouseEvent) => { intercepted = event.defaultPrevented; event.preventDefault(); };
    window.addEventListener("click", observe, { once: true });
    fireEvent.click(screen.getByRole("link"));
    expect(intercepted).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(custom).not.toHaveBeenCalled();
  });
  it("forwards router attributes, replace, cancellation and anchor ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    const seen = vi.fn();
    const RouterLink = forwardRef<HTMLAnchorElement, SGLinkProps>(function RouterLink({ replace, ...props }, ref) {
      seen(replace);
      return <a {...props} ref={ref} />;
    });
    render(<SGNavigationProvider value={{ pathname: "/", navigate: vi.fn(), Link: RouterLink }}>
      <Link href="#custom" replace ref={ref} target="_self" rel="author" className="host-link" aria-current="page" data-host="custom" onClick={event => event.preventDefault()}>Custom</Link>
    </SGNavigationProvider>);
    const anchor = screen.getByRole("link");
    expect(ref.current).toBe(anchor);
    expect(seen).toHaveBeenCalledWith(true);
    for (const [key, value] of Object.entries({ href: "#custom", target: "_self", rel: "author", class: "host-link", "aria-current": "page", "data-host": "custom" })) expect(anchor.getAttribute(key)).toBe(value);
    expect(fireEvent.click(anchor)).toBe(false);
    expect(anchor.hasAttribute("replace")).toBe(false);
  });
  it("tracks host pathname replacements and forwards imperative navigation options", () => {
    function Consumer() {
      const pathname = usePathname();
      const router = useRouter();
      return <button onClick={() => router.push("/next?tab=details#title", { replace: true })}>{pathname}</button>;
    }
    const navigate = vi.fn();
    const { rerender } = render(<SGNavigationProvider value={{ pathname: "/courses", navigate }}><Consumer /></SGNavigationProvider>);
    rerender(<SGNavigationProvider value={{ pathname: "/courses/one", navigate }}><Consumer /></SGNavigationProvider>);
    fireEvent.click(screen.getByRole("button", { name: "/courses/one" }));
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/next?tab=details#title", { replace: true });
  });
});
