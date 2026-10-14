// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { ColumnsLayoutModal, type ColumnsLayoutModalProps } from "./index";

afterEach(cleanup);

it("isolates sibling drafts through teardown and accepts live host defaults and callbacks", async () => {
  const user = userEvent.setup();
  const firstSubmit = vi.fn();
  const secondSubmit = vi.fn();
  const replacementSubmit = vi.fn();
  const first: ColumnsLayoutModalProps = {
    open: true, defaultPreset: "twoEqual", onClose: vi.fn(), onSubmit: firstSubmit,
  };
  const second: ColumnsLayoutModalProps = {
    open: false, defaultPreset: "two2575", onClose: vi.fn(), onSubmit: secondSubmit,
  };
  function Host({ showFirst = true, firstOpen = true, secondProps = second }: {
    showFirst?: boolean; firstOpen?: boolean; secondProps?: ColumnsLayoutModalProps;
  }) {
    return <Provider>
      {showFirst && <ColumnsLayoutModal key="first" {...first} open={firstOpen} />}
      <ColumnsLayoutModal key="second" {...secondProps} />
    </Provider>;
  }
  const { rerender } = render(<Host />);
  await user.click(screen.getByRole("radio", { name: "4 columns (equal width)" }));
  rerender(<Host firstOpen={false} secondProps={{ ...second, open: true }} />);
  expect((screen.getByRole("radio", { name: "2 columns (25% - 75%)" }) as HTMLInputElement).checked).toBe(true);
  await user.click(screen.getByRole("radio", { name: "3 columns (equal width)" }));
  rerender(<Host showFirst={false} secondProps={{ ...second, open: true }} />);
  expect((screen.getByRole("radio", { name: "3 columns (equal width)" }) as HTMLInputElement).checked).toBe(true);
  expect(firstSubmit).not.toHaveBeenCalled();
  expect(secondSubmit).not.toHaveBeenCalled();
  rerender(<Host showFirst={false} secondProps={{
    ...second, open: true, defaultPreset: "fourEqual", onSubmit: replacementSubmit,
  }} />);
  expect((screen.getByRole("radio", { name: "4 columns (equal width)" }) as HTMLInputElement).checked).toBe(true);
  await user.click(screen.getByRole("button", { name: "Insert" }));
  expect(replacementSubmit).toHaveBeenCalledExactlyOnceWith("fourEqual");
  expect(firstSubmit).not.toHaveBeenCalled();
  expect(secondSubmit).not.toHaveBeenCalled();
});
