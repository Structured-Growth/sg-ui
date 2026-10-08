// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ButtonGroup, type ButtonGroupProps } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
import { ThemeScope } from "../../foundation/ThemeScope";

afterEach(cleanup);

it("keeps consuming groups independent through prop updates, removal and remount", async () => {
  const user = userEvent.setup();
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const firstAction = vi.fn();
  const secondAction = vi.fn();
  const firstProps: ButtonGroupProps = {
    label: "First course actions", joined: true, orientation: "vertical",
    className: "host-actions", style: { marginInlineStart: "7px" }, title: "Host group",
  };
  function Composition({ showFirst = true, joined = true, orientation = "vertical" }: {
    showFirst?: boolean; joined?: boolean; orientation?: ButtonGroupProps["orientation"];
  }) {
    return <Provider>
      {showFirst && <ThemeScope density="compact">
        <ButtonGroup {...firstProps} ref={firstRef} joined={joined} orientation={orientation}>
          <Button onPress={firstAction}>First action</Button>
        </ButtonGroup>
      </ThemeScope>}
      <ThemeScope density="comfortable">
        <ButtonGroup ref={secondRef} label="Second course actions">
          <Button onPress={secondAction}>Second action</Button>
        </ButtonGroup>
      </ThemeScope>
    </Provider>;
  }
  const view = render(<Composition />);
  const first = screen.getByRole("group", { name: firstProps.label });
  const second = screen.getByRole("group", { name: "Second course actions" });
  expect(firstRef.current).toBe(first);
  expect(secondRef.current).toBe(second);
  expect(first.classList.contains("host-actions")).toBe(true);
  expect(first.style.marginInlineStart).toBe("7px");
  expect(first.getAttribute("title")).toBe("Host group");
  expect(first.closest("[data-sgui-density]")?.getAttribute("data-sgui-density")).toBe("compact");
  expect(second.closest("[data-sgui-density]")?.getAttribute("data-sgui-density")).toBe("comfortable");
  await user.click(within(first).getByRole("button"));
  expect(firstAction).toHaveBeenCalledExactlyOnceWith();
  expect(secondAction).not.toHaveBeenCalled();

  view.rerender(<Composition joined={false} orientation="horizontal" />);
  expect(firstRef.current).toBe(first);
  expect(first.hasAttribute("data-joined")).toBe(false);
  expect(first.getAttribute("data-orientation")).toBe("horizontal");
  expect(secondRef.current).toBe(second);
  expect(second.hasAttribute("data-joined")).toBe(false);
  view.rerender(<Composition showFirst={false} />);
  expect(firstRef.current).toBeNull();
  expect(first.isConnected).toBe(false);
  expect(secondRef.current).toBe(second);
  await user.click(within(second).getByRole("button"));
  expect(secondAction).toHaveBeenCalledExactlyOnceWith();
  expect(firstAction).toHaveBeenCalledTimes(1);

  view.rerender(<Composition />);
  expect(firstRef.current).not.toBe(first);
  expect(firstRef.current?.getAttribute("data-joined")).toBe("true");
  expect(firstRef.current?.getAttribute("data-orientation")).toBe("vertical");
  expect(secondRef.current).toBe(second);
  view.unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
});
