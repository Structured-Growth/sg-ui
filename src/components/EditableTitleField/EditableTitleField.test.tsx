// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { EditableTitleField } from "./EditableTitleField";
afterEach(cleanup);
async function edit(user: ReturnType<typeof userEvent.setup>, value: string) {
  await user.click(screen.getByRole("button", { name: "Edit title" }));
  const input = screen.getByRole("textbox", { name: "Document title" });
  expect(document.activeElement).toBe(input);
  await user.clear(input); await user.type(input, value); return input;
}
it("saves a trimmed title on Enter once, preserving native focus on the edit button", async () => {
 const user = userEvent.setup(); const onSave = vi.fn(); render(<EditableTitleField title="Old title" onSave={onSave} />);
 await edit(user, " New title "); await user.keyboard("{Enter}");
 expect(onSave).toHaveBeenCalledExactlyOnceWith("New title"); expect(screen.queryByRole("textbox")).toBeNull();
 await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit title" })));
});
it("saves on blur and retains focus on the next host control", async () => {
 const user = userEvent.setup(); const onSave = vi.fn(); render(<><EditableTitleField title="Old" onSave={onSave} /><button>Next</button></>);
 await edit(user, "New"); await user.tab(); expect(onSave).toHaveBeenCalledExactlyOnceWith("New");
 expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next" }));
});
it("restores focus after an asynchronous Enter save unless the host moved focus", async () => {
 let resolve!: () => void;
 const onSave = vi.fn(() => new Promise<void>(done => { resolve = done; }));
 const user = userEvent.setup(); render(<><EditableTitleField title="Old" onSave={onSave} /><button>Next</button></>);
 await edit(user, "New"); await user.keyboard("{Enter}");
 await act(async () => { resolve(); });
 await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit title" })));
 await edit(user, "Another title"); await user.keyboard("{Enter}");
 await user.click(screen.getByRole("button", { name: "Next" }));
 await act(async () => { resolve(); });
 expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next" }));
 expect(onSave).toHaveBeenCalledTimes(2);
});
it("cancels on Escape without a blur save and starts a fresh draft from the latest host title", async () => {
 const user = userEvent.setup(); const onSave = vi.fn(); const view = render(<EditableTitleField title="Old" onSave={onSave} />);
 await edit(user, "Discard"); await user.keyboard("{Escape}"); expect(onSave).not.toHaveBeenCalled();
 expect(document.activeElement).toBe(screen.getByRole("button"));
 view.rerender(<EditableTitleField title="Host updated" onSave={onSave} />);
 await user.click(screen.getByRole("button")); expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Host updated");
});
it("does not save empty or unchanged drafts", async () => {
 const user = userEvent.setup(); const onSave = vi.fn(); render(<EditableTitleField title="Old" onSave={onSave} />);
 await edit(user, " "); await user.keyboard("{Enter}"); expect(onSave).not.toHaveBeenCalled();
 await edit(user, " Old "); await user.keyboard("{Enter}"); expect(onSave).not.toHaveBeenCalled();
});
it("prevents duplicate saves while pending and allows safe cancellation", async () => {
 let resolve!: () => void; const onSave = vi.fn(() => new Promise<void>(done => { resolve = done; }));
 const user = userEvent.setup(); render(<EditableTitleField title="Old" onSave={onSave} />);
 const input = await edit(user, "New"); await user.keyboard("{Enter}{Enter}"); expect(onSave).toHaveBeenCalledTimes(1);
 expect((input as HTMLInputElement).readOnly).toBe(true); expect(screen.getByText("Saving title…")).toBeDefined();
 await user.keyboard("{Escape}"); expect(screen.queryByRole("textbox")).toBeNull();
 expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit title Pending" }));
 await act(async () => { resolve(); }); expect(screen.getByRole("button").hasAttribute("disabled")).toBe(false);
});
it("handles rejected host persistence with an accessible error, keeps draft and supports retry", async () => {
 const user = userEvent.setup(); const onSave = vi.fn().mockRejectedValueOnce(new Error("Failure")).mockResolvedValueOnce(undefined);
 render(<EditableTitleField title="Old" onSave={onSave} />); const input = await edit(user, "New");
 await user.keyboard("{Enter}"); await waitFor(() => expect(screen.getByText("Could not save title. Try again.")).toBeDefined());
 expect((input as HTMLInputElement).value).toBe("New"); expect(input.getAttribute("aria-invalid")).toBe("true");
 expect(input.getAttribute("aria-describedby")).toContain(screen.getByText("Could not save title. Try again.").id);
 await user.keyboard("{Enter}"); expect(onSave).toHaveBeenCalledTimes(2); expect(screen.queryByRole("textbox")).toBeNull();
});
it("does not edit read-only titles and retains translated fallback and heading semantics", async () => {
 const onSave = vi.fn(); render(<EditableTitleField title="" readOnly onSave={onSave} variant="h5" />);
 const heading = screen.getByRole("heading", { name: "Untitled document", level: 5 }); await userEvent.click(heading);
 expect(screen.queryByRole("textbox")).toBeNull(); expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true); expect(onSave).not.toHaveBeenCalled();
});
it("supports title pointer entry and ignores composing Enter events", async () => {
 const user = userEvent.setup(); const onSave = vi.fn(); render(<EditableTitleField title="Old" onSave={onSave} />);
 await user.click(screen.getByRole("heading")); const input = screen.getByRole("textbox"); await user.clear(input); await user.type(input, "新");
 fireEvent.keyDown(input, { key: "Enter", isComposing: true }); expect(onSave).not.toHaveBeenCalled(); expect(screen.getByRole("textbox")).toBeDefined();
});

it("honors host read-only changes after rejection without losing the draft or requesting another save", async () => {
 const user = userEvent.setup(); const onSave = vi.fn().mockRejectedValue(new Error("Failure"));
 const view = render(<><EditableTitleField title="Old" onSave={onSave} /><button>Next</button></>);
 const input = await edit(user, "Retry draft"); await user.keyboard("{Enter}");
 await screen.findByText("Could not save title. Try again.");
 view.rerender(<><EditableTitleField title="Host title" readOnly onSave={onSave} /><button>Next</button></>);
 expect((input as HTMLInputElement).readOnly).toBe(true);
 await user.type(input, " forbidden"); await user.keyboard("{Enter}"); await user.tab();
 expect((input as HTMLInputElement).value).toBe("Retry draft"); expect(onSave).toHaveBeenCalledTimes(1);
 await user.click(input); await user.keyboard("{Escape}");
 expect(screen.queryByRole("textbox")).toBeNull();
 expect(screen.getByRole("heading", { name: "Host title" })).toBeDefined();
 expect(onSave).toHaveBeenCalledTimes(1);
});
