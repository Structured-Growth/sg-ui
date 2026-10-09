// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LinkUrlModal, type LinkUrlModalProps } from "./index";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);

it("isolates sibling link drafts and callbacks and resets submission state after remount", async () => {
  const user = userEvent.setup();
  const firstSubmit = vi.fn<LinkUrlModalProps["onSubmit"]>();
  const secondSubmit = vi.fn<LinkUrlModalProps["onSubmit"]>();
  function Host() {
    const [active, setActive] = useState<"first" | "second" | null>(null);
    const [secondMounted, setSecondMounted] = useState(true);
    return <Provider>
      <button onClick={() => setActive("first")}>Edit first</button>
      <button onClick={() => setActive("second")}>Edit second</button>
      <button onClick={() => setSecondMounted(value => !value)}>Toggle second</button>
      <LinkUrlModal open={active === "first"} initialDisplayText="First" initialUrl="/first"
        onClose={() => setActive(null)} onSubmit={firstSubmit} />
      {secondMounted && <LinkUrlModal open={active === "second"} initialDisplayText="Second" initialUrl="/second"
        onClose={() => setActive(null)} onSubmit={secondSubmit} />}
    </Provider>;
  }
  render(<Host />);
  const close = async () => {
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  };

  await user.click(screen.getByRole("button", { name: "Edit first" }));
  await user.type(screen.getByRole("textbox", { name: "Display Text" }), " draft");
  await user.clear(screen.getByRole("textbox", { name: "URL" }));
  await user.type(screen.getByRole("textbox", { name: "URL" }), "javascript:alert(1)");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(screen.getByRole("textbox", { name: "URL" }).getAttribute("aria-invalid")).toBe("true");
  await close();
  expect(firstSubmit).not.toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "Edit second" }));
  expect((screen.getByRole("textbox", { name: "Display Text" }) as HTMLInputElement).value).toBe("Second");
  expect(screen.getByRole("textbox", { name: "URL" }).getAttribute("aria-invalid")).not.toBe("true");
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(secondSubmit).toHaveBeenCalledExactlyOnceWith({ displayText: "Second", url: "/second" });
  await close();

  await user.click(screen.getByRole("button", { name: "Edit first" }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(firstSubmit).toHaveBeenCalledExactlyOnceWith({ displayText: "First", url: "/first" });
  expect(secondSubmit).toHaveBeenCalledTimes(1);
  await close();

  await user.click(screen.getByRole("button", { name: "Toggle second" }));
  await user.click(screen.getByRole("button", { name: "Toggle second" }));
  await user.click(screen.getByRole("button", { name: "Edit second" }));
  await user.click(screen.getByRole("button", { name: "Apply" }));
  expect(secondSubmit).toHaveBeenCalledTimes(2);
  expect(secondSubmit).toHaveBeenLastCalledWith({ displayText: "Second", url: "/second" });
  expect(firstSubmit).toHaveBeenCalledTimes(1);
});
