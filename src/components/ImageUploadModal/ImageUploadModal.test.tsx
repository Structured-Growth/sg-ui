// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUploadModal } from "./ImageUploadModal";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(cleanup);
describe("ImageUploadModal owned modal composition", () => {
  it("selects a file and inserts through keyboard activation once with focus restoration", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    function Host() {
      const [open, setOpen] = useState(false);
      return <Provider><button onClick={() => setOpen(true)}>Add image</button><ImageUploadModal open={open} onClose={() => setOpen(false)}
        onSubmit={file => { submit(file); setOpen(false); }} /></Provider>;
    }
    render(<Host />);
    await user.click(screen.getByRole("button", { name: "Add image" }));
    expect((screen.getByRole("button", { name: "Insert" }) as HTMLButtonElement).disabled).toBe(true);
    const file = new File(["image pixels"], "course.png", { type: "image/png" });
    const input = screen.getByRole("dialog").querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    expect(screen.getByText("course.png")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    // Reopen after cancellation to verify discarded selection cannot be inserted.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await user.click(screen.getByRole("button", { name: "Add image" }));
    expect((screen.getByRole("button", { name: "Insert" }) as HTMLButtonElement).disabled).toBe(true);
    await user.upload(screen.getByRole("dialog").querySelector('input[type="file"]') as HTMLInputElement, file);
    await user.click(screen.getByRole("button", { name: "Search Files" }));
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
    await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", { name: "Insert" }));
    await user.keyboard(" ");
    expect(submit).toHaveBeenCalledExactlyOnceWith(file);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Add image" })));
  });

  it("blocks Insert while uploading while retaining host error and cancellation behavior", async () => {
    const user = userEvent.setup(); const submit = vi.fn(); const close = vi.fn();
    const { rerender } = render(<Provider><ImageUploadModal open onClose={close} onSubmit={submit} /></Provider>);
    const file = new File(["image pixels"], "course.webp", { type: "image/webp" });
    await user.upload(screen.getByRole("dialog").querySelector('input[type="file"]') as HTMLInputElement, file);
    rerender(<Provider><ImageUploadModal open uploading errorMessage="Host upload failed" onClose={close} onSubmit={submit} /></Provider>);
    const insert = screen.getByRole("button", { name: "Uploading..." });
    expect((insert as HTMLButtonElement).disabled).toBe(true);
    await user.click(insert); expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText("Host upload failed")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(close).toHaveBeenCalledTimes(1); expect(screen.queryByText("course.webp")).toBeNull();
  });
});
