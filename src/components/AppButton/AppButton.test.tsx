// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { AppButton } from "./AppButton";

afterEach(cleanup);
describe("AppButton owned action", () => {
  it("activates once per pointer, Enter and Space interaction and forwards its native ref", async () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();
    render(<AppButton ref={ref} onPress={onPress}>Save</AppButton>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(ref.current).toBe(button);
    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(3);
    expect(button.getAttribute("type")).toBe("button");
  });
  it("blocks activation while disabled or pending and keeps a pending control focusable", async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<AppButton disabled onPress={onPress}>Save</AppButton>);
    await user.click(screen.getByRole("button"));
    rerender(<AppButton loading onPress={onPress}>Save</AppButton>);
    const button = screen.getByRole("button");
    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard("{Enter} ");
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe("Pending");
  });
  it("participates in a native form only when given submit type", async () => {
    const submit = vi.fn(event => event.preventDefault());
    const user = userEvent.setup();
    render(<form onSubmit={submit}><AppButton>Cancel</AppButton><AppButton type="submit">Save</AppButton></form>);
    await user.click(screen.getByText("Cancel"));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByText("Save"));
    expect(submit).toHaveBeenCalledTimes(1);
  });
});

import { renderToString } from "react-dom/server";
it("renders owned variants, native attributes and decorative slots on the server", () => {
  const html = renderToString(<AppButton variant="outlined" tone="neutral" density="compact" name="action" value="save" startIcon={<span>icon</span>}>Save</AppButton>);
  expect(html).toContain('data-variant="outlined"');
  expect(html).toContain('data-tone="neutral"');
  expect(html).toContain('data-sgui-density="compact"');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain('name="action"');
});
