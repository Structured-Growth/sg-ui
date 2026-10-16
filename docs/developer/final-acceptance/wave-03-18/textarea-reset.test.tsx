// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { TextArea } from '../../../../packages/ui/src/experimental/TextArea/TextArea';
afterEach(cleanup);
it('preserves native displayed validation when ancestor cancels reset, then clears on accepted reset', async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const view = (prevent: boolean) => <div onReset={event => { if (prevent) event.preventDefault(); }}>
    <form onSubmit={event => event.preventDefault()}><TextArea label="Required summary" name="summary" required defaultValue="Initial" onValueChange={change} />
      <button type="submit">Validate</button><button type="reset">Reset</button></form></div>;
  const { rerender, container } = render(view(true));
  const input = screen.getByRole('textbox', {name:'Required summary'});
  await user.clear(input); await user.click(screen.getByRole('button', {name:'Validate'}));
  expect(input.getAttribute('aria-invalid')).toBe('true');
  const before = input.getAttribute('aria-describedby'); expect(before).toBeTruthy();
  change.mockClear(); await user.click(screen.getByRole('button', {name:'Reset'}));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('aria-describedby')).toBeTruthy();
  expect(input).toHaveProperty('value',''); expect(change).not.toHaveBeenCalled();
  rerender(view(false)); await user.click(screen.getByRole('button', {name:'Reset'}));
  await vi.waitFor(() => expect(input).toHaveProperty('value','Initial'));
  expect(input.getAttribute('aria-invalid')).not.toBe('true');
  expect(new FormData(container.querySelector('form')!).get('summary')).toBe('Initial');
  expect(change).not.toHaveBeenCalled();
});
it('follows a replacement external form with the same id and retains latest defaults and controlled authority', async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const view = (generation: number, latest: string) => <>
    <form key={generation} id="summary-owner"><button type="reset">Reset owner</button></form>
    <TextArea label="Draft" form="summary-owner" name="draft" defaultValue={latest} onValueChange={change} />
    <TextArea label="Host" form="summary-owner" name="host" value="Host value" onValueChange={change} /></>;
  const {rerender, container} = render(view(0,'Initial'));
  const draft = screen.getByRole('textbox',{name:'Draft'}); const old = container.querySelector('form')!;
  await user.clear(draft); await user.type(draft,'Edited');
  rerender(view(1,'Latest')); change.mockClear();
  old.reset(); await new Promise(resolve => setTimeout(resolve,20)); expect(draft).toHaveProperty('value','Edited');
  await user.click(screen.getByRole('button',{name:'Reset owner'}));
  await vi.waitFor(() => expect(draft).toHaveProperty('value','Latest'));
  expect(new FormData(container.querySelector('form')!).get('host')).toBe('Host value');
  expect(change).not.toHaveBeenCalled();
});
