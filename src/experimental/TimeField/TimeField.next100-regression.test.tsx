// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TimeField, type TimeFieldProps } from "../index";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("suppresses disabled clock edits and resumes the owned callback when enabled", async () => {
  const user = userEvent.setup();
  const change = vi.fn<NonNullable<TimeFieldProps["onValueChange"]>>();
  const ref = createRef<HTMLDivElement>();
  const view = (disabled: boolean) => <Provider><form aria-label="Clock form">
    <TimeField ref={ref} label="Clock" defaultValue="09:30:00" hourCycle={24}
      name="clock" disabled={disabled} onValueChange={change} />
  </form></Provider>;
  const { rerender } = render(view(true));
  const minute = ref.current!.querySelector('[data-type="minute"]') as HTMLElement;
  expect(minute.getAttribute("aria-disabled")).toBe("true");
  await user.click(minute);
  await user.keyboard("{ArrowUp}1");
  expect(change).not.toHaveBeenCalled();
  expect(minute.getAttribute("aria-valuenow")).toBe("30");
  const form = screen.getByRole("form", { name: "Clock form" }) as HTMLFormElement;
  expect(new FormData(form).has("clock")).toBe(false);
  rerender(view(false));
  await user.click(screen.getByRole("spinbutton", { name: /minute/ }));
  await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenCalledExactlyOnceWith("09:31:00");
  expect(new FormData(form).get("clock")).toBe("09:31:00");
});

it("isolates sibling clock drafts, reset listeners and refs across unmount and remount", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn(); const secondChange = vi.fn();
  const firstRef = createRef<HTMLDivElement>(); const secondRef = createRef<HTMLDivElement>();
  const view = (showFirst: boolean) => <Provider>
    <form aria-label="First form">{showFirst && <TimeField key="first" ref={firstRef} label="First clock"
      defaultValue="09:30:00" hourCycle={24} name="first" onValueChange={firstChange} />}</form>
    <form aria-label="Second form"><TimeField ref={secondRef} label="Second clock"
      defaultValue="12:45:00" hourCycle={24} name="second" onValueChange={secondChange} /></form>
  </Provider>;
  const { rerender } = render(view(true));
  const firstForm = screen.getByRole("form", { name: "First form" }) as HTMLFormElement;
  const secondForm = screen.getByRole("form", { name: "Second form" }) as HTMLFormElement;
  expect(firstRef.current).not.toBe(secondRef.current);
  await user.click(within(firstForm).getByRole("spinbutton", { name: /second/ }));
  await user.keyboard("{ArrowUp}");
  await user.click(within(secondForm).getByRole("spinbutton", { name: /minute/ }));
  await user.keyboard("{ArrowUp}");
  expect(firstChange).toHaveBeenCalledExactlyOnceWith("09:30:01");
  expect(secondChange).toHaveBeenCalledExactlyOnceWith("12:46:00");
  act(() => firstForm.reset());
  await waitFor(() => expect(new FormData(firstForm).get("first")).toBe("09:30:00"));
  expect(new FormData(secondForm).get("second")).toBe("12:46:00");
  rerender(view(false));
  expect(firstRef.current).toBeNull();
  act(() => firstForm.reset());
  await user.click(within(secondForm).getByRole("spinbutton", { name: /minute/ }));
  await user.keyboard("{ArrowUp}");
  expect(secondChange).toHaveBeenLastCalledWith("12:47:00");
  rerender(view(true));
  expect(firstRef.current).toBeInstanceOf(HTMLDivElement);
  expect(new FormData(firstForm).get("first")).toBe("09:30:00");
  expect(new FormData(secondForm).get("second")).toBe("12:47:00");
  act(() => secondForm.reset());
  await waitFor(() => expect(new FormData(secondForm).get("second")).toBe("12:45:00"));
  expect(firstChange).toHaveBeenCalledTimes(1);
  expect(secondChange).toHaveBeenCalledTimes(2);
});
