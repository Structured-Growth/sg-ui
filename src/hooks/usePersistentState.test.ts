import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePersistentState } from "./usePersistentState";

const {
  useSyncExternalStoreImpl,
} = vi.hoisted(() => ({
  useSyncExternalStoreImpl: vi.fn((
    subscribe: (cb: () => void) => () => void,
    getSnapshot: () => unknown,
    getServerSnapshot?: () => unknown,
  ) => {
    subscribe(() => undefined);
    getServerSnapshot?.();
    return getSnapshot();
  }),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useCallback: <T,>(fn: T) => fn,
    useEffect: (effect: () => void | (() => void)) => {
      effect();
    },
    useRef: <T,>(value: T) => ({ current: value }),
    useSyncExternalStore: (...args: unknown[]) => useSyncExternalStoreImpl(...args),
  };
});

type LocalStorageMap = Record<string, string>;

const createWindowStub = (initialStorage: LocalStorageMap = {}) => {
  const storage: LocalStorageMap = { ...initialStorage };
  const listeners = new Map<string, Set<(event: Event) => void>>();
  let dispatchCount = 0;

  const windowStub = {
    localStorage: {
      getItem: (key: string) => (Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null),
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
    },
    addEventListener: (name: string, handler: (event: Event) => void) => {
      const set = listeners.get(name) ?? new Set();
      set.add(handler);
      listeners.set(name, set);
    },
    removeEventListener: (name: string, handler: (event: Event) => void) => {
      listeners.get(name)?.delete(handler);
    },
    dispatchEvent: (event: Event) => {
      dispatchCount += 1;
      listeners.get(event.type)?.forEach((handler) => handler(event));
      return true;
    },
  };

  return {
    storage,
    windowStub,
    getDispatchCount: () => dispatchCount,
    emitStorage: (key: string) => {
      windowStub.dispatchEvent({ type: "storage", key } as unknown as Event);
    },
    emitPersistentChange: (key: string) => {
      windowStub.dispatchEvent(new CustomEvent("persistent-state-change", { detail: { key } }));
    },
  };
};

describe("usePersistentState", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    useSyncExternalStoreImpl.mockReset();
    useSyncExternalStoreImpl.mockImplementation((
      subscribe: (cb: () => void) => () => void,
      getSnapshot: () => unknown,
      getServerSnapshot?: () => unknown,
    ) => {
      const unsubscribe = subscribe(() => undefined);
      unsubscribe();
      getServerSnapshot?.();
      return getSnapshot();
    });
    vi.stubGlobal(
      "CustomEvent",
      class MockCustomEvent extends Event {
        detail: unknown;

        constructor(type: string, init?: CustomEventInit<unknown>) {
          super(type);
          this.detail = init?.detail;
        }
      } as unknown as typeof CustomEvent,
    );
  });

  it("reads existing JSON and writes updated values", () => {
    const { storage, windowStub, getDispatchCount } = createWindowStub({ key: JSON.stringify({ count: 1 }) });
    vi.stubGlobal("window", windowStub as unknown as Window);

    const [value, setValue] = usePersistentState("key", { count: 0 }, { storage: "local" });
    expect(value).toEqual({ count: 1 });

    setValue((previous) => ({ count: previous.count + 1 }));
    expect(storage.key).toBe(JSON.stringify({ count: 2 }));
    expect(getDispatchCount()).toBe(1);

    setValue({ count: 2 });
    expect(getDispatchCount()).toBe(1);
  });

  it("falls back to initial value when storage parsing fails", () => {
    const { windowStub } = createWindowStub({ broken: "{invalid-json" });
    vi.stubGlobal("window", windowStub as unknown as Window);

    const [value] = usePersistentState("broken", { safe: true }, { storage: "local" });
    expect(value).toEqual({ safe: true });
  });

  it("handles null/cached snapshots after a previous stored value", () => {
    const { storage, windowStub } = createWindowStub({ key: JSON.stringify({ count: 1 }) });
    vi.stubGlobal("window", windowStub as unknown as Window);

    useSyncExternalStoreImpl.mockImplementation((subscribe: (cb: () => void) => () => void, getSnapshot: () => unknown) => {
      subscribe(() => undefined);
      const first = getSnapshot();
      expect(first).toEqual({ count: 1 });
      delete storage.key;
      const second = getSnapshot();
      expect(second).toEqual({ count: 0 });
      const third = getSnapshot();
      expect(third).toEqual({ count: 0 });
      return third;
    });

    const [value] = usePersistentState("key", { count: 0 }, { storage: "local" });
    expect(value).toEqual({ count: 0 });
  });

  it("reuses cached parsed value when raw storage value is unchanged", () => {
    const { windowStub } = createWindowStub({ key: JSON.stringify({ count: 5 }) });
    vi.stubGlobal("window", windowStub as unknown as Window);

    useSyncExternalStoreImpl.mockImplementation((subscribe: (cb: () => void) => () => void, getSnapshot: () => unknown) => {
      subscribe(() => undefined);
      const first = getSnapshot();
      const second = getSnapshot();
      expect(first).toEqual({ count: 5 });
      expect(second).toEqual({ count: 5 });
      return second;
    });

    const [value] = usePersistentState("key", { count: 0 }, { storage: "local" });
    expect(value).toEqual({ count: 5 });
  });

  it("invokes storage listener callback only for matching key", () => {
    const { windowStub, emitStorage, emitPersistentChange } = createWindowStub({ key: JSON.stringify({ count: 1 }) });
    vi.stubGlobal("window", windowStub as unknown as Window);

    const subscriber = vi.fn();
    useSyncExternalStoreImpl.mockImplementation((subscribe: (cb: () => void) => () => void, getSnapshot: () => unknown) => {
      subscribe(subscriber);
      emitStorage("different");
      emitStorage("key");
      emitPersistentChange("other");
      emitPersistentChange("key");
      return getSnapshot();
    });

    usePersistentState("key", { count: 0 }, { storage: "local" });
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it("uses initial value when readValue has no stored key", () => {
    const { storage, windowStub } = createWindowStub();
    vi.stubGlobal("window", windowStub as unknown as Window);

    const [, setValue] = usePersistentState("missing", { count: 4 }, { storage: "local" });
    setValue((previous) => ({ count: previous.count + 1 }));
    expect(storage.missing).toBe(JSON.stringify({ count: 5 }));
  });

  it("falls back to initial value when readValue parsing fails during setValue", () => {
    const { storage, windowStub } = createWindowStub({ bad: "{bad-json" });
    vi.stubGlobal("window", windowStub as unknown as Window);

    const [, setValue] = usePersistentState("bad", { count: 10 }, { storage: "local" });
    setValue((previous) => ({ count: previous.count + 2 }));
    expect(storage.bad).toBe(JSON.stringify({ count: 12 }));
  });

  it("returns initial value and no-ops setter when window is unavailable", () => {
    const [value, setValue] = usePersistentState("missing-window", { safe: true });
    expect(value).toEqual({ safe: true });
    expect(() => setValue({ safe: false })).not.toThrow();
  });
});
