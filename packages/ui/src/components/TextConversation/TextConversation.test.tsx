// @vitest-environment jsdom
import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {it, expect, vi} from "vitest";
import {TextConversation} from "./TextConversation";
it("sends once and clears the accepted draft", async () => {
  const send = vi.fn(); const user = userEvent.setup();
  render(<TextConversation title="Support" messages={[]} onSend={send}/>);
  await user.type(screen.getByRole("textbox",{name:"Message"}),"Hello"); await user.click(screen.getByRole("button",{name:"Send"}));
  await waitFor(() => expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("")); expect(send).toHaveBeenCalledExactlyOnceWith("Hello");
});
it("retains failed drafts and allows retry", async () => {
  const send = vi.fn().mockRejectedValueOnce(Error("Offline")).mockResolvedValueOnce(undefined); const user = userEvent.setup();
  render(<TextConversation title="Support" messages={[]} onSend={send} defaultDraft="Please help"/>);
  await user.click(screen.getByRole("button",{name:"Send"})); await screen.findByRole("alert");
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Please help");
  await user.click(screen.getByRole("button",{name:"Send"})); await waitFor(() => expect(screen.queryByRole("alert")).toBeNull()); expect(send).toHaveBeenCalledTimes(2);
});
it("renders a read-only transcript without a composer", () => {
  render(<TextConversation title="History" messages={[{id:"1",author:"Agent",text:"Hello",direction:"incoming"}]} onSend={vi.fn()} readOnly/>);
  expect(screen.getByRole("log",{name:"History"}).textContent).toContain("Agent"); expect(screen.queryByRole("textbox")).toBeNull();
});

afterEach(cleanup);
