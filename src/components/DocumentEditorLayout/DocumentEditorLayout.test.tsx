// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../../experimental/Button/Button";
import { DocumentEditorLayout } from "./DocumentEditorLayout";

afterEach(cleanup);
describe("DocumentEditorLayout", () => {
  it("keeps menu, toolbar and host content as separate ordered regions", () => {
    const { container, rerender } = render(<DocumentEditorLayout title="Editor" headerRight="header-right" menuBar="menu" toolbar="toolbar">content</DocumentEditorLayout>);
    const root = container.firstElementChild!;
    expect(Array.from(root.children).map(child => child.getAttribute("data-sgui-part"))).toEqual([
      "document-editor-header", "document-editor-menu", "document-editor-toolbar", "document-editor-content",
    ]);
    expect(root.children[0].getAttribute("data-has-menu")).toBe("true");
    expect(screen.getByText("Editor").tagName).toBe("P");
    rerender(<DocumentEditorLayout title="Editor">content</DocumentEditorLayout>);
    expect(root.children).toHaveLength(2);
    expect(root.children[0].hasAttribute("data-has-menu")).toBe(false);
  });

  it("retains custom title semantics and forwards native styling and ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DocumentEditorLayout ref={ref} title="ignored" titleNode={<h2>Custom title</h2>} className="host-layout" style={{ height: 420 }}>content</DocumentEditorLayout>);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Custom title");
    expect(screen.queryByText("ignored")).toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current?.classList.contains("host-layout")).toBe(true);
    expect(ref.current?.style.height).toBe("420px");
  });

  it("preserves keyboard actions across chrome and the host scroll region", async () => {
    const save = vi.fn();
    const user = userEvent.setup();
    render(<DocumentEditorLayout title="Editor" headerRight={<Button onPress={save}>Save</Button>} toolbar={<Button>Format</Button>}>
      <div style={{ overflow: "auto", flex: 1 }}><textarea aria-label="Document text" defaultValue="Draft" /></div>
    </DocumentEditorLayout>);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Save" }));
    await user.keyboard("{Enter}");
    expect(save).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Format" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Document text" }));
  });

  it("retains the focused host node and its refs through slot addition and replacement", () => {
    const layoutRef = createRef<HTMLDivElement>();
    const hostRef = createRef<HTMLDivElement>();
    const content = <div ref={hostRef} style={{ overflow: "auto" }}><button>Host content action</button></div>;
    const view = render(<DocumentEditorLayout ref={layoutRef} title="Editor">{content}</DocumentEditorLayout>);
    const originalLayout = layoutRef.current;
    const originalHost = hostRef.current!;
    const action = screen.getByRole("button", { name: "Host content action" });
    action.focus();
    originalHost.scrollTop = 180;
    for (const mode of ["Draft", "Review", undefined, "Draft"]) {
      view.rerender(<DocumentEditorLayout ref={layoutRef} title="Editor"
        headerRight={mode && <button key={mode}>{mode} action</button>}
        menuBar={mode && <span key={mode}>{mode} menu</span>}
        toolbar={mode && <button key={mode}>{mode} toolbar</button>}>{content}</DocumentEditorLayout>);
      expect(layoutRef.current).toBe(originalLayout);
      expect(hostRef.current).toBe(originalHost);
      expect(document.activeElement).toBe(action);
      expect(originalHost.scrollTop).toBe(180);
    }
  });

  it("renders its slots without browser globals during server rendering", () => {
    expect(renderToString(<DocumentEditorLayout title="Document" menuBar="File" toolbar="Tools">Draft</DocumentEditorLayout>)).toContain('data-sgui-part="document-editor-content"');
  });
});
