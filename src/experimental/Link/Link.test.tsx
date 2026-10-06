// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Link } from "./Link";
import { SGNavigationProvider } from "../../adapters/navigation";
afterEach(cleanup);
it("routes internal links through the host with native refs and modified-click/cancellation preserved", () => {
 const navigate = vi.fn(); const ref = createRef<HTMLAnchorElement>(); const { rerender } = render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link ref={ref} href="/courses" replace>Courses</Link></SGNavigationProvider>);
 const anchor = screen.getByRole('link'); expect(ref.current).toBe(anchor); fireEvent.click(anchor); expect(navigate).toHaveBeenCalledExactlyOnceWith('/courses', { replace: true });
 navigate.mockClear(); fireEvent.click(anchor, { ctrlKey: true }); expect(navigate).not.toHaveBeenCalled();
 rerender(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="/courses" onClick={e => e.preventDefault()}>Courses</Link></SGNavigationProvider>); fireEvent.click(screen.getByRole('link')); expect(navigate).not.toHaveBeenCalled();
});
it("uses native external links and preserves rel values while protecting new tabs", () => {
 const navigate = vi.fn(); render(<SGNavigationProvider value={{ pathname: "/", navigate, Link: () => <span>Custom router</span> }}><Link href="https://example.com" target="_blank" rel="author">Reference</Link></SGNavigationProvider>);
 const anchor = screen.getByRole('link'); expect(anchor.getAttribute('href')).toBe('https://example.com'); expect(anchor.getAttribute('rel')).toBe('author noopener noreferrer'); fireEvent.click(anchor); expect(navigate).not.toHaveBeenCalled();
});
it("supports custom host router components for internal URLs", () => {
 render(<SGNavigationProvider value={{ pathname: "/", navigate: vi.fn(), Link: props => <a {...props} data-host="router" /> }}><Link href="/courses">Courses</Link></SGNavigationProvider>);
 expect(screen.getByRole('link').getAttribute('data-host')).toBe('router');
});
