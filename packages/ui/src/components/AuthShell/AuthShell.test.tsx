// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthShell } from "./AuthShell";
import { AppButton } from "../AppButton";
import { TextField } from "../../experimental/TextField/TextField";
import { Link } from "../../experimental/Link/Link";
import { SGNavigationProvider } from "../../adapters/navigation";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("AuthShell", () => {
  it("preserves host sections, heading semantics and native root customization", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AuthShell ref={ref} title="Sign In" subtitle="Use your credentials" footerContent="footer" className="host-shell" style={{ maxWidth: 900 }}>form</AuthShell>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Sign In");
    expect(screen.getByText("Use your credentials").getAttribute("data-tone")).toBe("muted");
    expect(screen.getByText("form").getAttribute("data-sgui-part")).toBe("auth-shell-content");
    expect(screen.getByText("footer").getAttribute("data-sgui-part")).toBe("auth-shell-footer");
    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current?.classList.contains("host-shell")).toBe(true);
    expect(ref.current?.style.maxWidth).toBe("900px");
  });

  it("omits optional sections and rerenders host content without remounting fields", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<AuthShell title="Sign In"><TextField label="Email" /></AuthShell>);
    await user.type(screen.getByRole("textbox"), "student@example.org");
    rerender(<AuthShell title="Continue"><TextField label="Email" /></AuthShell>);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("student@example.org");
    expect(container.querySelector('[data-sgui-part="auth-shell-footer"]')).toBeNull();
    expect(screen.getByRole("heading").textContent).toBe("Continue");
  });

  it("keeps keyboard submission and footer routing under host control", async () => {
    const user = userEvent.setup(); const submit = vi.fn(); const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/login", navigate }}><AuthShell title="Sign In" footerContent={<Link href="/help">Help</Link>}>
      <form onSubmit={event => { event.preventDefault(); submit(new FormData(event.currentTarget).get("email")); }}>
        <TextField label="Email" name="email" type="email" required /><AppButton type="submit">Continue</AppButton>
      </form>
    </AuthShell></SGNavigationProvider>);
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "student@example.org"); await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledExactlyOnceWith("student@example.org");
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Continue" }));
    await user.tab(); await user.keyboard("{Enter}");
    expect(navigate).toHaveBeenCalledExactlyOnceWith("/help", { replace: undefined });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("preserves native focus and independent host forms when shell sections change", async () => {
    const user = userEvent.setup();
    const submit = vi.fn(); const footerSubmit = vi.fn();
    const content = <form aria-label="Host form" onSubmit={event => { event.preventDefault(); submit(); }}>
      <TextField label="School name" /><AppButton type="submit">Continue</AppButton>
    </form>;
    const footer = <form aria-label="Host support" onSubmit={event => { event.preventDefault(); footerSubmit(); }}>
      <AppButton type="submit">Request support</AppButton>
    </form>;
    const { rerender } = render(<AuthShell title="Continue">{content}</AuthShell>);
    const input = screen.getByRole("textbox", { name: "School name" });
    await user.type(input, "School with a long name");
    rerender(<AuthShell title="A longer heading" subtitle="Host information" footerContent={footer}>{content}</AuthShell>);
    expect(screen.getByRole("textbox")).toBe(input);
    expect(document.activeElement).toBe(input);
    expect((input as HTMLInputElement).value).toBe("School with a long name");
    await user.keyboard("{Enter}");
    expect(submit).toHaveBeenCalledTimes(1);
    expect(footerSubmit).not.toHaveBeenCalled();
    await user.tab(); await user.tab(); await user.keyboard("{Enter}");
    expect(footerSubmit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("form", { name: "Host support" }).closest('[data-sgui-part="auth-shell-footer"]')).not.toBeNull();
  });


  it("reveals a clipped native control after focus settles, but leaves visible controls alone", () => {
    const callbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callbacks.push(callback); return callbacks.length; });
    render(<AuthShell title="Host form"><TextField label="School" /></AuthShell>);
    const input = screen.getByRole("textbox");
    const scroll = vi.fn();
    Object.defineProperty(input, "scrollIntoView", { value: scroll });
    vi.spyOn(input, "getBoundingClientRect").mockReturnValue({ top: 760, bottom: 804, left: 10, right: 210, width: 200, height: 44, x: 10, y: 760, toJSON() {} });
    act(() => input.focus());
    callbacks.shift()!(0);
    expect(scroll).toHaveBeenCalledExactlyOnceWith({ block: "nearest", inline: "nearest" });
    act(() => input.blur());
    vi.mocked(input.getBoundingClientRect).mockReturnValue({ top: 20, bottom: 64, left: 10, right: 210, width: 200, height: 44, x: 10, y: 20, toJSON() {} });
    act(() => input.focus());
    callbacks.shift()!(0);
    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it("does not scroll stale focus, removed controls or nested dialogs", () => {
    const callbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callbacks.push(callback); return callbacks.length; });
    const { unmount } = render(<AuthShell title="Host form"><TextField label="School" /><div role="dialog" aria-label="Host dialog"><TextField label="Dialog field" /></div></AuthShell>);
    const input = screen.getByRole("textbox", { name: "School" });
    const nested = screen.getByRole("textbox", { name: "Dialog field" });
    const scroll = vi.fn(); Object.defineProperty(input, "scrollIntoView", { value: scroll });
    act(() => input.focus()); act(() => nested.focus());
    expect(callbacks).toHaveLength(1);
    callbacks.shift()!(0); expect(scroll).not.toHaveBeenCalled();
    act(() => input.focus()); unmount();
    callbacks.shift()!(0); expect(scroll).not.toHaveBeenCalled();
  });

  it("retains controlled native entry as the embedded host replaces guidance and footer", async () => {
    const user = userEvent.setup();
    function Host() {
      const [value, setValue] = useState("");
      const updated = value.length >= 8;
      return <><AppButton>Before embedded form</AppButton><div style={{ height: 300, overflow: "auto" }}><AuthShell
        style={{ minBlockSize: "100%" }} title={updated ? "Continue entry" : "School sign in"}
        subtitle={updated ? "Updated host guidance" : "Initial host guidance"}
        footerContent={<Link href="#support">{updated ? "Updated support" : "School support"}</Link>}>
        <TextField label="School email" value={value} onValueChange={setValue} />
      </AuthShell></div></>;
    }
    render(<Host />);
    const field = screen.getByRole("textbox", { name: "School email" });
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Before embedded form" }));
    await user.tab();
    await user.keyboard("student@example.org");
    expect(screen.getByRole("textbox")).toBe(field);
    expect(document.activeElement).toBe(field);
    expect((field as HTMLInputElement).value).toBe("student@example.org");
    expect(screen.getByRole("heading").textContent).toBe("Continue entry");
    expect(screen.getByText("Updated host guidance")).toBeTruthy();
    expect(screen.getByRole("link").textContent).toBe("Updated support");
  });

});
