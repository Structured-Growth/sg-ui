// @vitest-environment jsdom
import { createRef, useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { TextAlignMenuControl, type AlignOption, type TextAlignMenuControlProps } from "./index";
import { Provider } from "../../theme";

afterEach(cleanup);

it("isolates host values and callbacks and clears an unmounted open instance before remount", async () => {
  const user = userEvent.setup();
  const firstRef = createRef<HTMLButtonElement>();
  const secondRef = createRef<HTMLButtonElement>();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  function HostControl({ first }: { first: boolean }) {
    const [value, setValue] = useState<AlignOption>(first ? "left" : "right");
    const props: TextAlignMenuControlProps = {
      value,
      onChange: next => { (first ? firstChange : secondChange)(next); setValue(next); },
    };
    return <TextAlignMenuControl {...props} ref={first ? firstRef : secondRef} />;
  }
  const composition = (showFirst: boolean) => <Provider>
    {showFirst && <HostControl key="first" first />}
    <HostControl key="second" first={false} />
  </Provider>;
  const { rerender, unmount } = render(composition(true));
  const secondTrigger = secondRef.current!;
  await user.click(firstRef.current!);
  await user.click(screen.getByRole("menuitemradio", { name: /^Center Align/ }));
  expect(firstChange).toHaveBeenCalledExactlyOnceWith("center");
  expect(secondChange).not.toHaveBeenCalled();
  expect(firstRef.current?.getAttribute("aria-label")).toBe("Center Align");
  expect(secondTrigger.getAttribute("aria-label")).toBe("Right Align");

  await user.click(firstRef.current!);
  expect(screen.getByRole("menu")).toBeTruthy();
  rerender(composition(false));
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(secondTrigger);
  await user.click(secondTrigger);
  expect(screen.getByRole("menuitemradio", { name: /^Right Align/ }).getAttribute("aria-checked")).toBe("true");
  await user.click(screen.getByRole("menuitemradio", { name: /^End Align/ }));
  expect(secondChange).toHaveBeenCalledExactlyOnceWith("end");
  expect(firstChange).toHaveBeenCalledTimes(1);

  rerender(composition(true));
  expect(screen.queryByRole("menu")).toBeNull();
  expect(firstRef.current?.getAttribute("aria-label")).toBe("Left Align");
  expect(secondRef.current).toBe(secondTrigger);
  expect(secondTrigger.getAttribute("aria-label")).toBe("End Align");
  await user.click(firstRef.current!);
  expect(screen.getByRole("menuitemradio", { name: /^Left Align/ }).getAttribute("aria-checked")).toBe("true");
  unmount();
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
  expect(firstChange).toHaveBeenCalledTimes(1);
  expect(secondChange).toHaveBeenCalledTimes(1);
});
