// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppModal, type AppModalProps } from "./index";
import { AppButton } from "../AppButton";
import { Provider } from "../../theme";

afterEach(cleanup);

it("keeps secondary pending actions and close/reopen callbacks local to each host-controlled modal", async () => {
  const firstAction = vi.fn();
  const secondAction = vi.fn();
  const firstClose = vi.fn();
  const secondClose = vi.fn();
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  function Fixture() {
    const [firstOpen, setFirstOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const firstProps: AppModalProps = {
      open: firstOpen, title: "First settings", showCloseButton: true,
      onClose: reason => { firstClose(reason); setFirstOpen(false); },
      secondaryAction: { label: "Run first action", loading: pending, onPress: firstAction },
      children: <AppButton onPress={() => setPending(value => !value)}>Toggle pending</AppButton>,
    };
    return <Provider>
      <AppButton onPress={() => setFirstOpen(true)}>Open first</AppButton>
      <AppButton onPress={() => setSecondOpen(true)}>Open second</AppButton>
      <AppModal {...firstProps} ref={firstRef} />
      <AppModal ref={secondRef} open={secondOpen} title="Second settings" showCloseButton
        onClose={reason => { secondClose(reason); setSecondOpen(false); }}
        primaryAction={{ label: "Run second action", onPress: secondAction }}>Second content</AppModal>
    </Provider>;
  }
  const user = userEvent.setup();
  const view = render(<Fixture />);
  await user.click(screen.getByRole("button", { name: "Open first" }));
  expect(firstRef.current).toBe(screen.getByRole("dialog", { name: "First settings" }));
  expect(secondRef.current).toBeNull();
  await user.click(screen.getByRole("button", { name: "Run first action" }));
  expect(firstAction).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Toggle pending" }));
  await user.click(screen.getByRole("button", { name: "Run first action" }));
  expect(firstAction).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Close", exact: true }));
  expect(firstClose.mock.calls).toEqual([["close-button"]]);
  expect(firstRef.current).toBeNull();
  await user.click(screen.getByRole("button", { name: "Open second" }));
  expect(secondRef.current).toBe(screen.getByRole("dialog", { name: "Second settings" }));
  await user.click(screen.getByRole("button", { name: "Run second action" }));
  expect(secondAction).toHaveBeenCalledTimes(1);
  expect(secondClose).not.toHaveBeenCalled();
  expect(firstAction).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Close", exact: true }));
  expect(secondClose.mock.calls).toEqual([["close-button"]]);
  await user.click(screen.getByRole("button", { name: "Open first" }));
  await user.click(screen.getByRole("button", { name: "Run first action" }));
  expect(firstAction).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Toggle pending" }));
  await user.click(screen.getByRole("button", { name: "Run first action" }));
  expect(firstAction).toHaveBeenCalledTimes(2);
  expect(secondAction).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(firstClose.mock.calls).toEqual([["close-button"]]);
  expect(secondClose.mock.calls).toEqual([["close-button"]]);
});
