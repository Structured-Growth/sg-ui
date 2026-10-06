// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";
import { SGNavigationProvider } from "../../adapters/navigation";
afterEach(cleanup);
it("renders a named navigation list with the final page current and host links for ancestors", () => {
 const navigate = vi.fn(); render(<SGNavigationProvider value={{ pathname: '/courses/1', navigate }}><Breadcrumbs items={[{ id: 'home', label: 'Home', href: '/' }, { id: 'courses', label: 'Courses', href: '/courses' }, { id: 'course', label: 'Algebra', href: '/courses/1' }]} /></SGNavigationProvider>);
 expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeDefined(); expect(screen.getAllByRole('listitem')).toHaveLength(3); expect(screen.getAllByRole('link')).toHaveLength(2); expect(screen.getByText('Algebra').getAttribute('aria-current')).toBe('page');
 fireEvent.click(screen.getByRole('link', { name: 'Courses' })); expect(navigate).toHaveBeenCalledWith('/courses', { replace: undefined });
});
it("keeps separate breadcrumb names and supports a single current page", () => {
 render(<><Breadcrumbs label="Primary hierarchy" items={[{ id: 'one', label: 'Course' }]} /><Breadcrumbs label="Secondary hierarchy" items={[]} /></>);
 expect(screen.getByRole('navigation', { name: 'Primary hierarchy' })).toBeDefined(); expect(screen.getByRole('navigation', { name: 'Secondary hierarchy' })).toBeDefined(); expect(screen.queryByRole('link')).toBeNull();
});
