// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { InsertContentMenuControl, type InsertContentMenuControlProps } from "./index";

afterEach(cleanup);

it("exposes the native trigger ref and styling to a typed consuming host", async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLButtonElement>();
  const insert = vi.fn();
  const props: InsertContentMenuControlProps = {
    onInsertImage: insert, className: "host-insertion", style: { marginInlineStart: "8px" },
  };
  render(<Provider><InsertContentMenuControl {...props} ref={ref} /></Provider>);
  const trigger = screen.getByRole("button", { name: "Insert" });
  expect(ref.current).toBe(trigger);
  expect(trigger.classList.contains("host-insertion")).toBe(true);
  expect(trigger.style.marginInlineStart).toBe("8px");
  ref.current?.focus();
  await user.keyboard("{ArrowDown}{Enter}");
  expect(insert).toHaveBeenCalledExactlyOnceWith();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});

it("isolates host callbacks and availability across instances and discards an unmounted open menu", async () => {
  const user = userEvent.setup();
  const image = vi.fn(); const rule = vi.fn();
  function Hosts({ first = true }: { first?: boolean }) {
    return <Provider>
      {first && <section aria-label="Image host"><InsertContentMenuControl onInsertImage={image} /></section>}
      <section aria-label="Rule host"><InsertContentMenuControl onInsertHorizontalRule={rule} /></section>
    </Provider>;
  }
  const view = render(<Hosts />);
  const imageTrigger = within(screen.getByRole("region", { name: "Image host" })).getByRole("button", { name: "Insert" });
  const ruleTrigger = within(screen.getByRole("region", { name: "Rule host" })).getByRole("button", { name: "Insert" });
  await user.click(imageTrigger);
  expect(screen.getByRole("menuitem", { name: "Horizontal Rule" }).getAttribute("aria-disabled")).toBe("true");
  await user.click(screen.getByRole("menuitem", { name: "Image" }));
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  await user.click(ruleTrigger);
  expect(screen.getByRole("menuitem", { name: "Image" }).getAttribute("aria-disabled")).toBe("true");
  await user.click(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(image).toHaveBeenCalledExactlyOnceWith();
  expect(rule).toHaveBeenCalledExactlyOnceWith();
  await user.click(imageTrigger);
  view.rerender(<Hosts first={false} />);
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(image).toHaveBeenCalledTimes(1);
  await user.click(ruleTrigger);
  await user.click(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
  expect(rule).toHaveBeenCalledTimes(2);
  await waitFor(() => expect(document.activeElement).toBe(ruleTrigger));
});
