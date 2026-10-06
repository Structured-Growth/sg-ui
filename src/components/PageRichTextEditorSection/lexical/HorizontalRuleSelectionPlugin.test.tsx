import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COMMAND_PRIORITY_EDITOR,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { HorizontalRuleSelectionPlugin } from "./HorizontalRuleSelectionPlugin";

const {
  registerCommand,
  commandHandlers,
  getSelectionMock,
  isNodeSelectionMock,
  isHorizontalRuleNodeMock,
} = vi.hoisted(() => {
  const handlers = new Map<symbol, () => boolean>();
  return {
    registerCommand: vi.fn((command: symbol, handler: () => boolean) => {
      handlers.set(command, handler);
      return () => undefined;
    }),
    commandHandlers: handlers,
    getSelectionMock: vi.fn(),
    isNodeSelectionMock: vi.fn(),
    isHorizontalRuleNodeMock: vi.fn((node: { type?: string }) => node.type === "hr"),
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
  useLexicalComposerContext: () => [{ registerCommand }],
}));

vi.mock("@lexical/react/LexicalHorizontalRuleNode", () => ({
  $isHorizontalRuleNode: (node: unknown) => isHorizontalRuleNodeMock(node),
}));

vi.mock("lexical", async () => {
  const actual = await vi.importActual<typeof import("lexical")>("lexical");
  return {
    ...actual,
    $getSelection: () => getSelectionMock(),
    $isNodeSelection: (selection: unknown) => isNodeSelectionMock(selection),
  };
});

describe("HorizontalRuleSelectionPlugin", () => {
  beforeEach(() => {
    registerCommand.mockClear();
    commandHandlers.clear();
    getSelectionMock.mockReset();
    isNodeSelectionMock.mockReset();
    isHorizontalRuleNodeMock.mockClear();
  });

  it("registers backspace and delete handlers with editor priority", () => {
    const element = HorizontalRuleSelectionPlugin();
    expect(element).toBeNull();
    expect(registerCommand).toHaveBeenCalledTimes(2);
    expect(registerCommand).toHaveBeenNthCalledWith(
      1,
      KEY_BACKSPACE_COMMAND,
      expect.any(Function),
      COMMAND_PRIORITY_EDITOR,
    );
    expect(registerCommand).toHaveBeenNthCalledWith(
      2,
      KEY_DELETE_COMMAND,
      expect.any(Function),
      COMMAND_PRIORITY_EDITOR,
    );
  });

  it("returns false when selection is not a node selection", () => {
    HorizontalRuleSelectionPlugin();
    const backspaceHandler = commandHandlers.get(KEY_BACKSPACE_COMMAND);
    isNodeSelectionMock.mockReturnValue(false);
    getSelectionMock.mockReturnValue({ kind: "range" });

    expect(backspaceHandler?.()).toBe(false);
  });

  it("returns false when node selection has no horizontal rule nodes", () => {
    HorizontalRuleSelectionPlugin();
    const deleteHandler = commandHandlers.get(KEY_DELETE_COMMAND);
    isNodeSelectionMock.mockReturnValue(true);
    getSelectionMock.mockReturnValue({
      getNodes: () => [{ type: "paragraph" }],
    });

    expect(deleteHandler?.()).toBe(false);
  });

  it("removes selected horizontal rule nodes and returns true", () => {
    HorizontalRuleSelectionPlugin();
    const deleteHandler = commandHandlers.get(KEY_DELETE_COMMAND);
    const removeFirst = vi.fn();
    const removeSecond = vi.fn();
    isNodeSelectionMock.mockReturnValue(true);
    getSelectionMock.mockReturnValue({
      getNodes: () => [
        { type: "paragraph", remove: vi.fn() },
        { type: "hr", remove: removeFirst },
        { type: "hr", remove: removeSecond },
      ],
    });

    expect(deleteHandler?.()).toBe(true);
    expect(removeFirst).toHaveBeenCalledTimes(1);
    expect(removeSecond).toHaveBeenCalledTimes(1);
  });
});
