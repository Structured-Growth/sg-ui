// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppPageHeader, type AppPageHeaderProps } from "./index";
import { Provider } from "../../theme";

afterEach(cleanup);

it("isolates sibling header actions and releases the removed native ref", async () => {
  const user = userEvent.setup();
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const firstAction = vi.fn();
  const secondAction = vi.fn();
  const firstProps: AppPageHeaderProps = {
    title: "First course", hierarchy: "primary", className: "host-header",
    style: { marginBlockStart: 12 },
    moreMenuItems: [{ label: "Edit first", onClick: firstAction }],
  };
  const secondProps: AppPageHeaderProps = {
    title: "Second course", moreMenuItems: [{ label: "Edit second", onClick: secondAction }],
  };
  const view = (showFirst: boolean) => <Provider>
    {showFirst && <AppPageHeader key="first" {...firstProps} ref={firstRef} />}
    <AppPageHeader key="second" {...secondProps} ref={secondRef} />
  </Provider>;
  const { rerender, unmount } = render(view(true));
  const secondHeader = secondRef.current!;
  expect(firstRef.current?.classList.contains("host-header")).toBe(true);
  expect(firstRef.current?.style.marginBlockStart).toBe("12px");
  expect(firstRef.current?.getAttribute("data-hierarchy")).toBe("primary");
  expect(secondHeader.getAttribute("data-hierarchy")).toBe("subpage");
  await user.click(within(firstRef.current!).getByRole("button", { name: "More actions" }));
  expect(screen.queryByRole("menuitem", { name: "Edit second" })).toBeNull();
  await user.click(screen.getByRole("menuitem", { name: "Edit first" }));
  expect(firstAction).toHaveBeenCalledExactlyOnceWith();
  expect(secondAction).not.toHaveBeenCalled();
  // Removing the first keyed instance must leave the sibling's ref and commands intact.
  rerender(view(false));
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(secondHeader);
  await user.click(within(secondHeader).getByRole("button", { name: "More actions" }));
  expect(screen.queryByRole("menuitem", { name: "Edit first" })).toBeNull();
  await user.click(screen.getByRole("menuitem", { name: "Edit second" }));
  expect(secondAction).toHaveBeenCalledExactlyOnceWith();
  expect(firstAction).toHaveBeenCalledTimes(1);
  unmount();
  expect(secondRef.current).toBeNull();
  expect(screen.queryByRole("menu")).toBeNull();
});
