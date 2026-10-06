import { beforeEach, describe, expect, it, vi } from "vitest";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { ImageInsertPlugin, INSERT_IMAGE_COMMAND } from "./ImageInsertPlugin";

const {
  registerCommand,
  update,
  commandHandlers,
  getSelectionMock,
  isRangeSelectionMock,
  createImageNodeMock,
  createParagraphNodeMock,
  insertedNodes,
} = vi.hoisted(() => {
  const handlers = new Map<unknown, (payload: unknown) => boolean>();
  const inserted: unknown[] = [];
  return {
    registerCommand: vi.fn((command: unknown, handler: (payload: unknown) => boolean) => {
      handlers.set(command, handler);
      return () => undefined;
    }),
    update: vi.fn((callback: () => void) => callback()),
    commandHandlers: handlers,
    getSelectionMock: vi.fn(),
    isRangeSelectionMock: vi.fn(),
    createImageNodeMock: vi.fn((payload: unknown) => ({ kind: "image", payload })),
    createParagraphNodeMock: vi.fn(() => ({ kind: "paragraph" })),
    insertedNodes: inserted,
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      effect();
    },
  };
});

vi.mock("@lexical/react/LexicalComposerContext", () => ({
  useLexicalComposerContext: () => [{ registerCommand, update }],
}));

vi.mock("./ImageNode", () => ({
  $createImageNode: (payload: unknown) => createImageNodeMock(payload),
}));

vi.mock("lexical", async () => {
  const actual = await vi.importActual<typeof import("lexical")>("lexical");
  return {
    ...actual,
    createCommand: (name: string) => Symbol(name),
    $createParagraphNode: () => createParagraphNodeMock(),
    $getSelection: () => getSelectionMock(),
    $isRangeSelection: (selection: unknown) => isRangeSelectionMock(selection),
  };
});

describe("ImageInsertPlugin", () => {
  beforeEach(() => {
    registerCommand.mockClear();
    update.mockClear();
    commandHandlers.clear();
    getSelectionMock.mockReset();
    isRangeSelectionMock.mockReset();
    createImageNodeMock.mockClear();
    createParagraphNodeMock.mockClear();
    insertedNodes.length = 0;
  });

  it("registers image insert command with editor priority", () => {
    const element = ImageInsertPlugin();
    expect(element).toBeNull();
    expect(registerCommand).toHaveBeenCalledTimes(1);
    expect(registerCommand).toHaveBeenCalledWith(
      INSERT_IMAGE_COMMAND,
      expect.any(Function),
      COMMAND_PRIORITY_EDITOR,
    );
  });

  it("returns true and inserts image + trailing paragraph for range selection", () => {
    ImageInsertPlugin();
    const handler = commandHandlers.get(INSERT_IMAGE_COMMAND);
    const selection = {
      insertNodes: vi.fn((nodes: unknown[]) => {
        insertedNodes.push(...nodes);
      }),
    };
    getSelectionMock.mockReturnValue(selection);
    isRangeSelectionMock.mockReturnValue(true);

    const payload = { src: "https://example.com/image.png", altText: "Example" };
    expect(handler?.(payload)).toBe(true);
    expect(update).toHaveBeenCalledTimes(1);
    expect(createImageNodeMock).toHaveBeenCalledWith(payload);
    expect(createParagraphNodeMock).toHaveBeenCalledTimes(1);
    expect(selection.insertNodes).toHaveBeenCalledWith([
      { kind: "image", payload },
      { kind: "paragraph" },
    ]);
  });

  it("returns true and no-ops when selection is not a range selection", () => {
    ImageInsertPlugin();
    const handler = commandHandlers.get(INSERT_IMAGE_COMMAND);
    getSelectionMock.mockReturnValue({ insertNodes: vi.fn() });
    isRangeSelectionMock.mockReturnValue(false);

    expect(handler?.({ src: "x" })).toBe(true);
    expect(createImageNodeMock).not.toHaveBeenCalled();
    expect(createParagraphNodeMock).not.toHaveBeenCalled();
  });
});
