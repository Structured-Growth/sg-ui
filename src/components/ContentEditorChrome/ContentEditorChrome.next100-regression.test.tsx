// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { DocumentEditorToolbar } from "../DocumentEditorToolbar";
import { ContentEditorChrome, type ContentEditorChromeProps } from "./ContentEditorChrome";

afterEach(cleanup);

describe("ContentEditorChrome next100 regression", () => {
  it("hands the public anchor to host preparation before a composed toolbar action", async () => {
    const user = userEvent.setup();
    const editor = createRef<HTMLTextAreaElement>();
    const root = createRef<HTMLDivElement>();
    const calls: string[] = [];
    let prepared: string | undefined;
    const props: ContentEditorChromeProps = {
      icon: null, title: "Document", titleReadOnly: true, onTitleSave: vi.fn(),
      rightSlot: <span>Draft</span>,
      menuItems: [{ id: "prepare", label: "Prepare command", onPress: anchor => {
        expect(root.current?.contains(anchor)).toBe(true);
        prepared = editor.current!.value.slice(editor.current!.selectionStart, editor.current!.selectionEnd);
        calls.push("prepare");
        editor.current!.focus();
      } }],
    };
    render(<Provider><ContentEditorChrome ref={root} {...props} />
      <DocumentEditorToolbar canEdit headingValue="normal" actions={{ bold: { active: false, onClick: () => {
        calls.push(`bold:${prepared}`);
      } }, italic: { active: false }, bulletList: { active: false }, orderedList: { active: false } }} />
      <textarea ref={editor} aria-label="Host document" defaultValue="Host selection" />
    </Provider>);
    editor.current!.setSelectionRange(0, 4);
    await user.click(screen.getByRole("button", { name: "Prepare command" }));
    expect(document.activeElement).toBe(editor.current);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(calls).toEqual(["prepare", "bold:Host"]);
    expect(screen.getByText("Draft")).toBeTruthy();
  });

  it("isolates title drafts and anchors through sibling removal and remount", async () => {
    const user = userEvent.setup();
    const leftSave = vi.fn(); const rightSave = vi.fn();
    const leftPress = vi.fn(); const rightPress = vi.fn();
    function Host({ side }: { side: "left" | "right" }) {
      const [title, setTitle] = useState(side);
      return <ContentEditorChrome aria-label={`${side} chrome`} icon={null} title={title}
        onTitleSave={next => { (side === "left" ? leftSave : rightSave)(next); setTitle(next); }}
        menuItems={[{ id: "file", label: "File", onPress: side === "left" ? leftPress : rightPress }]} />;
    }
    function Pair({ left }: { left: boolean }) {
      return <Provider>{left && <Host key="left" side="left" />}<Host key="right" side="right" /></Provider>;
    }
    const { rerender } = render(<Pair left />);
    const left = within(screen.getByLabelText("left chrome"));
    const rightRoot = screen.getByLabelText("right chrome");
    const right = within(rightRoot);
    const rightAnchor = right.getByRole("button", { name: "File" });
    await user.click(left.getByRole("button", { name: "Edit title" }));
    const input = left.getByRole("textbox", { name: "Document title" });
    await user.clear(input); await user.type(input, "Left changed{Enter}");
    expect(leftSave).toHaveBeenCalledExactlyOnceWith("Left changed");
    expect(rightSave).not.toHaveBeenCalled();
    expect(right.getByRole("heading").textContent).toBe("right");
    rerender(<Pair left={false} />);
    expect(screen.getByLabelText("right chrome")).toBe(rightRoot);
    await user.click(rightAnchor);
    expect(rightPress).toHaveBeenCalledExactlyOnceWith(rightAnchor);
    expect(leftPress).not.toHaveBeenCalled();
    rerender(<Pair left />);
    expect(within(screen.getByLabelText("left chrome")).getByRole("heading").textContent).toBe("left");
    expect(right.getByRole("button", { name: "File" })).toBe(rightAnchor);
  });
});
