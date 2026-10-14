// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppPageTabs, type AppPageTabsProps } from "./index";
import { Provider } from "../../theme";

afterEach(cleanup);

it("forwards the public native ref and styling, releasing only the removed instance", async () => {
  const user = userEvent.setup();
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const props: AppPageTabsProps = {
    value: "details",
    items: [
      { id: "details", label: "Details", content: "Details content" },
      { id: "access", label: "Access", content: "Access content" },
    ],
    activation: "manual",
    density: "compact",
    className: "host-sections",
    style: { maxInlineSize: 320 },
  };
  const composition = (showFirst: boolean) => <Provider>
    {showFirst && <AppPageTabs key="first" {...props} ref={firstRef} label="First sections" onChange={firstChange} />}
    <AppPageTabs key="second" {...props} ref={secondRef} label="Second sections" onChange={secondChange} />
  </Provider>;
  const { rerender, unmount } = render(composition(true));
  const firstRoot = firstRef.current!;
  const secondRoot = secondRef.current!;
  expect(firstRoot).toBeInstanceOf(HTMLDivElement);
  expect(firstRoot.contains(screen.getByRole("tablist", { name: "First sections" }))).toBe(true);
  expect(firstRoot.classList.contains("host-sections")).toBe(true);
  expect(firstRoot.style.maxInlineSize).toBe("320px");
  expect(firstRoot.getAttribute("data-sgui-density")).toBe("compact");

  rerender(composition(false));
  expect(firstRef.current).toBeNull();
  expect(firstRoot.isConnected).toBe(false);
  expect(secondRef.current).toBe(secondRoot);
  const sibling = screen.getByRole("tablist", { name: "Second sections" });
  await user.click(within(sibling).getByRole("tab", { name: "Details" }));
  secondChange.mockClear();
  await user.keyboard("{ArrowRight}{Enter}");
  expect(secondChange).toHaveBeenCalledExactlyOnceWith("access");
  expect(firstChange).not.toHaveBeenCalled();
  expect(screen.getByRole("tabpanel").textContent).toBe("Details content");
  unmount();
  expect(secondRef.current).toBeNull();
});
