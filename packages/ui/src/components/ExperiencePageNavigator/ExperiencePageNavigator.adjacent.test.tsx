// @vitest-environment jsdom
import {afterEach, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExperiencePageNavigator, type ExperiencePageNavigatorProps} from './ExperiencePageNavigator';
import {SGNavigationProvider} from '../../adapters/navigation';
afterEach(cleanup);
function props(): ExperiencePageNavigatorProps {
  return {pages: [{key: 'intro', title: 'Introduction'}, {key: 'practice', title: 'Practice'}], activePageKey: 'intro',
    onSelectPage: vi.fn(), onAddPage: vi.fn(), onRemovePage: vi.fn(), onRenamePage: vi.fn(), onReorderPages: vi.fn()};
}
it('keeps adjacent boundaries disabled and action requests host controlled in read-only mode', async () => {
  const user = userEvent.setup(); const p = props();
  const {rerender} = render(<ExperiencePageNavigator {...p} readOnly adjacentNavigation={{previous: null, next: {key: 'practice', label: 'Practice'}}}/>);
  expect((screen.getByRole('button', {name: 'Previous page'}) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole('button', {name: 'Next: Practice'}));
  expect(p.onSelectPage).toHaveBeenCalledExactlyOnceWith('practice');
  expect(screen.getByRole('button', {name: 'Introduction Page 1 • Active'}).getAttribute('aria-current')).toBe('page');
  rerender(<ExperiencePageNavigator {...p} activePageKey="practice" readOnly adjacentNavigation={{previous: {key: 'intro', label: 'Introduction'}, next: null}}/>);
  expect((screen.getByRole('button', {name: 'Next page'}) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole('navigation', {name: 'Page navigation'})).not.toBeNull();
});
it('preserves native href/router and modified-click ownership without duplicate selection requests', async () => {
  const user = userEvent.setup(); const p = props(); const navigate = vi.fn();
  render(<SGNavigationProvider value={{pathname: '/intro', navigate}}><ExperiencePageNavigator {...p}
    adjacentNavigation={{label: 'Course sequence', previous: null, next: {key: 'practice', label: 'Practice', href: '/practice'}}}/></SGNavigationProvider>);
  const link = screen.getByRole('link', {name: 'Next: Practice'});
  expect(link.getAttribute('href')).toBe('/practice'); expect(link.getAttribute('rel')).toBe('next');
  await user.click(link); expect(navigate).toHaveBeenCalledExactlyOnceWith('/practice', {replace: undefined});
  expect(p.onSelectPage).not.toHaveBeenCalled();
  navigate.mockClear();
  // Native modified-click remains available; host router must not consume it.
  let nativeDefaultAllowed = false;
  // Observe after React's root handler, then stop jsdom's unimplemented navigation.
  document.addEventListener('click', event => {nativeDefaultAllowed = !event.defaultPrevented; event.preventDefault();}, {once: true});
  fireEvent.click(link, {ctrlKey: true, button: 0});
  expect(nativeDefaultAllowed).toBe(true); expect(navigate).not.toHaveBeenCalled();
});
it('removes disabled href activation and stays absent unless explicitly supplied', async () => {
  const user = userEvent.setup(); const p = props();
  const {rerender} = render(<ExperiencePageNavigator {...p}/>);
  expect(screen.queryByRole('navigation')).toBeNull();
  rerender(<ExperiencePageNavigator {...p} adjacentNavigation={{previous: {key: 'intro', label: 'Introduction', href: '/intro', disabled: true}, next: null}}/>);
  expect(screen.queryByRole('link')).toBeNull();
  const previous = screen.getByRole('button', {name: 'Previous: Introduction'});
  expect((previous as HTMLButtonElement).disabled).toBe(true); await user.click(previous);
  expect(p.onSelectPage).not.toHaveBeenCalled();
});
