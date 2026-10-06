// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LinkUrlModal } from "./LinkUrlModal";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);
describe("LinkUrlModal owned modal composition", () => {
  it("applies trimmed host values once from the keyboard and restores trigger focus", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    function Host() {
      const [open, setOpen] = useState(false);
      return <Provider><button onClick={() => setOpen(true)}>Add link</button><LinkUrlModal open={open} onClose={() => setOpen(false)}
        onSubmit={payload => { submit(payload); setOpen(false); }} /></Provider>;
    }
    render(<Host />);
    await user.click(screen.getByRole("button", { name: "Add link" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Display Text" })));
    await user.type(screen.getByRole("textbox", { name: "Display Text" }), "  Course guide  ");
    await user.tab(); await user.type(screen.getByRole("textbox", { name: "URL" }), "  https://example.org/course  ");
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Apply" }));
    await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "Course guide", url: "https://example.org/course" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Add link" })));
  });

  it("preserves URL Enter submission and maps a whitespace-only URL to null", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Provider><LinkUrlModal open initialDisplayText="  Plain text  " initialUrl="   " onClose={vi.fn()} onSubmit={submit} /></Provider>);
    await user.click(screen.getByRole("textbox", { name: "URL" })); await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "Plain text", url: null });
  });

  it("cancels without applying edited values", async () => {
    const user = userEvent.setup(); const submit = vi.fn(); const close = vi.fn();
    render(<Provider><LinkUrlModal open onClose={close} onSubmit={submit} /></Provider>);
    await user.type(screen.getByRole("textbox", { name: "Display Text" }), "discard this");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(close).toHaveBeenCalledTimes(1); expect(submit).not.toHaveBeenCalled();
  });
});
