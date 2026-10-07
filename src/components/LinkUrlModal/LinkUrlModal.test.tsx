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
  it.each(["https://", "javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,hello", "vbscript:alert(1)", "ftp://example.org", "//example.org", "https:\\example.org", "java\nscript:alert(1)", "mailto:", "tel:"])("blocks unsafe or malformed URL %s and returns focus to the invalid field", async (value) => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Provider><LinkUrlModal open initialUrl={value} onClose={vi.fn()} onSubmit={submit} /></Provider>);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    const field = screen.getByRole("textbox", { name: "URL" });
    expect(submit).not.toHaveBeenCalled();
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(field);
    expect(screen.getByText("Enter a valid URL using an allowed protocol or a relative path.")).toBeTruthy();
    await user.clear(field); await user.type(field, "https://example.org"); await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "", url: "https://example.org" });
  });

  it.each(["HTTP://example.org/path", "www.example.org", "/courses/guide", "../guide", "#section", "mailto:teacher@example.org", "tel:+15551234567"])("preserves safe host URL %s without normalization", async value => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Provider><LinkUrlModal open initialUrl={value} initialDisplayText="Edit link" onClose={vi.fn()} onSubmit={submit} /></Provider>);
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "Edit link", url: value });
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("lets hosts restrict protocols and relative paths while keeping unlink available", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Provider><LinkUrlModal open initialUrl="/guide" allowedProtocols={["https"]} allowRelativeUrls={false} onClose={vi.fn()} onSubmit={submit} /></Provider>);
    await user.click(screen.getByRole("button", { name: "Apply" })); expect(submit).not.toHaveBeenCalled();
    const url = screen.getByRole("textbox", { name: "URL" });
    await user.clear(url); await user.type(url, "mailto:teacher@example.org"); await user.keyboard("{Enter}");
    expect(submit).not.toHaveBeenCalled();
    await user.clear(url); await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "", url: null });
  });

  it("discards canceled edits and reloads the host values when reopened without a remount", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    function Host() {
      const [open, setOpen] = useState(false);
      return <Provider><button onClick={() => setOpen(true)}>Edit link</button><LinkUrlModal open={open} initialUrl="https://example.org" initialDisplayText="Saved"
        onClose={() => setOpen(false)} onSubmit={submit} /></Provider>;
    }
    render(<Host />);
    await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.type(screen.getByRole("textbox", { name: "Display Text" }), " unsaved");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit link" })));
    await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect((screen.getByRole("textbox", { name: "Display Text" }) as HTMLInputElement).value).toBe("Saved");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith({ displayText: "Saved", url: "https://example.org" });
  });
});
