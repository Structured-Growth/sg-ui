// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthShell } from "./AuthShell";
import { AppButton } from "../AppButton";
import { TextField } from "../../experimental/TextField/TextField";
import { Link } from "../../experimental/Link/Link";
import { SGNavigationProvider } from "../../adapters/navigation";

afterEach(cleanup);
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

});
