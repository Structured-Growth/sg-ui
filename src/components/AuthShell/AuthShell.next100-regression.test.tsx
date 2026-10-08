// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthShell, type AuthShellProps } from "./index";
import { AppButton } from "../AppButton";
import { TextField } from "../../experimental/TextField/TextField";
import { Provider } from "../../theme";

afterEach(cleanup);

describe("AuthShell next100 regression", () => {
  it("isolates sibling host forms and preserves the surviving instance across removal and remount", async () => {
    const user = userEvent.setup();
    const firstSubmit = vi.fn();
    const secondSubmit = vi.fn();
    const secondRef = createRef<HTMLDivElement>();
    const secondProps: AuthShellProps = {
      title: "Second school",
      footerContent: <span>Second school support</span>,
      children: <form onSubmit={event => { event.preventDefault(); secondSubmit(); }}>
        <TextField label="Second email" name="email" />
        <AppButton type="submit">Continue second</AppButton>
      </form>,
    };
    function Host({ showFirst }: { showFirst: boolean }) {
      return <Provider>
        {showFirst && <AuthShell key="first" title="First school" footerContent={<span>First school support</span>}>
          <form onSubmit={event => { event.preventDefault(); firstSubmit(); }}>
            <TextField label="First email" name="email" />
            <AppButton type="submit">Continue first</AppButton>
          </form>
        </AuthShell>}
        <AuthShell key="second" ref={secondRef} {...secondProps} />
      </Provider>;
    }
    const { rerender } = render(<Host showFirst />);
    const secondRoot = secondRef.current;
    const secondField = screen.getByRole("textbox", { name: "Second email" });
    await user.type(screen.getByRole("textbox", { name: "First email" }), "first@example.org");
    expect((secondField as HTMLInputElement).value).toBe("");
    await user.type(secondField, "second@example.org");
    rerender(<Host showFirst={false} />);
    expect(secondRef.current).toBe(secondRoot);
    expect(screen.getByRole("textbox", { name: "Second email" })).toBe(secondField);
    expect(document.activeElement).toBe(secondField);
    expect((secondField as HTMLInputElement).value).toBe("second@example.org");
    expect(screen.queryByText("First school support")).toBeNull();
    expect(secondRoot?.contains(screen.getByText("Second school support"))).toBe(true);
    await user.keyboard("{Enter}");
    expect(secondSubmit).toHaveBeenCalledTimes(1);
    expect(firstSubmit).not.toHaveBeenCalled();
    rerender(<Host showFirst />);
    expect((screen.getByRole("textbox", { name: "First email" }) as HTMLInputElement).value).toBe("");
    expect((secondField as HTMLInputElement).value).toBe("second@example.org");
    expect(document.activeElement).toBe(secondField);
  });
});
