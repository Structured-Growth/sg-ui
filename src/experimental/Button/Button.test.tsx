// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "./Button";

afterEach(cleanup);
describe("owned button proof", () => {
  it("activates once per pointer, Enter and Space interaction and forwards its native ref", async () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();
    render(<Button ref={ref} onPress={onPress}>Save</Button>);
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
    const { rerender } = render(<Button disabled onPress={onPress}>Save</Button>);
    await user.click(screen.getByRole("button"));
    rerender(<Button loading onPress={onPress}>Save</Button>);
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
    render(<form onSubmit={submit}><Button>Cancel</Button><Button type="submit">Save</Button></form>);
    await user.click(screen.getByText("Cancel"));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByText("Save"));
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("suppresses native reset while pending and restores the latest host press on completion", async () => {
    const reset = vi.fn();
    const firstPress = vi.fn();
    const latestPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();
    const form = (loading: boolean, onPress: () => void) => <form onReset={reset}>
      <input aria-label="Course title" defaultValue="Original course" />
      <Button ref={ref} type="reset" loading={loading} onPress={onPress}>Reset course</Button>
    </form>;
    const { rerender } = render(form(false, firstPress));
    const button = ref.current!;
    await user.type(screen.getByRole("textbox"), " draft");
    button.focus();
    rerender(form(true, latestPress));
    expect(ref.current).toBe(button);
    expect(document.activeElement).toBe(button);
    await user.click(button);
    await user.keyboard("{Enter} ");
    expect(reset).not.toHaveBeenCalled();
    expect(firstPress).not.toHaveBeenCalled();
    expect(latestPress).not.toHaveBeenCalled();
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Original course draft");
    rerender(form(false, latestPress));
    await user.click(button);
    expect(latestPress).toHaveBeenCalledTimes(1);
    expect(firstPress).not.toHaveBeenCalled();
    expect(reset).toHaveBeenCalledTimes(1);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Original course");
  });

});
