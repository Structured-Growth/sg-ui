// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUploadModal } from "./ImageUploadModal";
import { Provider } from "../../experimental/Provider/Provider";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
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

describe("ImageUploadModal file and host contracts", () => {
  it("retains a failed upload for retry and sends an optional trimmed image description", async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockRejectedValueOnce(new Error("host rejected")).mockResolvedValueOnce(undefined);
    render(<Provider><ImageUploadModal open enableAltText onClose={vi.fn()} onSubmit={submit} /></Provider>);
    const file = new File(["pixels"], "diagram.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose image"), file);
    await user.type(screen.getByRole("textbox", { name: "Image description" }), "  Enrollment flow  ");
    await user.click(screen.getByRole("button", { name: "Insert" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Image upload failed. Try again."));
    expect(screen.getByText("diagram.png")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Insert" }));
    expect(submit).toHaveBeenNthCalledWith(1, file, "Enrollment flow");
    expect(submit).toHaveBeenNthCalledWith(2, file, "Enrollment flow");
  });

  it("discards file and description on Escape and supports reselection of the same file", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    function Host() {
      const [open, setOpen] = useState(true);
      return <Provider><button onClick={() => setOpen(true)}>Reopen</button>
        <ImageUploadModal open={open} enableAltText onClose={() => setOpen(false)} onSubmit={submit} />
      </Provider>;
    }
    render(<Host />);
    const file = new File(["pixels"], "diagram.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose image"), file);
    await user.type(screen.getByRole("textbox", { name: "Image description" }), "Old description");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await user.click(screen.getByRole("button", { name: "Reopen" }));
    expect((screen.getByRole("textbox", { name: "Image description" }) as HTMLInputElement).value).toBe("");
    expect((screen.getByRole("button", { name: "Insert" }) as HTMLButtonElement).disabled).toBe(true);
    await user.upload(screen.getByLabelText("Choose image"), file);
    await user.click(screen.getByRole("button", { name: "Insert" }));
    expect(submit).toHaveBeenCalledExactlyOnceWith(file, "");
  });

  it("blocks duplicate submission and file replacement until the host promise settles", async () => {
    const user = userEvent.setup(); let resolve!: () => void;
    const submit = vi.fn(() => new Promise<void>(done => { resolve = done; }));
    render(<Provider><ImageUploadModal open onClose={vi.fn()} onSubmit={submit} /></Provider>);
    const file = new File(["pixels"], "diagram.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose image"), file);
    await user.click(screen.getByRole("button", { name: "Insert" }));
    expect((screen.getByRole("button", { name: "Search Files" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Uploading..." }));
    expect(submit).toHaveBeenCalledExactlyOnceWith(file);
    resolve();
    await waitFor(() => expect((screen.getByRole("button", { name: "Insert" }) as HTMLButtonElement).disabled).toBe(false));
  });
});

describe("ImageUploadModal preview and cancellation lifecycle", () => {
  it("rejects non-image drops and revokes previews on replacement, cancellation and unmount", async () => {
    const user = userEvent.setup();
    const create = vi.fn().mockReturnValueOnce("blob:first").mockReturnValueOnce("blob:second").mockReturnValueOnce("blob:third");
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL { static createObjectURL = create; static revokeObjectURL = revoke; });
    const { unmount } = render(<Provider><ImageUploadModal open onClose={vi.fn()} onSubmit={vi.fn()} /></Provider>);
    const zone = screen.getByText("Drag and drop an image here").parentElement!;
    fireEvent.drop(zone, { dataTransfer: { files: [new File(["text"], "notes.txt", { type: "text/plain" })] } });
    expect(screen.getByRole("alert").textContent).toBe("Choose an image file.");
    expect(create).not.toHaveBeenCalled();
    expect((screen.getByRole("button", {name:"Insert"}) as HTMLButtonElement).disabled).toBe(true);
    const first = new File(["image"], "first.png", { type: "image/png" });
    const second = new File(["image"], "second.png", { type: "image/png" });
    fireEvent.drop(zone, { dataTransfer: { files: [first] } });
    expect(screen.getByRole("img", { name: "first.png" }).getAttribute("src")).toBe("blob:first");
    expect(screen.queryByRole("alert")).toBeNull();
    await user.upload(screen.getByLabelText("Choose image"), second);
    expect(revoke).toHaveBeenCalledWith("blob:first");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(revoke).toHaveBeenCalledWith("blob:second");
    await user.upload(screen.getByLabelText("Choose image"), first);
    unmount();
    expect(revoke).toHaveBeenCalledWith("blob:third");
  });

  it("permits a new draft after cancel and ignores a rejected upload from the prior session", async () => {
    const user = userEvent.setup(); let reject!: (reason: Error) => void;
    const submit = vi.fn().mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail; })).mockResolvedValue(undefined);
    function Host() {
      const [open, setOpen] = useState(true);
      return <Provider><button onClick={() => setOpen(true)}>Reopen</button>
        <ImageUploadModal open={open} onClose={() => setOpen(false)} onSubmit={submit} />
      </Provider>;
    }
    render(<Host />);
    const file = new File(["pixels"], "diagram.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose image"), file);
    await user.click(screen.getByRole("button", { name: "Insert" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await user.click(screen.getByRole("button", { name: "Reopen" }));
    await user.upload(screen.getByLabelText("Choose image"), file);
    reject(new Error("old failure"));
    await user.click(screen.getByRole("button", { name: "Insert" }));
    expect(submit).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
